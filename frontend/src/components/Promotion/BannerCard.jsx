// src/components/Promotion/BannerCard.jsx

import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Switch,
  Tooltip,
} from "@mui/material";
import { Delete, Edit, OpenInNew } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import {
  deletePromotion,
  togglePromotionStatus,
} from "../../features/promotion/promotionThunks";
import { setSelectedPromotion } from "../../features/promotion/promotionSlice";

const BannerCard = ({ banner }) => {
  const dispatch = useDispatch();

  const handleEdit = () => dispatch(setSelectedPromotion(banner));
  const handleDelete = () => dispatch(deletePromotion(banner.id));
  const handleToggle = () => dispatch(togglePromotionStatus(banner.id));

  return (
    <Card sx={{ display: "flex", mb: 2, position: "relative", boxShadow: 3 }}>
      <CardMedia
        component="img"
        sx={{ width: 180, objectFit: "cover" }}
        image={banner.imageUrl}
        alt={banner.title || "Banner"}
      />
      <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <CardContent>
          <Typography variant="h6">
            {banner.title || "Untitled Banner"}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {banner.description}
          </Typography>
          <Typography variant="caption" display="block">
            Type: {banner.type} | Placement: {banner.placement}
          </Typography>
          <Typography variant="caption" display="block">
            Priority: {banner.priority} | Status:{" "}
            {banner.isActive ? "🟢 Active" : "🔴 Inactive"}
          </Typography>
        </CardContent>
        <CardActions>
          <Tooltip title="Edit">
            <IconButton onClick={handleEdit}>
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={handleDelete}>
              <Delete />
            </IconButton>
          </Tooltip>
          <Tooltip title="Preview CTA Link">
            <IconButton
              component="a"
              href={banner.ctaLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <OpenInNew />
            </IconButton>
          </Tooltip>
          <Tooltip title="Toggle Active">
            <Switch
              checked={banner.isActive}
              onChange={handleToggle}
              color="primary"
            />
          </Tooltip>
        </CardActions>
      </Box>
    </Card>
  );
};

export default BannerCard;
