import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, Navigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
export default function ProtectedRoute({
  children,
  requireOnboarding = false,
}) {
  const { token, user, verified, activeRole, loading, hydrated } = useSelector(
    (state) => state.auth
  );
  const location = useLocation();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setChecking(false), 100);
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  const expectedRole = location.pathname.startsWith("/mechanic")
    ? "mechanic"
    : location.pathname.startsWith("/provider")
    ? "provider"
    : null;

  if (expectedRole && activeRole !== expectedRole) {
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress size={50} />
      </div>
    );
  }

  if (!hydrated || loading || checking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress size={50} />
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.isOtpVerified) {
    return <Navigate to="/verify-otp" replace />;
  }

  if (location.pathname.startsWith("/mechanic") && activeRole !== "mechanic") {
    return <Navigate to="/login" replace />;
  }

  if (location.pathname.startsWith("/provider") && activeRole !== "provider") {
    return <Navigate to="/login" replace />;
  }

  if (requireOnboarding && !user?.onboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}
