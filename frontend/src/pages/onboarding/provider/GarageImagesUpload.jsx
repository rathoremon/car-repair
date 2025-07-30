// src/components/onboarding/provider/GarageImagesUpload.jsx
import React, { useRef, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  LinearProgress,
  Paper,
  Tooltip,
  Fade,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  uploadGarageImages,
  removeGarageImage,
} from "../../../features/onboarding/onboardingThunks";
import {
  setOnboardingError,
  setGarageImages,
} from "../../../features/onboarding/onboardingSlice";

const DOCUMENTS_BASE_URL =
  import.meta.env.VITE_DOCUMENTS_URL ||
  "http://localhost:5000/uploads/documents/";

const getFileName = (path) => {
  // Always just the filename, even if Windows/absolute
  return path ? path.split(/[\\/]/).pop() : "";
};
const getImageUrl = (img) => {
  if (!img) return "/placeholder-image.png";
  if (img.previewUrl) return img.previewUrl;
  if (img.filePath) {
    // Get just the filename, ignore all directories
    const filename = getFileName(img.filePath);
    return `${DOCUMENTS_BASE_URL}${filename}`;
  }
  return "/placeholder-image.png";
};
const RECOMMENDED_ANGLES = [
  "Front View",
  "Side View",
  "Inside Workshop",
  "Customer Waiting Area",
  "Equipment Area",
  "Entrance Signboard",
];

const MAX_IMAGES = 6;
const MIN_IMAGES = 3;
const ACCEPTED_TYPES = ["image/jpeg", "image/png"];
const MAX_SIZE_MB = 5;

export default function GarageImagesUpload() {
  const inputRef = useRef();
  const dispatch = useDispatch();
  const {
    garageImages,
    garageImagesUploading,
    garageImagesProgress,
    garageImagesError,
  } = useSelector((state) => state.onboarding);
  const providerDocuments = useSelector(
    (state) => state.onboarding.providerDocuments
  );

  useEffect(() => {
    // Only set if garageImages is empty or incomplete
    if (Array.isArray(providerDocuments)) {
      const garageImgs = providerDocuments.filter(
        (doc) => doc.type === "garage_image"
      );
      if (
        garageImgs.length &&
        (garageImages.length !== garageImgs.length ||
          garageImages.some((img) => !img.filePath))
      ) {
        dispatch(setGarageImages(garageImgs));
      }
    }
    // eslint-disable-next-line
  }, [providerDocuments]);
  const handleFiles = (files) => {
    let newFiles = Array.from(files);
    if (garageImages.length + newFiles.length > MAX_IMAGES) {
      dispatch(
        setOnboardingError(`You can upload up to ${MAX_IMAGES} images.`)
      );
      return;
    }
    newFiles = newFiles.filter((file) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        dispatch(setOnboardingError("Only JPEG and PNG images are allowed."));
        return false;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        dispatch(setOnboardingError("Each image must be less than 5MB."));
        return false;
      }
      return true;
    });
    if (newFiles.length > 0) {
      dispatch(uploadGarageImages(newFiles));
    }
  };

  const handleDelete = (idx) => {
    const img = garageImages[idx];
    if (img && img.id) dispatch(removeGarageImage(img.id));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (garageImagesUploading) return;
    handleFiles(e.dataTransfer.files);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography fontWeight={600} mb={1}>
        Garage Images <span style={{ color: "#888" }}>(3–6 images)</span>
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Recommended: Front, Side, Inside, Waiting Area, Equipment, Signboard
      </Typography>
      <Paper
        variant="outlined"
        sx={{
          borderRadius: 2,
          borderStyle: "dashed",
          minHeight: 120,
          mb: 2,
          p: { xs: 2, sm: 3 },
          bgcolor: "#f5f6fa",
          boxShadow: 0,
          width: "100%",
          cursor: "pointer",
          transition: "box-shadow 0.2s",
          "&:hover": { boxShadow: 2 },
        }}
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        aria-label="Upload garage images"
        tabIndex={0}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png"
          style={{ display: "none" }}
          onChange={(e) => handleFiles(e.target.files)}
          aria-label="Upload garage images"
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <AddPhotoAlternateIcon color="primary" sx={{ fontSize: 36 }} />
          <Typography variant="body2" color="text.secondary">
            Drag & drop or click to select images
          </Typography>
          <Typography variant="caption" color="text.secondary">
            JPEG/PNG, up to 5MB each
          </Typography>
        </Box>
      </Paper>
      {garageImagesUploading && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress
            variant="determinate"
            value={garageImagesProgress || 0}
            color="primary"
          />
        </Box>
      )}
      {garageImagesError && (
        <Typography color="error" variant="caption" mb={1}>
          {garageImagesError}
        </Typography>
      )}

      <Box
        sx={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            sm: "repeat(auto-fit, minmax(150px, 1fr))",
          },
          gap: 2,
        }}
      >
        <AnimatePresence>
          {garageImages.filter(Boolean).map((img, idx) => (
            <motion.div
              key={img.id || img.filePath || img.previewUrl || idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              style={{ width: "100%" }}
            >
              <Paper
                elevation={2}
                sx={{
                  borderRadius: 0.7,
                  overflow: "hidden",
                  position: "relative",
                  width: "100%",
                  minHeight: 120,
                  transition: "box-shadow 0.2s",
                  "&:hover": { boxShadow: 8 },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 0,
                }}
              >
                <img
                  src={getImageUrl(img)}
                  alt={
                    img?.label ||
                    RECOMMENDED_ANGLES[idx] ||
                    `Garage image ${idx + 1}`
                  }
                  style={{
                    width: "100%",
                    height: 120,
                    objectFit: "cover",
                    display: "block",
                  }}
                  loading="lazy"
                />
                <Fade in>
                  <Tooltip title="Delete image">
                    <IconButton
                      size="small"
                      aria-label="delete image"
                      onClick={() => handleDelete(idx)}
                      sx={{
                        position: "absolute",
                        top: 6,
                        right: 6,
                        background: "rgba(255,255,255,0.7)",
                        "&:hover": { background: "rgba(244,67,54,0.25)" },
                        zIndex: 2,
                      }}
                    >
                      <DeleteIcon fontSize="small" color="error" />
                    </IconButton>
                  </Tooltip>
                </Fade>
              </Paper>
            </motion.div>
          ))}
        </AnimatePresence>
        {/* Show empty slots for recommended angles */}
        {Array.from({
          length: Math.max(0, MAX_IMAGES - garageImages.length),
        }).map((_, i) => (
          <motion.div
            key={`empty-${i}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 0.5, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            style={{ width: "100%" }}
          >
            <Paper
              variant="outlined"
              sx={{
                borderRadius: 3,
                height: 120,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#f8fafc",
                borderStyle: "dashed",
                borderColor: "#c7d2fe",
                position: "relative",
                width: "100%",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                {RECOMMENDED_ANGLES[garageImages.length + i] || "Garage Image"}
              </Typography>
            </Paper>
          </motion.div>
        ))}
      </Box>
      <Typography
        variant="caption"
        color={
          garageImages.length < MIN_IMAGES || garageImages.length > MAX_IMAGES
            ? "error"
            : "text.secondary"
        }
        sx={{ mt: 1, display: "block" }}
      >
        {garageImages.length < MIN_IMAGES
          ? `Please upload at least ${MIN_IMAGES} images.`
          : garageImages.length > MAX_IMAGES
          ? `Maximum ${MAX_IMAGES} images allowed.`
          : ""}
      </Typography>
    </Box>
  );
}
