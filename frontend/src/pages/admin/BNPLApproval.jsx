// src/pages/admin/BNPLApproval.jsx - placeholder for implementation
import React from "react";
import {
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";

const requests = [
  { id: 1, user: "Arjun", amount: 2000, status: "Pending" },
  { id: 2, user: "Divya", amount: 1000, status: "Approved" },
];

export default function BNPLApproval() {
  const approve = (id) => {
    console.log("BNPL Approved:", id);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        BNPL Requests
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.map((r) => (
            <TableRow key={r.id}>
              <TableCell>{r.user}</TableCell>
              <TableCell>₹{r.amount}</TableCell>
              <TableCell>{r.status}</TableCell>
              <TableCell>
                {r.status === "Pending" && (
                  <Button variant="contained" onClick={() => approve(r.id)}>
                    Approve
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
