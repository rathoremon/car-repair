// src/components/SocketBinder.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSocket, joinRooms } from "../hooks/useSocket";
import { bindServiceSocket } from "../features/service/serviceSocket";

/**
 * Mount this once after auth is ready.
 * - Connects socket
 * - Joins user/provider/mechanic rooms
 * - Binds service events → redux
 */
export default function SocketBinder() {
  const dispatch = useDispatch();
  const socket = useSocket();

  const { token, hydrated, user, role } = useSelector((s) => s.auth);

  useEffect(() => {
    if (!socket) return;
    // Only bind after we know who the user is
    if (!token || !hydrated || !user) return;

    // Join applicable rooms
    joinRooms(socket, {
      userId: user?.id,
      providerId: user?.provider?.id || null,
      mechanicId: user?.mechanic?.id || null,
    });

    // Bind service module socket listeners → redux
    bindServiceSocket(socket, dispatch);

    // No cleanup needed; connection stays for the app lifetime
  }, [socket, token, hydrated, user, role, dispatch]);

  return null;
}
