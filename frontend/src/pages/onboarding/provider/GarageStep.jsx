import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setGarage,
  setStep,
  setProviderStepComplete,
} from "../../../features/onboarding/onboardingSlice";
import { Box, Button, TextField, Typography } from "@mui/material";

export default function GarageStep() {
  const dispatch = useDispatch();
  const garage = useSelector((state) => state.onboarding.garage);
  const [form, setForm] = useState(garage);
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!form.name || !form.address) {
      setError("All fields required");
      return;
    }
    dispatch(setGarage(form));
    dispatch(setProviderStepComplete(true));
    dispatch(setStep(1));
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Garage Information
      </Typography>
      <TextField
        label="Garage Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        fullWidth
        size="small"
        sx={{ mb: 2 }}
      />
      <TextField
        label="Garage Address"
        value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
        fullWidth
        size="small"
        sx={{ mb: 2 }}
      />
      {error && (
        <Typography color="error" variant="body2" mt={1}>
          {error}
        </Typography>
      )}
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
