import React, { useEffect, useState } from "react";
import {
  Box,
  Stack,
  TextField,
  MenuItem,
  IconButton,
  Tooltip,
  InputBase,
  useMediaQuery,
  useTheme,
  Paper,
  Grid,
} from "@mui/material";
import { Search, Clear, FilterAltOff, SwapVert } from "@mui/icons-material";
import { debounce } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import {
  setSearchTerm,
  setFilterStatus,
  setFilterEmergency,
  setSortOrder,
  setSortDir,
  setPage,
  setLimit,
} from "../../features/serviceCategory/serviceCategorySlice";

const ServiceCategorySearchBar = () => {
  const dispatch = useDispatch();
  const {
    searchTerm,
    filterStatus,
    filterEmergency,
    sortOrder,
    sortDir,
    page,
    limit,
  } = useSelector((state) => state.serviceCategory);

  const [search, setSearch] = useState(searchTerm || "");
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  const isSm = useMediaQuery(theme.breakpoints.only("sm"));
  const isMd = useMediaQuery(theme.breakpoints.only("md"));

  const debouncedSearch = debounce((term) => {
    dispatch(setSearchTerm(term));
    dispatch(setPage(1));
  }, 400);

  useEffect(() => {
    debouncedSearch(search);
    return () => debouncedSearch.cancel();
  }, [search]);

  const handleClearAll = () => {
    setSearch("");
    dispatch(setSearchTerm(""));
    dispatch(setFilterStatus("all"));
    dispatch(setFilterEmergency("all"));
    dispatch(setSortOrder("name"));
    dispatch(setSortDir("asc"));
    dispatch(setPage(1));
    dispatch(setLimit(20));
  };

  const toggleSortDirection = () => {
    dispatch(setSortDir(sortDir === "asc" ? "desc" : "asc"));
    dispatch(setPage(1));
  };

  return (
    <Paper
      elevation={4}
      sx={{
        mt: 3,
        mb: 4,
        p: { xs: 2, sm: 3 },
        borderRadius: 0.6,
        bgcolor: theme.palette.background.paper,
        border: `1.5px solid ${theme.palette.divider}`,
        boxShadow: "0 4px 24px rgba(25, 118, 210, 0.08)",
        backdropFilter: "blur(4px)",
      }}
    >
      {/* Search Input */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          borderRadius: 2,
          px: 2,
          py: 1.5,
          mb: 3,
          background: "linear-gradient(90deg, #e3f0ff 0%, #f8fafc 100%)",
          boxShadow:
            "0 2px 12px 0 rgba(25,118,210,0.08), 0 1.5px 8px 0 rgba(0,0,0,0.03)",
          border: "1.5px solid #e3e8ef",
          transition: "box-shadow 0.2s, background 0.2s",
        }}
      >
        <Search color="primary" />
        <InputBase
          fullWidth
          placeholder="Search service categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            ml: 1,
            fontWeight: 500,
            bgcolor: "transparent",
            color: "text.primary",
          }}
          inputProps={{ "aria-label": "search categories" }}
        />
        {search && (
          <IconButton onClick={() => setSearch("")} aria-label="clear search">
            <Clear />
          </IconButton>
        )}
      </Box>

      {/* Filters */}
      <Grid
        container
        spacing={2}
        alignItems="center"
        justifyContent="flex-start"
      >
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            select
            fullWidth
            size="small"
            label="Status"
            value={filterStatus}
            onChange={(e) => {
              dispatch(setFilterStatus(e.target.value));
              dispatch(setPage(1));
            }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            select
            fullWidth
            size="small"
            label="Emergency"
            value={filterEmergency}
            onChange={(e) => {
              dispatch(setFilterEmergency(e.target.value));
              dispatch(setPage(1));
            }}
            sx={{
              bgcolor: "#f8fafc",
              borderRadius: 1,
              boxShadow: "0 2px 8px 0 rgba(25,118,210,0.07)",
              fontWeight: 500,
              border: "1.5px solid #e3e8ef",
              "& .MuiInputBase-root": {
                fontWeight: 500,
                fontSize: 16,
                bgcolor: "transparent",
                borderRadius: 1,
              },
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="true">Emergency</MenuItem>
            <MenuItem value="false">Non-Emergency</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            select
            fullWidth
            size="small"
            label="Sort By"
            value={sortOrder}
            onChange={(e) => {
              dispatch(setSortOrder(e.target.value));
              dispatch(setPage(1));
            }}
            sx={{
              bgcolor: "#f8fafc",
              borderRadius: 1,
              boxShadow: "0 2px 8px 0 rgba(25,118,210,0.07)",
              fontWeight: 500,
              border: "1.5px solid #e3e8ef",
              "& .MuiInputBase-root": {
                fontWeight: 500,
                fontSize: 16,
                bgcolor: "transparent",
                borderRadius: 1,
              },
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            }}
          >
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="defaultDuration">Duration</MenuItem>
            <MenuItem value="createdAt">Created At</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={6} sm={3} md={1}>
          <Tooltip
            title={`Sort: ${sortDir === "asc" ? "Ascending" : "Descending"}`}
          >
            <IconButton
              onClick={toggleSortDirection}
              color="primary"
              sx={{
                bgcolor: "#e3f2fd",
                borderRadius: 2,
                height: 40,
                width: 40,
                boxShadow: "0 2px 8px 0 rgba(25,118,210,0.07)",
                border: "1.5px solid #e3e8ef",
                fontWeight: 500,
                "&:hover": { bgcolor: "#bbdefb" },
                transition: "background 0.2s, box-shadow 0.2s",
              }}
            >
              <SwapVert fontSize="small" />
            </IconButton>
          </Tooltip>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <TextField
            select
            fullWidth
            size="small"
            label="Page Size"
            value={limit}
            onChange={(e) => {
              dispatch(setLimit(Number(e.target.value)));
              dispatch(setPage(1));
            }}
            sx={{
              bgcolor: "#f8fafc",
              borderRadius: 1,
              boxShadow: "0 2px 8px 0 rgba(25,118,210,0.07)",
              fontWeight: 500,
              border: "1.5px solid #e3e8ef",
              "& .MuiInputBase-root": {
                fontWeight: 500,
                fontSize: 16,
                bgcolor: "transparent",
                borderRadius: 1,
              },
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            }}
          >
            {[10, 20, 50, 100].map((val) => (
              <MenuItem key={val} value={val}>
                {val} / page
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm="auto">
          <Tooltip title="Clear All Filters">
            <IconButton
              onClick={handleClearAll}
              color="error"
              sx={{
                borderRadius: 2,
                border: `1.5px solid ${theme.palette.divider}`,
                "&:hover": { bgcolor: "error.light" },
              }}
            >
              <FilterAltOff />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ServiceCategorySearchBar;
