import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import AuthPage from "./pages/auth/AuthPage";
import Dashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import ProviderManagement from "./pages/admin/ProviderManagement";
import ServiceCategoryMgmt from "./pages/admin/ServiceCategoryMgmt";
import OrdersPanel from "./pages/admin/OrdersPanel";
import DisputeResolution from "./pages/admin/DisputeResolution";
import ReportsAnalytics from "./pages/admin/ReportsAnalytics";
import PromoCampaignForm from "./pages/admin/PromoCampaignForm";
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
import AppLayout from "./components/AppLayout.jsx";
import Header from "./components/Header";

export default function App() {
  const userType = "admin"; // or "provider", "customer", etc.
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Optionally, set title and actions based on userType
  const headerTitle =
    userType === "admin"
      ? "Trasure Admin"
      : userType === "provider"
      ? "Trasure Provider"
      : "Trasure Customer";

  return (
    <Router>
      <Routes>
        {/* Auth page: no header/sidebar, handles both register and login */}
        <Route path="/register" element={<AuthPage />} />
        <Route path="/login" element={<AuthPage />} />

        {/* Protected pages: with header/sidebar */}
        <Route
          path="/*"
          element={
            <AppLayout
              HeaderComponent={
                <Header
                  toggleSidebar={() => setSidebarOpen(true)}
                  title={headerTitle}
                />
              }
              SidebarComponent={
                <Sidebar
                  userType={userType}
                  open={sidebarOpen}
                  onClose={() => setSidebarOpen(false)}
                />
              }
              sidebarOpen={sidebarOpen}
            >
              <main style={{ flexGrow: 1, padding: "24px" }}>
                <Routes>
                  <Route path="/admin/dashboard" element={<Dashboard />} />
                  <Route path="/admin/users" element={<UserManagement />} />
                  <Route
                    path="/admin/providers"
                    element={<ProviderManagement />}
                  />
                  <Route
                    path="/admin/categories"
                    element={<ServiceCategoryMgmt />}
                  />
                  <Route path="/admin/orders" element={<OrdersPanel />} />
                  <Route
                    path="/admin/disputes"
                    element={<DisputeResolution />}
                  />
                  <Route path="/admin/reports" element={<ReportsAnalytics />} />
                  <Route
                    path="/admin/promotions"
                    element={<PromoCampaignForm />}
                  />
                  <Route
                    path="/admin/cross-sell"
                    element={<CrossSellManager />}
                  />
                  <Route
                    path="/admin/notifications"
                    element={<NotificationPanel />}
                  />
                  <Route path="/admin/rbac" element={<RBACManager />} />
                  <Route path="/admin/audit-logs" element={<AuditLogs />} />
                  <Route
                    path="/admin/subscriptions"
                    element={<SubscriptionManager />}
                  />
                  <Route
                    path="/admin/pricing"
                    element={<DynamicPricingEngine />}
                  />
                  <Route path="/admin/tickets" element={<TicketsSystem />} />
                  <Route
                    path="/admin/reconciliation"
                    element={<ReconciliationDashboard />}
                  />
                  <Route
                    path="/admin/bnpl-approval"
                    element={<BNPLApproval />}
                  />
                  <Route path="/admin/reminders" element={<ReminderViewer />} />
                  <Route
                    path="/admin/feedback"
                    element={<FeedbackAnalytics />}
                  />
                  <Route
                    path="/admin/chat-analyzer"
                    element={<ChatTranscriptAnalyzer />}
                  />
                  <Route
                    path="*"
                    element={<Navigate to="/admin/dashboard" replace />}
                  />
                </Routes>
              </main>
            </AppLayout>
          }
        />
      </Routes>
    </Router>
  );
}
