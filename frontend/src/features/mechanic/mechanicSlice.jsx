import { createSlice } from "@reduxjs/toolkit";

const mechanicSlice = createSlice({
  name: "mechanic",
  initialState: {
    jobs: [],
    profile: null,
    status: null,
    loading: false,
    error: null,
  },
  reducers: {
    setJobs(state, action) {
      state.jobs = action.payload;
    },
    setProfile(state, action) {
      state.profile = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    clearMechanic(state) {
      return {
        jobs: [],
        profile: null,
        status: null,
        loading: false,
        error: null,
      };
    },
  },
});

export const {
  setJobs,
  setProfile,
  setStatus,
  setLoading,
  setError,
  clearMechanic,
} = mechanicSlice.actions;

export default mechanicSlice.reducer;
