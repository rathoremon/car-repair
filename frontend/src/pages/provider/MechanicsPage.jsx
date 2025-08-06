// src/pages/provider/MechanicsPage.jsx
import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  Stack,
  Paper,
  Slide,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import BlockIcon from "@mui/icons-material/Block";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import MechanicList from "../../components/provider/mechanic/MechanicList";
import MechanicFormDialog from "../../components/provider/mechanic/MechanicFormDialog";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import RoleSwitch from "../../components/common/RoleSwitch";
import { setActiveRole } from "../../features/auth/authSlice";

export default function MechanicsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { list } = useSelector((s) => s.mechanics);
  const { user, activeRole } = useSelector((s) => s.auth);

  const [formOpen, setFormOpen] = useState(false);
  const [mechanicId, setMechanicId] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingRole, setPendingRole] = useState(null);
  const [switchingRole, setSwitchingRole] = useState(false);
  const [displayedRole, setDisplayedRole] = useState(activeRole);

  useEffect(() => {
    setDisplayedRole(activeRole);
  }, [activeRole]);

  const handleToggleAttempt = (newRole) => {
    if (!newRole || newRole === activeRole) return;
    setPendingRole(newRole);
    setDisplayedRole(newRole); // animate switch
    setTimeout(() => {
      setConfirmOpen(true); // show dialog after animation delay
    }, 300); // should match RoleSwitch thumb transition
  };

  const handleConfirm = () => {
    setConfirmOpen(false);
    setSwitchingRole(true); // this sets loader

    // Delay dispatch+navigation in a batch (after next frame)
    requestAnimationFrame(() => {
      dispatch(setActiveRole(pendingRole));
      localStorage.setItem("activeRole", pendingRole);

      // Small buffer to let Redux apply
      setTimeout(() => {
        navigate(
          pendingRole === "provider"
            ? "/provider/dashboard"
            : "/mechanic/dashboard"
        );
      }, 10);
    });
  };

  const handleCancel = () => {
    setDisplayedRole(activeRole); // rollback
    setConfirmOpen(false);
  };

  const showToast = (type, message, options) => {
    if (type === "success") toast.success(message, options);
    else if (type === "error") toast.error(message, options);
    else toast(message, options);
  };

  const stats = useMemo(() => {
    const total = list.length;
    let active = 0,
      pending = 0,
      suspended = 0;
    list.forEach((m) => {
      if (m.status === "active") active += 1;
      else if (m.status === "pending") pending += 1;
      else if (m.status === "suspended") suspended += 1;
    });
    return { total, active, pending, suspended };
  }, [list]);

  const openAddMechanic = () => {
    setMechanicId(null);
    setFormOpen(true);
  };

  const openEditMechanic = (id) => {
    setMechanicId(id);
    setFormOpen(true);
  };

  const openSelfRegister = () => {
    setMechanicId("self");
    setFormOpen(true);
  };

  if (switchingRole) {
    return (
      <Box
        sx={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "background.default",
          zIndex: 9999,
          position: "fixed",
          top: 0,
          left: 0,
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor: "background.default",
        px: { xs: 1, sm: 2.5 },
        py: { xs: 2, sm: 3 },
        overflowX: "hidden",
      }}
    >
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        style={{ zIndex: 15000 }}
        pauseOnHover
        theme="colored"
      />

      <Box
        sx={{
          width: "100%",
          maxWidth: 1350,
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {/* --- Header --- */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          spacing={2}
        >
          <Typography
            variant={isMobile ? "h5" : "h4"}
            sx={{
              fontWeight: 800,
              color: "primary.main",
              lineHeight: 1.3,
              letterSpacing: 0.5,
            }}
          >
            Mechanic Management
          </Typography>
          {/* --- Role Switch --- */}
          {user?.hasProviderProfile && user?.hasMechanicProfile && (
            <Slide direction="down" in mountOnEnter unmountOnExit>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 1,
                }}
              >
                <RoleSwitch
                  currentRole={displayedRole}
                  onToggleConfirm={handleToggleAttempt}
                />
              </Box>
            </Slide>
          )}
        </Stack>

        {/* --- Stats --- */}
        <Paper
          elevation={1}
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            justifyContent: "flex-start",
            background: "#f5f8fd",
            p: 2.5,
            borderRadius: 1,
            boxShadow: "0 1px 5px rgba(0,0,0,0.04)",
          }}
        >
          <StatBox
            icon={<GroupIcon />}
            label="Total Mechanics"
            count={stats.total}
            color="#2b70e4"
          />
          <StatBox
            icon={<CheckCircleIcon />}
            label="Active"
            count={stats.active}
            color="#1aa881"
          />
          <StatBox
            icon={<PendingActionsIcon />}
            label="Pending"
            count={stats.pending}
            color="#ffa11a"
          />
          <StatBox
            icon={<BlockIcon />}
            label="Suspended"
            count={stats.suspended}
            color="#e74c3c"
          />
        </Paper>

        {/* --- Table --- */}
        <MechanicList
          onAddMechanic={openAddMechanic}
          onEditMechanic={openEditMechanic}
          onSelfRegister={openSelfRegister}
          onShowToast={showToast}
        />

        {/* --- Dialogs --- */}
        <MechanicFormDialog
          open={formOpen}
          onClose={() => {
            setFormOpen(false);
            setMechanicId(null);
          }}
          mechanicId={mechanicId}
          onSuccess={() => {
            showToast(
              "success",
              mechanicId === "self"
                ? "Successfully registered as a mechanic!"
                : mechanicId
                ? "Mechanic updated successfully!"
                : "Mechanic added successfully!"
            );
          }}
        />
        <ConfirmDialog
          open={confirmOpen}
          title="Switch Role?"
          description={`This will open the ${pendingRole} workspace. Do you want to proceed?`}
          confirmText="Switch"
          cancelText="Cancel"
          onClose={handleCancel}
          onConfirm={handleConfirm}
        />
      </Box>
    </Box>
  );
}

// --- Stat Card Box ---
function StatBox({ icon, label, count, color }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
      sx={{
        bgcolor: "#fff",
        px: { xs: 1, sm: 2 },
        py: { xs: 1, sm: 1.5 },
        borderRadius: 1,
        minWidth: { xs: 120, sm: 100 },
        maxWidth: { xs: 140, sm: 290 },
        flex: 1,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        borderLeft: `4px solid ${color}`,
      }}
    >
      <Box sx={{ color, fontSize: { xs: 22, sm: 32 }, display: "flex" }}>
        {icon}
      </Box>
      <Stack spacing={0.3}>
        <Typography
          variant="h6"
          sx={{
            color: "#2d3e5a",
            fontWeight: 700,
            fontSize: { xs: 18, sm: 20 },
          }}
        >
          {count}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#6b7280",
            fontWeight: 500,
            fontSize: { xs: 12, sm: 14.5 },
            lineHeight: 1.3,
          }}
        >
          {label}
        </Typography>
      </Stack>
    </Stack>
  );
}
