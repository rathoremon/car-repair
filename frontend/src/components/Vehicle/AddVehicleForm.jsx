import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Grid,
  MenuItem,
  Typography,
  Box,
  IconButton,
  Fab,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useDispatch } from "react-redux";
import { FUEL_TYPES } from "../../utils/vehicleValidation";
import { uploadVehiclePhoto } from "../../features/customer/vehicles/vehicleThunks";
import { getImageUrl } from "../../utils/media";

const INSURANCE_TYPES = [
  { value: "comprehensive", label: "Comprehensive" },
  { value: "third-party", label: "Third-Party" },
  { value: "own-damage", label: "Own Damage" },
  { value: "zero-depreciation", label: "Zero Depreciation" },
];

const CAR_TYPES = [
  "Sedan",
  "SUV",
  "Hatchback",
  "Coupe",
  "Convertible",
  "Minivan",
  "Pickup",
  "Electric",
  "Hybrid",
  "Luxury",
  "Sports",
  "Other",
];

const years = Array.from(
  { length: new Date().getFullYear() - 1989 },
  (_, i) => 1990 + i
).reverse();

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.25 } },
};

const initialForm = {
  photoUrl: "",
  make: "",
  model: "",
  year: "",
  carType: "",
  registrationNumber: "",
  vin: "",
  engineNumber: "",
  fuelType: "",

  ownerName: "",
  ownerMobile: "",
  ownerEmail: "",

  insuranceCompany: "",
  policyNumber: "",
  insuranceType: "",
  premiumAmount: "",
  insuranceStartDate: "",
  insuranceExpiryDate: "",
  insuranceContact: "",

  pucCertificateNo: "",
  pucValidityDate: "",
  roadTaxCertificateNo: "",
  roadTaxValidityDate: "",

  lastServiceDate: "",
  lastServiceKM: "",
  nextServiceDueDate: "",
  nextServiceDueKM: "",
  oilChangeDate: "",
  oilChangeKM: "",
  batteryChangeDate: "",
  tyreChangeDate: "",
  brakeInspectionDate: "",
  suspensionCheckDate: "",
  wheelAlignmentDate: "",
  transmissionOilChangeDate: "",

  avgMonthlyKM: "",
  insuranceReminderDate: "",
  pucReminderDate: "",
  nextServiceReminderDate: "",
};

const toIso = (d) =>
  d
    ? dayjs(d, "DD-MM-YYYY", true).isValid()
      ? dayjs(d, "DD-MM-YYYY").format("YYYY-MM-DD")
      : dayjs(d).isValid()
      ? dayjs(d).format("YYYY-MM-DD")
      : ""
    : "";
const num = (v) =>
  v === "" || v === null || v === undefined || Number.isNaN(Number(v))
    ? null
    : Number(v);

export default function AddVehicleForm({
  open,
  handleClose,
  handleSave,
  initialData,
  title,
}) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(initialForm);
  const [photoFile, setPhotoFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      const fmt = (d) => (d ? dayjs(d).format("DD-MM-YYYY") : "");
      setFormData({
        ...initialForm,
        ...initialData,
        carType: initialData.carType || "",
        registrationNumber: initialData.registrationNumber || "",
        insuranceStartDate: fmt(initialData.insuranceStartDate),
        insuranceExpiryDate: fmt(initialData.insuranceExpiryDate),
        pucValidityDate: fmt(initialData.pucValidityDate),
        roadTaxValidityDate: fmt(initialData.roadTaxValidityDate),
        lastServiceDate: fmt(initialData.lastServiceDate),
        nextServiceDueDate: fmt(initialData.nextServiceDueDate),
        oilChangeDate: fmt(initialData.oilChangeDate),
        batteryChangeDate: fmt(initialData.batteryChangeDate),
        tyreChangeDate: fmt(initialData.tyreChangeDate),
        brakeInspectionDate: fmt(initialData.brakeInspectionDate),
        suspensionCheckDate: fmt(initialData.suspensionCheckDate),
        wheelAlignmentDate: fmt(initialData.wheelAlignmentDate),
        transmissionOilChangeDate: fmt(initialData.transmissionOilChangeDate),
        insuranceReminderDate: fmt(initialData.insuranceReminderDate),
        pucReminderDate: fmt(initialData.pucReminderDate),
        nextServiceReminderDate: fmt(initialData.nextServiceReminderDate),
      });
      setPhotoFile(null);
    } else {
      setFormData(initialForm);
      setPhotoFile(null);
    }
  }, [open, initialData]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const onPick = (name, dateObj) => {
    setFormData((p) => ({
      ...p,
      [name]: dateObj ? dateObj.format("DD-MM-YYYY") : "",
    }));
  };

  const handlePhotoClick = () => fileInputRef.current?.click();

  const handlePhotoUpload = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setPhotoFile(f);
      const url = URL.createObjectURL(f);
      setFormData((p) => ({ ...p, photoUrl: url }));
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setFormData((p) => ({ ...p, photoUrl: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const buildPayload = (d) => ({
    make: d.make || "",
    model: d.model || "",
    year: num(d.year),
    carType: d.carType || null,
    registrationNumber: (d.registrationNumber || "").toUpperCase(),
    vin: d.vin || "",
    engineNumber: d.engineNumber || "",
    fuelType: d.fuelType || "",

    ownerName: d.ownerName || "",
    ownerMobile: d.ownerMobile || "",
    ownerEmail: d.ownerEmail || "",

    insuranceCompany: d.insuranceCompany || "",
    policyNumber: d.policyNumber || "",
    insuranceType: d.insuranceType || "",
    premiumAmount: num(d.premiumAmount),
    insuranceStartDate: toIso(d.insuranceStartDate),
    insuranceExpiryDate: toIso(d.insuranceExpiryDate),
    insuranceContact: d.insuranceContact || "",

    pucCertificateNo: d.pucCertificateNo || "",
    pucValidityDate: toIso(d.pucValidityDate),
    roadTaxCertificateNo: d.roadTaxCertificateNo || "",
    roadTaxValidityDate: toIso(d.roadTaxValidityDate),

    lastServiceDate: toIso(d.lastServiceDate),
    lastServiceKM: num(d.lastServiceKM),
    nextServiceDueDate: toIso(d.nextServiceDueDate),
    nextServiceDueKM: num(d.nextServiceDueKM),
    oilChangeDate: toIso(d.oilChangeDate),
    oilChangeKM: num(d.oilChangeKM),
    batteryChangeDate: toIso(d.batteryChangeDate),
    tyreChangeDate: toIso(d.tyreChangeDate),
    brakeInspectionDate: toIso(d.brakeInspectionDate),
    suspensionCheckDate: toIso(d.suspensionCheckDate),
    wheelAlignmentDate: toIso(d.wheelAlignmentDate),
    transmissionOilChangeDate: toIso(d.transmissionOilChangeDate),

    avgMonthlyKM: num(d.avgMonthlyKM),
    insuranceReminderDate: toIso(d.insuranceReminderDate),
    pucReminderDate: toIso(d.pucReminderDate),
    nextServiceReminderDate: toIso(d.nextServiceReminderDate),
  });

  // REPLACE onSubmit WITH THIS
  const onSubmit = async () => {
    const payload = buildPayload(formData);

    const saved = await Promise.resolve(handleSave(payload));

    if (photoFile) {
      const targetId = initialData?.id || saved?.id;
      if (targetId) {
        try {
          await dispatch(
            uploadVehiclePhoto({ id: targetId, file: photoFile })
          ).unwrap();
        } catch (e) {
          console.error("Photo upload failed:", e);
        }
      }
    }

    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography
          variant="h5"
          align="center"
          fontWeight="bold"
          color="primary"
        >
          {title || (initialData ? "Edit Vehicle" : "Add New Vehicle")}
        </Typography>
      </DialogTitle>

      <DialogContent dividers sx={{ bgcolor: "#f9fafb" }}>
        <Stack spacing={4} sx={{ p: { xs: 1, sm: 3 } }}>
          {/* Photo */}
          <AnimatePresence>
            {open && (
              <motion.div
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Box>
                  <Typography
                    variant="h6"
                    color="primary"
                    fontWeight="bold"
                    mb={2}
                  >
                    Vehicle Photo
                  </Typography>
                  <Box
                    sx={{
                      border: "2px dashed #90caf9",
                      p: 2,
                      borderRadius: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      bgcolor: "#fff",
                    }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/avif"
                      hidden
                      onChange={handlePhotoUpload}
                    />
                    {formData.photoUrl ? (
                      <Box sx={{ position: "relative", width: "100%" }}>
                        <img
                          src={getImageUrl(formData.photoUrl)}
                          alt="Vehicle"
                          style={{ width: "100%", borderRadius: 12 }}
                        />
                        <IconButton
                          onClick={removePhoto}
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            bgcolor: "#fff",
                          }}
                        >
                          <HighlightOffIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ) : (
                      <Fab
                        color="primary"
                        onClick={handlePhotoClick}
                        sx={{ mb: 1 }}
                      >
                        <CloudUploadIcon />
                      </Fab>
                    )}
                    <Typography
                      variant="body2"
                      sx={{ cursor: "pointer", color: "primary.main" }}
                      onClick={handlePhotoClick}
                    >
                      {formData.photoUrl ? "Change Photo" : "Upload Photo"}
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Core Details */}
          <AnimatePresence>
            {open && (
              <motion.div
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 1,
                    bgcolor: "#fff",
                    border: "1px solid #e3f2fd",
                  }}
                >
                  <Typography
                    variant="h6"
                    color="primary"
                    fontWeight="bold"
                    mb={2}
                  >
                    Vehicle Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        label="Make"
                        name="make"
                        value={formData.make}
                        onChange={onChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        label="Model"
                        name="model"
                        value={formData.model}
                        onChange={onChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        select
                        label="Year"
                        name="year"
                        value={formData.year}
                        onChange={onChange}
                        fullWidth
                      >
                        {years.map((y) => (
                          <MenuItem key={y} value={y}>
                            {y}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        select
                        label="Car Type"
                        name="carType"
                        value={formData.carType || ""}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            carType: e.target.value,
                          }))
                        }
                        fullWidth
                      >
                        {CAR_TYPES.map((t) => (
                          <MenuItem key={t} value={t}>
                            {t}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        label="Registration Number"
                        name="registrationNumber"
                        value={formData.registrationNumber}
                        onChange={(e) =>
                          onChange({
                            target: {
                              name: "registrationNumber",
                              value: e.target.value.toUpperCase(),
                            },
                          })
                        }
                        placeholder="e.g. MH12AB1234"
                        inputProps={{
                          maxLength: 10,
                          style: { letterSpacing: 2 },
                        }}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        label="VIN (Chassis No)"
                        name="vin"
                        value={formData.vin}
                        onChange={onChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        label="Engine Number"
                        name="engineNumber"
                        value={formData.engineNumber}
                        onChange={onChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        select
                        label="Fuel Type"
                        name="fuelType"
                        value={formData.fuelType}
                        onChange={onChange}
                        fullWidth
                      >
                        {FUEL_TYPES.map((ft) => (
                          <MenuItem key={ft} value={ft}>
                            {ft}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Ownership */}
          <AnimatePresence>
            {open && (
              <motion.div
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 1,
                    bgcolor: "#fff",
                    border: "1px solid #e3f2fd",
                  }}
                >
                  <Typography
                    variant="h6"
                    color="primary"
                    fontWeight="bold"
                    mb={2}
                  >
                    Ownership
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        name="ownerName"
                        label="Owner Name"
                        value={formData.ownerName}
                        onChange={onChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        name="ownerMobile"
                        label="Owner Mobile"
                        value={formData.ownerMobile}
                        onChange={onChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        name="ownerEmail"
                        label="Owner Email"
                        value={formData.ownerEmail}
                        onChange={onChange}
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Insurance */}
          <AnimatePresence>
            {open && (
              <motion.div
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 1,
                    bgcolor: "#fff",
                    border: "1px solid #e3f2fd",
                  }}
                >
                  <Typography
                    variant="h6"
                    color="primary"
                    fontWeight="bold"
                    mb={2}
                  >
                    Insurance
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="insuranceCompany"
                        label="Insurance Company"
                        value={formData.insuranceCompany}
                        onChange={onChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="policyNumber"
                        label="Policy Number"
                        value={formData.policyNumber}
                        onChange={onChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        name="insuranceType"
                        label="Insurance Type"
                        value={formData.insuranceType}
                        onChange={onChange}
                        fullWidth
                      >
                        {INSURANCE_TYPES.map((opt) => (
                          <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="premiumAmount"
                        label="Premium Amount (₹)"
                        type="number"
                        value={formData.premiumAmount}
                        onChange={onChange}
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <DatePicker
                        label="Start Date"
                        value={
                          formData.insuranceStartDate
                            ? dayjs(formData.insuranceStartDate, "DD-MM-YYYY")
                            : null
                        }
                        onChange={(d) => onPick("insuranceStartDate", d)}
                        format="DD-MM-YYYY"
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            placeholder: "dd-mm-yyyy",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <DatePicker
                        label="Expiry Date"
                        value={
                          formData.insuranceExpiryDate
                            ? dayjs(formData.insuranceExpiryDate, "DD-MM-YYYY")
                            : null
                        }
                        onChange={(d) => onPick("insuranceExpiryDate", d)}
                        format="DD-MM-YYYY"
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            placeholder: "dd-mm-yyyy",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="insuranceContact"
                        label="Insurance Contact No."
                        value={formData.insuranceContact}
                        onChange={onChange}
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Certificates */}
          <AnimatePresence>
            {open && (
              <motion.div
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 1,
                    bgcolor: "#fff",
                    border: "1px solid #e3f2fd",
                  }}
                >
                  <Typography
                    variant="h6"
                    color="primary"
                    fontWeight="bold"
                    mb={2}
                  >
                    Certificates
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="pucCertificateNo"
                        label="PUC Certificate No"
                        value={formData.pucCertificateNo}
                        onChange={onChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <DatePicker
                        label="PUC Validity Date"
                        value={
                          formData.pucValidityDate
                            ? dayjs(formData.pucValidityDate, "DD-MM-YYYY")
                            : null
                        }
                        onChange={(d) => onPick("pucValidityDate", d)}
                        format="DD-MM-YYYY"
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            placeholder: "dd-mm-yyyy",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="roadTaxCertificateNo"
                        label="Road Tax Certificate No"
                        value={formData.roadTaxCertificateNo}
                        onChange={onChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <DatePicker
                        label="Road Tax Validity Date"
                        value={
                          formData.roadTaxValidityDate
                            ? dayjs(formData.roadTaxValidityDate, "DD-MM-YYYY")
                            : null
                        }
                        onChange={(d) => onPick("roadTaxValidityDate", d)}
                        format="DD-MM-YYYY"
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            placeholder: "dd-mm-yyyy",
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Maintenance */}
          <AnimatePresence>
            {open && (
              <motion.div
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 1,
                    bgcolor: "#fff",
                    border: "1px solid #e3f2fd",
                  }}
                >
                  <Typography
                    variant="h6"
                    color="primary"
                    fontWeight="bold"
                    mb={2}
                  >
                    Maintenance
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <DatePicker
                        label="Last Service Date"
                        value={
                          formData.lastServiceDate
                            ? dayjs(formData.lastServiceDate, "DD-MM-YYYY")
                            : null
                        }
                        onChange={(d) => onPick("lastServiceDate", d)}
                        format="DD-MM-YYYY"
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="lastServiceKM"
                        label="Last Service KM"
                        type="number"
                        value={formData.lastServiceKM}
                        onChange={onChange}
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <DatePicker
                        label="Next Service Due"
                        value={
                          formData.nextServiceDueDate
                            ? dayjs(formData.nextServiceDueDate, "DD-MM-YYYY")
                            : null
                        }
                        onChange={(d) => onPick("nextServiceDueDate", d)}
                        format="DD-MM-YYYY"
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="nextServiceDueKM"
                        label="Next Service Due KM"
                        type="number"
                        value={formData.nextServiceDueKM}
                        onChange={onChange}
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <DatePicker
                        label="Oil Change Date"
                        value={
                          formData.oilChangeDate
                            ? dayjs(formData.oilChangeDate, "DD-MM-YYYY")
                            : null
                        }
                        onChange={(d) => onPick("oilChangeDate", d)}
                        format="DD-MM-YYYY"
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="oilChangeKM"
                        label="Oil Change KM"
                        type="number"
                        value={formData.oilChangeKM}
                        onChange={onChange}
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <DatePicker
                        label="Battery Change"
                        value={
                          formData.batteryChangeDate
                            ? dayjs(formData.batteryChangeDate, "DD-MM-YYYY")
                            : null
                        }
                        onChange={(d) => onPick("batteryChangeDate", d)}
                        format="DD-MM-YYYY"
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <DatePicker
                        label="Tyre Change"
                        value={
                          formData.tyreChangeDate
                            ? dayjs(formData.tyreChangeDate, "DD-MM-YYYY")
                            : null
                        }
                        onChange={(d) => onPick("tyreChangeDate", d)}
                        format="DD-MM-YYYY"
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <DatePicker
                        label="Brake Inspection"
                        value={
                          formData.brakeInspectionDate
                            ? dayjs(formData.brakeInspectionDate, "DD-MM-YYYY")
                            : null
                        }
                        onChange={(d) => onPick("brakeInspectionDate", d)}
                        format="DD-MM-YYYY"
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <DatePicker
                        label="Suspension Check"
                        value={
                          formData.suspensionCheckDate
                            ? dayjs(formData.suspensionCheckDate, "DD-MM-YYYY")
                            : null
                        }
                        onChange={(d) => onPick("suspensionCheckDate", d)}
                        format="DD-MM-YYYY"
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <DatePicker
                        label="Wheel Alignment"
                        value={
                          formData.wheelAlignmentDate
                            ? dayjs(formData.wheelAlignmentDate, "DD-MM-YYYY")
                            : null
                        }
                        onChange={(d) => onPick("wheelAlignmentDate", d)}
                        format="DD-MM-YYYY"
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <DatePicker
                        label="Transmission Oil Change"
                        value={
                          formData.transmissionOilChangeDate
                            ? dayjs(
                                formData.transmissionOilChangeDate,
                                "DD-MM-YYYY"
                              )
                            : null
                        }
                        onChange={(d) => onPick("transmissionOilChangeDate", d)}
                        format="DD-MM-YYYY"
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="avgMonthlyKM"
                        label="Average Monthly KM"
                        type="number"
                        value={formData.avgMonthlyKM}
                        onChange={onChange}
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Reminders */}
          <AnimatePresence>
            {open && (
              <motion.div
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 1,
                    bgcolor: "#fff",
                    border: "1px solid #e3f2fd",
                  }}
                >
                  <Typography
                    variant="h6"
                    color="primary"
                    fontWeight="bold"
                    mb={2}
                  >
                    Smart Reminders
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <DatePicker
                        label="Insurance Reminder"
                        value={
                          formData.insuranceReminderDate
                            ? dayjs(
                                formData.insuranceReminderDate,
                                "DD-MM-YYYY"
                              )
                            : null
                        }
                        onChange={(d) => onPick("insuranceReminderDate", d)}
                        format="DD-MM-YYYY"
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <DatePicker
                        label="PUC Reminder"
                        value={
                          formData.pucReminderDate
                            ? dayjs(formData.pucReminderDate, "DD-MM-YYYY")
                            : null
                        }
                        onChange={(d) => onPick("pucReminderDate", d)}
                        format="DD-MM-YYYY"
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <DatePicker
                        label="Service Reminder"
                        value={
                          formData.nextServiceReminderDate
                            ? dayjs(
                                formData.nextServiceReminderDate,
                                "DD-MM-YYYY"
                              )
                            : null
                        }
                        onChange={(d) => onPick("nextServiceReminderDate", d)}
                        format="DD-MM-YYYY"
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: "#f1f5f9" }}>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={onSubmit} variant="contained">
          {initialData ? "Update Vehicle" : "Save Vehicle"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
