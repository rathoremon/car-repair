// src/hooks/useProviderAccessGuard.js
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const ProviderAccessGuard = () => {
  const { role, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (role === "provider") {
      const kycStatus = user?.kycStatus;

      if (kycStatus === "pending") {
        navigate("/provider/locked", { replace: true });
      }

      if (kycStatus === "rejected") {
        toast.error("Your onboarding was rejected. Please re-submit.");
        navigate("/onboarding", { replace: true });
      }
    }
  }, [role, user, navigate]);
};
