import { createSlice } from "@reduxjs/toolkit";
import {
  uploadGarageImages,
  removeGarageImage,
  createVehicles,
  markOnboardingComplete,
} from "./onboardingThunks";

const initialState = {
  step: 0,
  completed: false,
  vehicleStepComplete: false,
  providerStepComplete: false,
  providerDocs: [],
  vehicles: [],
  garage: { name: "", address: "" },
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
      .addCase(removeGarageImage.rejected, (state, action) => {
        state.garageImagesError = action.payload;
      })
      .addCase(createVehicles.pending, (state) => {
        state.upload.uploading = true;
      })
      .addCase(createVehicles.fulfilled, (state, action) => {
        state.upload.uploading = false;
        state.vehicles = action.payload;
      })
      .addCase(createVehicles.rejected, (state, action) => {
        state.upload.uploading = false;
        state.error = action.payload;
      })
      .addCase(markOnboardingComplete.pending, (state) => {
        state.upload.uploading = true;
      })
      .addCase(markOnboardingComplete.fulfilled, (state) => {
        state.upload.uploading = false;
        state.completed = true;
      })
      .addCase(markOnboardingComplete.rejected, (state, action) => {
        state.upload.uploading = false;
        state.upload.error = action.payload;
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
  setOnboardingError,
  clearOnboarding,
  setGarageImagesProgress,
  clearGarageImagesProgress,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;
