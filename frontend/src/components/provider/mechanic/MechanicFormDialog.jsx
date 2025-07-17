import React, { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Avatar,
  IconButton,
  Typography,
  MenuItem,
  Autocomplete,
  Divider,
  CircularProgress,
  Box,
  useTheme,
} from "@mui/material";
import {
  Close as CloseIcon,
  Delete as DeleteIcon,
  UploadFile as UploadFileIcon,
} from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  createMechanic,
  updateMechanic,
  fetchMechanicById,
} from "../../../features/provider/mechanic/mechanicsThunks";
import { fetchAllSkills } from "../../../features/skill/skillThunks";
import { toast } from "react-toastify";
import AvailabilityEditor from "./AvailabilityEditor";
import { getPhotoUrl } from "../../../utils/getPhotoUrl";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  aadhar: "",
  experience: "",
  skillSet: [],
  address: "",
  status: "pending",
  availability: {},
  photo: null,
};

export default function MechanicFormDialog({
  open,
  onClose,
  mechanicId,
  skillMap,
}) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const selected = useSelector((s) => s.mechanics.selected);
  const { allSkills } = useSelector((s) => s.skill);
  const [skills, setSkills] = useState([]);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  // Load skills & mechanic on dialog open
  useEffect(() => {
    if (!allSkills.length) dispatch(fetchAllSkills());
    setSkills(allSkills);
    if (open && mechanicId) dispatch(fetchMechanicById(mechanicId));
    // eslint-disable-next-line
  }, [open, mechanicId, allSkills.length]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues:
      mechanicId && selected
        ? {
            ...selected,
            experience: selected.experience ?? "",
            photo: "",
            skillSet: Array.isArray(selected.skillSet) ? selected.skillSet : [],
            availability:
              typeof selected.availability === "string"
                ? JSON.parse(selected.availability)
                : selected.availability || {},
            address:
              typeof selected.address === "string"
                ? selected.address
                : selected.address || "",
          }
        : initialForm,
    validationSchema: Yup.object({
      name: Yup.string().required("Name required"),
      email: Yup.string().email().required("Email required"),
      phone: Yup.string().required("Phone required"),
      skillSet: Yup.array().min(1, "Select at least one skill"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setLoading(true);
      const payload = {
        ...values,
        skillSet: values.skillSet,
        availability: values.availability,
        address: values.address,
      };
      try {
        let action;
        if (mechanicId) {
          action = await dispatch(
            updateMechanic({ id: mechanicId, data: payload })
          );
        } else {
          action = await dispatch(createMechanic(payload));
        }
        if (!action.error) {
          toast.success(mechanicId ? "Mechanic updated!" : "Mechanic created!");
          onClose();
        } else {
          toast.error(action.error?.message || "Failed to save mechanic");
        }
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    // If a new file is picked, use local URL
    if (formik.values.photo && typeof formik.values.photo !== "string") {
      setPhotoPreview(URL.createObjectURL(formik.values.photo));
    } else if (selected && selected.photo) {
      setPhotoPreview(getPhotoUrl(selected.photo));
    } else {
      setPhotoPreview(null);
    }
    // eslint-disable-next-line
  }, [formik.values.photo, selected]);

  // Remove photo logic
  const handleRemovePhoto = () => {
    formik.setFieldValue("photo", "");
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // --- Layout ---
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          p: 0,
          borderRadius: 1,
          minHeight: 520,
          maxHeight: "92vh",
          boxShadow: "0 4px 28px 0 rgba(36,50,85,0.09)",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          px: 3,
          py: 2.3,
          bgcolor: "#fafbfc",
          fontWeight: 800,
          fontSize: 22,
          borderBottom: "1.5px solid #f0f1f4",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        {mechanicId ? "Edit Mechanic" : "Add Mechanic"}
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 14, top: 13 }}
          aria-label="Close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form onSubmit={formik.handleSubmit} autoComplete="off">
        <DialogContent
          sx={{
            px: 3,
            py: 2,
            height: "440px",
            overflowY: "auto",
            scrollbarColor: "#e0e1e8 #f6f7fb",
            "&::-webkit-scrollbar": { width: 7, borderRadius: 8 },
            "&::-webkit-scrollbar-thumb": {
              background: "#eceef2",
              borderRadius: 8,
            },
            background: "#fcfdfe",
            margin: "0px 0px 40px 0px",
          }}
        >
          <Stack spacing={2.2}>
            <Stack direction="row" spacing={2.5} alignItems="center">
              <Box>
                <Avatar
                  src={photoPreview}
                  sx={{
                    width: 68,
                    height: 68,
                    boxShadow: photoPreview ? 2 : 0,
                    border: photoPreview
                      ? "2px solid " + theme.palette.primary.light
                      : "2px dashed #d1d2d8",
                    bgcolor: "#f9fafd",
                  }}
                />
                {photoPreview && (
                  <IconButton
                    onClick={handleRemovePhoto}
                    aria-label="Remove photo"
                    sx={{
                      mt: 0.2,
                      ml: 1,
                      color: "error.main",
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
              <Stack>
                <Button
                  variant="outlined"
                  startIcon={<UploadFileIcon />}
                  component="label"
                  sx={{
                    minWidth: 145,
                    fontWeight: 600,
                    borderRadius: 1.2,
                  }}
                >
                  {photoPreview ? "Change Photo" : "Upload Photo"}
                  <input
                    ref={fileInputRef}
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        formik.setFieldValue("photo", e.target.files[0]);
                      }
                    }}
                  />
                </Button>
                <Typography
                  variant="caption"
                  sx={{ color: "text.secondary", mt: 0.5 }}
                >
                  {photoPreview
                    ? "You can upload a new photo to replace."
                    : "PNG, JPG under 2MB recommended."}
                </Typography>
              </Stack>
            </Stack>
            <Divider sx={{ mb: 1, mt: 0.5 }} />
            <TextField
              label="Status"
              name="status"
              select
              fullWidth
              size="small"
              value={formik.values.status}
              onChange={formik.handleChange}
              sx={{ bgcolor: "#fff", borderRadius: 1, mt: 0.8 }}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="suspended">Suspended</MenuItem>
            </TextField>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Name"
                name="name"
                fullWidth
                size="small"
                value={formik.values.name}
                onChange={formik.handleChange}
                required
                error={!!formik.errors.name && formik.touched.name}
                helperText={formik.touched.name && formik.errors.name}
                sx={{ bgcolor: "#fff", borderRadius: 1 }}
              />
              <TextField
                label="Phone"
                name="phone"
                fullWidth
                size="small"
                value={formik.values.phone}
                onChange={formik.handleChange}
                required
                error={!!formik.errors.phone && formik.touched.phone}
                helperText={formik.touched.phone && formik.errors.phone}
                sx={{ bgcolor: "#fff", borderRadius: 1 }}
              />
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Email"
                name="email"
                fullWidth
                size="small"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                required
                error={!!formik.errors.email && formik.touched.email}
                helperText={formik.touched.email && formik.errors.email}
                sx={{ bgcolor: "#fff", borderRadius: 1 }}
              />
              <TextField
                label="Aadhar"
                name="aadhar"
                fullWidth
                size="small"
                value={formik.values.aadhar || ""}
                onChange={formik.handleChange}
                sx={{ bgcolor: "#fff", borderRadius: 1 }}
              />
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Experience (years)"
                name="experience"
                type="number"
                size="small"
                fullWidth
                value={formik.values.experience || ""}
                onChange={formik.handleChange}
                sx={{ bgcolor: "#fff", borderRadius: 1 }}
              />
              <TextField
                label="Address"
                name="address"
                fullWidth
                size="small"
                value={formik.values.address || ""}
                onChange={formik.handleChange}
                sx={{ bgcolor: "#fff", borderRadius: 1 }}
              />
            </Stack>

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 700 }}>
                Skills
              </Typography>
              <Autocomplete
                multiple
                size="small"
                limitTags={2}
                options={skills}
                getOptionLabel={(option) => option.name}
                value={skills.filter((sk) =>
                  formik.values.skillSet.includes(sk.id)
                )}
                onChange={(_, val) =>
                  formik.setFieldValue(
                    "skillSet",
                    val.map((v) => v.id)
                  )
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Skills"
                    placeholder="Select skills"
                    error={!!formik.errors.skillSet && formik.touched.skillSet}
                    helperText={
                      formik.touched.skillSet && formik.errors.skillSet
                    }
                    sx={{ bgcolor: "#fff", borderRadius: 1 }}
                  />
                )}
                isOptionEqualToValue={(opt, val) => opt.id === val.id}
                sx={{
                  maxWidth: 480,
                  bgcolor: "#fff",
                  borderRadius: 1,
                  ".MuiAutocomplete-tag": {
                    maxWidth: 120,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  },
                }}
              />
            </Box>
            <AvailabilityEditor
              value={formik.values.availability}
              onChange={(v) => formik.setFieldValue("availability", v)}
            />
          </Stack>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            py: 2,
            bgcolor: "#fafbfc",
            borderTop: "1.5px solid #f0f1f4",
            position: "sticky",
            bottom: 0,
            zIndex: 11,
          }}
        >
          <Button onClick={onClose} sx={{ minWidth: 110, fontWeight: 700 }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={formik.isSubmitting || loading}
            startIcon={loading && <CircularProgress size={20} />}
            sx={{
              minWidth: 140,
              fontWeight: 800,
              borderRadius: 1.4,
              boxShadow: "none",
            }}
          >
            {mechanicId ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
