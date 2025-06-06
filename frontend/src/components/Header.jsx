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
  Badge,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  alpha,
  InputBase,
  Fade,
  Paper,
  Grow,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice"; // Adjust the import path as needed
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseIcon from "@mui/icons-material/Close";
import MyLocationRoundedIcon from "@mui/icons-material/MyLocationRounded";
import InstallMobileRoundedIcon from "@mui/icons-material/InstallMobileRounded";

const MINI_SIDEBAR_WIDTH = 72;

const Header = ({
  sidebarOpen,
  sidebarCollapsed,
  toggleSidebar,
  toggleSidebarCollapse,
  closeSidebar,
  notificationCount = 0,
  onSearch,
  userAvatar = "",
  drawerWidth = 240,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Profile menu state
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openProfile = Boolean(anchorEl);
  const handleProfileMenu = (event) => setAnchorEl(event.currentTarget);
  const handleProfileClose = () => setAnchorEl(null);

  // Search state
  const [searchValue, setSearchValue] = React.useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = React.useState(false);
  const searchInputRef = React.useRef();
  const handleSearchChange = (e) => setSearchValue(e.target.value);
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchValue);
    setMobileSearchOpen(false);
    setSearchValue("");
  };

  React.useEffect(() => {
    if (mobileSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [mobileSearchOpen]);

  const handleLogout = () => {
    dispatch(logout()); // Clear Redux state
    navigate("/login"); // Redirect to login page
  };

  // Header margin/width logic for desktop
  const headerLeftMargin =
    isDesktop && sidebarOpen
      ? sidebarCollapsed
        ? `${MINI_SIDEBAR_WIDTH}px`
        : `${drawerWidth}px`
      : 0;
  const headerWidth =
    isDesktop && sidebarOpen
      ? sidebarCollapsed
        ? `calc(100vw - ${MINI_SIDEBAR_WIDTH}px)`
        : `calc(100vw - ${drawerWidth}px)`
      : "%";

  const badgeSx = {
    "& .MuiBadge-badge": {
      animation: notificationCount ? "pulse 1.2s infinite" : "none",
      "@keyframes pulse": {
        "0%": { transform: "scale(1)" },
        "50%": { transform: "scale(1.18)" },
        "100%": { transform: "scale(1)" },
      },
    },
  };

  // Search bar styles
  const searchBg = alpha(theme.palette.background.paper, 0.85);
  const searchBgFocus = alpha(theme.palette.primary.light, 0.18);

  return (
    <Slide in direction="down">
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: "linear-gradient(to right, #4f46e5, #3b82f6, #6366f1)", // Gradient background
          color: "#F9FAFB",
          zIndex: theme.zIndex.drawer + 1,
          px: { xs: 0, sm: 2 },
          height: { xs: 56, sm: 64, md: 64 },
          justifyContent: "center",
          boxShadow: "none",
          transition: `margin-left ${theme.transitions.duration.standard}ms, width ${theme.transitions.duration.standard}ms`,
          ml: headerLeftMargin,
          width: headerWidth,
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: 56, sm: 64, md: 64 },
            px: { xs: 1, sm: 2 },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            width: "100%",
            position: "relative",
          }}
        >
          {/* Left: Sidebar Toggle + Title */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexShrink: 0,
              ...(isMobile &&
                mobileSearchOpen && {
                  opacity: 0,
                  pointerEvents: "none",
                  transition: `opacity ${theme.transitions.duration.standard}ms ${theme.transitions.easing.easeInOut}`,
                }),
              transition: `opacity ${theme.transitions.duration.standard}ms ${theme.transitions.easing.easeInOut}`,
            }}
          >
            {isMobile && (
              <Tooltip title="Open sidebar" arrow>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={toggleSidebar}
                  sx={{
                    bgcolor: alpha(theme.palette.primary.light, 0.18),
                    borderRadius: 2,
                    mr: 1,
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.dark, 0.22),
                      transform: "scale(1.08)",
                    },
                    boxShadow: "0 1px 4px 0 rgba(0,0,0,0.07)",
                    transition: "all 0.18s cubic-bezier(.4,0,.2,1)",
                  }}
                  size="small"
                  aria-label="Open sidebar"
                >
                  <MenuIcon sx={{ fontSize: 22 }} />
                </IconButton>
              </Tooltip>
            )}
            <Typography
              variant={isMobile ? "subtitle1" : "h6"}
              noWrap
              sx={{
                fontWeight: 900,
                letterSpacing: 1.5,
                ml: 0.5,
                fontSize: { xs: "1.08rem", sm: "1.22rem", md: "1.35rem" },
                userSelect: "none",
                color: "inherit",
                textShadow:
                  "0 1px 2px rgba(0,0,0,0.09), 0 0.5px 1px rgba(0,0,0,0.07)",
                textTransform: "uppercase",
                transition: "font-size 0.2s",
                display: "flex",
                alignItems: "center",
                gap: 1,
                ...theme.typography.subtitle1,
              }}
            >
              Trasure
            </Typography>
          </Box>
          {/* Center: Search Bar */}
          {/* Desktop/Tablet: always visible, elegant, animated on focus */}
          {!isMobile && (
            <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <Paper
                component="form"
                onSubmit={handleSearchSubmit}
                elevation={0}
                sx={{
                  width: { xs: 180, sm: 220, md: 320, lg: 400 },
                  maxWidth: "100%",
                  display: "flex",
                  alignItems: "center",
                  background: searchBg,
                  borderRadius: 2,
                  boxShadow: theme.shadows[1],
                  px: 2,
                  py: 0.5,
                  transition: `box-shadow ${theme.transitions.duration.short}ms ${theme.transitions.easing.easeInOut}, width ${theme.transitions.duration.short}ms ${theme.transitions.easing.easeInOut}`,
                  "&:focus-within": {
                    boxShadow: theme.shadows[4],
                    // background: searchBgFocus,
                    width: { xs: 220, sm: 260, md: 400, lg: 520 },
                  },
                }}
              >
                <SearchRoundedIcon
                  sx={{
                    color: theme.palette.text.secondary,
                    mr: 1,
                    fontSize: 22,
                  }}
                />
                <InputBase
                  inputRef={searchInputRef}
                  placeholder="Search…"
                  value={searchValue}
                  onChange={handleSearchChange}
                  sx={{
                    flex: 1,
                    color: "inherit",
                    ...theme.typography.body1,
                    background: "transparent",
                    "&::placeholder": {
                      color: theme.palette.text.secondary,
                      opacity: 1,
                    },
                    borderRadius: 1, // Optional: for rounded input edges
                    px: 1, // Optional: for some horizontal padding
                  }}
                  inputProps={{ "aria-label": "search" }}
                />
                <Fade in={!!searchValue}>
                  <IconButton
                    size="small"
                    sx={{
                      color: theme.palette.grey[600],
                      "&:hover": { color: theme.palette.error.main },
                      ml: 0.5,
                    }}
                    onClick={() => setSearchValue("")}
                    aria-label="Clear search"
                  >
                    <CloseIcon />
                  </IconButton>
                </Fade>
              </Paper>
            </Box>
          )}
          {/* Mobile: search icon triggers animated search bar */}
          {isMobile && (
            <Grow
              in={mobileSearchOpen}
              mountOnEnter
              unmountOnExit
              timeout={theme.transitions.duration.standard}
            >
              <Box
                sx={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1201,
                  px: 1,
                  background: alpha(theme.palette.primary.main, 0.98),
                  transition: `background ${theme.transitions.duration.standard}ms ${theme.transitions.easing.easeInOut}`,
                }}
              >
                <Paper
                  component="form"
                  onSubmit={handleSearchSubmit}
                  elevation={1}
                  sx={{
                    width: "100%",
                    maxWidth: 420,
                    mx: "auto",
                    display: "flex",
                    alignItems: "center",
                    background: searchBg,
                    borderRadius: 2,
                    boxShadow: theme.shadows[4],
                    px: 2,
                    py: 0.5,
                  }}
                >
                  <SearchRoundedIcon
                    sx={{
                      color: theme.palette.text.secondary,
                      mr: 1,
                      fontSize: 22,
                    }}
                  />
                  <InputBase
                    inputRef={searchInputRef}
                    placeholder="Search…"
                    value={searchValue}
                    onChange={handleSearchChange}
                    sx={{
                      flex: 1,
                      color: "inherit",
                      ...theme.typography.body1,
                      background: "transparent",
                      "&::placeholder": {
                        color: theme.palette.text.secondary,
                        opacity: 1,
                      },
                    }}
                    inputProps={{ "aria-label": "search" }}
                    autoFocus
                  />
                  <Fade in={!!searchValue}>
                    <IconButton
                      size="small"
                      sx={{
                        color: theme.palette.grey[600],
                        "&:hover": { color: theme.palette.error.main },
                        ml: 0.5,
                      }}
                      onClick={() => setSearchValue("")}
                      aria-label="Clear search"
                    >
                      <CloseIcon />
                    </IconButton>
                  </Fade>
                  <IconButton
                    size="small"
                    sx={{
                      color: theme.palette.text.secondary,
                      ml: 1,
                    }}
                    onClick={() => {
                      setMobileSearchOpen(false);
                      setSearchValue("");
                    }}
                    aria-label="Close search"
                  >
                    <CloseIcon />
                  </IconButton>
                </Paper>
              </Box>
            </Grow>
          )}
          {/* Right: Actions */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: theme.spacing(1.5),
              minWidth: 0,
              ...(isMobile &&
                mobileSearchOpen && {
                  opacity: 0,
                  pointerEvents: "none",
                  transition: `opacity ${theme.transitions.duration.standard}ms ${theme.transitions.easing.easeInOut}`,
                }),
              transition: `opacity ${theme.transitions.duration.standard}ms ${theme.transitions.easing.easeInOut}`,
            }}
          >
            {/* Mobile: search icon triggers search bar */}
            {isMobile && !mobileSearchOpen && (
              <Tooltip title="Search" arrow>
                <IconButton
                  color="inherit"
                  size="small"
                  sx={{
                    bgcolor: alpha(theme.palette.common.white, 0.08),
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.light, 0.18),
                    },
                    transition: "all 0.18s cubic-bezier(.4,0,.2,1)",
                  }}
                  onClick={() => setMobileSearchOpen(true)}
                >
                  <SearchRoundedIcon />
                </IconButton>
              </Tooltip>
            )}
            {/* Location: always visible */}
            <Tooltip title="Current Location" arrow>
              <IconButton
                color="inherit"
                size="small"
                sx={{
                  bgcolor: alpha(theme.palette.common.white, 0.08),
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.light, 0.18),
                  },
                  transition: "all 0.18s cubic-bezier(.4,0,.2,1)",
                }}
              >
                <MyLocationRoundedIcon />
              </IconButton>
            </Tooltip>
            {/* Install: desktop only */}
            {!isMobile && (
              <Tooltip title="Install App" arrow>
                <IconButton
                  color="inherit"
                  size="small"
                  sx={{
                    bgcolor: alpha(theme.palette.common.white, 0.08),
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.light, 0.18),
                    },
                    transition: "all 0.18s cubic-bezier(.4,0,.2,1)",
                  }}
                >
                  <InstallMobileRoundedIcon />
                </IconButton>
              </Tooltip>
            )}
            {/* Notifications: desktop only */}
            {!isMobile && (
              <Tooltip title="Notifications" arrow>
                <IconButton
                  color="inherit"
                  size="small"
                  sx={{
                    bgcolor: alpha(theme.palette.common.white, 0.08),
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.light, 0.18),
                    },
                    transition: "all 0.18s cubic-bezier(.4,0,.2,1)",
                  }}
                >
                  <Badge
                    badgeContent={notificationCount}
                    color="error"
                    overlap="circular"
                    sx={badgeSx}
                  >
                    <NotificationsActiveRoundedIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
            )}
            {/* Profile */}
            <Tooltip title="Profile" arrow>
              <IconButton
                color="inherit"
                size="small"
                onClick={handleProfileMenu}
                sx={{
                  ml: 0.5,
                  bgcolor: alpha(theme.palette.common.white, 0.08),
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.light, 0.18),
                  },
                  transition: "all 0.18s cubic-bezier(.4,0,.2,1)",
                }}
              >
                <Avatar
                  src={userAvatar}
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: theme.palette.secondary.main,
                    color: theme.palette.secondary.contrastText,
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    boxShadow: "0 1px 4px 0 rgba(0,0,0,0.08)",
                  }}
                >
                  {!userAvatar && <PersonRoundedIcon />}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={openProfile}
              onClose={handleProfileClose}
              onClick={handleProfileClose}
              slotProps={{
                paper: {
                  elevation: 3,
                  sx: {
                    mt: 1.5,
                    minWidth: 200,
                    borderRadius: 2,
                    boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)",
                    bgcolor: theme.palette.background.paper,
                    p: 0.5,
                  },
                },
              }}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem>
                <ListItemIcon>
                  <PersonRoundedIcon fontSize="small" />
                </ListItemIcon>
                My Profile
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <SettingsRoundedIcon fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>
              <Divider sx={{ my: 0.5 }} />
              {/* Notifications and Install in profile menu on mobile */}
              {isMobile && (
                <>
                  <MenuItem>
                    <ListItemIcon>
                      <Badge
                        badgeContent={notificationCount}
                        color="error"
                        overlap="circular"
                        sx={badgeSx}
                      >
                        <NotificationsActiveRoundedIcon fontSize="small" />
                      </Badge>
                    </ListItemIcon>
                    Notifications
                  </MenuItem>
                  <MenuItem>
                    <ListItemIcon>
                      <InstallMobileRoundedIcon fontSize="small" />
                    </ListItemIcon>
                    Install App
                  </MenuItem>
                </>
              )}
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutRoundedIcon fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </Slide>
  );
};

export default Header;
