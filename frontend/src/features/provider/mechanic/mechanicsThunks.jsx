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
      for (const key in data) {
        if (key === "skillSet" || key === "availability" || key === "address") {
          formData.append(key, JSON.stringify(data[key]));
        } else if (key === "photo" && typeof data[key] !== "string") {
          formData.append("file", data[key]);
        } else if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      }

      const url =
        id === "self"
          ? "/api/provider/mechanics/self"
          : `/api/provider/mechanics/${id}`;

      const res = await api.put(url, formData);
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
  async ({ id, generateNew = false }, { rejectWithValue }) => {
    try {
      const res = await api.post(`${ENDPOINT}/${id}/reset-password`, {
        generateNew,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const registerSelfAsMechanic = createAsyncThunk(
  "mechanics/registerSelf",
  async (formData, thunkAPI) => {
    try {
      const res = await api.post(
        "/provider/mechanics/register-self",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);
