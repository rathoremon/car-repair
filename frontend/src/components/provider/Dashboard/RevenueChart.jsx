import React, { useState, useMemo } from "react";
import {
  Paper,
  Typography,
  Box,
  IconButton,
  Tooltip as MuiTooltip,
  CircularProgress,
  Button,
  Fade,
  MenuItem,
  Chip,
  useTheme,
  Select,
  FormControl,
  InputLabel,
  useMediaQuery,
  Stack,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Label,
} from "recharts";
import { motion } from "framer-motion";

// Custom number animation hook
function useAnimatedNumber(value, duration = 750) {
  const [display, setDisplay] = useState(value);
  React.useEffect(() => {
    let start = display;
    let diff = value - start;
    let startTime = null;
    if (diff === 0) return;
    const animate = (t) => {
      if (!startTime) startTime = t;
      let p = Math.min((t - startTime) / duration, 1);
      setDisplay(Math.round(start + diff * p));
      if (p < 1) requestAnimationFrame(animate);
      else setDisplay(value);
    };
    requestAnimationFrame(animate);
    // eslint-disable-next-line
  }, [value]);
  return display;
}

// Mock async data fetch, can be replaced by real API
const useRevenueData = (currency, range) => {
  const [loading] = useState(false);
  const fx = { INR: 1, USD: 1 / 83, EUR: 1 / 90 };
  const raw = [
    { month: "Jan", revenue: 12000 },
    { month: "Feb", revenue: 17800 },
    { month: "Mar", revenue: 14100 },
    { month: "Apr", revenue: 21000 },
    { month: "May", revenue: 24600 },
    { month: "Jun", revenue: 19000 },
  ];
  let filtered = raw;
  if (range === "last3") filtered = raw.slice(-3);
  if (range === "ytd") filtered = raw;
  if (range === "prev") filtered = raw.slice(0, raw.length - 1);
  const data = filtered.map((d) => ({
    ...d,
    revenue: Math.round(d.revenue * fx[currency]),
  }));
  return { data, loading };
};

function exportToCsv(rows) {
  if (!rows || !rows.length) return;
  const header = Object.keys(rows[0]).join(",");
  const body = rows.map((row) => Object.values(row).join(",")).join("\n");
  const csv = `${header}\n${body}`;
  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "revenue.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
function exportToPng() {
  alert("Export to PNG coming soon!");
}

const CURRENCIES = [
  { code: "INR", label: "₹", name: "Rupee" },
  { code: "USD", label: "$", name: "Dollar" },
  { code: "EUR", label: "€", name: "Euro" },
];
const RANGES = [
  { value: "ytd", label: "Year to Date" },
  { value: "last3", label: "Last 3 Months" },
  { value: "prev", label: "Previous Months" },
];

const RevenueChart = () => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [currency, setCurrency] = useState("INR");
  const [range, setRange] = useState("ytd");
  const { data, loading } = useRevenueData(currency, range);
  const empty = !loading && (!data || data.length === 0);

  // Growth % calculation (vs previous period)
  const currentTotal = useMemo(
    () => data.reduce((a, c) => a + c.revenue, 0),
    [data]
  );
  const prevData = useRevenueData(currency, "prev").data;
  const prevTotal = prevData.reduce((a, c) => a + c.revenue, 0);
  const growth =
    prevTotal === 0 ? 0 : ((currentTotal - prevTotal) / prevTotal) * 100;
  const animatedTotal = useAnimatedNumber(currentTotal);

  // Value label on last data point
  const renderLineLabel = (props) => {
    const { x, y, value, index } = props;
    if (index === data.length - 1)
      return (
        <text
          x={x + (isXs ? 4 : 8)}
          y={y - (isXs ? 4 : 10)}
          fontSize={isXs ? 12 : 14}
          fontWeight="bold"
          fill={theme.palette.primary.main}
          fontFamily="Inter, Roboto, Arial, sans-serif"
        >
          {CURRENCIES.find((c) => c.code === currency).label}
          {value.toLocaleString()}
        </text>
      );
    return null;
  };

  const EmptyState = () => (
    <Box
      sx={{
        textAlign: "center",
        pt: { xs: 2, sm: 3 },
        color: theme.palette.text.disabled,
      }}
    >
      <MonetizationOnIcon
        sx={{ fontSize: isXs ? 36 : 54, mb: 1, color: theme.palette.grey[300] }}
      />
      <Typography
        variant={isXs ? "subtitle1" : "h6"}
        fontWeight={600}
        sx={{ letterSpacing: -0.3 }}
      >
        No Revenue Data
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        There is no revenue activity for this period.
      </Typography>
      <Button
        size="small"
        variant="outlined"
        onClick={() => window.location.reload()}
        sx={{
          borderRadius: 1.5,
          fontSize: isXs ? 12 : 14,
          px: isXs ? 1.5 : 2.5,
        }}
      >
        Refresh
      </Button>
    </Box>
  );

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 1.2,
        p: { xs: 1.5, sm: 2, md: 2.5 },
        minHeight: { xs: 310, sm: 350 },
        boxShadow: "0 4px 28px rgba(40, 60, 120, 0.25)",
        background: theme.palette.background.paper,

        border: `1px solid ${theme.palette.divider}`,
        fontFamily: "Inter, Roboto, Arial, sans-serif",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "box-shadow 0.23s",
      }}
      component={motion.div}
      initial={{ opacity: 0, y: 26, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.53, type: "spring" }}
      role="region"
      aria-label="Provider Revenue Analytics"
    >
      {/* Controls & summary */}
      <Stack
        direction={isXs ? "column" : "row"}
        alignItems={isXs ? "flex-start" : "center"}
        justifyContent="space-between"
        gap={1.5}
        px={0.5}
        pt={1}
        pb={1}
        spacing={isXs ? 1.2 : 0}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
          <Typography
            variant="h6"
            fontWeight={700}
            letterSpacing={-0.5}
            sx={{
              fontFamily: "Inter, Roboto, Arial, sans-serif",
              fontSize: { xs: 16.5, sm: 18.5, md: 19.5 },
              color: theme.palette.text.primary,
              userSelect: "none",
              lineHeight: 1.15,
            }}
          >
            Revenue Trend
          </Typography>
          <Chip
            icon={<TrendingUpIcon fontSize="small" sx={{ color: "#fff" }} />}
            label={
              <span
                style={{
                  fontWeight: 600,
                  color: "#fff",
                  fontFamily: "Inter, Roboto",
                  fontSize: isXs ? 11.2 : 13,
                }}
              >
                {growth >= 0 ? "+" : ""}
                {Math.abs(growth).toFixed(1)}%
              </span>
            }
            size="small"
            sx={{
              bgcolor:
                growth >= 0
                  ? theme.palette.success.main
                  : theme.palette.error.light,
              color: "#fff",
              fontWeight: 600,
              ml: 1,
              borderRadius: 1.1,
            }}
            aria-label={`Growth is ${growth.toFixed(1)} percent`}
          />
        </Box>
        <Stack
          direction="row"
          spacing={isXs ? 0.5 : 1}
          width={isXs ? "100%" : "auto"}
          justifyContent={isXs ? "space-between" : "flex-end"}
        >
          <FormControl size="small" sx={{ minWidth: 108, mr: isXs ? 0.2 : 1 }}>
            <InputLabel id="range-select-label" sx={{ fontSize: 13.3 }}>
              <CalendarMonthIcon fontSize="inherit" sx={{ mr: 0.5 }} />
              Range
            </InputLabel>
            <Select
              labelId="range-select-label"
              id="range-select"
              value={range}
              label="Range"
              onChange={(e) => setRange(e.target.value)}
              sx={{
                fontWeight: 600,
                fontSize: isXs ? 12 : 14,
                borderRadius: 1,
                minHeight: isXs ? 28 : 36,
              }}
              MenuProps={{
                PaperProps: { style: { fontSize: isXs ? 12 : 14 } },
              }}
            >
              {RANGES.map((r) => (
                <MenuItem key={r.value} value={r.value}>
                  {r.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 74 }}>
            <InputLabel id="currency-select-label" sx={{ fontSize: 13.3 }}>
              Currency
            </InputLabel>
            <Select
              labelId="currency-select-label"
              id="currency-select"
              value={currency}
              label="Currency"
              onChange={(e) => setCurrency(e.target.value)}
              sx={{
                fontWeight: 600,
                fontSize: isXs ? 12 : 14,
                borderRadius: 1,
                minHeight: isXs ? 28 : 36,
              }}
              MenuProps={{
                PaperProps: { style: { fontSize: isXs ? 12 : 14 } },
              }}
            >
              {CURRENCIES.map((cur) => (
                <MenuItem key={cur.code} value={cur.code}>
                  {cur.label} {cur.code}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Stack>

      {/* Animated total revenue */}
      <Box
        sx={{
          display: "flex",
          alignItems: isXs ? "flex-start" : "center",
          gap: 1,
          mt: isXs ? 0.5 : -1,
          mb: 1.1,
          pl: 1.2,
          flexDirection: isXs ? "column" : "row",
        }}
      >
        <Typography
          component="span"
          variant="h3"
          fontWeight={700}
          sx={{
            fontFamily: "Inter, Roboto, Arial, sans-serif",
            fontSize: isXs ? 22 : 27,
            color: theme.palette.primary.main,
            letterSpacing: -1,
            lineHeight: 1.1,
            mr: isXs ? 0 : 0.7,
          }}
          aria-live="polite"
        >
          {CURRENCIES.find((c) => c.code === currency).label}
          {animatedTotal.toLocaleString()}
        </Typography>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          fontWeight={500}
          sx={{ mt: isXs ? 0 : 0, fontSize: isXs ? 11 : 13 }}
        >
          Total in selected range
        </Typography>
      </Box>

      {/* Chart/Loader/Empty State */}
      <Box
        sx={{
          flexGrow: 1,
          minHeight: isXs ? 124 : 180,
          position: "relative",
          pb: 0.5,
        }}
      >
        {loading && (
          <Fade in={loading}>
            <Box
              sx={{
                minHeight: isXs ? 100 : 150,
                display: loading ? "flex" : "none",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 1,
                background: theme.palette.background.paper,
              }}
            >
              <CircularProgress size={isXs ? 24 : 32} />
            </Box>
          </Fade>
        )}
        {!loading && empty && (
          <Fade in>
            <Box>
              <EmptyState />
            </Box>
          </Fade>
        )}
        {!loading && !empty && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, type: "spring", stiffness: 90 }}
            style={{ width: "100%", height: isXs ? 140 : 210 }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{
                  top: isXs ? 7 : 18,
                  right: isXs ? 58 : 64,
                  left: isXs ? 2 : 24,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  stroke={theme.palette.divider}
                  strokeDasharray="4 2"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{
                    fontSize: isXs ? 12.5 : 15,
                    fontWeight: 800,
                    fontFamily: "Inter",
                  }}
                  axisLine={false}
                  tickLine={false}
                  padding={{ left: isXs ? 0 : 6, right: isXs ? 0 : 6 }}
                />
                <YAxis
                  tickFormatter={(v) =>
                    `${CURRENCIES.find((c) => c.code === currency).label}${(
                      v / 1000
                    ).toFixed(1)}k`
                  }
                  axisLine={false}
                  tickLine={false}
                  style={{
                    fontSize: isXs ? 11 : 13,
                    fontWeight: 700,
                    fontFamily: "Inter",
                  }}
                >
                  <Label
                    value={`Revenue (${
                      CURRENCIES.find((c) => c.code === currency).label
                    })`}
                    angle={-90}
                    position="insideLeft"
                    offset={isXs ? -9 : -18}
                    style={{
                      fontSize: isXs ? 10 : 13,
                      fill: theme.palette.text.secondary,
                      fontFamily: "Inter",
                      fontWeight: 700,
                    }}
                  />
                </YAxis>
                <Tooltip
                  cursor={{
                    fill: theme.palette.action.hover,
                    opacity: 0.1,
                  }}
                  formatter={(v) =>
                    `${
                      CURRENCIES.find((c) => c.code === currency).label
                    }${v.toLocaleString()}`
                  }
                  labelStyle={{
                    fontWeight: 700,
                    fontFamily: "Inter",
                    fontSize: isXs ? 12 : 14,
                  }}
                  contentStyle={{
                    borderRadius: 8,
                    boxShadow: "0 8px 36px rgba(0,0,0,0.07)",
                    fontSize: isXs ? 12 : 14,
                    fontFamily: "Inter",
                    background: theme.palette.background.paper,
                    border: "1px solid " + theme.palette.divider,
                  }}
                />
                {!isXs && (
                  <Legend
                    verticalAlign="top"
                    height={24}
                    wrapperStyle={{
                      fontSize: 13,
                      fontFamily: "Inter",
                      marginBottom: 0,
                      color: theme.palette.text.secondary,
                    }}
                  />
                )}
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Monthly Revenue"
                  stroke={theme.palette.primary.main}
                  strokeWidth={isXs ? 2.5 : 3.3}
                  dot={{
                    r: isXs ? 3 : 4.5,
                    fill: "#fff",
                    stroke: theme.palette.primary.main,
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: isXs ? 4.2 : 7,
                    stroke: theme.palette.secondary.main,
                    strokeWidth: isXs ? 2 : 3,
                    fill: "#fff",
                  }}
                  isAnimationActive
                  animationDuration={900}
                  label={renderLineLabel}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </Box>

      {/* Actions bar: stacked and sticky for mobile */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        gap={1}
        mt={isXs ? 0.3 : 0.8}
        sx={{
          position: isXs ? "sticky" : "static",
          bottom: isXs ? 0 : "auto",
          background: isXs
            ? theme.palette.mode === "dark"
              ? "#191a1f"
              : "#fff"
            : "inherit",
          zIndex: 2,
          py: isXs ? 0.4 : 0,
        }}
      >
        <MuiTooltip title="Export as CSV" arrow>
          <span>
            <IconButton
              size={isXs ? "small" : "medium"}
              onClick={() => exportToCsv(data)}
              disabled={loading || empty}
              aria-label="Export revenue data as CSV"
              sx={{
                borderRadius: 1.2,
                color:
                  loading || empty
                    ? theme.palette.text.disabled
                    : theme.palette.text.secondary,
                transition: "background 0.18s, color 0.18s",
                ":hover": {
                  background: theme.palette.action.hover,
                  color: theme.palette.primary.main,
                },
                fontSize: isXs ? 20 : 24,
                px: isXs ? 0.7 : 1.2,
              }}
            >
              <DownloadIcon fontSize={isXs ? "small" : "medium"} />
            </IconButton>
          </span>
        </MuiTooltip>
        <MuiTooltip title="Download as PNG (soon)" arrow>
          <span>
            <IconButton
              size={isXs ? "small" : "medium"}
              onClick={exportToPng}
              disabled={loading || empty}
              aria-label="Export revenue chart as PNG"
              sx={{
                borderRadius: 1.2,
                color:
                  loading || empty
                    ? theme.palette.text.disabled
                    : theme.palette.text.secondary,
                transition: "background 0.18s, color 0.18s",
                ":hover": {
                  background: theme.palette.action.hover,
                  color: theme.palette.primary.main,
                },
                px: isXs ? 0.7 : 1.2,
              }}
            >
              <img
                src="https://img.icons8.com/material/24/000000/image.png"
                alt="Download as PNG"
                style={{
                  width: isXs ? 15 : 18,
                  height: isXs ? 15 : 18,
                  opacity: 0.84,
                  verticalAlign: "middle",
                }}
              />
            </IconButton>
          </span>
        </MuiTooltip>
      </Stack>
    </Paper>
  );
};

export default RevenueChart;
