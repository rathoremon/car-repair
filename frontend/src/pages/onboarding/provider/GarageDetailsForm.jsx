import React, { useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Chip,
  Autocomplete,
  Stack,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import RoomIcon from "@mui/icons-material/Room";
import { useDispatch, useSelector } from "react-redux";
import { fetchServiceCategories } from "../../../features/serviceCategory/serviceCategoryThunks";

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
}) {
  const dispatch = useDispatch();
  const { categories = [], loading } = useSelector(
    (state) => state.serviceCategory
  );

  const serviceArea = garage?.serviceArea || [];
  const selectedCategories = garage?.categories || [];
  const availability = garage?.availability || [];
  const workingHours = garage?.workingHours || {};

  useEffect(() => {
    dispatch(fetchServiceCategories());
  }, [dispatch]);

  const handleServiceAreaKeyDown = (e) => {
    const input = e.target.value.trim();
    if (e.key === "Enter" && input) {
      e.preventDefault();
      if (!serviceArea.includes(input)) {
        onChange("serviceArea", [...serviceArea, input]);
      }
      setTimeout(() => {
        if (e.target.value) e.target.value = "";
      }, 0);
    }
  };

  const handleServiceAreaDelete = (optionToDelete) => {
    onChange(
      "serviceArea",
      serviceArea.filter((option) => option !== optionToDelete)
    );
  };

  const handleCategoryDelete = (optionToDelete) => {
    onChange(
      "categories",
      selectedCategories.filter((option) => option !== optionToDelete)
    );
  };

  const handleCategoriesChange = (event, value) => {
    onChange("categories", value);
  };

  const handleAvailabilityChange = (event, value) => {
    onChange("availability", value);
  };

  const handleWorkingHoursChange = (field, value) => {
    onChange("workingHours", { ...workingHours, [field]: value });
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
        options={categories.map((cat) => cat.name)}
        loading={loading}
        value={selectedCategories}
        onChange={handleCategoriesChange}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              variant="outlined"
              color="primary"
              label={option}
              {...getTagProps({ index })}
              key={option}
              onDelete={() => handleCategoryDelete(option)}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select Services Offered"
            placeholder="e.g. Battery, Tyres, Towing"
            error={!!errors.categories}
            helperText={
              errors.categories || "Choose from admin-defined categories"
            }
            fullWidth
            sx={{ mb: 2 }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress size={18} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />

      <Autocomplete
        multiple
        freeSolo
        options={[]}
        value={serviceArea}
        onChange={(e, value) => onChange("serviceArea", value)}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              variant="outlined"
              color="primary"
              label={option}
              {...getTagProps({ index })}
              key={option}
              onDelete={() => handleServiceAreaDelete(option)}
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
            onKeyDown={handleServiceAreaKeyDown}
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
        value={availability}
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
          value={workingHours.open || ""}
          onChange={(e) => handleWorkingHoursChange("open", e.target.value)}
          error={!!errors.workingHours}
          helperText={errors.workingHours}
          fullWidth
        />
        <TextField
          label="Closing Time"
          type="time"
          value={workingHours.close || ""}
          onChange={(e) => handleWorkingHoursChange("close", e.target.value)}
          error={!!errors.workingHours}
          helperText={errors.workingHours}
          fullWidth
        />
      </Stack>
    </Box>
  );
}
