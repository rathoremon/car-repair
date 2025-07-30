// features/provider/Dashboard/dashboardThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../utils/axios"; // your API helper

export const fetchDashboardData = createAsyncThunk(
  "providerDashboard/fetchDashboardData",
  async (_, { rejectWithValue }) => {
    try {
      const [
        providerInfo,
        kpis,
        alerts,
        assignments,
        earnings,
        feedback,
        announcements,
      ] = await Promise.all([
        api.get("/provider/me"),
        api.get("/provider/kpi"),
        api.get("/provider/alerts"),
        api.get("/provider/assignments/today"),
        api.get("/provider/earnings/summary"),
        api.get("/provider/feedback/recent"),
        api.get("/provider/announcements"),
      ]);
      return {
        providerInfo: providerInfo.data,
        kpis: kpis.data,
        alerts: alerts.data,
        assignments: assignments.data,
        earnings: earnings.data,
        feedback: feedback.data,
        announcements: announcements.data,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
