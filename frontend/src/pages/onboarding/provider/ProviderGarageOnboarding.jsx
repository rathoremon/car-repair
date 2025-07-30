// src/components/onboarding/provider/ProviderGarageOnboarding.jsx

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  uploadProviderDocs,
  saveProviderGeneralDetails,
  saveBankDetails,
  markOnboardingComplete,
  fetchProviderDocuments,
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
  Alert,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import ProgressBar from "../shared/ProgressBar";
import GarageDetailsForm from "./GarageDetailsForm";
import GarageImagesUpload from "./GarageImagesUpload";
import FileUploadZone from "../shared/FileUploadZone";
import BankDetailsForm from "./BankDetailsForm";
import { fetchServiceCategories } from "../../../features/serviceCategory/serviceCategoryThunks";

const STEPS = ["Garage Details", "Images & Documents", "Bank Details"];
const DRAFT_KEY = "provider_onboarding_draft_v1";
const DOC_TYPES = ["license", "gst", "id_proof"];

export default function ProviderGarageOnboarding() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const garage = useSelector((state) => state.onboarding.garage);
  const uploadState = useSelector((state) => state.onboarding.upload);
  const garageImages = useSelector((state) => state.onboarding.garageImages);
  const providerDocuments = useSelector(
    (state) => state.onboarding.providerDocuments
  );
  const serviceCategories = useSelector(
    (state) => state.serviceCategory.categories
  );

  const providerId = user?.provider?.id;

  // Local state for doc files (either File object or server doc object)
  const [docs, setDocs] = useState({
    license: null,
    gst: null,
    id_proof: null,
  });
  const [step, setStepLocal] = useState(0);
  const [errors, setErrors] = useState({});
  const [agreement, setAgreement] = useState(false);
  const [bankDetails, setBankDetails] = useState(() => {
    if (user?.provider) {
      return {
        accountHolderName: user.provider.accountHolderName || "",
        accountNumber: user.provider.accountNumber || "",
        ifscCode: user.provider.ifscCode || "",
        bankName: user.provider.bankName || "",
        branchName: user.provider.branchName || "",
        upiId: user.provider.upiId || "",
      };
    }
    return {
      accountHolderName: "",
      accountNumber: "",
      ifscCode: "",
      bankName: "",
      branchName: "",
      upiId: "",
    };
  });

  // --- Fetch categories and provider documents/images on mount ---
  useEffect(() => {
    dispatch(fetchServiceCategories());
    if (providerId) {
      dispatch(fetchProviderDocuments(providerId));
    }
    // eslint-disable-next-line
  }, [dispatch, providerId]);

  // --- Prefill docs from Redux providerDocuments array when available ---
  useEffect(() => {
    if (providerDocuments && providerDocuments.length > 0) {
      // Prefill docs state for each type
      setDocs((prev) => ({
        license: providerDocuments.find((d) => d.type === "license") || null,
        gst: providerDocuments.find((d) => d.type === "gst") || null,
        id_proof: providerDocuments.find((d) => d.type === "id_proof") || null,
      }));
    }
    // else leave as-is: user can upload
  }, [providerDocuments]);

  // --- Prefill serviceCategories in Redux garage state ---
  useEffect(() => {
    if (serviceCategories && serviceCategories.length) {
      const names = serviceCategories.map((cat) => cat.name);
      dispatch(setGarage({ ...garage, allCategories: names }));
    }
    // eslint-disable-next-line
  }, [serviceCategories]);

  // --- Handle onboarding draft restore from localStorage ---
  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      try {
        const {
          garage: g,
          docs: d,
          agreement: a,
          bankDetails: b,
          step: s,
        } = JSON.parse(draft);
        if (g) {
          dispatch(
            setGarage({
              ...g,
              categories: g.categories || g.serviceCategories || [],
              serviceCategories: g.serviceCategories || g.categories || [],
            })
          );
        }
        if (d) setDocs(d);
        if (typeof a === "boolean") setAgreement(a);
        if (b) setBankDetails(b);
        if (typeof s === "number") setStepLocal(s);
        toast.info("Restored your onboarding draft.", {
          toastId: "onboarding-restore",
        });
      } catch (e) {}
    }
    // eslint-disable-next-line
  }, []);

  // --- If onboarding is rejected, show reason and repopulate garage fields from backend ---
  useEffect(() => {
    if (user?.provider && user.provider.kycStatus === "rejected") {
      dispatch(
        setGarage({
          ...garage,
          ...user.provider,
          categories:
            user.provider.categories || user.provider.serviceCategories || [],
          serviceCategories:
            user.provider.serviceCategories || user.provider.categories || [],
        })
      );
      if (user.provider.rejectionReason) {
        toast.error(`Onboarding rejected: ${user.provider.rejectionReason}`, {
          toastId: "kyc-rejected",
        });
      }
    }
    // eslint-disable-next-line
  }, [user?.provider]);

  // --- Save local draft after any change in step/data ---
  useEffect(() => {
    if (user?.provider?.kycStatus !== "verified") {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ garage, docs, agreement, bankDetails, step })
      );
    }
  }, [garage, docs, agreement, bankDetails, step, user?.provider?.kycStatus]);

  const clearDraft = () => localStorage.removeItem(DRAFT_KEY);

  // --- Step 3 validation (bank details) ---
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

  // --- Main step handling/submit logic ---
  const handleNext = async () => {
    if (!providerId) {
      toast.error("Provider ID not found, cannot proceed.");
      return;
    }
    if (step === 0) {
      const errs = {};
      if (!garage.companyName) errs.companyName = "Required";
      if (!garage.serviceArea?.length) errs.serviceArea = "Add service area";
      if (!garage.location?.lat || !garage.location?.lng)
        errs.location = "Add location";
      if (!garage.categories?.length)
        errs.categories = "Select at least one service category";
      if (!garage.workingHours?.open || !garage.workingHours?.close)
        errs.workingHours = "Add working hours";
      if (!garage.availability?.length)
        errs.availability = "Choose availability";
      setErrors(errs);
      if (Object.keys(errs).length > 0) return;
      await dispatch(
        saveProviderGeneralDetails({ ...garage, providerId })
      ).unwrap();
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
      // Only send new docs (File objects) to uploadProviderDocs, not existing server docs
      const docsToUpload = {};
      for (const type of DOC_TYPES) {
        if (docs[type] && docs[type] instanceof File) {
          docsToUpload[type] = docs[type];
        } else if (
          docs[type] &&
          docs[type].file && // drag-n-drop case (if you wrap File in an object)
          docs[type].file instanceof File
        ) {
          docsToUpload[type] = docs[type].file;
        }
      }
      if (Object.keys(docsToUpload).length > 0) {
        await dispatch(
          uploadProviderDocs({ providerId, docs: docsToUpload })
        ).unwrap();
      }
      toast.success("Images & documents uploaded");
      setStepLocal(2);
    } else if (step === 2) {
      const errs = validateStep3();
      setErrors(errs);
      if (Object.keys(errs).length > 0) return;
      await dispatch(saveBankDetails({ ...bankDetails, providerId })).unwrap();
      await dispatch(markOnboardingComplete({ providerId })).unwrap();
      await dispatch(refreshUser());
      toast.success("Onboarding complete 🎉");
      clearDraft();
      navigate("/provider/pending", { replace: true });
    }
  };

  if (!providerId) return null; // Prevents rendering before providerId loads

  return (
    <Box className="w-full max-w-[900px] mx-auto">
      {user?.provider?.kycStatus === "rejected" &&
        user?.provider?.rejectionReason && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <strong>Onboarding Rejected:</strong>{" "}
            {user.provider.rejectionReason}
          </Alert>
        )}
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
              garage={garage || {}}
              errors={errors}
              onChange={(field, value) =>
                dispatch(setGarage({ ...(garage || {}), [field]: value }))
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
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(auto-fit, minmax(230px, 1fr))",
                },
                gap: 3,
                mb: 2,
                width: "100%",
              }}
            >
              {DOC_TYPES.map((type) => (
                <Box key={type}>
                  <FileUploadZone
                    label={type.replace("_", " ").toUpperCase()}
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
                </Box>
              ))}
            </Box>

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
