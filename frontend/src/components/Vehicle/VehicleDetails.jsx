import React from "react";
import { Typography, Divider, Stack, Grid, Box } from "@mui/material";

// Helper component for displaying a label-value pair
const InfoItem = ({ label, value }) => (
  <Stack spacing={0.5}>
    <Typography variant="caption" color="textSecondary">
      {label}
    </Typography>
    {/* Display value or a dash if value is falsy (e.g., null, undefined, empty string) */}
    <Typography variant="body1" fontWeight="500">
      {value || "—"}
    </Typography>
  </Stack>
);

const VehicleDetails = ({ vehicle }) => {
  // Helper to format combined date/KM information or return '-' if data is incomplete
  const formatServiceInfo = (date, km) => {
    if (date && km) {
      return `${date} at ${km} KM`;
    } else if (date) {
      return date;
    } else if (km) {
      return `${km} KM`;
    }
    return "—";
  };

  // Helper to format validity periods or return '-' if data is incomplete
  const formatValidityPeriod = (startDate, expiryDate) => {
    if (startDate && expiryDate) {
      return `${startDate} to ${expiryDate}`;
    } else if (startDate) {
      return `From ${startDate}`;
    } else if (expiryDate) {
      return `Till ${expiryDate}`;
    }
    return "—";
  };

  return (
    // Main container stack for consistent vertical spacing
    <Stack spacing={{ xs: 4, md: 6 }} mt={2}>
      {/* Vehicle & Ownership Details */}
      <Box>
        <Divider sx={{ mb: 3 }} />
        <Typography
          variant="h6"
          fontWeight="bold"
          color="primary.main"
          sx={{ mb: 3 }}
        >
          Vehicle & Ownership Details
        </Typography>
        <Grid container spacing={{ xs: 2, md: 3 }}>
          <Grid item xs={12} md={6}>
            <InfoItem label="Owner Name" value={vehicle.ownerName} />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoItem label="Mobile" value={vehicle.ownerMobile} />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoItem label="Email" value={vehicle.ownerEmail} />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoItem
              label="Registration No"
              value={vehicle.registrationNumber}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoItem label="VIN" value={vehicle.vin} />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoItem label="Engine No" value={vehicle.engineNumber} />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoItem label="Car Type" value={vehicle.carType} />
          </Grid>
        </Grid>
      </Box>

      {/* Insurance & Certificates */}
      <Box>
        <Divider sx={{ mb: 3 }} />
        <Typography
          variant="h6"
          fontWeight="bold"
          color="primary.main"
          sx={{ mb: 3 }}
        >
          Insurance & Certificates
        </Typography>
        <Grid container spacing={{ xs: 2, md: 3 }}>
          <Grid item xs={12} md={6}>
            <InfoItem
              label="Insurance Company"
              value={vehicle.insuranceCompany}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoItem label="Policy No" value={vehicle.policyNumber} />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoItem label="Insurance Type" value={vehicle.insuranceType} />
          </Grid>
          <Grid item xs={12} md={6}>
            {/* Ensure premium amount is formatted correctly */}
            <InfoItem
              label="Premium Amount"
              value={vehicle.premiumAmount ? `₹${vehicle.premiumAmount}` : "—"}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoItem
              label="Insurance Validity"
              value={formatValidityPeriod(
                vehicle.insuranceStartDate,
                vehicle.insuranceExpiryDate
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoItem
              label="PUC Certificate No"
              value={vehicle.pucCertificateNo}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoItem label="PUC Validity" value={vehicle.pucValidityDate} />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoItem
              label="Road Tax No"
              value={vehicle.roadTaxCertificateNo}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoItem
              label="Road Tax Validity"
              value={vehicle.roadTaxValidityDate}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Service & Maintenance */}
      <Box>
        <Divider sx={{ mb: 3 }} />
        <Typography
          variant="h6"
          fontWeight="bold"
          color="primary.main"
          sx={{ mb: 3 }}
        >
          Service & Maintenance
        </Typography>
        <Grid container spacing={{ xs: 2, md: 3 }}>
          <Grid item xs={12} md={6}>
            <InfoItem
              label="Last Service"
              value={formatServiceInfo(
                vehicle.lastServiceDate,
                vehicle.lastServiceKM
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoItem
              label="Next Service"
              value={formatServiceInfo(
                vehicle.nextServiceDueDate,
                vehicle.nextServiceDueKM
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoItem
              label="Oil Change"
              value={formatServiceInfo(
                vehicle.oilChangeDate,
                vehicle.oilChangeKM
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoItem
              label="Battery Change"
              value={vehicle.batteryChangeDate}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoItem label="Tyre Change" value={vehicle.tyreChangeDate} />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoItem
              label="Brake Inspection"
              value={vehicle.brakeInspectionDate}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoItem
              label="Suspension Check"
              value={vehicle.suspensionCheckDate}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoItem
              label="Wheel Alignment"
              value={vehicle.wheelAlignmentDate}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoItem
              label="Transmission Oil Change"
              value={vehicle.transmissionOilChangeDate}
            />
          </Grid>
        </Grid>
      </Box>
    </Stack>
  );
};

export default VehicleDetails;
