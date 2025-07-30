// src/hooks/ProviderAccessGuard.jsx
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import ProviderKycPending from "../pages/provider/ProviderKycPending";
import { useEffect } from "react";
import { toast } from "react-toastify";
export function ProviderAccessGuard({ children }) {
  const provider = useSelector((s) => s.auth.user?.provider);
  const onboardingComplete = useSelector(
    (s) => s.auth.user?.onboardingComplete
  );
  const location = useLocation();

  useEffect(() => {
    if (
      provider?.kycStatus === "rejected" &&
      provider?.rejectionReason &&
      location.pathname !== "/provider/onboarding"
    ) {
      toast.error(`Onboarding rejected: ${provider.rejectionReason}`, {
        autoClose: 7000,
      });
    }
  }, [provider, location.pathname]);

  // If onboarding is NOT complete, always go to onboarding
  if (!onboardingComplete) {
    if (location.pathname !== "/provider/onboarding") {
      return <Navigate to="/provider/onboarding" replace />;
    }
    return children;
  }

  // Now check KYC status ONLY if onboarding is complete!
  if (
    provider?.kycStatus === "pending" &&
    location.pathname !== "/provider/pending"
  ) {
    return <Navigate to="/provider/pending" replace />;
  }

  if (
    provider?.kycStatus === "rejected" &&
    location.pathname !== "/provider/onboarding"
  ) {
    return <Navigate to="/provider/onboarding" replace />;
  }

  // If onboarding is complete and KYC is not pending/rejected, allow access
  return children;
}
