import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
  requireOnboarding = false,
}) {
  const { token, user, verified } = useSelector((state) => state.auth);
  const onboardingComplete = user?.onboardingComplete;

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }
  if (!verified) {
    return <Navigate to="/verify-otp" replace />;
  }
  if (requireOnboarding && !onboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }
  return children;
}
