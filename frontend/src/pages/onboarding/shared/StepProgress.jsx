import React from "react";
import { Box, Typography, LinearProgress } from "@mui/material";

export default function StepProgress({ step, total }) {
  return (
    <Box sx={{ mb: { xs: 2, sm: 4 } }}>
      <LinearProgress
        variant="determinate"
        value={((step + 1) / total) * 100}
        sx={{
          height: 8,
          borderRadius: 5,
          bgcolor: "grey.200",
          "& .MuiLinearProgress-bar": { bgcolor: "primary.main" },
        }}
      />
      <Typography
        variant="body2"
        color="text.secondary"
        align="right"
        sx={{ mt: 0.5, fontWeight: 500 }}
      >
        Step {step + 1} of {total}
      </Typography>
    </Box>
  );
}
