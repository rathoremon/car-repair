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
import { getVehiclePhotoUrl } from "../../utils/media";

const parseDate = (s) => {
  if (!s) return null;
  // both "YYYY-MM-DD" and "DD-MM-YYYY"
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return dayjs(s);
  if (/^\d{2}-\d{2}-\d{4}$/.test(s)) {
    const [d, m, y] = s.split("-");
    return dayjs(`${y}-${m}-${d}`);
  }
  return null;
};

const daysUntil = (s) => {
  const d = parseDate(s);
  return d ? d.diff(dayjs(), "day") : null;
};

const oilChangeDueInKM = (v) => {
  const next = parseFloat(v.nextServiceDueKM);
  const last = parseFloat(v.oilChangeKM);
  return !isNaN(next) && !isNaN(last) ? next - last : null;
};

const getChipColor = (days) => {
  if (days === null) return "default";
  if (days < 0) return "error";
  if (days < 45) return "warning";
  return "success";
};
const getChipLabel = (days, label) => {
  if (days === null) return `N/A ${label}`;
  if (days < 0) return `Overdue ${label}`;
  if (days === 0) return `Due Today ${label}`;
  return `In ${days}d ${label}`;
};

function complianceScore(v) {
  const now = dayjs();
  const checks = [
    parseDate(v.insuranceExpiryDate),
    parseDate(v.pucValidityDate),
    parseDate(v.nextServiceDueDate),
  ];
  const validCount = checks.reduce(
    (acc, d) => acc + (d && d.isAfter(now) ? 1 : 0),
    0
  );
  return validCount * 33;
}

export default function VehicleSummary({ vehicle, onEdit, onDelete }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  const photoSrc = getVehiclePhotoUrl(vehicle);
  const hasPhoto = !!photoSrc && !photoSrc.includes("placeholder-image");

  const compliance = complianceScore(vehicle);
  const complianceColor =
    compliance === 100 ? "success" : compliance >= 66 ? "warning" : "error";
  const complianceLabel =
    compliance === 100 ? "100% Compliant" : `${compliance}% Compliant`;

  const insuranceDays = daysUntil(vehicle.insuranceExpiryDate);
  const pucDays = daysUntil(vehicle.pucValidityDate);
  const serviceDays = daysUntil(vehicle.nextServiceDueDate);
  const oilDueKM = oilChangeDueInKM(vehicle);

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
        {/* Avatar */}
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
            src={hasPhoto ? photoSrc : undefined}
            sx={{
              width: 90,
              height: 90,
              borderRadius: 2,
              border: "3px solid #1976d2",
              bgcolor: "#e3f2fd",
            }}
          >
            {!hasPhoto && <CarIcon fontSize="large" />}
          </Avatar>
        </Grid>

        {/* Info */}
        <Grid item xs={12} sm={6} md={7}>
          <Stack spacing={0.6}>
            <Typography variant="h6" fontWeight="bold">
              {vehicle.make} {vehicle.model}{" "}
              <Typography
                component="span"
                variant="body2"
                color="text.secondary"
              >
                ({vehicle.year})
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
              <FuelIcon fontSize="small" /> Fuel:{" "}
              <strong>{vehicle.fuelType || "N/A"}</strong> • Oil Change:{" "}
              <strong>
                {oilDueKM == null
                  ? "N/A"
                  : oilDueKM <= 0
                  ? "Overdue"
                  : `In ${oilDueKM} KM`}
              </strong>
            </Typography>
            {vehicle.lastServiceDate && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
              >
                <CalendarIcon fontSize="inherit" /> Last Serviced:{" "}
                {parseDate(vehicle.lastServiceDate)?.format("DD MMM, YYYY")}
              </Typography>
            )}
          </Stack>
        </Grid>

        {/* Right actions */}
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
                    days == null
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
                      px: 1.2,
                      fontSize: "0.7rem",
                      minWidth: 110,
                      borderRadius: 0.3,
                    }}
                  />
                </Tooltip>
              ))}
            </Stack>

            <Box sx={{ alignSelf: { xs: "flex-start", sm: "flex-end" } }}>
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <MoreVert />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
              >
                <MenuItem
                  onClick={() => {
                    setAnchorEl(null);
                    onEdit(vehicle);
                  }}
                >
                  <Edit fontSize="small" sx={{ mr: 1 }} /> Edit Vehicle
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setAnchorEl(null);
                    onDelete(vehicle);
                  }}
                  sx={{ color: "error.main" }}
                >
                  <Delete fontSize="small" sx={{ mr: 1 }} /> Delete Vehicle
                </MenuItem>
              </Menu>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
