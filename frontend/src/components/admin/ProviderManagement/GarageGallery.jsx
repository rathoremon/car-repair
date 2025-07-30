import React, { useState, useRef, useEffect } from "react";
import {
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  Chip,
  useTheme,
  Paper,
  Divider,
} from "@mui/material";
import {
  ZoomIn,
  ZoomOut,
  ZoomOutMap,
  CheckCircle,
  Cancel,
  Close,
  RotateLeft,
  RotateRight,
  Refresh,
} from "@mui/icons-material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { toast } from "react-toastify";

// Helper functions & constants
const getFileName = (path) => path?.split("\\").pop().split("/").pop();
const statusColors = {
  approved: "success",
  pending: "warning",
  rejected: "error",
};
const statusLabels = {
  approved: "Approved",
  pending: "Pending",
  rejected: "Rejected",
};
const cardVariants = {
  initial: { opacity: 0, y: 40 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 70, damping: 18 },
  },
};
const getImageUrl = (img) =>
  `http://localhost:5000/uploads/documents/${getFileName(img.filePath)}`;
const DEFAULT_THUMB_HEIGHT = { xs: 98, sm: 126, md: 72 };
const THUMB_RADIUS = 0.3;
const CARD_RADIUS = 0.3;
const MIN_ZOOM = 1;
const MAX_ZOOM = 5;
const ZOOM_STEP = 0.22;
const TOOLBAR_HEIGHT = 64;

const GarageGallery = ({
  images = [],
  onApproveAll,
  onRejectAll,
  onImageApprove,
  onImageReject,
}) => {
  const theme = useTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  // Status per image, initialized from props
  const [statuses, setStatuses] = useState(() =>
    images.map((img) => img.status || "pending")
  );

  useEffect(() => {
    setStatuses(images.map((img) => img.status || "pending"));
  }, [images]);

  // Per-image rotation, synced to index
  const [rotations, setRotations] = useState(() => images.map(() => 0));

  // Modal state
  const [modalZoom, setModalZoom] = useState(1);
  const [modalRotation, setModalRotation] = useState(0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const imgRef = useRef(null);
  const dragOrigin = useRef({ x: 0, y: 0 });
  const panOrigin = useRef({ x: 0, y: 0 });

  // Sync view for each slide
  useEffect(() => {
    if (modalOpen) {
      setModalRotation(rotations[modalIndex] || 0);
      setModalZoom(1);
      setPan({ x: 0, y: 0 });
    }
    // eslint-disable-next-line
  }, [modalOpen, modalIndex]);

  // Touch/mouse drag to pan
  const handlePointerDown = (e) => {
    if (modalZoom === 1) return;
    e.preventDefault();
    setDragging(true);
    const evt = e.touches ? e.touches[0] : e;
    dragOrigin.current = { x: evt.clientX, y: evt.clientY };
    panOrigin.current = { ...pan };
  };

  const handlePointerMove = (e) => {
    if (!dragging) return;
    const evt = e.touches ? e.touches[0] : e;
    if (e.touches) e.preventDefault();
    setPan({
      x: panOrigin.current.x + (evt.clientX - dragOrigin.current.x),
      y: panOrigin.current.y + (evt.clientY - dragOrigin.current.y),
    });
  };

  const handlePointerUp = () => {
    setDragging(false);
  };

  // Double-click/double-tap zoom to point
  const handleDoubleClick = (e) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    if (modalZoom < MAX_ZOOM) {
      const newZoom = Math.min(MAX_ZOOM, modalZoom + 1);
      setModalZoom(newZoom);
      setPan({
        x: pan.x - ((x - rect.width / 2) * (newZoom - modalZoom)) / newZoom,
        y: pan.y - ((y - rect.height / 2) * (newZoom - modalZoom)) / newZoom,
      });
    } else {
      setModalZoom(1);
      setPan({ x: 0, y: 0 });
    }
  };

  // For thumbnail rotation
  const rotateThumb = (idx, dir) => {
    setRotations((prev) =>
      prev.map((deg, i) =>
        i === idx
          ? dir === "left"
            ? (deg - 90 + 360) % 360
            : (deg + 90) % 360
          : deg
      )
    );
  };

  // ---- Stats ----
  const total = images.length;
  const approved = statuses.filter((s) => s === "approved").length;
  const pending = statuses.filter((s) => s === "pending").length;
  const rejected = statuses.filter((s) => s === "rejected").length;

  // ---- Approve/Reject handlers with async feedback ----
  const handleApprove = async (idx, id) => {
    try {
      await onImageApprove(id);
      setStatuses((prev) => prev.map((s, i) => (i === idx ? "approved" : s)));
      toast.success("Image approved", { autoClose: 2000 });
    } catch {
      toast.error("Failed to approve image", { autoClose: 2000 });
    }
  };
  const handleReject = async (idx, id) => {
    try {
      await onImageReject(id);
      setStatuses((prev) => prev.map((s, i) => (i === idx ? "rejected" : s)));
      toast.error("Image rejected", { autoClose: 2000 });
    } catch {
      toast.error("Failed to reject image", { autoClose: 2000 });
    }
  };

  // Bulk actions
  const handleApproveAll = async () => {
    try {
      await onApproveAll();
      setStatuses(images.map(() => "approved"));
      toast.success("All images approved", { autoClose: 2000 });
    } catch {
      toast.error("Failed to approve all", { autoClose: 2000 });
    }
  };
  const handleRejectAll = async () => {
    try {
      await onRejectAll();
      setStatuses(images.map(() => "rejected"));
      toast.error("All images rejected", { autoClose: 2000 });
    } catch {
      toast.error("Failed to reject all", { autoClose: 2000 });
    }
  };

  // ---- UI ----
  return (
    <Box>
      {/* Top Section: Title, Bulk Actions, Stats */}
      <Box
        mb={3}
        display="flex"
        alignItems={{ xs: "center", sm: "center" }}
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent={{ xs: "center", sm: "space-between" }}
        gap={2}
      >
        <Box
          sx={{
            mb: 3,
            px: { xs: 1, sm: 3 },
            py: 1.5,
            background: "#fff",
            borderBottom: "3px solid #6366f1",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            boxShadow: "0 2px 8px 0 rgba(99,102,241,0.06)",
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            Garage Images
          </Typography>
          <Box display="flex" gap={1.5} flexWrap="wrap" alignItems="center">
            <Chip label={`${approved} Approved`} color="success" size="small" />
            <Chip label={`${pending} Pending`} color="warning" size="small" />
            <Chip label={`${rejected} Rejected`} color="error" size="small" />
            <Typography variant="body2" fontWeight={600} color="text.secondary">
              {total} Images
            </Typography>
          </Box>
        </Box>
        {images.length > 0 && (
          <Box display="flex" gap={1} mt={{ xs: 2, sm: 0 }}>
            <Button
              variant="outlined"
              color="error"
              size="small"
              sx={{ minWidth: 105, borderRadius: 0.2, fontWeight: 600 }}
              onClick={handleRejectAll}
              disabled={statuses.every((s) => s === "rejected")}
            >
              Reject All
            </Button>
            <Button
              variant="contained"
              color="success"
              size="small"
              sx={{ minWidth: 105, borderRadius: 0.2, fontWeight: 600 }}
              onClick={handleApproveAll}
              disabled={statuses.every((s) => s === "approved")}
            >
              Approve All
            </Button>
          </Box>
        )}
      </Box>

      {/* Grid of Thumbnails */}
      <Grid
        container
        spacing={3}
        justifyContent={{ xs: "center", sm: "flex-start" }}
        alignItems={{ xs: "center", sm: "stretch" }}
      >
        {images.map((img, idx) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            key={img.id}
            sx={{
              display: "flex",
              justifyContent: { xs: "center", sm: "flex-start" },
            }}
          >
            <motion.div
              variants={cardVariants}
              initial="initial"
              animate="animate"
              whileHover={{ scale: 1.04 }}
              style={{ width: "100%" }}
            >
              <Card
                elevation={0}
                sx={{
                  borderRadius: CARD_RADIUS,
                  bgcolor: "#f8fafc",
                  minHeight: 150,
                  boxShadow:
                    statuses[idx] === "approved"
                      ? `0 0 0 2px ${theme.palette.success.light}, 0 4px 24px 0 rgba(16,185,129,0.12)`
                      : statuses[idx] === "rejected"
                      ? `0 0 0 2px ${theme.palette.error.light}, 0 4px 24px 0 rgba(239,68,68,0.12)`
                      : "0 4px 24px 0 rgba(30,41,59,0.10)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  overflow: "visible",
                  transition:
                    "box-shadow 0.35s cubic-bezier(.21,1.02,.73,1), transform 0.35s cubic-bezier(.21,1.02,.73,1)",
                  transform: "perspective(900px) rotateY(0deg) scale(1)",
                  "&:hover": {
                    boxShadow:
                      statuses[idx] === "approved"
                        ? `0 0 0 2.5px ${theme.palette.success.main}, 0 16px 48px 0 rgba(16,185,129,0.22)`
                        : statuses[idx] === "rejected"
                        ? `0 0 0 2.5px ${theme.palette.error.main}, 0 16px 48px 0 rgba(239,68,68,0.22)`
                        : "0 16px 48px 0 rgba(30,41,59,0.18)",
                    transform: "perspective(900px) rotateY(6deg) scale(1.045)",
                  },
                }}
              >
                <CardActionArea
                  onClick={() => {
                    setModalIndex(idx);
                    setModalOpen(true);
                  }}
                  sx={{ borderRadius: CARD_RADIUS }}
                  aria-label={`Open image ${idx + 1} in gallery`}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      height: {
                        xs: DEFAULT_THUMB_HEIGHT.xs,
                        sm: DEFAULT_THUMB_HEIGHT.sm,
                        md: DEFAULT_THUMB_HEIGHT.md,
                      },
                      overflow: "hidden",
                      bgcolor: "#fff",
                      borderRadius: THUMB_RADIUS,
                      border: "1px solid #f2f2f2",
                      boxShadow: "0 2px 8px 0 rgba(36,46,80,.07)",
                    }}
                  >
                    <img
                      src={getImageUrl(img)}
                      alt={`Garage Image ${idx + 1}`}
                      style={{
                        height: "100%",
                        width: "auto",
                        maxWidth: "87%",
                        transform: `rotate(${rotations[idx] || 0}deg)`,
                        transition: "transform 0.23s cubic-bezier(.5,1.5,.6,1)",
                        borderRadius: THUMB_RADIUS,
                      }}
                    />
                  </Box>
                </CardActionArea>
                <CardContent
                  sx={{ p: 1.5, pt: 1, width: "100%", textAlign: "center" }}
                >
                  <Box display="flex" justifyContent="center" gap={1} mb={1}>
                    <Chip
                      label={statusLabels[statuses[idx]] || statuses[idx]}
                      color={statusColors[statuses[idx]]}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        fontSize: 12,
                        px: 0.8,
                        borderRadius: 2,
                      }}
                    />
                  </Box>
                  <Box display="flex" gap={1} justifyContent="center">
                    <Tooltip title="Rotate Left">
                      <span>
                        <IconButton
                          size="small"
                          onClick={() => rotateThumb(idx, "left")}
                          sx={{ borderRadius: 2, bgcolor: "#f3f4fa" }}
                        >
                          <RotateLeft fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Rotate Right">
                      <span>
                        <IconButton
                          size="small"
                          onClick={() => rotateThumb(idx, "right")}
                          sx={{ borderRadius: 2, bgcolor: "#f3f4fa" }}
                        >
                          <RotateRight fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                    {/* Approve */}
                    <Tooltip title="Approve">
                      <span>
                        <IconButton
                          size="small"
                          color={
                            statuses[idx] === "approved" ? "success" : "default"
                          }
                          disabled={statuses[idx] === "approved"}
                          onClick={() => handleApprove(idx, img.id)}
                          aria-label="Approve image"
                          sx={{
                            borderRadius: 2,
                            opacity: statuses[idx] === "rejected" ? 0.38 : 1,
                          }}
                        >
                          <CheckCircle
                            fontSize="small"
                            color={
                              statuses[idx] === "approved"
                                ? "success"
                                : "inherit"
                            }
                          />
                        </IconButton>
                      </span>
                    </Tooltip>
                    {/* Reject */}
                    <Tooltip title="Reject">
                      <span>
                        <IconButton
                          size="small"
                          color={
                            statuses[idx] === "rejected" ? "error" : "default"
                          }
                          disabled={statuses[idx] === "rejected"}
                          onClick={() => handleReject(idx, img.id)}
                          aria-label="Reject image"
                          sx={{
                            borderRadius: 2,
                            opacity: statuses[idx] === "approved" ? 0.38 : 1,
                          }}
                        >
                          <Cancel
                            fontSize="small"
                            color={
                              statuses[idx] === "rejected" ? "error" : "inherit"
                            }
                          />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Full screen">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => {
                          setModalIndex(idx);
                          setModalOpen(true);
                        }}
                        aria-label="Zoom"
                        sx={{ borderRadius: 2 }}
                      >
                        <ZoomIn fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Modal Fullscreen Gallery */}
      <AnimatePresence>
        {modalOpen && (
          <Dialog
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            fullScreen
            slotProps={{
              paper: {
                sx: {
                  bgcolor: "#191a22",
                  p: 0,
                  borderRadius: 0,
                },
              },
            }}
            aria-labelledby="garage-gallery-modal"
          >
            {/* Tools Toolbar */}
            <Paper
              elevation={4}
              sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: TOOLBAR_HEIGHT,
                zIndex: 1202,
                bgcolor: "#fff",
                px: { xs: 1, sm: 2, md: 3 },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: { xs: 1, sm: 2.5 },
                boxShadow: "0 4px 24px 0 rgba(36,40,70,.07)",
                borderBottom: "1.5px solid #e2e4e8",
                borderRadius: 0,
                userSelect: "none",
              }}
            >
              <Tooltip title="Rotate Left">
                <span>
                  <IconButton
                    onClick={() =>
                      setModalRotation((deg) => (deg - 90 + 360) % 360)
                    }
                    sx={{ borderRadius: 2.5, bgcolor: "#f6f8fa" }}
                    size="large"
                  >
                    <RotateLeft />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Rotate Right">
                <span>
                  <IconButton
                    onClick={() => setModalRotation((deg) => (deg + 90) % 360)}
                    sx={{ borderRadius: 2.5, bgcolor: "#f6f8fa" }}
                    size="large"
                  >
                    <RotateRight />
                  </IconButton>
                </span>
              </Tooltip>
              <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
              <Tooltip title="Zoom In">
                <span>
                  <IconButton
                    onClick={() =>
                      setModalZoom((z) =>
                        Math.min(
                          MAX_ZOOM,
                          Math.round((z + ZOOM_STEP) * 100) / 100
                        )
                      )
                    }
                    sx={{ borderRadius: 2.5, bgcolor: "#f6f8fa" }}
                    size="large"
                    disabled={modalZoom >= MAX_ZOOM}
                  >
                    <ZoomIn />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Zoom Out">
                <span>
                  <IconButton
                    onClick={() =>
                      setModalZoom((z) =>
                        Math.max(
                          MIN_ZOOM,
                          Math.round((z - ZOOM_STEP) * 100) / 100
                        )
                      )
                    }
                    sx={{ borderRadius: 2.5, bgcolor: "#f6f8fa" }}
                    size="large"
                    disabled={modalZoom <= MIN_ZOOM}
                  >
                    <ZoomOut />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Actual Size">
                <span>
                  <IconButton
                    onClick={() => {
                      setModalZoom(1);
                      setPan({ x: 0, y: 0 });
                    }}
                    sx={{ borderRadius: 2.5, bgcolor: "#f6f8fa" }}
                    size="large"
                    disabled={modalZoom === 1 && pan.x === 0 && pan.y === 0}
                  >
                    <ZoomOutMap />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Reset View">
                <span>
                  <IconButton
                    onClick={() => {
                      setModalZoom(1);
                      setModalRotation(rotations[modalIndex] || 0);
                      setPan({ x: 0, y: 0 });
                    }}
                    sx={{ borderRadius: 2.5, bgcolor: "#f6f8fa" }}
                    size="large"
                    disabled={
                      modalZoom === 1 &&
                      modalRotation === (rotations[modalIndex] || 0) &&
                      pan.x === 0 &&
                      pan.y === 0
                    }
                  >
                    <Refresh />
                  </IconButton>
                </span>
              </Tooltip>
              <Box flexGrow={1} />
              <Tooltip title="Close Gallery">
                <IconButton
                  onClick={() => setModalOpen(false)}
                  sx={{
                    color: "#242429",
                    bgcolor: "#f4f5f7",
                    borderRadius: 2.5,
                    ml: 2,
                  }}
                  size="large"
                >
                  <Close />
                </IconButton>
              </Tooltip>
            </Paper>
            {/* Main Gallery */}
            <Box
              sx={{
                width: "100vw",
                minHeight: "100vh",
                pt: `${TOOLBAR_HEIGHT}px`,
                pb: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                bgcolor: "#181921",
                overflow: "hidden",
              }}
            >
              <Swiper
                initialSlide={modalIndex}
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                allowTouchMove={modalZoom === 1} // disable Swiper swiping when zoomed in
                style={{ width: "94vw", height: "78vh" }}
                onSlideChange={(swiper) => {
                  setModalIndex(swiper.activeIndex);
                  setModalRotation(rotations[swiper.activeIndex] || 0);
                  setModalZoom(1);
                  setPan({ x: 0, y: 0 });
                }}
              >
                {images.map((img, idx) => (
                  <SwiperSlide key={img.id}>
                    <Box
                      sx={{
                        background: "transparent",
                        borderRadius: 5,
                        boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
                        minHeight: "68vh",
                        maxWidth: "92vw",
                        mx: "auto",
                        p: { xs: 1, md: 2 },
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        overflow: "hidden",
                        cursor: modalZoom > 1 ? "grab" : "default",
                        userSelect: "none",
                      }}
                      onMouseDown={
                        modalZoom > 1 ? handlePointerDown : undefined
                      }
                      onMouseUp={modalZoom > 1 ? handlePointerUp : undefined}
                      onMouseMove={
                        modalZoom > 1 && dragging
                          ? handlePointerMove
                          : undefined
                      }
                      onTouchStart={
                        modalZoom > 1 ? handlePointerDown : undefined
                      }
                      onTouchMove={
                        modalZoom > 1 && dragging
                          ? handlePointerMove
                          : undefined
                      }
                      onTouchEnd={modalZoom > 1 ? handlePointerUp : undefined}
                    >
                      <img
                        ref={idx === modalIndex ? imgRef : null}
                        src={getImageUrl(img)}
                        alt={`Garage ${idx + 1}`}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "75vh",
                          objectFit: "contain",
                          background: "#f7f7fa",
                          borderRadius: 16,
                          boxShadow: "0 10px 32px rgba(30,60,100,0.13)",
                          display: "block",
                          margin: "auto",
                          cursor: modalZoom > 1 ? "grab" : "default",
                          userSelect: "none",
                          touchAction: "none",
                          pointerEvents: "all",
                          transition: dragging
                            ? "none"
                            : "transform .35s cubic-bezier(.39,1.54,.6,1)",
                          transform: `
                            rotate(${
                              idx === modalIndex
                                ? modalRotation
                                : rotations[idx] || 0
                            }deg)
                            scale(${idx === modalIndex ? modalZoom : 1})
                            translate(${modalZoom > 1 ? pan.x : 0}px, ${
                            modalZoom > 1 ? pan.y : 0
                          }px)
                          `,
                        }}
                        onDoubleClick={handleDoubleClick}
                        draggable={false}
                      />
                      <Typography
                        variant="caption"
                        color="white"
                        sx={{
                          position: "absolute",
                          bottom: 44,
                          left: 0,
                          right: 0,
                          textAlign: "center",
                          fontWeight: 700,
                          textShadow: "0 0 8px rgba(0,0,0,0.8)",
                          letterSpacing: 0.6,
                          fontSize: 16,
                          zIndex: 9,
                        }}
                      >
                        {statusLabels[images[idx].status]?.toUpperCase() ||
                          images[idx].status?.toUpperCase()}
                      </Typography>
                    </Box>
                  </SwiperSlide>
                ))}
              </Swiper>
            </Box>
          </Dialog>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default GarageGallery;
