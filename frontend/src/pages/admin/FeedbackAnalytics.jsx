// src/pages/admin/FeedbackAnalytics.jsx - placeholder for implementation
import React from "react";
import {
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Rating,
} from "@mui/material";

const feedback = [
  { id: 1, user: "Nisha", rating: 4, comment: "Great service!" },
  { id: 2, user: "Kunal", rating: 3, comment: "Could improve punctuality" },
];

export default function FeedbackAnalytics() {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Feedback & Ratings
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>Rating</TableCell>
            <TableCell>Comment</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {feedback.map((f) => (
            <TableRow key={f.id}>
              <TableCell>{f.user}</TableCell>
              <TableCell>
                <Rating value={f.rating} readOnly />
              </TableCell>
              <TableCell>{f.comment}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
