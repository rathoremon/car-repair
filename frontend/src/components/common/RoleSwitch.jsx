import React from "react";
import { Box, Tooltip } from "@mui/material";
import BuildIcon from "@mui/icons-material/Build";
import HandshakeIcon from "@mui/icons-material/Handshake";

export default function RoleSwitch({ currentRole, onToggleConfirm }) {
  const isMech = currentRole === "mechanic";
  console.log(currentRole + " from roleswitch");

  const handleClick = () => {
    const newRole = isMech ? "provider" : "mechanic";
    onToggleConfirm(newRole); // parent handles confirm+rollback now
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        width: 82,
        height: 38,
        borderRadius: 30,
        bgcolor: isMech ? "#10b981" : "#f87171",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        position: "relative",
        cursor: "pointer",
        transition: "background-color 0.3s ease-in-out",
        px: 1.2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Tooltip title="Provider">
        <Box
          sx={{
            zIndex: 2,
            color: !isMech ? "#1e293b" : "#ffffffb0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <HandshakeIcon sx={{ fontSize: 18 }} />
        </Box>
      </Tooltip>

      <Tooltip title="Mechanic">
        <Box
          sx={{
            zIndex: 2,
            color: isMech ? "#1e293b" : "#ffffffb0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BuildIcon sx={{ fontSize: 18 }} />
        </Box>
      </Tooltip>

      <Box
        sx={{
          position: "absolute",
          top: "3px",
          left: isMech ? "47px" : "3px",
          width: 32,
          height: 32,
          backgroundColor: "#fff",
          borderRadius: "50%",
          transition: "left 0.3s ease",
          boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
        }}
      />
    </Box>
  );
}
