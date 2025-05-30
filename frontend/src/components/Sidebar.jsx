import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Dashboard,
  People,
  Settings,
  Receipt,
  Campaign,
  Notifications,
  AdminPanelSettings,
  Assessment,
  AccountTree,
  AssignmentTurnedIn,
  Payment,
  SupportAgent,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const navItems = [
  { text: "Dashboard", icon: <Dashboard />, path: "/admin/dashboard" },
  { text: "Users", icon: <People />, path: "/admin/users" },
  { text: "Providers", icon: <AdminPanelSettings />, path: "/admin/providers" },
  { text: "Categories", icon: <Settings />, path: "/admin/categories" },
  { text: "Orders", icon: <Receipt />, path: "/admin/orders" },
  { text: "Disputes", icon: <SupportAgent />, path: "/admin/disputes" },
  { text: "Reports", icon: <Assessment />, path: "/admin/reports" },
  { text: "Promotions", icon: <Campaign />, path: "/admin/promotions" },
  {
    text: "Notifications",
    icon: <Notifications />,
    path: "/admin/notifications",
  },
  { text: "Roles & Access", icon: <AccountTree />, path: "/admin/rbac" },
  {
    text: "Audit Logs",
    icon: <AssignmentTurnedIn />,
    path: "/admin/audit-logs",
  },
  { text: "Subscriptions", icon: <Payment />, path: "/admin/subscriptions" },
  { text: "Pricing Rules", icon: <Settings />, path: "/admin/pricing" },
  { text: "Tickets", icon: <SupportAgent />, path: "/admin/tickets" },
  { text: "Reconciliation", icon: <Receipt />, path: "/admin/reconciliation" },
  { text: "BNPL Approvals", icon: <Payment />, path: "/admin/bnpl-approval" },
  { text: "Reminders", icon: <Notifications />, path: "/admin/reminders" },
  { text: "Feedback", icon: <Assessment />, path: "/admin/feedback" },
  {
    text: "Chat Analyzer",
    icon: <SupportAgent />,
    path: "/admin/chat-analyzer",
  },
];

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{ width: 240, flexShrink: 0 }}
    >
      <List sx={{ width: 240, pt: 2 }}>
        {navItems.map((item) => (
          <ListItemButton key={item.text} onClick={() => navigate(item.path)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}
