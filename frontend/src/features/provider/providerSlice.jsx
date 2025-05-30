import { createSlice } from "@reduxjs/toolkit";

const providerSlice = createSlice({
  name: "provider",
  initialState: {
    info: null,
    mechanics: [],
    kycDocs: [],
    status: null, // "pending" | "approved" | "rejected"
  },
  reducers: {
    setProviderInfo(state, action) {
      state.info = action.payload;
    },
    setMechanics(state, action) {
      state.mechanics = action.payload;
    },
    addMechanic(state, action) {
      state.mechanics.push(action.payload);
    },
    setKycDocs(state, action) {
      state.kycDocs = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
    clearProvider(state) {
      return { info: null, mechanics: [], kycDocs: [], status: null };
    },
  },
});

export const {
  setProviderInfo,
  setMechanics,
  addMechanic,
  setKycDocs,
  setStatus,
  clearProvider,
} = providerSlice.actions;

export default providerSlice.reducer;
