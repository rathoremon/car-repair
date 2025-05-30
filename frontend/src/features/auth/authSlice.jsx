import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for login
export const login = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      // Can support login with phone or email
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        payload,
        { withCredentials: true }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Async thunk for register
export const register = createAsyncThunk(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        payload
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Async thunk for OTP verify
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (idToken, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/otp",
        { idToken },
        { withCredentials: true }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const resendOtp = createAsyncThunk(
  "auth/resendOtp",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/auth/resend-otp");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to resend OTP");
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
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, setTempUser } = authSlice.actions;
export default authSlice.reducer;
