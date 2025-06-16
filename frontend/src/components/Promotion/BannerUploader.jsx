// src/components/Promotion/BannerUploader.jsx

import React, { useRef } from "react";
import { Box, Button, Paper, Typography, LinearProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { uploadBannerImage } from "../../features/promotion/promotionThunks";

const BannerUploader = () => {
  const dispatch = useDispatch();
  const inputRef = useRef();
  const uploadUrl = useSelector((state) => state.promotion.imageUploadUrl);
  const loading = useSelector((state) => state.promotion.loading);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) dispatch(uploadBannerImage(file));
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Upload Banner Image
      </Typography>

      <Box mt={2} mb={2}>
        <input
          ref={inputRef}
          type="file"
          accept="image/png, image/jpeg"
          hidden
          onChange={handleUpload}
        />
        <Button variant="outlined" onClick={() => inputRef.current.click()}>
          Select Banner Image
        </Button>
      </Box>

      {loading && <LinearProgress />}

      {uploadUrl && (
        <Box mt={3}>
          <Typography variant="body2">Preview:</Typography>
          <img
            src={uploadUrl}
            alt="Uploaded banner"
            style={{ width: "100%", borderRadius: 8, marginTop: 8 }}
          />
        </Box>
      )}
    </Paper>
  );
};

export default BannerUploader;
