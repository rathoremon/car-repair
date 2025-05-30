import React from "react";
import { ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";

const RoleSelector = ({ role, setRole }) => {
  return (
    <>
      <Typography variant="subtitle1" sx={{ mt: 2 }}>
        Select Role
      </Typography>
      <ToggleButtonGroup
        value={role}
        exclusive
        onChange={(e, newRole) => setRole(newRole)}
        sx={{ my: 1 }}
      >
        <ToggleButton value="customer">Customer</ToggleButton>
        <ToggleButton value="provider">Provider</ToggleButton>
      </ToggleButtonGroup>
    </>
  );
};

export default RoleSelector;
