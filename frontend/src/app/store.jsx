import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import userReducer from "../features/user/usersSice";
import providerReducer from "../features/provider/providerSlice";
import mechanicReducer from "../features/mechanic/mechanicSlice";
import adminReducer from "../features/admin/adminSlice";
import onboardingReducer from "../features/onboarding/onboardingSlice";
import serviceCategoryReducer from "../features/serviceCategory/serviceCategorySlice";
import promotionReducer from "../features/promotion/promotionSlice";
import uiReducer from "../features/ui/uiSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  provider: providerReducer,
  mechanic: mechanicReducer,
  admin: adminReducer,
  onboarding: onboardingReducer,
  serviceCategory: serviceCategoryReducer,
  promotion: promotionReducer,
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
