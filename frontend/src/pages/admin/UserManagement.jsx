import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Paper,
  IconButton,
  Chip,
  Box,
  Stack,
  Avatar,
  useTheme,
  Fade,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import Container from "../../components/Container";

const users = [
  {
    id: 1,
    name: "John",
    email: "john@example.com",
    role: "customer",
    status: "active",
  },
  {
    id: 2,
    name: "Ravi",
    email: "ravi@trasure.com",
    role: "provider",
    status: "inactive",
  },
];

const roleColor = (role, theme) => {
  if (role === "admin")
    return { bg: theme.palette.primary.main, color: "#fff" };
  if (role === "provider")
    return { bg: theme.palette.secondary.main, color: "#fff" };
  if (role === "mechanic")
    return { bg: theme.palette.info.main, color: "#fff" };
  return { bg: theme.palette.success.main, color: "#fff" };
};

const statusColor = (status, theme) =>
  status === "active"
    ? {
        bg: theme.palette.success.light,
        color: theme.palette.success.contrastText,
      }
    : {
        bg: theme.palette.error.light,
        color: theme.palette.error.contrastText,
      };

export default function UserManagement() {
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
            Manage Users
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
            View, edit, or remove users from the platform.
          </Typography>
          <Table>
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
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow
                  key={u.id}
                  hover
                  sx={{
                    transition: "background 0.2s",
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar
                        sx={{
                          bgcolor: roleColor(u.role, theme).bg,
                          color: roleColor(u.role, theme).color,
                          fontWeight: 700,
                          width: 40,
                          height: 40,
                          fontSize: "1.1rem",
                        }}
                      >
                        {u.name[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {u.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {u.id}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {u.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={u.role}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        px: 1.5,
                        bgcolor: roleColor(u.role, theme).bg,
                        color: roleColor(u.role, theme).color,
                        textTransform: "capitalize",
                        letterSpacing: 0.5,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={u.status}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        px: 1.5,
                        bgcolor: statusColor(u.status, theme).bg,
                        color: statusColor(u.status, theme).color,
                        textTransform: "capitalize",
                        letterSpacing: 0.5,
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" sx={{ mr: 1 }}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Fade>
    </Container>
  );
}
