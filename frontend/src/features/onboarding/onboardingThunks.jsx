import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios";
import { setGarageImagesProgress } from "./onboardingSlice";

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

export const saveBankDetails = createAsyncThunk(
  "onboarding/saveBankDetails",
  async (bankDetails, { rejectWithValue }) => {
    try {
      const providerId = localStorage.getItem("providerId");
      if (!providerId) throw new Error("Provider ID not found");

      const res = await api.put(`/api/provider/${providerId}`, {
        ...bankDetails,
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error ||
          err.message ||
          "Failed to save bank details"
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
      const res = await api.post("/api/document/upload-multiple", formData, {
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
      await api.delete(`/api/document/${docId}`);
      return docId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || "Delete failed"
      );
    }
  }
);

// Create vehicles
export const createVehicles = createAsyncThunk(
  "onboarding/createVehicles",
  async (vehicles, { rejectWithValue }) => {
    try {
      const responses = [];
      for (const vehicle of vehicles) {
        const res = await api.post("/api/vehicles", vehicle);
        responses.push(res.data.data);
      }

      return responses;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || "Failed to create vehicles"
      );
    }
  }
);

// Upload provider document
export const uploadProviderDocs = createAsyncThunk(
  "onboarding/uploadProviderDocs",
  async ({ docs }, { rejectWithValue }) => {
    try {
      const results = [];

      const uploadSingle = async (doc, type) => {
        const formData = new FormData();
        formData.append("file", doc);
        formData.append("type", type);
        const res = await api.post("/api/document/upload-single", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data.data;
      };

      if (docs.license)
        results.push(await uploadSingle(docs.license, "license"));
      if (docs.gst) results.push(await uploadSingle(docs.gst, "gst"));
      if (docs.id_proof)
        results.push(await uploadSingle(docs.id_proof, "id_proof"));

      return results;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || "Document upload failed"
      );
    }
  }
);

// Mark onboarding complete
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

// Admin Reset Provider Onboarding (on rejection)
export const resetProviderOnboarding = createAsyncThunk(
  "onboarding/resetProviderOnboarding",
  async (providerId, { rejectWithValue }) => {
    try {
      const res = await api.delete(
        `/api/provider/${providerId}/onboarding-reset`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || "Failed to reset onboarding"
      );
    }
  }
);
