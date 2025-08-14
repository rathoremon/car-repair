import { createSlice } from "@reduxjs/toolkit";
import {
  fetchRequests,
  fetchRequestById,
  createRequest,
  acceptRequest,
  rejectRequest,
  assignMechanic,
  setEstimate,
  approveEstimate,
  updateStatus,
  addNote,
  fetchTimeline,
} from "./serviceThunks";

const upsertMany = (state, items) => {
  items.forEach((it) => {
    state.byId[it.id] = { ...(state.byId[it.id] || {}), ...it };
  });
};

const initialState = {
  byId: {},
  list: {
    ids: [],
    nextCursor: null,
    loading: false,
    error: null,
    filters: { status: null },
  },
  details: { loading: false, error: null },
  create: { loading: false, error: null },
  timelines: {},
};

const serviceSlice = createSlice({
  name: "service",
  initialState,
  reducers: {
    socketUpsertRequest(state, { payload }) {
      const req = payload;
      state.byId[req.id] = { ...(state.byId[req.id] || {}), ...req };
      if (!state.list.ids.includes(req.id)) state.list.ids.unshift(req.id);
    },
    socketStatusChanged(state, { payload }) {
      const { id, toStatus } = payload;
      if (state.byId[id]) state.byId[id].status = toStatus;
    },
    socketEstimateUpdated(state, { payload }) {
      const { id, amount } = payload;
      if (state.byId[id]) {
        state.byId[id].estimateAmount = amount;
        state.byId[id].status = "AWAITING_ESTIMATE_APPROVAL";
      }
    },
    socketMechanicAssigned(state, { payload }) {
      const { id, mechanicId } = payload;
      if (state.byId[id]) {
        state.byId[id].mechanicId = mechanicId;
        state.byId[id].status = "MECHANIC_ASSIGNED";
      }
    },
    socketNoteAdded(state, { payload }) {
      const { id } = payload;
      if (!state.byId[id]) state.byId[id] = { id };
    },
    setListStatusFilter(state, { payload }) {
      state.list.filters.status = payload || null;
    },
    resetServiceState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequests.pending, (state) => {
        state.list.loading = true;
        state.list.error = null;
      })
      .addCase(fetchRequests.fulfilled, (state, { payload }) => {
        state.list.loading = false;
        const { items, nextCursor } = payload;
        upsertMany(state, items);
        state.list.ids = items.map((i) => i.id);
        state.list.nextCursor = nextCursor;
      })
      .addCase(fetchRequests.rejected, (state, { payload }) => {
        state.list.loading = false;
        state.list.error = payload?.error || "Failed to load";
      });

    builder
      .addCase(fetchRequestById.pending, (state) => {
        state.details.loading = true;
        state.details.error = null;
      })
      .addCase(fetchRequestById.fulfilled, (state, { payload }) => {
        state.details.loading = false;
        state.byId[payload.id] = {
          ...(state.byId[payload.id] || {}),
          ...payload,
        };
        if (!state.list.ids.includes(payload.id))
          state.list.ids.unshift(payload.id);
      })
      .addCase(fetchRequestById.rejected, (state, { payload }) => {
        state.details.loading = false;
        state.details.error = payload?.error || "Failed to load";
      });

    builder
      .addCase(createRequest.pending, (state) => {
        state.create.loading = true;
        state.create.error = null;
      })
      .addCase(createRequest.fulfilled, (state, { payload }) => {
        state.create.loading = false;
        state.byId[payload.id] = payload;
        state.list.ids.unshift(payload.id);
      })
      .addCase(createRequest.rejected, (state, { payload }) => {
        state.create.loading = false;
        state.create.error = payload?.error || "Failed to create";
      });

    const upsertReturned = (state, payload) => {
      const req = payload;
      state.byId[req.id] = { ...(state.byId[req.id] || {}), ...req };
      if (!state.list.ids.includes(req.id)) state.list.ids.unshift(req.id);
    };

    builder
      .addCase(acceptRequest.fulfilled, (state, { payload }) =>
        upsertReturned(state, payload)
      )
      .addCase(rejectRequest.fulfilled, (state, { payload }) =>
        upsertReturned(state, payload)
      )
      .addCase(assignMechanic.fulfilled, (state, { payload }) =>
        upsertReturned(state, payload)
      )
      .addCase(setEstimate.fulfilled, (state, { payload }) =>
        upsertReturned(state, payload)
      )
      .addCase(approveEstimate.fulfilled, (state, { payload }) =>
        upsertReturned(state, payload)
      )
      .addCase(updateStatus.fulfilled, (state, { payload }) =>
        upsertReturned(state, payload)
      )
      .addCase(addNote.fulfilled, (state) => state);

    builder
      .addCase(fetchTimeline.pending, (state, { meta }) => {
        const id = meta.arg;
        state.timelines[id] = state.timelines[id] || {
          items: [],
          loading: false,
          error: null,
        };
        state.timelines[id].loading = true;
        state.timelines[id].error = null;
      })
      .addCase(fetchTimeline.fulfilled, (state, { payload }) => {
        const { id, items } = payload;
        state.timelines[id] = state.timelines[id] || {
          items: [],
          loading: false,
          error: null,
        };
        state.timelines[id].loading = false;
        state.timelines[id].items = items;
      })
      .addCase(fetchTimeline.rejected, (state, { payload, meta }) => {
        const id = meta.arg;
        state.timelines[id] = state.timelines[id] || {
          items: [],
          loading: false,
          error: null,
        };
        state.timelines[id].loading = false;
        state.timelines[id].error = payload?.error || "Failed to load timeline";
      });
  },
});

export const {
  socketUpsertRequest,
  socketStatusChanged,
  socketEstimateUpdated,
  socketMechanicAssigned,
  socketNoteAdded,
  setListStatusFilter,
  resetServiceState,
} = serviceSlice.actions;

export default serviceSlice.reducer;
