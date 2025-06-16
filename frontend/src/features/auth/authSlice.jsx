import { createSlice } from "@reduxjs/toolkit";
import { login, register, verifyOtp, refreshUser } from "./authThunks";

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
      // Login
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

      // Register
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

      // Verify OTP
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

      // Refresh User
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
        state.token = null;
        state.user = null;
        state.verified = false;
      });
  },
});

export const { logout, setTempUser } = authSlice.actions;
export default authSlice.reducer;
