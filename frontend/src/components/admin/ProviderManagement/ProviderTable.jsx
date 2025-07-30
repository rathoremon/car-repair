import React, { useEffect, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Tooltip,
  TextField,
  Box,
  Paper,
  InputAdornment,
  TableSortLabel,
  TablePagination,
  useMediaQuery,
  CircularProgress,
  Button,
  Stack,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Visibility,
  Search,
  Clear,
  ErrorOutline,
  FilterAltOff,
} from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { getAllProviders } from "../../../features/provider/providerThunks";
import { setProviderTableParams } from "../../../features/provider/providerSlice";

// ---- Columns config ----
const columns = [
  { id: "companyName", label: "Company", sortable: true, minWidth: 120 },
  { id: "contact", label: "Contact", sortable: false, minWidth: 140 },
  { id: "tier", label: "Tier", sortable: true, minWidth: 60 },
  { id: "kycStatus", label: "Status", sortable: true, minWidth: 72 },
  { id: "createdAt", label: "Requested", sortable: true, minWidth: 110 },
  {
    id: "action",
    label: "Action",
    sortable: false,
    align: "center",
    minWidth: 70,
  },
];

const DEFAULT_PARAMS = {
  search: "",
  sortBy: "createdAt",
  order: "desc",
  page: 1,
  pageSize: 10,
};

// ---- Status chip mapping ----
const statusChipProps = (status) => {
  switch (status) {
    case "pending":
      return {
        label: "PENDING",
        sx: {
          bgcolor: "#fff8e1",
          color: "#e68400",
          border: "1px solid #ffe2ac",
        },
      };
    case "verified":
      return {
        label: "VERIFIED",
        sx: {
          bgcolor: "#e7f9ed",
          color: "#237e4b",
          border: "1px solid #a7dfc3",
        },
      };
    case "rejected":
      return {
        label: "REJECTED",
        sx: {
          bgcolor: "#ffebee",
          color: "#b3212b",
          border: "1px solid #fbb1b1",
        },
      };
    default:
      return {
        label: status ? status.toUpperCase() : "—",
        sx: {
          bgcolor: "#f5f7fa",
          color: "#47536d",
          border: "1px solid #e2e6ee",
        },
      };
  }
};

const ProviderTable = ({ onViewProfile }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const inputRef = useRef();

  // Redux state
  const { providers, loading, pagination, params } = useSelector(
    (state) => state.provider
  );

  // Table params (1-based redux, 0-based TablePagination)
  const order = params.order || "desc";
  const orderBy = params.sortBy || "createdAt";
  const page = (params.page || 1) - 1;
  const rowsPerPage = params.pageSize || (isMobile ? 5 : 10);
  const searchValue = params.search || "";

  // Always fetch providers on params change (search, sort, page, etc)
  useEffect(() => {
    dispatch(getAllProviders(params));
  }, [dispatch, params]);

  // Debounced search logic: updates Redux immediately, API debounce handled by Redux thunk/middleware/server
  const handleSearchChange = (e) => {
    dispatch(
      setProviderTableParams({
        search: e.target.value,
        page: 1,
      })
    );
  };

  // Sorting
  const handleRequestSort = (property) => {
    if (!columns.find((c) => c.id === property && c.sortable)) return;
    dispatch(
      setProviderTableParams({
        sortBy: property,
        order:
          orderBy === property ? (order === "asc" ? "desc" : "asc") : "asc",
        page: 1,
      })
    );
  };

  // Pagination
  const handlePageChange = (_, newPage) => {
    dispatch(setProviderTableParams({ page: newPage + 1 }));
  };
  const handleRowsPerPageChange = (e) => {
    dispatch(
      setProviderTableParams({
        pageSize: parseInt(e.target.value, 10),
        page: 1,
      })
    );
  };

  // Clear all
  const handleClearAll = () => {
    dispatch(
      setProviderTableParams({
        ...DEFAULT_PARAMS,
        pageSize: rowsPerPage,
      })
    );
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 10);
  };

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        mb={2.2}
        justifyContent="flex-end"
      >
        <TextField
          inputRef={inputRef}
          value={searchValue}
          onChange={handleSearchChange}
          placeholder="Search by name, phone or company…"
          variant="outlined"
          fullWidth
          size="medium"
          sx={{
            background: "#f7fafc",
            borderRadius: 0.7,
            boxShadow: "none",
            transition: "box-shadow 0.25s, border-color 0.19s",
            border: "1.5px solid #e3e7ef",
            "& fieldset": { border: "none" },
            ".MuiInputBase-input": { fontSize: 16.1, py: 1.1 },
            maxWidth: 400,
            ml: "auto",
            mr: 0,
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search
                  color={searchValue ? "primary" : "disabled"}
                  sx={{ fontSize: 22 }}
                />
              </InputAdornment>
            ),
            endAdornment: searchValue ? (
              <InputAdornment position="end">
                <IconButton
                  aria-label="Clear"
                  edge="end"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    dispatch(setProviderTableParams({ search: "", page: 1 }));
                    setTimeout(() => {
                      if (inputRef.current) inputRef.current.focus();
                    }, 0);
                  }}
                  size="small"
                  sx={{
                    background: "#f5f7fa",
                    borderRadius: 8,
                    "&:hover": { background: "#eee" },
                  }}
                >
                  <Clear fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
        />
        <Button
          variant="outlined"
          size="medium"
          color="secondary"
          startIcon={<FilterAltOff />}
          onClick={handleClearAll}
          sx={{
            fontWeight: 600,
            borderRadius: 2,
            minWidth: 126,
            ml: 0.8,
            letterSpacing: 0.2,
            boxShadow: "none",
          }}
        >
          Clear All
        </Button>
      </Stack>

      <TableContainer
        component={Paper}
        elevation={2}
        sx={{
          borderRadius: 0.5,
          boxShadow: "0 2px 16px 0 rgba(44,52,100,0.07)",
          border: "1px solid #e0e4ec",
          background: "#fff",
        }}
      >
        <Table stickyHeader size="medium" sx={{ minWidth: 790 }}>
          <TableHead>
            <TableRow
              sx={{
                background: "#f4f6fb",
                "& th": {
                  borderBottom: "2px solid #e0e6f1",
                  fontWeight: 700,
                  letterSpacing: 0.04,
                  color: "#1a2341",
                  fontSize: 15.2,
                  py: 1.3,
                  background: "#f4f6fb",
                  whiteSpace: "nowrap",
                  px: 2,
                },
              }}
            >
              {columns.map((col) => (
                <TableCell
                  key={col.id}
                  align={col.align || "left"}
                  sx={{
                    minWidth: col.minWidth,
                    borderTopLeftRadius: col.id === "companyName" ? 4 : 0,
                    borderTopRightRadius: col.id === "action" ? 4 : 0,
                  }}
                  sortDirection={orderBy === col.id ? order : false}
                >
                  {col.sortable ? (
                    <TableSortLabel
                      active={orderBy === col.id}
                      direction={orderBy === col.id ? order : "asc"}
                      onClick={() => handleRequestSort(col.id)}
                      sx={{ fontWeight: 700, fontSize: 15.2 }}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  align="center"
                  sx={{ py: 7 }}
                >
                  <CircularProgress color="primary" size={38} />
                </TableCell>
              </TableRow>
            ) : providers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  align="center"
                  sx={{ py: 6, color: "#b8bed5" }}
                >
                  <ErrorOutline fontSize="large" sx={{ mb: 2 }} />
                  <Box>No providers found.</Box>
                </TableCell>
              </TableRow>
            ) : (
              providers.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  tabIndex={0}
                  sx={{
                    transition: "background 0.14s",
                    "&:hover": { background: "#f7f9fd" },
                  }}
                >
                  {/* Company */}
                  <TableCell
                    sx={{
                      fontWeight: 500,
                      fontSize: 15.1,
                      borderBottom: "1px solid #eef1f7",
                      px: 2,
                    }}
                  >
                    {row.companyName || "—"}
                  </TableCell>
                  {/* Contact */}
                  <TableCell
                    sx={{
                      borderBottom: "1px solid #eef1f7",
                      fontSize: 14.3,
                      px: 2,
                    }}
                  >
                    <Box>
                      {row.User?.name || "—"}
                      <Box
                        component="span"
                        sx={{ color: "#90939b", fontSize: 13, ml: 0.5 }}
                      >
                        <br />
                        {row.User?.phone || "—"}
                      </Box>
                    </Box>
                  </TableCell>
                  {/* Tier */}
                  <TableCell sx={{ borderBottom: "1px solid #eef1f7", px: 2 }}>
                    {row.tier || "—"}
                  </TableCell>
                  {/* Status */}
                  <TableCell sx={{ borderBottom: "1px solid #eef1f7", px: 2 }}>
                    <Chip
                      {...statusChipProps(row.kycStatus)}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        letterSpacing: 0.5,
                        fontSize: 13,
                        minWidth: 82,
                        borderRadius: 1,
                        ...statusChipProps(row.kycStatus).sx,
                      }}
                    />
                  </TableCell>
                  {/* Requested */}
                  <TableCell
                    sx={{
                      borderBottom: "1px solid #eef1f7",
                      fontSize: 14,
                      px: 2,
                    }}
                  >
                    {row.createdAt
                      ? formatDistanceToNow(new Date(row.createdAt), {
                          addSuffix: true,
                        })
                      : "—"}
                  </TableCell>
                  {/* Action */}
                  <TableCell
                    align="center"
                    sx={{ borderBottom: "1px solid #eef1f7", px: 2 }}
                  >
                    <Tooltip title="View Profile">
                      <IconButton
                        onClick={() => onViewProfile(row)}
                        tabIndex={0}
                        sx={{
                          background: "#f6f7fa",
                          borderRadius: "50%",
                          "&:hover": { background: "#e8ecf3" },
                          boxShadow: "0 1.5px 6px 0 rgba(30,34,90,0.09)",
                          transition: "background 0.15s",
                          p: 1.1,
                        }}
                        aria-label="View profile"
                      >
                        <Visibility
                          fontSize="small"
                          sx={{ color: theme.palette.primary.main }}
                        />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={pagination.total || 0}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={isMobile ? [5, 10, 20] : [10, 20, 50]}
          sx={{
            borderTop: "1px solid #e3e7ef",
            background: "#f4f6fb",
            ".MuiTablePagination-toolbar": { minHeight: 48, px: 1 },
            ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
              {
                fontSize: 14,
              },
            ".MuiInputBase-root": { fontSize: 14, borderRadius: 1 },
            ".MuiTablePagination-actions button": {
              color: theme.palette.primary.main,
            },
            borderBottomLeftRadius: 4,
            borderBottomRightRadius: 4,
          }}
        />
      </TableContainer>
    </Box>
  );
};

export default ProviderTable;
