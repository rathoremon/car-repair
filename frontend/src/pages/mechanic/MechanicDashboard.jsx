// src/pages/mechanic/MechanicDashboard.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { setActiveRole } from "../../features/auth/authSlice";

import DashboardHeader from "../../components/mechanic/Dashboard/DashboardHeader";
import StatCard from "../../components/mechanic/Dashboard/StatCard";
import TodaySchedule from "../../components/mechanic/Dashboard/TodaySchedule";
import QuickActions from "../../components/mechanic/Dashboard/QuickActions";
import ConfirmDialog from "../../components/common/ConfirmDialog";

export default function MechanicDashboard() {
  const stats = [
    {
      title: "Active Jobs",
      value: 4,
      icon: "BuildCircle",
      color: "primary",
      link: "/mechanic/jobs",
    },
    {
      title: "Pending Jobs",
      value: 2,
      icon: "PendingActions",
      color: "warning",
      link: "/mechanic/jobs?status=pending",
    },
    {
      title: "Jobs In Progress",
      value: 1,
      icon: "HourglassEmpty",
      color: "info",
      link: "/mechanic/jobs?status=inprogress",
    },
    {
      title: "Completed Jobs",
      value: 12,
      icon: "AssignmentTurnedIn",
      color: "success",
      link: "/mechanic/jobs?status=completed",
    },
  ];

  const todayJobs = [
    {
      time: "10:30 AM",
      vehicle: "Maruti Swift - DL8CAF1234",
      location: "Sector 62, Noida",
      status: "Pending",
    },
    {
      time: "3:00 PM",
      vehicle: "Hyundai i20 - UP16AF9921",
      location: "Indirapuram",
      status: "In Progress",
    },
  ];

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const gridSpacing = isMobile ? 5 : isTablet ? 3 : 10;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((s) => s.auth);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingRole, setPendingRole] = useState(null);
  const [rollbackFn, setRollbackFn] = useState(null);
  const [displayedRole, setDisplayedRole] = useState(() => {
    if (location.pathname.startsWith("/provider")) return "provider";
    if (location.pathname.startsWith("/mechanic")) return "mechanic";
    return "";
  });

  useEffect(() => {
    if (location.pathname.startsWith("/provider")) setDisplayedRole("provider");
    else if (location.pathname.startsWith("/mechanic"))
      setDisplayedRole("mechanic");
  }, [location.pathname]);

  const handleConfirm = () => {
    dispatch(setActiveRole(pendingRole)); // async update
    localStorage.setItem("activeRole", pendingRole);

    // Delay navigation to next tick so Redux has time to update state
    setTimeout(() => {
      navigate(
        pendingRole === "provider"
          ? "/provider/dashboard"
          : "/mechanic/dashboard"
      );
    }, 10); // even 10ms is enough
    setConfirmOpen(false);
  };

  const handleCancel = () => {
    if (location.pathname.startsWith("/provider")) setDisplayedRole("provider");
    else if (location.pathname.startsWith("/mechanic"))
      setDisplayedRole("mechanic");
    setConfirmOpen(false);
  };

  const handleToggleAttempt = (newRole) => {
    setPendingRole(newRole);
    setDisplayedRole(newRole); // animate first
    setConfirmOpen(true);
  };

  return (
    <Box>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <DashboardHeader
          currentRole={displayedRole}
          onToggleConfirm={handleToggleAttempt}
        />
        <Box mt={3}>
          <Grid
            container
            spacing={gridSpacing}
            justifyContent={isMobile ? "center" : "flex-start"}
          >
            {stats.map((item, idx) => (
              <Grid item key={idx} xs={12} sm={6} md={3}>
                <StatCard {...item} />
              </Grid>
            ))}
          </Grid>
        </Box>
        <Divider sx={{ my: 5 }} />
        <TodaySchedule jobs={todayJobs} />
        <Divider sx={{ my: 5 }} />
        <QuickActions />
      </Container>

      <ConfirmDialog
        open={confirmOpen}
        title="Switch Role?"
        description={`You're about to switch to the ${pendingRole} module. Unsaved changes may be lost.`}
        confirmText="Switch"
        cancelText="Cancel"
        onClose={handleCancel}
        onConfirm={handleConfirm}
      />
    </Box>
  );
}
