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
  enableStickyHeader = false,
  mainContainerProps = {},
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  // Calculate Sidebar Width
  const effectiveSidebarWidth =
    isMobile || !sidebarOpen
      ? 0
      : sidebarCollapsed
      ? MINI_SIDEBAR_WIDTH
      : sidebarWidth;

  // Optimized SVG Background as base64
  const backgroundGradient =
    theme.palette.mode === "dark"
      ? `linear-gradient(120deg, ${alpha(
          theme.palette.primary.dark,
          0.2
        )} 0%, ${alpha(theme.palette.secondary.dark, 0.15)} 100%)`
      : `linear-gradient(120deg, ${alpha(
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
        enableStickyHeader,
      })}
      <Box
        sx={{
          display: "flex",
          width: "100%",
          bgcolor: "background.default",
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
          role="main"
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            pt: { xs: 6, sm: enableStickyHeader ? 10 : 7.5 },
            transition: `margin-left ${theme.transitions.duration.short}ms ease-in-out`,
            ml: isDesktop ? `${effectiveSidebarWidth}px` : 0,
            width: "100%",
            zIndex: 1,
            WebkitOverflowScrolling: "touch", // smooth scroll
            willChange: "transform", // hint GPU acceleration
            scrollBehavior: "smooth", // smooth native scrolling
            ...mainContainerProps,
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              boxShadow: theme.shadows[4],
              bgcolor: "background.paper", // ensure footer space if added
              p: { xs: 0, sm: 0 },
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
