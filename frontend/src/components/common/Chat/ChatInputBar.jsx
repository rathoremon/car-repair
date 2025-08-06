// src/components/common/Chat/ChatInputBar.jsx
import React, { useState } from "react";
import { Box, IconButton, InputBase, Paper, Tooltip } from "@mui/material";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";

export default function ChatInputBar({ onSend, onFileUpload }) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    onSend(message.trim());
    setMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        px: 2,
        py: 1,
        display: "flex",
        alignItems: "center",
        gap: 1,
        borderTop: "1px solid #ccc",
        borderRadius: 0,
        background: "#fff",
      }}
    >
      <Tooltip title="Emoji (coming soon)">
        <IconButton>
          <EmojiEmotionsIcon color="action" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Attach file (coming soon)">
        <IconButton onClick={onFileUpload}>
          <AttachFileIcon color="action" />
        </IconButton>
      </Tooltip>

      <InputBase
        placeholder="Type a message"
        fullWidth
        multiline
        maxRows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        sx={{ fontSize: "1rem", flex: 1 }}
      />

      <Tooltip title="Send">
        <span>
          <IconButton
            color="primary"
            onClick={handleSend}
            disabled={!message.trim()}
          >
            <SendIcon />
          </IconButton>
        </span>
      </Tooltip>
    </Paper>
  );
}
