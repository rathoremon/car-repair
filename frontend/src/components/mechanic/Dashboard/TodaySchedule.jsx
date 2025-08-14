// src/components/mechanic/Dashboard/TodaySchedule.jsx
import React from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  useMediaQuery,
  useTheme,
  Skeleton,
} from "@mui/material";
import { motion } from "framer-motion";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const TodaySchedule = ({
  jobs = [],
  loading = false,
  onRefresh,
  onViewAll,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const getStatusColor = (status = "") => {
    const s = String(status).toLowerCase();
    switch (s) {
      case "in progress":
        return "info";
      case "pending":
        return "warning";
      case "completed":
        return "success";
      case "en route":
        return "primary";
      default:
        return "default";
    }
  };

  // Loading skeletons
  if (loading) {
    return (
      <Box>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Today&apos;s Schedule
        </Typography>
        <Stack spacing={2}>
          {[...Array(3)].map((_, i) => (
            <Paper key={i} sx={{ p: isMobile ? 2 : 3, borderRadius: 2 }}>
              <Stack
                direction={isMobile ? "column" : "row"}
                justifyContent="space-between"
                alignItems={isMobile ? "flex-start" : "center"}
                spacing={isMobile ? 1.5 : 2}
              >
                <Box flex={1}>
                  <Skeleton variant="text" width={200} />
                  <Skeleton variant="text" width={280} />
                </Box>
                <Stack direction="row" spacing={1.5}>
                  <Skeleton variant="text" width={60} />
                  <Skeleton variant="rounded" width={110} height={32} />
                </Stack>
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Box>
    );
  }

  const isEmpty = !jobs || jobs.length === 0;

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Today&apos;s Schedule
      </Typography>

      {isEmpty ? (
        <Paper
          component={motion.div}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 140 }}
          elevation={0}
          sx={{
            p: isMobile ? 3 : 4,
            textAlign: "center",
            borderRadius: 2,
            border: `1px dashed ${theme.palette.divider}`,
            bgcolor:
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.02)"
                : "rgba(0,0,0,0.02)",
          }}
        >
          <CalendarTodayIcon sx={{ fontSize: 48, mb: 1, opacity: 0.7 }} />
          <Typography variant="subtitle1" fontWeight={600}>
            No jobs scheduled for today
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            You’ll see new assignments here as soon as they’re created or
            assigned to you.
          </Typography>

          {(onRefresh || onViewAll) && (
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              justifyContent="center"
              sx={{ mt: 2 }}
            >
              {onRefresh && (
                <Button variant="outlined" onClick={onRefresh}>
                  Refresh
                </Button>
              )}
              {onViewAll && (
                <Button variant="contained" onClick={onViewAll}>
                  View all jobs
                </Button>
              )}
            </Stack>
          )}
        </Paper>
      ) : (
        <Stack spacing={2}>
          {jobs.map((job, idx) => {
            const clickable = typeof job.onClick === "function";
            return (
              <Paper
                key={idx}
                component={motion.div}
                elevation={3}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                onClick={clickable ? job.onClick : undefined}
                sx={{
                  p: isMobile ? 2 : 3,
                  borderRadius: `${theme.shape.borderRadius * 1}px`,
                  bgcolor: theme.palette.background.paper,
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 4px 28px rgba(40, 60, 120, 0.20)",
                  border: `1px solid ${theme.palette.divider}`,
                  gap: 1,
                  cursor: clickable ? "pointer" : "default",
                  "&:hover": clickable
                    ? { boxShadow: "0 6px 30px rgba(40, 60, 120, 0.25)" }
                    : undefined,
                }}
              >
                <Stack
                  direction={isMobile ? "column" : "row"}
                  justifyContent="space-between"
                  alignItems={isMobile ? "flex-start" : "center"}
                  spacing={isMobile ? 1.5 : 2}
                >
                  <Box flex={1}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {job.vehicle}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      {job.location}
                    </Typography>
                  </Box>

                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                    justifyContent={isMobile ? "flex-start" : "flex-end"}
                    sx={{ minWidth: isMobile ? "100%" : "auto" }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 500, minWidth: 80 }}
                    >
                      {job.time}
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      color={getStatusColor(job.status)}
                      sx={{
                        textTransform: "capitalize",
                        fontWeight: 500,
                        borderRadius: 2,
                      }}
                    >
                      {job.status}
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      )}
    </Box>
  );
};

export default TodaySchedule;
