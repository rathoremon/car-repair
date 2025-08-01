// src/pages/auth/RoleSelector.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
  ButtonBase,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedRole, setActiveRole } from "../../features/auth/authSlice";
import EngineeringIcon from "@mui/icons-material/Engineering";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import { motion } from "framer-motion";

export default function RoleSelector() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const user = useSelector((state) => state.auth.user);
  if (!user) return null;
  if (!user.isOtpVerified) {
    navigate("/verify-otp");
    return null;
  }

  const handleSelect = (role) => {
    dispatch(setSelectedRole(role));
    dispatch(setActiveRole(role));

    if (role === "provider") {
      const kyc = user?.provider?.kycStatus;
      if (!user?.onboardingComplete || kyc === "rejected") {
        return navigate("/onboarding");
      } else if (kyc === "pending" || !kyc) {
        return navigate("/provider/pending");
      } else {
        return navigate("/provider/dashboard");
      }
    }

    if (role === "mechanic") {
      const isSelfMechanic =
        user?.mechanic?.userId === user?.id &&
        user?.mechanic?.providerId === user?.provider?.id;
      const shouldReset = user.requiresPasswordReset && !isSelfMechanic;
      if (shouldReset) return navigate("/set-password");
      return navigate("/mechanic/dashboard");
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#eaf1ff] to-[#dce5f2] px-4 py-10">
      <Paper
        elevation={10}
        className="w-full max-w-6xl flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-xl bg-white"
      >
        {/* Left Hero */}
        <Box className="md:w-1/2 w-full bg-gradient-to-br from-[#1d3557] to-[#0b1f3a] text-white flex flex-col justify-center items-center p-8 md:p-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center space-y-4"
          >
            <Typography variant="h4" fontWeight="bold" className="text-white">
              Welcome to MechaniQ.AI
            </Typography>
            <Typography variant="body1" className="text-blue-100">
              India's Smartest Garage & Mechanic Platform
            </Typography>
          </motion.div>
        </Box>

        {/* Right Role Selector */}
        <Box className="md:w-1/2 w-full p-8 md:p-12 bg-white">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <Typography variant="h5" fontWeight={700}>
              Select Your Role
            </Typography>
            <Typography variant="body2" color="text.secondary">
              We found both Provider and Mechanic profiles linked to your
              account.
            </Typography>

            <Box className="flex flex-col gap-6">
              {user?.hasProviderProfile && (
                <ButtonBase
                  className="group  transition-all hover:shadow-[0_4px_20px_rgba(25,118,210,0.3)] hover:rounded-2xl border border-gray-200 hover:border-blue-500"
                  onClick={() => handleSelect("provider")}
                  focusRipple
                >
                  <Paper
                    elevation={3}
                    className="w-full flex items-center gap-5 px-5 py-4 bg-white"
                  >
                    <BusinessCenterIcon
                      fontSize="large"
                      className="text-blue-700 group-hover:scale-110 transition-transform"
                    />
                    <Box className="text-left">
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        color="primary"
                      >
                        Provider
                      </Typography>
                      <Typography variant="body2" className="text-gray-600">
                        Manage your garage, bookings, and mechanics
                      </Typography>
                    </Box>
                  </Paper>
                </ButtonBase>
              )}

              {user?.hasMechanicProfile && (
                <ButtonBase
                  className="group rounded-2xl transition-all hover:shadow-[0_4px_20px_rgba(156,39,176,0.3)] hover:rounded-2xl border border-gray-200 hover:border-purple-500"
                  onClick={() => handleSelect("mechanic")}
                  focusRipple
                >
                  <Paper
                    elevation={3}
                    className="w-full flex items-center gap-5 px-5 py-4  bg-white"
                  >
                    <EngineeringIcon
                      fontSize="large"
                      className="text-purple-700 group-hover:scale-110 transition-transform"
                    />
                    <Box className="text-left">
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        color="secondary"
                      >
                        Mechanic
                      </Typography>
                      <Typography variant="body2" className="text-gray-600">
                        View job requests and mark tasks complete
                      </Typography>
                    </Box>
                  </Paper>
                </ButtonBase>
              )}
            </Box>
          </motion.div>
        </Box>
      </Paper>
    </Box>
  );
}
