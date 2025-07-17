import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Paper,
  InputAdornment,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  LockReset as LockResetIcon,
  PersonAdd,
  BuildCircleOutlined,
  ContentCopy as ContentCopyIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMechanics,
  deleteMechanic,
  resetMechanicPassword,
  fetchMechanicById,
} from "../../../features/provider/mechanic/mechanicsThunks";
import { fetchAllSkills } from "../../../features/skill/skillThunks";
import { getPhotoUrl } from "../../../utils/getPhotoUrl";
import {
  clearSelected,
  clearResetResult,
} from "../../../features/provider/mechanic/mechanicsSlice";
import MechanicProfileDialog from "./MechanicProfileModal";
import MechanicFormDialog from "./MechanicFormDialog";
import { toast } from "react-toastify";

// --- Debounce utility ---
function useDebounced(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

export default function MechanicList() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const { list, total, loading, selected, resetPasswordResult } = useSelector(
    (s) => s.mechanics
  );
  const { allSkills } = useSelector((s) => s.skill);

  // --- State ---
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounced(search, 600);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [sortModel, setSortModel] = useState([
    { field: "createdAt", sort: "desc" },
  ]);
  const [openProfile, setOpenProfile] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [resetDialog, setResetDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  // --- Fetch all skills on mount
  useEffect(() => {
    dispatch(fetchAllSkills());
  }, [dispatch]);

  // --- Fetch mechanics with search, page, limit, sort
  useEffect(() => {
    const sort = sortModel[0] || {};
    dispatch(
      fetchMechanics({
        search: debouncedSearch,
        page: page + 1,
        limit,
        sortBy: sort.field || "createdAt",
        sortOrder: sort.sort || "desc",
      })
    );
  }, [debouncedSearch, page, limit, sortModel, dispatch]);

  // --- Skill id → name map
  const skillMap = useMemo(() => {
    const map = {};
    allSkills.forEach((sk) => {
      map[sk.id] = sk.name;
    });
    return map;
  }, [allSkills]);

  // --- Table Columns
  const baseCellSx = {
    minHeight: 56,
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 500,
    fontSize: 15,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  };

  const columns = [
    {
      field: "name",
      headerName: "Name",
      minWidth: 170,
      flex: 1,
      headerAlign: "center",
      align: "center",
      sortable: true,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" spacing={1} sx={baseCellSx}>
          {params.row.photo && (
            <Box
              sx={{
                borderRadius: 1,
                overflow: "hidden",
                minWidth: 36,
                minHeight: 36,
                bgcolor: "grey.100",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 1,
              }}
            >
              <img
                src={getPhotoUrl(params.row.photo)}
                alt={params.value}
                width={36}
                height={36}
                style={{ objectFit: "cover" }}
                loading="lazy"
              />
            </Box>
          )}
          <Typography
            sx={{ fontWeight: 700, fontSize: 16, maxWidth: 120 }}
            noWrap
          >
            {params.value}
          </Typography>
        </Stack>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 160,
      flex: 1,
      headerAlign: "center",
      align: "center",
      sortable: true,
      renderCell: (params) => (
        <Stack
          direction="row"
          spacing={0.5}
          alignItems="center"
          sx={baseCellSx}
        >
          <Typography sx={{ fontSize: 15 }} noWrap>
            {params.value}
          </Typography>
          <Tooltip title="Copy Email">
            <IconButton
              size="small"
              sx={{ ml: 0.3 }}
              aria-label="Copy email"
              onClick={() => {
                navigator.clipboard.writeText(params.value);
                toast.success("Email copied!", {
                  autoClose: 900,
                  theme: "colored",
                });
              }}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
    {
      field: "phone",
      headerName: "Phone",
      minWidth: 130,
      flex: 1,
      headerAlign: "center",
      align: "center",
      sortable: true,
      renderCell: (params) => (
        <Stack
          direction="row"
          spacing={0.5}
          alignItems="center"
          sx={baseCellSx}
        >
          <Typography sx={{ fontSize: 15 }}>{params.value}</Typography>
          <Tooltip title="Copy Phone">
            <IconButton
              size="small"
              sx={{ ml: 0.3 }}
              aria-label="Copy phone"
              onClick={() => {
                navigator.clipboard.writeText(params.value);
                toast.success("Phone copied!", {
                  autoClose: 900,
                  theme: "colored",
                });
              }}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
    {
      field: "skillSet",
      headerName: "Skills",
      minWidth: 210,
      flex: 1.4,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: ({ value }) =>
        value && value.length ? (
          <Stack
            direction="row"
            spacing={0.5}
            alignItems="center"
            sx={{
              ...baseCellSx,
              justifyContent: "flex-start",
              overflowX: "auto",
              maxWidth: 240,
              pr: 1,
              "&::-webkit-scrollbar": { height: 4, borderRadius: 2 },
              "&::-webkit-scrollbar-thumb": { bgcolor: "grey.200" },
            }}
          >
            {value.map((sk) => (
              <Chip
                key={sk}
                label={skillMap[sk] || sk}
                size="small"
                sx={{
                  px: 1.2,
                  fontWeight: 600,
                  fontSize: 13,
                  borderRadius: 1,
                  bgcolor: "primary.light",
                  color: "primary.dark",
                  border: 0,
                  boxShadow: "none",
                  whiteSpace: "nowrap",
                  m: "1px 0 ",
                }}
              />
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={baseCellSx}>
            None
          </Typography>
        ),
    },
    {
      field: "experience",
      headerName: "Exp (yr)",
      minWidth: 60,
      width: 80,
      headerAlign: "center",
      align: "center",
      sortable: true,
      renderCell: (params) => (
        <Typography sx={{ ...baseCellSx, fontWeight: 500 }}>
          {params.value || 0}
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: ({ value }) => {
        // Map status value to MUI color
        const statusColor =
          value === "active"
            ? "success"
            : value === "pending"
            ? "warning"
            : value === "suspended"
            ? "error"
            : "default";
        return (
          <Chip
            label={value ? value.toUpperCase() : ""}
            color={statusColor}
            size="small"
            sx={{
              borderRadius: 1, // your desired roundness
              fontWeight: 600,
              fontSize: 13,
              px: 1.3,
              letterSpacing: 0.8,
              minWidth: 68,
              textAlign: "center",
            }}
          />
        );
      },
    },

    {
      field: "actions",
      headerName: "Actions",
      minWidth: 200,
      width: 210,
      headerAlign: "center",
      align: "center",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} justifyContent="center">
          <Tooltip title="View Profile">
            <IconButton
              size="small"
              onClick={() => handleView(params.row.id)}
              aria-label="View"
              sx={{ bgcolor: "grey.50", borderRadius: 1 }}
            >
              <ViewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Mechanic">
            <IconButton
              size="small"
              onClick={() => handleEdit(params.row.id)}
              aria-label="Edit"
              sx={{ bgcolor: "grey.50", borderRadius: 1 }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reset Password">
            <IconButton
              size="small"
              color="warning"
              onClick={() => handleResetPwd(params.row.id)}
              disabled={resetLoading}
              aria-label="Reset Password"
              sx={{ bgcolor: "warning.lighter", borderRadius: 1 }}
            >
              <LockResetIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Mechanic">
            <span>
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDelete(params.row.id)}
                aria-label="Delete"
                disabled={!!deleteLoading}
                sx={{ bgcolor: "error.lighter", borderRadius: 1 }}
              >
                {deleteLoading === params.row.id ? (
                  <CircularProgress size={18} />
                ) : (
                  <DeleteIcon fontSize="small" />
                )}
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  // --- Table Action Handlers
  const handleView = (id) => {
    dispatch(fetchMechanicById(id)).then(() => setOpenProfile(true));
  };
  const handleEdit = (id) => {
    dispatch(fetchMechanicById(id)).then(() => {
      setEditData(id);
      setOpenForm(true);
    });
  };
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this mechanic?")) {
      setDeleteLoading(id);
      dispatch(deleteMechanic(id)).then((res) => {
        setDeleteLoading("");
        if (!res.error) toast.success("Mechanic deleted");
        else toast.error(res.error?.message || "Failed to delete mechanic");
      });
    }
  };
  const handleResetPwd = (id) => {
    setEditData(id);
    setResetDialog(true);
  };
  const confirmResetPwd = () => {
    setResetLoading(true);
    dispatch(resetMechanicPassword(editData)).then((res) => {
      setResetLoading(false);
      if (!res.error) toast.success("Password reset!");
      else toast.error(res.error?.message || "Failed");
    });
  };

  // --- Dialog Handlers
  const closeProfile = () => {
    setOpenProfile(false);
    dispatch(clearSelected());
  };
  const closeForm = () => {
    setOpenForm(false);
    setEditData(null);
    dispatch(clearSelected());
  };
  const closeResetDialog = () => {
    setResetDialog(false);
    setEditData(null);
    dispatch(clearResetResult());
  };

  // --- No Rows & Toolbar
  function CustomNoRowsOverlay() {
    return (
      <Stack
        height="100%"
        alignItems="center"
        justifyContent="center"
        spacing={2}
        sx={{ color: "text.secondary" }}
      >
        <BuildCircleOutlined fontSize="large" color="disabled" />
        <Typography fontWeight={600}>No mechanics yet.</Typography>
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={() => setOpenForm(true)}
          sx={{
            mt: 2,
            fontWeight: 600,
            borderRadius: 1,
            minWidth: 170,
          }}
        >
          Add Mechanic
        </Button>
      </Stack>
    );
  }

  function CustomToolbar() {
    return (
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems="flex-start"
        justifyContent="space-between"
        spacing={2}
        sx={{ p: 1, pb: 2 }}
      >
        <TextField
          placeholder="Search mechanic name/email/phone"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            minWidth: 210,
            maxWidth: 320,
            background: "#fafbfc",
            borderRadius: 1,
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            spellCheck: false,
          }}
        />
        <Button
          startIcon={<PersonAdd />}
          variant="contained"
          onClick={() => setOpenForm(true)}
          sx={{
            fontWeight: 600,
            borderRadius: 1,
            minWidth: 140,
          }}
        >
          Add Mechanic
        </Button>
      </Stack>
    );
  }

  // ----------- Render -----------
  return (
    <Box
      sx={{
        // p: isMobile ? 1 : 3,
        bgcolor: "background.default",
        minHeight: "100vh",
        width: "100%",
        overflowX: "hidden",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: "100%",
          minWidth: "0",
          height: isMobile ? 400 : 540,
          background: "#fff",
          borderRadius: 0.07,
          boxShadow: "0 2px 18px 0 rgba(36,50,85,0.07)",
          p: 1.5,
        }}
      >
        <DataGrid
          rows={list}
          columns={columns}
          rowCount={total}
          page={page}
          pageSize={limit}
          sortingMode="server"
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          paginationMode="server"
          onPageChange={setPage}
          onPageSizeChange={setLimit}
          loading={loading}
          getRowId={(row) => row.id}
          slots={{
            toolbar: CustomToolbar,
            noRowsOverlay: CustomNoRowsOverlay,
          }}
          sx={{
            border: "none",
            fontSize: 15,
            "& .MuiDataGrid-row": {
              minHeight: 58,
              maxHeight: 58,
              alignItems: "center",
              background: "#fff",
              px: 1,
              borderRadius: 0,
              boxShadow: "none",
            },
            "& .MuiDataGrid-cell": {
              alignItems: "center",
              justifyContent: "center",
              p: 0,
              fontWeight: 500,
              background: "#fff",
            },
            "& .MuiDataGrid-columnHeaders": {
              bgcolor: "#fafbfc",
              fontWeight: 900,
              fontSize: 16,
              letterSpacing: 0.5,
              borderRadius: 1.5,
              lineHeight: 1.2,
            },
            "& .MuiDataGrid-virtualScroller": {
              overflowX: "auto",
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              bgcolor: "#fafbfc",
              borderRadius: 0.3,
            },
          }}
          disableRowSelectionOnClick
        />
      </Paper>
      <MechanicProfileDialog
        open={openProfile}
        onClose={closeProfile}
        mechanic={selected}
        skillMap={skillMap}
      />
      <MechanicFormDialog
        open={openForm}
        onClose={closeForm}
        mechanicId={editData}
        skillMap={skillMap}
      />
      <Dialog open={resetDialog} onClose={closeResetDialog}>
        <DialogTitle sx={{ fontWeight: 700 }}>
          Reset Mechanic Password?
        </DialogTitle>
        <DialogContent>
          {resetPasswordResult?.tempPassword ? (
            <Stack>
              <Typography fontWeight={500}>
                Temporary password (share with mechanic):
              </Typography>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{
                  bgcolor: "#f5f6fa",
                  borderRadius: 1.3,
                  p: 1,
                  my: 1.3,
                  border: "1.5px dashed #c4c9d6",
                }}
              >
                <Typography
                  fontWeight={800}
                  sx={{
                    fontFamily: "monospace",
                    fontSize: 20,
                    userSelect: "all",
                  }}
                >
                  {resetPasswordResult.tempPassword}
                </Typography>
                <Tooltip title="Copy to clipboard">
                  <IconButton
                    size="small"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        resetPasswordResult.tempPassword
                      );
                      toast.success("Password copied!", {
                        autoClose: 1200,
                        theme: "colored",
                      });
                    }}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
              <Typography color="success.main" fontWeight={600}>
                Mechanic must reset this password after login.
              </Typography>
            </Stack>
          ) : resetLoading ? (
            <Stack direction="row" alignItems="center" spacing={1}>
              <CircularProgress size={20} />{" "}
              <Typography fontWeight={500}>Resetting…</Typography>
            </Stack>
          ) : (
            <Typography fontWeight={500}>
              Are you sure you want to reset this mechanic's password?
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          {resetPasswordResult?.tempPassword ? (
            <Button onClick={closeResetDialog}>Close</Button>
          ) : (
            <>
              <Button onClick={closeResetDialog}>Cancel</Button>
              <Button
                onClick={confirmResetPwd}
                variant="contained"
                color="primary"
                disabled={resetLoading}
                sx={{ minWidth: 120, fontWeight: 700 }}
              >
                Confirm
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
