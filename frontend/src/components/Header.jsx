import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  useTheme,
  useMediaQuery,
  Tooltip,
  Slide,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

/**
 * Reusable Header component for all user types.
 * @param {function} toggleSidebar - Function to toggle sidebar.
 * @param {string} [title="Trasure"] - Title to display (e.g., "Admin", "Provider", "Customer").
 * @param {React.ReactNode} [actions] - Optional right-side actions (profile, notifications, etc).
 */
const Header = ({ toggleSidebar, title = "Trasure", actions }) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isMd = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Slide in direction="down">
      <AppBar
        position="fixed"
        elevation={2}
        sx={{
          bgcolor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          zIndex: theme.zIndex.drawer + 1,
          px: { xs: 0, sm: 1 },
          height: { xs: 50, sm: 56, md: 60 },
          justifyContent: "center",
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: 50, sm: 56, md: 60 },
            px: { xs: 1, sm: 2 },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="Open sidebar" arrow>
              <IconButton
                edge="start"
                color="inherit"
                onClick={toggleSidebar}
                sx={{
                  mr: { xs: 1, sm: 2 },
                  bgcolor: theme.palette.action.hover,
                  borderRadius: 2,
                  "&:hover": {
                    bgcolor: theme.palette.primary.dark,
                  },
                }}
                size={isXs ? "small" : "medium"}
                aria-label="Open sidebar"
              >
                <MenuIcon sx={{ fontSize: isXs ? 22 : 26 }} />
              </IconButton>
            </Tooltip>
            <Typography
              variant={isXs ? "subtitle1" : isMd ? "h6" : "h6"}
              noWrap
              sx={{
                fontWeight: 800,
                letterSpacing: 1.2,
                ml: 0.5,
                fontSize: { xs: "1.05rem", sm: "1.18rem", md: "1.22rem" },
                userSelect: "none",
                color: "inherit",
                textShadow:
                  "0 1px 2px rgba(0,0,0,0.06), 0 0.5px 1px rgba(0,0,0,0.06)",
              }}
            >
              {title}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>{actions}</Box>
        </Toolbar>
      </AppBar>
    </Slide>
  );
};

export default Header;
