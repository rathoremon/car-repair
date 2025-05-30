import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Box,
  IconButton,
  Typography,
  Avatar,
  useMediaQuery,
  alpha,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import SIDEBAR_CONFIG from "../utils/SidebarConfig";

const MINI_SIDEBAR_WIDTH = 72;
const HEADER_HEIGHT_MOBILE = 56;
const HEADER_HEIGHT_DESKTOP = 64;

const Sidebar = ({
  userType = "customer",
  open = false,
  collapsed = false,
  onClose,
  onToggleCollapse,
  drawerWidth = 240,
  userName = "",
  userAvatar = "",
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const navItems = SIDEBAR_CONFIG[userType] || [];
  const effectiveDrawerWidth = collapsed ? MINI_SIDEBAR_WIDTH : drawerWidth;
  const navigate = useNavigate();
  const location = useLocation();

  // Calculate header height for offset
  const headerHeight = isMobile ? HEADER_HEIGHT_MOBILE : HEADER_HEIGHT_DESKTOP;

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      anchor="left"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        width: effectiveDrawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: effectiveDrawerWidth,
          background:
            theme.palette.custom?.sidebarBg || theme.palette.background.paper,
          borderRight: `1.5px solid ${theme.palette.divider}`,
          boxShadow: theme.shadows[2],
          pt: 0,
          transition: `width ${theme.transitions.duration.short}ms`,
          borderTopRightRadius: theme.shape.borderRadiusMd,
          borderBottomRightRadius: theme.shape.borderRadiusMd,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: `${headerHeight}px`,
          left: 0,
          height: `calc(100vh - ${headerHeight}px)`,
          zIndex: isMobile ? theme.zIndex.drawer + 2 : theme.zIndex.drawer,
          // Custom scrollbar
          "&::-webkit-scrollbar": {
            width: 6,
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: alpha(theme.palette.primary.main, 0.08),
            borderRadius: 6,
          },
        },
        zIndex: isMobile ? theme.zIndex.drawer + 2 : theme.zIndex.drawer,
      }}
    >
      {/* Collapsed: Show expand arrow */}
      {collapsed ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            py: 1,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          {/* Only show expand arrow if not mobile */}
          {!isMobile && (
            <IconButton
              onClick={onToggleCollapse}
              size="small"
              sx={{
                borderRadius: 2,
                bgcolor: "rgba(0,0,0,0.04)",
                "&:hover": { bgcolor: "rgba(0,0,0,0.09)" },
                transition: "all 0.18s",
              }}
              aria-label="Expand sidebar"
            >
              <ChevronRightIcon />
            </IconButton>
          )}
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            px: 2,
            py: 2,
            gap: 1.5,
            borderBottom: `1px solid ${theme.palette.divider}`,
            minHeight: 70,
            bgcolor: "transparent",
          }}
        >
          <Avatar
            src={userAvatar}
            alt={userName}
            sx={{
              width: 40,
              height: 40,
              border: `2px solid ${theme.palette.primary.main}`,
              boxShadow: 2,
              fontWeight: 700,
              fontSize: "1.1rem",
              bgcolor: theme.palette.primary.light,
              color: theme.palette.primary.contrastText,
            }}
          >
            {userName ? userName[0] : ""}
          </Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant="subtitle2"
              fontWeight={700}
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                color: theme.palette.text.primary,
                fontSize: "0.9rem",
                maxWidth: 120,
              }}
            >
              {userName || "Welcome"}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 600,
                fontSize: "0.7rem",
                letterSpacing: 0.5,
                mt: 0.1,
                ml: 0.2,
                display: "block",
              }}
            >
              {userType.charAt(0).toUpperCase() + userType.slice(1)}
            </Typography>
          </Box>
          {/* Only show collapse arrow if not mobile */}
          {!isMobile && (
            <IconButton
              onClick={onToggleCollapse}
              size="small"
              sx={{
                ml: "auto",
                borderRadius: 2,
                bgcolor: "rgba(0,0,0,0.04)",
                "&:hover": { bgcolor: "rgba(0,0,0,0.09)" },
                transition: "all 0.18s",
                display: "flex",
              }}
              aria-label="Collapse sidebar"
            >
              <ChevronLeftIcon />
            </IconButton>
          )}
          {isMobile && (
            <IconButton onClick={onClose} size="small" sx={{ ml: 1 }}>
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      )}
      {/* Navigation */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          "&::-webkit-scrollbar": {
            width: 6,
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: alpha(theme.palette.primary.main, 0.08),
            borderRadius: 6,
          },
        }}
      >
        <List sx={{ pt: 0.5, pb: 0, flex: 1 }}>
          {navItems.map((item) => {
            const selected =
              location.pathname === item.path ||
              (item.path !== "/" && location.pathname.startsWith(item.path));
            return (
              <Tooltip
                key={item.text}
                title={collapsed ? item.text : ""}
                placement="right"
                arrow
                enterDelay={300}
              >
                <ListItemButton
                  selected={selected}
                  onClick={() => {
                    navigate(item.path);
                    if (isMobile && onClose) onClose();
                  }}
                  sx={{
                    mx: collapsed ? 0.5 : 1.2,
                    my: 0.5,
                    minHeight: 44,
                    bgcolor: selected
                      ? alpha(theme.palette.primary.light, 0.1)
                      : "transparent",
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.light, 0.13),
                      boxShadow: "0 2px 8px 0 rgba(0,0,0,0.03)",
                    },
                    transition: "background 0.2s, color 0.2s",
                    boxShadow: selected
                      ? "0 2px 8px 0 rgba(0,0,0,0.09)"
                      : "none",
                    position: "relative",
                    justifyContent: collapsed ? "center" : "flex-start",
                    px: collapsed ? 0.5 : 2,
                    borderRadius: "1px",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: selected
                        ? theme.palette.primary.main
                        : theme.palette.text.secondary,
                      minWidth: 32,
                      justifyContent: "center",
                      fontSize: "1.1rem",
                    }}
                  >
                    {React.createElement(item.icon)}
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText
                      disableTypography
                      primary={item.text}
                      sx={{
                        color: selected
                          ? theme.palette.primary.main
                          : theme.palette.text.primary,
                        fontWeight: selected ? 700 : 500,
                        fontSize: "0.92rem",
                        letterSpacing: 0.1,
                        ml: 0.2,
                        maxWidth: 120,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    />
                  )}
                  {selected && (
                    <Box
                      sx={{
                        position: "absolute",
                        left: 0,
                        top: 8,
                        bottom: 8,
                        width: 4,
                        borderRadius: 2,
                        bgcolor: theme.palette.primary.main,
                        transition: "all 0.2s",
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
