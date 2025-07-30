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
  FormControlLabel,
  Checkbox,
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
import ConfirmDialog from "../../common/ConfirmDialog"; // ✅ new import

import MechanicFormDialog from "./MechanicFormDialog";
import { toast } from "react-toastify";

function useDebounced(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

export default function MechanicList({
  onAddMechanic,
  onEditMechanic,
  onSelfRegister,
  onShowToast,
}) {
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
  const [sortModel, setSortModel] = useState([{ field: "name", sort: "asc" }]);
  const [openProfile, setOpenProfile] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [resetDialog, setResetDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [generateNew, setGenerateNew] = useState(false);
  const authUser = useSelector((s) => s.auth.user);
  const hasSelfMechanic = list.some((m) => m.userId === authUser?.id);

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    description: "",
    onConfirm: null,
  });

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
    minHeight: 60,
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "left",
    fontWeight: 500,
    fontSize: 15,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    m: 0,
  };

  const columns = [
    {
      field: "name",
      headerName: "Name",
      minWidth: 170,
      filterable: false,
      flex: 1,
      headerAlign: "left",
      align: "left",
      sortable: true,
      renderCell: (params) => {
        const isSelf = params.row.userId === authUser?.id;
        return (
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={baseCellSx}
          >
            {params.row.photo && (
              <Box
                sx={{
                  borderRadius: 0,
                  overflow: "hidden",
                  minWidth: 36,
                  minHeight: 36,
                  bgcolor: "grey.100",
                  display: "flex",
                  alignItems: "left",
                  justifyContent: "left",
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
            <Stack direction="row" alignItems="center" spacing={0.5}>
              {isSelf && (
                <Tooltip title="This is your registered mechanic profile">
                  <BuildCircleOutlined
                    fontSize="small"
                    sx={{
                      color: "secondary.main",
                      mt: "1px",
                    }}
                  />
                </Tooltip>
              )}
              <Typography
                sx={{ fontWeight: 700, fontSize: 16, maxWidth: 120 }}
                noWrap
              >
                {params.value}
              </Typography>
            </Stack>
          </Stack>
        );
      },
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 160,
      flex: 1,
      headerAlign: "left",
      filterable: false,
      align: "left",
      sortable: false,
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
                onShowToast("success", "Email copied!", {
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
      headerAlign: "left",
      filterable: false,
      align: "left",
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
                onShowToast("success", "Phone copied!", {
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
      headerAlign: "left",
      filterable: false,
      align: "left",
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
                  m: "0px 0 ",
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
      headerAlign: "left",
      filterable: false,
      align: "left",
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
      filterable: false,
      align: "left",
      headerAlign: "left",
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
      headerAlign: "left",
      align: "left",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Stack
          direction="row"
          spacing={1}
          justifyContent="left"
          alignItems="center"
        >
          <Tooltip title="View Profile">
            <IconButton
              size="small"
              onClick={() => handleView(params.row.id)}
              aria-label="View"
              sx={{
                borderRadius: 2,
                width: 36,
                height: 36,
                bgcolor: "primary.lighter",
                "&:hover": {
                  bgcolor: "primary.main",
                  color: "white",
                  transition: "background-color 0.8s ease-in-out",
                },
              }}
            >
              <ViewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Mechanic">
            <IconButton
              size="small"
              onClick={() => handleEdit(params.row.id)}
              aria-label="Edit"
              sx={{
                borderRadius: 2,
                width: 36,
                height: 36,
                bgcolor: "primary.lighter",
                "&:hover": {
                  bgcolor: "primary.main",
                  color: "white",
                  transition: "background-color 0.8s ease-in-out",
                },
              }}
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
              sx={{
                borderRadius: 2,
                width: 36,
                height: 36,
                bgcolor: "warning.lighter",
                "&:hover": {
                  bgcolor: "warning.main",
                  color: "white",
                  transition: "background-color 0.8s ease-in-out",
                },
              }}
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
                sx={{
                  bgcolor: "error.lighter",
                  borderRadius: 2,
                  width: 36,
                  height: 36,
                  "&:hover": {
                    bgcolor: "error.main",
                    color: "white",
                    transition: "background-color 0.8s ease-in-out",
                  },
                }}
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
    setConfirmDialog({
      open: true,
      title: "Delete Mechanic",
      description: "Are you sure you want to delete this mechanic?",
      onConfirm: () => {
        setDeleteLoading(id);
        dispatch(deleteMechanic(id)).then((res) => {
          setDeleteLoading("");
          setConfirmDialog({ ...confirmDialog, open: false });

          if (!res.error) {
            onShowToast("success", "Mechanic deleted");
            dispatch(
              fetchMechanics({
                search: debouncedSearch,
                page: page + 1,
                limit,
                sortBy: sortModel[0]?.field || "createdAt",
                sortOrder: sortModel[0]?.sort || "desc",
              })
            );
          } else {
            onShowToast(
              "error",
              res.error?.message || "Failed to delete mechanic"
            );
          }
        });
      },
    });
  };

  const handleResetPwd = (id) => {
    setEditData(id);
    setGenerateNew(false); // Default to not generating new password
    setResetDialog(true);
  };

  const confirmResetPwd = () => {
    setResetLoading(true);
    dispatch(resetMechanicPassword({ id: editData, generateNew })).then(
      (res) => {
        setResetLoading(false);

        if (!res.error) {
          onShowToast("success", "Password reset!");

          dispatch(
            fetchMechanics({
              search: debouncedSearch,
              page: page + 1,
              limit,
              sortBy: sortModel[0]?.field || "createdAt",
              sortOrder: sortModel[0]?.sort || "desc",
            })
          );
        } else {
          onShowToast(
            "error",
            res.error?.message || "Failed to reset password"
          );
        }
      }
    );
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
    setGenerateNew(false);
    dispatch(clearResetResult());
  };

  const isSelfMechanic = useMemo(
    () =>
      editData && list.find((m) => m.id === editData)?.userId === authUser?.id,
    [editData, list, authUser?.id]
  );

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

  const ToolbarWrapper = useCallback(() => {
    return (
      <CustomToolbar
        search={search}
        setSearch={setSearch}
        showRegister={authUser?.role === "provider" && !hasSelfMechanic}
        onRegisterClick={() => {
          setEditData("self");
          setOpenForm(true);
        }}
        onAddClick={() => setOpenForm(true)}
      />
    );
  }, [search, authUser?.role, hasSelfMechanic]);

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
        }}
        padding={{ xs: 1, sm: 0.5 }}
      >
        <Paper
          elevation={0}
          width={{ xs: "100%", sm: 1350 }}
          sx={{
            maxWidth: "100%",
            minWidth: "0",
            height: isMobile ? 400 : 540,
            borderRadius: 1,
            boxShadow: "0 2px 18px 0 rgba(36,50,85,0.07)",
          }}
        >
          <CustomToolbar
            search={search}
            setSearch={setSearch}
            showRegister={authUser?.role === "provider" && !hasSelfMechanic}
            onRegisterClick={() => {
              setEditData("self");
              setOpenForm(true);
            }}
            onAddClick={() => setOpenForm(true)}
          />

          <DataGrid
            rows={list}
            columns={columns}
            rowCount={total}
            page={page}
            pageSize={limit}
            sortingMode="server"
            pageSizeOptions={[10, 20, 30]}
            getRowClassName={(params) =>
              params.row.userId === authUser?.id ? "self-mechanic-row" : ""
            }
            sortModel={sortModel}
            onSortModelChange={(model) => {
              const allowed = ["name", "experience", "status"];
              const filtered = model.filter((m) => allowed.includes(m.field));
              setSortModel(filtered);
            }}
            paginationMode="server"
            onPageChange={setPage}
            onPageSizeChange={setLimit}
            loading={loading}
            getRowId={(row) => row.id}
            slots={{
              noRowsOverlay: CustomNoRowsOverlay,
            }}
            sx={{
              fontSize: 15,
              "& .MuiDataGrid-row": {
                minHeight: 58,
                maxHeight: 58,
                alignItems: "center",
                px: 1,
                borderRadius: 0,
                backgroundColor: "background.default",
                boxShadow: "none",
                pb: 1,
                "&:hover": {
                  backgroundColor: "primary.lighter",
                },
              },
              "& .MuiDataGrid-cell": {
                alignItems: "center",
                justifyContent: "center",
                px: 1,
                fontWeight: 500,
              },
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "#fff",
                borderRadius: 0,
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#fff",
                fontWeight: 900,
                fontSize: 16,
                letterSpacing: 0.5,
                lineHeight: 1.2,
                borderRadius: 1,
                pl: 1,
              },
              "& .self-mechanic-row": {
                backgroundColor: "rgba(197, 230, 255, 0.7)", // soft blue highlight
              },
              "& .MuiDataGrid-virtualScroller": {
                overflowX: "auto",
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "none",
                bgcolor: "#fafbfc",
                borderRadius: 1,
              },
            }}
            disableRowSelectionOnClick
            disableColumnFilter
            disableColumnMenu
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
          onSuccess={() => {
            onShowToast(
              "success",
              editData === "self"
                ? "Successfully registered as a mechanic!"
                : editData
                ? "Mechanic updated successfully!"
                : "Mechanic added successfully!"
            );
            dispatch(
              fetchMechanics({
                search: debouncedSearch,
                page: page + 1,
                limit,
                sortBy: sortModel[0]?.field || "createdAt",
                sortOrder: sortModel[0]?.sort || "desc",
              })
            );
          }}
        />

        <Dialog open={resetDialog} onClose={closeResetDialog}>
          <DialogTitle>Reset Mechanic Password</DialogTitle>
          <DialogContent>
            {resetLoading ? (
              <Stack direction="row" spacing={2} alignItems="center">
                <CircularProgress size={20} />
                <Typography>Resetting...</Typography>
              </Stack>
            ) : resetPasswordResult?.tempPassword ? (
              <Stack spacing={2}>
                {resetPasswordResult.tempPassword ===
                "Same as your provider login password" ? (
                  <Typography
                    fontStyle="italic"
                    fontWeight={500}
                    color="text.secondary"
                  >
                    This profile uses your provider login password.
                  </Typography>
                ) : (
                  <>
                    <Typography fontWeight={500}>
                      Temporary password for this mechanic:
                    </Typography>
                    <Box
                      sx={{
                        bgcolor: "#f4f6f8",
                        px: 2,
                        py: 1,
                        borderRadius: 1,
                        border: "1px dashed #c4c9d6",
                        fontFamily: "monospace",
                        fontSize: 18,
                        fontWeight: 700,
                        userSelect: "all",
                        width: "fit-content",
                      }}
                    >
                      {resetPasswordResult.tempPassword}
                    </Box>
                  </>
                )}

                <Typography variant="body2" color="text.secondary">
                  {isSelfMechanic
                    ? ""
                    : "You can regenerate a new password if needed."}
                </Typography>

                <Button
                  variant="outlined"
                  color={isSelfMechanic ? "secondary" : "primary"}
                  onClick={() => {
                    setGenerateNew(true);
                    confirmResetPwd();
                  }}
                  sx={{
                    fontWeight: 600,
                    alignSelf: "flex-start",
                    display: isSelfMechanic ? "none" : "flex",
                  }}
                >
                  {isSelfMechanic ? "" : "Generate New Password"}
                </Button>
              </Stack>
            ) : (
              <Stack spacing={2}>
                <Typography>
                  {isSelfMechanic
                    ? "This mechanic is your own profile. The password defaults to your provider login."
                    : "Fetching current mechanic password..."}
                </Typography>
                <Button
                  onClick={confirmResetPwd}
                  variant="contained"
                  sx={{ fontWeight: 600, alignSelf: "flex-start" }}
                >
                  Show Current Password
                </Button>
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={closeResetDialog}>Close</Button>
          </DialogActions>
        </Dialog>

        <ConfirmDialog
          open={confirmDialog.open}
          title={confirmDialog.title}
          description={confirmDialog.description}
          onConfirm={confirmDialog.onConfirm}
          onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
        />
      </Box>
    </>
  );
}

function CustomToolbar({
  search,
  setSearch,
  showRegister,
  onRegisterClick,
  onAddClick,
}) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      alignItems="flex-start"
      justifyContent="space-between"
      spacing={2}
      sx={{ p: 1.2 }}
    >
      <TextField
        placeholder="Search mechanic name/email/phone"
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
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

      <Stack direction="row" spacing={1}>
        <Button
          startIcon={<PersonAdd />}
          variant="contained"
          onClick={onAddClick}
          sx={{
            fontWeight: 600,
            borderRadius: 1,
            minWidth: 140,
          }}
        >
          Add Mechanic
        </Button>

        {showRegister && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={onRegisterClick}
            sx={{
              fontWeight: 600,
              borderRadius: 1,
              minWidth: 200,
              borderColor: "secondary.main",
            }}
          >
            Register as Mechanic
          </Button>
        )}
      </Stack>
    </Stack>
  );
}
