// src/hooks/useSocket.js
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

/**
 * Keep a single socket instance for the whole app.
 * Auto-rejoin last rooms on reconnect.
 */
let socketSingleton = null;

export function useSocket() {
  const ref = useRef(socketSingleton);

  useEffect(() => {
    if (!ref.current) {
      const token = localStorage.getItem("token");
      ref.current = io(
        import.meta.env.VITE_SOCKET_URL || "http://localhost:5000",
        {
          withCredentials: true,
          transports: ["websocket"],
          auth: token ? { token } : undefined,
        }
      );

      ref.current.on("connect", () => {
        console.log("[socket] connected:", ref.current.id);
        const roomsPayload = ref.current.__lastRoomsPayload;
        if (roomsPayload) ref.current.emit("join", roomsPayload);
      });
      ref.current.on("reconnect", (attempt) =>
        console.log("[socket] reconnect", attempt)
      );

      socketSingleton = ref.current;
    }
    return () => {
      // keep socket for app lifetime
    };
  }, []);

  return ref.current;
}

/**
 * Join user/provider/mechanic/request rooms.
 * Cache payload to rejoin on reconnect.
 */
export function joinRooms(
  socket,
  { userId, providerId, mechanicId, requestId }
) {
  if (!socket) return;
  const payload = { userId, providerId, mechanicId, requestId };
  socket.__lastRoomsPayload = payload;
  socket.emit("join", payload);
}

export function clearJoinedRooms(socket) {
  if (!socket) return;
  socket.__lastRoomsPayload = null;
}
