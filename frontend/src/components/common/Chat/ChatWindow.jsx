// src/components/common/Chat/ChatWindow.jsx
import React, { useEffect, useRef } from "react";
import { Box, Stack, useMediaQuery, useTheme, alpha } from "@mui/material";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import ChatInputBar from "./ChatInputBar";
import TypingIndicator from "./TypingIndicator";
import EmptyChatState from "./EmptyChatState";

export default function ChatWindow({
  title,
  avatar,
  messages = [],
  typing = false,
  onSendMessage = () => {},
  onFileUpload = () => {},
  onBack = null,
}) {
  const scrollRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
      width="100%"
      sx={{
        backgroundColor: "#F9FAFB",
        overflow: "hidden",
        borderLeft: {
          xs: "none",
          md: "1px solid #E0E0E0",
        },
        borderRight: {
          xs: "none",
          md: "1px solid #E0E0E0",
        },
      }}
    >
      {/* Header */}
      <ChatHeader title={title} avatar={avatar} onBack={onBack} />

      {/* Chat body */}
      <Box
        ref={scrollRef}
        flex={1}
        px={{ xs: 1, sm: 2, md: 4 }}
        py={2}
        overflow="auto"
        display="flex"
        flexDirection="column"
        gap={2}
        sx={{
          scrollBehavior: "smooth",
          backgroundColor: "#ebebebff",
          "&::-webkit-scrollbar": {
            width: "7px",
            display: "block",
          },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: alpha(theme.palette.primary.light, 0.25),
            borderRadius: "6px",
          },
        }}
      >
        {messages.length === 0 ? (
          <EmptyChatState />
        ) : (
          messages.map((msg, index) => (
            <MessageBubble key={index} message={msg} />
          ))
        )}
        {typing && <TypingIndicator />}
      </Box>

      {/* Input */}
      <Box
        sx={{
          backgroundColor: "#fff",
          borderTop: "1px solid #E0E0E0",
          boxShadow: 3,
        }}
      >
        <ChatInputBar onSend={onSendMessage} onFileUpload={onFileUpload} />
      </Box>
    </Box>
  );
}
