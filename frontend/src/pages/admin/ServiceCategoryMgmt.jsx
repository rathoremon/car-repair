import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Tooltip,
  Divider,
  Paper,
  CircularProgress,
} from "@mui/material";
import { Refresh, CloudDownload } from "@mui/icons-material";
import { fetchAdminServiceCategories } from "../../features/serviceCategory/serviceCategoryThunks";
import ServiceCategorySearchBar from "../../components/Service/ServiceCategorySearchBar";
import ServiceCategoryForm from "../../components/Service/ServiceCategoryForm";
import ServiceCategoryList from "../../components/Service/ServiceCategoryList";
import { toast } from "react-toastify";

const ServiceCategoryMgmt = () => {
  const dispatch = useDispatch();
  const { searchTerm, filterStatus } = useSelector(
    (state) => state.serviceCategory
  );
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await dispatch(
        fetchAdminServiceCategories({
          search: searchTerm,
          status: filterStatus,
        })
      );
      toast.success("Refreshed successfully");
    } catch {
      toast.error("Failed to refresh");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    dispatch(
      fetchAdminServiceCategories({ search: searchTerm, status: filterStatus })
    );
  }, [dispatch, searchTerm, filterStatus]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        py: { xs: 2, md: 6 },
        px: { xs: 1, sm: 3, md: 8 },
        transition: "background 0.5s",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: 1100,
          mx: "auto",
          p: { xs: 2, md: 6 },
          borderRadius: 0.5,
          boxShadow: 4,
          bgcolor: "background.paper",
        }}
      >
        <Grid container alignItems="center" spacing={2} mb={2}>
          <Grid item xs>
            <Typography
              variant="h4"
              fontWeight={700}
              color="primary"
              gutterBottom
            >
              Service Category Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your platform's service categories efficiently.
            </Typography>
          </Grid>
          <Grid item>
            <Tooltip title="Refresh">
              <span>
                <IconButton
                  color="secondary"
                  size="large"
                  onClick={handleRefresh}
                  disabled={refreshing}
                >
                  {refreshing ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <Refresh />
                  )}
                </IconButton>
              </span>
            </Tooltip>
          </Grid>
        </Grid>

        <Divider sx={{ my: 6 }} />

        <ServiceCategoryForm />

        <ServiceCategorySearchBar />

        <ServiceCategoryList />
      </Paper>
    </Box>
  );
};

export default ServiceCategoryMgmt;
