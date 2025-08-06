// File: src/components/common/Chat/EmptyChatState.jsx
import React from "react";
import { Box, Typography } from "@mui/material";

export default function EmptyChatState({ defaultTitle }) {
  return (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      px={4}
      py={6}
      color="text.secondary"
    >
      <Typography variant="h6" fontWeight={600}>
        Select a conversation to get started
      </Typography>
      <Typography variant="body2" mt={1.5}>
        Your chats with {defaultTitle.toLowerCase()} will appear here.
      </Typography>
    </Box>
  );
}
