import React, { useState } from "react";
import {
  Paper,
  Typography,
  Box,
  LinearProgress,
  Tooltip,
  IconButton,
  Chip,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  useTheme,
  Divider,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { alpha } from "@mui/material/styles";

// Example dynamic profile completion logic
const SECTIONS = [
  {
    key: "kyc",
    label: "KYC Verification",
    complete: true,
    link: "/provider/kyc",
  },
  {
    key: "garage",
    label: "Garage Images",
    complete: false,
    link: "/provider/profile",
  },
  {
    key: "bank",
    label: "Bank Details",
    complete: true,
    link: "/provider/bank",
  },
  {
    key: "documents",
    label: "Document Upload",
    complete: false,
    link: "/provider/documents",
  },
  {
    key: "services",
    label: "Service List",
    complete: true,
    link: "/provider/services",
  },
];

const calcPercent = (sections) =>
  Math.round(
    (sections.filter((s) => s.complete).length / sections.length) * 100
  );

const ProfileCompletion = () => {
  const [expand, setExpand] = useState(false);
  const theme = useTheme();
  const percent = calcPercent(SECTIONS);

  // Show only incomplete sections
  const incomplete = SECTIONS.filter((s) => !s.complete);

  return (
    <Paper
      elevation={4}
      sx={{
        borderRadius: 1.5,
        p: 3,
        mb: 2,
        boxShadow: "0 4px 28px rgba(40, 60, 120, 0.25)",
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
        minWidth: 0,
        transition: "box-shadow 0.3s cubic-bezier(.4,0,.2,1)",
        position: "relative",
      }}
      component={motion.section}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      role="region"
      aria-label="Profile Completion"
    >
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography
          variant="subtitle1"
          fontWeight={700}
          sx={{
            letterSpacing: 0.1,
            fontSize: { xs: 16, md: 17 },
          }}
        >
          Profile Completion
        </Typography>
        <Tooltip title="A complete profile unlocks more bookings, payments and trust!">
          <IconButton size="small" color="info" sx={{ ml: 1 }}>
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      <Box display="flex" alignItems="center" gap={1} mt={1.2}>
        <Box flexGrow={1} mr={1}>
          <AnimatePresence>
            <motion.div
              key={percent}
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.7, type: "spring" }}
            >
              <LinearProgress
                aria-label="Profile completion"
                variant="determinate"
                value={percent}
                sx={{
                  height: 12,
                  borderRadius: 2,
                  boxShadow: percent === 100 ? theme.shadows[2] : "none",
                  backgroundColor:
                    percent === 100
                      ? alpha(theme.palette.success.main, 0.12)
                      : theme.palette.grey[300],
                  "& .MuiLinearProgress-bar": {
                    transition: "width 1.2s cubic-bezier(.2,.7,.5,1)",
                    background:
                      percent === 100
                        ? `linear-gradient(90deg, ${theme.palette.success.light}, ${theme.palette.success.dark})`
                        : `linear-gradient(90deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
                  },
                }}
              />
            </motion.div>
          </AnimatePresence>
        </Box>
        <Chip
          label={percent === 100 ? "Complete" : `${percent}%`}
          color={
            percent === 100 ? "success" : percent > 70 ? "primary" : "warning"
          }
          size="small"
          icon={
            percent === 100 ? <CheckCircleIcon fontSize="small" /> : undefined
          }
          sx={{
            fontWeight: 700,
            fontFamily: "inherit",
            letterSpacing: 0.5,
            fontSize: 14,
            bgcolor:
              percent === 100
                ? alpha(theme.palette.success.main, 0.15)
                : alpha(theme.palette.primary.main, 0.48),
          }}
        />
      </Box>

      <Box
        mt={2}
        mb={expand && incomplete.length > 0 ? 0 : 1.2}
        display="flex"
        alignItems="center"
      >
        {percent < 100 ? (
          <Button
            variant="contained"
            size="small"
            color="primary"
            endIcon={<ArrowForwardIosIcon fontSize="small" />}
            href={incomplete[0]?.link}
            sx={{
              fontWeight: 600,
              borderRadius: 1,
              boxShadow: "0 1px 4px rgba(34,41,47,0.07)",
              minWidth: 0,
              px: 2.5,
              textTransform: "none",
            }}
          >
            Complete Now
          </Button>
        ) : (
          <Chip
            icon={<AssignmentTurnedInOutlinedIcon color="success" />}
            label="Profile ready for bookings!"
            color="success"
            size="medium"
            sx={{
              fontWeight: 600,
              bgcolor: alpha(theme.palette.success.main, 0.08),
              px: 1.5,
            }}
          />
        )}

        {percent < 100 && (
          <Button
            variant="text"
            size="small"
            color="secondary"
            startIcon={expand ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            onClick={() => setExpand((x) => !x)}
            sx={{
              ml: 1,
              fontWeight: 400,
              fontSize: 12,
              textTransform: "none",
            }}
            aria-expanded={expand}
            aria-controls="profile-incomplete-list"
          >
            {expand ? "Hide Details" : "What’s missing?"}
          </Button>
        )}
      </Box>

      <Collapse in={expand && incomplete.length > 0}>
        <Divider sx={{ my: 1.3 }} />
        <List
          id="profile-incomplete-list"
          dense
          sx={{
            width: "100%",
            "& .MuiListItem-root": { py: 0.7 },
            "& .MuiListItemIcon-root": { minWidth: 28 },
          }}
        >
          {incomplete.map((s) => (
            <ListItem
              key={s.key}
              disableGutters
              secondaryAction={
                <Button
                  size="small"
                  href={s.link}
                  color="info"
                  sx={{
                    textTransform: "none",
                    fontWeight: 500,
                    fontSize: 13,
                    ml: 0.5,
                  }}
                >
                  Fix
                </Button>
              }
            >
              <ListItemIcon>
                <WarningAmberOutlinedIcon color="warning" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      color: theme.palette.text.primary,
                      letterSpacing: 0.05,
                    }}
                  >
                    {s.label}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </Paper>
  );
};

export default ProfileCompletion;
