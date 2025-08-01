// src/pages/mechanic/MechanicDashboard.jsx
import React from "react";
import {
  Box,
  Container,
  Grid,
  Divider,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DashboardHeader from "../../components/mechanic/Dashboard/DashboardHeader";
import StatCard from "../../components/mechanic/Dashboard/StatCard";
import TodaySchedule from "../../components/mechanic/Dashboard/TodaySchedule";
import QuickActions from "../../components/mechanic/Dashboard/QuickActions";

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

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <DashboardHeader />

      {/* ---- Stats Section ---- */}
      <Box mt={3}>
        <Grid
          container
          spacing={gridSpacing}
          sx={{
            display: "flex",
            justifyContent: isMobile ? "center" : "left",
            alignItems: "center",
          }}
        >
          {stats.map((item, idx) => (
            <Grid item key={idx} xs={12} sm={6} md={3}>
              <StatCard {...item} />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ my: 5 }} />

      {/* ---- Today's Schedule ---- */}
      <TodaySchedule jobs={todayJobs} />

      <Divider sx={{ my: 5 }} />

      {/* ---- Quick Actions ---- */}
      <QuickActions />
    </Container>
  );
}
