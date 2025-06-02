import React, { useState, useRef, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  Stack,
  Box,
  Fade,
  InputAdornment,
  Tooltip,
  Alert,
  CircularProgress,
  IconButton,
  Collapse,
  useTheme,
  Paper,
  Chip,
} from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import GroupIcon from "@mui/icons-material/Group";
import TitleIcon from "@mui/icons-material/Title";
import MessageIcon from "@mui/icons-material/Message";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import Container from "../../components/Container";

const TITLE_MAX = 64;
const MESSAGE_MAX = 300;
const TARGET_MAX = 32;

export default function NotificationPanel() {
  const theme = useTheme();
  const [form, setForm] = useState({ title: "", message: "", target: "" });
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const timerRef = useRef();

  // Validation logic
  const validate = (values = form) => {
    const errs = {};
    if (!values.title.trim()) errs.title = "Title is required.";
    else if (values.title.length < 3) errs.title = "At least 3 characters.";
    if (!values.message.trim()) errs.message = "Message is required.";
    else if (values.message.length < 5) errs.message = "At least 5 characters.";
    if (!values.target.trim()) errs.target = "Target group is required.";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const next = { ...form, [name]: value };
    setForm(next);
    setFieldErrors(validate(next));
    setError("");
    setSuccess(false);
  };

  const handleReset = () => {
    setForm({ title: "", message: "", target: "" });
    setFieldErrors({});
    setError("");
    setSuccess(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setFieldErrors(errs);
    setError("");
    setSuccess(false);
    if (Object.keys(errs).length) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSuccess(true);
      setForm({ title: "", message: "", target: "" });
      setFieldErrors({});
      timerRef.current = setTimeout(() => setSuccess(false), 3500);
    }, 1200);
  };

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const isDisabled =
    !form.title.trim() ||
    !form.message.trim() ||
    !form.target.trim() ||
    !!Object.keys(fieldErrors).length ||
    submitted;

  // Helper for animated counter color
  const getCounterColor = (val, max, warnAt = 0.85) => {
    if (val >= max) return theme.palette.error.main;
    if (val >= max * warnAt) return theme.palette.warning.main;
    return theme.palette.text.secondary;
  };

  // For focus state tracking
  const [focus, setFocus] = useState({
    title: false,
    message: false,
    target: false,
  });

  // Modern input field styles
  const getInputSx = (hasError, isFocused) => ({
    borderRadius: 2.5,
    bgcolor: theme.palette.background.paper,
    border: hasError
      ? `2px solid ${theme.palette.error.main}`
      : isFocused
      ? `2px solid ${theme.palette.primary.main}`
      : `2px solid ${theme.palette.divider}`,
    "& input, & textarea": {
      fontWeight: 500,
      fontSize: "1.13rem",
      letterSpacing: 0.2,
      color: theme.palette.text.primary,
      background: "transparent",
      transition: "color 0.2s",
    },
    "& .MuiInputAdornment-root": {
      color: theme.palette.primary.main,
    },
    transition: "border 0.2s, box-shadow 0.2s",
  });

  return (
    <Container maxWidth={600}>
      <Fade in timeout={600}>
        <Box>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <Box
              sx={{
                bgcolor: theme.palette.primary.main,
                borderRadius: "50%",
                width: 54,
                height: 54,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: 2,
              }}
            >
              <NotificationsActiveIcon sx={{ fontSize: 30, color: "#fff" }} />
            </Box>
            <Box>
              <Typography
                variant="h5"
                color="primary"
                fontWeight={900}
                sx={{ letterSpacing: 1.5, mb: 0.2 }}
              >
                Notification Panel
              </Typography>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ fontWeight: 600 }}
              >
                Instantly send a notification to a user group.
              </Typography>
            </Box>
            <Box flex={1} />
            <Tooltip title="Reset form" arrow>
              <span>
                <IconButton
                  onClick={handleReset}
                  disabled={
                    (!form.title && !form.message && !form.target) || submitted
                  }
                  color="primary"
                  size="large"
                  sx={{
                    bgcolor: theme.palette.action.hover,
                    borderRadius: 2,
                  }}
                  aria-label="Reset form"
                >
                  <RestartAltIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
          <Collapse in={success || !!error}>
            {success ? (
              <Alert
                severity="success"
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  fontWeight: 700,
                  bgcolor: theme.palette.success.light,
                  color: theme.palette.success.contrastText,
                  boxShadow: 2,
                  letterSpacing: 0.5,
                }}
                icon={
                  <NotificationsActiveIcon color="success" fontSize="small" />
                }
              >
                Notification sent!
              </Alert>
            ) : error ? (
              <Alert
                severity="error"
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  fontWeight: 700,
                  bgcolor: theme.palette.error.light,
                  color: theme.palette.error.contrastText,
                  boxShadow: 2,
                  letterSpacing: 0.5,
                }}
                icon={false}
              >
                {error}
              </Alert>
            ) : null}
          </Collapse>
          <Box
            component="form"
            autoComplete="off"
            onSubmit={handleSubmit}
            sx={{ width: "100%", transition: "box-shadow 0.2s" }}
          >
            <Stack spacing={3}>
              <TextField
                label="Title"
                name="title"
                fullWidth
                value={form.title}
                onChange={handleChange}
                onFocus={() => setFocus((f) => ({ ...f, title: true }))}
                onBlur={() => setFocus((f) => ({ ...f, title: false }))}
                required
                inputProps={{
                  maxLength: TITLE_MAX,
                  minLength: 3,
                  "aria-describedby": "title-helper-text",
                  autoComplete: "off",
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TitleIcon color="primary" />
                    </InputAdornment>
                  ),
                  sx: getInputSx(!!fieldErrors.title, focus.title),
                }}
                error={!!fieldErrors.title}
                helperText={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Chip
                      size="small"
                      label={`${form.title.length}/${TITLE_MAX}`}
                      sx={{
                        bgcolor: "transparent",
                        color: getCounterColor(
                          form.title.length,
                          TITLE_MAX,
                          0.92
                        ),
                        fontWeight: 700,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    />
                    {fieldErrors.title && (
                      <Typography
                        variant="caption"
                        color={theme.palette.error.main}
                        sx={{ fontWeight: 600 }}
                      >
                        {fieldErrors.title}
                      </Typography>
                    )}
                  </Stack>
                }
              />
              <TextField
                label="Message"
                name="message"
                fullWidth
                multiline
                rows={4}
                value={form.message}
                onChange={handleChange}
                onFocus={() => setFocus((f) => ({ ...f, message: true }))}
                onBlur={() => setFocus((f) => ({ ...f, message: false }))}
                required
                inputProps={{
                  maxLength: MESSAGE_MAX,
                  minLength: 5,
                  "aria-describedby": "message-helper-text",
                  autoComplete: "off",
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MessageIcon color="primary" />
                    </InputAdornment>
                  ),
                  sx: getInputSx(!!fieldErrors.message, focus.message),
                }}
                error={!!fieldErrors.message}
                helperText={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Chip
                      size="small"
                      label={`${form.message.length}/${MESSAGE_MAX}`}
                      sx={{
                        bgcolor: "transparent",
                        color: getCounterColor(
                          form.message.length,
                          MESSAGE_MAX,
                          0.95
                        ),
                        fontWeight: 700,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    />
                    {fieldErrors.message && (
                      <Typography
                        variant="caption"
                        color={theme.palette.error.main}
                        sx={{ fontWeight: 600 }}
                      >
                        {fieldErrors.message}
                      </Typography>
                    )}
                  </Stack>
                }
              />
              <Tooltip
                title="Specify the user group to target (e.g. 'new_users', 'all_providers')"
                arrow
                placement="top-start"
              >
                <TextField
                  label="Target Group"
                  name="target"
                  fullWidth
                  value={form.target}
                  onChange={handleChange}
                  onFocus={() => setFocus((f) => ({ ...f, target: true }))}
                  onBlur={() => setFocus((f) => ({ ...f, target: false }))}
                  required
                  inputProps={{
                    maxLength: TARGET_MAX,
                    "aria-describedby": "target-helper-text",
                    autoComplete: "off",
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <GroupIcon color="primary" />
                      </InputAdornment>
                    ),
                    sx: getInputSx(!!fieldErrors.target, focus.target),
                  }}
                  placeholder="e.g. new_users"
                  error={!!fieldErrors.target}
                  helperText={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Chip
                        size="small"
                        label={`${form.target.length}/${TARGET_MAX}`}
                        sx={{
                          bgcolor: "transparent",
                          color: getCounterColor(
                            form.target.length,
                            TARGET_MAX,
                            0.85
                          ),
                          fontWeight: 700,
                          fontVariantNumeric: "tabular-nums",
                        }}
                      />
                      {fieldErrors.target && (
                        <Typography
                          variant="caption"
                          color={theme.palette.error.main}
                          sx={{ fontWeight: 600 }}
                        >
                          {fieldErrors.target}
                        </Typography>
                      )}
                    </Stack>
                  }
                />
              </Tooltip>
              <Button
                variant="contained"
                type="submit"
                disabled={isDisabled}
                sx={{
                  fontWeight: 800,
                  borderRadius: 3,
                  py: 1.3,
                  mt: 1,
                  boxShadow: 2,
                  textTransform: "none",
                  letterSpacing: 0.7,
                  fontSize: "1.13rem",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  transition: "background 0.2s",
                }}
                aria-label="Send notification"
              >
                {submitted && (
                  <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                )}
                {submitted ? "Sending..." : "Send Notification"}
              </Button>
            </Stack>
          </Box>
        </Box>
      </Fade>
    </Container>
  );
}
