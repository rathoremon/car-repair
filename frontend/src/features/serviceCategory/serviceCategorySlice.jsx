import { createSlice } from "@reduxjs/toolkit";
import {
  fetchServiceCategories,
  createServiceCategory,
  updateServiceCategory,
  deleteServiceCategory,
} from "./serviceCategoryThunks";

const initialState = {
  categories: [],
  meta: { total: 0, page: 1, pages: 1 },
  loading: false,
  error: null,
  selectedCategory: null,

  searchTerm: "",
  filterStatus: "all",
  filterEmergency: "all",
  sortOrder: "name",
  sortDir: "asc",
  page: 1,
  limit: 20,
};

const serviceCategorySlice = createSlice({
  name: "serviceCategory",
  initialState,
  reducers: {
    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
    },
    setFilterStatus(state, action) {
      state.filterStatus = action.payload;
    },
    setFilterEmergency(state, action) {
      state.filterEmergency = action.payload;
    },
    setSortOrder(state, action) {
      state.sortOrder = action.payload;
    },
    clearSelectedCategory(state) {
      state.selectedCategory = null;
    },
    setSelectedCategory(state, action) {
      state.selectedCategory = action.payload;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
    setLimit(state, action) {
      state.limit = action.payload;
      state.page = 1;
    },
    setSortDir(state, action) {
      state.sortDir = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServiceCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiceCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.data || [];
        state.meta = action.payload.meta || { total: 0, page: 1, pages: 1 };
      })
      .addCase(fetchServiceCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createServiceCategory.fulfilled, (state, action) => {
        state.categories.unshift(action.payload);
      })
      .addCase(updateServiceCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(
          (cat) => cat.id === action.payload.id
        );
        if (index !== -1) state.categories[index] = action.payload;
        // Update selectedCategory if it matches
        if (
          state.selectedCategory &&
          state.selectedCategory.id === action.payload.id
        ) {
          state.selectedCategory = action.payload;
        }
      })
      .addCase(deleteServiceCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (cat) => cat.id !== action.payload
        );
      });
  },
});

export const {
  setSearchTerm,
  setFilterStatus,
  setFilterEmergency,
  setSortDir,
  setPage,
  setLimit,
  setSortOrder,
  clearSelectedCategory,
  setSelectedCategory,
} = serviceCategorySlice.actions;

export default serviceCategorySlice.reducer;
