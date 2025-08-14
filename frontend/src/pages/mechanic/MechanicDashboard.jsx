// src/pages/mechanic/MechanicDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
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

// service module
import {
  fetchRequests,
  updateStatus,
} from "../../features/service/serviceThunks";
import {
  selectRequestsList,
  selectListLoading, // ⬅️ use real loading
} from "../../features/service/serviceSelectors";

export default function MechanicDashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const gridSpacing = isMobile ? 5 : isTablet ? 3 : 10;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Assigned to current mechanic
  const requests = useSelector(selectRequestsList);
  const listLoading = useSelector(selectListLoading); // ⬅️ real loading

  // Load my assigned requests (server scopes by token -> mechanicId)
  useEffect(() => {
    dispatch(fetchRequests({}));
  }, [dispatch]);

  // ---- Stats derived from requests ----
  const counts = useMemo(() => {
    const c = { active: 0, pending: 0, inProgress: 0, completed: 0 };
    for (const r of requests) {
      switch (r.status) {
        case "MECHANIC_ASSIGNED":
          c.pending += 1;
          break;
        case "ESTIMATE_APPROVED":
        case "EN_ROUTE":
          c.active += 1;
          break;
        case "IN_PROGRESS":
          c.active += 1;
          c.inProgress += 1;
          break;
        case "COMPLETED":
          c.completed += 1;
          break;
        default:
          break;
      }
    }
    return c;
  }, [requests]);

  const stats = useMemo(
    () => [
      {
        title: "Active Jobs",
        value: counts.active,
        icon: "BuildCircle",
        color: "primary",
        link: "/mechanic/jobs",
      },
      {
        title: "Pending Jobs",
        value: counts.pending,
        icon: "PendingActions",
        color: "warning",
        link: "/mechanic/jobs?status=pending",
      },
      {
        title: "Jobs In Progress",
        value: counts.inProgress,
        icon: "HourglassEmpty",
        color: "info",
        link: "/mechanic/jobs?status=inprogress",
      },
      {
        title: "Completed Jobs",
        value: counts.completed,
        icon: "AssignmentTurnedIn",
        color: "success",
        link: "/mechanic/jobs?status=completed",
      },
    ],
    [counts]
  );

  // ---- Today's jobs (simple derivation) ----
  const todayJobs = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const toTime = (d) =>
      new Date(d).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

    return requests
      .filter((r) => {
        const created = new Date(r.createdAt);
        return created >= start && created <= end;
      })
      .slice(0, 6)
      .map((r) => ({
        time: toTime(r.createdAt),
        vehicle:
          r?.vehicle?.displayName ||
          r?.vehicle?.registrationNumber ||
          r.breakdownType ||
          "Vehicle",
        location:
          r?.location?.address || `${r?.location?.lat}, ${r?.location?.lng}`,
        status:
          r.status === "MECHANIC_ASSIGNED"
            ? "Pending"
            : r.status === "EN_ROUTE"
            ? "En Route"
            : r.status === "IN_PROGRESS"
            ? "In Progress"
            : r.status === "COMPLETED"
            ? "Completed"
            : r.status?.replaceAll("_", " ") || "—",
        // TODO: replace with a mechanic detail route when you add it
        onClick: () => navigate(`/customer/service/${r.id}`),
      }));
  }, [requests, navigate]);

  // ---- Role toggle UX ----
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingRole, setPendingRole] = useState(null);
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
    dispatch(setActiveRole(pendingRole));
    localStorage.setItem("activeRole", pendingRole);
    setTimeout(() => {
      navigate(
        pendingRole === "provider"
          ? "/provider/dashboard"
          : "/mechanic/dashboard"
      );
    }, 10);
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
    setDisplayedRole(newRole);
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

        {/* Today schedule from real requests */}
        <TodaySchedule
          jobs={todayJobs}
          loading={listLoading} // ⬅️ use real loading
          onRefresh={() => dispatch(fetchRequests({}))}
          onViewAll={() => navigate("/mechanic/jobs")}
        />

        <Divider sx={{ my: 5 }} />

        <QuickActions
          onStartJob={(requestId) =>
            dispatch(updateStatus({ id: requestId, toStatus: "EN_ROUTE" }))
          }
          onMarkInProgress={(requestId) =>
            dispatch(updateStatus({ id: requestId, toStatus: "IN_PROGRESS" }))
          }
          onCompleteJob={(requestId) =>
            dispatch(updateStatus({ id: requestId, toStatus: "COMPLETED" }))
          }
        />
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
