// 📁 src/components/onboarding/provider/BankDetailsForm.jsx
import React from "react";
import { Grid, TextField } from "@mui/material";

export default function BankDetailsForm({ values, onChange, errors }) {
  const handleInput = (field) => (e) => {
    onChange((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <Grid container spacing={2}>
      {[
        { name: "accountHolderName", label: "Account Holder Name" },
        { name: "accountNumber", label: "Account Number" },
        { name: "ifscCode", label: "IFSC Code" },
        { name: "bankName", label: "Bank Name" },
        { name: "branchName", label: "Branch Name" },
        { name: "upiId", label: "UPI ID (Optional)", required: false },
      ].map(({ name, label, required = true }) => (
        <Grid item xs={12} sm={6} key={name}>
          <TextField
            label={label}
            fullWidth
            required={required}
            value={values[name] || ""}
            onChange={handleInput(name)}
            error={!!errors[name]}
            helperText={errors[name]}
          />
        </Grid>
      ))}
    </Grid>
  );
}
