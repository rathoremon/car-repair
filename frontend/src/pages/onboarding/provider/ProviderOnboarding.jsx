import React from "react";
import { useSelector } from "react-redux";
import GarageStep from "./GarageStep";
import KycStep from "./KycStep";
import StepProgress from "../shared/StepProgress";

export default function ProviderOnboarding() {
  const { step } = useSelector((state) => state.onboarding);

  return (
    <>
      <StepProgress step={step} total={2} />
      {step === 0 && <GarageStep />}
      {step === 1 && <KycStep />}
    </>
  );
}
