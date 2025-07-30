// src/pages/provider/ProviderLocked.jsx
import React from "react";
import { Box, Typography, Container } from "@mui/material";
import { Lock } from "@mui/icons-material";

const ProviderLocked = () => {
  return (
    <Container maxWidth="sm">
      <Box
        className="flex flex-col items-center justify-center text-center min-h-[80vh]"
        p={4}
      >
        <Lock fontSize="large" sx={{ color: "#999", mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Your profile is under verification
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Your onboarding has been submitted successfully. Our team will review
          and verify your details shortly. You’ll be notified once the process
          is complete.
        </Typography>
      </Box>
    </Container>
  );
};

export default ProviderLocked;
