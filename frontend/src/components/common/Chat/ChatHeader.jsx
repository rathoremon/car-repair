// File: src/components/common/Chat/ChatHeader.jsx
import React from "react";
import {
  Box,
  Typography,
  Avatar,
  Stack,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useTheme } from "@mui/material/styles";

export default function ChatHeader({ title, avatar, onBack }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      display="flex"
      alignItems="center"
      px={2}
      py={1.5}
      mt={{ xs: 1, sm: 0 }}
      bgcolor="#F4F6FA"
      color="#1C1F26"
      boxShadow="0 2px 6px rgba(0, 0, 0, 0.06)"
      gap={1}
    >
      {isMobile && onBack && (
        <IconButton onClick={onBack} sx={{ color: "#1C1F26" }}>
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
      )}
      <Avatar src={avatar} alt={title} />
      <Stack spacing={0} overflow="hidden">
        <Typography
          fontWeight={600}
          fontSize={{ xs: ".9rem", sm: "1rem" }}
          noWrap
        >
          {title}
        </Typography>
        <Typography
          fontSize={{ xs: "0.6rem", sm: "0.75rem" }}
          sx={{ opacity: 0.9 }}
        >
          Online
        </Typography>
      </Stack>
    </Box>
  );
}
