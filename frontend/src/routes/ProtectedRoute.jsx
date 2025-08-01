import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

export default function ProtectedRoute({
  children,
  requireOnboarding = false,
}) {
  const { token, user, verified, loading, hydrated } = useSelector(
    (state) => state.auth
  );

  if (!hydrated || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress size={50} />
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (location.pathname.startsWith("/mechanic") && activeRole !== "mechanic") {
    return <Navigate to="/login" replace />;
  }

  if (!user?.isOtpVerified) {
    return <Navigate to="/verify-otp" replace />;
  }

  if (requireOnboarding && !user?.onboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}
