import React, { useState } from "react";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme, alpha } from "@mui/material/styles";

const MINI_SIDEBAR_WIDTH = 72;

const AppLayout = ({
  HeaderComponent,
  SidebarComponent,
  children,
  sidebarOpen,
  sidebarWidth = 240,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  // Sidebar collapse state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Sidebar width logic
  const effectiveSidebarWidth =
    isMobile || !sidebarOpen
      ? 0
      : sidebarCollapsed
      ? MINI_SIDEBAR_WIDTH
      : sidebarWidth;

  // Expert-level background: subtle gradient, blurred SVG, and overlay
  const backgroundGradient = `linear-gradient(120deg, ${alpha(
    theme.palette.primary.light,
    0.12
  )} 0%, ${alpha(theme.palette.secondary.light, 0.1)} 100%)`;

  const svgBg = encodeURIComponent(`
    <svg width="600" height="600" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="500" cy="100" r="120" fill="${alpha(
        theme.palette.primary.main,
        0.08
      )}"/>
      <circle cx="120" cy="520" r="140" fill="${alpha(
        theme.palette.secondary.main,
        0.07
      )}"/>
      <ellipse cx="300" cy="300" rx="180" ry="80" fill="${alpha(
        theme.palette.info.light,
        0.07
      )}"/>
    </svg>
  `);

  return (
    <>
      {React.cloneElement(HeaderComponent, {
        drawerWidth: sidebarWidth,
        sidebarOpen,
        sidebarCollapsed,
      })}
      <Box
        sx={{
          display: "flex",
          width: "100%",
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "fixed",
            zIndex: 0,
            inset: 0,
            width: "100vw",
            height: "100vh",
            background: backgroundGradient,
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
          },
          "&::after": {
            content: '""',
            position: "fixed",
            zIndex: 0,
            inset: 0,
            width: "100vw",
            height: "100vh",
            background: `url("data:image/svg+xml,${svgBg}") center/cover no-repeat`,
            opacity: 0.7,
            pointerEvents: "none",
            filter: "blur(2px)",
            backgroundAttachment: "fixed",
          },
        }}
      >
        {React.cloneElement(SidebarComponent, {
          drawerWidth: sidebarWidth,
          open: sidebarOpen,
          collapsed: sidebarCollapsed,
          onToggleCollapse: () => setSidebarCollapsed((c) => !c),
        })}
        <Box
          component="main"
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            pt: { xs: 7, sm: 8 },
            minHeight: "100vh",
            bgcolor: "transparent",
            px: { xs: 1, sm: 3 },
            transition: `margin-left ${theme.transitions.duration.short}ms`,
            ml: isDesktop ? `${effectiveSidebarWidth}px` : 0,
            width: "100%",
            overflowX: "hidden",
            overflowY: "auto",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              borderRadius: theme.shape.borderRadiusLg,
              boxShadow: theme.shadows[4],
              bgcolor: "background.paper",
              p: { xs: 2, sm: 3 },
              minHeight: "calc(100vh - 64px)",
              mt: 2,
              zIndex: 2,
              position: "relative",
              backdropFilter: "blur(0.5px)",
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default AppLayout;
