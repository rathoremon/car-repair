// pages/admin/Promotion.jsx

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Stack,
  Button,
  Divider,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PromotionForm from "../../components/Promotion/PromotionForm";
import PromotionList from "../../components/Promotion/PromotionList";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPromotions } from "../../features/promotion/promotionThunks";

const Promotion = () => {
  const [tab, setTab] = useState("image");
  const [showForm, setShowForm] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllPromotions());
  }, [dispatch]);

  const handleChange = (event, newValue) => setTab(newValue);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Banner Management
      </Typography>

      <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
        <Tabs
          value={tab}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab value="image" label="Image Banners" />
          <Tab value="promotion" label="Promotional Banners" />
        </Tabs>

        <Divider sx={{ my: 2 }} />

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">
            All {tab === "image" ? "Image" : "Promotional"} Banners
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Close" : "Add New"}
          </Button>
        </Stack>

        {showForm && (
          <PromotionForm type={tab} onClose={() => setShowForm(false)} />
        )}

        <PromotionList type={tab} />
      </Paper>
    </Box>
  );
};

export default Promotion;
