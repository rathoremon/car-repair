// src/components/common/Chat/ChatLayout.jsx
import React, { useState } from "react";
import {
  Box,
  useTheme,
  useMediaQuery,
  Typography,
  Card,
  Fade,
} from "@mui/material";
import ChatListPanel from "./ChatListPanel";
import ChatWindow from "./ChatWindow";
import EmptyChatState from "./EmptyChatState";

export default function ChatLayout({ userList = [], defaultTitle = "Chats" }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isLarge = useMediaQuery(theme.breakpoints.up("lg"));

  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);

  const handleSelectChat = (user) => {
    setSelectedChat(user);
    setMessages(user.mockMessages || []);
  };

  const handleSendMessage = (text) => {
    const msg = {
      sender: "self",
      content: text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "sent",
    };
    setMessages((prev) => [...prev, msg]);

    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: "other",
          content: "Thanks for your message!",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }, 1200);
  };

  return (
    <Box
      display="flex"
      height="92vh"
      width="100%"
      overflow="hidden"
      bgcolor="#f5f5f5"
    >
      {/* Left Panel: Chat List */}
      {(!isMobile || !selectedChat) && (
        <Box
          sx={{
            width: {
              xs: "100%",
              sm: "320px",
              md: "360px",
              lg: "380px",
              xl: "400px",
            },
            borderRight: { xs: "none", sm: "1px solid #e0e0e0" },
            height: "100%",
            backgroundColor: "#fafafa",
          }}
        >
          <ChatListPanel
            title={defaultTitle}
            users={userList}
            selectedUser={selectedChat}
            onSelectUser={handleSelectChat}
          />
        </Box>
      )}

      {/* Right Panel: Chat Window */}
      {(!isMobile || selectedChat) && (
        <Box flex={1} height="100%">
          <Fade in>
            <Box height="100%" display="flex" flexDirection="column">
              {selectedChat ? (
                <ChatWindow
                  title={selectedChat.name}
                  avatar={selectedChat.avatar}
                  messages={messages}
                  typing={typing}
                  onSendMessage={handleSendMessage}
                  onBack={isMobile ? () => setSelectedChat(null) : null}
                />
              ) : (
                <Box
                  flex={1}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  px={4}
                  textAlign="center"
                >
                  <Card
                    elevation={1}
                    sx={{
                      px: 2,
                      py: 3,
                      borderRadius: 1,
                      backgroundColor: "#ffffff",
                    }}
                  >
                    <EmptyChatState defaultTitle={defaultTitle} />
                  </Card>
                </Box>
              )}
            </Box>
          </Fade>
        </Box>
      )}
    </Box>
  );
}
