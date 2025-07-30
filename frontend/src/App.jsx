// ✅ Full App.jsx with Provider KYC Access Enforcement
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

// Auth & Onboarding
import AuthPage from "./pages/auth/AuthPage";
import VerifyOtp from "./pages/auth/VerifyOtp";
import Onboarding from "./pages/onboarding/Onboarding";
import { refreshUser } from "./features/auth/authThunks";

// Layout Components
import AppLayout from "./components/AppLayout.jsx";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

// Customer Pages
import Home from "./pages/customer/Home.jsx";
import Profile from "./pages/customer/Profile.jsx";
import Vehicle from "./pages/customer/VehicleDashboard.jsx";
import AppointmentBooking from "./pages/customer/AppointmentBooking";
import ServiceHistory from "./pages/customer/ServiceHistory";
import BNPLPage from "./pages/customer/BNPL";
import LiveTracking from "./pages/customer/LiveTracking";
import ChatPanel from "./pages/customer/Chat";
import ReminderPanel from "./pages/customer/Reminders";
import SOSPage from "./pages/customer/SOS";
import FleetManagement from "./pages/customer/FleetManagement";

// Provider Pages
import ProviderDashboard from "./pages/provider/Dashboard";
import ProviderRequests from "./pages/provider/Assignments";
import ProviderOffers from "./pages/provider/OfferManagement";
import PayoutsDashboard from "./pages/provider/PayoutDashboard";
import AvailabilitySchedule from "./pages/provider/AvailabilitySchedule";
import ProviderGarageOnboarding from "./pages/onboarding/provider/ProviderGarageOnboarding.jsx";
import MechanicsPage from "./pages/provider/MechanicsPage.jsx";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import ProviderManagement from "./pages/admin/ProviderManagement";
import ServiceCategoryMgmt from "./pages/admin/ServiceCategoryMgmt";
import OrdersPanel from "./pages/admin/OrdersPanel";
import DisputeResolution from "./pages/admin/DisputeResolution";
import ReportsAnalytics from "./pages/admin/ReportsAnalytics";
import PromoCampaignForm from "./pages/admin/Promotion.jsx";
import CrossSellManager from "./pages/admin/CrossSellManager";
import NotificationPanel from "./pages/admin/NotificationPanel";
import RBACManager from "./pages/admin/RBACManager";
import AuditLogs from "./pages/admin/AuditLogs";
import SubscriptionManager from "./pages/admin/SubscriptionManager";
import DynamicPricingEngine from "./pages/admin/DynamicPricingEngine";
import TicketsSystem from "./pages/admin/TicketsSystem";
import ReconciliationDashboard from "./pages/admin/ReconciliationDashboard";
import BNPLApproval from "./pages/admin/BNPLApproval";
import ReminderViewer from "./pages/admin/ReminderViewer";
import FeedbackAnalytics from "./pages/admin/FeedbackAnalytics";
import ChatTranscriptAnalyzer from "./pages/admin/ChatTranscriptAnalyzer";

// Mechanic Pages
import MechanicDashboard from "./pages/mechanic/MechanicDashboard.jsx";

// Access Control & Routing
import { CircularProgress } from "@mui/material";
import { RoleGate } from "./utils/roleGate";
import ProtectedRoute from "./routes/ProtectedRoute";
import { ProviderAccessGuard } from "./hooks/useProviderAccessGuard";
import ProviderKycPending from "./pages/provider/ProviderKycPending.jsx";
import SetNewPassword from "./pages/auth/SetNewPassword.jsx";
import RoleSelector from "./pages/auth/RoleSelector.jsx";

export default function App() {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { role, user, token, loading, hydrated } = useSelector(
    (state) => state.auth
  );

  const shouldBlockRender = token && (!hydrated || loading);

  console.log("[App] hydrated:", hydrated, "loading:", loading);
  console.log("user ", user);

  // Dynamic header title per role
  const headerTitle =
    role === "admin"
      ? "Trasure Admin"
      : role === "provider"
      ? "Trasure Provider"
      : "Trasure Customer";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      console.log("[App] Dispatching refreshUser()");

      dispatch(refreshUser());
    } else {
      console.log("[App] No token found, skipping refreshUser");
      dispatch({ type: "auth/refreshUser/rejected" }); // 👈 Force set hydrated
    }
  }, [dispatch]);

  return (
    <>
      {shouldBlockRender ? (
        <div className="flex items-center justify-center h-screen">
          <CircularProgress size={50} />
          <span> APP</span>
        </div>
      ) : (
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/set-password" element={<SetNewPassword />} />
          <Route path="/select-role" element={<RoleSelector />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          {/* Onboarding Flow */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            }
          />
          {/* Customer Routes */}
          <Route
            path="/customer/*"
            element={
              <ProtectedRoute requireOnboarding>
                <RoleGate allowed={["customer"]}>
                  <AppLayout
                    HeaderComponent={
                      <Header
                        sidebarOpen={sidebarOpen}
                        toggleSidebar={() => setSidebarOpen(true)}
                        title={headerTitle}
                      />
                    }
                    SidebarComponent={
                      <Sidebar
                        open={sidebarOpen}
                        onClose={() => setSidebarOpen(false)}
                      />
                    }
                    sidebarOpen={sidebarOpen}
                  />
                </RoleGate>
              </ProtectedRoute>
            }
          >
            <Route path="home" element={<Home />} />
            <Route path="profile" element={<Profile />} />
            <Route path="vehicles" element={<Vehicle />} />
            <Route path="bnpl" element={<BNPLPage />} />
            <Route path="fleet" element={<FleetManagement />} />
            <Route path="appointments" element={<AppointmentBooking />} />
            <Route path="live-tracking" element={<LiveTracking />} />
            <Route path="service-history" element={<ServiceHistory />} />
            <Route path="reminders" element={<ReminderPanel />} />
            <Route path="chat" element={<ChatPanel />} />
            <Route path="sos" element={<SOSPage />} />
            {/* <Route path="service-request" element={null} /> */}
            {/* <Route path="notifications" element={null} /> */}
            {/* <Route path="payments" element={null} /> */}
            <Route
              path="*"
              element={<Navigate to="/customer/home" replace />}
            />
          </Route>
          {/* Provider Routes (KYC Guarded) */}
          <Route
            path="/provider/*"
            element={
              <ProtectedRoute requireOnboarding>
                <RoleGate allowed={["provider"]}>
                  <ProviderAccessGuard>
                    <AppLayout
                      HeaderComponent={
                        <Header
                          sidebarOpen={sidebarOpen}
                          toggleSidebar={() => setSidebarOpen(true)}
                          title={headerTitle}
                        />
                      }
                      SidebarComponent={
                        <Sidebar
                          userType="provider"
                          open={sidebarOpen}
                          onClose={() => setSidebarOpen(false)}
                        />
                      }
                      sidebarOpen={sidebarOpen}
                    />
                  </ProviderAccessGuard>
                </RoleGate>
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<ProviderDashboard />} />
            <Route path="availability" element={<AvailabilitySchedule />} />
            <Route path="offers" element={<ProviderOffers />} />
            {/* KYC Onboarding */}
            <Route path="onboarding" element={<ProviderGarageOnboarding />} />
            <Route path="pending" element={<ProviderKycPending />} />
            {/* fallback */}

            {/* <Route path="kyc" element={null} /> */}
            {/* <Route path="profile" element={null} /> */}
            {/* <Route path="pricing" element={null} /> */}
            {/* <Route path="tier-plans" element={null} /> */}
            <Route path="mechanics" element={<MechanicsPage />} />
            {/* <Route path="inventory" element={null} /> */}
            {/* <Route path="chat" element={null} /> */}
            {/* <Route path="invoices" element={null} /> */}
            {/* <Route path="sla" element={null} /> */}
            {/* <Route path="feedback" element={null} /> */}
            {/* <Route path="earnings" element={null} /> */}
            <Route
              path="*"
              element={<Navigate to="/provider/dashboard" replace />}
            />
          </Route>
          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <RoleGate allowed={["admin"]}>
                  <AppLayout
                    HeaderComponent={
                      <Header
                        sidebarOpen={sidebarOpen}
                        toggleSidebar={() => setSidebarOpen(true)}
                        title={headerTitle}
                      />
                    }
                    SidebarComponent={
                      <Sidebar
                        userType="admin"
                        open={sidebarOpen}
                        onClose={() => setSidebarOpen(false)}
                      />
                    }
                    sidebarOpen={sidebarOpen}
                  />
                </RoleGate>
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="providers" element={<ProviderManagement />} />
            <Route
              path="service-categories"
              element={<ServiceCategoryMgmt />}
            />
            <Route path="orders" element={<OrdersPanel />} />
            <Route path="disputes" element={<DisputeResolution />} />
            <Route path="analytics" element={<ReportsAnalytics />} />
            <Route path="promotions" element={<PromoCampaignForm />} />
            <Route path="cross-sell" element={<CrossSellManager />} />
            <Route path="notifications" element={<NotificationPanel />} />
            <Route path="rbac" element={<RBACManager />} />
            <Route path="audit-logs" element={<AuditLogs />} />
            <Route path="subscriptions" element={<SubscriptionManager />} />
            <Route path="pricing-rules" element={<DynamicPricingEngine />} />
            <Route path="tickets" element={<TicketsSystem />} />
            <Route
              path="reconciliation"
              element={<ReconciliationDashboard />}
            />
            <Route path="bnpl" element={<BNPLApproval />} />
            <Route path="reminders" element={<ReminderViewer />} />
            <Route path="feedback" element={<FeedbackAnalytics />} />
            <Route
              path="chat-transcripts"
              element={<ChatTranscriptAnalyzer />}
            />
            <Route
              path="*"
              element={<Navigate to="/admin/dashboard" replace />}
            />
          </Route>
          {/* Mechanic Routes */}
          <Route
            path="/mechanic/*"
            element={
              <RoleGate allowed={["mechanic"]}>
                <AppLayout
                  HeaderComponent={
                    <Header
                      sidebarOpen={sidebarOpen}
                      toggleSidebar={() => setSidebarOpen(true)}
                      title="Trasure Mechanic"
                    />
                  }
                  SidebarComponent={
                    <Sidebar
                      userType="mechanic"
                      open={sidebarOpen}
                      onClose={() => setSidebarOpen(false)}
                    />
                  }
                  sidebarOpen={sidebarOpen}
                />
              </RoleGate>
            }
          >
            <Route path="dashboard" element={<MechanicDashboard />} />
            {/* <Route path="jobs" element={<AssignedJobs />} /> */}
            {/* <Route path="job/:id" element={<JobDetail />} /> */}
            {/* <Route path="update-status" element={<UpdateWorkStatus />} /> */}
            {/* <Route path="chat/provider" element={<ChatProvider />} /> */}
            {/* <Route path="chat/customer" element={<ChatCustomer />} /> */}
            <Route
              path="*"
              element={<Navigate to="/mechanic/dashboard" replace />}
            />
          </Route>
          {/* Fallback: Role-based Redirect */}
          <Route
            path="*"
            element={
              token ? (
                <Navigate
                  to={
                    role === "admin"
                      ? "/admin/dashboard"
                      : role === "provider"
                      ? "/provider/dashboard"
                      : role === "mechanic"
                      ? "/mechanic/dashboard"
                      : "/customer/home"
                  }
                  replace
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      )}
    </>
  );
}
