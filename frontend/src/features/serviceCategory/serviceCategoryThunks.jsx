import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios";

// Fetch all categories with optional search or status filters
export const fetchAdminServiceCategories = createAsyncThunk(
  "serviceCategory/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/admin/service-categories", { params });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data.error);
    }
  }
);

// Fetch all categories with optional search or status filters
export const fetchServiceCategories = createAsyncThunk(
  "serviceCategory/fetchPublicAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/service-categories", { params });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data.error);
    }
  }
);

// Create new category
export const createServiceCategory = createAsyncThunk(
  "serviceCategory/create",
  async (categoryData, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/admin/service-categories", categoryData);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to create category"
      );
    }
  }
);

// Update a category
export const updateServiceCategory = createAsyncThunk(
  "serviceCategory/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/api/admin/service-categories/${id}`, data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to update category"
      );
    }
  }
);

// Delete (soft) a category
export const deleteServiceCategory = createAsyncThunk(
  "serviceCategory/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/admin/service-categories/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to delete category"
      );
    }
  }
);
