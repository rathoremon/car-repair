import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios";

const BASE = "/api/admin/promotion";
const ACTIVE = `/api/promotion`;

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

export const fetchActivePromotions = createAsyncThunk(
  "promotion/fetchActive",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`${ACTIVE}/active`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch active promotions"
      );
    }
  }
);

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
