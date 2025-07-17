import React from "react";
import {
  Paper,
  Typography,
  Stack,
  Button,
  Tooltip,
  Badge,
  Divider,
  useMediaQuery,
  Box,
} from "@mui/material";
import {
  AddCircleOutline,
  AssignmentTurnedIn,
  Description,
  MonetizationOn,
  SupportAgent,
  NotificationsNone,
  ArrowForwardIos,
  AccountCircle,
  Settings,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";

const actions = [
  {
    label: "New Booking",
    icon: <AddCircleOutline />,
    description: "Create a manual job/booking",
    color: "primary",
    onClick: () => {
      // TODO: Replace with your navigation or modal handler
      window.location.href = "/provider/bookings/new";
    },
  },
  {
    label: "Pending Jobs",
    icon: <AssignmentTurnedIn />,
    description: "View & manage today's tasks",
    color: "info",
    badge: 2, // Dynamic count (mock)
    onClick: () => (window.location.href = "/provider/tasks"),
  },
  {
    label: "Upload Docs",
    icon: <Description />,
    description: "Upload KYC or compliance docs",
    color: "warning",
    onClick: () => (window.location.href = "/provider/kyc"),
  },
  {
    label: "Withdraw Funds",
    icon: <MonetizationOn />,
    description: "Instant settlement & payouts",
    color: "success",
    onClick: () => (window.location.href = "/provider/withdraw"),
  },
];

const secondaryActions = [
  {
    label: "Support",
    icon: <SupportAgent />,
    onClick: () => (window.location.href = "/provider/support"),
  },
  {
    label: "Notifications",
    icon: <NotificationsNone />,
    badge: 3, // Dynamic count (mock)
    onClick: () => (window.location.href = "/provider/notifications"),
  },
  {
    label: "Profile",
    icon: <AccountCircle />,
    onClick: () => (window.location.href = "/provider/profile"),
  },
  {
    label: "Settings",
    icon: <Settings />,
    onClick: () => (window.location.href = "/provider/settings"),
  },
];

const QuickActions = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Paper
      elevation={6}
      component={motion.div}
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
      sx={{
        borderRadius: 1.5,

        boxShadow: "0 4px 28px rgba(40, 60, 120, 0.25)",
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
        p: 0,
        minHeight: 415,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          px: 3,
          pt: 3,
          pb: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          variant="h6"
          fontWeight={700}
          letterSpacing={0.5}
          sx={{ fontFamily: "Inter, Roboto, sans-serif" }}
        >
          Quick Actions
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontFamily: "Inter, Roboto, sans-serif" }}
        >
          Save time with these shortcuts.
        </Typography>
      </Box>

      <Stack spacing={isMobile ? 1 : 2} sx={{ p: 3, pt: 2 }}>
        {actions.map((action, idx) => (
          <Tooltip key={action.label} title={action.description} arrow>
            <Button
              startIcon={
                action.badge ? (
                  <Badge
                    badgeContent={action.badge}
                    color="error"
                    max={9}
                    sx={{
                      "& .MuiBadge-badge": {
                        fontWeight: 700,
                        fontSize: "0.8rem",
                        minWidth: 18,
                        height: 18,
                      },
                    }}
                  >
                    {action.icon}
                  </Badge>
                ) : (
                  action.icon
                )
              }
              endIcon={<ArrowForwardIos sx={{ fontSize: 16 }} />}
              variant={idx === 0 ? "contained" : "outlined"}
              color={action.color}
              size={isMobile ? "medium" : "large"}
              sx={{
                justifyContent: "space-between",
                textTransform: "none",
                fontWeight: 600,
                fontFamily: "Inter, Roboto, sans-serif",
                fontSize: { xs: "1rem", sm: "1.08rem" },
                borderRadius: 1.5,
                boxShadow:
                  idx === 0 ? "0 2px 8px -2px rgba(35,90,200,0.09)" : "none",
                "&:hover": {
                  background:
                    idx === 0
                      ? theme.palette.primary.dark
                      : theme.palette.action.hover,
                  color: idx === 0 ? "#fff" : theme.palette.primary.main,
                  boxShadow:
                    idx === 0
                      ? "0 4px 20px -8px rgba(35,90,200,0.13)"
                      : undefined,
                  transform: "translateY(-2px) scale(1.025)",
                  transition: "all 0.18s cubic-bezier(.3,.6,.5,1.1)",
                },
                transition: "all 0.16s cubic-bezier(.3,.7,.4,1.2)",
              }}
              onClick={action.onClick}
              fullWidth
              disableElevation
            >
              <Box sx={{ flexGrow: 1, textAlign: "left" }}>{action.label}</Box>
            </Button>
          </Tooltip>
        ))}
      </Stack>

      <Divider flexItem />
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-evenly"
        spacing={1}
        sx={{
          py: 1.2,
          bgcolor: theme.palette.grey[50],
          borderColor: "divider",
          borderRadius: 1.5,
        }}
      >
        {secondaryActions.map((sa, idx) => (
          <Tooltip title={sa.label} key={sa.label} arrow>
            <IconButtonWithBadge
              icon={sa.icon}
              badge={sa.badge}
              onClick={sa.onClick}
              color={theme.palette.text.primary}
            />
          </Tooltip>
        ))}
      </Stack>
    </Paper>
  );
};

// Sub-component for icon buttons with badge, with smooth hover
const IconButtonWithBadge = ({ icon, badge, onClick, color }) => (
  <motion.button
    type="button"
    whileHover={{
      scale: 1.33,
      // boxShadow: "0 4px 18px 0 rgba(80,130,250,0.10)",
    }}
    style={{
      border: "none",
      background: "none",
      padding: 0,
      outline: "none",
      cursor: "pointer",
    }}
    onClick={onClick}
  >
    <Badge
      badgeContent={badge}
      color="error"
      max={9}
      sx={{
        "& .MuiBadge-badge": {
          fontWeight: 700,
          fontSize: "0.75rem",
          minWidth: 16,
          height: 16,
        },
      }}
    >
      <Box
        sx={{
          color,
          fontSize: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 0.5,
          transition: "color 0.16s",
        }}
      >
        {icon}
      </Box>
    </Badge>
  </motion.button>
);

export default QuickActions;
