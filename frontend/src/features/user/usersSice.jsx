import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    vehicles: [],
    location: null,
    reminders: [],
    preferences: {},
  },
  reducers: {
    setVehicles(state, action) {
      state.vehicles = action.payload;
    },
    addVehicle(state, action) {
      state.vehicles.push(action.payload);
    },
    setLocation(state, action) {
      state.location = action.payload;
    },
    setReminders(state, action) {
      state.reminders = action.payload;
    },
    setPreferences(state, action) {
      state.preferences = action.payload;
    },
    clearUser(state) {
      return { vehicles: [], location: null, reminders: [], preferences: {} };
    },
  },
});

export const {
  setVehicles,
  addVehicle,
  setLocation,
  setReminders,
  setPreferences,
  clearUser,
} = userSlice.actions;

export default userSlice.reducer;
