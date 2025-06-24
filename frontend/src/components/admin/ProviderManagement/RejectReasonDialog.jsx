import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

const RejectReasonDialog = ({ open, onClose, onSubmit, loading }) => {
  const formik = useFormik({
    initialValues: { reason: "" },
    validationSchema: Yup.object({
      reason: Yup.string()
        .min(5, "Minimum 5 characters")
        .required("Reason is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      await onSubmit(values.reason);
      resetForm();
    },
    enableReinitialize: true,
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Reject Provider</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <TextField
            label="Reason for rejection"
            fullWidth
            name="reason"
            multiline
            rows={4}
            value={formik.values.reason}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.reason && Boolean(formik.errors.reason)}
            helperText={formik.touched.reason && formik.errors.reason}
            disabled={loading}
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="error"
            disabled={
              loading || !formik.values.reason || Boolean(formik.errors.reason)
            }
          >
            {loading ? "Rejecting..." : "Reject"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RejectReasonDialog;
