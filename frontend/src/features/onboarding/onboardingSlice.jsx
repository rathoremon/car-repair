// src/features/onboarding/onboardingSlice.js

import { createSlice } from "@reduxjs/toolkit";
import {
  uploadGarageImages,
  removeGarageImage,
  createVehicles,
  markOnboardingComplete,
  saveBankDetails,
  saveProviderGeneralDetails,
  uploadProviderDocs,
  fetchOnboardingDraft,
  saveOnboardingDraft,
  resetProviderOnboarding,
  fetchProviderDocuments,
} from "./onboardingThunks";

const initialState = {
  step: 0,
  completed: false,
  vehicleStepComplete: false,
  providerStepComplete: false,
  providerDocuments: [], // <-- All docs (license, gst, id_proof)
  vehicles: [],
  garage: {
    name: "",
    address: "",
    companyName: "",
    categories: [],
    serviceCategories: [],
    serviceArea: [],
    location: {},
    workingHours: {},
    availability: [],
    allCategories: [],
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
  draftLoading: false,
  draftError: null,
  draftSaved: false,
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
    setProviderDocuments: (state, action) => {
      state.providerDocuments = action.payload;
    },
    setVehicles: (state, action) => {
      state.vehicles = action.payload;
    },
    setGarageImages: (state, action) => {
      state.garageImages = action.payload || [];
    },
    setGarage: (state, action) => {
      const payload = action.payload || {};
      const mergedCategories =
        payload.categories ||
        payload.serviceCategories ||
        state.garage.categories ||
        [];
      state.garage = {
        ...state.garage,
        ...payload,
        categories: mergedCategories,
        serviceCategories: mergedCategories,
      };
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
    clearProviderOnboarding: (state) => {
      state.providerDocuments = [];
      state.garage = {
        name: "",
        address: "",
        companyName: "",
        categories: [],
        serviceCategories: [],
        serviceArea: [],
        location: {},
        workingHours: {},
        availability: [],
        allCategories: [],
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
    builder.addCase(uploadGarageImages.pending, (state) => {
      state.garageImagesUploading = true;
      state.garageImagesError = null;
    });
    builder
      .addCase(fetchProviderDocuments.fulfilled, (state, action) => {
        state.providerDocuments = action.payload || [];
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
      });

    builder
      .addCase(uploadProviderDocs.pending, (state) => {
        state.upload.uploading = true;
        state.upload.error = null;
      })
      .addCase(uploadProviderDocs.fulfilled, (state, action) => {
        state.upload.uploading = false;
        // Add/replace uploaded docs in providerDocuments by type
        if (Array.isArray(action.payload)) {
          action.payload.forEach((doc) => {
            const idx = state.providerDocuments.findIndex(
              (d) => d.type === doc.type
            );
            if (idx !== -1) {
              state.providerDocuments[idx] = doc;
            } else {
              state.providerDocuments.push(doc);
            }
          });
        }
        state.upload.uploadedDocs = action.payload;
        state.upload.error = null;
      })
      .addCase(uploadProviderDocs.rejected, (state, action) => {
        state.upload.uploading = false;
        state.upload.error = action.payload;
      });

    builder
      .addCase(saveProviderGeneralDetails.fulfilled, (state, action) => {
        const data = action.payload;
        const mergedCategories =
          data.categories || data.serviceCategories || [];
        state.garage = {
          ...state.garage,
          ...data,
          categories: mergedCategories,
          serviceCategories: mergedCategories,
        };
      })
      .addCase(saveBankDetails.fulfilled, (state, action) => {
        state.bankDetails = action.payload;
      })
      .addCase(createVehicles.fulfilled, (state, action) => {
        state.vehicles = action.payload;
      })
      .addCase(markOnboardingComplete.fulfilled, (state) => {
        state.completed = true;
      });

    builder
      .addCase(fetchOnboardingDraft.pending, (state) => {
        state.draftLoading = true;
        state.draftError = null;
      })
      .addCase(fetchOnboardingDraft.fulfilled, (state, action) => {
        state.draftLoading = false;
        state.draftError = null;
      })
      .addCase(fetchOnboardingDraft.rejected, (state, action) => {
        state.draftLoading = false;
        state.draftError = action.payload;
      })
      .addCase(saveOnboardingDraft.pending, (state) => {
        state.draftSaved = false;
        state.draftError = null;
      })
      .addCase(saveOnboardingDraft.fulfilled, (state) => {
        state.draftSaved = true;
      })
      .addCase(saveOnboardingDraft.rejected, (state, action) => {
        state.draftError = action.payload;
      });

    builder.addCase(resetProviderOnboarding.fulfilled, (state) => {
      state.providerDocuments = [];
      state.garage = {
        name: "",
        address: "",
        companyName: "",
        categories: [],
        serviceCategories: [],
        serviceArea: [],
        location: {},
        workingHours: {},
        availability: [],
        allCategories: [],
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
      state.vehicles = [];
      state.completed = false;
      state.step = 0;
    });
  },
});

export const {
  setStep,
  setCompleted,
  setVehicleStepComplete,
  setProviderStepComplete,
  setProviderDocuments,
  setVehicles,
  setGarage,
  setBankDetails,
  setOnboardingError,
  clearOnboarding,
  clearProviderOnboarding,
  setGarageImagesProgress,
  setGarageImages,
  clearGarageImagesProgress,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;
