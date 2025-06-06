import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CustomerOnboarding from "./customer/CustomerVehicleOnboarding";
import ProviderOnboarding from "./provider/ProviderGarageOnboarding";
import { Box, Container, Paper, Typography, Skeleton } from "@mui/material";
import { motion } from "framer-motion";

// 💡 Subtle, luxurious gradient — no distractions
const backgroundGradient = `linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)`;

const Onboarding = () => {
  const { user, loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user?.onboardingComplete) {
      if (user.role === "provider") {
        navigate("/provider/dashboard", { replace: true });
      } else if (user.role === "customer") {
        navigate("/customer/home", { replace: true });
      } else if (user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      }
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <Box
        className="flex items-center justify-center min-h-screen"
        sx={{ bgcolor: "#f9fafb" }}
      >
        <Skeleton
          variant="rectangular"
          width={420}
          height={420}
          className="rounded-3xl shadow-xl"
        />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        className="flex items-center justify-center min-h-screen"
        sx={{ bgcolor: "#f9fafb" }}
      >
        <Typography color="error" variant="h6">
          {error.message || "An error occurred. Please try again."}
        </Typography>
      </Box>
    );
  }

  if (!user) return null;

  return (
    <Box
      className="min-h-screen  flex items-center justify-center p-4"
      sx={{
        background: backgroundGradient,
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          width: {
            xs: "100%",
            sm: "90%",
            md: "920px", // 👈 Optimized width
            lg: "1120px",
          },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ width: "100%" }}
        >
          <Paper
            elevation={12}
            className="w-full rounded-[28px] shadow-2xl overflow-hidden"
            sx={{
              p: { xs: 3, sm: 5, md: 6 },
              background: "rgba(255, 255, 255, 0.96)",
              border: "1px solid #e2e8f0",
              boxShadow: "0 12px 48px rgba(0,0,0,0.08)",
              minHeight: { xs: 480, sm: 560 },
            }}
          >
            {/* Header */}
            <Box className="mb-8 text-center">
              <Typography
                variant="h4"
                fontWeight={700}
                className="text-gray-800"
                sx={{
                  mb: 2,
                  fontSize: { xs: "1.9rem", sm: "2.4rem" },
                  fontFamily: "Inter, sans-serif",
                  letterSpacing: 0.7,
                }}
              >
                {`Welcome, ${user?.name?.split(" ")[0] || "User"} 🚀`}
              </Typography>
              <Typography
                variant="subtitle1"
                className="text-gray-500"
                sx={{
                  fontSize: { xs: "1rem", sm: "1.125rem" },
                }}
              >
                Let’s complete your {user.role} onboarding journey
              </Typography>
            </Box>

            {/* Form Section */}
            <Box className="flex flex-col gap-8">
              {user.role === "provider" ? (
                <ProviderOnboarding />
              ) : (
                <CustomerOnboarding />
              )}
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Onboarding;
