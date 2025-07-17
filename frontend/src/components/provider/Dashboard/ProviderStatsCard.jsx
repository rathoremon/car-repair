// src/components/provider/Dashboard/ProviderStatsCard.jsx

import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Button,
  Select,
  FormControl,
  InputLabel,
  Stack,
  OutlinedInput,
  useTheme,
  Chip,
  useMediaQuery,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  StarRate,
  AttachMoney,
  Download,
  FilterList,
  HelpOutline,
  Gavel,
  CheckCircleOutline,
  CancelOutlined,
  QueryStats,
  BarChart,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import dayjs from "dayjs";

const statData = [
  {
    key: "totalBookings",
    label: "Total Bookings",
    value: 324,
    icon: <QueryStats color="primary" fontSize="medium" />,
    tooltip: "Total bookings received till date",
    trend: +5,
    color: "#e3f2fd", // bg color for mobile slide
    gradient: "linear-gradient(90deg,#e3f2fd 0%,#bbdefb 100%)",
  },
  {
    key: "completed",
    label: "Completed",
    value: 298,
    icon: <CheckCircleOutline color="success" fontSize="medium" />,
    tooltip: "Jobs successfully completed",
    trend: +2,
    color: "#e8f5e9",
    gradient: "linear-gradient(90deg,#e8f5e9 0%,#c8e6c9 100%)",
  },
  {
    key: "cancelled",
    label: "Cancelled",
    value: 12,
    icon: <CancelOutlined color="error" fontSize="medium" />,
    tooltip: "Bookings cancelled by you or user",
    trend: -1,
    color: "#ffebee",
    gradient: "linear-gradient(90deg,#ffebee 0%,#ffcdd2 100%)",
  },
  {
    key: "earnings",
    label: "Earnings (₹)",
    value: 126700,
    icon: <AttachMoney color="primary" fontSize="medium" />,
    tooltip: "Total earnings from Trasure",
    currency: true,
    trend: +9,
    color: "#ede7f6",
    gradient: "linear-gradient(90deg,#ede7f6 0%,#d1c4e9 100%)",
  },
  {
    key: "avgRating",
    label: "Avg. Rating",
    value: 4.76,
    icon: <StarRate sx={{ color: "#FFC107" }} fontSize="medium" />,
    tooltip: "Your average customer rating",
    trend: null,
    color: "#fffde7",
    gradient: "linear-gradient(90deg,#fffde7 0%,#fff9c4 100%)",
  },
  {
    key: "responseRate",
    label: "Response Rate",
    value: "98%",
    icon: <BarChart color="info" fontSize="medium" />,
    tooltip: "How quickly you respond to requests",
    trend: +2,
    color: "#e3f2fd",
    gradient: "linear-gradient(90deg,#e3f2fd 0%,#b3e5fc 100%)",
  },
  {
    key: "openDisputes",
    label: "Open Disputes",
    value: 0,
    icon: <Gavel color="warning" fontSize="medium" />,
    tooltip: "Unresolved customer disputes",
    trend: null,
    color: "#fff3e0",
    gradient: "linear-gradient(90deg,#fff3e0 0%,#ffe0b2 100%)",
  },
  {
    key: "monthEarnings",
    label: `Earnings (${dayjs().format("MMM")})`,
    value: 15670,
    icon: <AttachMoney sx={{ color: "#43a047" }} fontSize="medium" />,
    tooltip: `Earnings this month (${dayjs().format("MMMM")})`,
    currency: true,
    trend: +7,
    color: "#f1f8e9",
    gradient: "linear-gradient(90deg,#f1f8e9 0%,#dcedc8 100%)",
  },
];

const periods = [
  { value: "this_month", label: "This Month" },
  { value: "last_month", label: "Last Month" },
  { value: "all_time", label: "All Time" },
];

const ProviderStatsCard = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterPeriod, setFilterPeriod] = useState("this_month");
  const [cardMenuAnchor, setCardMenuAnchor] = useState(null);
  const [activeStatKey, setActiveStatKey] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Context menu for each stat card
  const handleCardMenuOpen = (event, key) => {
    setActiveStatKey(key);
    setCardMenuAnchor(event.currentTarget);
  };
  const handleCardMenuClose = () => {
    setActiveStatKey(null);
    setCardMenuAnchor(null);
  };

  // Download menu
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const getTrendColor = (trend) =>
    trend > 0 ? theme.palette.success.main : theme.palette.error.main;

  return (
    <Paper
      elevation={7}
      sx={{
        borderRadius: 1,
        px: { xs: 2.5, sm: 3 },
        py: 3.8,
        minHeight: { xs: 210, sm: 180 },
        boxShadow: "0 4px 28px rgba(40, 60, 120, 0.25)",
        background: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
      }}
      component={motion.div}
      initial={{ opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, ease: "easeOut" }}
    >
      {/* Header row */}
      <Box display="flex" alignItems="center" mb={isMobile ? 1.5 : 2}>
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{
            fontFamily: "inherit",
            letterSpacing: 0.15,
            color: theme.palette.text.primary,
            fontSize: { xs: 17, sm: 22 },
          }}
        >
          Key Stats
        </Typography>
        <Box flexGrow={1} />
        <FormControl size="small" variant="outlined" sx={{ minWidth: 105 }}>
          <InputLabel>Period</InputLabel>
          <Select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
            label="Period"
            input={<OutlinedInput label="Period" />}
            sx={{
              borderRadius: 1.1,
              fontWeight: 500,
              fontSize: { xs: 13, sm: 14 },
            }}
          >
            {periods.map((p) => (
              <MenuItem key={p.value} value={p.value}>
                {p.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Tooltip title="Download all stats">
          <IconButton onClick={handleMenuOpen} size="small" sx={{ ml: 0.5 }}>
            <Download fontSize="small" />
          </IconButton>
        </Tooltip>
        <Menu
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleMenuClose}
          slotProps={{ list: { dense: true } }}
          elevation={2}
        >
          <MenuItem onClick={handleMenuClose}>Download as CSV</MenuItem>
          <MenuItem onClick={handleMenuClose}>Download as PDF</MenuItem>
        </Menu>
      </Box>

      {/* Stat Cards */}
      {isMobile ? (
        <Swiper
          spaceBetween={14}
          slidesPerView={1.12}
          centeredSlides={true}
          grabCursor={true}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          modules={[Pagination, A11y]}
          style={{
            paddingBottom: 30,
            marginLeft: -10, // slight nudge for edge-to-edge feel
            marginRight: -10,
          }}
          a11y={{
            prevSlideMessage: "Previous stat",
            nextSlideMessage: "Next stat",
          }}
        >
          {statData.map((stat, idx) => (
            <SwiperSlide
              key={stat.key}
              style={{ width: "90vw", maxWidth: 380 }}
            >
              <Box
                component={motion.div}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.04 }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  background: stat.gradient,
                  borderRadius: 2,
                  p: 2.2,
                  minHeight: 112,
                  minWidth: 0,
                  boxShadow: "0 3px 16px 0 rgba(50,70,130,0.15)",
                  position: "relative",
                  transition: "box-shadow 0.16s, background 0.18s",
                  ":active": { boxShadow: "0 4px 20px 0 rgba(60,90,160,0.22)" },
                  ":hover": { boxShadow: "0 8px 26px 0 rgba(40,90,180,0.19)" },
                  mb: 0.6,
                }}
                aria-label={stat.label}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 46,
                    height: 46,
                    borderRadius: 1.3,
                    background: "rgba(255,255,255,0.13)",
                    flexShrink: 0,
                  }}
                >
                  {stat.icon}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="h4"
                    fontWeight={700}
                    sx={{
                      fontSize: 26,
                      fontFamily: "inherit",
                      color: theme.palette.text.primary,
                      lineHeight: 1.07,
                      mb: 0.2,
                      letterSpacing: 0.2,
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    }}
                    aria-label={`Value: ${stat.value}`}
                  >
                    {stat.currency
                      ? `₹${stat.value.toLocaleString("en-IN")}`
                      : stat.value}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={0.6} mb={0.3}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: theme.palette.text.secondary,
                        fontWeight: 600,
                        fontSize: 15.2,
                        letterSpacing: 0.08,
                        mr: 0.5,
                      }}
                    >
                      {stat.label}
                    </Typography>
                    {typeof stat.trend === "number" && (
                      <Chip
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontSize: 13,
                          pl: 0.3,
                          pr: 0.6,
                          color: getTrendColor(stat.trend),
                          bgcolor: stat.trend > 0 ? "success.50" : "error.50",
                          ml: 0.2,
                          height: 21,
                          minWidth: 36,
                        }}
                        icon={
                          stat.trend > 0 ? (
                            <TrendingUp color="success" fontSize="small" />
                          ) : (
                            <TrendingDown color="error" fontSize="small" />
                          )
                        }
                        label={`${stat.trend > 0 ? "+" : ""}${stat.trend}%`}
                      />
                    )}
                  </Box>
                  <Box>
                    <Tooltip title={stat.tooltip || ""} placement="top" arrow>
                      <IconButton
                        size="small"
                        sx={{
                          color: "#888",
                          p: 0.8,
                          ml: -1,
                        }}
                        onClick={(e) => handleCardMenuOpen(e, stat.key)}
                        aria-label="More options"
                      >
                        <HelpOutline fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                    <Menu
                      open={activeStatKey === stat.key}
                      anchorEl={cardMenuAnchor}
                      onClose={handleCardMenuClose}
                      slotProps={{ list: { dense: true } }}
                      elevation={2}
                      sx={{
                        mt: 1,
                        ml: -1,
                      }}
                    >
                      <MenuItem onClick={handleCardMenuClose}>
                        View Details
                      </MenuItem>
                      <MenuItem onClick={handleCardMenuClose}>
                        Compare with Peers
                      </MenuItem>
                      <MenuItem onClick={handleCardMenuClose}>
                        Trend Analysis
                      </MenuItem>
                    </Menu>
                  </Box>
                </Box>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <Grid container spacing={2} alignItems="stretch">
          {statData.map((stat, idx) => (
            <Grid key={stat.key} item xs={6} sm={3} md={3} lg={3}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.3,
                  bgcolor: "background.default",
                  borderRadius: 1.1,
                  p: 1.7,
                  boxShadow: "0 2px 12px rgba(70,100,200,0.10)",
                  minHeight: 68,
                  position: "relative",
                  transition: "box-shadow 0.18s",
                  ":hover": {
                    boxShadow: "0 6px 22px rgba(40,80,180,0.14)",
                    bgcolor: theme.palette.action.hover,
                  },
                }}
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
              >
                <Tooltip title={stat.tooltip}>
                  <Box
                    sx={{
                      mr: 0.5,
                      borderRadius: "50%",
                      boxShadow: "0 2px 8px 0 rgba(80,100,180,0.05)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 36,
                      height: 36,
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Tooltip>
                <Box sx={{ flex: 1 }}>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Typography
                      variant="subtitle1"
                      fontWeight={700}
                      sx={{
                        fontSize: 19,
                        fontFamily: "inherit",
                        color: theme.palette.text.primary,
                        lineHeight: 1.2,
                      }}
                    >
                      {stat.currency
                        ? `₹${stat.value.toLocaleString("en-IN")}`
                        : stat.value}
                    </Typography>
                    {typeof stat.trend === "number" && (
                      <Chip
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontSize: 13,
                          pl: 0.4,
                          pr: 0.5,
                          color: getTrendColor(stat.trend),
                          bgcolor: stat.trend > 0 ? "success.50" : "error.50",
                          ml: 0.5,
                          height: 19,
                          minWidth: 36,
                        }}
                        icon={
                          stat.trend > 0 ? (
                            <TrendingUp color="success" fontSize="small" />
                          ) : (
                            <TrendingDown color="error" fontSize="small" />
                          )
                        }
                        label={`${stat.trend > 0 ? "+" : ""}${stat.trend}%`}
                      />
                    )}
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontWeight: 500,
                      fontSize: 13,
                      mt: 0.3,
                      letterSpacing: 0.03,
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
                <Tooltip title="More options">
                  <IconButton
                    size="small"
                    sx={{ ml: "auto", color: "grey.400", p: 0.7 }}
                    onClick={(e) => handleCardMenuOpen(e, stat.key)}
                  >
                    <HelpOutline fontSize="inherit" />
                  </IconButton>
                </Tooltip>
                <Menu
                  open={activeStatKey === stat.key}
                  anchorEl={cardMenuAnchor}
                  onClose={handleCardMenuClose}
                  slotProps={{ list: { dense: true } }}
                  elevation={2}
                >
                  <MenuItem onClick={handleCardMenuClose}>
                    View Details
                  </MenuItem>
                  <MenuItem onClick={handleCardMenuClose}>
                    Compare with Peers
                  </MenuItem>
                  <MenuItem onClick={handleCardMenuClose}>
                    Trend Analysis
                  </MenuItem>
                </Menu>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      <Box
        mt={2}
        display="flex"
        alignItems="center"
        gap={isMobile ? 1.2 : 1.8}
        flexDirection={{ xs: "column", sm: "row" }}
        width="100%"
      >
        <Button
          variant="outlined"
          size="small"
          startIcon={<FilterList />}
          fullWidth={isMobile}
          sx={{
            borderRadius: 1.2,
            textTransform: "none",
            fontWeight: 600,
            letterSpacing: 0.07,
            fontSize: { xs: 13, sm: 15 },
            minWidth: 0,
            mb: { xs: 1, sm: 0 }, // add margin between stacked buttons
            boxShadow: isMobile ? "0 2px 12px rgba(120,130,160,0.08)" : "none",
          }}
        >
          Advanced Stats
        </Button>
        <Button
          variant="text"
          size="small"
          color="primary"
          startIcon={<BarChart />}
          fullWidth={isMobile}
          sx={{
            borderRadius: 1.2,
            textTransform: "none",
            fontWeight: 600,
            fontSize: { xs: 13, sm: 15 },
            minWidth: 0,
            boxShadow: isMobile ? "0 2px 12px rgba(120,130,160,0.08)" : "none",
          }}
        >
          Insights & Reports
        </Button>
      </Box>
    </Paper>
  );
};

export default ProviderStatsCard;
