import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Stack,
  Switch,
  TextField,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Snackbar,
  Alert,
  Zoom, // For Snackbar transition
} from "@mui/material";
import {
  UploadFile,
  Payment,
  Home,
  Settings,
  Logout,
  Notifications,
  DirectionsCar,
  AddCircleOutline,
  Edit,
  Delete,
  Lock,
  ExpandMore as ExpandMoreIcon,
  Person as PersonIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  ErrorOutline as ErrorOutlineIcon,
  InfoOutlined as InfoOutlinedIcon,
} from "@mui/icons-material";

// --- Design Constants & Themes (Simulated for this component) ---
const NEUTRAL_LIGHT = "#f5f7fa"; // A soft background color for the page
const PRIMARY_COLOR = "#1976d2"; // MUI default primary
const TEXT_SECONDARY_COLOR = "#6b7280"; // A slightly darker secondary text
const BORDER_COLOR = "#e0e0e0"; // Light grey for borders

const CARD_BORDER_RADIUS = "20px"; // Softer, more modern cards
const NESTED_BORDER_RADIUS = "14px"; // Slightly smaller for nested elements
const BUTTON_BORDER_RADIUS = "10px"; // Rounded buttons

// Custom shadow for more depth, simulating a design system's elevation
const customShadow =
  "0 8px 24px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04)";

const Profile = () => {
  // --- State Management ---
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1 234 567 8900",
    avatarUrl: "/avatar.jpg", // Ensure this path is valid or null for default icon
  });
  const [vehicles, setVehicles] = useState([
    { id: 1, make: "Honda", model: "Civic", year: 2020 },
    { id: 2, make: "Ford", model: "Endeavour", year: 2022 },
  ]);

  // Modals & Dialogs
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [showEditVehicleModal, setShowEditVehicleModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  // Form States
  const [vehicleForm, setVehicleForm] = useState({
    make: "",
    model: "",
    year: "",
  });
  const [editingVehicleId, setEditingVehicleId] = useState(null);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [profileEditForm, setProfileEditForm] = useState({ ...profileData });

  // UI States
  const [expandedAccordion, setExpandedAccordion] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // --- Handlers ---

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedAccordion(isExpanded ? panel : false);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const showFeedback = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setShowLogoutConfirm(false);
      showFeedback("You have been successfully logged out.", "success");
      // Add actual logout logic (e.g., clear tokens, redirect to login page)
      console.log("User logged out");
    } catch (error) {
      showFeedback("Logout failed. Please try again.", "error");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwords.new.length < 6) {
      showFeedback("New password must be at least 6 characters long.", "error");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      showFeedback("New password and confirmation do not match.", "error");
      return;
    }
    if (!passwords.current) {
      showFeedback("Please enter your current password.", "error");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1800));
      // In a real app, you'd check if current password is correct
      console.log("Password changed:", passwords);
      setPasswords({ current: "", new: "", confirm: "" });
      setExpandedAccordion(false); // Collapse password section
      showFeedback("Your password has been updated successfully!", "success");
    } catch (error) {
      showFeedback(
        "Failed to update password. Please check your current password.",
        "error"
      );
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleAddVehicle = () => {
    if (!vehicleForm.make || !vehicleForm.model || !vehicleForm.year) {
      showFeedback("Please fill in all vehicle details.", "error");
      return;
    }
    if (
      isNaN(vehicleForm.year) ||
      vehicleForm.year < 1900 ||
      vehicleForm.year > new Date().getFullYear() + 1
    ) {
      showFeedback("Please enter a valid year (e.g., 2023).", "error");
      return;
    }

    setVehicles([...vehicles, { id: Date.now(), ...vehicleForm }]);
    setVehicleForm({ make: "", model: "", year: "" });
    setShowAddVehicleModal(false);
    showFeedback("New vehicle registered successfully!", "success");
  };

  const handleEditVehicleClick = (vehicle) => {
    setEditingVehicleId(vehicle.id);
    setVehicleForm({
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
    });
    setShowEditVehicleModal(true);
  };

  const handleSaveEditedVehicle = () => {
    if (!vehicleForm.make || !vehicleForm.model || !vehicleForm.year) {
      showFeedback("All vehicle fields are required.", "error");
      return;
    }
    if (
      isNaN(vehicleForm.year) ||
      vehicleForm.year < 1900 ||
      vehicleForm.year > new Date().getFullYear() + 1
    ) {
      showFeedback("Please enter a valid year for the vehicle.", "error");
      return;
    }

    setVehicles(
      vehicles.map((v) =>
        v.id === editingVehicleId ? { ...v, ...vehicleForm } : v
      )
    );
    setVehicleForm({ make: "", model: "", year: "" });
    setEditingVehicleId(null);
    setShowEditVehicleModal(false);
    showFeedback("Vehicle details updated successfully!", "success");
  };

  const handleDeleteVehicle = (id) => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete this vehicle from your list? This action cannot be undone."
      )
    ) {
      setVehicles(vehicles.filter((v) => v.id !== id));
      showFeedback("Vehicle entry has been removed.", "info");
    }
  };

  const handleSaveProfileChanges = () => {
    if (
      !profileEditForm.name ||
      !profileEditForm.email ||
      !profileEditForm.phone
    ) {
      showFeedback("All profile fields are required.", "error");
      return;
    }
    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(profileEditForm.email)) {
      showFeedback("Please enter a valid email address.", "error");
      return;
    }
    setProfileData({ ...profileEditForm });
    setShowEditProfileModal(false);
    showFeedback("Your personal information has been updated!", "success");
  };

  // --- Render ---
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ background: NEUTRAL_LIGHT, minHeight: "100vh" }}
    >
      <Box className="max-w-4xl mx-auto p-6 md:p-10 pb-12">
        {/* Profile Header Section */}
        <Card
          sx={{
            borderRadius: CARD_BORDER_RADIUS,
            boxShadow: customShadow,
            mb: 6,
            background: "linear-gradient(135deg, #e0f2f7 0%, #ffffff 100%)", // Subtle gradient
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundImage: "url(/abstract-bg.svg)", // Replace with a subtle abstract pattern if available
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.05,
              zIndex: 0,
            }}
          />
          <CardContent sx={{ zIndex: 1, position: "relative" }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={4}
              alignItems={{ xs: "center", md: "flex-start" }}
              textAlign={{ xs: "center", md: "left" }}
            >
              <Avatar
                alt={profileData.name}
                src={profileData.avatarUrl}
                sx={{
                  width: 150,
                  height: 150,
                  border: "4px solid",
                  borderColor: PRIMARY_COLOR,
                  boxShadow: "0 4px 15px rgba(0,0,0,0.2)", // Stronger shadow for avatar
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": { transform: "scale(1.03)" },
                }}
              >
                {!profileData.avatarUrl && (
                  <PersonIcon sx={{ fontSize: 100, color: PRIMARY_COLOR }} />
                )}
              </Avatar>
              <Stack spacing={1.5} flexGrow={1}>
                <Typography variant="h4" fontWeight={700} color="text.primary">
                  {profileData.name}
                </Typography>
                <Typography
                  color={TEXT_SECONDARY_COLOR}
                  variant="h6"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <span style={{ color: PRIMARY_COLOR }}>&#9993;</span>{" "}
                  {profileData.email}
                </Typography>
                <Typography
                  variant="body1"
                  color={TEXT_SECONDARY_COLOR}
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <span style={{ color: PRIMARY_COLOR }}>&#9742;</span>{" "}
                  {profileData.phone}
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => {
                    setProfileEditForm({ ...profileData });
                    setShowEditProfileModal(true);
                  }}
                  sx={{
                    mt: 3,
                    alignSelf: { xs: "center", md: "flex-start" },
                    borderRadius: BUTTON_BORDER_RADIUS,
                    background: `linear-gradient(45deg, ${PRIMARY_COLOR} 30%, #42a5f5 90%)`, // Subtle gradient for primary button
                    boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
                    "&:hover": {
                      boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
                      transform: "translateY(-1px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Update Personal Information
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* Accordion Sections for Profile Details */}
        <Stack spacing={3} mb={6}>
          {[
            {
              title: "Your Delivery Addresses",
              icon: <Home color="primary" />,
              panel: "addresses",
              content: (
                <>
                  <Typography variant="body1" color="text.secondary" mb={1}>
                    **Primary (Home):** 123 Main St, Springfield, Anytown -
                    12345
                  </Typography>
                  <Typography variant="body1" color="text.secondary" mb={2}>
                    **Secondary (Work):** 456 Corporate Ave, Metropolis, Big
                    City - 67890
                  </Typography>
                  <Button
                    size="medium"
                    variant="outlined"
                    sx={{ borderRadius: BUTTON_BORDER_RADIUS }}
                  >
                    Manage & Add Addresses
                  </Button>
                </>
              ),
            },
            {
              title: "Payment Methods",
              icon: <Payment color="primary" />,
              panel: "paymentMethods",
              content: (
                <>
                  <Typography variant="body1" color="text.secondary" mb={2}>
                    **Default:** Visa ending in **** 5678 (Expires 12/26)
                    <br />
                    <small>
                      Auto-billing setup: Monthly. Securely stored for your
                      convenience.
                    </small>
                  </Typography>
                  <Button
                    size="medium"
                    variant="outlined"
                    sx={{ borderRadius: BUTTON_BORDER_RADIUS }}
                  >
                    View & Manage Payments
                  </Button>
                </>
              ),
            },
            {
              title: "My Documents",
              icon: <UploadFile color="primary" />,
              panel: "documents",
              content: (
                <>
                  <Typography variant="body1" color="text.secondary" mb={2}>
                    **Uploaded:** Vehicle Registration Certificate (RC),
                    Comprehensive Insurance Policy, Driving License.
                    <br />
                    <small>
                      Keep your documents up-to-date to ensure seamless service
                      and compliance.
                    </small>
                  </Typography>
                  <Button
                    size="medium"
                    variant="outlined"
                    sx={{ borderRadius: BUTTON_BORDER_RADIUS }}
                  >
                    View & Upload Documents
                  </Button>
                </>
              ),
            },
            {
              title: "Notification Preferences",
              icon: <Notifications color="primary" />,
              panel: "notifications",
              content: (
                <Stack spacing={2}>
                  {[
                    "Service Reminders",
                    "Promotional Offers",
                    "Account Alerts",
                  ].map((item) => (
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      key={item}
                    >
                      <Typography variant="body1" color="text.secondary">
                        {item}
                      </Typography>
                      <Switch defaultChecked color="primary" />
                    </Stack>
                  ))}
                  <Typography variant="body2" color="text.disabled" mt={1}>
                    *Essential account updates and security notifications are
                    always active.
                  </Typography>
                </Stack>
              ),
            },
          ].map(({ title, icon, panel, content }) => (
            <Accordion
              expanded={expandedAccordion === panel}
              onChange={handleAccordionChange(panel)}
              key={panel}
              sx={{
                borderRadius: CARD_BORDER_RADIUS,
                boxShadow: customShadow,
                "&:before": { display: "none" }, // Remove default Accordion border
                transition: "all 0.3s ease",
                "&.Mui-expanded": {
                  margin: "16px 0", // Give more space when expanded
                  boxShadow: "0 12px 30px rgba(0,0,0,0.12)", // Deeper shadow when open
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: PRIMARY_COLOR }} />}
                sx={{
                  bgcolor:
                    expandedAccordion === panel
                      ? "primary.light"
                      : "background.paper", // Highlight header when open
                  borderRadius:
                    expandedAccordion === panel
                      ? `${CARD_BORDER_RADIUS} ${CARD_BORDER_RADIUS} 0 0`
                      : CARD_BORDER_RADIUS,
                  transition:
                    "background-color 0.3s ease, border-radius 0.3s ease",
                  "&:hover": {
                    bgcolor:
                      expandedAccordion === panel
                        ? "primary.light"
                        : NEUTRAL_LIGHT,
                  },
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  {icon}
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    color="text.primary"
                  >
                    {title}
                  </Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails
                sx={{ pt: 3, pb: 2, borderTop: `1px solid ${BORDER_COLOR}` }}
              >
                {content}
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>

        {/* My Vehicles Section */}
        <Card
          sx={{
            borderRadius: CARD_BORDER_RADIUS,
            boxShadow: customShadow,
            mb: 6,
          }}
        >
          <CardContent>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <DirectionsCar color="primary" sx={{ fontSize: "2.2rem" }} />
                <Typography variant="h6" fontWeight={600}>
                  My Registered Vehicles
                </Typography>
              </Stack>
              <Button
                startIcon={<AddCircleOutline />}
                variant="contained"
                size="medium"
                onClick={() => {
                  setVehicleForm({ make: "", model: "", year: "" });
                  setShowAddVehicleModal(true);
                }}
                sx={{ borderRadius: BUTTON_BORDER_RADIUS }}
              >
                Add New Vehicle
              </Button>
            </Stack>
            <Divider sx={{ mb: 3 }} />
            {vehicles.length === 0 ? (
              <Box
                py={4}
                textAlign="center"
                sx={{
                  bgcolor: NEUTRAL_LIGHT,
                  borderRadius: NESTED_BORDER_RADIUS,
                  border: `2px dashed ${PRIMARY_COLOR}`, // Primary color dashed border
                  color: TEXT_SECONDARY_COLOR,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: "primary.light", // Lighter primary background on hover
                    borderColor: "primary.dark",
                    color: PRIMARY_COLOR,
                    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                  },
                }}
                onClick={() => setShowAddVehicleModal(true)}
              >
                <AddCircleOutline
                  sx={{ fontSize: "3rem", mb: 1, color: PRIMARY_COLOR }}
                />
                <Typography variant="h6" fontWeight={500} color="text.primary">
                  No Vehicles Added Yet
                </Typography>
                <Typography variant="body2" color={TEXT_SECONDARY_COLOR}>
                  Click here to register your first vehicle for service and
                  management.
                </Typography>
              </Box>
            ) : (
              <Stack spacing={2.5}>
                {vehicles.map((vehicle) => (
                  <Box
                    key={vehicle.id}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    p={2.5}
                    sx={{
                      bgcolor: "background.paper",
                      borderRadius: NESTED_BORDER_RADIUS,
                      border: `1px solid ${BORDER_COLOR}`,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                      transition:
                        "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, border-color 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
                        borderColor: PRIMARY_COLOR, // Highlight border on hover
                      },
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <DirectionsCar
                        sx={{ color: PRIMARY_COLOR, fontSize: "1.8rem" }}
                      />
                      <Typography
                        variant="body1"
                        fontWeight={600}
                        color="text.primary"
                      >
                        {vehicle.make} {vehicle.model} ({vehicle.year})
                      </Typography>
                    </Stack>
                    <Box>
                      <IconButton
                        color="primary"
                        size="medium"
                        onClick={() => handleEditVehicleClick(vehicle)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="medium"
                        onClick={() => handleDeleteVehicle(vehicle.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
              </Stack>
            )}
          </CardContent>
        </Card>

        {/* Change Password Section */}
        <Card
          sx={{
            borderRadius: CARD_BORDER_RADIUS,
            boxShadow: customShadow,
            mb: 6,
          }}
        >
          <CardContent>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Lock color="primary" sx={{ fontSize: "2.2rem" }} />
                <Typography variant="h6" fontWeight={600}>
                  Account Security & Password
                </Typography>
              </Stack>
              <Button
                variant="outlined"
                size="medium"
                onClick={() =>
                  setExpandedAccordion(
                    expandedAccordion === "password" ? false : "password"
                  )
                }
                sx={{ borderRadius: BUTTON_BORDER_RADIUS }}
              >
                {expandedAccordion === "password"
                  ? "Hide Password Form"
                  : "Change Your Password"}
              </Button>
            </Stack>
            {expandedAccordion === "password" && (
              <Grid container spacing={3} mt={1}>
                <Grid item xs={12}>
                  <TextField
                    label="Current Password"
                    type="password"
                    fullWidth
                    variant="outlined"
                    value={passwords.current}
                    onChange={(e) =>
                      setPasswords({ ...passwords, current: e.target.value })
                    }
                    sx={{ borderRadius: BUTTON_BORDER_RADIUS }}
                    helperText="Enter your existing password to verify your identity."
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="New Password"
                    type="password"
                    fullWidth
                    variant="outlined"
                    value={passwords.new}
                    onChange={(e) =>
                      setPasswords({ ...passwords, new: e.target.value })
                    }
                    sx={{ borderRadius: BUTTON_BORDER_RADIUS }}
                    error={passwords.new.length > 0 && passwords.new.length < 6}
                    helperText={
                      passwords.new.length > 0 && passwords.new.length < 6
                        ? "Password must be at least 6 characters."
                        : "Choose a strong new password."
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Confirm New Password"
                    type="password"
                    fullWidth
                    variant="outlined"
                    value={passwords.confirm}
                    onChange={(e) =>
                      setPasswords({ ...passwords, confirm: e.target.value })
                    }
                    sx={{ borderRadius: BUTTON_BORDER_RADIUS }}
                    error={
                      passwords.confirm.length > 0 &&
                      passwords.new !== passwords.confirm
                    }
                    helperText={
                      passwords.confirm.length > 0 &&
                      passwords.new !== passwords.confirm
                        ? "Passwords do not match."
                        : "Re-enter your new password to confirm."
                    }
                  />
                </Grid>
                <Grid item xs={12} textAlign="right">
                  <Button
                    variant="contained"
                    onClick={handlePasswordChange}
                    disabled={
                      isUpdatingPassword ||
                      !passwords.current ||
                      passwords.new.length < 6 ||
                      passwords.new !== passwords.confirm
                    }
                    sx={{ borderRadius: BUTTON_BORDER_RADIUS }}
                  >
                    {isUpdatingPassword ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </Grid>
              </Grid>
            )}
          </CardContent>
        </Card>

        {/* Account Actions & Logout Section */}
        <Card
          sx={{ borderRadius: CARD_BORDER_RADIUS, boxShadow: customShadow }}
        >
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Settings color="primary" sx={{ fontSize: "2.2rem" }} />
              <Typography variant="h6" fontWeight={600}>
                Account Management
              </Typography>
            </Stack>
            <Button
              variant="contained"
              color="error"
              size="medium"
              startIcon={
                isLoggingOut ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <Logout />
                )
              }
              onClick={() => setShowLogoutConfirm(true)}
              disabled={isLoggingOut}
              sx={{ borderRadius: BUTTON_BORDER_RADIUS }}
            >
              {isLoggingOut ? "Signing Out..." : "Sign Out"}
            </Button>
          </CardContent>
        </Card>

        {/* --- Modals and Dialogs --- */}

        {/* Edit Profile Modal */}
        <Dialog
          open={showEditProfileModal}
          onClose={() => setShowEditProfileModal(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle
            sx={{
              fontWeight: 600,
              borderBottom: `1px solid ${BORDER_COLOR}`,
              pb: 2,
            }}
          >
            Update Your Personal Details
          </DialogTitle>
          <DialogContent dividers sx={{ pt: 3, pb: 2 }}>
            <Stack spacing={3} mt={1}>
              <TextField
                label="Full Name"
                fullWidth
                variant="outlined"
                value={profileEditForm.name}
                onChange={(e) =>
                  setProfileEditForm({
                    ...profileEditForm,
                    name: e.target.value,
                  })
                }
                helperText="This name will appear on your profile and bookings."
                sx={{ borderRadius: BUTTON_BORDER_RADIUS }}
              />
              <TextField
                label="Email Address"
                fullWidth
                variant="outlined"
                type="email"
                value={profileEditForm.email}
                onChange={(e) =>
                  setProfileEditForm({
                    ...profileEditForm,
                    email: e.target.value,
                  })
                }
                helperText="All important communications will be sent to this email."
                sx={{ borderRadius: BUTTON_BORDER_RADIUS }}
              />
              <TextField
                label="Phone Number"
                fullWidth
                variant="outlined"
                type="tel"
                value={profileEditForm.phone}
                onChange={(e) =>
                  setProfileEditForm({
                    ...profileEditForm,
                    phone: e.target.value,
                  })
                }
                helperText="Used for service updates and direct contact."
                sx={{ borderRadius: BUTTON_BORDER_RADIUS }}
              />
            </Stack>
          </DialogContent>
          <DialogActions
            sx={{ pt: 2, pb: 2, borderTop: `1px solid ${BORDER_COLOR}` }}
          >
            <Button
              onClick={() => setShowEditProfileModal(false)}
              sx={{ borderRadius: BUTTON_BORDER_RADIUS }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveProfileChanges}
              sx={{ borderRadius: BUTTON_BORDER_RADIUS }}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Vehicle Modal */}
        <Dialog
          open={showAddVehicleModal}
          onClose={() => setShowAddVehicleModal(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle
            sx={{
              fontWeight: 600,
              borderBottom: `1px solid ${BORDER_COLOR}`,
              pb: 2,
            }}
          >
            Register New Vehicle
          </DialogTitle>
          <DialogContent dividers sx={{ pt: 3, pb: 2 }}>
            <Stack spacing={3} mt={1}>
              <TextField
                label="Vehicle Make (e.g., Toyota)"
                fullWidth
                variant="outlined"
                value={vehicleForm.make}
                onChange={(e) =>
                  setVehicleForm({ ...vehicleForm, make: e.target.value })
                }
                required
                sx={{ borderRadius: BUTTON_BORDER_RADIUS }}
              />
              <TextField
                label="Vehicle Model (e.g., Camry)"
                fullWidth
                variant="outlined"
                value={vehicleForm.model}
                onChange={(e) =>
                  setVehicleForm({ ...vehicleForm, model: e.target.value })
                }
                required
                sx={{ borderRadius: BUTTON_BORDER_RADIUS }}
              />
              <TextField
                label="Manufacture Year (e.g., 2023)"
                fullWidth
                variant="outlined"
                type="number"
                value={vehicleForm.year}
                onChange={(e) =>
                  setVehicleForm({ ...vehicleForm, year: e.target.value })
                }
                required
                inputProps={{ min: 1900, max: new Date().getFullYear() + 1 }}
                sx={{ borderRadius: BUTTON_BORDER_RADIUS }}
              />
            </Stack>
          </DialogContent>
          <DialogActions
            sx={{ pt: 2, pb: 2, borderTop: `1px solid ${BORDER_COLOR}` }}
          >
            <Button
              onClick={() => setShowAddVehicleModal(false)}
              sx={{ borderRadius: BUTTON_BORDER_RADIUS }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleAddVehicle}
              sx={{ borderRadius: BUTTON_BORDER_RADIUS }}
            >
              Add Vehicle
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Vehicle Modal */}
        <Dialog
          open={showEditVehicleModal}
          onClose={() => setShowEditVehicleModal(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle
            sx={{
              fontWeight: 600,
              borderBottom: `1px solid ${BORDER_COLOR}`,
              pb: 2,
            }}
          >
            Edit Vehicle Details
          </DialogTitle>
          <DialogContent dividers sx={{ pt: 3, pb: 2 }}>
            <Stack spacing={3} mt={1}>
              <TextField
                label="Vehicle Make"
                fullWidth
                variant="outlined"
                value={vehicleForm.make}
                onChange={(e) =>
                  setVehicleForm({ ...vehicleForm, make: e.target.value })
                }
                required
                sx={{ borderRadius: BUTTON_BORDER_RADIUS }}
              />
              <TextField
                label="Vehicle Model"
                fullWidth
                variant="outlined"
                value={vehicleForm.model}
                onChange={(e) =>
                  setVehicleForm({ ...vehicleForm, model: e.target.value })
                }
                required
                sx={{ borderRadius: BUTTON_BORDER_RADIUS }}
              />
              <TextField
                label="Manufacture Year"
                fullWidth
                variant="outlined"
                type="number"
                value={vehicleForm.year}
                onChange={(e) =>
                  setVehicleForm({ ...vehicleForm, year: e.target.value })
                }
                required
                inputProps={{ min: 1900, max: new Date().getFullYear() + 1 }}
                sx={{ borderRadius: BUTTON_BORDER_RADIUS }}
              />
            </Stack>
          </DialogContent>
          <DialogActions
            sx={{ pt: 2, pb: 2, borderTop: `1px solid ${BORDER_COLOR}` }}
          >
            <Button
              onClick={() => setShowEditVehicleModal(false)}
              sx={{ borderRadius: BUTTON_BORDER_RADIUS }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveEditedVehicle}
              sx={{ borderRadius: BUTTON_BORDER_RADIUS }}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>

        {/* Logout Confirmation Dialog */}
        <Dialog
          open={showLogoutConfirm}
          onClose={() => setShowLogoutConfirm(false)}
          maxWidth="xs"
        >
          <DialogTitle
            sx={{
              fontWeight: 600,
              borderBottom: `1px solid ${BORDER_COLOR}`,
              pb: 2,
            }}
          >
            Confirm Account Logout
          </DialogTitle>
          <DialogContent dividers sx={{ pt: 3, pb: 2 }}>
            <Typography>
              Are you sure you want to securely sign out from your account?
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              You will need to enter your credentials next time you wish to
              access your profile.
            </Typography>
          </DialogContent>
          <DialogActions
            sx={{ pt: 2, pb: 2, borderTop: `1px solid ${BORDER_COLOR}` }}
          >
            <Button
              onClick={() => setShowLogoutConfirm(false)}
              disabled={isLoggingOut}
              sx={{ borderRadius: BUTTON_BORDER_RADIUS }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleLogout}
              disabled={isLoggingOut}
              sx={{ borderRadius: BUTTON_BORDER_RADIUS }}
            >
              {isLoggingOut ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Confirm & Sign Out"
              )}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for Notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={5000} // Increased duration
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          TransitionComponent={Zoom} // Smooth transition for Snackbar
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbar.severity}
            sx={{
              width: "100%",
              borderRadius: "8px",
              boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
            }}
            iconMapping={{
              success: <CheckCircleOutlineIcon fontSize="inherit" />,
              error: <ErrorOutlineIcon fontSize="inherit" />,
              info: <InfoOutlinedIcon fontSize="inherit" />,
              warning: <ErrorOutlineIcon fontSize="inherit" />, // Using error icon for warning
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </motion.div>
  );
};

export default Profile;
