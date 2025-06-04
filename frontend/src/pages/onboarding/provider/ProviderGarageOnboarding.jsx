// src/components/onboarding/provider/ProviderGarageOnboarding.jsx
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setGarage,
  uploadProviderDocs,
  saveProviderGeneralDetails,
  markOnboardingComplete, // ✅ Import new thunk here
} from "../../../features/onboarding/onboardingSlice";
import { refreshUser } from "../../../features/auth/authSlice";
import {
  Box,
  Button,
  Typography,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Checkbox,
  FormControlLabel,
  Grid,
} from "@mui/material";
import ProgressBar from "../shared/ProgressBar";
import GarageDetailsForm from "./GarageDetailsForm";
import FileUploadZone from "../shared/FileUploadZone";
import GarageImagesUpload from "./GarageImagesUpload";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const STEPS = ["General Details", "Garage Images & Documents"];

export default function ProviderGarageOnboarding() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const garage = useSelector((state) => state.onboarding.garage);
  const uploadState = useSelector((state) => state.onboarding.upload);
  const garageImages = useSelector((state) => state.onboarding.garageImages);
  const garageImagesUploading = useSelector(
    (state) => state.onboarding.garageImagesUploading
  );
  const user = useSelector((state) => state.auth.user);

  const [step, setStepLocal] = useState(0);
  const [localGarage, setLocalGarage] = useState({
    ...garage,
    serviceAreas: garage.serviceAreas || [],
    categories: garage.categories || [],
    radius: garage.radius || 5,
  });
  const [errors, setErrors] = useState({});
  const [docs, setDocs] = useState({
    license: null,
    gst: null,
    id_proof: null,
  });
  const [agreement, setAgreement] = useState(false);

  const handleChange = (field, value) => {
    setLocalGarage((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleCategoryToggle = (cat) => {
    setLocalGarage((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }));
  };

  const handleDocsChange = (type, file) => {
    setDocs((prev) => ({ ...prev, [type]: file }));
  };

  const handleDocsDelete = (type) => {
    setDocs((prev) => ({ ...prev, [type]: null }));
  };

  const validateStep1 = () => {
    const errs = {};
    if (!localGarage.companyName) errs.companyName = "Garage name is required";
    if (!localGarage.serviceArea || localGarage.serviceArea.length === 0)
      errs.serviceArea = "At least one service area is required";
    if (
      !localGarage.location ||
      !localGarage.location.lat ||
      !localGarage.location.lng
    )
      errs.location = "Location is required";
    if (!localGarage.availability || localGarage.availability.length === 0)
      errs.availability = "Select available days";
    if (
      !localGarage.workingHours ||
      !localGarage.workingHours.open ||
      !localGarage.workingHours.close
    )
      errs.workingHours = "Set opening and closing time";
    return errs;
  };

  const validateStep2 = () => {
    const errs = {};
    if (!agreement) errs.agreement = "You must accept the terms";
    if (garageImages.length < 3)
      errs.garageImages = "Please upload at least 3 garage images.";
    return errs;
  };

  const handleContinueStep1 = async () => {
    const errs = validateStep1();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      const payload = {
        companyName: localGarage.companyName,
        serviceArea: localGarage.serviceArea,
        location: localGarage.location,
        availability: localGarage.availability,
        workingHours: localGarage.workingHours,
      };
      await dispatch(saveProviderGeneralDetails(payload)).unwrap();
      dispatch(setGarage(payload));
      setStepLocal(1);
      toast.success("General details saved!", { position: "top-center" });
    } catch (err) {
      toast.error(err || "Failed to save details", { position: "top-center" });
    }
  };

  const handleContinueStep2 = async () => {
    const errs = validateStep2();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      await dispatch(uploadProviderDocs({ docs })).unwrap();
      await dispatch(markOnboardingComplete()).unwrap(); // ✅ Call new thunk here
      await dispatch(refreshUser()).unwrap(); // ✅ Refresh user data
      toast.success("Garage images and documents uploaded!", {
        position: "top-center",
      });

      setTimeout(() => {
        navigate("/provider/dashboard");
      }, 1200);
    } catch (err) {
      toast.error(err || "Upload failed. Please try again.", {
        position: "top-center",
      });
    }
  };

  // --- Render ---
  return (
    <Box className="w-full max-w-[700px] mx-auto min-h-screen flex flex-col justify-between">
      <ProgressBar step={step} total={STEPS.length} />
      <Stepper activeStep={step} alternativeLabel sx={{ mb: 3 }}>
        {STEPS.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box className="flex-1">
        {step === 0 && (
          <>
            <Typography
              variant="h5"
              fontWeight={700}
              className="mt-8 mb-4 text-slate-800"
            >
              Garage/Workshop Details
            </Typography>
            <GarageDetailsForm
              garage={localGarage}
              errors={errors}
              onChange={handleChange}
              onCategoryToggle={handleCategoryToggle}
            />
            <Box className="mt-6 flex justify-end">
              <Button
                variant="contained"
                color="primary"
                onClick={handleContinueStep1}
                aria-label="Continue"
              >
                Continue
              </Button>
            </Box>
          </>
        )}
        {step === 1 && (
          <>
            <Divider className="my-6" />
            <Typography
              variant="h6"
              fontWeight={600}
              className="mb-2 text-slate-800"
            >
              Garage Images
            </Typography>
            <GarageImagesUpload />
            {errors.garageImages && (
              <Typography color="error" variant="caption" sx={{ mt: 1, mb: 2 }}>
                {errors.garageImages}
              </Typography>
            )}
            <Divider className="my-6" />
            <Typography
              variant="h6"
              fontWeight={600}
              className="mb-2 text-slate-800"
            >
              Document Uploads
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FileUploadZone
                  label="Business License (PDF, JPG, PNG)"
                  files={docs.license ? [docs.license] : []}
                  onFileChange={(e) =>
                    handleDocsChange("license", e.target.files[0])
                  }
                  onDelete={() => handleDocsDelete("license")}
                  accept=".pdf,.jpg,.jpeg,.png"
                  maxSizeMB={5}
                  single
                  uploading={uploadState.uploading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FileUploadZone
                  label="GST Registration (PDF, JPG, PNG)"
                  files={docs.gst ? [docs.gst] : []}
                  onFileChange={(e) =>
                    handleDocsChange("gst", e.target.files[0])
                  }
                  onDelete={() => handleDocsDelete("gst")}
                  accept=".pdf,.jpg,.jpeg,.png"
                  maxSizeMB={5}
                  single
                  uploading={uploadState.uploading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FileUploadZone
                  label="Owner ID Proof (PDF, JPG, PNG)"
                  files={docs.id_proof ? [docs.id_proof] : []}
                  onFileChange={(e) =>
                    handleDocsChange("id_proof", e.target.files[0])
                  }
                  onDelete={() => handleDocsDelete("id_proof")}
                  accept=".pdf,.jpg,.jpeg,.png"
                  maxSizeMB={5}
                  single
                  uploading={uploadState.uploading}
                />
              </Grid>
            </Grid>
            <Box className="mt-4">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={agreement}
                    onChange={(e) => setAgreement(e.target.checked)}
                    color="primary"
                    inputProps={{ "aria-label": "Accept Terms & Conditions" }}
                  />
                }
                label={
                  <Typography variant="body2">
                    I agree to the{" "}
                    <a
                      href="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-indigo-600"
                    >
                      Terms & Conditions
                    </a>
                  </Typography>
                }
              />
              {errors.agreement && (
                <Typography
                  color="error"
                  variant="caption"
                  className="block mt-1"
                >
                  {errors.agreement}
                </Typography>
              )}
              {uploadState.error && (
                <Typography
                  color="error"
                  variant="caption"
                  className="block mt-1"
                >
                  {uploadState.error}
                </Typography>
              )}
            </Box>
            <Box className="mt-6 flex justify-end">
              <Button
                variant="contained"
                color="primary"
                onClick={handleContinueStep2}
                aria-label="Finish"
                disabled={uploadState.uploading || garageImagesUploading}
              >
                {uploadState.uploading || garageImagesUploading
                  ? "Uploading..."
                  : "Finish"}
              </Button>
            </Box>
          </>
        )}
      </Box>
      <ToastContainer />
    </Box>
  );
}
