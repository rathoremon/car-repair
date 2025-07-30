import { createSlice } from "@reduxjs/toolkit";
import {
  login,
  register,
  verifyOtp,
  refreshUser,
  setNewPassword,
} from "./authThunks";

const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("token");
const initialState = {
  token: storedToken || null,
  user: storedUser ? JSON.parse(storedUser) : null,
  role: storedUser ? JSON.parse(storedUser)?.role || null : null,
  activeRole: localStorage.getItem("activeRole") || null,
  selectedRole: localStorage.getItem("selectedRole") || null,
  verified: storedUser ? JSON.parse(storedUser)?.isOtpVerified || false : false,
  loading: false,
  error: null,
  registerStatus: null,
  tempUser: null,
  hydrated: false,
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
      state.selectedRole = null;
      state.activeRole = null; // 👈 NEW
      localStorage.removeItem("token");
      localStorage.removeItem("providerId");
      localStorage.removeItem("user");
      localStorage.removeItem("selectedRole");
      localStorage.removeItem("activeRole");
    },
    setTempUser(state, action) {
      state.tempUser = action.payload;
    },
    setSelectedRole(state, action) {
      state.selectedRole = action.payload;
      localStorage.setItem("selectedRole", action.payload); // 👈 NEW
    },
    setActiveRole(state, action) {
      state.activeRole = action.payload;
      localStorage.setItem("activeRole", action.payload); // 👈 NEW
    },
    clearAuthError(state) {
      state.error = null;
    },
    setRequiresPasswordReset: (state, action) => {
      state.user.requiresPasswordReset = action.payload;
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
        const { user, token } = action.payload;
        console.log("[authSlice] saving token to localStorage:", token);
        state.user = user;
        state.token = token;
        state.verified = user.isOtpVerified || false;
        state.loading = false;
        state.role = user?.role || null;
        state.error = null;
        state.hydrated = true;

        if (token) {
          localStorage.setItem("token", action.payload.token);
        }
        if (user?.providerId) {
          localStorage.setItem("providerId", user.providerId);
        }

        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
          const active = user.role;
          state.activeRole = active;
          localStorage.setItem("activeRole", active);
        }
        console.log("[authSlice] Login fulfilled payload:", action.payload);
        console.log("[authSlice] saving token to localStorage:", token);

        console.log(
          "[authSlice] token in localStorage:",
          localStorage.getItem("token")
        );
      })

      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
        state.hydrated = false;
      })

      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        console.log("[authSlice] saving token to localStorage:", token);
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
        const { user, token } = action.payload;
        console.log("[authSlice] saving token to localStorage:", token);
        state.loading = false;
        state.verified = true;
        state.user = user;
        state.token = token;
        state.role = user?.role || null;
        state.error = null;
        state.hydrated = true;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        if (user?.providerId) {
          localStorage.setItem("providerId", user.providerId);
        }
        const active = user.role;
        state.activeRole = active;
        localStorage.setItem("activeRole", active);
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.verified = false;
        state.hydrated = true;
      })

      // Refresh User
      .addCase(refreshUser.pending, (state) => {
        state.loading = true;
        state.hydrated = false; // Reset hydrated state while loading
      })
      .addCase(refreshUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.verified = action.payload.user?.isOtpVerified;
        state.token = localStorage.getItem("token");
        state.role = action.payload.role || null;
        state.hydrated = true;
        state.error = null;
        console.log(
          "[authSlice] saving token to localStorage:",
          action.payload.token
        );
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        console.log("[authSlice] refreshUser success:", action.payload);
      })
      .addCase(refreshUser.rejected, (state) => {
        state.loading = false;
        state.token = null;
        state.user = null;
        state.role = null;
        state.hydrated = true;
        state.error = "Session expired. Please login again.";
        localStorage.removeItem("token");
        localStorage.removeItem("providerId");
        localStorage.removeItem("user");
      })
      .addCase(setNewPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setNewPassword.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) {
          state.user.requiresPasswordReset = false;

          // Also update in localStorage to persist across reloads
          const updatedUser = { ...state.user, requiresPasswordReset: false };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          console.log(
            "[authSlice] saving token to localStorage:",
            localStorage.getItem("token")
          );
        }
      })
      .addCase(setNewPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  logout,
  setTempUser,
  setSelectedRole,
  clearAuthError,
  setActiveRole,
  setRequiresPasswordReset,
} = authSlice.actions;

export default authSlice.reducer;
