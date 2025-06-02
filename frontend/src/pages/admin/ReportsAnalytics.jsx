import React, { useState } from "react";
import {
  Typography,
  Paper,
  Box,
  useTheme,
  Fade,
  Stack,
  Chip,
  Divider,
  Tooltip as MuiTooltip,
  Grid,
  Avatar,
  Tabs,
  Tab,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
  Line,
  LineChart,
} from "recharts";
import Container from "../../components/Container";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PercentIcon from "@mui/icons-material/Percent";
import StarIcon from "@mui/icons-material/Star";
import GroupIcon from "@mui/icons-material/Group";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

const data = [
  {
    name: "Jan",
    revenue: 2400,
    orders: 130,
    growth: 8,
    newUsers: 40,
    avgOrder: 18.5,
  },
  {
    name: "Feb",
    revenue: 3200,
    orders: 170,
    growth: 15,
    newUsers: 55,
    avgOrder: 18.8,
  },
  {
    name: "Mar",
    revenue: 2900,
    orders: 150,
    growth: -9,
    newUsers: 38,
    avgOrder: 19.3,
  },
  {
    name: "Apr",
    revenue: 3700,
    orders: 200,
    growth: 12,
    newUsers: 62,
    avgOrder: 18.2,
  },
];

function getGrowthChip(growth, theme) {
  return (
    <Chip
      icon={
        growth > 0 ? (
          <TrendingUpIcon sx={{ color: theme.palette.success.dark }} />
        ) : (
          <TrendingDownIcon sx={{ color: theme.palette.error.dark }} />
        )
      }
      label={
        <span style={{ fontWeight: 600 }}>
          {growth > 0 ? "+" : ""}
          {growth}%
        </span>
      }
      size="small"
      sx={{
        bgcolor:
          growth > 0 ? theme.palette.success.light : theme.palette.error.light,
        color:
          growth > 0 ? theme.palette.success.dark : theme.palette.error.dark,
        fontWeight: 600,
        px: 1.5,
        borderRadius: 2,
        ml: 1,
      }}
    />
  );
}

const tabLabels = [
  { label: "Overview", color: "primary" },
  { label: "Revenue", color: "success" },
  { label: "Orders", color: "secondary" },
  { label: "Growth", color: "warning" },
  { label: "Users", color: "info" },
];

export default function ReportsAnalytics() {
  const theme = useTheme();
  const [tab, setTab] = useState(0);

  // Calculate summary
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = data.reduce((sum, d) => sum + d.orders, 0);
  const avgGrowth =
    Math.round(
      (data.reduce((sum, d) => sum + d.growth, 0) / data.length) * 10
    ) / 10;
  const bestMonth = data.reduce((a, b) => (a.revenue > b.revenue ? a : b));
  const worstMonth = data.reduce((a, b) => (a.revenue < b.revenue ? a : b));
  const totalNewUsers = data.reduce((sum, d) => sum + d.newUsers, 0);
  const avgOrderValue =
    Math.round(
      (data.reduce((sum, d) => sum + d.avgOrder, 0) / data.length) * 100
    ) / 100;

  // Tab color mapping for indicator and text
  const tabColor = [
    theme.palette.primary.main,
    theme.palette.success.main,
    theme.palette.secondary.main,
    theme.palette.warning.main,
    theme.palette.info.main,
  ];

  return (
    <Container>
      <Fade in timeout={600}>
        <Box>
          {/* Gradient header bar */}

          {/* Tabs */}
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              mb: 3,
              ".MuiTabs-indicator": {
                height: 5,
                borderRadius: 2,
                background: tabColor[tab],
                transition: "background 0.3s",
              },
            }}
          >
            {tabLabels.map((t, i) => (
              <Tab
                key={t.label}
                label={
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color:
                        tab === i ? tabColor[i] : theme.palette.text.secondary,
                      letterSpacing: 1,
                      textTransform: "none",
                    }}
                  >
                    {t.label}
                  </Typography>
                }
                disableRipple
                sx={{
                  minWidth: 120,
                  px: 2,
                  borderRadius: 2,
                  transition: "color 0.2s",
                }}
              />
            ))}
          </Tabs>

          {/* Summary Chips */}
          {tab === 0 && (
            <>
              {/* Professional, compact summary chips */}
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} md={8}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: 4,
                      background: theme.palette.background.paper,
                      boxShadow: "0 2px 8px 0 rgba(0,0,0,0.03)",
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      variant="h5"
                      fontWeight={800}
                      sx={{
                        letterSpacing: 1.5,
                        color: theme.palette.primary.main,
                        mb: 2,
                      }}
                    >
                      Revenue Analytics
                    </Typography>
                    <Grid container spacing={1.5}>
                      <Grid item xs={6} sm={4} md={2.4}>
                        <MuiTooltip title="Total Revenue" arrow>
                          <Chip
                            icon={
                              <MonetizationOnIcon
                                sx={{
                                  color: theme.palette.primary.main,
                                  fontSize: 20,
                                  bgcolor: "transparent",
                                  p: 0,
                                }}
                              />
                            }
                            label={
                              <span style={{ fontWeight: 700, fontSize: 15 }}>
                                ₹{totalRevenue.toLocaleString()}
                                <span
                                  style={{
                                    color: theme.palette.text.secondary,
                                    fontWeight: 500,
                                    fontSize: 13,
                                    marginLeft: 6,
                                  }}
                                >
                                  Revenue
                                </span>
                              </span>
                            }
                            sx={{
                              bgcolor:
                                theme.palette.primary.lighter || "#f5faff",
                              color: theme.palette.primary.main,
                              fontWeight: 700,
                              px: 2,
                              borderRadius: 2,
                              fontSize: 15,
                              minHeight: 38,
                              boxShadow: "none",
                              border: `1px solid ${theme.palette.primary.light}`,
                              width: "100%",
                              justifyContent: "flex-start",
                            }}
                            size="small"
                          />
                        </MuiTooltip>
                      </Grid>
                      <Grid item xs={6} sm={4} md={2.4}>
                        <MuiTooltip title="Total Orders" arrow>
                          <Chip
                            icon={
                              <ShoppingCartIcon
                                sx={{
                                  color: theme.palette.secondary.main,
                                  fontSize: 20,
                                  bgcolor: "transparent",
                                  p: 0,
                                }}
                              />
                            }
                            label={
                              <span style={{ fontWeight: 700, fontSize: 15 }}>
                                {totalOrders}
                                <span
                                  style={{
                                    color: theme.palette.text.secondary,
                                    fontWeight: 500,
                                    fontSize: 13,
                                    marginLeft: 6,
                                  }}
                                >
                                  Orders
                                </span>
                              </span>
                            }
                            sx={{
                              bgcolor:
                                theme.palette.secondary.lighter || "#f9f6ff",
                              color: theme.palette.secondary.main,
                              fontWeight: 700,
                              px: 2,
                              borderRadius: 2,
                              fontSize: 15,
                              minHeight: 38,
                              boxShadow: "none",
                              border: `1px solid ${theme.palette.secondary.light}`,
                              width: "100%",
                              justifyContent: "flex-start",
                            }}
                            size="small"
                          />
                        </MuiTooltip>
                      </Grid>
                      <Grid item xs={6} sm={4} md={2.4}>
                        <MuiTooltip title="Average Growth" arrow>
                          <Chip
                            icon={
                              avgGrowth > 0 ? (
                                <TrendingUpIcon
                                  sx={{
                                    color: theme.palette.success.main,
                                    fontSize: 20,
                                    bgcolor: "transparent",
                                    p: 0,
                                  }}
                                />
                              ) : (
                                <TrendingDownIcon
                                  sx={{
                                    color: theme.palette.error.main,
                                    fontSize: 20,
                                    bgcolor: "transparent",
                                    p: 0,
                                  }}
                                />
                              )
                            }
                            label={
                              <span style={{ fontWeight: 700, fontSize: 15 }}>
                                {avgGrowth > 0 ? "+" : ""}
                                {avgGrowth}%
                                <span
                                  style={{
                                    color: theme.palette.text.secondary,
                                    fontWeight: 500,
                                    fontSize: 13,
                                    marginLeft: 6,
                                  }}
                                >
                                  Growth
                                </span>
                              </span>
                            }
                            sx={{
                              bgcolor:
                                avgGrowth > 0
                                  ? theme.palette.success.lighter || "#f6fff8"
                                  : theme.palette.error.lighter || "#fff6f6",
                              color:
                                avgGrowth > 0
                                  ? theme.palette.success.main
                                  : theme.palette.error.main,
                              fontWeight: 700,
                              px: 2,
                              borderRadius: 2,
                              fontSize: 15,
                              minHeight: 38,
                              boxShadow: "none",
                              border: `1px solid ${
                                avgGrowth > 0
                                  ? theme.palette.success.light
                                  : theme.palette.error.light
                              }`,
                              width: "100%",
                              justifyContent: "flex-start",
                            }}
                            size="small"
                          />
                        </MuiTooltip>
                      </Grid>
                      <Grid item xs={6} sm={4} md={2.4}>
                        <MuiTooltip title="New Users" arrow>
                          <Chip
                            icon={
                              <GroupIcon
                                sx={{
                                  color: theme.palette.info.main,
                                  fontSize: 20,
                                  bgcolor: "transparent",
                                  p: 0,
                                }}
                              />
                            }
                            label={
                              <span style={{ fontWeight: 700, fontSize: 15 }}>
                                {totalNewUsers}
                                <span
                                  style={{
                                    color: theme.palette.text.secondary,
                                    fontWeight: 500,
                                    fontSize: 13,
                                    marginLeft: 6,
                                  }}
                                >
                                  New Users
                                </span>
                              </span>
                            }
                            sx={{
                              bgcolor: theme.palette.info.lighter || "#f6faff",
                              color: theme.palette.info.main,
                              fontWeight: 700,
                              px: 2,
                              borderRadius: 2,
                              fontSize: 15,
                              minHeight: 38,
                              boxShadow: "none",
                              border: `1px solid ${theme.palette.info.light}`,
                              width: "100%",
                              justifyContent: "flex-start",
                            }}
                            size="small"
                          />
                        </MuiTooltip>
                      </Grid>
                      <Grid item xs={6} sm={4} md={2.4}>
                        <MuiTooltip title="Avg. Order Value" arrow>
                          <Chip
                            icon={
                              <LocalOfferIcon
                                sx={{
                                  color: theme.palette.warning.main,
                                  fontSize: 20,
                                  bgcolor: "transparent",
                                  p: 0,
                                }}
                              />
                            }
                            label={
                              <span style={{ fontWeight: 700, fontSize: 15 }}>
                                ₹{avgOrderValue}
                                <span
                                  style={{
                                    color: theme.palette.text.secondary,
                                    fontWeight: 500,
                                    fontSize: 13,
                                    marginLeft: 6,
                                  }}
                                >
                                  Avg Order
                                </span>
                              </span>
                            }
                            sx={{
                              bgcolor:
                                theme.palette.warning.lighter || "#fffdf6",
                              color: theme.palette.warning.main,
                              fontWeight: 700,
                              px: 2,
                              borderRadius: 2,
                              fontSize: 15,
                              minHeight: 38,
                              boxShadow: "none",
                              border: `1px solid ${theme.palette.warning.light}`,
                              width: "100%",
                              justifyContent: "flex-start",
                            }}
                            size="small"
                          />
                        </MuiTooltip>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
              {/* Best/Worst Month Cards - compact, clean, professional */}
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background:
                        theme.palette.mode === "dark"
                          ? `linear-gradient(100deg, ${theme.palette.success.dark} 60%, ${theme.palette.success.light} 100%)`
                          : `linear-gradient(100deg, ${
                              theme.palette.success.lighter || "#f6fff8"
                            } 80%, #fff 100%)`,
                      color: theme.palette.success.main,
                      boxShadow: "0 1px 4px 0 rgba(76,175,80,0.07)",
                      display: "flex",
                      alignItems: "center",
                      minHeight: 68,
                      borderLeft: `3px solid ${theme.palette.success.main}`,
                      transition: "box-shadow 0.2s, transform 0.2s",
                      "&:hover": {
                        boxShadow: "0 4px 16px 0 rgba(76,175,80,0.13)",
                        transform: "translateY(-1px) scale(1.01)",
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: theme.palette.success.main,
                        color: "#fff",
                        width: 32,
                        height: 32,
                        mr: 1.5,
                        fontSize: 18,
                        boxShadow: "0 1px 4px 0 rgba(76,175,80,0.10)",
                      }}
                    >
                      <TrendingUpIcon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        fontWeight={700}
                        sx={{ color: theme.palette.success.dark, fontSize: 14 }}
                      >
                        Best Month
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={700}
                        sx={{ fontSize: 15 }}
                      >
                        {bestMonth.name} &mdash;{" "}
                        <span style={{ color: theme.palette.success.dark }}>
                          ₹{bestMonth.revenue.toLocaleString()}
                        </span>
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ opacity: 0.75, fontSize: 13 }}
                      >
                        Orders: <b>{bestMonth.orders}</b> | Growth:{" "}
                        <b>{bestMonth.growth}%</b>
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background:
                        theme.palette.mode === "dark"
                          ? `linear-gradient(100deg, ${theme.palette.error.dark} 60%, ${theme.palette.error.light} 100%)`
                          : `linear-gradient(100deg, ${
                              theme.palette.error.lighter || "#fff6f6"
                            } 80%, #fff 100%)`,
                      color: theme.palette.error.main,
                      boxShadow: "0 1px 4px 0 rgba(244,67,54,0.07)",
                      display: "flex",
                      alignItems: "center",
                      minHeight: 68,
                      borderLeft: `3px solid ${theme.palette.error.main}`,
                      transition: "box-shadow 0.2s, transform 0.2s",
                      "&:hover": {
                        boxShadow: "0 4px 16px 0 rgba(244,67,54,0.13)",
                        transform: "translateY(-1px) scale(1.01)",
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: theme.palette.error.main,
                        color: "#fff",
                        width: 32,
                        height: 32,
                        mr: 1.5,
                        fontSize: 18,
                        boxShadow: "0 1px 4px 0 rgba(244,67,54,0.10)",
                      }}
                    >
                      <TrendingDownIcon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        fontWeight={700}
                        sx={{ color: theme.palette.error.dark, fontSize: 14 }}
                      >
                        Lowest Month
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={700}
                        sx={{ fontSize: 15 }}
                      >
                        {worstMonth.name} &mdash;{" "}
                        <span style={{ color: theme.palette.error.dark }}>
                          ₹{worstMonth.revenue.toLocaleString()}
                        </span>
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ opacity: 0.75, fontSize: 13 }}
                      >
                        Orders: <b>{worstMonth.orders}</b> | Growth:{" "}
                        <b>{worstMonth.growth}%</b>
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </>
          )}

          <Divider sx={{ mb: 3, borderColor: theme.palette.divider }} />

          {/* Tab Content */}
          {tab === 0 && (
            <>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                sx={{ mb: 2, fontWeight: 600 }}
              >
                Revenue & Orders Trend
              </Typography>
              <ResponsiveContainer width="100%" height={340}>
                <BarChart data={data} barGap={10}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke={theme.palette.divider}
                  />
                  <XAxis
                    dataKey="name"
                    stroke={theme.palette.text.secondary}
                    tick={{ fontWeight: 600 }}
                  />
                  <YAxis
                    stroke={theme.palette.text.secondary}
                    tick={{ fontWeight: 600 }}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: theme.palette.background.paper,
                      borderRadius: 8,
                      boxShadow: theme.shadows[2],
                      border: `1px solid ${theme.palette.divider}`,
                      color: theme.palette.text.primary,
                    }}
                    cursor={{ fill: theme.palette.action.hover }}
                    labelStyle={{
                      fontWeight: 700,
                      color: theme.palette.primary.main,
                    }}
                  />
                  <Legend
                    wrapperStyle={{
                      fontWeight: 600,
                      color: theme.palette.text.secondary,
                      paddingTop: 8,
                    }}
                  />
                  <Bar
                    dataKey="revenue"
                    name="Revenue"
                    fill={`url(#revenueGradient)`}
                    radius={[10, 10, 0, 0]}
                    barSize={32}
                  />
                  <Bar
                    dataKey="orders"
                    name="Orders"
                    fill={`url(#ordersGradient)`}
                    radius={[10, 10, 0, 0]}
                    barSize={32}
                  />
                  <defs>
                    <linearGradient
                      id="revenueGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor={theme.palette.primary.dark}
                        stopOpacity={0.95}
                      />
                      <stop
                        offset="100%"
                        stopColor={theme.palette.primary.light}
                        stopOpacity={0.5}
                      />
                    </linearGradient>
                    <linearGradient
                      id="ordersGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor={theme.palette.secondary.dark}
                        stopOpacity={0.95}
                      />
                      <stop
                        offset="100%"
                        stopColor={theme.palette.secondary.light}
                        stopOpacity={0.5}
                      />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
              <Divider sx={{ my: 3, borderColor: theme.palette.divider }} />
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ fontWeight: 600, mb: 1 }}
              >
                Growth Overview
              </Typography>
              <ResponsiveContainer width="100%" height={120}>
                <LineChart data={data}>
                  <XAxis dataKey="name" hide />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      background: theme.palette.background.paper,
                      borderRadius: 8,
                      boxShadow: theme.shadows[2],
                      border: `1px solid ${theme.palette.divider}`,
                      color: theme.palette.text.primary,
                    }}
                    labelStyle={{
                      fontWeight: 700,
                      color: theme.palette.success.dark,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="growth"
                    stroke={theme.palette.success.dark}
                    strokeWidth={3}
                    dot={{
                      stroke: theme.palette.success.dark,
                      strokeWidth: 2,
                      fill: theme.palette.background.paper,
                      r: 5,
                    }}
                    activeDot={{
                      r: 7,
                      fill: theme.palette.success.dark,
                      stroke: theme.palette.background.paper,
                      strokeWidth: 2,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <Divider sx={{ my: 3, borderColor: theme.palette.divider }} />
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ mt: 2 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: theme.palette.info.lighter || "#f6faff",
                    color: theme.palette.info.main,
                    borderRadius: 3,
                    flex: 1,
                    minWidth: 200,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    boxShadow: "0 1px 4px 0 rgba(0,184,212,0.07)",
                    borderLeft: `3px solid ${theme.palette.info.main}`,
                    transition: "box-shadow 0.2s, transform 0.2s",
                    "&:hover": {
                      boxShadow: "0 4px 16px 0 rgba(0,184,212,0.13)",
                      transform: "translateY(-1px) scale(1.01)",
                    },
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <StarIcon
                      sx={{ color: theme.palette.info.main, fontSize: 22 }}
                    />
                    <Typography
                      variant="subtitle2"
                      fontWeight={700}
                      sx={{ fontSize: 15 }}
                    >
                      Highest Avg. Order Value
                    </Typography>
                  </Stack>
                  <Typography
                    variant="h6"
                    fontWeight={800}
                    sx={{ mt: 1, fontSize: 22 }}
                  >
                    ₹{Math.max(...data.map((d) => d.avgOrder))}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ opacity: 0.8, fontSize: 14 }}
                  >
                    Month:{" "}
                    <b>
                      {
                        data.reduce((a, b) => (a.avgOrder > b.avgOrder ? a : b))
                          .name
                      }
                    </b>
                  </Typography>
                </Paper>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: theme.palette.warning.lighter || "#fffdf6",
                    color: theme.palette.warning.main,
                    borderRadius: 3,
                    flex: 1,
                    minWidth: 200,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    boxShadow: "0 1px 4px 0 rgba(255,193,7,0.07)",
                    borderLeft: `3px solid ${theme.palette.warning.main}`,
                    transition: "box-shadow 0.2s, transform 0.2s",
                    "&:hover": {
                      boxShadow: "0 4px 16px 0 rgba(255,193,7,0.13)",
                      transform: "translateY(-1px) scale(1.01)",
                    },
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <PercentIcon
                      sx={{ color: theme.palette.warning.main, fontSize: 22 }}
                    />
                    <Typography
                      variant="subtitle2"
                      fontWeight={700}
                      sx={{ fontSize: 15 }}
                    >
                      Highest Growth
                    </Typography>
                  </Stack>
                  <Typography
                    variant="h6"
                    fontWeight={800}
                    sx={{ mt: 1, fontSize: 22 }}
                  >
                    {Math.max(...data.map((d) => d.growth))}%
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ opacity: 0.8, fontSize: 14 }}
                  >
                    Month:{" "}
                    <b>
                      {
                        data.reduce((a, b) => (a.growth > b.growth ? a : b))
                          .name
                      }
                    </b>
                  </Typography>
                </Paper>
              </Stack>
            </>
          )}

          {/* Revenue Tab */}
          {tab === 1 && (
            <>
              <Typography
                variant="h5"
                color="success.main"
                fontWeight={700}
                sx={{ letterSpacing: 1, mb: 2 }}
              >
                Revenue Trend
              </Typography>
              <ResponsiveContainer width="100%" height={340}>
                <BarChart data={data}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke={theme.palette.divider}
                  />
                  <XAxis
                    dataKey="name"
                    stroke={theme.palette.text.secondary}
                    tick={{ fontWeight: 600 }}
                  />
                  <YAxis
                    stroke={theme.palette.text.secondary}
                    tick={{ fontWeight: 600 }}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: theme.palette.background.paper,
                      borderRadius: 8,
                      boxShadow: theme.shadows[2],
                      border: `1px solid ${theme.palette.divider}`,
                      color: theme.palette.text.primary,
                    }}
                    cursor={{ fill: theme.palette.action.hover }}
                    labelStyle={{
                      fontWeight: 700,
                      color: theme.palette.success.main,
                    }}
                  />
                  <Bar
                    dataKey="revenue"
                    name="Revenue"
                    fill={`url(#revenueGradient)`}
                    radius={[10, 10, 0, 0]}
                    barSize={48}
                  />
                  <defs>
                    <linearGradient
                      id="revenueGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor={theme.palette.success.dark}
                        stopOpacity={0.95}
                      />
                      <stop
                        offset="100%"
                        stopColor={theme.palette.success.light}
                        stopOpacity={0.5}
                      />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </>
          )}

          {/* Orders Tab */}
          {tab === 2 && (
            <>
              <Typography
                variant="h5"
                color="secondary.main"
                fontWeight={700}
                sx={{ letterSpacing: 1, mb: 2 }}
              >
                Orders Trend
              </Typography>
              <ResponsiveContainer width="100%" height={340}>
                <BarChart data={data}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke={theme.palette.divider}
                  />
                  <XAxis
                    dataKey="name"
                    stroke={theme.palette.text.secondary}
                    tick={{ fontWeight: 600 }}
                  />
                  <YAxis
                    stroke={theme.palette.text.secondary}
                    tick={{ fontWeight: 600 }}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: theme.palette.background.paper,
                      borderRadius: 8,
                      boxShadow: theme.shadows[2],
                      border: `1px solid ${theme.palette.divider}`,
                      color: theme.palette.text.primary,
                    }}
                    cursor={{ fill: theme.palette.action.hover }}
                    labelStyle={{
                      fontWeight: 700,
                      color: theme.palette.secondary.main,
                    }}
                  />
                  <Bar
                    dataKey="orders"
                    name="Orders"
                    fill={`url(#ordersGradient)`}
                    radius={[10, 10, 0, 0]}
                    barSize={48}
                  />
                  <defs>
                    <linearGradient
                      id="ordersGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor={theme.palette.secondary.dark}
                        stopOpacity={0.95}
                      />
                      <stop
                        offset="100%"
                        stopColor={theme.palette.secondary.light}
                        stopOpacity={0.5}
                      />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </>
          )}

          {/* Growth Tab */}
          {tab === 3 && (
            <>
              <Typography
                variant="h5"
                color="warning.main"
                fontWeight={700}
                sx={{ letterSpacing: 1, mb: 2 }}
              >
                Growth Trend
              </Typography>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={data}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke={theme.palette.divider}
                  />
                  <XAxis
                    dataKey="name"
                    stroke={theme.palette.text.secondary}
                    tick={{ fontWeight: 600 }}
                  />
                  <YAxis
                    stroke={theme.palette.text.secondary}
                    tick={{ fontWeight: 600 }}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: theme.palette.background.paper,
                      borderRadius: 8,
                      boxShadow: theme.shadows[2],
                      border: `1px solid ${theme.palette.divider}`,
                      color: theme.palette.text.primary,
                    }}
                    labelStyle={{
                      fontWeight: 700,
                      color: theme.palette.warning.main,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="growth"
                    stroke={theme.palette.warning.main}
                    strokeWidth={3}
                    dot={{
                      stroke: theme.palette.warning.main,
                      strokeWidth: 2,
                      fill: theme.palette.background.paper,
                      r: 5,
                    }}
                    activeDot={{
                      r: 7,
                      fill: theme.palette.warning.main,
                      stroke: theme.palette.background.paper,
                      strokeWidth: 2,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </>
          )}

          {/* Users Tab */}
          {tab === 4 && (
            <>
              <Typography
                variant="h5"
                color="info.main"
                fontWeight={700}
                sx={{ letterSpacing: 1, mb: 2 }}
              >
                New Users Trend
              </Typography>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={data}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke={theme.palette.divider}
                  />
                  <XAxis
                    dataKey="name"
                    stroke={theme.palette.text.secondary}
                    tick={{ fontWeight: 600 }}
                  />
                  <YAxis
                    stroke={theme.palette.text.secondary}
                    tick={{ fontWeight: 600 }}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: theme.palette.background.paper,
                      borderRadius: 8,
                      boxShadow: theme.shadows[2],
                      border: `1px solid ${theme.palette.divider}`,
                      color: theme.palette.text.primary,
                    }}
                    labelStyle={{
                      fontWeight: 700,
                      color: theme.palette.info.main,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="newUsers"
                    stroke={theme.palette.info.main}
                    strokeWidth={3}
                    dot={{
                      stroke: theme.palette.info.main,
                      strokeWidth: 2,
                      fill: theme.palette.background.paper,
                      r: 5,
                    }}
                    activeDot={{
                      r: 7,
                      fill: theme.palette.info.main,
                      stroke: theme.palette.background.paper,
                      strokeWidth: 2,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </>
          )}
        </Box>
      </Fade>
    </Container>
  );
}
