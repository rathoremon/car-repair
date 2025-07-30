import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Stack,
} from "@mui/material";

export default function ConfirmDialog({
  open,
  title = "Are you sure?",
  description,
  onClose,
  onConfirm,
  loading = false,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>{title}</DialogTitle>
      <DialogContent>
        <Typography>{description}</Typography>
      </DialogContent>
      <DialogActions>
        <Stack
          direction="row"
          spacing={2}
          justifyContent="flex-end"
          width="100%"
          px={2}
          pb={2}
        >
          <Button onClick={onClose}>{cancelText}</Button>
          <Button
            variant="contained"
            color="error"
            onClick={onConfirm}
            disabled={loading}
            sx={{ minWidth: 110, fontWeight: 700 }}
          >
            {confirmText}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
