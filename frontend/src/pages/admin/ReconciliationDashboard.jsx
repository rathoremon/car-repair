// src/pages/admin/ReconciliationDashboard.jsx - placeholder for implementation
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

const invoices = [
  {
    id: "INV001",
    provider: "FixMyRide",
    amount: 1200,
    markup: 100,
    finalAmount: 1300,
    status: "Pending",
  },
  {
    id: "INV002",
    provider: "AutoServe",
    amount: 900,
    markup: 150,
    finalAmount: 1050,
    status: "Paid",
  },
];

export default function ReconciliationDashboard() {
  const confirmPayment = (id) => {
    console.log("Confirmed payment for:", id);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Reconciliation Dashboard
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Invoice ID</TableCell>
            <TableCell>Provider</TableCell>
            <TableCell>Base Amount</TableCell>
            <TableCell>Markup</TableCell>
            <TableCell>Final Amount</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoices.map((inv) => (
            <TableRow key={inv.id}>
              <TableCell>{inv.id}</TableCell>
              <TableCell>{inv.provider}</TableCell>
              <TableCell>₹{inv.amount}</TableCell>
              <TableCell>₹{inv.markup}</TableCell>
              <TableCell>₹{inv.finalAmount}</TableCell>
              <TableCell>{inv.status}</TableCell>
              <TableCell>
                {inv.status !== "Paid" && (
                  <Button
                    variant="outlined"
                    onClick={() => confirmPayment(inv.id)}
                  >
                    Confirm
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
