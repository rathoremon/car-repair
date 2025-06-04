import React, { useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  LinearProgress,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function FileUploadZone({
  label,
  files = [],
  onFileChange,
  onDelete,
  accept,
  maxSizeMB = 5,
  uploading = false,
  progress = 0,
  single = false,
  multiple = false,
}) {
  const inputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    if (onFileChange) onFileChange(e);
  };

  return (
    <Paper
      variant="outlined"
      className="p-4 mb-2 rounded-xl border-dashed border-2 border-gray-300 bg-gray-50 cursor-pointer transition-shadow hover:shadow-md"
      sx={{ borderRadius: 2, borderStyle: "dashed" }}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => inputRef.current?.click()}
      aria-label={label}
      tabIndex={0}
    >
      <Typography color="text.secondary" mb={1}>
        {label}
      </Typography>
      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        style={{ display: "none" }}
        onChange={onFileChange}
        aria-label={label}
      />
      <Button
        variant="outlined"
        component="span"
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          inputRef.current?.click();
        }}
        aria-label="Browse Files"
      >
        Browse Files
      </Button>
      <Typography
        variant="caption"
        color="text.secondary"
        display="block"
        mt={1}
      >
        {accept?.replaceAll(".", "").toUpperCase()} up to {maxSizeMB}MB
      </Typography>
      <Box className="mt-2 flex flex-wrap gap-2">
        {files.map((file, i) => (
          <Paper
            key={i}
            variant="outlined"
            className="flex items-center gap-2 px-2 py-1 bg-gray-100"
            sx={{ borderRadius: 1 }}
          >
            <Typography variant="body2" noWrap>
              {file.name || (typeof file === "string" ? file : "File")}
            </Typography>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(i);
              }}
              size="small"
              aria-label="Remove file"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Paper>
        ))}
      </Box>
      {uploading && (
        <Box className="mt-2">
          <LinearProgress variant="determinate" value={progress} />
        </Box>
      )}
    </Paper>
  );
}
