import React from "react";
import { useSelector } from "react-redux";
import VehicleStep from "./VehicleStep";
import LocationStep from "./LocationStep";
import StepProgress from "../shared/StepProgress";

export default function CustomerOnboarding() {
  const { step } = useSelector((state) => state.onboarding);

  return (
    <>
      <StepProgress step={step} total={2} />
      {step === 0 && <VehicleStep />}
      {step === 1 && <LocationStep />}
    </>
  );
}
