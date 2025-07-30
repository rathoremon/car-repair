import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Stack,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import AddVehicleForm from "../../components/Vehicle/AddVehicleForm";
import VehicleCard from "../../components/Vehicle/VehicleCard";
import EmptyState from "../../components/Vehicle/EmptyState";

const VehicleDashboard = () => {
  const [vehicles, setVehicles] = useState([
    {
      id: 1,
      vehiclePhotoUrl:
        "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSb7QmFGY2JOPUEY6klNHN2iCNXUIvOChVwEO8jZqGEOTZdHNUjeuzsyplsk7HhIW1mHEWLd2Odmzlfqgb579jCoJ6owfRwMp1izV5MQRR3eV_cpjDj8-vB",
      vehicleMake: "BMW",
      vehicleModel: "320d Luxury Line",
      vehicleYear: "2022",
      carType: "Sedan",
      registrationNumber: "MH12AB1234",
      vin: "WBA8E31060G123456",
      engineNumber: "N47D20T0",
      ownerName: "John Doe",
      ownerMobile: "9876543210",
      ownerEmail: "john.doe@example.com",
      insuranceCompany: "HDFC ERGO",
      policyNumber: "POL123456789",
      insuranceType: "Comprehensive",
      premiumAmount: "45000",
      insuranceStartDate: "01-01-2025",
      insuranceExpiryDate: "01-01-2026",
      insuranceContact: "1800-123-4567",
      pucCertificateNo: "PUC1234567",
      pucValidityDate: "31-12-2025",
      roadTaxCertificateNo: "RT1234567",
      roadTaxValidityDate: "01-01-2030",
      lastServiceDate: "15-12-2024",
      lastServiceKM: "15000",
      nextServiceDueDate: "15-06-2025",
      nextServiceDueKM: "25000",
      oilChangeDate: "15-12-2024",
      oilChangeKM: "15000",
      batteryChangeDate: "01-01-2025",
      tyreChangeDate: "01-12-2024",
      brakeInspectionDate: "15-12-2024",
      suspensionCheckDate: "15-12-2024",
      wheelAlignmentDate: "01-12-2024",
      transmissionOilChangeDate: "01-12-2024",
      avgMonthlyKM: "1200",
      insuranceReminderDate: "01-12-2025",
      pucReminderDate: "15-11-2025",
      nextServiceReminderDate: "15-05-2025",
    },
  ]);

  const [openForm, setOpenForm] = useState(false);
  const [editVehicle, setEditVehicle] = useState(null);
  const [deleteVehicle, setDeleteVehicle] = useState(null);
  const [expandedCardId, setExpandedCardId] = useState(null); // For expanding one at a time

  const handleSaveVehicle = (vehicleData) => {
    if (editVehicle) {
      setVehicles((prev) =>
        prev.map((v) =>
          v.id === editVehicle.id ? { ...v, ...vehicleData } : v
        )
      );
    } else {
      const newVehicle = {
        id: Date.now(),
        ...vehicleData,
      };
      setVehicles((prev) => [...prev, newVehicle]);
    }
    setEditVehicle(null);
    setOpenForm(false);
  };

  const handleDeleteVehicle = () => {
    setVehicles((prev) => prev.filter((v) => v.id !== deleteVehicle.id));
    setDeleteVehicle(null);
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
        🚗 Trasure Vehicle Manager
      </Typography>

      {vehicles.length === 0 ? (
        <EmptyState onAddVehicle={() => setOpenForm(true)} />
      ) : (
        <Stack spacing={4} className="max-w-5xl mx-auto">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onEdit={(v) => {
                setEditVehicle(v);
                setOpenForm(true);
              }}
              onDelete={(v) => setDeleteVehicle(v)}
              isExpanded={expandedCardId === vehicle.id}
              onExpand={() =>
                setExpandedCardId((prevId) =>
                  prevId === vehicle.id ? null : vehicle.id
                )
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
        open={Boolean(deleteVehicle)}
        onClose={() => setDeleteVehicle(null)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteVehicle(null)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteVehicle}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VehicleDashboard;
