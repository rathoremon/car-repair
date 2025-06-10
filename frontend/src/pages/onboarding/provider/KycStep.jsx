import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setProviderDocs,
  setCompleted,
  setStep,
} from "../../../features/onboarding/onboardingSlice";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function KycStep() {
  const dispatch = useDispatch();
  const providerDocs = useSelector((state) => state.onboarding.providerDocs);
  const [files, setFiles] = useState(providerDocs || []);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleDrop = (e) => {
    e.preventDefault();
    const newFiles = Array.from(e.dataTransfer.files);
    setFiles([...files, ...newFiles]);
    setError("");
  };

  const handleFileChange = (e) => {
    setFiles([...files, ...Array.from(e.target.files)]);
    setError("");
  };

  const handleDelete = (idx) => {
    setFiles(files.filter((_, i) => i !== idx));
  };

  const handleComplete = () => {
    if (files.length === 0) {
      setError("Upload at least one document.");
      return;
    }
    dispatch(setProviderDocs(files));
    dispatch(setCompleted(true));
    // TODO: Call backend to mark onboarding complete
    navigate("/provider/dashboard");
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} mb={2}>
        KYC Documents
      </Typography>
      <Paper
        variant="outlined"
        sx={{
          border: "2px dashed",
          borderColor: "grey.400",
          p: 4,
          mb: 2,
          textAlign: "center",
          bgcolor: "grey.50",
          cursor: "pointer",
        }}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <Typography color="text.secondary" mb={1}>
          Drag & drop files here or click to upload
        </Typography>
        <input
          type="file"
          multiple
          style={{ display: "none" }}
          id="kyc-upload"
          onChange={handleFileChange}
        />
        <label htmlFor="kyc-upload">
          <Button variant="outlined" component="span" size="small">
            Browse Files
          </Button>
        </label>
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          mt={1}
        >
          PNG, JPG, PDF up to 5MB
        </Typography>
      </Paper>
      <Grid container spacing={2}>
        {files.map((file, i) => (
          <Grid item xs={12} sm={6} key={i}>
            <Paper
              variant="outlined"
              sx={{
                p: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                bgcolor: "grey.100",
              }}
            >
              <Typography variant="body2" noWrap>
                {file.name}
              </Typography>
              <IconButton onClick={() => handleDelete(i)} size="small">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Paper>
          </Grid>
        ))}
      </Grid>
      {error && (
        <Typography color="error" variant="body2" mt={1}>
          {error}
        </Typography>
      )}
      <Box
        mt={4}
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        gap={2}
      >
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => dispatch(setStep(0))}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleComplete}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          Finish Onboarding
        </Button>
      </Box>
    </Box>
  );
}
