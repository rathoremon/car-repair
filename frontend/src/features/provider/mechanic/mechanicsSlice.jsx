import { createSlice } from "@reduxjs/toolkit";
import {
  fetchMechanics,
  fetchMechanicById,
  createMechanic,
  updateMechanic,
  deleteMechanic,
  resetMechanicPassword,
} from "./mechanicsThunks";

const initialState = {
  list: [],
  total: 0,
  loading: false,
  error: null,
  selected: null,
  resetPasswordResult: null,
};

const mechanicSlice = createSlice({
  name: "mechanics",
  initialState,
  reducers: {
    clearSelected: (state) => {
      state.selected = null;
      state.resetPasswordResult = null;
    },
    clearResetResult: (state) => {
      state.resetPasswordResult = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMechanics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMechanics.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.mechanics || [];
        state.total = action.payload.total || 0;
      })
      .addCase(fetchMechanics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMechanicById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMechanicById.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload;
      })
      .addCase(fetchMechanicById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createMechanic.fulfilled, (state, action) => {
        state.list.unshift(action.payload.mechanic);
        state.total += 1;
      })
      .addCase(updateMechanic.fulfilled, (state, action) => {
        const idx = state.list.findIndex((m) => m.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(deleteMechanic.fulfilled, (state, action) => {
        state.list = state.list.filter((m) => m.id !== action.payload);
        state.total -= 1;
      })
      .addCase(resetMechanicPassword.fulfilled, (state, action) => {
        state.resetPasswordResult = action.payload;
      });
  },
});

export const { clearSelected, clearResetResult } = mechanicSlice.actions;
export default mechanicSlice.reducer;
