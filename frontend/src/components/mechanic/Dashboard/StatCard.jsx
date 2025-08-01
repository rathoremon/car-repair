// src/components/mechanic/Dashboard/StatCard.jsx
import React from "react";
import {
  Paper,
  Typography,
  Avatar,
  useTheme,
  alpha,
  useMediaQuery,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import * as Icons from "@mui/icons-material";
import { motion } from "framer-motion";

const StatCard = ({ title, value, icon, color = "primary", link }) => {
  const IconComponent = Icons[icon] || Icons.Info;
  const navigate = useNavigate();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const borderRadius = `${theme.shape.borderRadius * 1.5}px`;

  return (
    <Paper
      component={motion.div}
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      onClick={() => link && navigate(link)}
      elevation={4}
      sx={{
        borderRadius,
        bgcolor: alpha(theme.palette[color].main, 0.08),
        cursor: link ? "pointer" : "default",
        width: isMobile ? "140px" : "130%",
        height: isMobile ? "auto" : 85,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: isMobile ? 2.5 : 3,
        transition: "all 0.25s ease-in-out",
        boxShadow: "0 4px 28px rgba(40, 60, 120, 0.25)",
        border: `1px solid ${theme.palette.divider}`,
        "&:hover": {
          bgcolor: alpha(theme.palette[color].main, 0.12),
        },
      }}
    >
      <Stack
        direction={isMobile ? "column" : "row"}
        spacing={isMobile ? 1.5 : 2}
        alignItems="center"
        justifyContent="center"
        textAlign={isMobile ? "center" : "left"}
        width="100%"
      >
        <Avatar
          sx={{
            bgcolor: theme.palette[color].main,
            width: isMobile ? 48 : 56,
            height: isMobile ? 48 : 56,
            fontSize: isMobile ? 22 : 26,
          }}
        >
          <IconComponent fontSize="inherit" />
        </Avatar>

        <Stack
          spacing={0.5}
          alignItems={isMobile ? "center" : "flex-start"}
          justifyContent="center"
          flex={1}
        >
          <Typography
            variant={isMobile ? "h6" : "h5"}
            fontWeight={600}
            color="text.primary"
          >
            {value}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: isMobile ? "0.8rem" : "0.9rem" }}
          >
            {title}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default StatCard;
