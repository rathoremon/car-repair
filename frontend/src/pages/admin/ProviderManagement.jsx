import React from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Box,
  Avatar,
  InputBase,
  useTheme,
  Stack,
  Fade,
} from "@mui/material";
import Container from "../../components/Container";

import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

const providers = [
  { id: 1, name: "SpeedFix", tier: "Gold", kycStatus: "Pending" },
  { id: 2, name: "QuickAuto", tier: "Silver", kycStatus: "Approved" },
  { id: 3, name: "PlatinumWheels", tier: "Platinum", kycStatus: "Approved" },
];

const tierColor = (tier, theme) => {
  if (tier === "Platinum") return { bg: "#A3A3A3", color: "#fff" };
  if (tier === "Gold")
    return {
      bg: theme.palette.warning.light,
      color: theme.palette.warning.contrastText,
    };
  if (tier === "Silver")
    return {
      bg: theme.palette.info.light,
      color: theme.palette.info.contrastText,
    };
  return { bg: theme.palette.grey[200], color: theme.palette.text.primary };
};

const kycIcon = (status, theme) =>
  status === "Approved" ? (
    <CheckCircleIcon
      sx={{ color: theme.palette.success.main, fontSize: 18, mr: 0.5 }}
    />
  ) : (
    <HourglassEmptyIcon
      sx={{ color: theme.palette.warning.main, fontSize: 18, mr: 0.5 }}
    />
  );

export default function ProviderManagement() {
  const theme = useTheme();

  return (
    <Container>
      <Fade in timeout={600}>
        <Box>
          {/* Gradient header bar */}

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 3 }}
          >
            <Box>
              <Typography
                variant="h4"
                color="primary"
                fontWeight={700}
                gutterBottom
                sx={{ letterSpacing: 1 }}
              >
                Service Providers
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Manage and review all registered service providers.
              </Typography>
            </Box>
            {/* Search bar (UI only) */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: theme.palette.custom.sidebarBg,
                borderRadius: 2,
                px: 2,
                py: 0.5,
                boxShadow: 1,
                minWidth: 220,
              }}
            >
              <SearchIcon color="action" sx={{ mr: 1 }} />
              <InputBase
                placeholder="Search providers…"
                sx={{
                  fontSize: "1rem",
                  color: "text.primary",
                  width: "100%",
                }}
                inputProps={{ "aria-label": "search providers" }}
                disabled
              />
            </Box>
          </Stack>
          <TableContainer
            sx={{
              borderRadius: 3,
              boxShadow: theme.shadows[1],
              maxHeight: 420,
              background: theme.palette.background.paper,
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow
                  sx={{
                    "& th": {
                      fontWeight: 700,
                      color: theme.palette.text.secondary,
                      backgroundColor: theme.palette.custom.sidebarBg,
                      borderBottom: `2px solid ${theme.palette.divider}`,
                    },
                  }}
                >
                  <TableCell>Provider</TableCell>
                  <TableCell>Tier</TableCell>
                  <TableCell>KYC Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {providers.map((p) => (
                  <TableRow
                    key={p.id}
                    hover
                    sx={{
                      transition: "background 0.2s",
                      "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar
                          sx={{
                            bgcolor: tierColor(p.tier, theme).bg,
                            color: tierColor(p.tier, theme).color,
                            fontWeight: 700,
                            width: 40,
                            height: 40,
                            fontSize: "1.1rem",
                          }}
                        >
                          {p.name[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {p.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {p.id}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={p.tier}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          letterSpacing: 0.5,
                          px: 1.5,
                          bgcolor: tierColor(p.tier, theme).bg,
                          color: tierColor(p.tier, theme).color,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center">
                        {kycIcon(p.kycStatus, theme)}
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          color={
                            p.kycStatus === "Approved"
                              ? theme.palette.success.main
                              : theme.palette.warning.main
                          }
                        >
                          {p.kycStatus}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        sx={{
                          borderRadius: 2,
                          fontWeight: 600,
                          boxShadow: "none",
                          textTransform: "none",
                          px: 2,
                          py: 0.5,
                          "&:hover": {
                            backgroundColor: theme.palette.primary.dark,
                          },
                        }}
                      >
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Fade>
    </Container>
  );
}
