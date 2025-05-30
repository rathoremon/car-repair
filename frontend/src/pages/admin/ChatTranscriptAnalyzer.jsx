// src/pages/admin/ChatTranscriptAnalyzer.jsx - placeholder for implementation
import React from "react";
import { Typography, Paper, List, ListItem, ListItemText } from "@mui/material";

const transcripts = [
  {
    id: 1,
    summary:
      "User asked about delay. Provider replied ETA 10 mins. User satisfied.",
    flagged: false,
  },
  {
    id: 2,
    summary: "User reported rude behavior. Escalation required.",
    flagged: true,
  },
];

export default function ChatTranscriptAnalyzer() {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Chat Transcript Analyzer (AI)
      </Typography>
      <List>
        {transcripts.map((t) => (
          <ListItem key={t.id}>
            <ListItemText
              primary={`Chat ${t.id} ${t.flagged ? "⚠️ [Flagged]" : ""}`}
              secondary={t.summary}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
