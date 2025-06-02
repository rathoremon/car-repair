// src/pages/admin/CrossSellManager.jsx - placeholder for implementation
import React from "react";
import {
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { Delete } from "@mui/icons-material";

const ads = [
  { id: 1, title: "Get ₹500 off Car Insurance", partner: "PolicyBazaar" },
  { id: 2, title: "Free Engine Oil Change", partner: "Castrol" },
];

export default function CrossSellManager() {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Partner Promotions
      </Typography>
      <List>
        {ads.map((ad) => (
          <ListItem
            key={ad.id}
            secondaryAction={
              <IconButton edge="end">
                <Delete />
              </IconButton>
            }
          >
            <ListItemText primary={ad.title} secondary={`By ${ad.partner}`} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
