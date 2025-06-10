import React from "react";
import { Box, Typography, useTheme, Badge } from "@mui/material";
import { motion } from "framer-motion";
import DirectionsCarFilledOutlinedIcon from "@mui/icons-material/DirectionsCarFilledOutlined";
import DirectionsRunOutlinedIcon from "@mui/icons-material/DirectionsRunOutlined";
import HistoryEduOutlinedIcon from "@mui/icons-material/HistoryEduOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import { styled } from "@mui/material/styles";

// Actions list with correct icons + labels + badges
const actions = [
  {
    label: "Book Service",
    icon: <DirectionsCarFilledOutlinedIcon fontSize="inherit" />,
    badgeContent: 0,
    color: "linear-gradient(135deg, #6EE7B7, #3B82F6)", // Teal to Blue
  },
  {
    label: "My Vehicles",
    icon: <DirectionsRunOutlinedIcon fontSize="inherit" />,
    badgeContent: 0,
    color: "linear-gradient(135deg, #A78BFA, #6366F1)", // Purple to Indigo
  },
  {
    label: "Service History",
    icon: <HistoryEduOutlinedIcon fontSize="inherit" />,
    badgeContent: 0,
    color: "linear-gradient(135deg, #F472B6, #FB7185)", // Pink to Red
  },
  {
    label: "Live Tracking",
    icon: <MapOutlinedIcon fontSize="inherit" />,
    badgeContent: 1,
    color: "linear-gradient(135deg, #34D399, #10B981)", // Green
  },
  {
    label: "Payments & BNPL",
    icon: <PaymentOutlinedIcon fontSize="inherit" />,
    badgeContent: 2,
    color: "linear-gradient(135deg, #FBBF24, #F59E0B)", // Amber
  },
  {
    label: "Emergency SOS",
    icon: <WarningAmberOutlinedIcon fontSize="inherit" />,
    badgeContent: 3,
    color: "linear-gradient(135deg, #F43F5E, #EF4444)", // Red
    pulse: true,
  },
];

// Styled circular container for the icons
const ActionCircle = styled(Box)(({ color }) => ({
  width: 100,
  height: 100,
  borderRadius: "50%",
  background: color,
  backdropFilter: "blur(14px)",
  boxShadow: "0 12px 32px rgba(0, 0, 0, 0.2)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  position: "relative",
  fontSize: "2.5rem",
  cursor: "pointer",
  transition: "transform 0.4s ease, box-shadow 0.4s ease",
  "&:hover": {
    transform: "scale(1.1)",
    boxShadow: "0 16px 40px rgba(0, 0, 0, 0.25)",
  },
}));

const QuickActionsGrid = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 4,
        justifyContent: "center",
        alignItems: "center",
        py: 6,
        mx: "auto",
      }}
    >
      {actions.map((action, idx) => (
        <motion.div
          key={action.label}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: idx * 0.15,
            type: "spring",
            stiffness: 120,
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          role="button"
          aria-label={action.label}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            width: "138px",
          }}
        >
          <Badge
            badgeContent={action.badgeContent}
            color="error"
            overlap="circular"
            invisible={action.badgeContent === 0}
            sx={{
              "& .MuiBadge-badge": {
                border: `2px solid ${theme.palette.background.paper}`,
                boxShadow: "0 0 8px rgba(0,0,0,0.3)",
                animation: action.pulse ? "pulse 21.5s infinite" : "none",
              },
            }}
          >
            <ActionCircle color={action.color}>{action.icon}</ActionCircle>
          </Badge>

          {/* Proper Label */}
          <Typography
            variant="body2"
            sx={{
              mt: 2,
              fontWeight: 600,
              fontSize: "1rem",
              color: theme.palette.mode === "dark" ? "#E5E7EB" : "#374151",
              transition: "color 0.3s, transform 0.3s",
              "&:hover": {
                transform: "scale(1.05)",
                color: theme.palette.mode === "dark" ? "#FFFFFF" : "#111827",
              },
            }}
          >
            {action.label}
          </Typography>
        </motion.div>
      ))}

      {/* Pulse Animation */}
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </Box>
  );
};

export default QuickActionsGrid;
