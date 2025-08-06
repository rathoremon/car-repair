// File: src/components/common/Chat/ChatUserItem.jsx
import React from "react";
import { Box, Typography, Avatar, Stack } from "@mui/material";

export default function ChatUserItem({ user, isActive, onClick }) {
  return (
    <Box
      onClick={onClick}
      px={2.5}
      py={1.5}
      display="flex"
      alignItems="center"
      gap={2}
      sx={{
        backgroundColor: isActive ? "#e0f7fa" : "transparent",
        cursor: "pointer",
        borderBottom: "1px solid #f0f0f0",
        transition: "background-color 0.2s",
        "&:hover": {
          backgroundColor: "#f4f4f4",
        },
      }}
    >
      <Avatar src={user.avatar} alt={user.name} />
      <Stack flex={1} spacing={0.3} overflow="hidden">
        <Typography fontWeight={600} noWrap>
          {user.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {user.lastMessage || "No messages yet"}
        </Typography>
      </Stack>
      <Typography variant="caption" color="text.secondary">
        {user.lastTime || ""}
      </Typography>
    </Box>
  );
}
