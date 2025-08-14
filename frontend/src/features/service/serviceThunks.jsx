import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios.jsx";

// List (role inferred by server)
export const fetchRequests = createAsyncThunk(
  "service/fetchRequests",
  async ({ status, cursor, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      const params = {};
      if (status) params.status = status;
      if (cursor) params.cursor = cursor;
      if (limit) params.limit = limit;
      const { data } = await api.get("/api/service", { params });
      return {
        items: data?.data || [],
        nextCursor: data?.nextCursor || null,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { error: "Failed to fetch requests" }
      );
    }
  }
);

// Single
export const fetchRequestById = createAsyncThunk(
  "service/fetchRequestById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/api/service/${id}`);
      return data?.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { error: "Failed to fetch request" }
      );
    }
  }
);

// Create (customer)
export const createRequest = createAsyncThunk(
  "service/createRequest",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/service", payload);
      return data?.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { error: "Failed to create request" }
      );
    }
  }
);

// Provider/Admin
export const acceptRequest = createAsyncThunk(
  "service/acceptRequest",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/api/service/${id}/accept`);
      return data?.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { error: "Failed to accept request" }
      );
    }
  }
);

export const rejectRequest = createAsyncThunk(
  "service/rejectRequest",
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/api/service/${id}/reject`, { reason });
      return data?.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { error: "Failed to reject request" }
      );
    }
  }
);

export const assignMechanic = createAsyncThunk(
  "service/assignMechanic",
  async ({ id, mechanicId }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/api/service/${id}/assign-mechanic`, {
        mechanicId,
      });
      return data?.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { error: "Failed to assign mechanic" }
      );
    }
  }
);

export const setEstimate = createAsyncThunk(
  "service/setEstimate",
  async ({ id, amount }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/api/service/${id}/estimate`, { amount });
      return data?.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { error: "Failed to set estimate" }
      );
    }
  }
);

// Customer
export const approveEstimate = createAsyncThunk(
  "service/approveEstimate",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/api/service/${id}/estimate/approve`);
      return data?.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { error: "Failed to approve estimate" }
      );
    }
  }
);

// Status (mechanic/provider/admin)
export const updateStatus = createAsyncThunk(
  "service/updateStatus",
  async ({ id, toStatus, note, meta }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/api/service/${id}/status`, {
        toStatus,
        note,
        meta,
      });
      return data?.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { error: "Failed to update status" }
      );
    }
  }
);

// Notes
export const addNote = createAsyncThunk(
  "service/addNote",
  async ({ id, note, attachmentIds }, { rejectWithValue }) => {
    try {
      await api.post(`/api/service/${id}/notes`, { note, attachmentIds });
      return { id, note, attachmentIds };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { error: "Failed to add note" }
      );
    }
  }
);

// Timeline
export const fetchTimeline = createAsyncThunk(
  "service/fetchTimeline",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/api/service/${id}/timeline`);
      return { id, items: data?.data || [] };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { error: "Failed to fetch timeline" }
      );
    }
  }
);
