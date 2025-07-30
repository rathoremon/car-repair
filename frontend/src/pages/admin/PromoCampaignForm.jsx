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
  useTheme,
  Divider,
  CircularProgress,
  IconButton,
  Collapse,
  Zoom,
} from "@mui/material";
import CampaignIcon from "@mui/icons-material/Campaign";
import GroupIcon from "@mui/icons-material/Group";
import MessageIcon from "@mui/icons-material/Message";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import Container from "../../components/Container";

const TITLE_MAX = 64;
const MESSAGE_MAX = 300;
const TARGET_MAX = 32;

export default function PromoCampaignForm() {
  const theme = useTheme();
  const [form, setForm] = useState({ title: "", message: "", target: "" });
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const timerRef = useRef();

  // Validation logic
  const validate = (values = form) => {
    const errs = {};
    if (!values.title.trim()) errs.title = "Title is required.";
    else if (values.title.length < 3) errs.title = "At least 3 characters.";
    if (!values.message.trim()) errs.message = "Message is required.";
    else if (values.message.length < 10)
      errs.message = "At least 10 characters.";
    if (!values.target.trim()) errs.target = "Target group is required.";
    return errs;
  };

  // Handle input changes with live validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    const next = { ...form, [name]: value };
    setForm(next);
    setFieldErrors(validate(next));
    setError("");
    setSuccess(false);
  };

  // Reset form
  const handleReset = () => {
    setForm({ title: "", message: "", target: "" });
    setFieldErrors({});
    setError("");
    setSuccess(false);
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setFieldErrors(errs);
    setError("");
    setSuccess(false);
    if (Object.keys(errs).length) return;
    setSubmitted(true);
    // Simulate async
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

  // Improved input field styles
  const getInputSx = (hasError, isFocused) => ({
    borderRadius: 2.5,
    bgcolor:
      theme.palette.mode === "dark"
        ? theme.palette.background.default
        : "#fcfcfc",
    boxShadow: hasError
      ? `0 0 0 2px ${theme.palette.error.main}33`
      : isFocused
      ? `0 0 0 2px ${theme.palette.primary.main}33`
      : "none",
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
      boxShadow: `0 0 0 2px ${theme.palette.primary.main}33`,
    },
    "& input, & textarea": {
      fontWeight: 500,
      fontSize: "1.09rem",
      letterSpacing: 0.2,
      color: theme.palette.text.primary,
      transition: "color 0.2s",
      background: "transparent",
    },
    "& .MuiInputAdornment-root": {
      color: theme.palette.primary.main,
    },
    transition: "box-shadow 0.2s, border-color 0.2s",
  });

  // For focus state tracking (for more advanced styling)
  const [focus, setFocus] = useState({
    title: false,
    message: false,
    target: false,
  });

  // Helper for animated counter color
  const getCounterColor = (val, max, warnAt = 0.85) => {
    if (val >= max) return theme.palette.error.main;
    if (val >= max * warnAt) return theme.palette.warning.main;
    return "inherit";
  };

  return (
    <Container maxWidth={600} gradient>
      <Fade in timeout={600}>
        <Box>
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{ mb: 2, mt: 1 }}
          >
            <Zoom in>
              <CampaignIcon color="primary" sx={{ fontSize: 42 }} />
            </Zoom>
            <Box>
              <Typography
                variant="h4"
                color="primary"
                fontWeight={700}
                gutterBottom
                sx={{ letterSpacing: 1 }}
              >
                Create Promo Campaign
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Send a promotional message to a specific user group.
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
          <Divider sx={{ mb: 3 }} />
          <Collapse in={success || !!error}>
            {success ? (
              <Alert
                severity="success"
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  fontWeight: 500,
                  bgcolor: theme.palette.success.light,
                  color: theme.palette.success.contrastText,
                  boxShadow: 1,
                }}
                icon={<CampaignIcon color="success" fontSize="small" />}
              >
                Campaign sent successfully!
              </Alert>
            ) : error ? (
              <Alert
                severity="error"
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  fontWeight: 500,
                  bgcolor: theme.palette.error.light,
                  color: theme.palette.error.contrastText,
                  boxShadow: 1,
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
            sx={{
              width: "100%",
              transition: "box-shadow 0.2s",
            }}
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
                      <CampaignIcon color="primary" />
                    </InputAdornment>
                  ),
                  sx: getInputSx(!!fieldErrors.title, focus.title),
                }}
                error={!!fieldErrors.title}
                helperText={
                  <Box
                    id="title-helper-text"
                    component="span"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <Box
                      component="span"
                      sx={{
                        color: getCounterColor(
                          form.title.length,
                          TITLE_MAX,
                          0.92
                        ),
                        fontWeight: 500,
                        mr: 1,
                        transition: "color 0.2s",
                        minWidth: 48,
                        textAlign: "right",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {form.title.length}/{TITLE_MAX}
                    </Box>
                    {fieldErrors.title && (
                      <Box component="span" color={theme.palette.error.main}>
                        {fieldErrors.title}
                      </Box>
                    )}
                  </Box>
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
                  minLength: 10,
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
                  <Box
                    id="message-helper-text"
                    component="span"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <Box
                      component="span"
                      sx={{
                        color: getCounterColor(
                          form.message.length,
                          MESSAGE_MAX,
                          0.95
                        ),
                        fontWeight: 500,
                        mr: 1,
                        transition: "color 0.2s",
                        minWidth: 52,
                        textAlign: "right",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {form.message.length}/{MESSAGE_MAX}
                    </Box>
                    {fieldErrors.message && (
                      <Box component="span" color={theme.palette.error.main}>
                        {fieldErrors.message}
                      </Box>
                    )}
                  </Box>
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
                    <Box
                      id="target-helper-text"
                      component="span"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Box
                        component="span"
                        sx={{
                          color: getCounterColor(
                            form.target.length,
                            TARGET_MAX,
                            0.85
                          ),
                          fontWeight: 500,
                          mr: 1,
                          transition: "color 0.2s",
                          minWidth: 44,
                          textAlign: "right",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {form.target.length}/{TARGET_MAX}
                      </Box>
                      {fieldErrors.target && (
                        <Box component="span" color={theme.palette.error.main}>
                          {fieldErrors.target}
                        </Box>
                      )}
                    </Box>
                  }
                />
              </Tooltip>
              <Button
                variant="contained"
                type="submit"
                disabled={isDisabled}
                sx={{
                  fontWeight: 600,
                  borderRadius: 2,
                  py: 1.2,
                  mt: 1,
                  boxShadow: 2,
                  textTransform: "none",
                  letterSpacing: 0.5,
                  transition: "background 0.2s",
                  fontSize: "1.07rem",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
                aria-label="Send campaign"
              >
                {submitted && (
                  <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                )}
                {submitted ? "Sending..." : "Send Campaign"}
              </Button>
            </Stack>
          </Box>
        </Box>
      </Fade>
    </Container>
  );
}
