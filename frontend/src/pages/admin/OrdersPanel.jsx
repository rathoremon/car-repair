import React from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Stack,
  Chip,
  Fade,
} from "@mui/material";
import Container from "../../components/Container";

const orders = [
  {
    id: "REQ001",
    customer: "John",
    status: "In Progress",
    assignedTo: "SpeedFix",
  },
  {
    id: "REQ002",
    customer: "Amit",
    status: "Completed",
    assignedTo: "QuickAuto",
  },
];

const statusColor = (status) => {
  if (status === "Completed") return "success";
  if (status === "In Progress") return "warning";
  return "default";
};

export default function OrdersPanel() {
  return (
    <Container>
      <Fade in timeout={600}>
        <Box>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 3 }}
          >
            <Typography
              variant="h5"
              fontWeight={900}
              sx={{
                letterSpacing: 1.2,
                color: "primary.main",
                textShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              All Service Orders
            </Typography>
          </Stack>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, fontSize: 15 }}>
                  Request ID
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 15 }}>
                  Customer
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 15 }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 15 }}>
                  Assigned To
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 15 }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order, i) => (
                <Fade in timeout={600 + i * 100} key={order.id}>
                  <TableRow
                    sx={{
                      "&:hover": {
                        background: "rgba(0,0,0,0.03)",
                        transition: "background 0.2s",
                      },
                    }}
                  >
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        color={statusColor(order.status)}
                        size="small"
                        sx={{ fontWeight: 700, fontSize: 14 }}
                      />
                    </TableCell>
                    <TableCell>{order.assignedTo}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{
                          borderRadius: 2,
                          fontWeight: 700,
                          textTransform: "none",
                          px: 2,
                          boxShadow: "none",
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                </Fade>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Fade>
    </Container>
  );
}
