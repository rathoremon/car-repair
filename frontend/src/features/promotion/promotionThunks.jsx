// features/promotion/promotionThunks.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios"; // Ensure this points to the axios.create({ baseURL }) setup

// Admin route prefix
const BASE = "/api/admin/promotion";

// Fetch all banners (admin)
export const fetchAllPromotions = createAsyncThunk(
  "promotion/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(BASE);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch promotions"
      );
    }
  }
);

// Fetch active banners (public, no auth required)
export const fetchActivePromotions = createAsyncThunk(
  "promotion/fetchActive",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`${BASE}/active`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch active promotions"
      );
    }
  }
);

// Create new banner
export const createPromotion = createAsyncThunk(
  "promotion/create",
  async (promotionData, { rejectWithValue }) => {
    try {
      const res = await api.post(BASE, promotionData);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create promotion"
      );
    }
  }
);

// Delete a banner
export const deletePromotion = createAsyncThunk(
  "promotion/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`${BASE}/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete promotion"
      );
    }
  }
);

// Optional: Update banner
export const updatePromotion = createAsyncThunk(
  "promotion/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`${BASE}/${id}`, data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update promotion"
      );
    }
  }
);
