import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  MenuItem,
  Grid,
  List,
  ListItem,
} from "@mui/material";

const roles = ["admin", "ops", "finance", "support"];
const permissions = [
  "View Users",
  "Manage Providers",
  "Edit Services",
  "View Reports",
  "Manage Tickets",
];

export default function RBACManager() {
  const [selectedRole, setSelectedRole] = useState("");
  const [assignedPermissions, setAssignedPermissions] = useState([]);

  const handlePermissionToggle = (perm) => {
    setAssignedPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">Role-Based Access Control</Typography>
        <TextField
          select
          label="Select Role"
          fullWidth
          margin="normal"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          {roles.map((role) => (
            <MenuItem key={role} value={role}>
              {role}
            </MenuItem>
          ))}
        </TextField>

        <Typography variant="h6">Permissions</Typography>
        <List>
          {permissions.map((perm) => (
            <ListItem
              key={perm}
              button
              selected={assignedPermissions.includes(perm)}
              onClick={() => handlePermissionToggle(perm)}
            >
              {perm}
            </ListItem>
          ))}
        </List>
        <Button variant="contained" color="primary">
          Save Permissions
        </Button>
      </CardContent>
    </Card>
  );
}
