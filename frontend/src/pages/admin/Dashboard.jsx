import React, { useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Avatar,
  useTheme,
  Stack,
  IconButton,
  InputBase,
  Button,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Fade,
  Badge,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import BuildIcon from "@mui/icons-material/Build";
import GroupIcon from "@mui/icons-material/Group";
import PaymentIcon from "@mui/icons-material/Payment";
import GavelIcon from "@mui/icons-material/Gavel";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ChatIcon from "@mui/icons-material/Chat";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import PieChartIcon from "@mui/icons-material/PieChart";
import BarChartIcon from "@mui/icons-material/BarChart";
import ShowChartIcon from "@mui/icons-material/ShowChart";

const stats = [
  {
    label: "Total Revenue",
    value: "₹12.5L",
    icon: <MonetizationOnIcon />,
    color: "primary.main",
    bg: "primary.lighter",
    trend: "+8.2%",
    trendColor: "success.main",
  },
  {
    label: "Bookings",
    value: "8,420",
    icon: <AssignmentTurnedInIcon />,
    color: "success.main",
    bg: "success.lighter",
    trend: "+2.1%",
    trendColor: "success.main",
  },
  {
    label: "Service Providers",
    value: "320",
    icon: <BuildIcon />,
    color: "info.main",
    bg: "info.lighter",
    trend: "+5",
    trendColor: "success.main",
  },
  {
    label: "Users",
    value: "12,100",
    icon: <GroupIcon />,
    color: "secondary.main",
    bg: "secondary.lighter",
    trend: "+120",
    trendColor: "success.main",
  },
];

const quickActions = [
  { label: "Add Provider", icon: <BuildIcon />, color: "primary" },
  { label: "Payouts", icon: <PaymentIcon />, color: "success" },
  { label: "Disputes", icon: <GavelIcon />, color: "error" },
  { label: "BNPL Requests", icon: <PaymentIcon />, color: "warning" },
];

const bookingsTable = [
  {
    id: "#BKG-001",
    user: "Amit Sharma",
    provider: "SpeedyFix Garage",
    status: "Completed",
    amount: "₹2,500",
    date: "2025-05-15",
  },
  {
    id: "#BKG-002",
    user: "Priya Singh",
    provider: "AutoCare Hub",
    status: "Pending",
    amount: "₹1,800",
    date: "2025-05-16",
  },
  {
    id: "#BKG-003",
    user: "Rahul Verma",
    provider: "QuickRepair",
    status: "Cancelled",
    amount: "₹0",
    date: "2025-05-16",
  },
];

const systemHealth = [
  { label: "API", status: "Healthy" },
  { label: "Database", status: "Healthy" },
  { label: "Payments", status: "Degraded" },
  { label: "Notifications", status: "Healthy" },
];

const chartBoxStyle = {
  p: 3,
  borderRadius: 6,
  bgcolor: "background.paper",
  boxShadow: "0 4px 32px 0 rgba(0,0,0,0.10)",
  minHeight: 260,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
};

const Dashboard = () => {
  const theme = useTheme();
  const [darkMode, setDarkMode] = useState(false);

  // Dummy chart components
  const BarChart = () => (
    <Box
      sx={{
        width: "100%",
        height: 140,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: theme.palette.text.disabled,
      }}
    >
      <BarChartIcon sx={{ fontSize: 60, mr: 1 }} />
      <Typography fontWeight={600}>Bar Chart</Typography>
    </Box>
  );
  const PieChart = () => (
    <Box
      sx={{
        width: "100%",
        height: 140,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: theme.palette.text.disabled,
      }}
    >
      <PieChartIcon sx={{ fontSize: 60, mr: 1 }} />
      <Typography fontWeight={600}>Pie Chart</Typography>
    </Box>
  );
  const LineChart = () => (
    <Box
      sx={{
        width: "100%",
        height: 140,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: theme.palette.text.disabled,
      }}
    >
      <ShowChartIcon sx={{ fontSize: 60, mr: 1 }} />
      <Typography fontWeight={600}>Line Chart</Typography>
    </Box>
  );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Top Navbar */}
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: 2, md: 4 },
          py: 2.5,
          bgcolor: "background.paper",
          boxShadow: "0 4px 32px 0 rgba(0,0,0,0.08)",
          borderRadius: "0 0 32px 32px",
          mb: 5,
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography
            variant="h4"
            fontWeight={900}
            sx={{
              letterSpacing: 1.5,
              color: theme.palette.primary.main,
              textShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            Dashboard
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Paper
            component="form"
            sx={{
              p: "2px 8px",
              display: "flex",
              alignItems: "center",
              borderRadius: 3,
              boxShadow: "none",
              bgcolor: "background.default",
              mr: 1,
              minWidth: 180,
            }}
          >
            <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Search…" />
            <IconButton type="submit" sx={{ p: "6px" }}>
              <SearchIcon />
            </IconButton>
          </Paper>
          <Tooltip title="Notifications">
            <IconButton>
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title="Toggle dark mode">
            <IconButton onClick={() => setDarkMode((v) => !v)}>
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Profile">
            <IconButton>
              <AccountCircleIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Paper>

      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 3, px: { xs: 1, md: 0 } }}>
        {stats.map((stat, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Fade in timeout={600 + i * 200}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 6,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  background: `linear-gradient(120deg, ${
                    theme.palette[stat.bg]
                  } 80%, #fff 100%)`,
                  boxShadow: "0 4px 32px 0 rgba(0,0,0,0.10)",
                  minHeight: 110,
                  transition: "box-shadow 0.2s, transform 0.2s",
                  "&:hover": {
                    boxShadow: `0 8px 32px 0 ${theme.palette[stat.color]}22`,
                    transform: "translateY(-2px) scale(1.02)",
                  },
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: theme.palette[stat.color],
                    color: "#fff",
                    width: 54,
                    height: 54,
                    fontSize: 30,
                    boxShadow: `0 2px 8px 0 ${theme.palette[stat.color]}18`,
                  }}
                >
                  {stat.icon}
                </Avatar>
                <Stack>
                  <Typography
                    variant="subtitle2"
                    fontWeight={700}
                    sx={{
                      color: theme.palette[stat.color],
                      fontSize: 16,
                      letterSpacing: 0.5,
                    }}
                  >
                    {stat.label}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography
                      variant="h4"
                      fontWeight={900}
                      sx={{ fontSize: 30, letterSpacing: 0.5, mb: 0.5 }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight={700}
                      sx={{
                        color: theme.palette[stat.trendColor],
                        fontSize: 15,
                        mt: 1,
                      }}
                    >
                      {stat.trend}
                    </Typography>
                  </Stack>
                </Stack>
              </Paper>
            </Fade>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Stack
        direction="row"
        spacing={2}
        sx={{
          mb: 4,
          mt: 2,
          px: { xs: 1, md: 0 },
          flexWrap: "wrap",
        }}
      >
        {quickActions.map((action, i) => (
          <Fade in timeout={800 + i * 150} key={action.label}>
            <Button
              variant="contained"
              color={action.color}
              startIcon={action.icon}
              sx={{
                borderRadius: 3,
                fontWeight: 700,
                textTransform: "none",
                boxShadow: "0 2px 8px 0 rgba(0,0,0,0.08)",
                px: 3,
                fontSize: 16,
                mb: { xs: 1, sm: 0 },
              }}
            >
              {action.label}
            </Button>
          </Fade>
        ))}
      </Stack>

      {/* Charts and System Health */}
      <Grid container spacing={3} sx={{ mb: 4, px: { xs: 1, md: 0 } }}>
        <Grid item xs={12} md={4}>
          <Paper sx={chartBoxStyle}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              Revenue Trend
            </Typography>
            <BarChart />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={chartBoxStyle}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              Booking Distribution
            </Typography>
            <PieChart />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={chartBoxStyle}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              Monthly Growth
            </Typography>
            <LineChart />
          </Paper>
        </Grid>
      </Grid>

      {/* System Health & Chat Monitoring */}
      <Grid container spacing={3} sx={{ mb: 4, px: { xs: 1, md: 0 } }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ ...chartBoxStyle, minHeight: 180 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              Real-Time System Health
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              {systemHealth.map((sys) => (
                <Chip
                  key={sys.label}
                  label={`${sys.label}: ${sys.status}`}
                  color={
                    sys.status === "Healthy"
                      ? "success"
                      : sys.status === "Degraded"
                      ? "warning"
                      : "error"
                  }
                  sx={{
                    fontWeight: 700,
                    fontSize: 15,
                    borderRadius: 2,
                    mb: 1,
                  }}
                />
              ))}
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ ...chartBoxStyle, minHeight: 180 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              Chat Monitoring
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">
                5 active chats, 2 flagged for review.
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<ChatIcon />}
                sx={{
                  borderRadius: 2,
                  fontWeight: 700,
                  textTransform: "none",
                }}
              >
                View Chats
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Bookings Table */}
      <Paper
        sx={{
          p: 3,
          borderRadius: 6,
          boxShadow: "0 4px 32px 0 rgba(0,0,0,0.08)",
          mb: 4,
          mx: { xs: 1, md: 0 },
        }}
      >
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
          Recent Bookings
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Provider</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookingsTable.map((row, i) => (
                <Fade in timeout={600 + i * 100} key={row.id}>
                  <TableRow>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.user}</TableCell>
                    <TableCell>{row.provider}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.status}
                        color={
                          row.status === "Completed"
                            ? "success"
                            : row.status === "Pending"
                            ? "warning"
                            : "error"
                        }
                        size="small"
                        sx={{ fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell>{row.amount}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        sx={{ borderRadius: 2 }}
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                </Fade>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Notifications */}
      <Paper
        sx={{
          p: 3,
          borderRadius: 6,
          boxShadow: "0 4px 32px 0 rgba(0,0,0,0.08)",
          mb: 4,
          mx: { xs: 1, md: 0 },
        }}
      >
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
          Notifications
        </Typography>
        <Stack spacing={1}>
          <Chip
            icon={<NotificationsIcon />}
            label="New provider registration pending approval."
            color="info"
          />
          <Chip
            icon={<ReportProblemIcon />}
            label="2 new disputes raised today."
            color="warning"
          />
          <Chip
            icon={<PaymentIcon />}
            label="Payout processed for AutoCare Hub."
            color="success"
          />
        </Stack>
      </Paper>
      <Box sx={{ pb: 4 }} />
    </Box>
  );
};

export default Dashboard;
