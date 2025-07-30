import React, { useEffect, useRef } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
  IconButton,
  InputAdornment,
  Avatar,
  Paper,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import {
  createPromotion,
  updatePromotion,
} from "../../../features/promotion/promotionThunks";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import ImageIcon from "@mui/icons-material/Image";
import ClearIcon from "@mui/icons-material/Clear";

const PromotionForm = ({ type, onClose, editData }) => {
  const dispatch = useDispatch();
  const isEdit = !!editData;
  const fileInputRef = useRef();

  const getDateValue = (val) =>
    val ? dayjs(val).format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD");

  // Field rules
  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),

    description:
      type === "promotion"
        ? Yup.string().required("Description is required")
        : Yup.string(),
    imageUrl: Yup.string().url("Invalid URL").required("Image is required"),
    redirectUrl: Yup.string().test(
      "is-url-or-localhost",
      "Must be a valid URL",
      (value) =>
        !value ||
        value.startsWith("http://localhost") ||
        /^https?:\/\/.+/.test(value)
    ),
    ctaText:
      type === "promotion"
        ? Yup.string().required("CTA Text is required")
        : Yup.string(),
    ctaUrl:
      type === "promotion"
        ? Yup.string()
            .test(
              "is-url-or-localhost",
              "Must be a valid URL",
              (value) =>
                !value ||
                value.startsWith("http://localhost") ||
                /^https?:\/\/.+/.test(value)
            )
            .required("CTA URL is required")
        : Yup.string(),
    startDate: Yup.date().required("Start date required"),
    endDate: Yup.date()
      .min(Yup.ref("startDate"), "End must be after start")
      .required("End date required"),
  });

  const formik = useFormik({
    initialValues: {
      type,
      title: editData?.title || "",
      description: editData?.description || "",
      imageUrl: editData?.imageUrl || "",
      redirectUrl: editData?.redirectUrl || "",
      ctaText: editData?.ctaText || "",
      ctaUrl: editData?.ctaUrl || "",
      metadata: editData?.metadata || "",
      startDate: getDateValue(editData?.startDate),
      endDate: getDateValue(editData?.endDate),
      status: editData?.status === "inactive" ? false : true,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        console.log("Submitting form with values:", values);
        if (isEdit) {
          await dispatch(
            updatePromotion({
              id: editData.id,
              data: {
                ...values,
                status: values.status ? "active" : "inactive",
              },
            })
          ).unwrap();
          toast.success("Banner updated!");
        } else {
          await dispatch(
            createPromotion({
              ...values,
              status: values.status ? "active" : "inactive",
            })
          ).unwrap();
          toast.success("Banner created!");
        }
        resetForm();
        onClose();
      } catch (err) {
        toast.error(typeof err === "string" ? err : "Failed to save banner");
      }
    },
  });

  // Autofocus title on open
  useEffect(() => {
    setTimeout(() => {
      const el = document.querySelector('input[name="title"]');
      if (el) el.focus();
    }, 100);
  }, [editData]);

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      sx={{
        p: { xs: 1, sm: 3 },
        minWidth: { xs: 250, sm: 440 },
        mb: 1,
        background: "#fff",
        borderRadius: 3,
      }}
    >
      <Typography variant="h6" fontWeight="bold" mb={1.5}>
        {isEdit
          ? `Edit ${type === "promotion" ? "Promotional" : "Image"} Banner`
          : `New ${type === "promotion" ? "Promotional" : "Image"} Banner`}
      </Typography>
      {/* 1. Banner Info Section */}
      <Divider sx={{ mb: 2 }} />
      <Typography variant="subtitle2" sx={{ mb: 2, color: "text.secondary" }}>
        Banner Details
      </Typography>
      <Grid container spacing={2}>
        {/* Show title for both types */}
        <Grid item xs={12} md={type === "image" ? 12 : 6}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
            autoFocus
          />
        </Grid>
        {type === "promotion" && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={2}
              value={formik.values.description}
              onChange={formik.handleChange}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
            />
          </Grid>
        )}
      </Grid>
      <Divider sx={{ my: 3 }}>Banner Image</Divider>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={8}>
          <TextField
            fullWidth
            label="Image URL"
            name="imageUrl"
            value={formik.values.imageUrl}
            onChange={formik.handleChange}
            error={formik.touched.imageUrl && Boolean(formik.errors.imageUrl)}
            helperText={formik.touched.imageUrl && formik.errors.imageUrl}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {/* <IconButton ...file input... /> */}
                  {formik.values.imageUrl && (
                    <IconButton
                      aria-label="Clear image"
                      color="error"
                      size="small"
                      sx={{ ml: 1 }}
                      onClick={() => formik.setFieldValue("imageUrl", "")}
                      tabIndex={-1}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <Grid item xs={12} sm={4}>
            <Paper
              variant="outlined"
              sx={{
                width: 200,
                height: 60,
                mx: "auto",
                borderRadius: 0.7,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                bgcolor: "grey.100",
              }}
            >
              {formik.values.imageUrl ? (
                <img
                  src={formik.values.imageUrl}
                  alt="preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <ImageIcon fontSize="large" color="disabled" />
              )}
            </Paper>
          </Grid>
        </Grid>
      </Grid>
      {/* 3. URL & CTA Section */}
      <Divider sx={{ my: 3 }}>Links & Actions</Divider>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Redirect URL"
            name="redirectUrl"
            value={formik.values.redirectUrl}
            onChange={formik.handleChange}
            error={
              formik.touched.redirectUrl && Boolean(formik.errors.redirectUrl)
            }
            helperText={formik.touched.redirectUrl && formik.errors.redirectUrl}
          />
        </Grid>
        {type === "promotion" && (
          <>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="CTA Text"
                name="ctaText"
                value={formik.values.ctaText}
                onChange={formik.handleChange}
                error={formik.touched.ctaText && Boolean(formik.errors.ctaText)}
                helperText={formik.touched.ctaText && formik.errors.ctaText}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="CTA URL"
                name="ctaUrl"
                value={formik.values.ctaUrl}
                onChange={formik.handleChange}
                error={formik.touched.ctaUrl && Boolean(formik.errors.ctaUrl)}
                helperText={formik.touched.ctaUrl && formik.errors.ctaUrl}
              />
            </Grid>
          </>
        )}
      </Grid>
      {/* 4. Date Section */}
      <Divider sx={{ my: 3 }}>Validity</Divider>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Start Date"
            type="date"
            name="startDate"
            InputLabelProps={{ shrink: true }}
            value={formik.values.startDate}
            onChange={formik.handleChange}
            error={formik.touched.startDate && Boolean(formik.errors.startDate)}
            helperText={formik.touched.startDate && formik.errors.startDate}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="End Date"
            type="date"
            name="endDate"
            InputLabelProps={{ shrink: true }}
            value={formik.values.endDate}
            onChange={formik.handleChange}
            error={formik.touched.endDate && Boolean(formik.errors.endDate)}
            helperText={formik.touched.endDate && formik.errors.endDate}
          />
        </Grid>
      </Grid>
      {/* 5. Status Toggle */}
      <Divider sx={{ my: 3 }} />
      <FormControlLabel
        control={
          <Switch
            checked={formik.values.status}
            onChange={() =>
              formik.setFieldValue("status", !formik.values.status)
            }
          />
        }
        label={formik.values.status ? "Active" : "Inactive"}
        sx={{ ml: 0 }}
      />
      {/* 6. Actions */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6}>
          <Button
            variant="contained"
            type="submit"
            fullWidth
            color="success"
            sx={{ borderRadius: 2, py: 1.2, fontWeight: 600 }}
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting
              ? isEdit
                ? "Saving..."
                : "Creating..."
              : isEdit
              ? "Save Changes"
              : "Create Banner"}
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            variant="text"
            color="error"
            fullWidth
            sx={{ borderRadius: 2, px: 4, py: 1.5, fontWeight: 600 }}
            onClick={onClose}
          >
            Cancel
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PromotionForm;
