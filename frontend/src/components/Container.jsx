import React from "react";
import { Box, useTheme } from "@mui/material";

/**
 * Admin container block with smart padding, responsive width, and clear visual hierarchy.
 * Cleanly wraps all Admin pages and sections.
 */
const Container = ({
  children,
  maxWidth = "1440px",
  spacing = true,
  sectioned = false,
  withBorder = false,
  overflowHidden = false,
}) => {
  const theme = useTheme();

  return (
    <Box
      component="main"
      role="main"
      sx={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#f8f9fb", // neutral soft background
        paddingTop: { xs: 2, md: 4 },
        paddingBottom: { xs: 4, md: 6 },
        px: spacing ? { xs: 2, sm: 3, md: 6 } : 0,
        overflowX: "hidden",
      }}
    >
      <Box
        sx={{
          maxWidth,
          mx: "auto",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: sectioned ? 6 : 0,
          border: withBorder ? `1px solid ${theme.palette.divider}` : "none",
          borderRadius: withBorder ? 3 : 0,
          backgroundColor: withBorder ? "#fff" : "transparent",
          overflow: overflowHidden ? "hidden" : "initial",
          boxShadow: withBorder ? "0px 1px 2px rgba(16, 24, 40, 0.05)" : "none",
          transition: "all 0.3s ease-in-out",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Container;
