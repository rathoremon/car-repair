// src/components/mechanic/Dashboard/QuickActions.jsx
import React from "react";
import {
  Paper,
  Typography,
  Avatar,
  useTheme,
  alpha,
  Grid,
  Stack,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Chat, Update, SupportAgent } from "@mui/icons-material";

const ActionCard = ({ icon, label, color = "primary", path }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Paper
      component={motion.div}
      whileHover={{ scale: 1.03 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onClick={() => path && navigate(path)}
      elevation={4}
      sx={{
        cursor: "pointer",
        borderRadius: 1.5,
        p: isMobile ? 2 : 3,
        bgcolor: alpha(theme.palette[color].main, 0.08),
        boxShadow: "0 4px 28px rgba(40,60,120,0.2)",
        "&:hover": {
          bgcolor: alpha(theme.palette[color].main, 0.12),
        },
        height: "100%",
        display: "flex",
        alignItems: isMobile ? "left" : "center",
        width: isMobile ? "90vw" : "280px",
        justifyContent: "center",
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="left"
        width="100%"
      >
        <Avatar
          sx={{
            bgcolor: theme.palette[color].main,
            width: isMobile ? 48 : 56,
            height: isMobile ? 48 : 56,
            fontSize: isMobile ? 24 : 28,
          }}
        >
          {icon}
        </Avatar>
        <Typography
          variant="subtitle1"
          fontWeight={600}
          sx={{ textAlign: "center", color: theme.palette.text.primary }}
        >
          {label}
        </Typography>
      </Stack>
    </Paper>
  );
};

const QuickActions = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const actions = [
    {
      label: "Update Work Status",
      icon: <Update />,
      color: "info",
      path: "/mechanic/update-status",
    },
    {
      label: "Chat with Provider",
      icon: <Chat />,
      color: "primary",
      path: "/mechanic/chat/provider",
    },
    {
      label: "Chat with Customer",
      icon: <Chat />,
      color: "primary",
      path: "/mechanic/chat/customer",
    },
    {
      label: "Help & Support",
      icon: <SupportAgent />,
      color: "secondary",
      path: "/mechanic/support",
    },
  ];

  return (
    <div>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Quick Actions
      </Typography>
      <Grid container spacing={isMobile ? 2 : 3}>
        {actions.map((action, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <ActionCard {...action} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default QuickActions;
