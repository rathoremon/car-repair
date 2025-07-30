import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  setCompleted,
  setStep,
} from "../../../features/onboarding/onboardingSlice";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography } from "@mui/material";

export default function LocationStep() {
  const dispatch = useDispatch();
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleComplete = () => {
    if (!location) {
      setError("Location required");
      return;
    }
    dispatch(setCompleted(true));
    // TODO: Call backend to mark onboarding complete
    navigate("/customer/home");
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Set Your Location
      </Typography>
      <TextField
        label="City or Address"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        fullWidth
        size="small"
      />
      {error && (
        <Typography color="error" variant="body2" mt={1}>
          {error}
        </Typography>
      )}
      <Box
        mt={4}
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        gap={2}
      >
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => dispatch(setStep(0))}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleComplete}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          Finish Onboarding
        </Button>
      </Box>
    </Box>
  );
}
