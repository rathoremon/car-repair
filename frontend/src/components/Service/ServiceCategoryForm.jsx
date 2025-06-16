import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Switch,
  Tooltip,
  Divider,
  Collapse,
  Paper,
  Stack,
  FormControlLabel,
  Checkbox,
  LinearProgress,
  Fade,
} from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  createServiceCategory,
  updateServiceCategory,
  fetchServiceCategories,
} from "../../features/serviceCategory/serviceCategoryThunks";
import { clearSelectedCategory } from "../../features/serviceCategory/serviceCategorySlice";
import { toast } from "react-toastify";
import { useTheme } from "@mui/material/styles";

const validationSchema = Yup.object({
  name: Yup.string().required("Category name is required"),
  description: Yup.string().required("Description is required"),
  defaultDuration: Yup.number()
    .required("Duration is required")
    .min(1, "Must be at least 1 minute"),
  notes: Yup.string().nullable(),
});

const ServiceCategoryForm = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const selected = useSelector(
    (state) => state.serviceCategory.selectedCategory
  );
  const [open, setOpen] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const { selectedCategory } = useSelector((state) => state.serviceCategory);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: selectedCategory?.name || "",
      description: selectedCategory?.description || "",
      defaultDuration: selectedCategory?.defaultDuration || "",
      isEmergencyService: selectedCategory?.isEmergencyService || false,
      notes: selectedCategory?.notes ?? "",
      isActive: selectedCategory ? selectedCategory.status === "active" : true,
      pinned: selectedCategory?.pinned || false,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const payload = {
        name: values.name.trim(),
        description: values.description,
        defaultDuration: values.defaultDuration,
        isEmergencyService: values.isEmergencyService,
        notes: values.notes,
        status: values.isActive ? "active" : "inactive",
      };

      try {
        if (selectedCategory) {
          await dispatch(
            updateServiceCategory({ id: selectedCategory.id, data: payload })
          );
          toast.success("Service category updated");
        } else {
          await dispatch(createServiceCategory(payload));
          toast.success("Service category created");
        }
        dispatch(fetchServiceCategories());
        resetForm();
        dispatch(clearSelectedCategory());
        setOpen(false);
      } catch (err) {
        toast.error("An error occurred. Please try again.");
      }
    },
  });

  useEffect(() => {
    if (selectedCategory) {
      formik.setValues({
        name: selectedCategory.name || "",
        description: selectedCategory.description || "",
        defaultDuration: selectedCategory.defaultDuration || "",
        isEmergencyService: selectedCategory.isEmergencyService || false,
        pinned: selectedCategory.pinned || false,
        notes: selectedCategory.notes ?? "",
        isActive: selectedCategory.status === "active",
      });
      setOpen(true);
      setShowNotes(
        !!(selectedCategory.notes && selectedCategory.notes.trim() !== "")
      );
    }
  }, [selectedCategory]);

  const handleFabClick = () => {
    dispatch(clearSelectedCategory());
    formik.resetForm();
    setOpen(true);
  };

  const progress =
    ["name", "description", "defaultDuration"].filter(
      (key) => formik.values[key]?.toString().trim().length > 0
    ).length * 33.33;

  return (
    <Paper
      elevation={4}
      sx={{
        p: 3,
        borderRadius: 1,
        bgcolor:
          theme.palette.mode === "dark"
            ? "rgba(30,34,44,0.85)"
            : "rgba(255,255,255,0.85)",
        border: `1.5px solid ${theme.palette.divider}`,
        boxShadow: "0 4px 24px 0 rgba(25, 118, 210, 0.10)",
        backdropFilter: "blur(6px)",
        mb: 5,
        width: "100%",
        position: "relative",
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={0}
      >
        <Typography variant="h6" fontWeight={900}>
          {selected ? "Edit Service Category" : "Add Service Category"}
        </Typography>
        <Stack direction="row" spacing={1}>
          {open ? (
            <Tooltip title="Close Form">
              <IconButton
                onClick={() => {
                  setOpen(false);
                  dispatch(clearSelectedCategory());
                }}
              >
                <Close />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Add New Category">
              <IconButton onClick={handleFabClick}>
                <Add
                  sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    borderRadius: 3,
                  }}
                />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </Stack>

      <Collapse in={open}>
        <Fade in={open}>
          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{
              mt: 2,
              display: "flex",
              flexDirection: "column",
              gap: 3,
              width: "100%",
            }}
          >
            <TextField
              fullWidth
              label="Category Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />

            <TextField
              fullWidth
              multiline
              minRows={4}
              label="Description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
            />

            <TextField
              fullWidth
              type="number"
              label="Default Duration (in minutes)"
              name="defaultDuration"
              value={formik.values.defaultDuration}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.defaultDuration &&
                Boolean(formik.errors.defaultDuration)
              }
              helperText={
                formik.touched.defaultDuration && formik.errors.defaultDuration
              }
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={formik.values.isEmergencyService}
                  name="isEmergencyService"
                  onChange={formik.handleChange}
                  color="error"
                />
              }
              label={
                <Typography fontWeight={600} color="error.main">
                  Emergency Service
                </Typography>
              }
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={formik.values.pinned}
                  name="pinned"
                  onChange={formik.handleChange}
                  color="primary"
                />
              }
              label={
                <Typography fontWeight={600}>Pin this category</Typography>
              }
            />

            <FormControlLabel
              control={
                <Switch
                  name="isActive"
                  color="primary"
                  checked={formik.values.isActive}
                  onChange={(e) =>
                    formik.setFieldValue("isActive", e.target.checked)
                  }
                />
              }
              label={
                <Typography fontWeight={600}>
                  {formik.values.isActive ? "Active" : "Inactive"}
                </Typography>
              }
            />

            <Box>
              <Button onClick={() => setShowNotes(!showNotes)} size="small">
                {showNotes ? "Hide Notes" : "Add Notes"}
              </Button>
              <Collapse in={showNotes}>
                <TextField
                  fullWidth
                  label="Notes (optional)"
                  name="notes"
                  value={formik.values.notes}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  sx={{ mt: 2 }}
                />
              </Collapse>
            </Box>

            <Box>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ height: 6, borderRadius: 2, mb: 1 }}
              />
              <Typography
                variant="caption"
                color="textSecondary"
                sx={{ ml: 1 }}
              >
                {progress === 100
                  ? "Form ready to submit"
                  : "Fill all required fields"}
              </Typography>
            </Box>

            <Divider />

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={formik.isSubmitting || progress < 99}
              >
                {selected ? "Update Category" : "Add Category"}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  formik.resetForm();
                  dispatch(clearSelectedCategory());
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
            </Stack>
          </Box>
        </Fade>
      </Collapse>
    </Paper>
  );
};

export default ServiceCategoryForm;
