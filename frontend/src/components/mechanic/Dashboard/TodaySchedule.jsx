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
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";

const TodaySchedule = ({ jobs }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "in progress":
        return "info";
      case "pending":
        return "warning";
      case "completed":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Today's Schedule
      </Typography>

      <Stack spacing={2}>
        {jobs.map((job, idx) => (
          <Paper
            key={idx}
            component={motion.div}
            elevation={3}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            sx={{
              p: isMobile ? 2 : 3,
              borderRadius: `${theme.shape.borderRadius * 1}px`,
              bgcolor: theme.palette.background.paper,
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 4px 28px rgba(40, 60, 120, 0.25)",
              border: `1px solid ${theme.palette.divider}`,
              gap: 1,
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
        ))}
      </Stack>
    </Box>
  );
};

export default TodaySchedule;
