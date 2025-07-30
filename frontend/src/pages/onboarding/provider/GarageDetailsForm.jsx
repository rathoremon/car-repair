// src/components/onboarding/provider/GarageDetailsForm.jsx
import React from "react";
import {
  Box,
  TextField,
  Typography,
  Autocomplete,
  Stack,
  InputAdornment,
  IconButton,
  Tooltip,
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

export default function GarageDetailsForm({
  garage,
  errors,
  onChange = () => {},
  onLocationPicker,
}) {
  // Pick from either categories or serviceCategories for prefill support!
  const selectedCategories = garage?.categories?.length
    ? garage.categories
    : garage?.serviceCategories || [];
  const serviceArea = garage?.serviceArea || [];
  const availability = garage?.availability || [];
  const workingHours = garage?.workingHours || {};

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

      {/* Service Categories */}
      <Autocomplete
        multiple
        options={garage.allCategories || []}
        value={selectedCategories}
        onChange={(_, value) => onChange("categories", value)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select Services Offered"
            placeholder="e.g. Battery, Tyres, Towing"
            error={!!errors.categories}
            helperText={errors.categories}
            fullWidth
            sx={{ mb: 2 }}
          />
        )}
      />

      {/* Service Area */}
      <Autocomplete
        multiple
        freeSolo
        options={[]}
        value={serviceArea}
        onChange={(_, value) => onChange("serviceArea", value)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Service Areas (type and press Enter)"
            error={!!errors.serviceArea}
            helperText={errors.serviceArea}
            fullWidth
            sx={{ mb: 2 }}
            inputProps={{
              ...params.inputProps,
              "aria-label": "Service Areas",
              maxLength: 32,
            }}
          />
        )}
      />

      {/* Location */}
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <TextField
          label="Location (Latitude,Longitude)"
          value={
            garage.location
              ? `${garage.location.lat || ""},${garage.location.lng || ""}`
              : ""
          }
          onChange={(e) => {
            const [lat, lng] = e.target.value.split(",");
            onChange("location", {
              lat: lat && !isNaN(Number(lat)) ? parseFloat(lat) : "",
              lng: lng && !isNaN(Number(lng)) ? parseFloat(lng) : "",
            });
          }}
          error={!!errors.location}
          helperText={errors.location || "Example: 28.6139,77.2090"}
          fullWidth
          placeholder="28.6139,77.2090"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <RoomIcon color="primary" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Pick from map">
                  <IconButton onClick={onLocationPicker} aria-label="Open Map">
                    <RoomIcon />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Available Days */}
      <Autocomplete
        multiple
        options={DAYS}
        value={availability}
        onChange={(_, value) => onChange("availability", value)}
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

      {/* Working Hours */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="Opening Time"
          type="time"
          value={workingHours.open || ""}
          onChange={(e) =>
            onChange("workingHours", { ...workingHours, open: e.target.value })
          }
          error={!!errors.workingHours}
          helperText={errors.workingHours}
          fullWidth
        />
        <TextField
          label="Closing Time"
          type="time"
          value={workingHours.close || ""}
          onChange={(e) =>
            onChange("workingHours", { ...workingHours, close: e.target.value })
          }
          error={!!errors.workingHours}
          helperText={errors.workingHours}
          fullWidth
        />
      </Stack>
    </Box>
  );
}
