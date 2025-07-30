import React, { useState } from "react";
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip,
  Box,
  Chip,
  Button,
  Divider,
  Badge,
  Fade,
  Menu,
  MenuItem,
  useTheme,
  alpha,
  useMediaQuery,
  Collapse,
} from "@mui/material";
import {
  Campaign,
  InfoOutlined,
  NewReleases,
  EmojiEvents,
  DoneAll,
  MarkEmailRead,
  MoreVert,
  PushPin,
  Link as LinkIcon,
  Close,
  Close as CloseIcon,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const CARD_RADIUS = 1.5;

const typeMap = {
  info: { icon: <InfoOutlined color="info" />, color: "info", tag: "Info" },
  update: {
    icon: <Campaign color="primary" />,
    color: "primary",
    tag: "Update",
  },
  reward: {
    icon: <EmojiEvents color="success" />,
    color: "success",
    tag: "Reward",
  },
  alert: {
    icon: <NewReleases color="warning" />,
    color: "warning",
    tag: "Alert",
  },
};

const initialAnnouncements = [
  {
    id: 1,
    title: "KYC Policy Update",
    description:
      "Your KYC policy has been updated. Review the new terms for continued access.",
    type: "update",
    date: "2025-07-01T10:00:00Z",
    read: false,
    pinned: true,
    link: "/provider/settings/kyc",
  },
  {
    id: 2,
    title: "Refer & Earn New Rewards!",
    description:
      "Invite friends and earn instant rewards as a provider. Limited time only.",
    type: "reward",
    date: "2025-06-30T18:00:00Z",
    read: false,
    pinned: false,
    link: "/provider/refer",
  },
  {
    id: 3,
    title: "Service Downtime Scheduled",
    description:
      "Planned maintenance on Jul 8, 2-4am. Your dashboard may be unavailable.",
    type: "alert",
    date: "2025-06-29T20:00:00Z",
    read: true,
    pinned: false,
  },
];

const Announcements = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // xs & sm = mobile
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAnnouncement, setMenuAnnouncement] = useState(null);
  const [expandId, setExpandId] = useState(null);
  const unreadCount = announcements.filter((a) => !a.read).length;

  const itemAnim = {
    initial: { opacity: 0, x: 32 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 32 },
    transition: { type: "spring", stiffness: 60, damping: 18 },
  };

  // Mark as read
  const markAsRead = (id) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: true } : a))
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setAnnouncements((prev) => prev.map((a) => ({ ...a, read: true })));
  };

  // Pin/unpin
  const togglePin = (id) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, pinned: !a.pinned } : a))
    );
  };

  // Dismiss
  const dismissAnnouncement = (id) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  // Menu for per-announcement actions
  const handleMenuOpen = (event, ann) => {
    setMenuAnnouncement(ann);
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuAnnouncement(null);
  };

  // Expand/collapse description for mobile
  const handleExpandClick = (id) => {
    setExpandId(expandId === id ? null : id);
  };

  // Sort: pinned first, then newest
  const sorted = [...announcements].sort(
    (a, b) =>
      b.pinned - a.pinned || dayjs(b.date).valueOf() - dayjs(a.date).valueOf()
  );

  return (
    <Paper
      elevation={4}
      sx={{
        borderRadius: CARD_RADIUS,
        p: 0,
        minHeight: 140,
        width: "100%",
        maxWidth: "770px",
        mb: 2,

        boxShadow: "0 4px 28px rgba(40, 60, 120, 0.25)",
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
        overflow: "hidden",
        transition: "box-shadow 0.18s",
      }}
      component={motion.section}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 60, damping: 15 }}
      aria-label="Provider Announcements"
      tabIndex={0}
    >
      {/* Header */}
      <Box
        px={isMobile ? 2 : 3}
        py={isMobile ? 1.5 : 2}
        sx={{
          borderBottom: "1px solid #f2f4f6",
          display: "flex",
          alignItems: "center",
          gap: 1,
          bgcolor: "background.paper",
        }}
      >
        <Campaign fontSize="medium" color="primary" sx={{ mr: 1 }} />
        <Typography
          variant={isMobile ? "subtitle1" : "h6"}
          sx={{
            fontWeight: 800,
            fontSize: isMobile ? 17 : 20,
            letterSpacing: 0.2,
            flex: 1,
            fontFamily: "Inter, Roboto, Arial, sans-serif",
          }}
        >
          Announcements
        </Typography>
        <Fade in={unreadCount > 0}>
          <Badge
            color="primary"
            badgeContent={unreadCount}
            sx={{
              ".MuiBadge-badge": {
                fontWeight: 700,
                fontSize: isMobile ? 11 : 13,
                right: -4,
                top: 4,
                px: 1.1,
                py: 0.5,
                boxShadow: "0 1px 8px #b2ccfa33",
                animation: isMobile ? "pulse 1.2s infinite" : undefined,
              },
              "@keyframes pulse": {
                "0%": { transform: "scale(1)" },
                "50%": { transform: "scale(1.16)" },
                "100%": { transform: "scale(1)" },
              },
            }}
            showZero={false}
          />
        </Fade>
        {!isMobile && (
          <Tooltip title="Mark all as read">
            <span>
              <IconButton
                size="small"
                color="primary"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                sx={{ ml: 1 }}
                aria-label="Mark all as read"
              >
                <DoneAll />
              </IconButton>
            </span>
          </Tooltip>
        )}
      </Box>

      {/* List */}
      <List
        dense
        sx={{
          maxHeight: isMobile ? 240 : 295,
          overflowY: "auto",
          px: isMobile ? 0 : 1,
          py: 0,
          bgcolor: "transparent",
          "&::-webkit-scrollbar": {
            width: "7px",
            display: isMobile ? "none" : "block",
          },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: alpha(theme.palette.primary.light, 0.25),
            borderRadius: "6px",
          },
        }}
        aria-label="List of announcements"
      >
        <AnimatePresence>
          {sorted.length === 0 && (
            <Fade in>
              <Box py={5} textAlign="center">
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  sx={{ fontWeight: 600 }}
                >
                  No announcements
                </Typography>
              </Box>
            </Fade>
          )}

          {sorted.map((a, idx) => (
            <motion.div
              key={a.id}
              {...itemAnim}
              exit={{ opacity: 0, scale: 0.85, y: 40 }}
              style={{ outline: "none" }}
            >
              <ListItem
                alignItems="flex-start"
                sx={{
                  borderLeft: `4px solid ${
                    a.pinned
                      ? theme.palette.warning.main
                      : typeMap[a.type]?.color
                      ? theme.palette[typeMap[a.type].color].main
                      : theme.palette.primary.main
                  }`,
                  background: a.read
                    ? "#fafbfc"
                    : "linear-gradient(90deg,#f2f8ff 70%,#fff 100%)",
                  mb: 0.5,
                  transition: "background 0.18s",
                  px: isMobile ? 1 : 2,
                  py: isMobile ? 1.1 : 1.7,
                  boxShadow: a.read
                    ? undefined
                    : "0 4px 24px rgba(36,44,101,0.03)",
                  cursor: a.read ? "default" : "pointer",
                  "&:hover": {
                    background: a.read
                      ? "#f5f6fa"
                      : "linear-gradient(90deg,#eaf3ff 85%,#fff 100%)",
                  },
                  position: "relative",
                  borderRadius: isMobile ? 0.5 : 1,
                  minHeight: isMobile ? 48 : 56,
                }}
                aria-current={a.read ? undefined : "true"}
                tabIndex={0}
                onClick={() => !a.read && markAsRead(a.id)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: isMobile ? 32 : 40,
                    mt: 0.5,
                    mr: isMobile ? 0.5 : 1,
                  }}
                >
                  {typeMap[a.type]?.icon || <InfoOutlined color="primary" />}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: isMobile ? "flex-start" : "center",
                        gap: isMobile ? 0.5 : 1,
                        flexDirection: isMobile ? "column" : "row",
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: a.read ? 600 : 900,
                          fontSize: isMobile ? 13.8 : 15,
                          color: a.read ? "#626f83" : "#1b2436",
                          fontFamily: "Inter, Roboto, Arial, sans-serif",
                          letterSpacing: 0.01,
                          mr: isMobile ? 0 : 1,
                        }}
                        noWrap={isMobile}
                      >
                        {a.title}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mt: isMobile ? 0.5 : 0,
                        }}
                      >
                        <Chip
                          label={typeMap[a.type]?.tag}
                          size="small"
                          color={typeMap[a.type]?.color || "default"}
                          sx={{
                            fontWeight: 600,
                            fontSize: isMobile ? 10 : 11,
                            height: isMobile ? 18 : 22,
                            textTransform: "capitalize",
                            ml: 0.5,
                            bgcolor:
                              a.type === "reward"
                                ? theme.palette.success.light
                                : undefined,
                            color: a.type === "reward" ? "#fff" : undefined,
                          }}
                        />
                        {a.pinned && !isMobile && (
                          <Tooltip title="Pinned">
                            <PushPin
                              color="warning"
                              fontSize="small"
                              sx={{ ml: 0.5 }}
                            />
                          </Tooltip>
                        )}
                        {!a.read && !isMobile && (
                          <Chip
                            label="New"
                            color="primary"
                            size="small"
                            sx={{
                              fontWeight: 900,
                              fontSize: 10,
                              ml: 1,
                              bgcolor: "#c7e0fc",
                              color: "#2460c7",
                              letterSpacing: 0.6,
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  }
                  secondary={
                    <Box>
                      {/* Mobile: collapse description, expand/collapse */}
                      {isMobile ? (
                        <>
                          <Collapse in={expandId === a.id}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                fontSize: 12.5,
                                mt: 0.2,
                                mb: 0.6,
                                lineHeight: 1.43,
                              }}
                            >
                              {a.description}
                              {a.link && (
                                <Tooltip title="Go to details">
                                  <Button
                                    href={a.link}
                                    endIcon={<LinkIcon fontSize="small" />}
                                    sx={{
                                      ml: 1,
                                      fontSize: 11.5,
                                      fontWeight: 500,
                                      px: 0.4,
                                      py: 0.1,
                                      textTransform: "none",
                                    }}
                                    size="small"
                                    color="primary"
                                    tabIndex={0}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    View
                                  </Button>
                                </Tooltip>
                              )}
                            </Typography>
                          </Collapse>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                fontSize: 10.5,
                                fontWeight: 600,
                              }}
                            >
                              {dayjs(a.date).fromNow()}
                            </Typography>
                            <Button
                              onClick={() => handleExpandClick(a.id)}
                              size="small"
                              endIcon={
                                expandId === a.id ? (
                                  <ExpandLess fontSize="small" />
                                ) : (
                                  <ExpandMore fontSize="small" />
                                )
                              }
                              sx={{
                                minWidth: 0,
                                fontSize: 10.7,
                                p: 0,
                                color: "#2563eb",
                                textTransform: "none",
                                ml: 0.5,
                              }}
                            >
                              {expandId === a.id ? "Hide" : "Details"}
                            </Button>
                          </Box>
                        </>
                      ) : (
                        <Box sx={{ mt: 0.2 }}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              mb: 0.2,
                              fontSize: 13,
                              lineHeight: 1.45,
                            }}
                          >
                            {a.description}
                            {a.link && (
                              <Tooltip title="Go to details">
                                <Button
                                  href={a.link}
                                  endIcon={<LinkIcon fontSize="small" />}
                                  sx={{
                                    ml: 1,
                                    fontSize: 12.3,
                                    fontWeight: 500,
                                    px: 0.5,
                                    py: 0.2,
                                    textTransform: "none",
                                  }}
                                  size="small"
                                  color="primary"
                                  tabIndex={0}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  View
                                </Button>
                              </Tooltip>
                            )}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontSize: 11.5, fontWeight: 600 }}
                          >
                            {dayjs(a.date).fromNow()}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  }
                />
                {/* Actions: Pin/Unpin, Dismiss, Menu */}
                {!isMobile && (
                  <Box>
                    <Tooltip title={a.pinned ? "Unpin" : "Pin"}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePin(a.id);
                        }}
                        aria-label={a.pinned ? "Unpin" : "Pin"}
                      >
                        <PushPin
                          color={a.pinned ? "warning" : "disabled"}
                          fontSize="small"
                        />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="More actions">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMenuOpen(e, a);
                        }}
                        aria-label="More actions"
                      >
                        <MoreVert fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
                {/* Minimal actions on mobile: Dismiss */}
                {isMobile && (
                  <Tooltip title="Dismiss">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        dismissAnnouncement(a.id);
                      }}
                      aria-label="Dismiss"
                    >
                      <Close as={CloseIcon} fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </ListItem>
              {idx !== sorted.length - 1 && (
                <Divider
                  sx={{ mx: isMobile ? 1.5 : 3, borderColor: "#f0f2f5" }}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </List>
      <Box
        px={isMobile ? 2 : 3}
        py={1.3}
        sx={{
          textAlign: "right",
          borderTop: "1px solid #f1f1f3",
          bgcolor: "#f9fafc",
        }}
      >
        <Button
          size="small"
          variant="text"
          sx={{
            fontWeight: 700,
            fontSize: isMobile ? 12 : 13,
            color: "#1e40af",
            mr: 0.5,
          }}
          href="/provider/announcements"
        >
          {isMobile ? "All" : "See all"}
        </Button>
      </Box>

      {/* Menu for each announcement */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        {menuAnnouncement && !menuAnnouncement.read && (
          <MenuItem
            onClick={() => {
              markAsRead(menuAnnouncement.id);
              handleMenuClose();
            }}
          >
            <MarkEmailRead fontSize="small" sx={{ mr: 1 }} /> Mark as read
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            togglePin(menuAnnouncement.id);
            handleMenuClose();
          }}
        >
          <PushPin fontSize="small" sx={{ mr: 1 }} />
          {menuAnnouncement?.pinned ? "Unpin" : "Pin"}
        </MenuItem>
        <MenuItem
          onClick={() => {
            dismissAnnouncement(menuAnnouncement.id);
            handleMenuClose();
          }}
        >
          <CloseIcon fontSize="small" sx={{ mr: 1 }} /> Dismiss
        </MenuItem>
      </Menu>
    </Paper>
  );
};

export default Announcements;
