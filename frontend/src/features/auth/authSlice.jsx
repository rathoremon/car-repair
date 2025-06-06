// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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

// Refresh User Info (after onboarding or status change)
export const refreshUser = createAsyncThunk(
  "auth/refreshUser",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await api.get("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);
const initialState = {
  user: null,
  token: null,
  role: null,
  loading: false,
  error: null,
  verified: false,
  registerStatus: null,
  tempUser: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.role = null;
      state.verified = false;
      state.registerStatus = null;
      state.tempUser = null;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("providerId");
      localStorage.removeItem("user");
    },
    setTempUser(state, action) {
      state.tempUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.user?.role || null;
        state.verified = !!action.payload.user?.isOtpVerified;
        state.error = null;
        if (action.payload.token) {
          localStorage.setItem("token", action.payload.token);
        }
        if (action.payload.user?.providerId) {
          localStorage.setItem("providerId", action.payload.user.providerId);
        }
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.registerStatus = "otp";
        state.tempUser = action.payload.data;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.verified = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.user?.role || null;
        state.error = null;
        if (action.payload.token) {
          localStorage.setItem("token", action.payload.token);
        }
        if (action.payload.user?.providerId) {
          localStorage.setItem("providerId", action.payload.user.providerId);
        }
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(refreshUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.verified = action.payload.user.isOtpVerified;
      })
      .addCase(refreshUser.rejected, (state) => {
        state.loading = false;
        state.token = null; // <- IMPORTANT
        state.user = null;
        state.verified = false;
      });
  },
});

export const { logout, setTempUser } = authSlice.actions;
export default authSlice.reducer;
