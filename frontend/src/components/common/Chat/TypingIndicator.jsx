// File: src/components/common/Chat/TypingIndicator.jsx
import React from "react";
import { Box, keyframes } from "@mui/material";

const bounce = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
  } 40% {
    transform: scale(1);
  }
`;

export default function TypingIndicator() {
  return (
    <Box display="flex" justifyContent="flex-start" pl={2} mb={1.5}>
      <Box
        display="flex"
        alignItems="center"
        px={2}
        py={1.2}
        bgcolor="#e0e0e0"
        borderRadius={3}
        maxWidth="60%"
        boxShadow={1}
      >
        <Box display="flex" gap={0.5}>
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              width={6}
              height={6}
              borderRadius="50%"
              bgcolor="#757575"
              animation={`${bounce} 1.4s infinite ease-in-out`}
              animationDelay={`${i * 0.2}s`}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
