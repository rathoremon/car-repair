import React, { useRef } from "react";
import {
  Box,
  Typography,
  IconButton,
  LinearProgress,
  Paper,
  Grid,
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
  setGarageImagesProgress,
  setOnboardingError,
} from "../../../features/onboarding/onboardingSlice";

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

  // Handle file selection
  const handleFiles = (files) => {
    let newFiles = Array.from(files);

    // Validation: type, size, count
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

  // Remove image (frontend and backend)
  const handleDelete = (idx) => {
    const img = garageImages[idx];
    if (img && img.id) dispatch(removeGarageImage(img.id));
  };

  // Drag-and-drop handler
  const handleDrop = (e) => {
    e.preventDefault();
    if (garageImagesUploading) return;
    handleFiles(e.dataTransfer.files);
  };

  return (
    <Box>
      <Typography fontWeight={600} mb={1}>
        Garage Images <span style={{ color: "#888" }}>(3–6 images)</span>
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Recommended: Front, Side, Inside, Waiting Area, Equipment, Signboard
      </Typography>
      <Paper
        variant="outlined"
        className="p-4 mb-2 rounded-xl border-dashed border-2 border-gray-300 bg-gray-50 cursor-pointer transition-shadow hover:shadow-lg"
        sx={{
          borderRadius: 2,
          borderStyle: "dashed",
          minHeight: 120,
          mb: 2,
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
        <Box className="flex flex-col items-center justify-center">
          <AddPhotoAlternateIcon color="primary" sx={{ fontSize: 36 }} />
          <Typography variant="body2" color="text.secondary">
            Drag & drop or click to select images
          </Typography>
          <Typography variant="caption" color="text.secondary">
            JPEG/PNG, up to 5MB each
          </Typography>
        </Box>
      </Paper>
      {garageImagesError && (
        <Typography color="error" variant="caption" mb={1}>
          {garageImagesError}
        </Typography>
      )}
      <Grid container spacing={2}>
        <AnimatePresence>
          {garageImages.filter(Boolean).map((img, idx) => (
            <Grid
              item
              xs={6}
              sm={4}
              key={img.id || img.filePath || idx}
              component={motion.div}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
            >
              <Paper
                elevation={3}
                className="relative group"
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  position: "relative",
                  transition: "box-shadow 0.2s",
                  "&:hover": { boxShadow: 8 },
                }}
              >
                <img
                  src={
                    img?.filePath
                      ? img.filePath.startsWith("/")
                        ? `http://localhost:5000${img.filePath}`
                        : img.filePath
                      : img?.url || "/placeholder-image.png"
                  }
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
                />
                {/* ...rest of your code... */}
              </Paper>
            </Grid>
          ))}
        </AnimatePresence>
        {/* Show empty slots for recommended angles */}
        {Array.from({
          length: Math.max(0, MAX_IMAGES - garageImages.length),
        }).map((_, i) => (
          <Grid
            item
            xs={6}
            sm={4}
            key={`empty-${i}`}
            component={motion.div}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 0.5, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}
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
          </Grid>
        ))}
      </Grid>
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
