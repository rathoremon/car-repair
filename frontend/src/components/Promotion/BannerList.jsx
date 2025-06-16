// src/components/Promotion/BannerList.jsx

import React, { useState } from "react";
import {
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import BannerCard from "./BannerCard";

const BannerList = () => {
  const { promotions = [], loading } = useSelector(
    (state) => state.promotion || {}
  );
  const [typeFilter, setTypeFilter] = useState("");

  const filtered = Array.isArray(promotions)
    ? typeFilter
      ? promotions.filter((b) => b.type === typeFilter)
      : promotions
    : [];

  return (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography variant="h6" fontWeight="bold">
          All Banners ({filtered?.length || 0})
        </Typography>

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Type</InputLabel>
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            label="Filter by Type"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="promotional">Promotional</MenuItem>
            <MenuItem value="advertisement">Advertisement</MenuItem>
            <MenuItem value="car_accessory">Car Accessory</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Typography>Loading banners...</Typography>
      ) : filtered.length === 0 ? (
        <Typography>No banners found.</Typography>
      ) : (
        <Grid container spacing={2}>
          {filtered.map((banner) => (
            <Grid item xs={12} md={6} key={banner.id}>
              <BannerCard banner={banner} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default BannerList;
