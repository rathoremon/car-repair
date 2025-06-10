import React from "react";
import { Box, Button, Typography, Avatar, Stack } from "@mui/material";
import { motion } from "framer-motion";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import ReplayIcon from "@mui/icons-material/Replay";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

const MotionBox = motion(Box);

const ActiveServiceTile = ({ service }) => {
  const hasActiveService = service?.isActive;

  return (
    <MotionBox
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      sx={{
        width: "95%",
        maxWidth: "1200px",
        mx: "auto",
        px: { xs: 3, md: 5 },
        py: { xs: 3, md: 4 },
        borderRadius: "24px",
        background: "linear-gradient(135deg, #4f46e5, #3b82f6)", // Indigo-Blue Gradient like your Hero

        boxShadow: "0 12px 32px rgba(0, 0, 0, 0.2)",
        color: "white",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        gap: { xs: 3, md: 4 },
        overflow: "hidden",
      }}
    >
      {hasActiveService ? (
        <>
          {/* Left: Mechanic Info */}
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            flex={1}
            className="my-2"
          >
            <Avatar
              src={service.mechanicAvatar}
              alt={service.mechanicName}
              sx={{ width: 60, height: 60, border: "2px solid white" }}
            />
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "1rem", md: "1.25rem" },
                }}
              >
                {service.mechanicName}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "white",
                  opacity: 0.85,
                  mt: 0.5,
                }}
              >
                🚗 {service.vehicle}
              </Typography>
            </Box>
          </Stack>

          {/* Center: Service Info */}
          <Box flex={2} textAlign="center">
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                mb: 1,
                fontSize: { xs: "1.25rem", md: "1.75rem" },
              }}
            >
              🔧 {service.type}
            </Typography>

            <Stack
              direction="row"
              spacing={4}
              justifyContent="center"
              alignItems="center"
              sx={{ mt: 1 }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <AccessTimeIcon sx={{ fontSize: 18 }} />
                <Typography variant="body2" fontWeight={500}>
                  ETA: {service.eta} min
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <LocationOnIcon sx={{ fontSize: 18 }} />
                <Typography variant="body2" fontWeight={500}>
                  {service.distance} km
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <FiberManualRecordIcon
                  sx={{
                    fontSize: 12,
                    color: "#22c55e",
                    animation: "pulse 1.5s infinite",
                  }}
                />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {service.status}
                </Typography>
              </Stack>
            </Stack>
          </Box>

          {/* Right: Actions */}
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            flexShrink={0}
            flexWrap="wrap"
            justifyContent="center"
          >
            <Button
              onClick={service.onTrack}
              variant="contained"
              startIcon={<DirectionsCarIcon />}
              sx={{
                borderRadius: "30px",
                background: "white",
                color: "#3b82f6",
                fontWeight: 700,
                px: 3,
                "&:hover": { backgroundColor: "#f3f4f6" },
              }}
            >
              Track
            </Button>
            <Button
              onClick={service.onChat}
              variant="outlined"
              startIcon={<ChatBubbleOutlineIcon />}
              sx={{
                borderRadius: "30px",
                borderColor: "white",
                color: "white",
                fontWeight: 700,
                px: 3,
                "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
              }}
            >
              Chat
            </Button>
            <Button
              onClick={service.onCancel}
              variant="text"
              startIcon={<CancelOutlinedIcon />}
              sx={{
                color: "#f87171",
                fontWeight: 700,
                px: 2,
              }}
            >
              Cancel
            </Button>
          </Stack>
        </>
      ) : (
        <Box width="100%" textAlign="center">
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              mb: 2,
              fontSize: { xs: "1.5rem", md: "2rem" },
            }}
          >
            🚫 No Active Service
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              opacity: 0.9,
            }}
          >
            Last: {service.lastService.type} • ₹{service.lastService.cost} •{" "}
            {service.lastService.date}
          </Typography>
          <Button
            onClick={service.onRebook}
            variant="contained"
            startIcon={<ReplayIcon />}
            sx={{
              borderRadius: "30px",
              background: "white",
              color: "#3b82f6",
              fontWeight: 700,
              px: 5,
              py: 1.5,
              "&:hover": { backgroundColor: "#f3f4f6" },
            }}
          >
            Rebook
          </Button>
        </Box>
      )}

      {/* Pulse Animation Keyframes */}
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.3); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </MotionBox>
  );
};

export default ActiveServiceTile;
