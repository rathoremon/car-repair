import React, { useState, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
  CircularProgress,
  Divider,
} from "@mui/material";
import { toast } from "react-toastify";
import { setNewPassword, refreshUser } from "../../features/auth/authThunks";
import getProviderRedirect from "../../utils/getProviderRedirect";

const SetNewPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, activeRole } = useSelector((state) => state.auth);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const role = activeRole || user?.role;

  const isSelfMechanic =
    role === "mechanic" &&
    user?.hasMechanicProfile &&
    user?.hasProviderProfile &&
    !user?.requiresPasswordReset;

  useLayoutEffect(() => {
    if (!user && !loading) return navigate("/login");

    if (
      isSelfMechanic ||
      (role === "mechanic" && !user?.requiresPasswordReset)
    ) {
      return navigate("/mechanic/dashboard");
    }

    if (user && role !== "mechanic" && !user.requiresPasswordReset) {
      toast.error("Invalid access to password reset.");
      return navigate("/");
    }
  }, [user, role, isSelfMechanic, navigate, loading]);

  const isFormValid = password.length >= 6 && password === confirm;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      toast.error("Passwords must match and be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      const result = await dispatch(setNewPassword({ password, role }));
      if (result.meta.requestStatus !== "fulfilled") {
        return toast.error(result.payload?.error || "Password update failed");
      }

      const refreshed = await dispatch(refreshUser()).unwrap();
      if (!refreshed) {
        toast.error("Session expired. Please login again.");
        return navigate("/login");
      }

      if (role === "mechanic") return navigate("/mechanic/dashboard");
      if (role === "provider")
        return navigate(getProviderRedirect(refreshed.user));
      return navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error.");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !user) return null;

  return (
    <Box
      className="min-h-screen flex items-center justify-center"
      sx={{
        backgroundColor:
          theme.palette.mode === "dark" ? "#101418" : theme.palette.grey[100],
        px: 2,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 420,
          p: 4,
          borderRadius: 3,
          backgroundColor:
            theme.palette.mode === "dark"
              ? "#1c1f26"
              : theme.palette.background.paper,
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Set New Password
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          {role === "mechanic"
            ? "You're logging in for the first time as a mechanic. Set a strong password to continue."
            : "Secure your account with a new password."}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 20 }}
        >
          <TextField
            label="New Password"
            type="password"
            fullWidth
            required
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            size="medium"
          />
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            variant="outlined"
            size="medium"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!isFormValid || loading}
            size="large"
            sx={{ mt: 1, fontWeight: 600 }}
            fullWidth
          >
            {loading ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "Set Password"
            )}
          </Button>
        </form>

        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          align="center"
          sx={{ mt: 3 }}
        >
          Password must be at least 6 characters and match exactly.
        </Typography>
      </Box>
    </Box>
  );
};

export default SetNewPassword;
