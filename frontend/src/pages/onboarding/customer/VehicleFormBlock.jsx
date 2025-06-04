import React from "react";
import {
  TextField,
  MenuItem,
  IconButton,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Tooltip,
  Box,
  Stack,
  Autocomplete,
  useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import { motion } from "framer-motion";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";

const years = Array.from(
  { length: new Date().getFullYear() - 1989 },
  (_, i) => 1990 + i
).reverse();

const fuelTypes = [
  { label: "Petrol", icon: <LocalGasStationIcon /> },
  { label: "Diesel", icon: <LocalGasStationIcon /> },
  { label: "Electric", icon: <ElectricBoltIcon /> },
  { label: "Hybrid", icon: <ElectricBoltIcon /> },
  { label: "CNG", icon: <LocalGasStationIcon /> },
  { label: "LPG", icon: <LocalGasStationIcon /> },
];

export default function VehicleFormBlock({
  vehicle,
  idx,
  onChange,
  onDelete,
  canDelete,
  errors,
}) {
  const theme = useTheme();

  const makes = [
    { label: "Maruti", value: "Maruti" },
    { label: "Honda", value: "Honda" },
    { label: "Hyundai", value: "Hyundai" },
    { label: "Toyota", value: "Toyota" },
    { label: "Tata", value: "Tata" },
    { label: "Mahindra", value: "Mahindra" },
  ];
  const models =
    {
      Maruti: ["Swift", "Baleno", "WagonR"],
      Honda: ["City", "Civic", "Amaze"],
      Hyundai: ["i20", "Creta", "Verna"],
      Toyota: ["Innova", "Fortuner", "Glanza"],
      Tata: ["Nexon", "Harrier", "Tiago"],
      Mahindra: ["XUV700", "Thar", "Scorpio"],
    }[vehicle.make] || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Paper
        elevation={3}
        component={motion.div}
        whileHover={{
          scale: 1.01,
          boxShadow: "0 12px 40px rgba(99, 102, 241, 0.15)",
        }}
        className="p-6 rounded-3xl mb-8 bg-white/80 backdrop-blur-md transition-all"
      >
        {/* Header */}
        <Box className="flex justify-between items-center mb-6">
          <Stack direction="row" alignItems="center" spacing={1}>
            <DirectionsCarIcon color="primary" />
            <Typography
              variant="h6"
              fontWeight={700}
              className="bg-gradient-to-r from-indigo-500 to-blue-400 text-transparent bg-clip-text"
            >
              Vehicle #{idx + 1}
            </Typography>
          </Stack>
          {canDelete && (
            <Tooltip title="Remove this vehicle">
              <IconButton
                onClick={onDelete}
                className="hover:animate-shake hover:text-red-600 transition-all"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* Form Fields */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {/* Make */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <Autocomplete
              options={makes}
              getOptionLabel={(option) => option.label}
              value={makes.find((m) => m.value === vehicle.make) || null}
              onChange={(_, value) => onChange(idx, "make", value?.value || "")}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Vehicle Make"
                  variant="outlined"
                  fullWidth
                  error={!!errors.make}
                  helperText={errors.make}
                />
              )}
            />
          </motion.div>

          {/* Model */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <Autocomplete
              options={models}
              getOptionLabel={(option) => option}
              value={vehicle.model || ""}
              onChange={(_, value) => onChange(idx, "model", value || "")}
              disabled={!vehicle.make}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Model"
                  variant="outlined"
                  fullWidth
                  error={!!errors.model}
                  helperText={errors.model}
                />
              )}
            />
          </motion.div>

          {/* Year */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <TextField
              select
              label="Year"
              value={vehicle.year}
              onChange={(e) => onChange(idx, "year", e.target.value)}
              variant="outlined"
              fullWidth
              error={!!errors.year}
              helperText={errors.year}
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </TextField>
          </motion.div>

          {/* Registration Number */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <TextField
              label="Registration Number"
              value={vehicle.registrationNumber}
              onChange={(e) =>
                onChange(
                  idx,
                  "registrationNumber",
                  e.target.value.toUpperCase()
                )
              }
              variant="outlined"
              fullWidth
              error={!!errors.registrationNumber}
              helperText={errors.registrationNumber}
              placeholder="e.g. MH12AB1234"
              inputProps={{
                maxLength: 10,
                style: { textTransform: "uppercase", letterSpacing: 2 },
              }}
            />
          </motion.div>
        </motion.div>

        {/* Fuel Type */}
        <motion.div
          className="mt-6"
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <Typography
            variant="subtitle2"
            className="mb-2 font-semibold text-indigo-700"
          >
            Fuel Type
          </Typography>
          <Box>
            <ToggleButtonGroup
              value={vehicle.fuelType}
              exclusive
              onChange={(_, value) => value && onChange(idx, "fuelType", value)}
              aria-label="Fuel Type"
              size="medium"
              className="flex flex-wrap justify-center sm:justify-start"
              sx={{
                "& .MuiToggleButton-root": {
                  flex: "1 1 100px",
                  margin: "4px",
                  borderRadius: 9999,
                  textTransform: "capitalize",
                  border: "1px solid #e0e0e0",
                  fontWeight: 600,
                  "&.Mui-selected": {
                    bgcolor: "primary.main",
                    color: "#fff",
                  },
                  "&:hover": {
                    backgroundColor: "primary.light",
                    color: "#fff",
                  },
                },
              }}
            >
              {fuelTypes.map((type) => (
                <ToggleButton key={type.label} value={type.label}>
                  <Box className="flex items-center gap-1">
                    {type.icon}
                    {type.label}
                  </Box>
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            {errors.fuelType && (
              <Typography
                color="error"
                variant="caption"
                className="mt-2 block"
              >
                {errors.fuelType}
              </Typography>
            )}
          </Box>
        </motion.div>
      </Paper>
    </motion.div>
  );
}
