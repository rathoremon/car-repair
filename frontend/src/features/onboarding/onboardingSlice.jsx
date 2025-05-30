import { createSlice } from "@reduxjs/toolkit";

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState: {
    step: 0,
    completed: false,
    vehicleStepComplete: false,
    providerStepComplete: false,
    providerDocs: [],
    error: null,
  },
  reducers: {
    setStep(state, action) {
      state.step = action.payload;
    },
    setCompleted(state, action) {
      state.completed = action.payload;
    },
    setVehicleStepComplete(state, action) {
      state.vehicleStepComplete = action.payload;
    },
    setProviderStepComplete(state, action) {
      state.providerStepComplete = action.payload;
    },
    setProviderDocs(state, action) {
      state.providerDocs = action.payload;
    },
    setOnboardingError(state, action) {
      state.error = action.payload;
    },
    clearOnboarding(state) {
      return {
        step: 0,
        completed: false,
        vehicleStepComplete: false,
        providerStepComplete: false,
        providerDocs: [],
        error: null,
      };
    },
  },
});

export const {
  setStep,
  setCompleted,
  setVehicleStepComplete,
  setProviderStepComplete,
  setProviderDocs,
  setOnboardingError,
  clearOnboarding,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;
