import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../utils/axios";

const ENDPOINT = "/api/provider/mechanics";

// Fetch all
export const fetchMechanics = createAsyncThunk(
  "mechanics/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await api.get(ENDPOINT, { params });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch by id
export const fetchMechanicById = createAsyncThunk(
  "mechanics/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`${ENDPOINT}/${id}`);
      return res.data.mechanic;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Create mechanic
export const createMechanic = createAsyncThunk(
  "mechanics/create",
  async (payload, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      // For arrays, use [] keys
      if (Array.isArray(payload.skillSet)) {
        payload.skillSet.forEach((id) => formData.append("skillSet[]", id));
      }
      Object.entries(payload).forEach(([k, v]) => {
        if (k === "skillSet") return; // already handled above
        if (k === "availability" || k === "address") {
          formData.append(k, typeof v === "string" ? v : JSON.stringify(v));
        } else if (k === "photo") {
          // skip, handled below
        } else if (v !== undefined && v !== null) {
          formData.append(k, v);
        }
      });
      if (payload.photo && typeof payload.photo !== "string") {
        formData.append("file", payload.photo);
      }
      const res = await api.post(ENDPOINT, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Update mechanic
export const updateMechanic = createAsyncThunk(
  "mechanics/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (k === "skillSet" || k === "availability" || k === "address") {
          formData.append(k, typeof v === "string" ? v : JSON.stringify(v));
        } else if (k === "photo") {
          // skip, handled below
        } else if (v !== undefined && v !== null) {
          formData.append(k, v);
        }
      });
      if (data.photo && typeof data.photo !== "string") {
        formData.append("file", data.photo);
      }
      const res = await api.put(`${ENDPOINT}/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.mechanic;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Delete
export const deleteMechanic = createAsyncThunk(
  "mechanics/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`${ENDPOINT}/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Reset password
export const resetMechanicPassword = createAsyncThunk(
  "mechanics/resetPassword",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.post(`${ENDPOINT}/${id}/reset-password`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
