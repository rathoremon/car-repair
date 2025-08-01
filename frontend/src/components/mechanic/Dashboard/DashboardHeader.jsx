// src/components/mechanic/Dashboard/DashboardHeader.jsx
import React from "react";
import {
  Box,
  Typography,
  Grid,
  Avatar,
  useTheme,
  useMediaQuery,
  Stack,
  Switch,
  Paper,
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import EngineeringIcon from "@mui/icons-material/Engineering";
import { format } from "date-fns";

const DashboardHeader = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const today = format(new Date(), "EEEE, dd MMM yyyy");
  const [online, setOnline] = React.useState(true);

  return (
    <Paper
      elevation={6}
      sx={{
        width: "100%",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2.5, sm: 3 },
        mb: 4,
        borderRadius: 1.5,
        backgroundColor:
          theme.palette.mode === "dark"
            ? theme.palette.background.default
            : theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: "0 2px 4px rgba(0,0,0,0.03), 0 8px 18px rgba(0,0,0,0.06)",
      }}
    >
      <Grid
        container
        spacing={4}
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
      >
        {/* LEFT: Mechanic Identity */}
        <Grid item xs={12} sm={6}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              sx={{
                width: 56,
                height: 56,
                fontSize: 30,
                bgcolor: theme.palette.primary.main,
                color: "#fff",
                boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
              }}
            >
              <EngineeringIcon fontSize="inherit" />
            </Avatar>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  lineHeight: 1.3,
                  fontSize: { xs: "1rem", sm: "1.15rem" },
                  color: theme.palette.text.primary,
                }}
              >
                Hello, Mechanic
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "0.875rem", mt: 0.3 }}
              >
                Let’s fix some engines today.
              </Typography>
            </Box>
          </Stack>
        </Grid>

        {/* RIGHT: Date + Status */}
        <Grid item xs={12} sm={6}>
          <Stack
            direction={isMobile ? "column" : "row"}
            spacing={isMobile ? 1.5 : 3}
            alignItems="center"
            justifyContent={isMobile ? "flex-start" : "flex-end"}
            sx={{ textAlign: isMobile ? "left" : "right" }}
          >
            {/* Date */}
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontWeight: 500,
                  fontSize: "0.825rem",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                {today}
              </Typography>
            </Box>

            {/* Status Toggle */}
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <CircleIcon
                fontSize="small"
                sx={{
                  color: online
                    ? theme.palette.success.main
                    : theme.palette.grey[400],
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  color: theme.palette.text.secondary,
                  fontSize: "0.875rem",
                }}
              >
                {online ? "Online" : "Offline"}
              </Typography>
              <Switch
                checked={online}
                onChange={() => setOnline(!online)}
                size="small"
                color="success"
                inputProps={{
                  "aria-label": "Toggle online status",
                }}
                sx={{
                  transform: "scale(0.95)",
                }}
              />
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default DashboardHeader;
