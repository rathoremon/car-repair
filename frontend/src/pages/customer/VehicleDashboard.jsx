import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Stack,
  Dialog,
  DialogTitle,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import AddVehicleForm from "../../components/vehicle/AddVehicleForm";
import VehicleCard from "../../components/vehicle/VehicleCard";
import {
  fetchVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../../features/customer/vehicles/vehicleThunks";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function VehicleDashboard() {
  const dispatch = useDispatch();
  const { items: vehicles, loading } = useSelector((s) => s.vehicles);

  const [openForm, setOpenForm] = useState(false);
  const [editVehicle, setEditVehicle] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [expandedCardId, setExpandedCardId] = useState(null);

  useEffect(() => {
    dispatch(fetchVehicles());
  }, [dispatch]);

  const handleSaveVehicle = async (payload) => {
    try {
      if (editVehicle) {
        await dispatch(
          updateVehicle({ id: editVehicle.id, updates: payload })
        ).unwrap();
        toast.success("Vehicle updated");
      } else {
        await dispatch(createVehicle(payload)).unwrap();
        toast.success("Vehicle added");
      }
      setEditVehicle(null);
      setOpenForm(false);
    } catch (e) {
      toast.error(e || "Failed to save vehicle");
    }
  };

  const handleDeleteVehicle = async () => {
    try {
      await dispatch(deleteVehicle(deleteTarget.id)).unwrap();
      toast.success("Vehicle deleted");
    } catch (e) {
      toast.error(e || "Delete failed");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <Box className="min-h-screen p-8 bg-gray-50">
      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        mb={8}
        className="text-blue-700"
      >
        🚗 MechanIQ Vehicle Manager
      </Typography>

      {loading ? (
        <Box className="flex items-center justify-center h-64">
          <CircularProgress />
        </Box>
      ) : vehicles.length === 0 ? (
        <Stack alignItems="center" spacing={2}>
          <Typography>No vehicles yet.</Typography>
          <Button variant="contained" onClick={() => setOpenForm(true)}>
            Add Vehicle
          </Button>
        </Stack>
      ) : (
        <Stack spacing={4} className="max-w-5xl mx-auto">
          {vehicles.map((v) => (
            <VehicleCard
              key={v.id}
              vehicle={v}
              onEdit={(vehicle) => {
                setEditVehicle(vehicle);
                setOpenForm(true);
              }}
              onDelete={(vehicle) => setDeleteTarget(vehicle)}
              isExpanded={expandedCardId === v.id}
              onExpand={() =>
                setExpandedCardId((prev) => (prev === v.id ? null : v.id))
              }
            />
          ))}
          <Button
            variant="outlined"
            size="large"
            onClick={() => setOpenForm(true)}
            className="border-dashed border-2 border-blue-500 text-blue-500 hover:bg-blue-50 transition"
          >
            + Add Another Vehicle
          </Button>
        </Stack>
      )}

      <AddVehicleForm
        open={openForm}
        handleClose={() => {
          setEditVehicle(null);
          setOpenForm(false);
        }}
        handleSave={handleSaveVehicle}
        initialData={editVehicle}
      />

      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteVehicle}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer position="top-right" autoClose={2000} />
    </Box>
  );
}
