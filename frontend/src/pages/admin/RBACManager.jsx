import React from "react";
import {
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";

const users = [
  { id: 1, name: "Admin A", email: "a@example.com", role: "ops" },
  { id: 2, name: "Admin B", email: "b@example.com", role: "support" },
];

export default function RBACManager() {
  const handleRoleChange = (id, newRole) => {
    console.log(`Update role for ${id} to ${newRole}`);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Role-Based Access Control
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <FormControl fullWidth>
                  <Select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  >
                    <MenuItem value="ops">Ops</MenuItem>
                    <MenuItem value="support">Support</MenuItem>
                    <MenuItem value="finance">Finance</MenuItem>
                    <MenuItem value="superadmin">Super Admin</MenuItem>
                  </Select>
                </FormControl>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
