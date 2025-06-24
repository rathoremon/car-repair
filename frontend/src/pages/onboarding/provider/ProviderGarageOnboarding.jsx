// 📁 src/components/onboarding/provider/ProviderGarageOnboarding.jsx
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  uploadProviderDocs,
  saveProviderGeneralDetails,
  saveBankDetails,
  markOnboardingComplete,
} from "../../../features/onboarding/onboardingThunks";
import { refreshUser } from "../../../features/auth/authThunks";
import { setGarage } from "../../../features/onboarding/onboardingSlice";
import {
  Box,
  Button,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Grid,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import ProgressBar from "../shared/ProgressBar";
import GarageDetailsForm from "./GarageDetailsForm";
import GarageImagesUpload from "./GarageImagesUpload";
import FileUploadZone from "../shared/FileUploadZone";
import BankDetailsForm from "./BankDetailsForm";

const STEPS = ["Garage Details", "Images & Documents", "Bank Details"];

export default function ProviderGarageOnboarding() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const garage = useSelector((state) => state.onboarding.garage);
  const user = useSelector((state) => state.auth.user);
  const uploadState = useSelector((state) => state.onboarding.upload);
  const garageImages = useSelector((state) => state.onboarding.garageImages);

  const [step, setStepLocal] = useState(0);
  const [errors, setErrors] = useState({});
  const [docs, setDocs] = useState({
    license: null,
    gst: null,
    id_proof: null,
  });
  const [agreement, setAgreement] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    branchName: "",
    upiId: "",
  });

  const validateStep3 = () => {
    const err = {};
    if (!bankDetails.accountHolderName) err.accountHolderName = "Required";
    if (!bankDetails.accountNumber.match(/^\d{9,18}$/))
      err.accountNumber = "Invalid number";
    if (!bankDetails.ifscCode.match(/^[A-Z]{4}0[A-Z0-9]{6}$/))
      err.ifscCode = "Invalid IFSC";
    if (!bankDetails.bankName) err.bankName = "Required";
    if (!bankDetails.branchName) err.branchName = "Required";
    return err;
  };

  const handleNext = async () => {
    if (step === 0) {
      const errs = {};
      if (!garage.companyName) errs.companyName = "Required";
      if (!garage.categories?.length)
        errs.categories = "Select at least one category";
      if (!garage.serviceArea?.length) errs.serviceArea = "Add service area";
      if (!garage.location?.lat || !garage.location?.lng)
        errs.location = "Add location";
      if (!garage.workingHours?.open || !garage.workingHours?.close)
        errs.workingHours = "Add working hours";
      if (!garage.availability?.length)
        errs.availability = "Choose availability";
      setErrors(errs);
      if (Object.keys(errs).length > 0) return;

      await dispatch(saveProviderGeneralDetails(garage)).unwrap();
      dispatch(setGarage(garage));
      toast.success("Garage details saved");
      setStepLocal(1);
    } else if (step === 1) {
      const errs = {};
      if (!agreement) errs.agreement = "Accept terms";
      if (garageImages.length < 3)
        errs.garageImages = "Upload at least 3 images";
      setErrors(errs);
      if (Object.keys(errs).length > 0) return;

      await dispatch(uploadProviderDocs({ docs })).unwrap();
      toast.success("Images & documents uploaded");
      setStepLocal(2);
    } else if (step === 2) {
      const errs = validateStep3();
      setErrors(errs);
      if (Object.keys(errs).length > 0) return;

      await dispatch(saveBankDetails(bankDetails)).unwrap();
      await dispatch(markOnboardingComplete()).unwrap();
      await dispatch(refreshUser()).unwrap();
      toast.success("Onboarding complete 🎉");
      navigate("/provider/dashboard");
    }
  };

  return (
    <Box className="w-full max-w-[700px] mx-auto">
      <ProgressBar step={step} total={STEPS.length} />
      <Stepper activeStep={step} alternativeLabel sx={{ mb: 3 }}>
        {STEPS.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box>
        {step === 0 && (
          <>
            <Typography variant="h6" gutterBottom>
              Garage Details
            </Typography>
            <GarageDetailsForm
              garage={garage}
              errors={errors}
              onChange={(field, value) =>
                dispatch(setGarage({ ...garage, [field]: value }))
              }
            />
          </>
        )}
        {step === 1 && (
          <>
            <Divider className="my-4" />
            <GarageImagesUpload />
            <Divider className="my-4" />
            <Typography variant="h6">Documents</Typography>
            <Grid container spacing={2}>
              {["license", "gst", "id_proof"].map((type) => (
                <Grid item xs={12} sm={6} key={type}>
                  <FileUploadZone
                    label={type.toUpperCase()}
                    files={docs[type] ? [docs[type]] : []}
                    onFileChange={(e) =>
                      setDocs({ ...docs, [type]: e.target.files[0] })
                    }
                    onDelete={() => setDocs({ ...docs, [type]: null })}
                    accept=".pdf,.jpg,.jpeg,.png"
                    maxSizeMB={5}
                    single
                    uploading={uploadState.uploading}
                  />
                </Grid>
              ))}
            </Grid>
            <FormControlLabel
              control={
                <Checkbox
                  checked={agreement}
                  onChange={(e) => setAgreement(e.target.checked)}
                />
              }
              label="I agree to the Terms & Conditions"
            />
            {errors.agreement && (
              <Typography color="error">{errors.agreement}</Typography>
            )}
          </>
        )}
        {step === 2 && (
          <>
            <Typography variant="h6" gutterBottom>
              Bank Details
            </Typography>
            <BankDetailsForm
              values={bankDetails}
              onChange={setBankDetails}
              errors={errors}
            />
          </>
        )}
      </Box>
      <Box className="mt-6 flex justify-end">
        <Button variant="contained" color="primary" onClick={handleNext}>
          {step === 2 ? "Finish" : "Continue"}
        </Button>
      </Box>
      <ToastContainer />
    </Box>
  );
}
