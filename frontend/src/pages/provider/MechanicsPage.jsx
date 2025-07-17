import React, { useState, useMemo } from "react";
import {
  Box,
  Button,
  Typography,
  Stack,
  Paper,
  useTheme,
  useMediaQuery,
  Grid,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/PersonAddAlt1";
import GroupIcon from "@mui/icons-material/Group";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import BlockIcon from "@mui/icons-material/Block";
import MechanicList from "../../components/provider/mechanic/MechanicList";
import MechanicFormDialog from "../../components/provider/mechanic/MechanicFormDialog";
import { useSelector } from "react-redux";

export default function MechanicsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { list } = useSelector((s) => s.mechanics);

  // --- State for Add Mechanic Dialog ---
  const [formOpen, setFormOpen] = useState(false);

  // --- Quick stats (memoized for perf) ---
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

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor: "background.default",
        px: { xs: 0, md: 2.5 },
        py: { xs: 1, md: 3 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflowX: "hidden",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 1350,
          mb: { xs: 1, sm: 2.5 },
        }}
      >
        {/* --- Top Bar --- */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "stretch", sm: "center" }}
          justifyContent="space-between"
          spacing={isMobile ? 1.2 : 2.5}
          sx={{ mb: { xs: 1.5, sm: 2 } }}
        >
          {/* Page Title */}
          <Typography
            variant={isMobile ? "h5" : "h4"}
            sx={{
              fontWeight: 900,
              letterSpacing: 0.7,
              color: "primary.main",
              lineHeight: 1.3,
            }}
          >
            Mechanic Management
          </Typography>

          {/* Add Mechanic Button */}
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            color="primary"
            sx={{
              fontWeight: 800,
              fontSize: 16,
              minWidth: isMobile ? "100%" : 182,
              minHeight: 46,
              borderRadius: 2,
              boxShadow: "none",
              letterSpacing: 0.6,
              bgcolor: "primary.main",
            }}
            onClick={() => setFormOpen(true)}
          >
            Add Mechanic
          </Button>
        </Stack>

        {/* --- Stats Panel --- */}
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            alignItems: "stretch",
            justifyContent: "flex-start",
            background: "#f6f8fc",
            p: { xs: 1.5, sm: 2.5 },
            mb: { xs: 1, sm: 2.2 },
            borderRadius: 2,
            boxShadow: "0 2px 14px rgba(46,77,167,0.05)",
            overflow: "auto",
          }}
        >
          {/* Total */}
          <StatBox
            icon={<GroupIcon sx={{ color: "#3788e4" }} />}
            label="Total Mechanics"
            count={stats.total}
            color="#3788e4"
          />
          {/* Active */}
          <StatBox
            icon={<CheckCircleIcon sx={{ color: "#22a87f" }} />}
            label="Active"
            count={stats.active}
            color="#22a87f"
          />
          {/* Pending */}
          <StatBox
            icon={<PendingActionsIcon sx={{ color: "#ffa11a" }} />}
            label="Pending"
            count={stats.pending}
            color="#ffa11a"
          />
          {/* Suspended */}
          <StatBox
            icon={<BlockIcon sx={{ color: "#ef5760" }} />}
            label="Suspended"
            count={stats.suspended}
            color="#ef5760"
          />
        </Paper>
      </Box>

      {/* --- DataGrid Table --- */}
      <Box>
        <MechanicList openFormDialog={() => setFormOpen(true)} />
      </Box>

      {/* --- Mechanic Add/Edit Dialog --- */}
      <MechanicFormDialog open={formOpen} onClose={() => setFormOpen(false)} />
    </Box>
  );
}

// --- Stats Card Component ---
function StatBox({ icon, label, count, color }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.6}
      sx={{
        background: "#fff",
        px: 2.2,
        py: 1.2,
        borderRadius: 1.4,
        minWidth: 180,
        boxShadow: "0 1.5px 10px 0 rgba(35,62,110,0.08)",
        flex: 1,
        maxWidth: 250,
      }}
    >
      <Box sx={{ fontSize: 28, color, display: "flex" }}>{icon}</Box>
      <Stack>
        <Typography sx={{ color: "#2d3e5a", fontWeight: 700, fontSize: 22 }}>
          {count}
        </Typography>
        <Typography
          sx={{
            fontSize: 15.5,
            fontWeight: 500,
            letterSpacing: 0.15,
            color: "#6d7a8b",
            mt: 0.1,
          }}
        >
          {label}
        </Typography>
      </Stack>
    </Stack>
  );
}
