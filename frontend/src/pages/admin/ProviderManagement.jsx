// src/pages/admin/ProviderManagement.jsx
import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import ProviderTable from "../../components/admin/ProviderManagement/ProviderTable";
import ProviderPopup from "../../components/admin/ProviderManagement/ProviderPopup";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import {
  approveProvider,
  rejectProvider,
} from "../../features/provider/providerThunks";
import { DomainVerification, ErrorOutline } from "@mui/icons-material";

const ProviderManagement = () => {
  const dispatch = useDispatch();
  const [selectedProvider, setSelectedProvider] = useState(null);

  const handleApprove = async (id, companyName) => {
    if (!id) return;
    try {
      await dispatch(approveProvider(id)).unwrap();
      toast.success(`Provider "${companyName || "Unknown"}" approved.`, {
        autoClose: 2600,
      });
      setSelectedProvider(null);
    } catch (err) {
      toast.error(
        typeof err === "string" ? err : "Failed to approve provider."
      );
    }
  };

  const handleReject = async (id, reason) => {
    if (!id) return;
    try {
      await dispatch(rejectProvider({ providerId: id, reason })).unwrap();
      toast.error("Provider rejected.", { autoClose: 2900 });
      setTimeout(() => setSelectedProvider(null), 250); // Delay close
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Failed to reject provider.");
    }
  };

  return (
    <Box
      sx={{
        px: { xs: 1, sm: 3, md: 7 },
        pt: { xs: 2, sm: 4 },
        pb: 6,
        width: "100%",
        minHeight: "100vh",
        bgcolor: "#f6f8fc",
      }}
    >
      {/* Sticky page header */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 9,
          bgcolor: "#f6f8fc",
          pb: 2,
          mb: 2.5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.8,
            mb: 0.4,
            mt: 1,
          }}
        >
          <DomainVerification
            fontSize="large"
            color="primary"
            sx={{
              bgcolor: "#e8f2ff",
              borderRadius: 1,
              p: 0.7,
              mr: 1,
              boxShadow: "0 1px 6px 0 rgba(30,100,220,0.06)",
            }}
          />
          <Box>
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{
                letterSpacing: 0.2,
                lineHeight: 1.18,
                color: "#193057",
                fontSize: { xs: 26, sm: 32, md: 36 },
              }}
              gutterBottom
            >
              Provider Management
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: "#6a768c",
                fontSize: { xs: 15, sm: 16 },
                fontWeight: 400,
                mb: 0.2,
              }}
            >
              Review, verify, or reject provider KYC applications and manage
              onboarding.
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ mt: 1, px: { xs: 0, md: 1 } }}>
        <ProviderTable onViewProfile={setSelectedProvider} />
      </Box>

      <ProviderPopup
        open={!!selectedProvider}
        provider={selectedProvider}
        onClose={() => setSelectedProvider(null)}
        onApprove={() =>
          selectedProvider &&
          handleApprove(selectedProvider.id, selectedProvider.companyName)
        }
        onReject={(reason) =>
          selectedProvider &&
          handleReject(
            selectedProvider.id,
            reason,
            selectedProvider.companyName
          )
        }
      />
    </Box>
  );
};

export default ProviderManagement;
