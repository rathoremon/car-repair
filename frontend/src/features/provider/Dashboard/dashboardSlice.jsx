// features/provider/Dashboard/dashboardSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchDashboardData } from "./dashboardThunks";

const initialState = {
  providerInfo: null,
  kpis: [],
  alerts: [],
  assignments: [],
  earnings: null,
  feedback: [],
  announcements: [],
  loading: true,
  error: null,
};

const dashboardSlice = createSlice({
  name: "providerDashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state = Object.assign(state, action.payload);
        state.loading = false;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default dashboardSlice.reducer;
