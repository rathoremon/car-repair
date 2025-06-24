import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios";

// Login
export const login = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/auth/login", payload);
      return res.data;
    } catch (err) {
      return rejectWithValue({
        error: err.response?.data?.error || err.message || "Login failed",
        next: err.response?.data?.next || null,
      });
    }
  }
);

// Register
export const register = createAsyncThunk(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/auth/register", payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Verify OTP
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (idToken, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/auth/otp", { idToken });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Refresh User Info
export const refreshUser = createAsyncThunk(
  "auth/refreshUser",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token");

      const response = await api.get("/api/auth/me");
      const user = response.data.user;

      if (user?.role === "provider" && user?.kycStatus === "rejected") {
        window.location.href = "/onboarding";
      }

      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);
