import React from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  MenuItem,
  Typography,
  Select,
  InputLabel,
  FormControl,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { createPromotion } from "../../features/promotion/promotionThunks";
import dayjs from "dayjs";

const PromotionForm = ({ type, onClose }) => {
  const dispatch = useDispatch();

  const validationSchema = Yup.object({
    title:
      type === "promotion"
        ? Yup.string().required("Title is required")
        : Yup.string(),
    description:
      type === "promotion"
        ? Yup.string().required("Description is required")
        : Yup.string(),
    imageUrl:
      type === "image"
        ? Yup.string().url("Invalid URL").required("Image URL is required")
        : Yup.string(),
    redirectUrl: Yup.string().test(
      "is-url-or-localhost",
      "Must be a valid URL",
      (value) =>
        value?.startsWith("http://localhost") || /^https?:\/\/.+/.test(value)
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
                value?.startsWith("http://localhost") ||
                /^https?:\/\/.+/.test(value)
            )
            .required("CTA URL is required")
        : Yup.string(),
    startDate: Yup.date().required(),
    endDate: Yup.date().required(),
  });

  const formik = useFormik({
    initialValues: {
      type,
      title: "",
      description: "",
      imageUrl: "",
      redirectUrl: "",
      ctaText: "",
      ctaUrl: "",
      metadata: "",
      startDate: dayjs().format("YYYY-MM-DD"),
      endDate: dayjs().add(15, "day").format("YYYY-MM-DD"),
      status: true,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      await dispatch(
        createPromotion({
          ...values,
          status: values.status ? "active" : "inactive",
        })
      );
      resetForm();
      onClose();
    },
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ mb: 4 }}>
      <Typography variant="h6" mb={2}>
        {type === "promotion" ? "New Promotional Banner" : "New Image Banner"}
      </Typography>

      <Grid container spacing={2}>
        {type !== "image" && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />
          </Grid>
        )}

        {type === "promotion" && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={3}
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

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Image URL"
            name="imageUrl"
            value={formik.values.imageUrl}
            onChange={formik.handleChange}
            error={formik.touched.imageUrl && Boolean(formik.errors.imageUrl)}
            helperText={formik.touched.imageUrl && formik.errors.imageUrl}
          />
        </Grid>

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
            <Grid item xs={12} md={6}>
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

            <Grid item xs={12} md={6}>
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

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Start Date"
            type="date"
            name="startDate"
            InputLabelProps={{ shrink: true }}
            value={formik.values.startDate}
            onChange={formik.handleChange}
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
          />
        </Grid>

        <Grid item xs={12}>
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
          />
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" type="submit" fullWidth>
            Save Banner
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PromotionForm;
