import React, { useState, useEffect, useRef } from "react";
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
  Tooltip,
  IconButton,
  Fab,
  Box,
  Typography,
} from "@mui/material";

import {
  InfoOutlined as InfoOutlinedIcon,
  CloudUpload as CloudUploadIcon,
  HighlightOff as HighlightOffIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const insuranceTypes = [
  { value: "comprehensive", label: "Comprehensive" },
  { value: "third-party", label: "Third-Party" },
  { value: "own-damage", label: "Own Damage" },
  { value: "zero-depreciation", label: "Zero Depreciation" },
];

const carTypes = [
  { value: "sedan", label: "Sedan" },
  { value: "suv", label: "SUV" },
  { value: "hatchback", label: "Hatchback" },
  { value: "coupe", label: "Coupe" },
  { value: "convertible", label: "Convertible" },
  { value: "minivan", label: "Minivan" },
  { value: "pickup", label: "Pickup Truck" },
  { value: "electric", label: "Electric Vehicle" },
  { value: "hybrid", label: "Hybrid" },
  { value: "luxury", label: "Luxury Car" },
  { value: "sports", label: "Sports Car" },
  { value: "other", label: "Other" },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } },
};

const AddVehicleForm = ({ open, handleClose, handleSave, initialData }) => {
  const initialForm = {
    vehiclePhoto: null,
    vehiclePhotoUrl: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    carType: "",
    registrationNumber: "",
    vin: "",
    engineNumber: "",
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
    insuranceReminderDate: "",
    pucReminderDate: "",
    nextServiceReminderDate: "",
    avgMonthlyKM: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      const formatDate = (date) =>
        date ? dayjs(date).format("DD-MM-YYYY") : "";

      setFormData((prev) => ({
        ...initialForm,
        ...initialData,
        vehiclePhotoUrl: initialData.vehiclePhotoUrl || "",
        insuranceStartDate: formatDate(initialData.insuranceStartDate),
        insuranceExpiryDate: formatDate(initialData.insuranceExpiryDate),
        pucValidityDate: formatDate(initialData.pucValidityDate),
        roadTaxValidityDate: formatDate(initialData.roadTaxValidityDate),
        lastServiceDate: formatDate(initialData.lastServiceDate),
        nextServiceDueDate: formatDate(initialData.nextServiceDueDate),
        oilChangeDate: formatDate(initialData.oilChangeDate),
        batteryChangeDate: formatDate(initialData.batteryChangeDate),
        tyreChangeDate: formatDate(initialData.tyreChangeDate),
        brakeInspectionDate: formatDate(initialData.brakeInspectionDate),
        suspensionCheckDate: formatDate(initialData.suspensionCheckDate),
        wheelAlignmentDate: formatDate(initialData.wheelAlignmentDate),
        transmissionOilChangeDate: formatDate(
          initialData.transmissionOilChangeDate
        ),

        insuranceReminderDate: formatDate(initialData.insuranceReminderDate),
        pucReminderDate: formatDate(initialData.pucReminderDate),
        nextServiceReminderDate: formatDate(
          initialData.nextServiceReminderDate
        ),
        insuranceType: initialData.insuranceType?.toLowerCase() || "",
        carType: initialData.carType?.toLowerCase() || "",
      }));
    } else {
      setFormData(initialForm);
    }
  }, [open, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        vehiclePhoto: file,
        vehiclePhotoUrl: URL.createObjectURL(file),
      }));
    }
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({
      ...prev,
      vehiclePhoto: null,
      vehiclePhotoUrl: "",
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = () => {
    handleSave(formData);
    handleClose();
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      sx={{
        bgcolor: "#f9fafb",
      }}
    >
      <DialogTitle>
        <Typography
          variant="h5"
          align="center"
          sx={{
            fontWeight: "bold",
            color: "primary.main",
            py: 2,
          }}
        >
          {initialData ? "Edit Vehicle" : "Add New Vehicle"}
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Stack
          spacing={4}
          sx={{
            bgcolor: "#f9fafb",
            p: { xs: 1, sm: 3, md: 4, lg: 5, xl: 6 },
          }}
        >
          {/* Vehicle Photo Section */}
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
                    fontWeight="bold"
                    color="primary"
                    mb={3}
                  >
                    Vehicle Photo
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box width={{ xs: "115%", sm: "75vw", md: "59.8vw" }}>
                        <Box
                          sx={{
                            border: "2px dashed #90caf9",
                            borderRadius: 1,
                            p: { xs: 2, sm: 3 },
                            width: { xs: "100%", md: "100%" },
                            bgcolor: "#f9fafb",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            textAlign: "center",
                            alignItems: "center",
                          }}
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            hidden
                            id="vehicle-photo-upload"
                            onChange={handlePhotoUpload}
                          />
                          {formData.vehiclePhotoUrl ? (
                            <Box
                              sx={{
                                position: "relative",
                                width: "100%",
                              }}
                            >
                              <img
                                src={formData.vehiclePhotoUrl}
                                alt="Vehicle"
                                style={{
                                  display: "block",
                                  width: "100%",
                                  height: "auto", // Let height adjust automatically
                                  maxHeight: 250, // Optional: limit max height
                                  objectFit: "cover",
                                  borderRadius: 12,
                                }}
                              />
                              <IconButton
                                onClick={handleRemovePhoto}
                                size="small"
                                sx={{
                                  position: "absolute",
                                  top: 8,
                                  right: 8,
                                  bgcolor: "#fff",
                                  "&:hover": {
                                    bgcolor: "#f44336",
                                    color: "#fff",
                                  },
                                }}
                              >
                                <HighlightOffIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          ) : (
                            <Fab
                              color="primary"
                              onClick={() => fileInputRef.current.click()}
                              size="medium"
                              sx={{ mb: 1 }}
                            >
                              <CloudUploadIcon />
                            </Fab>
                          )}
                          <Typography
                            variant="body2"
                            sx={{
                              cursor: "pointer",
                              fontWeight: "medium",
                              color: "primary.main",
                            }}
                            onClick={() => fileInputRef.current.click()}
                          >
                            {formData.vehiclePhotoUrl
                              ? "Change Photo"
                              : "Upload Photo"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Max 5MB, JPG or PNG only.
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Vehicle Details Section */}
          <AnimatePresence>
            {open && (
              <motion.div
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Box
                  className="bg-white p-6 rounded-xl shadow-lg  relative"
                  sx={{
                    p: 3,
                    borderRadius: 1,
                    border: "1px solid #e3f2fd",
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="primary"
                    mb={3}
                  >
                    Vehicle Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        name="vehicleMake"
                        label="Make"
                        fullWidth
                        value={formData.vehicleMake}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        name="vehicleModel"
                        label="Model"
                        fullWidth
                        value={formData.vehicleModel}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        name="vehicleYear"
                        label="Year"
                        type="number"
                        fullWidth
                        value={formData.vehicleYear}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        select
                        name="carType"
                        label="Car Type"
                        fullWidth
                        value={formData.carType}
                        onChange={handleChange}
                        sx={{
                          width: { xs: "56.5vw", sm: "13.7vw" },
                        }}
                      >
                        {carTypes.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        name="registrationNumber"
                        label="Registration Number"
                        fullWidth
                        value={formData.registrationNumber}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        name="vin"
                        label="VIN (Chassis No)"
                        fullWidth
                        value={formData.vin}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        name="engineNumber"
                        label="Engine Number"
                        fullWidth
                        value={formData.engineNumber}
                        onChange={handleChange}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Ownership Section */}
          <AnimatePresence>
            {open && (
              <motion.div
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Box
                  className="bg-white p-6 rounded-xl shadow-lg  relative"
                  sx={{
                    p: 3,
                    borderRadius: 1,
                    border: "1px solid #e3f2fd",
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="primary"
                    mb={3}
                  >
                    Ownership Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        name="ownerName"
                        label="Owner Name"
                        fullWidth
                        value={formData.ownerName}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        name="ownerMobile"
                        label="Owner Mobile"
                        fullWidth
                        value={formData.ownerMobile}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        name="ownerEmail"
                        label="Owner Email"
                        type="email"
                        fullWidth
                        value={formData.ownerEmail}
                        onChange={handleChange}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Insurance Section */}
          <AnimatePresence>
            {open && (
              <motion.div
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Box
                  className="bg-white p-6 rounded-xl shadow-lg  relative"
                  sx={{
                    p: 3,
                    borderRadius: 1,
                    border: "1px solid #e3f2fd",
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="primary"
                    mb={3}
                  >
                    Insurance Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="insuranceCompany"
                        label="Insurance Company"
                        fullWidth
                        value={formData.insuranceCompany}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="policyNumber"
                        label="Policy Number"
                        fullWidth
                        value={formData.policyNumber}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        name="insuranceType"
                        label="Insurance Type"
                        fullWidth
                        value={formData.insuranceType}
                        onChange={handleChange}
                        sx={{
                          width: { xs: "56.5vw", sm: "13.7vw" },
                        }}
                      >
                        {insuranceTypes.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="premiumAmount"
                        label="Premium Amount (₹)"
                        type="number"
                        fullWidth
                        value={formData.premiumAmount}
                        onChange={handleChange}
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
                        onChange={(date) => {
                          setFormData((prev) => ({
                            ...prev,
                            insuranceStartDate: date
                              ? date.format("DD-MM-YYYY")
                              : "",
                          }));
                        }}
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
                        onChange={(date) => {
                          setFormData((prev) => ({
                            ...prev,
                            insuranceExpiryDate: date
                              ? date.format("DD-MM-YYYY")
                              : "",
                          }));
                        }}
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
                        fullWidth
                        value={formData.insuranceContact}
                        onChange={handleChange}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Certificates Section */}
          <AnimatePresence>
            {open && (
              <motion.div
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Box
                  className="bg-white p-6 rounded-xl shadow-lg  relative"
                  sx={{
                    p: 3,
                    borderRadius: 1,
                    border: "1px solid #e3f2fd",
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="primary"
                    mb={3}
                  >
                    Certificates
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="pucCertificateNo"
                        label="PUC Certificate No"
                        fullWidth
                        value={formData.pucCertificateNo}
                        onChange={handleChange}
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
                        onChange={(date) => {
                          setFormData((prev) => ({
                            ...prev,
                            pucValidityDate: date
                              ? date.format("DD-MM-YYYY")
                              : "",
                          }));
                        }}
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
                        fullWidth
                        value={formData.roadTaxCertificateNo}
                        onChange={handleChange}
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
                        onChange={(date) => {
                          setFormData((prev) => ({
                            ...prev,
                            roadTaxValidityDate: date
                              ? date.format("DD-MM-YYYY")
                              : "",
                          }));
                        }}
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

          {/* Maintenance Section */}
          <AnimatePresence>
            {open && (
              <motion.div
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Box
                  className="bg-white p-6 rounded-xl shadow-lg  relative"
                  sx={{
                    p: 3,
                    borderRadius: 1,
                    border: "1px solid #e3f2fd",
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="primary"
                    mb={3}
                  >
                    Maintenance History
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
                        onChange={(date) => {
                          setFormData((prev) => ({
                            ...prev,
                            lastServiceDate: date
                              ? date.format("DD-MM-YYYY")
                              : "",
                          }));
                        }}
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
                        name="lastServiceKM"
                        label="Last Service KM"
                        type="number"
                        fullWidth
                        value={formData.lastServiceKM}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <DatePicker
                        label="Next Service Due Date"
                        value={
                          formData.nextServiceDueDate
                            ? dayjs(formData.nextServiceDueDate, "DD-MM-YYYY")
                            : null
                        }
                        onChange={(date) => {
                          setFormData((prev) => ({
                            ...prev,
                            nextServiceDueDate: date
                              ? date.format("DD-MM-YYYY")
                              : "",
                          }));
                        }}
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
                        name="nextServiceDueKM"
                        label="Next Service Due KM"
                        type="number"
                        fullWidth
                        value={formData.nextServiceDueKM}
                        onChange={handleChange}
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
                        onChange={(date) => {
                          setFormData((prev) => ({
                            ...prev,
                            oilChangeDate: date
                              ? date.format("DD-MM-YYYY")
                              : "",
                          }));
                        }}
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
                        name="oilChangeKM"
                        label="Oil Change KM"
                        type="number"
                        fullWidth
                        value={formData.oilChangeKM}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <DatePicker
                        label="Battery Change Date"
                        value={
                          formData.batteryChangeDate
                            ? dayjs(formData.batteryChangeDate, "DD-MM-YYYY")
                            : null
                        }
                        onChange={(date) => {
                          setFormData((prev) => ({
                            ...prev,
                            batteryChangeDate: date
                              ? date.format("DD-MM-YYYY")
                              : "",
                          }));
                        }}
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
                        label="Tyre Change Date"
                        value={
                          formData.tyreChangeDate
                            ? dayjs(formData.tyreChangeDate, "DD-MM-YYYY")
                            : null
                        }
                        onChange={(date) => {
                          setFormData((prev) => ({
                            ...prev,
                            tyreChangeDate: date
                              ? date.format("DD-MM-YYYY")
                              : "",
                          }));
                        }}
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
                        label="Brake Inspection Date"
                        value={
                          formData.brakeInspectionDate
                            ? dayjs(formData.brakeInspectionDate, "DD-MM-YYYY")
                            : null
                        }
                        onChange={(date) => {
                          setFormData((prev) => ({
                            ...prev,
                            brakeInspectionDate: date
                              ? date.format("DD-MM-YYYY")
                              : "",
                          }));
                        }}
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
                        label="Suspension Check Date"
                        value={
                          formData.suspensionCheckDate
                            ? dayjs(formData.suspensionCheckDate, "DD-MM-YYYY")
                            : null
                        }
                        onChange={(date) => {
                          setFormData((prev) => ({
                            ...prev,
                            suspensionCheckDate: date
                              ? date.format("DD-MM-YYYY")
                              : "",
                          }));
                        }}
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
                        label="Wheel Alignment Date"
                        value={
                          formData.wheelAlignmentDate
                            ? dayjs(formData.wheelAlignmentDate, "DD-MM-YYYY")
                            : null
                        }
                        onChange={(date) => {
                          setFormData((prev) => ({
                            ...prev,
                            wheelAlignmentDate: date
                              ? date.format("DD-MM-YYYY")
                              : "",
                          }));
                        }}
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
                        name="transmissionOilChangeDate"
                        label="Transmission Oil Change Date"
                        value={
                          formData.transmissionOilChangeDate
                            ? dayjs(
                                formData.transmissionOilChangeDate,
                                "DD-MM-YYYY"
                              )
                            : null
                        }
                        onChange={(date) => {
                          setFormData((prev) => ({
                            ...prev,
                            transmissionOilChangeDate: date
                              ? date.format("DD-MM-YYYY")
                              : "",
                          }));
                        }}
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

          {/* Analytics Section */}
          <AnimatePresence>
            {open && (
              <motion.div
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Box
                  className="bg-white p-6 rounded-xl shadow-lg  relative"
                  sx={{
                    p: 3,
                    borderRadius: 1,
                    border: "1px solid #e3f2fd",
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="primary"
                    mb={3}
                  >
                    Predictive Analytics
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="avgMonthlyKM"
                        label="Average Monthly KM"
                        type="number"
                        fullWidth
                        value={formData.avgMonthlyKM}
                        onChange={handleChange}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Smart Reminders Section */}
          <AnimatePresence>
            {open && (
              <motion.div
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Box
                  className="bg-white p-6 rounded-xl shadow-lg  relative"
                  sx={{
                    p: 3,
                    borderRadius: 1,
                    border: "1px solid #e3f2fd",
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="primary"
                    mb={3}
                  >
                    Smart Reminders
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <DatePicker
                        name="insuranceReminderDate"
                        label="Insurance Reminder Date"
                        value={
                          formData.insuranceReminderDate
                            ? dayjs(
                                formData.insuranceReminderDate,
                                "DD-MM-YYYY"
                              )
                            : null
                        }
                        onChange={(date) => {
                          setFormData((prev) => ({
                            ...prev,
                            insuranceReminderDate: date
                              ? date.format("DD-MM-YYYY")
                              : "",
                          }));
                        }}
                        format="DD-MM-YYYY"
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            placeholder: "dd-mm-yyyy",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <DatePicker
                        name="pucReminderDate"
                        label="PUC Reminder Date"
                        value={
                          formData.pucReminderDate
                            ? dayjs(formData.pucReminderDate, "DD-MM-YYYY")
                            : null
                        }
                        onChange={(date) => {
                          setFormData((prev) => ({
                            ...prev,
                            pucReminderDate: date
                              ? date.format("DD-MM-YYYY")
                              : "",
                          }));
                        }}
                        format="DD-MM-YYYY"
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            placeholder: "dd-mm-yyyy",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <DatePicker
                        name="nextServiceReminderDate"
                        label="Service Reminder Date"
                        value={
                          formData.nextServiceReminderDate
                            ? dayjs(
                                formData.nextServiceReminderDate,
                                "DD-MM-YYYY"
                              )
                            : null
                        }
                        onChange={(date) => {
                          setFormData((prev) => ({
                            ...prev,
                            nextServiceReminderDate: date
                              ? date.format("DD-MM-YYYY")
                              : "",
                          }));
                        }}
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
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3, bgcolor: "#f1f5f9" }}>
        <Button onClick={handleClose} variant="outlined" color="primary">
          Cancel
        </Button>
        <Button onClick={onSubmit} variant="contained" color="primary">
          {initialData ? "Update Vehicle" : "Save Vehicle"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddVehicleForm;
