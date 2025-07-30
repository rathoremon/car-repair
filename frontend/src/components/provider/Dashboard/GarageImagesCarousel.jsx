import React, { useState } from "react";
import {
  Paper,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Modal,
  Fade,
  Backdrop,
  useTheme,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Download, ZoomIn, Delete, AddAPhoto } from "@mui/icons-material";
import img1 from "../../../assets/anime-black-clover-asta-black-clover-wallpaper-preview.jpg";
import img2 from "../../../assets/1471766.jpg";
import img3 from "../../../assets/anime-one-piece-monkey-d-luffy-shanks-one-piece-wallpaper-preview.jpg";
import { motion } from "framer-motion";

// Replace with your real images from API
const mockImages = [
  {
    url: img1,
    label: "Main Bay",
  },
  { url: img2, label: "Reception Area" },
  { url: img3, label: "Equipment Section" },
];

const fadeVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", duration: 0.7 } },
};

const GarageImagesCarousel = () => {
  const theme = useTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeImg, setActiveImg] = useState(null);

  // Download logic for future API usage
  const handleDownload = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Delete/Replace: connect to API for production
  const handleDelete = (img) => {
    alert(`Delete image: ${img.label}`);
    // Call your delete API here
  };
  const handleReplace = (img) => {
    alert(`Replace image: ${img.label}`);
    // Open file picker/modal and update via API
  };

  // Zoom modal open
  const handleZoom = (img) => {
    setActiveImg(img);
    setModalOpen(true);
  };

  const handleClose = () => setModalOpen(false);

  return (
    <Paper
      elevation={5}
      sx={{
        borderRadius: 1.5, // 8px
        p: { xs: 2, sm: 3 },
        minHeight: 210,

        boxShadow: "0 4px 28px rgba(40, 60, 120, 0.25)",
        background: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        maxWidth: 500,
        mx: "auto",
      }}
      component={motion.div}
      variants={fadeVariant}
      initial="hidden"
      animate="visible"
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          letterSpacing: 0.1,
          fontFamily: "inherit",
          mb: 2,
        }}
      >
        Garage Images
      </Typography>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        style={{
          width: "100%",
          maxWidth: 440,
          minHeight: 180,
          margin: "0 auto",
          borderRadius: 8,
        }}
      >
        {mockImages.map((img, idx) => (
          <SwiperSlide key={img.url}>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                aspectRatio: "16/9",
                overflow: "hidden",
                borderRadius: 0.5,
                boxShadow: "0 2px 12px rgba(27,41,72,0.09)",
                background: "#f7f8fa",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                "&:hover img": {
                  filter: "brightness(0.92) scale(1.03)",
                  transition: "all 0.18s",
                },
              }}
              tabIndex={0}
              aria-label={`View ${img.label}`}
            >
              <motion.img
                src={img.url}
                alt={img.label}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "all .18s cubic-bezier(.4,0,.2,1)",
                }}
                onClick={() => handleZoom(img)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                loading="lazy"
                draggable={false}
              />
              {/* Top-right actions */}
              <Box
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  display: "flex",
                  gap: 1,
                  zIndex: 2,
                  bgcolor: "rgba(255,255,255,0.85)",
                  borderRadius: 1,
                }}
              >
                <Tooltip title="Zoom">
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleZoom(img);
                    }}
                  >
                    <ZoomIn fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Download">
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(img.url);
                    }}
                  >
                    <Download fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Replace">
                  <IconButton
                    color="secondary"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReplace(img);
                    }}
                  >
                    <AddAPhoto fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    color="error"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(img);
                    }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              {/* Caption */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  px: 2,
                  py: 1,
                  bgcolor: "rgba(22,29,49,0.76)",
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 500,
                  letterSpacing: 0.2,
                  borderBottomLeftRadius: 8,
                  borderBottomRightRadius: 8,
                  fontFamily: "inherit",
                }}
              >
                {img.label}
              </Box>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* Zoom Modal */}
      <Modal
        open={modalOpen}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 300 }}
        aria-labelledby="garage-image-zoom"
      >
        <Fade in={modalOpen}>
          <Box
            sx={{
              outline: "none",
              width: "100vw",
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(18,22,34,0.97)",
              zIndex: 2000,
            }}
          >
            {activeImg && (
              <motion.img
                src={activeImg.url}
                alt={activeImg.label}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  transition: { duration: 0.32 },
                }}
                exit={{ scale: 0.9, opacity: 0 }}
                style={{
                  maxWidth: "90vw",
                  maxHeight: "80vh",
                  borderRadius: 12,
                  boxShadow: "0 8px 48px rgba(27,41,72,0.25)",
                  background: "#fff",
                }}
              />
            )}
          </Box>
        </Fade>
      </Modal>
    </Paper>
  );
};

export default GarageImagesCarousel;
