import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Box,
  Typography,
  Button,
  Dialog,
  IconButton,
  useTheme,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { CheckCircle, Cancel, ZoomOutMap } from "@mui/icons-material";
import { toast } from "react-toastify";

const DOCUMENTS_BASE_URL =
  import.meta.env.VITE_DOCUMENTS_URL ||
  "http://localhost:5000/uploads/documents/";

const getFileName = (path) => path?.split("\\").pop().split("/").pop();
const isImage = (filePath) =>
  /\.(jpeg|jpg|png|webp|gif)$/i.test(filePath || "");
const isPDF = (filePath) => /\.pdf$/i.test(filePath || "");
const THUMB_HEIGHT = 80;

const statusColors = {
  approved: "success",
  pending: "warning",
  rejected: "error",
};

const DocumentViewer = ({
  doc,
  onApprove,
  onReject,
  status = "",
  loading = false,
}) => {
  const theme = useTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const [btnLoading, setBtnLoading] = useState(null);
  const [docStatus, setDocStatus] = useState(doc.status || status || "pending");

  // Render thumbnail preview
  const renderPreview = () => {
    if (isImage(doc.filePath)) {
      return (
        <Box
          sx={{
            height: THUMB_HEIGHT,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#fafbfc",
            borderRadius: 0.2,
          }}
        >
          <CardMedia
            component="img"
            src={DOCUMENTS_BASE_URL + getFileName(doc.filePath)}
            alt={doc.type}
            sx={{
              width: "auto",
              height: "68px",
              maxWidth: "88%",
              objectFit: "contain",
              background: "#fff",
              borderRadius: 0.1,
              border: "1px solid #eee",
              mx: "auto",
            }}
          />
        </Box>
      );
    } else if (isPDF(doc.filePath)) {
      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: THUMB_HEIGHT,
            bgcolor: "#fafafa",
            borderRadius: 2,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            PDF Document
          </Typography>
        </Box>
      );
    }
    return (
      <Box
        sx={{
          height: THUMB_HEIGHT,
          bgcolor: "#fafafa",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 2,
        }}
      >
        <Typography variant="caption" color="text.secondary">
          No preview
        </Typography>
      </Box>
    );
  };

  const openFullView = () => setModalOpen(true);

  // Approve/Reject handlers with UI feedback and local status update
  const handleApprove = async () => {
    setBtnLoading("approve");
    try {
      await onApprove(doc.id);
      setDocStatus("approved");
      toast.success("Document approved", { autoClose: 2000 });
    } catch (err) {
      toast.error("Failed to approve document", { autoClose: 2000 });
    }
    setBtnLoading(null);
  };
  const handleReject = async () => {
    setBtnLoading("reject");
    try {
      await onReject(doc.id);
      setDocStatus("rejected");
      toast.error("Document rejected", { autoClose: 2000 });
    } catch (err) {
      toast.error("Failed to reject document", { autoClose: 2000 });
    }
    setBtnLoading(null);
  };

  // For icon color (visual feedback)
  const iconColor =
    docStatus === "approved"
      ? theme.palette.success.main
      : docStatus === "rejected"
      ? theme.palette.error.main
      : theme.palette.action.disabled;

  return (
    <Card
      sx={{
        mb: 2,
        boxShadow: 3,
        borderRadius: 0.8,
        border:
          docStatus === "approved"
            ? `2px solid ${theme.palette.success.main}`
            : docStatus === "rejected"
            ? `2px solid ${theme.palette.error.main}`
            : `1px solid #e0e0e0`,
        position: "relative",
        overflow: "hidden",
        maxWidth: 340,
        mx: "auto",
      }}
    >
      <CardContent sx={{ p: 2, pb: 1 }}>
        <Typography
          variant="subtitle2"
          fontWeight={600}
          sx={{ mb: 1, textTransform: "capitalize" }}
        >
          {doc.type}
        </Typography>
        <Box sx={{ mb: 1, position: "relative" }}>
          {renderPreview()}
          <Tooltip title="View Fullscreen">
            <IconButton
              size="small"
              sx={{
                position: "absolute",
                bottom: 10,
                right: 10,
                bgcolor: "#fff",
                border: "1px solid #eee",
                "&:hover": { bgcolor: "#fafafa" },
              }}
              onClick={openFullView}
              aria-label="Zoom"
            >
              <ZoomOutMap />
            </IconButton>
          </Tooltip>
        </Box>
        <Box display="flex" gap={1} justifyContent="stretch">
          <Button
            size="small"
            variant="outlined"
            color="success"
            fullWidth
            onClick={handleApprove}
            disabled={docStatus === "approved" || btnLoading === "approve"}
            startIcon={
              btnLoading === "approve" ? (
                <CircularProgress size={16} />
              ) : (
                <CheckCircle
                  style={{
                    color:
                      docStatus === "approved"
                        ? theme.palette.success.main
                        : undefined,
                  }}
                />
              )
            }
            aria-label="Approve"
          >
            Approve
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            fullWidth
            onClick={handleReject}
            disabled={docStatus === "rejected" || btnLoading === "reject"}
            startIcon={
              btnLoading === "reject" ? (
                <CircularProgress size={16} />
              ) : (
                <Cancel
                  style={{
                    color:
                      docStatus === "rejected"
                        ? theme.palette.error.main
                        : undefined,
                  }}
                />
              )
            }
            aria-label="Reject"
          >
            Reject
          </Button>
        </Box>
      </CardContent>

      {/* Fullscreen Modal */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        fullScreen
        slotProps={{ paper: { sx: { bgcolor: "#fff" } } }}
      >
        <Box
          sx={{
            height: "100vh",
            width: "100vw",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#fff",
            flexDirection: "column",
          }}
        >
          {isImage(doc.filePath) ? (
            <img
              src={DOCUMENTS_BASE_URL + getFileName(doc.filePath)}
              alt={doc.type}
              style={{
                width: "auto",
                maxWidth: "98vw",
                maxHeight: "85vh",
                objectFit: "contain",
                borderRadius: 8,
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              }}
            />
          ) : isPDF(doc.filePath) ? (
            <iframe
              src={DOCUMENTS_BASE_URL + getFileName(doc.filePath)}
              style={{
                width: "98vw",
                height: "92vh",
                border: "none",
                borderRadius: 8,
                boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
              }}
              title={doc.type}
            />
          ) : (
            <Typography variant="h6" color="text.secondary">
              Document type not supported
            </Typography>
          )}

          <Button
            onClick={() => setModalOpen(false)}
            variant="contained"
            sx={{ mt: 3, minWidth: 180, fontWeight: 600 }}
          >
            Close Full View
          </Button>
        </Box>
      </Dialog>
    </Card>
  );
};

export default DocumentViewer;
