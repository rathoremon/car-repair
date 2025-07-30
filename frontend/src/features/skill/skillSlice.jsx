import { createSlice } from "@reduxjs/toolkit";
import { fetchAllSkills } from "./skillThunks";

const initialState = {
  allSkills: [],
  loading: false,
  error: null,
};

const skillSlice = createSlice({
  name: "skill",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllSkills.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllSkills.fulfilled, (state, action) => {
        state.loading = false;
        state.allSkills = action.payload;
      })
      .addCase(fetchAllSkills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default skillSlice.reducer;
