// src/pages/provider/ProviderKycPending.jsx
import React from "react";
import { Box, Typography, CircularProgress, Paper } from "@mui/material";
import HourglassEmptyRoundedIcon from "@mui/icons-material/HourglassEmptyRounded";

export default function ProviderKycPending() {
  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f4f8fc 0%, #fff 100%)",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          px: { xs: 3, sm: 6 },
          py: { xs: 4, sm: 6 },
          maxWidth: 430,
          borderRadius: 3,
          textAlign: "center",
        }}
      >
        <HourglassEmptyRoundedIcon
          sx={{ fontSize: 54, color: "#29b6f6", mb: 1 }}
        />
        <Typography variant="h5" fontWeight={700} mb={1}>
          KYC Verification in Progress
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={2}>
          Thank you for submitting your onboarding details. Our team is
          reviewing your documents.
          <br />
          <br />
          <b>Your access will be enabled once KYC is verified.</b>
        </Typography>
        <CircularProgress color="primary" />
      </Paper>
    </Box>
  );
}
