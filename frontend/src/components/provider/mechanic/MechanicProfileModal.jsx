import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Grid,
  Stack,
  Avatar,
  Typography,
  Chip,
  Divider,
  Box,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  MailOutline,
  Phone,
  Place,
  Person,
  WorkOutline,
  AccessTime,
  Close as CloseIcon,
  ContentCopy as CopyIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { getPhotoUrl } from "../../../utils/getPhotoUrl";

// Clipboard utility
function copyToClipboard(value, label = "Copied") {
  navigator.clipboard?.writeText(value);
  toast.success(label, { autoClose: 900 });
}

function AvailabilityDisplay({ availability }) {
  const days = [
    { key: "mon", label: "Mon" },
    { key: "tue", label: "Tue" },
    { key: "wed", label: "Wed" },
    { key: "thu", label: "Thu" },
    { key: "fri", label: "Fri" },
    { key: "sat", label: "Sat" },
    { key: "sun", label: "Sun" },
  ];
  return (
    <Grid container spacing={0.5} sx={{ mt: 0.5 }}>
      {days.map((d) => {
        const val = availability?.[d.key];
        let label = "Unavailable";
        let color = "default";
        if (val?.type === "full") {
          label = "Full Day";
          color = "success";
        } else if (val?.type === "custom") {
          label = `${val.from || "--:--"} - ${val.to || "--:--"}`;
          color = "primary";
        }
        return (
          <Grid item xs={6} sm={4} key={d.key} sx={{ mb: 0.5 }}>
            <Stack direction="row" spacing={1} alignItems="center" py={0.2}>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: 13.2,
                  color: "#495769",
                  width: 38,
                }}
              >
                {d.label}
              </Typography>
              <Chip
                size="small"
                label={label}
                color={color}
                variant={color === "default" ? "outlined" : "filled"}
                sx={{
                  fontWeight: 500,
                  fontSize: 13,
                  px: 1.6,
                  borderRadius: 1,
                  height: 28,
                  bgcolor:
                    color === "default"
                      ? "#f4f7fa"
                      : color === "success"
                      ? "#eafaf3"
                      : "#eaf0fa",
                  color:
                    color === "default"
                      ? "#90a4b5"
                      : color === "success"
                      ? "#217a56"
                      : "#2154a0",
                }}
              />
            </Stack>
          </Grid>
        );
      })}
    </Grid>
  );
}

export default function MechanicProfileModal({
  open,
  onClose,
  mechanic,
  skillMap,
}) {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  if (!mechanic) return null;
  let availObj = mechanic.availability;
  if (typeof availObj === "string") {
    try {
      availObj = JSON.parse(availObj);
    } catch {
      availObj = {};
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          maxWidth: 480,
          width: "90%",
          m: 0,
          borderRadius: 1,
          background: "#f8fafc",
          boxShadow: "0 8px 32px rgba(45,80,130,0.10)",
          p: 0,
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 1,
          pt: 2.5,
          pr: 5,
          pl: { xs: 2, sm: 3 },
          fontWeight: 800,
          fontSize: 22,
          color: "#212b36",
          borderBottom: "1.5px solid #e7eaf3",
        }}
      >
        Mechanic Profile
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 12,
            top: 15,
            color: "#99a7ba",
            "&:hover": { color: "#223b85" },
          }}
        >
          <CloseIcon fontSize="medium" />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          pt: 2,
          pb: 3,
          px: { xs: 2, sm: 3 },
          background: "#f8fafc",
          minWidth: { xs: "80vw", sm: 370 },
          maxHeight: { xs: "84vh", sm: "76vh" }, // Responsive dialog content height
          overflowY: "auto",
          // Custom scrollbar styles (Webkit + Firefox)
          scrollbarWidth: "thin",
          scrollbarColor: "#c9d3e3 #f8fafc",
          "&::-webkit-scrollbar": {
            width: 7,
            background: "#f8fafc",
            borderRadius: 6,
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#c9d3e3",
            borderRadius: 6,
            minHeight: 56,
            border: "1.5px solid #f4f7fa",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#b1b8c7",
          },
        }}
      >
        {/* Header */}
        <Stack
          direction="row"
          alignItems="flex-start"
          spacing={2}
          sx={{
            width: "100%",
            mb: 2,
            mt: 1,
            py: 1.5,
            px: 2,
          }}
        >
          <Avatar
            src={getPhotoUrl(mechanic.photo)}
            alt={mechanic.name}
            sx={{
              width: 82,
              height: 82,
              borderRadius: 1,
              border: "2.2px solid #e0e5f1",
              boxShadow: "0 1px 7px rgba(90,130,190,0.08)",
              mr: 1,
              flexShrink: 0,
              bgcolor: "#dfe8f2",
            }}
          />
          <Stack
            spacing={0.6}
            width="100%"
            alignItems="flex-start"
            justifyContent="center"
          >
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{
                letterSpacing: 0.02,
                fontSize: 20,
                py: 0.2,
                color: "#212b36",
              }}
            >
              {mechanic.name}
            </Typography>
            <Stack
              direction="row"
              spacing={1.2}
              alignItems="center"
              sx={{ py: 0.2 }}
            >
              <MailOutline sx={{ color: "#2971c7", fontSize: 17 }} />
              <Typography
                fontSize={15}
                color="text.secondary"
                sx={{
                  fontWeight: 500,
                  maxWidth: { xs: 110, sm: 170 },
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {mechanic.email}
              </Typography>
              <Tooltip title="Copy Email">
                <IconButton
                  onClick={() =>
                    copyToClipboard(mechanic.email, "Email copied")
                  }
                  size="small"
                  sx={{ ml: -0.2 }}
                >
                  <CopyIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            </Stack>
            <Stack direction="row" spacing={1.2} alignItems="center">
              <Phone sx={{ color: "#27ab6a", fontSize: 17 }} />
              <Typography
                fontSize={15}
                color="text.secondary"
                sx={{
                  fontWeight: 500,
                  maxWidth: { xs: 110, sm: 140 },
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {mechanic.phone}
              </Typography>
              <Tooltip title="Copy Phone">
                <IconButton
                  onClick={() =>
                    copyToClipboard(mechanic.phone, "Phone copied")
                  }
                  size="small"
                  sx={{ ml: -0.2 }}
                >
                  <CopyIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            </Stack>
            <Chip
              label={mechanic.status?.toUpperCase()}
              color={
                mechanic.status === "active"
                  ? "success"
                  : mechanic.status === "pending"
                  ? "warning"
                  : mechanic.status === "suspended"
                  ? "error"
                  : "default"
              }
              size="small"
              sx={{
                mt: 1,
                px: 1.8,
                fontWeight: 700,
                letterSpacing: 0.8,
                fontSize: 13.3,
                borderRadius: 1,
                bgcolor: "#e5eefc",
                color: "#233054",
                height: 28,
              }}
            />
          </Stack>
        </Stack>

        <Divider sx={{ my: 2, borderColor: "#e7eaf3" }} />

        {/* Details */}
        <Grid container spacing={0.5} sx={{ width: "100%", mb: 1.5 }}>
          <Grid item xs={12} sm={6} sx={{ px: 1, mb: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Person sx={{ color: "#d1833e", fontSize: 18 }} />
              <Typography fontWeight={600}>Experience:</Typography>
              <Typography>{mechanic.experience || "-"} yr</Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ px: 1, mb: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <WorkOutline sx={{ color: "#1e3d6a", fontSize: 18 }} />
              <Typography fontWeight={600}>Aadhar:</Typography>
              <Typography>{mechanic.aadhar || "N/A"}</Typography>
            </Stack>
          </Grid>
        </Grid>

        {/* Skills */}
        <Box sx={{ mt: 0.5, mb: 1.5 }}>
          <Typography fontWeight={600} sx={{ mb: 0.3 }}>
            Skills:
          </Typography>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            flexWrap="wrap"
            sx={{
              gap: 1,
              width: "100%",
              mb: 1,
              minHeight: 36,
            }}
          >
            {Array.isArray(mechanic.skillSet) && mechanic.skillSet.length ? (
              mechanic.skillSet.map((s) => (
                <Chip
                  key={s}
                  label={skillMap && skillMap[s] ? skillMap[s] : s}
                  size="medium"
                  sx={{
                    fontWeight: 600,
                    fontSize: 15,
                    bgcolor: "#e9f5f3",
                    color: "#106655",
                    borderRadius: 8,
                    px: 2.3,
                    py: 0.3,
                    height: 32,
                  }}
                />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                None
              </Typography>
            )}
          </Stack>
        </Box>

        <Divider sx={{ my: 2, borderColor: "#e7eaf3" }} />

        {/* Address & Availability */}
        <Box sx={{ mb: 1.3, py: 0.6 }}>
          <Stack
            direction="row"
            spacing={1.2}
            alignItems="center"
            flexWrap="wrap"
          >
            <Place sx={{ fontSize: 18, color: "#e97a34" }} />
            <Typography fontWeight={600}>Address:</Typography>
            <Typography
              sx={{
                maxWidth: { xs: 180, sm: 310 },
                overflowWrap: "break-word",
                fontSize: 15,
              }}
            >
              {typeof mechanic.address === "string"
                ? mechanic.address
                : JSON.stringify(mechanic.address)}
            </Typography>
          </Stack>
        </Box>
        <Box sx={{ mb: 1.3 }}>
          <Stack direction="row" spacing={1.1} alignItems="center">
            <AccessTime sx={{ fontSize: 18, color: "#929dbd" }} />
            <Typography fontWeight={600}>Availability:</Typography>
          </Stack>
          <Box sx={{ pl: isXs ? 1 : 4, pr: 1, width: "100%" }} p={1}>
            <AvailabilityDisplay availability={availObj} />
          </Box>
        </Box>
        <Box>
          <Stack direction="row" spacing={1.2} alignItems="center">
            <Typography fontWeight={600} color="text.secondary">
              Last Login:
            </Typography>
            <Typography>
              {mechanic.lastLogin
                ? new Date(mechanic.lastLogin).toLocaleString()
                : "Never"}
            </Typography>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
