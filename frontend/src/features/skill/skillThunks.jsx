import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios";

// Fetch all active skills
export const fetchAllSkills = createAsyncThunk(
  "skill/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/skills");
      return res.data.data || [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch skills"
      );
    }
  }
);
