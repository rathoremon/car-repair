import React from "react";
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  Avatar,
  Stack,
  IconButton,
  Tooltip,
  Box,
  useMediaQuery,
  Skeleton,
  useTheme,
  alpha,
  Collapse,
  Button,
} from "@mui/material";
import {
  Call,
  LocationOn,
  Schedule,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import dayjs from "dayjs";

// Mock bookings
const mockBookings = [
  {
    id: 1,
    customer: "Amit Patel",
    time: "10:30 AM",
    service: "Tire Change",
    status: "Scheduled",
    phone: "+91 88888 88888",
    location: "S G Highway, Ahmedabad",
  },
  {
    id: 2,
    customer: "Priya Sharma",
    time: "12:00 PM",
    service: "Jump Start",
    status: "Completed",
    phone: "+91 99999 99999",
    location: "Vastrapur, Ahmedabad",
  },
  {
    id: 3,
    customer: "Rahul Jain",
    time: "3:00 PM",
    service: "Battery Issue",
    status: "Scheduled",
    phone: "+91 77777 77777",
    location: "Satellite, Ahmedabad",
  },
  {
    id: 4,
    customer: "Rahul Jain",
    time: "3:00 PM",
    service: "Battery Issue",
    status: "Scheduled",
    phone: "+91 77777 77777",
    location: "Satellite, Ahmedabad",
  },
];

const getStatusChip = (status, isMobile) => (
  <Chip
    label={status}
    size={isMobile ? "small" : "medium"}
    color={status === "Completed" ? "success" : "info"}
    sx={{
      fontWeight: 600,
      minWidth: isMobile ? 60 : 80,
      borderRadius: 1,
      px: 1,
      fontSize: isMobile ? 11.5 : 13,
      height: isMobile ? 22 : 28,
      boxShadow: "none",
    }}
  />
);

const TodayBookings = ({
  bookings = mockBookings,
  loading = false,
  onContactClick = (phone) => window.open(`tel:${phone}`),
  onLocationClick = (location) => {},
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [expanded, setExpanded] = React.useState({});

  const handleExpandClick = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Paper
      component={motion.div}
      elevation={isMobile ? 0 : 2}
      sx={{
        borderRadius: 1.5,
        boxShadow: "0 4px 28px rgba(40, 60, 120, 0.25)",
        background: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        p: 0,
        height: "100%",
        maxHeight: { xs: 280, sm: 330, md: 330 },
        display: "flex",
        flexDirection: "column",
      }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      {/* Header */}
      <Box sx={{ px: 3, pt: 2, pb: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography
            variant="subtitle2"
            sx={{
              textTransform: "uppercase",
              fontWeight: 700,
              letterSpacing: 1,
              fontSize: { xs: 14, sm: 16 },
              flex: 1,
              fontFamily: "'Inter', 'Roboto', sans-serif",
              color: (theme) => theme.palette.text.primary,
            }}
          >
            Today's Bookings
          </Typography>

          <Chip
            label={bookings.length}
            color="primary"
            size="small"
            sx={{
              fontWeight: 600,
              fontSize: 12,
              letterSpacing: 0.5,
              height: 22,
              bgColor: (theme) => theme.palette.primary[100],
              color: "#fff",
            }}
          />
        </Stack>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            ml: 0.5,
            fontFamily: "'Inter', 'Roboto', sans-serif",
            fontSize: 12,
          }}
        >
          {dayjs().format("dddd, MMM D")}
        </Typography>
      </Box>
      <Divider />

      <List
        disablePadding
        sx={{
          minHeight: 0,
          overflowY: "auto",
          borderRadius: 1.5,
          "&::-webkit-scrollbar": {
            width: "7px",
            display: isMobile ? "none" : "block",
          },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: alpha(theme.palette.primary.light, 0.25),
            borderRadius: "6px",
          },
        }}
      >
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <ListItem
              key={i}
              sx={{
                px: { xs: 2, sm: 3 },
                py: { xs: 1.5, sm: 1.7 },
                alignItems: "center",
                gap: 2,
              }}
              disableGutters
            >
              <Skeleton variant="circular" width={32} height={32} />
              <Box sx={{ flex: 1 }}>
                <Skeleton width="60%" />
                <Skeleton width="35%" />
              </Box>
              <Skeleton width={48} height={22} sx={{ borderRadius: 1.5 }} />
            </ListItem>
          ))
        ) : bookings.length === 0 ? (
          <ListItem
            sx={{
              py: 5,
              justifyContent: "center",
              width: "100%",
              textAlign: "center",
              background: (theme) => theme.palette.grey[50],
            }}
          >
            <Stack alignItems="center" width="100%">
              <Schedule color="disabled" sx={{ fontSize: 32, mb: 0.5 }} />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                No bookings today
              </Typography>
              <Typography variant="caption" color="text.disabled">
                All your bookings will appear here.
              </Typography>
            </Stack>
          </ListItem>
        ) : (
          bookings.map((bk, idx) => (
            <React.Fragment key={bk.id}>
              <ListItem
                disableGutters
                sx={{
                  px: { xs: 2, sm: 3 },
                  py: { xs: 1.1, sm: 1.7 },
                  display: "flex",
                  alignItems: isMobile ? "flex-start" : "center",
                  flexDirection: isMobile ? "column" : "row",
                  gap: isMobile ? 0.2 : 2,
                  transition: "background 0.18s",
                  "&:hover": {
                    background: !isMobile
                      ? (theme) => theme.palette.action.hover
                      : "inherit",
                  },
                  cursor: "default",
                  borderBottom:
                    isMobile && idx < bookings.length - 1
                      ? "1px solid " + theme.palette.grey[100]
                      : "none",
                }}
              >
                {/* Row Top: Avatar, name, call, expand/collapse */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Avatar
                    sx={{
                      width: isMobile ? 32 : 36,
                      height: isMobile ? 32 : 36,
                      fontWeight: 600,
                      bgcolor: "grey.100",
                      color: "primary.main",
                      fontFamily: "'Inter', 'Roboto', sans-serif",
                      mr: 2,
                      flexShrink: 0,
                      fontSize: isMobile ? 16 : 18,
                    }}
                    alt={bk.customer}
                  >
                    {bk.customer.charAt(0)}
                  </Avatar>
                  <Box
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 500,
                        fontFamily: "'Inter', 'Roboto', sans-serif",
                        color: "text.primary",
                        fontSize: { xs: 14, sm: 16 },
                        lineHeight: 1.2,
                        mb: 0,
                        wordBreak: "break-word",
                      }}
                    >
                      {bk.customer}
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontWeight: 400,
                          fontFamily: "'Inter', 'Roboto', sans-serif",
                          fontSize: { xs: 12.3, sm: 14.5 },
                          ml: 1,
                        }}
                      >
                        • {bk.service}
                      </Typography>
                    </Typography>
                  </Box>
                  {/* Right actions */}
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Tooltip title="Call Customer">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => onContactClick(bk.phone)}
                        sx={{ ml: 0.5 }}
                      >
                        <Call fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {/* Show expand/collapse on mobile only */}
                    {isMobile && (
                      <IconButton
                        size="small"
                        onClick={() => handleExpandClick(bk.id)}
                        aria-label={
                          expanded[bk.id] ? "Hide Details" : "Show Details"
                        }
                        sx={{ ml: 0.5 }}
                      >
                        {expanded[bk.id] ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    )}
                  </Stack>
                </Box>
                {/* Desktop-only details */}
                {!isMobile && (
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ ml: 2, flexShrink: 0 }}
                  >
                    <Stack direction="row" alignItems="center" spacing={0.4}>
                      <LocationOn sx={{ fontSize: 18, color: "info.main" }} />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          fontWeight: 400,
                          fontFamily: "'Inter', 'Roboto', sans-serif",
                          fontSize: 13.2,
                          maxWidth: 140,
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                        }}
                        title={bk.location}
                      >
                        {bk.location}
                      </Typography>
                    </Stack>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        fontWeight: 400,
                        fontFamily: "'Inter', 'Roboto', sans-serif",
                        fontSize: 13.5,
                        mr: 1,
                        ml: 1,
                      }}
                    >
                      {bk.time}
                    </Typography>
                    {getStatusChip(bk.status, isMobile)}
                  </Stack>
                )}
                {/* Mobile expanded details */}
                {isMobile && (
                  <Collapse
                    in={expanded[bk.id]}
                    timeout="auto"
                    unmountOnExit
                    sx={{ width: "100%" }}
                  >
                    <Stack
                      direction="column"
                      spacing={0.5}
                      sx={{ mt: 1, mb: 0.2, pl: 5 }}
                    >
                      <Stack direction="row" alignItems="center" spacing={0.7}>
                        <LocationOn sx={{ fontSize: 16, color: "info.main" }} />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            fontWeight: 400,
                            fontFamily: "'Inter', 'Roboto', sans-serif",
                            fontSize: 12.4,
                            maxWidth: 180,
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                          }}
                          title={bk.location}
                        >
                          {bk.location}
                        </Typography>
                      </Stack>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          fontWeight: 400,
                          fontFamily: "'Inter', 'Roboto', sans-serif",
                          fontSize: 12.5,
                        }}
                      >
                        {bk.time}
                      </Typography>
                      <Box sx={{ mt: 0.3 }}>
                        {getStatusChip(bk.status, isMobile)}
                      </Box>
                    </Stack>
                  </Collapse>
                )}
              </ListItem>
              {/* Divider */}
              {idx < bookings.length - 1 && (
                <Divider
                  component="li"
                  sx={{
                    ml: { xs: 5, sm: 9 },
                    borderColor: "grey.200",
                    borderBottomWidth: 1,
                  }}
                />
              )}
            </React.Fragment>
          ))
        )}
      </List>
    </Paper>
  );
};

export default TodayBookings;
