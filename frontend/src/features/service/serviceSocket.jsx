// src/features/service/serviceSocket.js
import {
  socketUpsertRequest,
  socketStatusChanged,
  socketEstimateUpdated,
  socketMechanicAssigned,
  socketNoteAdded,
} from "./serviceSlice";

/**
 * Bind all service-related socket events to redux.
 * Guarded so we don't attach duplicate handlers on re-renders.
 */
export function bindServiceSocket(socket, dispatch) {
  if (!socket || socket.__serviceEventsBound) return;
  socket.__serviceEventsBound = true;

  // Created
  socket.on("request:created", (p) => {
    // we only know id here; optimistic upsert (list will refetch on focus)
    dispatch(socketUpsertRequest({ id: p.id }));
  });

  // Accepted / Rejected
  socket.on("request:accepted", (p) => {
    dispatch(socketStatusChanged({ id: p.id, toStatus: "PROVIDER_ACCEPTED" }));
  });

  socket.on("request:rejected", (p) => {
    dispatch(socketStatusChanged({ id: p.id, toStatus: "REJECTED" }));
  });

  // Mechanic assigned
  socket.on("request:mechanic_assigned", (p) => {
    dispatch(socketMechanicAssigned({ id: p.id, mechanicId: p.mechanicId }));
  });

  // Estimate flow
  socket.on("request:estimate_updated", (p) => {
    dispatch(socketEstimateUpdated({ id: p.id, amount: p.amount }));
  });

  socket.on("request:estimate_approved", (p) => {
    dispatch(socketStatusChanged({ id: p.id, toStatus: "ESTIMATE_APPROVED" }));
  });

  // Status changed (generic)
  socket.on("request:status_changed", (p) => {
    dispatch(socketStatusChanged({ id: p.id, toStatus: p.toStatus }));
  });

  // Notes
  socket.on("request:note_added", (p) => {
    dispatch(socketNoteAdded({ id: p.id }));
  });

  // Optional diagnostics
  socket.on("connect_error", (err) => {
    // eslint-disable-next-line no-console
    console.warn("[socket] connect_error:", err?.message || err);
  });
}
