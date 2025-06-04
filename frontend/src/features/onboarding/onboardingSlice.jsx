// src/features/onboarding/onboardingSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Axios instance with baseURL
const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

// Automatically attach token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Save provider general details (step 1)
export const saveProviderGeneralDetails = createAsyncThunk(
  "onboarding/saveProviderGeneralDetails",
  async (providerDetails, { rejectWithValue }) => {
    try {
      const providerId = localStorage.getItem("providerId");
      if (!providerId) throw new Error("Provider ID not found");

      const res = await api.put(`/api/provider/${providerId}`, providerDetails);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || "Failed to save details"
      );
    }
  }
);

// Upload garage images
export const uploadGarageImages = createAsyncThunk(
  "onboarding/uploadGarageImages",
  async (files, { dispatch, rejectWithValue }) => {
    const formData = new FormData();
    for (let file of files) {
      formData.append("file", file);
    }
    formData.append("type", "garage_image");

    try {
      const res = await api.post("/api/documents/upload-multiple", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          const progress = Math.round((e.loaded * 100) / e.total);
          dispatch(setGarageImagesProgress(progress));
        },
      });

      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || "Garage image upload failed"
      );
    }
  }
);

// Remove garage image
export const removeGarageImage = createAsyncThunk(
  "onboarding/removeGarageImage",
  async (docId, { rejectWithValue }) => {
    try {
      await api.delete(`/api/documents/${docId}`);
      return docId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || "Delete failed"
      );
    }
  }
);

export const createVehicles = createAsyncThunk(
  "onboarding/createVehicles",
  async (vehicles, { rejectWithValue }) => {
    try {
      const responses = [];

      // Sequentially create vehicles
      for (const vehicle of vehicles) {
        const res = await api.post("/api/vehicles", vehicle);
        responses.push(res.data.data);
      }

      return responses; // return array of created vehicles
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || "Failed to create vehicles"
      );
    }
  }
);

// Upload provider documents
export const uploadProviderDocs = createAsyncThunk(
  "onboarding/uploadProviderDocs",
  async ({ docs }, { rejectWithValue }) => {
    try {
      const results = [];

      const uploadSingle = async (doc, type) => {
        const formData = new FormData();
        formData.append("file", doc);
        formData.append("type", type);
        const res = await api.post("/api/documents/upload-single", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data.data;
      };

      if (docs.license) {
        results.push(await uploadSingle(docs.license, "license"));
      }
      if (docs.gst) {
        results.push(await uploadSingle(docs.gst, "gst"));
      }
      if (docs.id_proof) {
        results.push(await uploadSingle(docs.id_proof, "id_proof"));
      }

      return results;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || "Document upload failed"
      );
    }
  }
);

// 🆕 Mark onboarding complete (new thunk)
export const markOnboardingComplete = createAsyncThunk(
  "onboarding/markOnboardingComplete",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.patch("/api/user/onboarding-complete", {});
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error ||
          err.message ||
          "Failed to mark onboarding complete"
      );
    }
  }
);

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
    setVehicles(state, action) {
      state.vehicles = action.payload;
    },
    setGarage(state, action) {
      state.garage = { ...state.garage, ...action.payload };
    },
    setOnboardingError(state, action) {
      state.error = action.payload;
    },
    clearOnboarding(state) {
      return { ...initialState };
    },
    setGarageImagesProgress(state, action) {
      state.garageImagesProgress = action.payload;
    },
    clearGarageImagesProgress(state) {
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
