import { createSlice } from "@reduxjs/toolkit";
import {
  uploadGarageImages,
  removeGarageImage,
  createVehicles,
  markOnboardingComplete,
  saveBankDetails,
} from "./onboardingThunks";

const initialState = {
  step: 0,
  completed: false,
  vehicleStepComplete: false,
  providerStepComplete: false,
  providerDocs: [],
  vehicles: [],
  garage: {
    name: "",
    address: "",
    categories: [],
    serviceArea: [],
    location: {},
    workingHours: {},
    availability: [],
  },
  bankDetails: {
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    branchName: "",
    upiId: "",
  },
  error: null,
  upload: {
    uploading: false,
    error: null,
    uploadedDocs: [],
  },
  garageImages: [],
  garageImagesUploading: false,
  garageImagesProgress: 0,
  garageImagesError: null,
};

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    setStep: (state, action) => {
      state.step = action.payload;
    },
    setCompleted: (state, action) => {
      state.completed = action.payload;
    },
    setVehicleStepComplete: (state, action) => {
      state.vehicleStepComplete = action.payload;
    },
    setProviderStepComplete: (state, action) => {
      state.providerStepComplete = action.payload;
    },
    setProviderDocs: (state, action) => {
      state.providerDocs = action.payload;
    },
    setVehicles: (state, action) => {
      state.vehicles = action.payload;
    },
    setGarage: (state, action) => {
      state.garage = { ...state.garage, ...action.payload };
    },
    setBankDetails: (state, action) => {
      state.bankDetails = { ...state.bankDetails, ...action.payload };
    },
    setOnboardingError: (state, action) => {
      state.error = action.payload;
    },
    clearOnboarding: () => initialState,

    setGarageImagesProgress: (state, action) => {
      state.garageImagesProgress = action.payload;
    },
    clearGarageImagesProgress: (state) => {
      state.garageImagesProgress = 0;
    },

    // ✅ NEW: Reset onboarding on KYC rejection
    clearProviderOnboarding: (state) => {
      state.providerDocs = [];
      state.garage = {
        name: "",
        address: "",
        categories: [],
        serviceArea: [],
        location: {},
        workingHours: {},
        availability: [],
      };
      state.bankDetails = {
        accountHolderName: "",
        accountNumber: "",
        ifscCode: "",
        bankName: "",
        branchName: "",
        upiId: "",
      };
      state.error = null;
      state.garageImages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadGarageImages.pending, (state) => {
        state.garageImagesUploading = true;
        state.garageImagesError = null;
      })
      .addCase(uploadGarageImages.fulfilled, (state, action) => {
        state.garageImagesUploading = false;
        state.garageImages = [...state.garageImages, ...action.payload];
        state.garageImagesError = null;
        state.garageImagesProgress = 0;
      })
      .addCase(uploadGarageImages.rejected, (state, action) => {
        state.garageImagesUploading = false;
        state.garageImagesError = action.payload;
        state.garageImagesProgress = 0;
      })
      .addCase(removeGarageImage.fulfilled, (state, action) => {
        state.garageImages = state.garageImages.filter(
          (img) => img.id !== action.payload
        );
      })
      .addCase(createVehicles.fulfilled, (state, action) => {
        state.vehicles = action.payload;
      })
      .addCase(saveBankDetails.fulfilled, (state, action) => {
        state.bankDetails = action.payload;
      })
      .addCase(markOnboardingComplete.fulfilled, (state) => {
        state.completed = true;
      });
  },
});

export const {
  setStep,
  setCompleted,
  setVehicleStepComplete,
  setProviderStepComplete,
  setProviderDocs,
  setVehicles,
  setGarage,
  setBankDetails,
  setOnboardingError,
  clearOnboarding,
  clearProviderOnboarding, // ✅ export this for use in reset flow
  setGarageImagesProgress,
  clearGarageImagesProgress,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;
