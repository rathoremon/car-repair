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
import EngineeringIcon from "@mui/icons-material/Engineering";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import RoleSwitch from "../../common/RoleSwitch";

const DashboardHeader = ({ currentRole, onToggleConfirm }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const today = format(new Date(), "EEEE, dd MMM yyyy");
  const [online, setOnline] = React.useState(true);
  const { user } = useSelector((s) => s.auth);
  console.log(currentRole);

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
        {/* LEFT */}
        <Grid item xs={12} sm={6}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: theme.palette.primary.main,
              }}
            >
              <EngineeringIcon fontSize="medium" sx={{ color: "#fff" }} />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Hello, Mechanic
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Let’s fix some engines today.
              </Typography>
              {/* Date */}
              <Typography
                variant="caption"
                color="text.secondary"
                justifyContent="left"
                sx={{ textTransform: "uppercase" }}
              >
                {today}
              </Typography>
            </Box>
          </Stack>
        </Grid>

        {/* RIGHT */}
        <Grid item xs={12} sm={6} width={isMobile ? "100%" : "none"}>
          <Stack
            direction={isMobile ? "column" : "row"}
            spacing={isMobile ? 1.5 : 3}
            justifyContent={isMobile ? "flex-center" : "flex-end"}
            sx={{ textAlign: isMobile ? "left" : "right" }}
            alignItems="center"
          >
            {/* Online Status */}
            <Stack direction="row" spacing={4.6}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                spacing={0.5}
              >
                <Switch
                  checked={online}
                  onChange={() => setOnline(!online)}
                  size="small"
                  color="success"
                />
                <Typography variant="body2" color="text.secondary">
                  {online ? "Online" : "Offline"}
                </Typography>
              </Stack>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                spacing={2.5}
              >
                {user?.hasMechanicProfile && user?.hasProviderProfile && (
                  <RoleSwitch
                    key={currentRole}
                    currentRole={currentRole}
                    onToggleConfirm={onToggleConfirm}
                  />
                )}
              </Stack>
            </Stack>

            {/* Role Toggle */}
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default DashboardHeader;
