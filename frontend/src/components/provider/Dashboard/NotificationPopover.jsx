import React from "react";
import {
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Divider,
  Box,
  Fade,
  useTheme,
  Chip,
  Stack,
  Button,
  useMediaQuery,
  alpha,
} from "@mui/material";
import {
  DoneAll,
  Book,
  Gavel,
  AttachMoney,
  Announcement,
  Star,
  ErrorOutline,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";

// Map type to icon
const notificationIcons = {
  booking: <Book color="primary" />,
  payout: <AttachMoney color="success" />,
  review: <Star color="warning" />,
  kyc: <Gavel color="info" />,
  alert: <ErrorOutline color="error" />,
  announcement: <Announcement color="secondary" />,
};

export default function NotificationPopover({
  anchorEl,
  onClose,
  notifications,
  onMarkAllRead,
  unreadCount,
  justMarked,
}) {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // xs & sm = mobile
  return (
    <Popover
      open={!!anchorEl}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      PaperProps={{
        component: motion.div,
        initial: { opacity: 0, y: -16 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.22 } },
        exit: { opacity: 0, y: -10, transition: { duration: 0.12 } },
        sx: {
          minWidth: { xs: "68vw", sm: 340 },
          maxWidth: { xs: "86vw", sm: 390 },
          width: { xs: "65vw", sm: 340 },
          maxHeight: { xs: 240, sm: 440 },
          borderRadius: { xs: 1, sm: 1 },

          boxShadow: "0 4px 28px rgba(40, 60, 120, 0.25)",
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.paper,
          p: 0,
          mt: { xs: -22, sm: 1.5 },
          overflow: { xs: "auto", sm: "hidden" },
        },
      }}
      disableRestoreFocus
    >
      <Box
        sx={{
          px: 2,
          py: 1.3,
          borderBottom: "1px solid",
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <NotificationsIcon color="primary" />
        <Typography
          variant="subtitle1"
          fontWeight={700}
          fontFamily="'Inter','Roboto','Segoe UI',Arial,sans-serif"
          sx={{ flexGrow: 1, fontSize: { xs: 14, sm: 18 }, letterSpacing: 0.1 }}
        >
          Notifications
        </Typography>
        {unreadCount > 0 && (
          <Fade in>
            <Button
              size="small"
              startIcon={<DoneAll />}
              onClick={onMarkAllRead}
              sx={{
                fontSize: { xs: 10, sm: 13 },
                borderRadius: 1,
                color: "success.main",
                fontWeight: 600,
                textTransform: "none",
                minWidth: 0,
                px: 1,
                "&:hover": { bgcolor: "success.50" },
              }}
            >
              Mark all read
            </Button>
          </Fade>
        )}
      </Box>
      <List
        dense
        sx={{
          maxHeight: 340,
          overflowY: "auto",
          py: 0,
          px: 0,
          bgcolor: "background.paper",
          minWidth: 0,
          "&::-webkit-scrollbar": {
            width: "7px",
            display: isMobile ? "none" : "block",
          },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: alpha(theme.palette.primary.light, 0.25),
            borderRadius: "6px",
          },
        }}
      >
        {notifications.length === 0 && (
          <ListItem>
            <ListItemText
              primary="No notifications"
              primaryTypographyProps={{ fontSize: 16, color: "text.secondary" }}
            />
          </ListItem>
        )}
        {notifications.map((n, i) => (
          <React.Fragment key={n.id}>
            <ListItem
              alignItems="flex-start"
              sx={{
                bgcolor: n.unread ? "primary.50" : "background.paper",
                borderLeft: n.unread
                  ? "3px solid #1976d2"
                  : "3px solid transparent",
                "&:hover": { bgcolor: "grey.100" },
                transition: "background 0.17s",
                px: 1.5,
              }}
              disableGutters
            >
              <ListItemIcon sx={{ minWidth: 32 }}>
                {notificationIcons[n.type] || <Announcement />}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography
                      fontWeight={n.unread ? 700 : 500}
                      fontSize={15}
                      fontFamily="'Inter','Roboto','Segoe UI',Arial,sans-serif"
                      sx={{
                        color:
                          n.type === "alert" ? "error.main" : "text.primary",
                      }}
                    >
                      {n.text}
                    </Typography>
                    {n.type === "alert" && (
                      <Chip
                        label="Urgent"
                        size="small"
                        color="error"
                        sx={{ ml: 0.5 }}
                      />
                    )}
                    {n.type === "review" && (
                      <Chip
                        label="Review"
                        size="small"
                        color="warning"
                        sx={{ ml: 0.5 }}
                      />
                    )}
                  </Stack>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    {n.time}
                  </Typography>
                }
                secondaryTypographyProps={{ sx: { fontSize: 13 } }}
              />
            </ListItem>
            {i !== notifications.length - 1 && (
              <Divider component="li" sx={{ mx: 1 }} />
            )}
          </React.Fragment>
        ))}
      </List>
      {justMarked && (
        <Fade in>
          <Box
            sx={{
              textAlign: "center",
              py: 1,
              color: "success.main",
              fontWeight: 600,
            }}
          >
            All notifications marked as read!
          </Box>
        </Fade>
      )}
      {notifications.length > 0 && (
        <Box
          sx={{
            px: 2,
            py: 1.3,
            borderTop: "1px solid",
            borderColor: "divider",
            textAlign: "center",
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            fontFamily="'Inter','Roboto','Segoe UI',Arial,sans-serif"
          >
            Tip: Respond to urgent alerts to avoid disruptions.
          </Typography>
        </Box>
      )}
    </Popover>
  );
}
