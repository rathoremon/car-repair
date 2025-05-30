import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// Minimal multi-step onboarding for customer and provider
const Onboarding = () => {
  const { user } = useSelector((state) => state.auth);
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const isProvider = user?.role === "provider";

  const handleNext = () => setStep((s) => s + 1);

  // Simulate completion
  const handleComplete = () => {
    // In a real app, call backend to mark onboardingComplete and update Redux state
    if (isProvider) navigate("/provider/dashboard");
    else navigate("/customer/home");
  };

  return (
    <div className="onboarding-container flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Onboarding</h2>
      {!isProvider ? (
        <>
          {step === 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Add Your Vehicle</h3>
              {/* Vehicle form fields here */}
              <button className="btn btn-primary" onClick={handleNext}>
                Next
              </button>
            </div>
          )}
          {step === 1 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Set Your Location</h3>
              {/* Location form fields here */}
              <button className="btn btn-success" onClick={handleComplete}>
                Finish Onboarding
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          {step === 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Garage Information</h3>
              {/* Garage info form fields here */}
              <button className="btn btn-primary" onClick={handleNext}>
                Next
              </button>
            </div>
          )}
          {step === 1 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">KYC Documents</h3>
              {/* KYC upload fields here */}
              <button className="btn btn-success" onClick={handleComplete}>
                Finish Onboarding
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Onboarding;
