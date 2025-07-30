// src/components/admin/ProviderManagement/ProviderPopup.jsx

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Dialog,
  Slide,
  IconButton,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Divider,
  Chip,
  Alert,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import HourglassEmptyRoundedIcon from "@mui/icons-material/HourglassEmptyRounded";
import GarageGallery from "./GarageGallery";
import RejectReasonDialog from "./RejectReasonDialog";
import DocumentViewer from "./DocumentViewer";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  approveGarageImage,
  rejectGarageImage,
  approveAllGarageImages,
  rejectAllGarageImages,
  approveDocument,
  rejectDocument,
} from "../../../features/provider/providerThunks";
const FADE_CARD = {
  initial: { opacity: 0, y: 32, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 32, scale: 0.98 },
  transition: { duration: 0.38, ease: "easeOut" },
};

const DIALOG_FADE = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
  transition: { duration: 0.26, ease: "easeOut" },
};

const ValueOrPlaceholder = ({
  value,
  icon = <InfoOutlinedIcon fontSize="small" color="disabled" />,
  placeholder = "Not Provided",
  error = false,
  hint = "",
  align = "left",
}) => (
  <Box
    sx={{
      minHeight: 24,
      display: "flex",
      alignItems: "center",
      color: error ? "error.main" : "text.primary",
      justifyContent: align,
    }}
  >
    {value ? (
      value
    ) : (
      <Tooltip title={hint || placeholder} arrow placement="top">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            bgcolor: error ? "#fff0f0" : "#f4f6fa",
            borderRadius: 1,
            px: 1,
            py: 0.2,
            border: error ? "1px dashed #e57373" : "1px dashed #e0e0e0",
            fontSize: 13.5,
          }}
        >
          {icon}
          <Typography
            variant="body2"
            color={error ? "error.main" : "text.secondary"}
            fontStyle="italic"
          >
            {placeholder}
          </Typography>
        </Box>
      </Tooltip>
    )}
  </Box>
);

const slideTransition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ProviderPopup({
  open,
  onClose,
  provider,
  onApprove,
  onReject,
  loading = false,
  mode = "view",
}) {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useDispatch();

  const handleGarageImageApprove = (imageId) =>
    dispatch(approveGarageImage({ providerId: provider.id, imageId }));
  const handleGarageImageReject = (imageId) =>
    dispatch(rejectGarageImage({ providerId: provider.id, imageId }));
  const handleBulkGarageApprove = () =>
    dispatch(approveAllGarageImages(provider.id));
  const handleBulkGarageReject = () =>
    dispatch(rejectAllGarageImages(provider.id));

  const handleDocumentApprove = (documentId) =>
    dispatch(approveDocument({ providerId: provider.id, documentId }));
  const handleDocumentReject = (documentId) =>
    dispatch(rejectDocument({ providerId: provider.id, documentId }));

  if (!provider) return null;

  const {
    companyName,
    tier,
    serviceArea,
    location,
    availability,
    workingHours,
    accountHolderName,
    accountNumber,
    ifscCode,
    serviceCategories,
    bankName,
    branchName,
    upiId,
    User,
    Documents = [],
    kycStatus,
  } = provider;

  const garageImages = Documents.filter((doc) => doc.type === "garage_image");
  const nonGarageDocs = Documents.filter((doc) => doc.type !== "garage_image");

  const renderStatus = (status) => {
    switch (status) {
      case "verified":
        return (
          <Chip
            icon={<CheckCircleRoundedIcon color="success" />}
            label="Verified"
            color="success"
            sx={{
              fontWeight: 600,
              fontSize: 15,
              px: 1.3,
              height: 32,
              borderRadius: 0.4,
            }}
            variant="filled"
            size="medium"
          />
        );
      case "rejected":
        return (
          <Chip
            icon={<HighlightOffRoundedIcon color="error" />}
            label="Rejected"
            color="error"
            sx={{
              fontWeight: 600,
              fontSize: 15,
              px: 1.3,
              height: 32,
              borderRadius: 0.4,
            }}
            variant="outlined"
            size="medium"
          />
        );
      default:
        return (
          <Chip
            icon={<HourglassEmptyRoundedIcon color="warning" />}
            label="Pending"
            color="warning"
            sx={{
              fontWeight: 600,
              fontSize: 15,
              px: 1.3,
              height: 32,
              borderRadius: 0.4,
            }}
            variant="outlined"
            size="medium"
          />
        );
    }
  };

  const creativeCardSx = (color = "#4f8cff") => ({
    borderRadius: 0.4,
    boxShadow: "0 2px 12px 0 rgba(30,34,90,0.07)",
    border: "1px solid rgba(102,146,255,0.11)",
    bgcolor: "#fff",
    overflow: "visible",
    mb: 3,
    position: "relative",
    px: { xs: 1.2, md: 1.6 },
    pt: 0.5,
    "&:before": {
      content: '""',
      display: "block",
      position: "absolute",
      left: 0,
      top: 22,
      bottom: 18,
      width: 3.5,
      borderRadius: 4,
      background: color,
      opacity: 0.16,
    },
    transition: "box-shadow 0.19s cubic-bezier(.5,.1,.4,1)",
    "&:hover": {
      boxShadow: "0 5px 16px 0 rgba(80,90,140,0.09)",
      borderColor: "rgba(102,146,255,0.20)",
    },
  });

  const labelStyle = {
    fontWeight: 700,
    color: "#222f3e",
    minWidth: 126,
    display: "inline-block",
    fontSize: 15,
    letterSpacing: 0.3,
    marginRight: 12,
  };

  const isLocationValid =
    location && !isNaN(location.lat) && !isNaN(location.lng);

  const isAccountNumValid = accountNumber && accountNumber.length >= 8;
  const isIfscValid =
    ifscCode && /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode.toUpperCase());

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isMobile}
      slots={{
        transition: slideTransition, // replaces TransitionComponent
      }}
      slotProps={{
        paper: {
          sx: {
            borderRadius: isMobile ? 0 : 0.8,
            maxWidth: isMobile ? "100vw" : 980,
            width: "100%",
            minHeight: 480,
            m: isMobile ? 0 : "32px auto",
            p: 0,
            background: "#f5f7fb",
          },
        },
        transition: {
          direction: "up", // replaces TransitionProps
        },
      }}
      aria-labelledby="provider-profile-title"
      scroll="body"
    >
      <Box component={motion.div} {...DIALOG_FADE}>
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            bgcolor: "#fff",
            borderBottom: "1px solid #ecf0f7",
            px: { xs: 2, md: 4 },
            py: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: 68,
            backdropFilter: "blur(2px)",
            background: "rgba(255,255,255,0.96)",
          }}
        >
          <Box>
            <Typography
              id="provider-profile-title"
              variant="h5"
              fontWeight={800}
              letterSpacing={0.2}
            >
              Provider Profile
            </Typography>
            <Box mt={0.3}>{renderStatus(kycStatus)}</Box>
          </Box>
          <IconButton
            onClick={onClose}
            edge="end"
            size="large"
            aria-label="Close"
            sx={{
              ml: 1,
              bgcolor: "transparent",
              "&:hover": { bgcolor: "#f2f4f7" },
            }}
          >
            <CloseIcon fontSize="medium" />
          </IconButton>
        </Box>
        <Divider />

        <Box
          sx={{
            px: { xs: 1.3, sm: 2.3, md: 5 },
            py: { xs: 2, md: 4 },
            overflowY: "auto",
            bgcolor: "#f5f7fb",
          }}
        >
          <Grid container spacing={4} alignItems="stretch">
            {/* Left */}
            <Grid item xs={12} md={6}>
              {/* Contact */}
              <motion.div {...FADE_CARD}>
                <Card sx={creativeCardSx(theme.palette.primary.main)}>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1.1}
                    mt={2}
                    mb={0.7}
                    ml={1.5}
                  >
                    <InfoOutlinedIcon fontSize="small" color="primary" />
                    <Typography
                      variant="subtitle1"
                      fontWeight={800}
                      letterSpacing={0.1}
                      sx={{ fontSize: 17 }}
                    >
                      Contact Details
                    </Typography>
                    <Divider
                      sx={{
                        flex: 1,
                        ml: 1,
                        my: "auto",
                        borderColor: "#e3e6ee",
                      }}
                    />
                  </Box>
                  <CardContent sx={{ pt: 0.5, pb: 1.5 }}>
                    <Grid container spacing={0.7} alignItems="center">
                      <Grid item xs={12} sm={6} pr={{ xs: 8, sm: 6 }}>
                        <span style={labelStyle}>Name:</span>
                        <ValueOrPlaceholder
                          value={User?.name}
                          hint="Contact person"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} pr={{ xs: 8, sm: 6 }}>
                        <span style={labelStyle}>Email:</span>
                        <ValueOrPlaceholder
                          value={User?.email}
                          hint="Contact email"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} pr={{ xs: 8, sm: 6 }}>
                        <span style={labelStyle}>Phone:</span>
                        <ValueOrPlaceholder
                          value={User?.phone}
                          hint="Contact phone"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Garage */}
              <motion.div {...FADE_CARD}>
                <Card sx={creativeCardSx("#30b67b")}>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1.1}
                    mt={2}
                    mb={0.7}
                    ml={1.5}
                  >
                    <InfoOutlinedIcon fontSize="small" color="success" />
                    <Typography
                      variant="subtitle1"
                      fontWeight={800}
                      letterSpacing={0.1}
                      sx={{ fontSize: 17 }}
                    >
                      Garage Info
                    </Typography>
                    <Divider
                      sx={{
                        flex: 1,
                        ml: 1,
                        my: "auto",
                        borderColor: "#e3e6ee",
                      }}
                    />
                  </Box>
                  <CardContent sx={{ pt: 0.5, pb: 1.5 }}>
                    <Box
                      component="table"
                      sx={{
                        width: "100%",
                        borderSpacing: 0,
                        borderCollapse: "separate",
                        "& td": {
                          py: 1.2,
                          verticalAlign: "top",
                          border: 0,
                        },
                        "& tr:not(:last-of-type) td": {
                          borderBottom: "1px solid #f3f5fa",
                        },
                      }}
                    >
                      <tbody>
                        <tr>
                          <td
                            style={{
                              width: 132,
                              minWidth: 120,
                              fontWeight: 700,
                              color: "#234",
                            }}
                          >
                            Company:
                          </td>
                          <td style={{ wordBreak: "break-word" }}>
                            <ValueOrPlaceholder value={companyName} />
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              width: 132,
                              minWidth: 120,
                              fontWeight: 700,
                              color: "#234",
                            }}
                          >
                            Tier:
                          </td>
                          <td style={{ wordBreak: "break-word" }}>
                            <ValueOrPlaceholder
                              value={tier}
                              placeholder="Not Categorized"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              width: 132,
                              minWidth: 120,
                              fontWeight: 700,
                              color: "#234",
                            }}
                          >
                            Service Area:
                          </td>
                          <td style={{ wordBreak: "break-word" }}>
                            <ValueOrPlaceholder
                              value={
                                Array.isArray(serviceArea) && serviceArea.length
                                  ? serviceArea.join(", ")
                                  : ""
                              }
                              placeholder="No Service Areas Set"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              width: 132,
                              minWidth: 120,
                              fontWeight: 700,
                              color: "#234",
                            }}
                          >
                            Service Categories:
                          </td>
                          <td style={{ wordBreak: "break-word" }}>
                            <ValueOrPlaceholder
                              value={
                                Array.isArray(serviceCategories) &&
                                serviceCategories.length
                                  ? serviceCategories.join(", ")
                                  : ""
                              }
                              placeholder="No Service Categories Set"
                            />
                          </td>
                        </tr>

                        <tr>
                          <td
                            style={{
                              width: 132,
                              minWidth: 120,
                              fontWeight: 700,
                              color: "#234",
                            }}
                          >
                            Location:
                          </td>
                          <td style={{ wordBreak: "break-word" }}>
                            {isLocationValid ? (
                              `${location.lat}, ${location.lng}`
                            ) : (
                              <ValueOrPlaceholder
                                value={null}
                                error
                                placeholder="Invalid / Not Set"
                                hint="Missing or invalid coordinates"
                              />
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              width: 132,
                              minWidth: 120,
                              fontWeight: 700,
                              color: "#234",
                            }}
                          >
                            Availability:
                          </td>
                          <td style={{ wordBreak: "break-word" }}>
                            <ValueOrPlaceholder
                              value={
                                availability && typeof availability === "object"
                                  ? Object.entries(availability)
                                      .filter(([_, val]) => val)
                                      .map(([day]) => day)
                                      .join(", ") || ""
                                  : ""
                              }
                              placeholder="No Days Set"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              width: 132,
                              minWidth: 120,
                              fontWeight: 700,
                              color: "#234",
                            }}
                          >
                            Working Hours:
                          </td>
                          <td style={{ wordBreak: "break-word" }}>
                            <ValueOrPlaceholder
                              value={
                                workingHours?.open && workingHours?.close
                                  ? `${workingHours.open} - ${workingHours.close}`
                                  : ""
                              }
                              placeholder="Not Specified"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Bank */}
              <motion.div {...FADE_CARD}>
                <Card sx={creativeCardSx("#eb8a19")}>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1.1}
                    mt={2}
                    mb={0.7}
                    ml={1.5}
                  >
                    <InfoOutlinedIcon fontSize="small" color="warning" />
                    <Typography
                      variant="subtitle1"
                      fontWeight={800}
                      letterSpacing={0.1}
                      sx={{ fontSize: 17 }}
                    >
                      Bank Details
                    </Typography>
                    <Divider
                      sx={{
                        flex: 1,
                        ml: 1,
                        my: "auto",
                        borderColor: "#e3e6ee",
                      }}
                    />
                  </Box>
                  <CardContent sx={{ pt: 0.5, pb: 1.5 }}>
                    <Grid container spacing={0.7} alignItems="center">
                      <Grid item xs={12} sm={6} pr={{ xs: 8, sm: 6 }}>
                        <span style={labelStyle}>Account Holder:</span>
                        <ValueOrPlaceholder value={accountHolderName} />
                      </Grid>
                      <Grid item xs={12} sm={6} pr={{ xs: 8, sm: 6 }}>
                        <span style={labelStyle}>Account #:</span>
                        <ValueOrPlaceholder
                          value={
                            isAccountNumValid
                              ? `****${accountNumber?.slice(-4)}`
                              : null
                          }
                          error={!isAccountNumValid}
                          placeholder={
                            accountNumber ? "Too Short" : "Not Provided"
                          }
                          hint="Account number must be 8+ digits"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} pr={{ xs: 8, sm: 6 }}>
                        <span style={labelStyle}>IFSC:</span>
                        <ValueOrPlaceholder
                          value={isIfscValid ? ifscCode : null}
                          error={!isIfscValid && ifscCode}
                          placeholder={
                            ifscCode ? "Invalid IFSC" : "Not Provided"
                          }
                          hint="Standard 11-char IFSC code"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} pr={{ xs: 8, sm: 6 }}>
                        <span style={labelStyle}>Bank:</span>
                        <ValueOrPlaceholder value={bankName} />
                      </Grid>
                      <Grid item xs={12} sm={6} pr={{ xs: 8, sm: 6 }}>
                        <span style={labelStyle}>Branch:</span>
                        <ValueOrPlaceholder value={branchName} />
                      </Grid>
                      <Grid item xs={12} sm={6} pr={{ xs: 8, sm: 6 }}>
                        <span style={labelStyle}>UPI:</span>
                        <ValueOrPlaceholder
                          value={upiId}
                          placeholder="Not Linked"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* Right */}
            <Grid item xs={12} md={6} sx={{ minHeight: 330 }}>
              {/* Documents */}
              <motion.div {...FADE_CARD}>
                <Card sx={creativeCardSx("#60a5fa")}>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1.1}
                    mt={2}
                    mb={0.7}
                    ml={0.5}
                  >
                    <InfoOutlinedIcon fontSize="small" color="primary" />
                    <Typography
                      variant="subtitle1"
                      fontWeight={800}
                      letterSpacing={0.1}
                      sx={{ fontSize: 17 }}
                    >
                      KYC Documents
                    </Typography>
                    <Divider
                      sx={{
                        flex: 1,
                        ml: 1,
                        my: "auto",
                        borderColor: "#e3e6ee",
                      }}
                    />
                  </Box>
                  <CardContent sx={{ pt: 0.5, pb: 1.5 }}>
                    {nonGarageDocs.length === 0 ? (
                      <Alert
                        severity="info"
                        sx={{
                          bgcolor: "#f3f8ff",
                          color: "#1769aa",
                          borderRadius: 2,
                          fontWeight: 500,
                          mb: 1,
                        }}
                        iconMapping={{
                          info: <InfoOutlinedIcon color="primary" />,
                        }}
                      >
                        No KYC documents uploaded.
                      </Alert>
                    ) : (
                      <Grid
                        container
                        spacing={2}
                        justifyContent={{ xs: "center", sm: "flex-start" }}
                      >
                        {nonGarageDocs.map((doc) => (
                          <Grid
                            item
                            xs={12}
                            sm={10}
                            md={6}
                            key={doc.id}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <Box width="100%" maxWidth={400}>
                              <DocumentViewer
                                doc={doc}
                                onApprove={handleDocumentApprove}
                                onReject={handleDocumentReject}
                                status={doc.status}
                              />
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Gallery */}
              <motion.div {...FADE_CARD}>
                <Card sx={creativeCardSx("#29b6f6")}>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1.1}
                    mt={2}
                    mb={0.7}
                    ml={1.5}
                  >
                    <InfoOutlinedIcon fontSize="small" color="info" />
                    <Typography
                      variant="subtitle1"
                      fontWeight={800}
                      letterSpacing={0.1}
                      sx={{ fontSize: 17 }}
                    >
                      Garage Gallery
                    </Typography>
                    <Divider
                      sx={{
                        flex: 1,
                        ml: 1,
                        my: "auto",
                        borderColor: "#e3e6ee",
                      }}
                    />
                  </Box>
                  <CardContent sx={{ pt: 0.5, pb: 1.5 }}>
                    {garageImages.length === 0 ? (
                      <Alert
                        severity="info"
                        sx={{
                          bgcolor: "#f1fcf8",
                          color: "#057857",
                          borderRadius: 2,
                          fontWeight: 500,
                          mb: 1,
                        }}
                        iconMapping={{
                          info: <InfoOutlinedIcon color="success" />,
                        }}
                      >
                        No garage images uploaded.
                      </Alert>
                    ) : (
                      <GarageGallery
                        images={garageImages}
                        onApproveAll={handleBulkGarageApprove}
                        onRejectAll={handleBulkGarageReject}
                        onImageApprove={handleGarageImageApprove}
                        onImageReject={handleGarageImageReject}
                      />
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Box>

        {/* Sticky footer actions */}
        <Divider sx={{ mt: 1 }} />
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: { xs: "center", sm: "space-between" },
            alignItems: "center",
            px: { xs: 2, md: 4 },
            py: 1,
            bgcolor: "#fff",
            borderBottomLeftRadius: isMobile ? 0 : 8,
            borderBottomRightRadius: isMobile ? 0 : 8,
            position: "sticky",
            bottom: 0,
            zIndex: 20,
            boxShadow: "0 4px 20px 0 rgba(80,100,150,0.08)",
            backdropFilter: "blur(3px)",
            background: "rgba(255,255,255,0.98)",
            minHeight: 62,
            gap: { xs: 2, sm: 0 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "center",
              alignItems: "center",
              gap: { xs: 1.5, sm: 0 },
            }}
          >
            <Button
              variant="contained"
              color="success"
              size="large"
              disabled={loading || showRejectForm}
              onClick={onApprove}
              sx={{
                borderRadius: 2,
                fontWeight: 700,
                px: 3,
                my: { xs: 0.1, sm: 1 },
                boxShadow: "0 2px 6px 0 rgba(30,34,90,0.06)",
                textTransform: "none",
                mr: { xs: 0, sm: 1.1 },
                width: { xs: "100%", sm: "auto" },
              }}
              fullWidth={isMobile}
            >
              Approve Provider
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="large"
              disabled={loading || showRejectForm}
              onClick={() => setShowRejectForm(true)}
              sx={{
                borderRadius: 7,
                fontWeight: 700,
                px: 3,
                my: { xs: 0.1, sm: 1 },
                ml: { xs: 0, sm: 1.1 },
                textTransform: "none",
                width: { xs: "100%", sm: "auto" },
              }}
              fullWidth={isMobile}
            >
              Reject with Reason
            </Button>
          </Box>
          <AnimatePresence>
            {showRejectForm && (
              <RejectReasonDialog
                open={showRejectForm}
                onClose={() => setShowRejectForm(false)}
                onSubmit={async (reason) => {
                  await onReject(reason); // Just call the handler
                  setShowRejectForm(false);
                  onClose();
                }}
              />
            )}
          </AnimatePresence>
        </Box>
      </Box>
    </Dialog>
  );
}
