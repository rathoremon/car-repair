import React, { useState } from "react";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

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

  return (
    <>
      {React.cloneElement(HeaderComponent, {
        drawerWidth: sidebarWidth,
        sidebarOpen,
        sidebarCollapsed,
        toggleSidebar: () => setSidebarCollapsed(false),
        toggleSidebarCollapse: () => setSidebarCollapsed((c) => !c),
      })}
      <Box sx={{ display: "flex", width: "100%", minHeight: "100vh" }}>
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
            bgcolor: "background.default",
            px: { xs: 1, sm: 3 },
            transition: `margin-left ${theme.transitions.duration.short}ms`,
            ml: isDesktop ? `${effectiveSidebarWidth}px` : 0,
            width: "100%",
            overflowX: "hidden",
            overflowY: "auto",
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
