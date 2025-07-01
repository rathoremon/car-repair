// src/components/onboarding/provider/BankDetailsForm.jsx
import React from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  Grid,
  useTheme,
  useMediaQuery,
  Fade,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NumbersIcon from "@mui/icons-material/Numbers";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import QrCodeIcon from "@mui/icons-material/QrCode";

const FIELDS = [
  {
    name: "accountHolderName",
    label: "Account Holder Name",
    icon: <AccountCircleIcon />,
    autoComplete: "name",
    required: true,
  },
  {
    name: "accountNumber",
    label: "Account Number",
    icon: <CreditCardIcon />,
    autoComplete: "cc-number",
    required: true,
    inputMode: "numeric",
    pattern: "\\d{9,18}",
  },
  {
    name: "ifscCode",
    label: "IFSC Code",
    icon: <NumbersIcon />,
    autoComplete: "off",
    required: true,
    inputProps: { style: { textTransform: "uppercase", letterSpacing: 2 } },
  },
  {
    name: "bankName",
    label: "Bank Name",
    icon: <AccountBalanceIcon />,
    autoComplete: "organization",
    required: true,
  },
  {
    name: "branchName",
    label: "Branch Name",
    icon: <LocationOnIcon />,
    autoComplete: "address-level2",
    required: true,
  },
  {
    name: "upiId",
    label: "UPI ID (Optional)",
    icon: <QrCodeIcon />,
    autoComplete: "off",
    required: false,
    inputProps: { style: { textTransform: "lowercase" } },
  },
];

export default function BankDetailsForm({ values, onChange, errors = {} }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // More density for mobile, chunkier and richer for desktop
  return (
    <Fade in>
      <Box
        sx={{
          width: "100vw",
          maxWidth: "100%",
          mx: "auto",
          px: 0,
          py: 0,
        }}
      >
        <Paper
          elevation={isMobile ? 0 : 3}
          sx={{
            px: { xs: 1, sm: 4 },
            py: { xs: 0, sm: 3 },
            mt: isMobile ? 0 : 4,
            width: "100%",
          }}
        >
          <Typography
            variant={isMobile ? "h4" : "h3"}
            fontWeight={700}
            sx={{
              ml: isMobile ? 0 : 2,
              mb: { xs: 3, sm: 4.5 },
              color: "#232851",
              textAlign: isMobile ? "center" : "left",
              letterSpacing: 0.03,
            }}
          >
            Bank Details
          </Typography>

          <Grid
            container
            spacing={isMobile ? 1 : 2}
            sx={{
              width: "100%",
              mx: 0,
              flexDirection: isMobile ? "column" : "row",
              alignItems: "flex-start",
              justifyContent: "flex-start",
            }}
          >
            {FIELDS.map(
              ({
                name,
                label,
                icon,
                autoComplete,
                required,
                inputMode,
                inputProps,
                pattern,
              }) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  key={name}
                  sx={{
                    width: "100%",
                    px: isMobile ? 0 : 1,
                  }}
                >
                  <TextField
                    label={label}
                    name={name}
                    fullWidth
                    required={required}
                    value={values[name] || ""}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        [name]: e.target.value,
                      }))
                    }
                    error={!!errors[name]}
                    helperText={errors[name] || " "}
                    autoComplete={autoComplete}
                    inputMode={inputMode}
                    pattern={pattern}
                    inputProps={inputProps}
                    size="medium"
                    margin="none"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                          position="start"
                          sx={{ color: "#7b90b5", minWidth: 32 }}
                        >
                          {icon}
                        </InputAdornment>
                      ),
                      sx: {
                        // bgcolor: "#fff",
                        borderRadius: 1,
                        fontSize: { xs: 15, sm: 16 },
                        py: 0.5,
                        px: 1,
                      },
                    }}
                    sx={{
                      mb: isMobile ? 0 : 0.1,
                      "& .MuiInputBase-input": {
                        fontWeight: 500,
                        fontSize: { xs: 14, sm: 16 },
                      },
                      "& .MuiFormHelperText-root": {
                        minHeight: 16,
                        color: "#e53935",
                        fontWeight: 400,
                        mt: 0.2,
                      },
                    }}
                  />
                </Grid>
              )
            )}
          </Grid>
        </Paper>
      </Box>
    </Fade>
  );
}
