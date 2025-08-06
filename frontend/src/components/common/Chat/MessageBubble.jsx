// File: src/components/common/Chat/MessageBubble.jsx
import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";

export default function MessageBubble({ message }) {
  const isSelf = message.sender === "self";

  const renderStatusIcon = () => {
    if (message.status === "sent") {
      return <DoneIcon fontSize="small" sx={{ color: "#9e9e9e", ml: 0.5 }} />;
    } else if (message.status === "delivered") {
      return (
        <DoneAllIcon fontSize="small" sx={{ color: "#9e9e9e", ml: 0.5 }} />
      );
    } else if (message.status === "read") {
      return (
        <DoneAllIcon fontSize="small" sx={{ color: "#34B7F1", ml: 0.5 }} />
      );
    }
    return null;
  };

  return (
    <Box
      display="flex"
      justifyContent={isSelf ? "flex-end" : "flex-start"}
      width="100%"
    >
      <Box
        px={{ xs: 2, sm: 3 }}
        py={{ xs: 1, sm: 1.6 }}
        borderRadius={2}
        bgcolor={isSelf ? "#c1ddffff" : "#ffffff"}
        maxWidth="75%"
        sx={{
          borderTopLeftRadius: isSelf ? 20 : 4,
          borderTopRightRadius: isSelf ? 4 : 20,
          wordBreak: "break-word",
          boxShadow: isSelf ? 1 : 3,
        }}
      >
        <Stack spacing={0.5}>
          <Typography fontSize="0.95rem">{message.content}</Typography>
          <Box display="flex" justifyContent="flex-end" alignItems="center">
            <Typography
              variant="caption"
              color="text.secondary"
              fontSize="0.7rem"
            >
              {message.time}
            </Typography>
            {isSelf && renderStatusIcon()}
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
