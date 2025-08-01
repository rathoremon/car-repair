// src/pages/provider/MechanicsPage.jsx
import React, { useState, useMemo } from "react";
import {
  Box,
  Button,
  Typography,
  Stack,
  Paper,
  Slide,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import AddIcon from "@mui/icons-material/PersonAddAlt1";
import GroupIcon from "@mui/icons-material/Group";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import BlockIcon from "@mui/icons-material/Block";
import MechanicList from "../../components/provider/mechanic/MechanicList";
import MechanicFormDialog from "../../components/provider/mechanic/MechanicFormDialog";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { ToggleButtonGroup, ToggleButton } from "@mui/material";
import { useDispatch } from "react-redux";
import { setActiveRole } from "../../features/auth/authSlice";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { useNavigate, useLocation } from "react-router-dom";

export default function MechanicsPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { list } = useSelector((s) => s.mechanics);

  const [formOpen, setFormOpen] = useState(false);
  const [mechanicId, setMechanicId] = useState(null);
  const { user } = useSelector((s) => s.auth);
  const currentRole = useMemo(
    () => localStorage.getItem("activeRole") || "provider",
    []
  );
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingRole, setPendingRole] = useState(null);
  const dispatch = useDispatch();

  const confirmToggle = () => {
    setConfirmOpen(false);

    // Set role before navigation
    dispatch(setActiveRole(pendingRole));
    localStorage.setItem("activeRole", pendingRole);

    if (pendingRole === "provider") navigate("/provider/dashboard");
    else if (pendingRole === "mechanic") navigate("/mechanic/dashboard");
  };

  const handleToggleRole = (_, newRole) => {
    if (!newRole || newRole === currentRole) return;
    setPendingRole(newRole);
    setConfirmOpen(true);
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
        </Stack>
        {user?.hasProviderProfile && user?.hasMechanicProfile && (
          <Slide direction="down" in mountOnEnter unmountOnExit>
            <ToggleButtonGroup
              value={currentRole}
              exclusive
              onChange={handleToggleRole}
              size="medium"
              sx={{
                borderRadius: "999px",
                overflow: "hidden",
                boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
                background:
                  theme.palette.mode === "dark" ? "#1f2937" : "#ffffff",
                border: `1px solid ${theme.palette.divider}`,
                my: 1,
                mx: "auto",
              }}
            >
              <ToggleButton
                value="provider"
                sx={{
                  textTransform: "none",
                  px: 3,
                  py: 1.2,
                  fontWeight: 700,
                  border: "none",
                  color: "text.primary",
                  "&.Mui-selected": {
                    background: theme.palette.primary.light,
                    color: theme.palette.primary.main,
                  },
                }}
              >
                Provider Module
              </ToggleButton>
              <ToggleButton
                value="mechanic"
                sx={{
                  textTransform: "none",
                  px: 3,
                  py: 1.2,
                  fontWeight: 700,
                  border: "none",
                  color: "text.primary",
                  "&.Mui-selected": {
                    background: theme.palette.primary.light,
                    color: theme.palette.primary.main,
                  },
                }}
              >
                Mechanic Module
              </ToggleButton>
            </ToggleButtonGroup>
          </Slide>
        )}

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

        {/* --- Mechanic Table --- */}
        <MechanicList
          onAddMechanic={openAddMechanic}
          onEditMechanic={openEditMechanic}
          onSelfRegister={openSelfRegister}
          onShowToast={showToast}
        />

        {/* --- Dialog --- */}
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
          onClose={() => setConfirmOpen(false)}
          onConfirm={confirmToggle}
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
