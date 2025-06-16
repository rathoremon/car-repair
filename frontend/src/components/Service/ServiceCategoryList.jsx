import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  IconButton,
  Tooltip,
  Chip,
  Stack,
  useTheme,
  Skeleton,
  Box,
  Pagination,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import {
  Delete,
  Edit,
  Bolt,
  ArrowDownward,
  ArrowUpward,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteServiceCategory,
  fetchServiceCategories,
} from "../../features/serviceCategory/serviceCategoryThunks";
import {
  setSelectedCategory,
  setPage,
  setSortDir,
  setSortOrder,
} from "../../features/serviceCategory/serviceCategorySlice";
import { toast } from "react-toastify";

const HEADER_BG = "#e3eafc";
const ROW_ALT_BG = "#f7fafd";
const NEW_DOT_COLOR = "#1976d2";

const ServiceCategoryList = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [expandedRow, setExpandedRow] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);

  const {
    categories = [],
    loading,
    searchTerm,
    filterStatus,
    filterEmergency,
    sortOrder,
    sortDir,
    page,
    limit,
    meta: { total = 0, pages = 1 } = {},
  } = useSelector((state) => state.serviceCategory);

  useEffect(() => {
    dispatch(
      fetchServiceCategories({
        search: searchTerm,
        status: filterStatus !== "all" ? filterStatus : "",
        emergency:
          filterEmergency === "true"
            ? "true"
            : filterEmergency === "false"
            ? "false"
            : "",
        sortBy: sortOrder,
        sortDir,
        page,
        limit,
      })
    );
  }, [
    dispatch,
    searchTerm,
    filterStatus,
    filterEmergency,
    sortOrder,
    sortDir,
    page,
    limit,
  ]);

  const openDeleteDialog = (id) => {
    setSelectedDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteServiceCategory(selectedDeleteId));
      dispatch(fetchServiceCategories({ search: searchTerm, page, limit }));
      toast.success("Category deleted");
    } catch {
      toast.error("Failed to delete category");
    } finally {
      setDeleteDialogOpen(false);
      setSelectedDeleteId(null);
    }
  };

  const toggleSort = (field) => {
    if (sortOrder === field) {
      dispatch(setSortDir(sortDir === "asc" ? "desc" : "asc"));
    } else {
      dispatch(setSortOrder(field));
      dispatch(setSortDir("asc"));
    }
    dispatch(setPage(1));
  };

  const fromIndex = (page - 1) * limit + 1;
  const toIndex = Math.min(fromIndex + categories.length - 1, total);

  return (
    <Paper
      elevation={2}
      sx={{ mt: 3, mx: "auto", width: "100%", maxWidth: 1200, borderRadius: 2 }}
    >
      <Typography
        variant="h6"
        fontWeight={700}
        sx={{ p: 4, pb: 2, color: theme.palette.primary.main }}
      >
        Service Categories
      </Typography>

      <TableContainer sx={{ maxHeight: 520, overflowX: "auto" }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: HEADER_BG }}>
              <TableCell align="center">#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="center">New</TableCell>
              <TableCell>Description</TableCell>
              <TableCell
                align="center"
                onClick={() => toggleSort("defaultDuration")}
                sx={{ cursor: "pointer" }}
              >
                Duration
                {sortOrder === "defaultDuration" &&
                  (sortDir === "asc" ? (
                    <ArrowUpward fontSize="inherit" />
                  ) : (
                    <ArrowDownward fontSize="inherit" />
                  ))}
              </TableCell>
              <TableCell align="center">Emergency</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              [...Array(6)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={8}>
                    <Skeleton variant="rectangular" height={22} />
                  </TableCell>
                </TableRow>
              ))
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No service categories found.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((cat, i) => (
                <React.Fragment key={cat.id}>
                  <TableRow
                    hover
                    sx={{
                      bgcolor: i % 2 === 0 ? ROW_ALT_BG : "background.paper",
                      "& td": { fontSize: 13 },
                    }}
                  >
                    <TableCell align="center">{fromIndex + i}</TableCell>
                    <TableCell>
                      <Typography fontWeight={600} fontSize={13.5} noWrap>
                        {cat.name}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {cat.createdAt &&
                      new Date(cat.createdAt) >
                        new Date(Date.now() - 24 * 60 * 60 * 1000) ? (
                        <Box
                          component="span"
                          sx={{
                            display: "inline-block",
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: NEW_DOT_COLOR,
                          }}
                        />
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Typography
                          noWrap
                          sx={{
                            maxWidth: 450,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {cat.description}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() =>
                            setExpandedRow(
                              expandedRow === cat.id ? null : cat.id
                            )
                          }
                        >
                          {expandedRow === cat.id ? (
                            <ExpandLess fontSize="small" />
                          ) : (
                            <ExpandMore fontSize="small" />
                          )}
                        </IconButton>
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={`${cat.defaultDuration} min`}
                        size="small"
                        color="primary"
                      />
                    </TableCell>
                    <TableCell align="center">
                      {cat.isEmergencyService ? (
                        <Tooltip title="Emergency Service">
                          <Bolt sx={{ color: "#f44336", fontSize: 20 }} />
                        </Tooltip>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={cat.status === "active" ? "Active" : "Inactive"}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: 12,
                          bgcolor:
                            cat.status === "active" ? "#e6f4ea" : "#f5f5f5",
                          color:
                            cat.status === "active"
                              ? "#388e3c"
                              : "text.secondary",
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="center"
                      >
                        <Tooltip title="Edit">
                          <IconButton
                            color="primary"
                            onClick={() => dispatch(setSelectedCategory(cat))}
                            size="small"
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            color="error"
                            onClick={() => openDeleteDialog(cat.id)}
                            size="small"
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={8}
                    >
                      <Collapse
                        in={expandedRow === cat.id}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box sx={{ margin: 1, ml: 4 }}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            fontWeight={600}
                          >
                            Notes:
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.primary"
                            sx={{ maxWidth: 800 }}
                          >
                            {cat.notes || "—"}
                          </Typography>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        mt={3}
        px={2}
        pb={2}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
      >
        <Typography variant="body2" color="text.secondary">
          Showing {fromIndex}–{toIndex} of {total}
        </Typography>
        <Pagination
          page={page}
          count={pages}
          shape="rounded"
          color="primary"
          size="medium"
          onChange={(_, value) => dispatch(setPage(value))}
        />
      </Box>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this service category? This action
            cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ServiceCategoryList;
