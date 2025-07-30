import React from "react";
import {
  Box,
  Stack,
  Typography,
  TextField,
  MenuItem,
  Divider,
  useTheme,
  useMediaQuery,
  Chip,
  InputAdornment,
} from "@mui/material";
import { AccessTime } from "@mui/icons-material";

// Try using MUI X TimePicker, else fallback to native
let TimePicker, LocalizationProvider, AdapterDateFns;
try {
  TimePicker = require("@mui/x-date-pickers/TimePicker").TimePicker;
  LocalizationProvider =
    require("@mui/x-date-pickers/LocalizationProvider").LocalizationProvider;
  AdapterDateFns = require("@mui/x-date-pickers/AdapterDateFns").AdapterDateFns;
} catch (e) {}

const days = [
  { key: "mon", label: "Monday" },
  { key: "tue", label: "Tuesday" },
  { key: "wed", label: "Wednesday" },
  { key: "thu", label: "Thursday" },
  { key: "fri", label: "Friday" },
  { key: "sat", label: "Saturday" },
  { key: "sun", label: "Sunday" },
];
const options = [
  { value: "", label: "Unavailable" },
  { value: "full", label: "Full Day" },
  { value: "custom", label: "Custom Hours" },
];

const parseTime = (str) => {
  if (!str) return null;
  const [h, m] = str.split(":");
  const date = new Date();
  date.setHours(Number(h), Number(m), 0, 0);
  return date;
};
const formatTime = (date) =>
  date
    ? date
        .toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
        .slice(0, 5)
    : "";

export default function AvailabilityEditor({ value = {}, onChange }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Handlers
  const handleTypeChange = (day, type) => {
    const next = { ...value, [day]: { type } };
    if (type === "custom") next[day] = { type, from: "09:00", to: "18:00" };
    if (type === "full") next[day] = { type };
    if (!type) next[day] = { type: "" };
    onChange(next);
  };
  const handleTimeChange = (day, which, val) => {
    const next = {
      ...value,
      [day]: { ...value[day], [which]: val },
    };
    onChange(next);
  };

  return (
    <Box>
      <Typography
        variant="subtitle2"
        color="text.secondary"
        sx={{ mb: 1.5, fontWeight: 700 }}
      >
        Weekly Availability
      </Typography>
      <Box
        sx={{
          borderRadius: 2,
          background: "#f7f9fc",
          maxHeight: 700,
          px: { xs: 0.5, sm: 2 },
          py: { xs: 0.5, sm: 2 },
        }}
      >
        {days.map((d, idx) => (
          <React.Fragment key={d.key}>
            <Stack
              direction={isMobile ? "column" : "row"}
              alignItems={isMobile ? "flex-start" : "center"}
              spacing={isMobile ? 1.1 : 2}
              sx={{
                py: { xs: 1, sm: 1.5 },
                px: { xs: 1, sm: 0 },
                borderRadius: 2,
                background: "#fff",
                mb: isMobile ? 2 : 0,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  minWidth: isMobile ? "auto" : 86,
                  fontWeight: 700,
                  color: "#43526c",
                  mb: isMobile ? 0.4 : 0,
                }}
              >
                {d.label}
              </Typography>
              <TextField
                select
                size="small"
                variant="outlined"
                value={value[d.key]?.type || ""}
                onChange={(e) => handleTypeChange(d.key, e.target.value)}
                sx={{
                  width: isMobile ? "100%" : 138,
                  maxWidth: 170,
                  ".MuiSelect-select": {
                    py: 1.2,
                    fontWeight: 500,
                  },
                  background: "#f9fafd",
                  borderRadius: 1.5,
                  mt: isMobile ? 0 : 0,
                }}
                InputProps={{
                  sx: { fontWeight: 500 },
                }}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        borderRadius: 2,
                        mt: 0.5,
                        boxShadow: "0 4px 18px rgba(36,50,85,0.09)",
                      },
                    },
                  },
                }}
              >
                {options.map((opt) => (
                  <MenuItem value={opt.value} key={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>

              {/* Custom time fields */}
              {value[d.key]?.type === "custom" && (
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{
                    mt: isMobile ? 0.5 : 0,
                    width: isMobile ? "100%" : "auto",
                  }}
                >
                  {TimePicker && LocalizationProvider && AdapterDateFns ? (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <TimePicker
                        ampm={false}
                        minutesStep={15}
                        value={parseTime(value[d.key]?.from)}
                        onChange={(date) =>
                          handleTimeChange(d.key, "from", formatTime(date))
                        }
                        slotProps={{
                          textField: {
                            size: "small",
                            variant: "outlined",
                            sx: {
                              width: 96,
                              bgcolor: "#f8fbfe",
                              borderRadius: 1.2,
                            },
                            InputProps: {
                              endAdornment: (
                                <InputAdornment position="end">
                                  <AccessTime
                                    sx={{
                                      fontSize: 18,
                                      color: "#b5b8ce",
                                    }}
                                  />
                                </InputAdornment>
                              ),
                            },
                          },
                        }}
                        label="From"
                      />
                    </LocalizationProvider>
                  ) : (
                    <TextField
                      size="small"
                      type="time"
                      value={value[d.key]?.from || "09:00"}
                      onChange={(e) =>
                        handleTimeChange(d.key, "from", e.target.value)
                      }
                      sx={{
                        width: 96,
                        bgcolor: "#f8fbfe",
                        borderRadius: 1.2,
                        border: "1.5px solid #e9ecf1",
                      }}
                      inputProps={{
                        step: 900,
                        style: {
                          padding: "8px",
                          fontWeight: 500,
                          fontSize: 15,
                        },
                      }}
                    />
                  )}
                  <Typography variant="body2" color="text.secondary">
                    –
                  </Typography>
                  {TimePicker && LocalizationProvider && AdapterDateFns ? (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <TimePicker
                        ampm={false}
                        minutesStep={15}
                        value={parseTime(value[d.key]?.to)}
                        onChange={(date) =>
                          handleTimeChange(d.key, "to", formatTime(date))
                        }
                        slotProps={{
                          textField: {
                            size: "small",
                            variant: "outlined",
                            sx: {
                              width: 96,
                              bgcolor: "#f8fbfe",
                              borderRadius: 1.2,
                            },
                            InputProps: {
                              endAdornment: (
                                <InputAdornment position="end">
                                  <AccessTime
                                    sx={{
                                      fontSize: 18,
                                      color: "#b5b8ce",
                                    }}
                                  />
                                </InputAdornment>
                              ),
                            },
                          },
                        }}
                        label="To"
                      />
                    </LocalizationProvider>
                  ) : (
                    <TextField
                      size="small"
                      type="time"
                      value={value[d.key]?.to || "18:00"}
                      onChange={(e) =>
                        handleTimeChange(d.key, "to", e.target.value)
                      }
                      sx={{
                        width: 96,
                        bgcolor: "#f8fbfe",
                        borderRadius: 1.2,
                        border: "1.5px solid #e9ecf1",
                      }}
                      inputProps={{
                        step: 900,
                        style: {
                          padding: "8px",
                          fontWeight: 500,
                          fontSize: 15,
                        },
                      }}
                    />
                  )}
                </Stack>
              )}

              {/* Full Day */}
              {value[d.key]?.type === "full" && (
                <Typography
                  variant="body2"
                  color="success.main"
                  sx={{
                    ml: 1,
                    minWidth: 102,
                    fontWeight: 600,
                    fontSize: 15,
                    letterSpacing: 0.1,
                  }}
                >
                  09:00 – 18:00
                </Typography>
              )}

              {/* Unavailable */}
              {!value[d.key]?.type && (
                <Typography
                  variant="body2"
                  color="text.disabled"
                  sx={{
                    ml: 1,
                    fontSize: 15,
                    minWidth: 94,
                  }}
                >
                  Not Available
                </Typography>
              )}
            </Stack>
            {idx !== days.length - 1 && (
              <Divider sx={{ my: { xs: 0.7, sm: 1.5 } }} />
            )}
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
}
