import React, { useState } from "react";
import {
  Paper,
  Typography,
  Switch,
  Stack,
  Tooltip,
  CircularProgress,
  useTheme,
  IconButton,
  Box,
  Snackbar,
  Alert,
  Divider,
  Menu,
  MenuItem,
  Fade,
} from "@mui/material";
import {
  AccessTime,
  InfoOutlined,
  SettingsOutlined,
  Schedule,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

// Custom font sample (Roboto Slab for a pro, trustworthy vibe)
const fontFamily = '"Roboto Slab", "Inter", "Roboto", "Arial", sans-serif';

const AvailabilityToggle = () => {
  const theme = useTheme();
  const [available, setAvailable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [lastChange, setLastChange] = useState(new Date());
  const [error, setError] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [scheduled, setScheduled] = useState(null);
  const [snack, setSnack] = useState({ open: false, msg: "", type: "success" });

  // Simulate backend update
  const handleToggle = async () => {
    setLoading(true);
    try {
      // Simulate async API (replace with your backend call)
      await new Promise((r) => setTimeout(r, 850));
      setAvailable((v) => !v);
      setLastChange(new Date());
      setSnack({
        open: true,
        msg: !available
          ? "You're now available for bookings!"
          : "You're now offline.",
        type: "success",
      });
    } catch (e) {
      setError("Failed to update status. Try again.");
      setSnack({
        open: true,
        msg: "Network error. Status not changed.",
        type: "error",
      });
    }
    setLoading(false);
  };

  // Scheduling availability
  const handleSchedule = (mins) => {
    setScheduled(Date.now() + mins * 60 * 1000);
    setAnchorEl(null);
    setSnack({
      open: true,
      msg: `You will go offline in ${mins} min${mins > 1 ? "s" : ""}`,
      type: "info",
    });
    setTimeout(() => {
      setAvailable(false);
      setLastChange(new Date());
      setScheduled(null);
      setSnack({
        open: true,
        msg: "You've been set to offline (scheduled).",
        type: "info",
      });
    }, mins * 60 * 1000);
  };

  return (
    <>
      <Paper
        elevation={4}
        sx={{
          borderRadius: 1.5, // less rounded for professional look
          p: 2.5,
          mb: 2,
          boxShadow: "0 4px 28px rgba(40, 60, 120, 0.25)",
          border: `1px solid ${theme.palette.divider}`,
          fontFamily,
          minWidth: 0,
        }}
        component={motion.div}
        initial={{ opacity: 0, x: 28 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 210, damping: 24 }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box sx={{ pr: 1 }}>
            <AccessTime
              sx={{
                color: available ? "success.main" : "text.disabled",
                fontSize: 32,
                transition: "color 0.22s cubic-bezier(.4,0,.2,1)",
              }}
            />
          </Box>

          <Stack flexGrow={1} minWidth={0}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                sx={{
                  color: available ? "success.main" : "text.secondary",
                  fontFamily,
                  letterSpacing: 0.1,
                  mr: 0.5,
                  transition: "color 0.22s cubic-bezier(.4,0,.2,1)",
                }}
              >
                {available ? "Available" : "Offline"}
              </Typography>
              <Tooltip
                title={
                  available
                    ? "You are shown as available to customers."
                    : "You are hidden from new bookings."
                }
              >
                <InfoOutlined
                  sx={{
                    color: "grey.500",
                    fontSize: 18,
                    verticalAlign: "middle",
                  }}
                />
              </Tooltip>
              <IconButton
                size="small"
                sx={{ ml: 1 }}
                onClick={(e) => setAnchorEl(e.currentTarget)}
                aria-label="Schedule"
              >
                <Schedule fontSize="small" />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={!!anchorEl}
                onClose={() => setAnchorEl(null)}
                TransitionComponent={Fade}
                MenuListProps={{
                  dense: true,
                  sx: { fontFamily },
                }}
              >
                {[15, 30, 60].map((mins) => (
                  <MenuItem key={mins} onClick={() => handleSchedule(mins)}>
                    Go offline in {mins} min
                  </MenuItem>
                ))}
              </Menu>
            </Stack>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontFamily, fontSize: 13, mt: 0.1, lineHeight: 1.3 }}
            >
              {available
                ? scheduled
                  ? `Scheduled to go offline at ${new Date(
                      scheduled
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`
                  : "Customers can book you now."
                : `Last active: ${lastChange.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`}
            </Typography>
          </Stack>

          <Box sx={{ ml: 2, position: "relative" }}>
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loader"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.32 }}
                >
                  <CircularProgress
                    size={28}
                    color={available ? "success" : "inherit"}
                    thickness={4}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="switch"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Switch
                    checked={available}
                    onChange={handleToggle}
                    color="success"
                    disabled={loading}
                    sx={{
                      "& .MuiSwitch-thumb": {
                        boxShadow: available
                          ? "0 2px 10px 0 rgba(30,210,90,.15)"
                          : "0 1px 6px 0 rgba(120,120,120,.09)",
                        width: 22,
                        height: 22,
                      },
                      "& .MuiSwitch-switchBase": {
                        p: 0.6,
                      },
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </Stack>
        <Divider sx={{ my: 1.5 }} />
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="flex-start"
        >
          <Typography
            variant="caption"
            color="text.secondary"
            fontFamily={fontFamily}
          >
            Tip: Schedule auto-offline before breaks, or set a custom status in
            settings.
          </Typography>
          <IconButton size="small" sx={{ ml: "auto" }}>
            <SettingsOutlined fontSize="small" />
          </IconButton>
        </Stack>
      </Paper>
      <Snackbar
        open={snack.open}
        autoHideDuration={3400}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snack.type}
          sx={{ width: "100%", fontFamily }}
          variant="filled"
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AvailabilityToggle;
