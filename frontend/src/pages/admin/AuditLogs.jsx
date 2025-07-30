// src/pages/admin/AuditLogs.jsx - placeholder for implementation
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

const dummyLogs = [
  {
    id: 1,
    user: "admin1",
    action: "Updated pricing",
    timestamp: "2025-05-25 10:24",
  },
  {
    id: 2,
    user: "ops_team",
    action: "Resolved dispute",
    timestamp: "2025-05-25 11:05",
  },
];

export default function AuditLogs() {
  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Admin Activity Logs
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>Action</TableCell>
            <TableCell>Timestamp</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dummyLogs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>{log.user}</TableCell>
              <TableCell>{log.action}</TableCell>
              <TableCell>{log.timestamp}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
