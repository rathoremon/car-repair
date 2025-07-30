import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllPromotions,
  fetchActivePromotions,
  createPromotion,
  deletePromotion,
  updatePromotion,
} from "./promotionThunks";

const initialState = {
  banners: [],
  active: [],
  loading: false,
  error: null,
};

const promotionSlice = createSlice({
  name: "promotion",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPromotions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllPromotions.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = action.payload;
      })
      .addCase(fetchAllPromotions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchActivePromotions.fulfilled, (state, action) => {
        state.active = action.payload;
      })
      .addCase(createPromotion.fulfilled, (state, action) => {
        state.banners.unshift(action.payload);
      })
      .addCase(updatePromotion.fulfilled, (state, action) => {
        state.banners = state.banners.map((b) =>
          b.id === action.payload.id ? action.payload : b
        );
      })
      .addCase(deletePromotion.fulfilled, (state, action) => {
        state.banners = state.banners.filter((b) => b.id !== action.payload);
      });
  },
});

export default promotionSlice.reducer;
