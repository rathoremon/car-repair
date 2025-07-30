// src/features/onboarding/onboardingThunks.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios";
import { setGarageImagesProgress } from "./onboardingSlice";

// Save provider general details (step 1)
export const saveProviderGeneralDetails = createAsyncThunk(
  "onboarding/saveProviderGeneralDetails",
  async ({ providerId, categories, ...garage }, { rejectWithValue }) => {
    if (!providerId) throw new Error("Provider ID not found");
    try {
      const payload = {
        ...garage,
        serviceCategories: categories,
      };
      const res = await api.put(`/api/provider/${providerId}`, payload);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to save details"
      );
    }
  }
);

// src/features/onboarding/onboardingThunks.js
export const saveBankDetails = createAsyncThunk(
  "onboarding/saveBankDetails",
  async ({ providerId, ...bankDetails }, { rejectWithValue }) => {
    try {
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

// Upload provider documents
export const uploadProviderDocs = createAsyncThunk(
  "onboarding/uploadProviderDocs",
  async ({ providerId, docs }, { rejectWithValue }) => {
    try {
      const results = [];

      const uploadSingle = async (doc, type) => {
        if (!doc) return null;
        const formData = new FormData();
        formData.append("file", doc.file ? doc.file : doc);
        formData.append("type", type);
        formData.append("providerId", providerId);
        const res = await api.post("/api/document/upload-single", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data.data;
      };

      if (docs.license && (!docs.license.filePath || docs.license.file)) {
        const uploaded = await uploadSingle(docs.license, "license");
        if (uploaded) results.push(uploaded);
      }
      if (docs.gst && (!docs.gst.filePath || docs.gst.file)) {
        const uploaded = await uploadSingle(docs.gst, "gst");
        if (uploaded) results.push(uploaded);
      }
      if (docs.id_proof && (!docs.id_proof.filePath || docs.id_proof.file)) {
        const uploaded = await uploadSingle(docs.id_proof, "id_proof");
        if (uploaded) results.push(uploaded);
      }

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
  async ({ providerId }, { rejectWithValue }) => {
    try {
      const res = await api.patch("/api/user/onboarding-complete", {
        providerId,
      });
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

// Fetch provider documents (all doc types, one API)
export const fetchProviderDocuments = createAsyncThunk(
  "onboarding/fetchProviderDocuments",
  async (providerId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/api/document?providerId=${providerId}`);
      return data.data; // array of { id, type, filePath, ... }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch documents"
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

// Fetch draft onboarding data for crash-proof resume
export const fetchOnboardingDraft = createAsyncThunk(
  "onboarding/fetchOnboardingDraft",
  async (providerId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(
        `/api/provider/${providerId}/onboarding-draft`
      );
      return data.draft;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch draft"
      );
    }
  }
);

// Save onboarding draft
export const saveOnboardingDraft = createAsyncThunk(
  "onboarding/saveOnboardingDraft",
  async ({ providerId, draft }, { rejectWithValue }) => {
    try {
      await api.patch(`/api/provider/${providerId}/onboarding-draft`, {
        draft,
      });
      return true;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to save draft"
      );
    }
  }
);
