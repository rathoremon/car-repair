import React, { useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  LinearProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ImageIcon from "@mui/icons-material/Image";

const DOCUMENTS_BASE_URL =
  import.meta.env.VITE_DOCUMENTS_URL ||
  "http://localhost:5000/uploads/documents/";

const getFileName = (path) => (path ? path.split(/[\\/]/).pop() : "");

const isImage = (name = "") => /\.(jpeg|jpg|png|webp|gif)$/i.test(name);
const isPDF = (name = "") => /\.pdf$/i.test(name);

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

  const getFileUrl = (file) => {
    if (!file) return "";
    if (file.previewUrl) return file.previewUrl;
    if (file.filePath) {
      const fileName = getFileName(file.filePath);
      return `${DOCUMENTS_BASE_URL}${fileName}`;
    }
    return "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (onFileChange) onFileChange(e);
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 2,
        borderStyle: "dashed",
        width: "100%",
        minWidth: 0,
        p: { xs: 2, sm: 3 },
        boxSizing: "border-box",
        background: "#f9f9fa",
        overflow: "visible",
      }}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => inputRef.current?.click()}
      aria-label={label}
      tabIndex={0}
    >
      <Typography color="text.secondary" mb={1} fontWeight={500}>
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
        sx={{ mb: 1 }}
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
        mb={1}
      >
        {accept?.replaceAll(".", "").toUpperCase()} up to {maxSizeMB}MB
      </Typography>

      {/* Responsive, never-overflowing grid */}
      <Box
        sx={{
          mt: 1,
          width: "100%",
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(auto-fit, minmax(220px, 1fr))",
          },
        }}
      >
        {files.map((file, i) => {
          const fileName =
            file.name ||
            file.originalName ||
            getFileName(file.filePath) ||
            "File";
          const url = getFileUrl(file);

          return (
            <Paper
              key={i}
              variant="outlined"
              sx={{
                borderRadius: 2,
                minHeight: 52,
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 1.5,
                py: 1,
                background: "#fff",
                width: "100%",
                maxWidth: "100%",
                boxShadow: 0,
                overflow: "hidden",
              }}
            >
              {/* Preview */}
              {url && isImage(fileName) ? (
                <Tooltip title={fileName}>
                  <Box
                    component="img"
                    src={url}
                    alt={fileName}
                    sx={{
                      height: 38,
                      width: 38,
                      minWidth: 38,
                      borderRadius: 1.5,
                      objectFit: "cover",
                      background: "#fafafa",
                      mr: 1,
                      flexShrink: 0,
                    }}
                  />
                </Tooltip>
              ) : url && isPDF(fileName) ? (
                <Tooltip title={fileName}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none", color: "#1976d2" }}
                  >
                    <InsertDriveFileIcon
                      sx={{
                        fontSize: 28,
                        color: "#e53935",
                        mr: 1,
                        verticalAlign: "middle",
                      }}
                    />
                  </a>
                </Tooltip>
              ) : (
                <ImageIcon
                  sx={{ color: "#bbb", fontSize: 26, mr: 1, flexShrink: 0 }}
                />
              )}

              {/* File name - always ellipsized */}
              {url ? (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#1976d2",
                    textDecoration: "underline",
                    fontSize: 14,
                    fontWeight: 500,
                    flex: 1,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    minWidth: 0,
                  }}
                  download={fileName}
                  title={fileName}
                >
                  {fileName}
                </a>
              ) : (
                <Typography
                  variant="body2"
                  noWrap
                  sx={{
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    minWidth: 0,
                  }}
                  title={fileName}
                >
                  {fileName}
                </Typography>
              )}

              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(i);
                }}
                size="small"
                aria-label="Remove file"
                sx={{ ml: 0.5, flexShrink: 0 }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Paper>
          );
        })}
      </Box>
      {uploading && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
      )}
    </Paper>
  );
}
