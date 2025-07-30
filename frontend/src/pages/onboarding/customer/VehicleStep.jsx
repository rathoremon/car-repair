import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setStep,
  setVehicles,
  setVehicleStepComplete,
} from "../../../features/onboarding/onboardingSlice";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Paper,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function VehicleStep() {
  const dispatch = useDispatch();
  const vehicles = useSelector((state) => state.onboarding.vehicles);
  const [vehicle, setVehicle] = useState({ make: "", model: "", year: "" });
  const [error, setError] = useState("");

  const handleAdd = () => {
    if (!vehicle.make || !vehicle.model || !vehicle.year) {
      setError("All fields required");
      return;
    }
    dispatch(setVehicles([...vehicles, vehicle]));
    setVehicle({ make: "", model: "", year: "" });
    setError("");
  };

  const handleDelete = (idx) => {
    const updated = vehicles.filter((_, i) => i !== idx);
    dispatch(setVehicles(updated));
  };

  const handleNext = () => {
    if (vehicles.length === 0) {
      setError("Add at least one vehicle.");
      return;
    }
    dispatch(setVehicleStepComplete(true));
    dispatch(setStep(1));
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Add Your Vehicle
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={4}>
          <TextField
            label="Make"
            value={vehicle.make}
            onChange={(e) => setVehicle({ ...vehicle, make: e.target.value })}
            fullWidth
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Model"
            value={vehicle.model}
            onChange={(e) => setVehicle({ ...vehicle, model: e.target.value })}
            fullWidth
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label="Year"
            value={vehicle.year}
            onChange={(e) => setVehicle({ ...vehicle, year: e.target.value })}
            fullWidth
            size="small"
            type="number"
          />
        </Grid>
        <Grid item xs={12} sm={1}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleAdd}
            sx={{ minWidth: 0, px: 2, py: 1 }}
          >
            Add
          </Button>
        </Grid>
      </Grid>
      {error && (
        <Typography color="error" variant="body2" mt={1}>
          {error}
        </Typography>
      )}
      <Box mt={3}>
        <Grid container spacing={2}>
          {vehicles.map((v, i) => (
            <Grid item xs={12} sm={6} key={i}>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography>
                  {v.make} {v.model} ({v.year})
                </Typography>
                <IconButton onClick={() => handleDelete(i)} size="small">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box mt={4} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}
