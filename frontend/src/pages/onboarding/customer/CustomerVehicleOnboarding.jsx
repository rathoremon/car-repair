// src/pages/onboarding/customer/CustomerVehicleOnboarding.jsx
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createVehicles,
  markOnboardingComplete,
} from "../../../features/onboarding/onboardingThunks";
import {
  setVehicles,
  setVehicleStepComplete,
  setStep,
} from "../../../features/onboarding/onboardingSlice";
import { refreshUser } from "../../../features/auth/authThunks";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, Skeleton, Fade } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import VehicleFormBlock from "./VehicleFormBlock";
import { toast } from "react-toastify";

const emptyVehicle = {
  make: "",
  model: "",
  year: "",
  registrationNumber: "",
  fuelType: "",
};

const DRAFT_KEY = "customer_vehicle_onboarding_draft_v1";

export default function CustomerVehicleOnboarding() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const vehiclesFromRedux =
    useSelector((state) => state.onboarding.vehicles) || [];
  const user = useSelector((state) => state.auth.user);
  const refreshStatus = useSelector((state) => state.auth.refreshStatus);

  // ------ RESTORE DRAFT ------
  const [localVehicles, setLocalVehicles] = useState(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      try {
        const { vehicles } = JSON.parse(draft);
        if (Array.isArray(vehicles) && vehicles.length) {
          toast.info("Restored your saved draft!", {
            toastId: "restore-draft",
          });
          return vehicles;
        }
      } catch {}
    }
    return vehiclesFromRedux.length ? vehiclesFromRedux : [{ ...emptyVehicle }];
  });

  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const firstErrorRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // ------ AUTO-SAVE DRAFT ------
  useEffect(() => {
    if (user?.role === "customer") {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ vehicles: localVehicles })
      );
    }
  }, [localVehicles, user?.role]);

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    toast.success("Draft cleared!", {
      toastId: "clear-draft",
      autoClose: 1800,
    });
  };

  const handleChange = (idx, field, value) => {
    setLocalVehicles((prev) =>
      prev.map((v, i) => (i === idx ? { ...v, [field]: value } : v))
    );
    setErrors((errs) =>
      errs.map((e, i) => (i === idx ? { ...e, [field]: undefined } : e))
    );
  };

  const handleAdd = () => {
    setLocalVehicles((prev) => [...prev, { ...emptyVehicle }]);
    setErrors((errs) => [...errs, {}]);
    toast.info("Added new vehicle form", {
      position: "bottom-center",
      autoClose: 2000,
    });
  };

  const handleDelete = (idx) => {
    if (localVehicles.length === 1) return;
    setLocalVehicles((prev) => prev.filter((_, i) => i !== idx));
    setErrors((errs) => errs.filter((_, i) => i !== idx));
    toast.info("Removed vehicle", {
      position: "bottom-center",
      autoClose: 2000,
    });
  };

  // Validation (unchanged)
  const validateVehicle = (vehicle) => {
    const errs = {};
    if (!vehicle.make) errs.make = "Make is required";
    if (!vehicle.model) errs.model = "Model is required";
    if (!vehicle.year) errs.year = "Year is required";
    if (!vehicle.registrationNumber) {
      errs.registrationNumber = "Registration number is required";
    } else if (
      !/^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/.test(vehicle.registrationNumber)
    ) {
      errs.registrationNumber = "Format: AA00AA0000";
    }
    if (!vehicle.fuelType) errs.fuelType = "Fuel type is required";
    return errs;
  };

  // Pre-submit dedupe check on reg numbers (client-side to save a round-trip)
  const findDuplicateRegistrations = (vehicles) => {
    const seen = new Map();
    const dupIdx = [];
    vehicles.forEach((v, i) => {
      const key = (v.registrationNumber || "").toUpperCase();
      if (!key) return;
      if (seen.has(key)) {
        dupIdx.push(i, seen.get(key));
      } else {
        seen.set(key, i);
      }
    });
    return Array.from(new Set(dupIdx)).sort((a, b) => a - b);
  };

  const handleRegisterVehicle = async () => {
    if (isSubmitting) return;

    // 1) Field-level validation
    const newErrors = localVehicles.map((v) => validateVehicle(v));
    setErrors(newErrors);
    const firstErrorIndex = newErrors.findIndex((e) => Object.keys(e).length);
    if (firstErrorIndex !== -1) {
      firstErrorRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      toast.error("Please fix errors before continuing", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    // 2) Dedupe reg numbers
    const dups = findDuplicateRegistrations(localVehicles);
    if (dups.length) {
      setErrors((prev) =>
        prev.map((e, i) =>
          dups.includes(i)
            ? { ...e, registrationNumber: "Duplicate registration number" }
            : e
        )
      );
      firstErrorRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      toast.error("Duplicate registration numbers found", {
        position: "top-center",
        autoClose: 2500,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // 3) Create vehicles on server (returns persisted rows with IDs)
      const responses = await dispatch(createVehicles(localVehicles)).unwrap();

      // 4) Store the server responses (not the local draft), so IDs are available
      dispatch(setVehicles(responses));
      dispatch(setVehicleStepComplete(true));

      // 5) Mark onboarding complete for customers (backend accepts empty body)
      await dispatch(markOnboardingComplete()).unwrap();

      // 6) Refresh user and clear draft
      await dispatch(refreshUser()).unwrap();
      clearDraft();

      toast.success("Vehicle details saved!", {
        position: "top-center",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Error saving vehicles:", error);
      toast.error(error || "Failed to save vehicles", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigate after refresh success (unchanged)
  useEffect(() => {
    if (refreshStatus === "succeeded") {
      if (user?.role === "customer") {
        navigate("/customer/home", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [refreshStatus, user, navigate]);

  const handleSkip = () => {
    dispatch(setVehicleStepComplete(false));
    dispatch(setStep(1));
    clearDraft();
    toast.info("Skipping vehicle details...", {
      position: "bottom-center",
      autoClose: 1500,
    });
    setTimeout(() => {
      if (user?.role === "customer")
        navigate("/customer/home", { replace: true });
      else navigate("/", { replace: true });
    }, 800);
  };

  return (
    <Box className="w-full flex flex-col min-h-[60vh] bg-[#f9fbff]">
      <div className="flex-1 flex flex-col items-center w-full px-4">
        <Fade in>
          <Typography
            variant="h5"
            fontWeight={700}
            className="mt-8 mb-6 pb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-400"
            sx={{
              letterSpacing: 0.5,
              textShadow: "0 2px 12px rgba(99,102,241,0.08)",
            }}
          >
            Add Your Vehicle(s)
          </Typography>
        </Fade>

        <div className="w-full max-w-4xl mx-auto">
          {loading ? (
            <div className="animate-pulse">
              <Skeleton
                variant="rectangular"
                height={220}
                className="rounded-2xl mb-6"
              />
            </div>
          ) : (
            <AnimatePresence>
              {localVehicles.map((vehicle, idx) => (
                <motion.div
                  key={idx}
                  ref={idx === 0 ? firstErrorRef : null}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <VehicleFormBlock
                    vehicle={vehicle}
                    idx={idx}
                    onChange={handleChange}
                    onDelete={() => handleDelete(idx)}
                    canDelete={localVehicles.length > 1}
                    errors={errors[idx] || {}}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="mt-6 flex justify-center"
          >
            <Button
              variant="outlined"
              color="primary"
              onClick={handleAdd}
              disabled={localVehicles.length >= 5 || isSubmitting}
              className="rounded-full px-6 py-2 hover:shadow-lg transition-transform transform hover:scale-105"
            >
              Add Another Vehicle
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Sticky Footer CTA */}
      <div className="sticky bottom-0 bg-white/90 backdrop-blur-md w-full shadow-md py-4 flex justify-center px-4">
        <div className="w-full max-w-4xl flex flex-col sm:flex-row gap-4">
          <Button
            variant="contained"
            color="primary"
            onClick={handleRegisterVehicle}
            disabled={isSubmitting}
            className="flex-1 rounded-full text-lg font-semibold py-3 transition-all hover:shadow-xl"
          >
            {isSubmitting ? "Saving..." : "Register Vehicle"}
          </Button>
          <Button
            variant="text"
            onClick={handleSkip}
            disabled={isSubmitting}
            className="flex-1 rounded-full text-lg font-semibold py-3 text-gray-600 hover:text-primary-600"
          >
            Skip for Now
          </Button>
        </div>
      </div>
    </Box>
  );
}
