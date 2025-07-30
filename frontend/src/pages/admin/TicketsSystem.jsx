import React from "react";
import {
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Box,
  useTheme,
  Fade,
  TableContainer,
  Avatar,
  Stack,
} from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import LowPriorityIcon from "@mui/icons-material/LowPriority";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import Container from "../../components/Container";

const tickets = [
  {
    id: 1,
    user: "Ankit",
    issue: "Payment not confirmed",
    priority: "High",
    status: "Open",
  },
  {
    id: 2,
    user: "Riya",
    issue: "Mechanic didn’t show up",
    priority: "Medium",
    status: "Resolved",
  },
];

const statusColor = (status, theme) =>
  status === "Open"
    ? {
        bg: theme.palette.warning.light,
        color: theme.palette.warning.contrastText,
        icon: (
          <HourglassEmptyIcon sx={{ color: "#fff", mr: 0.5, fontSize: 18 }} />
        ),
      }
    : {
        bg: theme.palette.success.light,
        color: theme.palette.success.contrastText,
        icon: <CheckCircleIcon sx={{ color: "#fff", mr: 0.5, fontSize: 18 }} />,
      };

const priorityIcon = (priority, theme) =>
  priority === "High" ? (
    <ErrorIcon sx={{ color: "#fff", mr: 0.5, fontSize: 18 }} />
  ) : (
    <LowPriorityIcon sx={{ color: "#fff", mr: 0.5, fontSize: 18 }} />
  );

const priorityColor = (priority, theme) =>
  priority === "High"
    ? {
        bg: theme.palette.error.light,
        color: theme.palette.error.contrastText,
      }
    : {
        bg: theme.palette.warning.light,
        color: theme.palette.warning.contrastText,
      };

export default function TicketsSystem() {
  const theme = useTheme();

  return (
    <Container>
      <Fade in timeout={600}>
        <Box>
          <Typography
            variant="h4"
            color="primary"
            fontWeight={700}
            gutterBottom
            sx={{ letterSpacing: 1 }}
          >
            Support Tickets
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
            View and manage all support tickets.
          </Typography>
          <TableContainer
            sx={{
              maxHeight: 420,
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow
                  sx={{
                    "& th": {
                      fontWeight: 700,
                      color: theme.palette.text.secondary,
                      backgroundColor: theme.palette.custom.sidebarBg,
                      borderBottom: `2px solid ${theme.palette.divider}`,
                    },
                  }}
                >
                  <TableCell>User</TableCell>
                  <TableCell>Issue</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow
                    key={ticket.id}
                    hover
                    sx={{
                      transition: "background 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                        boxShadow: theme.shadows[2],
                      },
                    }}
                  >
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar
                          sx={{
                            bgcolor: theme.palette.primary.light,
                            color: "#fff",
                            fontWeight: 700,
                            width: 44,
                            height: 44,
                            fontSize: "1.2rem",
                          }}
                        >
                          {ticket.user[0]}
                        </Avatar>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {ticket.user}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {ticket.issue}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        sx={{
                          fontWeight: 600,
                          px: 1.5,
                          bgcolor: priorityColor(ticket.priority, theme).bg,
                          color: priorityColor(ticket.priority, theme).color,
                          letterSpacing: 0.5,
                          borderRadius: 2,
                          boxShadow: theme.shadows[1],
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                        label={
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            {priorityIcon(ticket.priority, theme)}
                            <span>{ticket.priority}</span>
                          </Box>
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        sx={{
                          fontWeight: 600,
                          px: 1.5,
                          bgcolor: statusColor(ticket.status, theme).bg,
                          color: statusColor(ticket.status, theme).color,
                          letterSpacing: 0.5,
                          borderRadius: 2,
                          boxShadow: theme.shadows[1],
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                        label={
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            {statusColor(ticket.status, theme).icon}
                            <span>{ticket.status}</span>
                          </Box>
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Fade>
    </Container>
  );
}
