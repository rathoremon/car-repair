import React from "react";
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Typography,
  Chip,
  Tooltip,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { Delete, Edit } from "@mui/icons-material";
import { deletePromotion } from "../../features/promotion/promotionThunks";
import BannerPreview from "./BannerPreview";
import dayjs from "dayjs";

const PromotionList = ({ type }) => {
  const dispatch = useDispatch();
  const { banners } = useSelector((state) => state.promotion);

  const filtered = banners?.filter((b) => b.type === type);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      dispatch(deletePromotion(id));
    }
  };

  if (!filtered?.length) {
    return (
      <Typography variant="body1" sx={{ mt: 2, color: "text.secondary" }}>
        No {type} banners available.
      </Typography>
    );
  }

  return (
    <Box sx={{ overflowX: "auto" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Preview</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Start</TableCell>
            <TableCell>End</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {filtered.map((banner) => (
            <TableRow key={banner.id}>
              <TableCell>
                <BannerPreview banner={banner} />
              </TableCell>
              <TableCell>{banner.title || "-"}</TableCell>
              <TableCell>
                <Chip
                  label={banner.status}
                  color={banner.status === "active" ? "success" : "default"}
                  size="small"
                />
              </TableCell>
              <TableCell>
                {dayjs(banner.startDate).format("DD MMM YYYY")}
              </TableCell>
              <TableCell>
                {dayjs(banner.endDate).format("DD MMM YYYY")}
              </TableCell>
              <TableCell>
                <Tooltip title="Edit (Not implemented)">
                  <IconButton disabled>
                    <Edit fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton onClick={() => handleDelete(banner.id)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default PromotionList;
