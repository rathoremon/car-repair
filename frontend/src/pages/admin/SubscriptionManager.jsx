// src/pages/admin/SubscriptionManager.jsx - placeholder for implementation
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

const plans = [
  { name: "Silver", price: 199, features: "Basic support, Limited SLA" },
  { name: "Gold", price: 499, features: "Priority support, Extended SLA" },
];

export default function SubscriptionManager() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Subscription Plans
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Plan</TableCell>
              <TableCell>Price (₹)</TableCell>
              <TableCell>Features</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plans.map((plan, idx) => (
              <TableRow key={idx}>
                <TableCell>{plan.name}</TableCell>
                <TableCell>{plan.price}</TableCell>
                <TableCell>{plan.features}</TableCell>
                <TableCell>
                  <Button variant="outlined">Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button variant="contained" sx={{ mt: 2 }}>
          Add New Plan
        </Button>
      </CardContent>
    </Card>
  );
}
