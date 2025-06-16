import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";

const BannerPreview = ({ banner }) => {
  const isImage = banner.type === "image";

  return (
    <Paper
      elevation={1}
      sx={{
        width: 220,
        height: 100,
        overflow: "hidden",
        position: "relative",
        borderRadius: 1,
        p: 0.5,
      }}
    >
      {banner.imageUrl ? (
        <img
          src={banner.imageUrl}
          alt="Banner"
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: 6,
          }}
        />
      ) : (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            bgcolor: "grey.200",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontStyle: "italic",
          }}
        >
          No Image
        </Box>
      )}

      {!isImage && (
        <Box
          sx={{
            position: "absolute",
            bottom: 4,
            left: 4,
            right: 4,
            bgcolor: "rgba(0,0,0,0.5)",
            color: "white",
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontSize: "0.75rem",
          }}
        >
          {banner.ctaText}
        </Box>
      )}
    </Paper>
  );
};

export default BannerPreview;
