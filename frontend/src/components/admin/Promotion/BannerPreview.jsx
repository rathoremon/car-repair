import React from "react";
import { Box, Paper, Typography, Chip, Button } from "@mui/material";
import { ArrowRightAlt } from "@mui/icons-material";

const BannerPreview = ({ banner }) => {
  const isImage = banner.type === "image";
  // You can adjust width/height for your table cell size
  return (
    <Paper
      elevation={4}
      sx={{
        width: 260,
        height: 90,
        overflow: "hidden",
        borderRadius: 0.6,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "grey.100",
        boxShadow: "0 6px 32px 0 rgba(60,80,180,0.13)",
        p: 0,
        transition: "box-shadow 0.2s",
        "&:hover": {
          boxShadow: "0 10px 40px 0 rgba(60,80,180,0.18)",
        },
      }}
    >
      {banner.imageUrl ? (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <img
            src={banner.imageUrl}
            alt="Banner"
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              filter: !isImage ? "brightness(0.72)" : "none",
              transition: "transform .22s cubic-bezier(.5,.1,.4,1)",
            }}
          />
          {/* Overlays for "promotion" banners */}
          {!isImage && (
            <>
              {/* Gradient overlays like in customer carousel */}
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 10,
                  background:
                    "linear-gradient(90deg, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.12) 60%, transparent 100%)",
                  pointerEvents: "none",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 11,
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0.34) 0%, transparent 60%, rgba(0,0,0,0.40) 100%)",
                  pointerEvents: "none",
                }}
              />
            </>
          )}
        </Box>
      ) : (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(90deg, #e0e7ff 0%, #f1f5f9 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            fontStyle: "italic",
            color: "grey.500",
            letterSpacing: 0.2,
            fontWeight: 500,
          }}
        >
          No Image
        </Box>
      )}

      {/* Overlayed Content for Promotional Banner */}
      {!isImage && (
        <Box
          sx={{
            position: "absolute",
            zIndex: 20,
            left: 20,
            top: 16,
            width: "60%",
            color: "white",
          }}
        >
          {banner.title && (
            <Typography
              variant="subtitle2"
              fontWeight={700}
              sx={{
                fontSize: 15,
                lineHeight: 1.2,
                color: "white",
                textShadow: "0 2px 10px rgba(0,0,0,0.32)",
                letterSpacing: 0.1,
                mb: 0.5,
                maxWidth: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={banner.title}
            >
              {banner.title}
            </Typography>
          )}
          {banner.description && (
            <Typography
              variant="body2"
              sx={{
                color: "white",
                fontWeight: 400,
                fontSize: 12,
                textShadow: "0 2px 6px rgba(0,0,0,0.21)",
                maxWidth: "95%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={banner.description}
            >
              {banner.description}
            </Typography>
          )}
          {banner.ctaText && (
            <Button
              size="small"
              variant="contained"
              endIcon={<ArrowRightAlt />}
              sx={{
                mt: 0.7,
                py: 0,
                px: 1.5,
                fontSize: 11,
                borderRadius: 6,
                background: "linear-gradient(90deg, #fde68a 0%, #fb7185 100%)",
                color: "#24292f",
                fontWeight: 600,
                boxShadow: 2,
                textTransform: "none",
                minHeight: 0,
                lineHeight: 1.1,
                ".MuiButton-endIcon": { ml: 0.4, mr: -0.6 },
                pointerEvents: "none",
              }}
              disableElevation
              tabIndex={-1}
              aria-disabled="true"
            >
              {banner.ctaText}
            </Button>
          )}
        </Box>
      )}

      {/* For image banner: title as subtle overlay */}
      {isImage && banner.title && (
        <Typography
          variant="subtitle2"
          sx={{
            position: "absolute",
            bottom: 9,
            left: 13,
            color: "#fff",
            fontWeight: 600,
            fontSize: 15,
            textShadow: "0 2px 8px rgba(0,0,0,0.13)",
            letterSpacing: 0.1,
            zIndex: 2,
            maxWidth: "65%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          {banner.title}
        </Typography>
      )}

      {/* Decorative overlay */}
      <Box
        sx={{
          position: "absolute",
          top: -30,
          right: -40,
          width: 90,
          height: 90,
          background: "linear-gradient(135deg, #6366f1 0%, #60a5fa 100%)",
          opacity: 0.13,
          borderRadius: "50%",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
    </Paper>
  );
};

export default BannerPreview;
