import React from "react";
import { Card, CardContent, Collapse, Box } from "@mui/material";
import { motion } from "framer-motion";
import VehicleSummary from "./VehicleSummary";
import VehicleDetails from "./VehicleDetails";

const VehicleCard = ({ vehicle, onEdit, onDelete, isExpanded, onExpand }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card
        elevation={isExpanded ? 8 : 3}
        className={`rounded-2xl transition-all duration-300 overflow-hidden ${
          isExpanded ? "ring-2 ring-blue-300" : "hover:shadow-md"
        }`}
        sx={{ cursor: "pointer", overflow: "visible" }}
      >
        <CardContent onClick={onExpand}>
          <VehicleSummary
            vehicle={vehicle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Box mt={4}>
              <VehicleDetails vehicle={vehicle} />
            </Box>
          </Collapse>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default VehicleCard;
