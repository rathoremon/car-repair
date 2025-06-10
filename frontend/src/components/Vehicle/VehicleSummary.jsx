import React, { useState } from "react";
import {
  Avatar,
  Typography,
  Stack,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Box,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  MoreVert,
  CheckCircleOutline,
  WarningAmberOutlined,
  Edit,
  Delete,
  DirectionsCarOutlined as CarIcon,
  CalendarMonthOutlined as CalendarIcon,
  LocalGasStationOutlined as FuelIcon,
} from "@mui/icons-material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(relativeTime);
dayjs.extend(isBetween);

// ---------------------- Date Parsing Helper ----------------------
const parseDate = (dateStr) => {
  const parsed = dayjs(dateStr, "DD-MM-YYYY", true);
  return parsed.isValid() ? parsed : null;
};

// ---------------------- Compliance Score Logic ----------------------
const calculateComplianceScore = (vehicle) => {
  const now = dayjs();
  const insuranceDate = parseDate(vehicle.insuranceExpiryDate);
  const pucDate = parseDate(vehicle.pucValidityDate);
  const serviceDate = parseDate(vehicle.nextServiceDueDate);

  let validCount = 0;
  if (insuranceDate && insuranceDate.isAfter(now)) validCount++;
  if (pucDate && pucDate.isAfter(now)) validCount++;
  if (serviceDate && serviceDate.isAfter(now)) validCount++;

  return validCount * 33;
};

// ---------------------- Reminder Days Calculation ----------------------
const daysUntil = (dateStr) => {
  const parsed = parseDate(dateStr);
  return parsed ? parsed.diff(dayjs(), "day") : null;
};

const oilChangeDueInKM = (v) => {
  const next = parseFloat(v.nextServiceDueKM);
  const last = parseFloat(v.oilChangeKM);
  return !isNaN(next) && !isNaN(last) ? next - last : null;
};

const getChipColor = (days) => {
  if (days === null) return "default";
  if (days < 0) return "error";
  if (days < 15) return "error";
  if (days < 45) return "warning";
  return "success";
};

const getChipLabel = (days, type) => {
  if (days === null) return `N/A ${type}`;
  if (days < 0) return `Overdue ${type}`;
  if (days === 0) return `Due Today ${type}`;
  return `In ${days}d ${type}`;
};

// ---------------------- Main Component ----------------------
const VehicleSummary = ({ vehicle, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  const compliance = calculateComplianceScore(vehicle);
  const complianceColor =
    compliance === 100 ? "success" : compliance >= 66 ? "warning" : "error";
  const complianceLabel =
    compliance === 100 ? "100% Compliant" : `${compliance}% Compliant`;

  const insuranceDays = daysUntil(vehicle.insuranceExpiryDate);
  const pucDays = daysUntil(vehicle.pucValidityDate);
  const serviceDays = daysUntil(vehicle.nextServiceDueDate);
  const oilDueKM = oilChangeDueInKM(vehicle);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const parsedServiceDate = parseDate(vehicle.lastServiceDate);

  return (
    <Box
      className="rounded-xl border bg-white shadow-md hover:shadow-lg transition-all"
      sx={{
        p: { xs: 2, sm: 3 },
        borderColor: "#e0eafc",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Grid
        container
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
      >
        {/* Left: Avatar */}
        <Grid
          item
          xs={12}
          sm={2}
          md={1.5}
          display="flex"
          justifyContent="center"
        >
          <Avatar
            variant="rounded"
            src={vehicle.vehiclePhotoUrl || ""}
            sx={{
              width: 90,
              height: 90,
              borderRadius: 2,
              border: "3px solid #1976d2",
              bgcolor: "#e3f2fd",
            }}
          >
            {!vehicle.vehiclePhotoUrl && <CarIcon fontSize="large" />}
          </Avatar>
        </Grid>

        {/* Center: Vehicle Info */}
        <Grid item xs={12} sm={6} md={7}>
          <Stack spacing={0.6}>
            <Typography variant="h6" fontWeight="bold">
              {vehicle.vehicleMake} {vehicle.vehicleModel}{" "}
              <Typography
                component="span"
                variant="body2"
                color="text.secondary"
              >
                ({vehicle.vehicleYear})
              </Typography>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Reg: <strong>{vehicle.registrationNumber || "N/A"}</strong> |
              Type: {vehicle.carType || "N/A"}
            </Typography>
            <Typography
              variant="body2"
              color="primary"
              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
            >
              <FuelIcon fontSize="small" /> Oil Change:{" "}
              <strong>
                {oilDueKM === null
                  ? "N/A"
                  : oilDueKM <= 0
                  ? "Overdue"
                  : `In ${oilDueKM} KM`}
              </strong>
            </Typography>
            {parsedServiceDate && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
              >
                <CalendarIcon fontSize="inherit" /> Last Serviced:{" "}
                {parsedServiceDate.format("DD MMM, YYYY")}
              </Typography>
            )}
          </Stack>
        </Grid>

        {/* Right: Chips & Actions */}
        <Grid item xs={12} sm={4} md={3.5}>
          <Stack
            direction={{ xs: "column", sm: "row", md: "column" }}
            spacing={1}
            alignItems={{ xs: "flex-start", sm: "flex-end" }}
          >
            <Tooltip title="Vehicle compliance status">
              <Chip
                label={complianceLabel}
                color={complianceColor}
                size="medium"
                icon={
                  compliance === 100 ? (
                    <CheckCircleOutline fontSize="small" />
                  ) : (
                    <WarningAmberOutlined fontSize="small" />
                  )
                }
                sx={{ fontWeight: "bold", minWidth: 130, borderRadius: 0.3 }}
              />
            </Tooltip>

            <Stack
              direction={{ xs: "column", sm: "row", md: "row" }}
              spacing={0}
              alignItems="center"
              justifyContent="flex-end"
              flexWrap="wrap"
              sx={{
                rowGap: 1,
                pl: { xs: 0, sm: 2 },
                columnGap: 1.5,
                mt: { xs: 1, sm: 0 },
                width: "100%",
              }}
            >
              {[
                { label: "Insurance", days: insuranceDays },
                { label: "PUC", days: pucDays },
                { label: "Service", days: serviceDays },
              ].map(({ label, days }) => (
                <Tooltip
                  key={label}
                  title={
                    days === null
                      ? `${label} status unknown`
                      : `${label} ${days < 0 ? "was due" : "due"} in ${Math.abs(
                          days
                        )} day(s)`
                  }
                >
                  <Chip
                    label={getChipLabel(days, label)}
                    color={getChipColor(days)}
                    icon={<CalendarIcon fontSize="small" />}
                    size="small"
                    sx={{
                      fontWeight: 400,
                      px: 1.2,
                      fontSize: "0.7rem",
                      minWidth: 110,
                      justifyContent: "flex-start",
                      borderRadius: 0.3,
                    }}
                  />
                </Tooltip>
              ))}
            </Stack>

            <Box sx={{ alignSelf: { xs: "flex-start", sm: "flex-end" } }}>
              <IconButton onClick={handleMenuOpen}>
                <MoreVert />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    onEdit(vehicle);
                  }}
                >
                  <Edit fontSize="small" sx={{ mr: 1 }} />
                  Edit Vehicle
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    onDelete(vehicle);
                  }}
                  sx={{ color: "error.main" }}
                >
                  <Delete fontSize="small" sx={{ mr: 1 }} />
                  Delete Vehicle
                </MenuItem>
              </Menu>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VehicleSummary;
