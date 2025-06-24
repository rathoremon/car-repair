import React, { useState, useMemo } from "react";
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  MenuItem,
  IconButton,
  Typography,
  Chip,
  Tooltip,
  TableContainer,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Stack,
  Skeleton,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { deletePromotion } from "../../../features/promotion/promotionThunks";
import BannerPreview from "./BannerPreview";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import SearchIcon from "@mui/icons-material/Search";
import TableSortLabel from "@mui/material/TableSortLabel";

const columns = [
  { id: "preview", label: "Preview", minWidth: 120, sortable: false },
  { id: "title", label: "Title", minWidth: 150, sortable: false },
  { id: "status", label: "Status", minWidth: 100, sortable: true },
  { id: "startDate", label: "Start", minWidth: 110, sortable: true },
  { id: "endDate", label: "End", minWidth: 110, sortable: true },
  { id: "actions", label: "Actions", minWidth: 120, sortable: false },
];

const PromotionList = ({ type, onEdit }) => {
  const dispatch = useDispatch();
  const { banners, loading } = useSelector((state) => state.promotion);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Delete flow
  const handleDelete = (id) => setConfirmDelete(id);
  const confirmDeleteAction = async () => {
    try {
      await dispatch(deletePromotion(confirmDelete)).unwrap();
      toast.success("Banner deleted!");
    } catch (err) {
      toast.error(err);
    }
    setConfirmDelete(null);
  };

  // Filtering
  const filtered = useMemo(() => {
    return banners
      ?.filter((b) => b.type === type)
      ?.filter(
        (b) =>
          b.title?.toLowerCase().includes(search.toLowerCase()) ||
          b.description?.toLowerCase().includes(search.toLowerCase()) ||
          b.status?.toLowerCase().includes(search.toLowerCase())
      );
  }, [banners, type, search]);

  // Sorting
  const sorted = useMemo(() => {
    if (!filtered) return [];
    return [...filtered].sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      // Handle date sort
      if (["startDate", "endDate", "createdAt"].includes(sortBy)) {
        aVal = aVal ? new Date(aVal).getTime() : 0;
        bVal = bVal ? new Date(bVal).getTime() : 0;
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }
      // Handle string sort
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      // fallback
      return 0;
    });
  }, [filtered, sortBy, sortOrder]);

  // Paging
  const paged = useMemo(
    () => sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [sorted, page, rowsPerPage]
  );

  // Table events
  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  if (loading)
    return (
      <Box>
        {[...Array(3)].map((_, i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            height={68}
            sx={{ my: 1, borderRadius: 2 }}
          />
        ))}
      </Box>
    );

  if (!filtered?.length)
    return (
      <Box p={4} textAlign="center" sx={{ opacity: 0.7 }}>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          No {type} banners found. Click &quot;Add New Banner&quot; to create
          one!
        </Typography>
      </Box>
    );

  return (
    <>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems="center"
        spacing={2}
        mb={2}
      >
        <Box flex={1}>
          <TextField
            size="small"
            placeholder="Search by title, description, or status"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1 }} fontSize="small" />,
            }}
            fullWidth
          />
        </Box>
        {/* Sorting Dropdown */}
        <TextField
          select
          label="Sort By"
          size="small"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="createdAt">Newest</MenuItem>
          <MenuItem value="startDate">Start Date</MenuItem>
          <MenuItem value="endDate">End Date</MenuItem>
          <MenuItem value="status">Status</MenuItem>
        </TextField>
        <Button
          size="small"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          sx={{ minWidth: 80 }}
          variant="outlined"
        >
          {sortOrder === "asc" ? "Asc" : "Desc"}
        </Button>
      </Stack>
      <TableContainer sx={{ borderRadius: 2, overflowX: "auto" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.id}
                  sortDirection={sortBy === col.id ? sortOrder : false}
                >
                  {col.sortable ? (
                    <TableSortLabel
                      active={sortBy === col.id}
                      direction={sortBy === col.id ? sortOrder : "asc"}
                      onClick={() => {
                        if (sortBy === col.id) {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        } else {
                          setSortBy(col.id);
                          setSortOrder("asc");
                        }
                      }}
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
            {paged.map((banner) => (
              <TableRow hover key={banner.id}>
                <TableCell>
                  <BannerPreview banner={banner} />
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {banner.title || "-"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={banner.status}
                    color={banner.status === "active" ? "success" : "default"}
                    size="small"
                    variant="outlined"
                    sx={{ fontWeight: 600, textTransform: "capitalize" }}
                  />
                </TableCell>
                <TableCell>
                  {dayjs(banner.startDate).format("DD MMM YYYY")}
                </TableCell>
                <TableCell>
                  {dayjs(banner.endDate).format("DD MMM YYYY")}
                </TableCell>
                <TableCell>
                  <Stack direction="row" gap={1}>
                    <Tooltip title="Edit">
                      <span>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => onEdit(banner)}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <span>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(banner.id)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={sorted.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ mt: 2 }}
      />

      {/* Confirm Delete Dialog */}
      <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
        <DialogTitle>Delete this banner?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(null)}>Cancel</Button>
          <Button
            onClick={confirmDeleteAction}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PromotionList;
