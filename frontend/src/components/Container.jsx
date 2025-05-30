import React from "react";
import { Box, Paper, useTheme } from "@mui/material";

export default function Container({
  children,
  maxWidth = 950,
  gradient = true,
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        maxWidth,
        mx: "auto",
        mt: 6,
        mb: 4,
      }}
    >
      <Paper
        elevation={4} // use 1, 2, 3, or 4 (not 6)
        sx={{
          p: { xs: 2, sm: 4 },
          bgcolor: "background.paper",
          borderRadius: 5,
          boxShadow: 4, // match elevation
          overflow: "hidden",
          position: "relative",
          animation: "fadeIn 0.7s",
        }}
      >
        {gradient && (
          <Box
            sx={{
              height: 8,
              width: "100%",
              background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              mb: 3,
              borderRadius: "0 0 12px 12px",
            }}
          />
        )}
        {children}
      </Paper>
    </Box>
  );
}
