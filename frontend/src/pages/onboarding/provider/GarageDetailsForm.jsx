import React, { useRef } from "react";
import {
  Box,
  TextField,
  Typography,
  Chip,
  Autocomplete,
  Stack,
  InputAdornment,
} from "@mui/material";
import RoomIcon from "@mui/icons-material/Room";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function GarageDetailsForm({ garage, errors, onChange }) {
  // Service Area: Add on blur if not empty
  const serviceAreaInput = useRef();

  const handleServiceAreaChange = (event, value) => {
    onChange("serviceArea", value);
  };

  const handleServiceAreaBlur = (e) => {
    const val = e.target.value.trim();
    if (val && !(garage.serviceArea || []).includes(val)) {
      onChange("serviceArea", [...(garage.serviceArea || []), val]);
    }
  };

  const handleWorkingHoursChange = (field, value) => {
    onChange("workingHours", { ...garage.workingHours, [field]: value });
  };

  const handleAvailabilityChange = (event, value) => {
    onChange("availability", value);
  };

  const handleLocationChange = (e) => {
    const [lat, lng] = e.target.value.split(",");
    onChange("location", {
      lat: lat && !isNaN(Number(lat)) ? parseFloat(lat) : "",
      lng: lng && !isNaN(Number(lng)) ? parseFloat(lng) : "",
    });
  };

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={600} mb={1}>
        General Information
      </Typography>
      <TextField
        label="Garage Name"
        value={garage.companyName || ""}
        onChange={(e) => onChange("companyName", e.target.value)}
        error={!!errors.companyName}
        helperText={errors.companyName}
        fullWidth
        required
        sx={{ mb: 2 }}
        inputProps={{ maxLength: 64, "aria-label": "Garage Name" }}
      />

      <Autocomplete
        multiple
        freeSolo
        options={[]}
        value={garage.serviceArea || []}
        onChange={handleServiceAreaChange}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              variant="outlined"
              color="primary"
              label={option}
              {...getTagProps({ index })}
              key={option}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Service Areas (type and press Enter)"
            error={!!errors.serviceArea}
            helperText={errors.serviceArea || "Type and press Enter to add"}
            fullWidth
            sx={{ mb: 2 }}
            inputRef={serviceAreaInput}
            onBlur={handleServiceAreaBlur}
            inputProps={{
              ...params.inputProps,
              "aria-label": "Service Areas",
              maxLength: 32,
            }}
          />
        )}
      />

      <TextField
        label="Location (Latitude,Longitude)"
        value={
          garage.location
            ? `${garage.location.lat || ""},${garage.location.lng || ""}`
            : ""
        }
        onChange={handleLocationChange}
        error={!!errors.location}
        helperText={errors.location || "Example: 28.6139,77.2090"}
        fullWidth
        sx={{ mb: 2 }}
        placeholder="28.6139,77.2090"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <RoomIcon color="primary" />
            </InputAdornment>
          ),
        }}
      />

      <Autocomplete
        multiple
        options={DAYS}
        value={garage.availability || []}
        onChange={handleAvailabilityChange}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              variant="outlined"
              color="secondary"
              label={option}
              {...getTagProps({ index })}
              key={option}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Available Days"
            error={!!errors.availability}
            helperText={errors.availability}
            fullWidth
            sx={{ mb: 2 }}
            inputProps={{
              ...params.inputProps,
              "aria-label": "Available Days",
            }}
          />
        )}
      />

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="Opening Time"
          type="time"
          value={garage.workingHours?.open || ""}
          onChange={(e) => handleWorkingHoursChange("open", e.target.value)}
          error={!!errors.workingHours}
          helperText={errors.workingHours}
          fullWidth
          sx={{ flex: 1 }}
        />
        <TextField
          label="Closing Time"
          type="time"
          value={garage.workingHours?.close || ""}
          onChange={(e) => handleWorkingHoursChange("close", e.target.value)}
          error={!!errors.workingHours}
          helperText={errors.workingHours}
          fullWidth
          sx={{ flex: 1 }}
        />
      </Stack>
    </Box>
  );
}
