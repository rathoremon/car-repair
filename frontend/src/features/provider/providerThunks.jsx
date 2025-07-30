import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios";

// Get all providers (admin)
export const getAllProviders = createAsyncThunk(
  "provider/getAll",
  async (params = {}, { rejectWithValue }) => {
    // Debug: Log params before call
    console.log("THUNK: API CALL with params", params);
    try {
      const res = await api.get("/api/admin/providers", { params });
      // Debug: Log what backend returns
      console.log("THUNK: API RESULT", res.data.data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch providers"
      );
    }
  }
);

// Approve provider KYC (admin)
export const approveProvider = createAsyncThunk(
  "provider/approve",
  async (providerId, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/api/admin/providers/${providerId}/kyc`, {
        kycStatus: "verified",
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to approve provider"
      );
    }
  }
);

export const rejectProvider = createAsyncThunk(
  "provider/rejectAndReset",
  async ({ providerId, reason }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/api/admin/providers/${providerId}/kyc`, {
        kycStatus: "rejected",
        rejectionReason: reason,
      });
      return res.data.data; // <--- Return the actual provider!
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Rejection failed");
    }
  }
);

// Approve a single garage image
export const approveGarageImage = createAsyncThunk(
  "provider/approveGarageImage",
  async ({ providerId, imageId }, { rejectWithValue }) => {
    try {
      const res = await api.patch(
        `/api/admin/providers/${providerId}/garage-image/${imageId}`,
        { status: "approved" }
      );
      return { providerId, imageId, status: "approved" };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to approve image"
      );
    }
  }
);

// Reject a single garage image
export const rejectGarageImage = createAsyncThunk(
  "provider/rejectGarageImage",
  async ({ providerId, imageId }, { rejectWithValue }) => {
    try {
      const res = await api.patch(
        `/api/admin/providers/${providerId}/garage-image/${imageId}`,
        { status: "rejected" }
      );
      return { providerId, imageId, status: "rejected" };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to reject image"
      );
    }
  }
);

// Bulk approve all garage images
export const approveAllGarageImages = createAsyncThunk(
  "provider/approveAllGarageImages",
  async (providerId, { rejectWithValue }) => {
    try {
      await api.patch(
        `/api/admin/providers/${providerId}/garage-images/approve-all`
      );
      return { providerId };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to approve all images"
      );
    }
  }
);

// Bulk reject all garage images
export const rejectAllGarageImages = createAsyncThunk(
  "provider/rejectAllGarageImages",
  async (providerId, { rejectWithValue }) => {
    try {
      await api.patch(
        `/api/admin/providers/${providerId}/garage-images/reject-all`
      );
      return { providerId };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to reject all images"
      );
    }
  }
);

// Approve/reject KYC document (per doc)
export const approveDocument = createAsyncThunk(
  "provider/approveDocument",
  async ({ providerId, documentId }, { rejectWithValue }) => {
    try {
      await api.patch(
        `/api/admin/providers/${providerId}/document/${documentId}`,
        { status: "approved" }
      );
      return { providerId, documentId, status: "approved" };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to approve document"
      );
    }
  }
);

export const rejectDocument = createAsyncThunk(
  "provider/rejectDocument",
  async ({ providerId, documentId }, { rejectWithValue }) => {
    try {
      await api.patch(
        `/api/admin/providers/${providerId}/document/${documentId}`,
        { status: "rejected" }
      );
      return { providerId, documentId, status: "rejected" };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to reject document"
      );
    }
  }
);
