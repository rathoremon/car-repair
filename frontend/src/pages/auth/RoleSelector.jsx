// src/pages/auth/RoleSelector.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, Paper } from "@mui/material";
import { useSelector } from "react-redux";
import { setSelectedRole, setActiveRole } from "../../features/auth/authSlice";
import { useDispatch } from "react-redux";

export default function RoleSelector() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  if (!user) return null;

  // ❗ OTP Not Verified → Redirect to OTP screen
  if (!user.isOtpVerified) {
    navigate("/verify-otp");
    return null;
  }

  const handleSelect = (role) => {
    dispatch(setSelectedRole(role));
    dispatch(setActiveRole(role)); // Set active role in state
    if (role === "provider") {
      const kyc = user?.provider?.kycStatus;
      if (!user?.onboardingComplete || kyc === "rejected") {
        return navigate("/onboarding");
      } else if (kyc === "pending" || !kyc) {
        return navigate("/provider/pending");
      } else {
        return navigate("/provider/dashboard");
      }
    }

    if (role === "mechanic") {
      const isSelfMechanic =
        user?.mechanic?.userId === user?.id &&
        user?.mechanic?.providerId === user?.provider?.id;

      const shouldReset = user.requiresPasswordReset && !isSelfMechanic;

      if (shouldReset) {
        return navigate("/set-password");
      }

      return navigate("/mechanic/dashboard");
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Paper elevation={6} className="p-6 rounded-lg max-w-sm w-full">
        <Typography variant="h5" gutterBottom>
          Continue As
        </Typography>
        <Typography variant="body2" color="text.secondary" className="mb-4">
          We found both Provider and Mechanic profiles linked to your account.
        </Typography>

        {user?.hasProviderProfile && (
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className="mb-3"
            onClick={() => handleSelect("provider")}
          >
            Provider
          </Button>
        )}

        {user?.hasMechanicProfile && (
          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            onClick={() => handleSelect("mechanic")}
          >
            Mechanic
          </Button>
        )}
      </Paper>
    </Box>
  );
}
