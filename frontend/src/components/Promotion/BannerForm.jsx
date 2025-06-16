// src/components/Promotion/BannerForm.jsx

import React from "react";
import {
  TextField,
  Button,
  Grid,
  MenuItem,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  createPromotion,
  updatePromotion,
} from "../../features/promotion/promotionThunks";
import { clearSelectedPromotion } from "../../features/promotion/promotionSlice";

const validationSchema = Yup.object({
  type: Yup.string().required("Banner type is required"),
  title: Yup.string(),
  description: Yup.string(),
  ctaText: Yup.string(),
  ctaLink: Yup.string().url("Must be a valid URL"),
  placement: Yup.string().required("Placement required"),
  priority: Yup.number().min(0).required("Priority is required"),
});

const BannerForm = () => {
  const dispatch = useDispatch();
  const selected = useSelector((state) => state.promotion.selected);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      type: selected?.type || "",
      title: selected?.title || "",
      description: selected?.description || "",
      ctaText: selected?.ctaText || "",
      ctaLink: selected?.ctaLink || "",
      imageUrl: selected?.imageUrl || "",
      placement: selected?.placement || "homepage",
      priority: selected?.priority || 0,
      isActive: selected?.isActive ?? true,
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      if (selected) {
        dispatch(updatePromotion({ id: selected.id, data: values }));
      } else {
        dispatch(createPromotion(values));
      }
      resetForm();
      dispatch(clearSelectedPromotion());
    },
  });

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        {selected ? "Edit" : "Create"} Banner via Form
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              name="type"
              label="Type"
              value={formik.values.type}
              onChange={formik.handleChange}
              error={formik.touched.type && Boolean(formik.errors.type)}
              helperText={formik.touched.type && formik.errors.type}
            >
              <MenuItem value="promotional">Promotional</MenuItem>
              <MenuItem value="advertisement">Advertisement</MenuItem>
              <MenuItem value="car_accessory">Car Accessory</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              name="placement"
              label="Placement"
              value={formik.values.placement}
              onChange={formik.handleChange}
            >
              <MenuItem value="homepage">Homepage</MenuItem>
              <MenuItem value="garage">Garage</MenuItem>
              <MenuItem value="accessory">Accessory</MenuItem>
              <MenuItem value="offer_page">Offer Page</MenuItem>
              <MenuItem value="global">Global</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="title"
              label="Title"
              fullWidth
              value={formik.values.title}
              onChange={formik.handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="description"
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={formik.values.description}
              onChange={formik.handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="ctaText"
              label="CTA Text"
              fullWidth
              value={formik.values.ctaText}
              onChange={formik.handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="ctaLink"
              label="CTA Link"
              fullWidth
              value={formik.values.ctaLink}
              onChange={formik.handleChange}
              error={formik.touched.ctaLink && Boolean(formik.errors.ctaLink)}
              helperText={formik.touched.ctaLink && formik.errors.ctaLink}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              name="priority"
              label="Priority"
              type="number"
              fullWidth
              value={formik.values.priority}
              onChange={formik.handleChange}
              error={formik.touched.priority && Boolean(formik.errors.priority)}
              helperText={formik.touched.priority && formik.errors.priority}
            />
          </Grid>

          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.isActive}
                  onChange={(e) =>
                    formik.setFieldValue("isActive", e.target.checked)
                  }
                />
              }
              label="Active"
            />
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" fullWidth>
              {selected ? "Update Banner" : "Create Banner"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default BannerForm;
