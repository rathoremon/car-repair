import React, { useState, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, TextField, Box, Typography, Paper } from "@mui/material";
import { setNewPassword, refreshUser } from "../../features/auth/authThunks";
import getProviderRedirect from "../../utils/getProviderRedirect";

const SetNewPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, activeRole } = useSelector((state) => state.auth);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const role = activeRole || user?.role;

  // 🔐 Detect self-mechanic by checking for dual profile
  const isSelfMechanic =
    role === "mechanic" &&
    user?.hasMechanicProfile &&
    user?.hasProviderProfile &&
    !user?.requiresPasswordReset;

  useLayoutEffect(() => {
    if (!user && !loading) {
      return navigate("/login");
    }

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

  if (loading || !user) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match.");
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
        toast.error("Session error. Please login again.");
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

  return (
    <Box className="flex justify-center items-center min-h-screen p-4 bg-gray-50">
      <Paper elevation={4} className="p-6 w-full max-w-md">
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Set New Password
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          {role === "mechanic"
            ? "You're logging in for the first time as a mechanic. Please create your password."
            : "Please set your new password to continue."}
        </Typography>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <TextField
            type="password"
            label="New Password"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            type="password"
            label="Confirm Password"
            fullWidth
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? "Saving..." : "Set Password"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default SetNewPassword;
