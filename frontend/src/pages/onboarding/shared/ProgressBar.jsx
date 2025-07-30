import React from "react";
import { Box, LinearProgress } from "@mui/material";

export default function ProgressBar({ step, total }) {
  const percent = ((step + 1) / total) * 100;
  return (
    <Box className="w-full mb-4">
      <LinearProgress
        variant="determinate"
        value={percent}
        sx={{
          height: 10,
          borderRadius: 5,
          backgroundColor: "rgba(99,102,241,0.10)",
          "& .MuiLinearProgress-bar": {
            background: "linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)",
            transition: "width 0.5s cubic-bezier(.4,0,.2,1)",
          },
        }}
        aria-label="Progress"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </Box>
  );
}
