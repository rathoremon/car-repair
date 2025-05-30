import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    sidebarOpen: false,
    sidebarCollapsed: false,
    loading: false,
    alert: null,
    modal: null,
    theme: "light",
  },
  reducers: {
    setSidebarOpen(state, action) {
      state.sidebarOpen = action.payload;
    },
    setSidebarCollapsed(state, action) {
      state.sidebarCollapsed = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setAlert(state, action) {
      state.alert = action.payload;
    },
    setModal(state, action) {
      state.modal = action.payload;
    },
    setTheme(state, action) {
      state.theme = action.payload;
    },
    clearUi(state) {
      return {
        sidebarOpen: false,
        sidebarCollapsed: false,
        loading: false,
        alert: null,
        modal: null,
        theme: "light",
      };
    },
  },
});

export const {
  setSidebarOpen,
  setSidebarCollapsed,
  setLoading,
  setAlert,
  setModal,
  setTheme,
  clearUi,
} = uiSlice.actions;

export default uiSlice.reducer;
