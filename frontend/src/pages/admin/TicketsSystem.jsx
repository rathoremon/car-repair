// src/pages/admin/TicketsSystem.jsx - placeholder for implementation
import React from "react";
import {
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";

const tickets = [
  { id: 1, title: "Delayed service", status: "open" },
  { id: 2, title: "Wrong invoice", status: "resolved" },
];

export default function TicketsSystem() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Support Tickets
        </Typography>
        <List>
          {tickets.map((ticket) => (
            <ListItem key={ticket.id}>
              <ListItemText
                primary={ticket.title}
                secondary={`ID: ${ticket.id}`}
              />
              <Chip
                label={ticket.status}
                color={ticket.status === "resolved" ? "success" : "warning"}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
