// File: src/components/common/Chat/ChatListPanel.jsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  InputBase,
  Stack,
  Divider,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ChatUserItem from "./ChatUserItem";

export default function ChatListPanel({
  users,
  selectedUser,
  onSelectUser,
  title,
}) {
  const [search, setSearch] = useState("");
  const theme = useTheme();

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box height="100%" display="flex" flexDirection="column">
      {/* Header */}
      <Box px={3} py={3.1} color="#1C1F26">
        <Typography variant="h6" fontWeight={600}>
          {title}
        </Typography>
      </Box>

      {/* Search */}
      <Box px={2} py={1.5}>
        <Box
          display="flex"
          alignItems="center"
          px={2}
          py={0.8}
          borderRadius={2}
          boxShadow={3}
          bgcolor="#fff"
        >
          <SearchIcon fontSize="small" sx={{ mr: 1, color: "#888" }} />
          <InputBase
            fullWidth
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ fontSize: "0.9rem", bgcolor: "#fff" }}
          />
        </Box>
      </Box>

      <Divider />

      {/* User List */}
      <Box flex={1} overflow="auto">
        <Stack spacing={0}>
          {filteredUsers.map((user) => (
            <ChatUserItem
              key={user.id}
              user={user}
              isActive={selectedUser?.id === user.id}
              onClick={() => onSelectUser(user)}
            />
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
