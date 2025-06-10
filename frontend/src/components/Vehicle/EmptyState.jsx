import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { DirectionsCarFilled, AddCircleOutline } from "@mui/icons-material";
import { motion } from "framer-motion";

const EmptyState = ({ onAddVehicle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center p-10 bg-white shadow-lg rounded-xl text-center max-w-lg mx-auto"
    >
      <DirectionsCarFilled
        fontSize="large"
        style={{ fontSize: 80, color: "#90a4ae" }}
      />
      <Typography variant="h5" fontWeight="bold" mt={3}>
        No Vehicles Added Yet
      </Typography>
      <Typography variant="body1" mt={2} mb={4} color="textSecondary">
        Manage your fleet with Trasure. Stay compliant, stay informed.
      </Typography>
      <Button
        variant="contained"
        size="large"
        startIcon={<AddCircleOutline />}
        onClick={onAddVehicle}
      >
        Add Your First Vehicle
      </Button>
    </motion.div>
  );
};

export default EmptyState;
