// src/pages/admin/ReminderViewer.jsx - placeholder for implementation
import React from "react";
import {
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const reminders = [
  { id: 1, user: "Raj", type: "Insurance", due: "2024-06-10" },
  { id: 2, user: "Meena", type: "PUC", due: "2024-06-15" },
];

export default function ReminderViewer() {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        User Reminders
      </Typography>
      <List>
        {reminders.map((reminder) => (
          <ListItem
            key={reminder.id}
            secondaryAction={
              <IconButton edge="end">
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={`${reminder.user} - ${reminder.type}`}
              secondary={`Due: ${reminder.due}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
