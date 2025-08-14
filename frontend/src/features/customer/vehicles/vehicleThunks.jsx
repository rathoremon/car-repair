import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../utils/axios";

export const fetchVehicles = createAsyncThunk(
  "vehicles/fetchVehicles",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/vehicles");
      return data.data || [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch vehicles"
      );
    }
  }
);

export const createVehicle = createAsyncThunk(
  "vehicles/createVehicle",
  async (payload, { rejectWithValue }) => {
    try {
      // ensure uppercase REG no
      if (payload?.registrationNumber)
        payload.registrationNumber = String(
          payload.registrationNumber
        ).toUpperCase();

      const { data } = await api.post("/api/vehicles", payload);
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to create vehicle"
      );
    }
  }
);

export const updateVehicle = createAsyncThunk(
  "vehicles/updateVehicle",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      if (updates?.registrationNumber)
        updates.registrationNumber = String(
          updates.registrationNumber
        ).toUpperCase();
      const { data } = await api.put(`/api/vehicles/${id}`, updates);
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to update vehicle"
      );
    }
  }
);

export const deleteVehicle = createAsyncThunk(
  "vehicles/deleteVehicle",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/vehicles/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to delete vehicle"
      );
    }
  }
);

export const uploadVehiclePhoto = createAsyncThunk(
  "vehicles/uploadVehiclePhoto",
  async ({ id, file }, { rejectWithValue }) => {
    try {
      const form = new FormData();
      form.append("file", file); // field name must be "file"
      // no need to send "type" here; this endpoint is dedicated to vehicle photos

      const { data } = await api.post(`/api/vehicles/${id}/photo`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.data; // updated vehicle
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to upload vehicle photo"
      );
    }
  }
);
