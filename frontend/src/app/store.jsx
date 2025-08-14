import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import userReducer from "../features/user/usersSice";
import providerReducer from "../features/provider/providerSlice";
import mechanicReducer from "../features/mechanic/mechanicSlice";
import adminReducer from "../features/admin/adminSlice";
import onboardingReducer from "../features/onboarding/onboardingSlice";
import serviceCategoryReducer from "../features/serviceCategory/serviceCategorySlice";
import promotionReducer from "../features/promotion/promotionSlice";
import providerDashboard from "../features/provider/Dashboard/dashboardSlice";
import skillReducer from "../features/skill/skillSlice";
import uiReducer from "../features/ui/uiSlice";
import mechanicsReducer from "../features/provider/mechanic/mechanicsSlice";
import serviceReducer from "../features/service/serviceSlice";
import vehiclesReducer from "../features/customer/vehicles/vehicleSlice";
const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  vehicles: vehiclesReducer,
  provider: providerReducer,
  mechanic: mechanicReducer,
  admin: adminReducer,
  onboarding: onboardingReducer,
  serviceCategory: serviceCategoryReducer,
  skill: skillReducer,
  service: serviceReducer,
  promotion: promotionReducer,
  mechanics: mechanicsReducer,
  providerDashboard,
  ui: uiReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
