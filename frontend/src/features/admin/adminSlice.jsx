import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    providers: [],
    mechanics: [],
    auditLogs: [],
    loading: false,
    error: null,
  },
  reducers: {
    setUsers(state, action) {
      state.users = action.payload;
    },
    setProviders(state, action) {
      state.providers = action.payload;
    },
    setMechanics(state, action) {
      state.mechanics = action.payload;
    },
    setAuditLogs(state, action) {
      state.auditLogs = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    clearAdmin(state) {
      return {
        users: [],
        providers: [],
        mechanics: [],
        auditLogs: [],
        loading: false,
        error: null,
      };
    },
  },
});

export const {
  setUsers,
  setProviders,
  setMechanics,
  setAuditLogs,
  setLoading,
  setError,
  clearAdmin,
} = adminSlice.actions;

export default adminSlice.reducer;
