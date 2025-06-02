import React from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Box,
  Fade,
  TableContainer,
  useTheme,
  Chip,
  Stack,
  Avatar,
  Tooltip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import Container from "../../components/Container";

const disputes = [
  { id: 1, user: "Ravi", reason: "Service not completed", status: "Open" },
  { id: 2, user: "Anu", reason: "Overcharged", status: "Resolved" },
];

const StatusChip = React.memo(function StatusChip({ status }) {
  const theme = useTheme();
  const isResolved = status === "Resolved";
  // Render the icon manually before the Chip to avoid MUI overwriting it
  const icon = isResolved ? (
    <CheckCircleIcon
      sx={{
        color: theme.palette.success.main,
        fontSize: 18,
        mr: 0.5,
        verticalAlign: "middle",
      }}
    />
  ) : (
    <HourglassEmptyIcon
      sx={{
        color: theme.palette.warning.main,
        fontSize: 18,
        mr: 0.5,
        verticalAlign: "middle",
      }}
    />
  );
  return (
    <Box display="flex" alignItems="center">
      {icon}
      <Chip
        label={status}
        size="small"
        sx={{
          fontWeight: 600,
          textTransform: "capitalize",
          bgcolor: isResolved
            ? theme.palette.success.light
            : theme.palette.warning.light,
          color: isResolved
            ? theme.palette.success.contrastText
            : theme.palette.warning.contrastText,
          minWidth: 100,
          boxShadow: isResolved ? 1 : "none",
          letterSpacing: 0.5,
        }}
        aria-label={`Dispute status: ${status}`}
      />
    </Box>
  );
});

const UserAvatar = ({ name }) => {
  const theme = useTheme();
  return (
    <Tooltip title={name} arrow>
      <Avatar
        sx={{
          bgcolor: theme.palette.primary.light,
          color: theme.palette.primary.contrastText,
          fontWeight: 700,
          width: 36,
          height: 36,
          fontSize: 18,
          mr: 1,
          textTransform: "uppercase",
        }}
        alt={name}
      >
        {name?.[0] || "U"}
      </Avatar>
    </Tooltip>
  );
};

export default function DisputeResolution() {
  const theme = useTheme();

  return (
    <Container>
      <Fade in timeout={600}>
        <Box>
          <Typography
            variant="h4"
            color="primary"
            fontWeight={700}
            gutterBottom
            sx={{ letterSpacing: 1 }}
          >
            Dispute Resolution Center
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
            View and resolve disputes raised by users.
          </Typography>
          <TableContainer
            sx={{
              borderRadius: 3,
              boxShadow: theme.shadows[1],
              maxHeight: 420,
              background: theme.palette.background.paper,
              overflowX: "auto",
            }}
          >
            <Table stickyHeader aria-label="Dispute resolution table">
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
                  <TableCell>User</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {disputes.map((dispute) => {
                  const isResolved = dispute.status === "Resolved";
                  return (
                    <TableRow
                      key={dispute.id}
                      hover
                      sx={{
                        transition: "background 0.2s",
                        "&:hover": {
                          backgroundColor: theme.palette.action.hover,
                        },
                      }}
                    >
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <UserAvatar name={dispute.user} />
                          <Typography fontWeight={600}>
                            {dispute.user}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {dispute.reason}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <StatusChip status={dispute.status} />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip
                          title={
                            isResolved
                              ? "This dispute is already resolved"
                              : "Mark as resolved"
                          }
                          arrow
                        >
                          <span>
                            <Button
                              variant={isResolved ? "contained" : "outlined"}
                              size="small"
                              color={isResolved ? "success" : "primary"}
                              sx={{
                                borderRadius: 2,
                                fontWeight: 600,
                                textTransform: "none",
                                px: 2,
                                py: 0.5,
                                boxShadow: isResolved ? 1 : "none",
                                cursor: isResolved ? "not-allowed" : "pointer",
                              }}
                              disabled={isResolved}
                            >
                              {isResolved ? "Resolved" : "Resolve"}
                            </Button>
                          </span>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Fade>
    </Container>
  );
}
