import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtp } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ErrorOutline, Refresh } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Paper,
} from "@mui/material";
import { toast } from "react-toastify";
import { auth } from "../../firebase";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithCredential,
  PhoneAuthProvider,
} from "firebase/auth";

const RESEND_INTERVAL = 15;
const OTP_LENGTH = 6;

function maskPhone(phone) {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.length <= 4) return phone;
  return `+${digits.substring(0, 2)}******${digits.slice(-4)}`;
}

const VerifyOtp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const { loading, error, user, tempUser, registerStatus } = useSelector(
    (state) => state.auth
  );

  const recipient = registerStatus === "otp" ? tempUser?.phone : user?.phone;

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [success, setSuccess] = useState(false);
  const [inputError, setInputError] = useState("");
  const [timer, setTimer] = useState(RESEND_INTERVAL);
  const [resending, setResending] = useState(false);
  const inputsRef = useRef([]);
  const recaptchaVerifierRef = useRef(null);

  // ✅ Store confirmationResult in window
  const confirmationResult = useRef(window.confirmationResult || null);

  const setupRecaptcha = useCallback(async () => {
    if (!auth) {
      throw new Error("Firebase Auth is not initialized");
    }

    // If already initialized, reuse it
    if (window.recaptchaVerifier) {
      recaptchaVerifierRef.current = window.recaptchaVerifier;
      return;
    }

    try {
      if (recaptchaVerifierRef.current) {
        // If somehow old recaptcha exists
        recaptchaVerifierRef.current.clear();
      }

      const recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            console.log("reCAPTCHA solved:", response);
          },
          "expired-callback": () => {
            toast.error("reCAPTCHA expired. Please try again.");
          },
        },
        auth
      );

      // ❗ Properly wait for it to render before proceeding
      await recaptchaVerifier.render();

      // Save the verifier
      recaptchaVerifierRef.current = recaptchaVerifier;
      window.recaptchaVerifier = recaptchaVerifier; // (Optional: cache globally)
    } catch (error) {
      console.error("Failed to set up reCAPTCHA:", error);
      throw error; // throw so that the caller can catch
    }
  }, []);

  const sendOtp = useCallback(async () => {
    if (!recipient) {
      toast.error("Phone number is missing.");
      return;
    }

    try {
      const formattedPhone = recipient.startsWith("+")
        ? recipient
        : `+91${recipient}`;

      const confirmation = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        recaptchaVerifierRef.current
      );

      confirmationResult.current = confirmation; // ✅ Store safely
      window.confirmationResult = confirmation; // Optional but safe fallback

      toast.success("OTP sent successfully!");
      setTimer(RESEND_INTERVAL);
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error(error.message || "Failed to send OTP. Please try again.");
    }
  }, [recipient]);

  useEffect(() => {
    return () => {
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    let interval;
    if (timer > 0 && !resending) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && resending) {
      setResending(false);
    }
    return () => clearInterval(interval);
  }, [timer, resending]);

  useEffect(() => {
    if (!loading && !success) {
      inputsRef.current[0]?.focus();
    }
  }, [loading, success]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "An error occurred.");
      setInputError(error.message || "Invalid OTP or an error occurred.");
      setOtp(Array(OTP_LENGTH).fill(""));
    }
  }, [error]);

  const handleOtpChange = (e, idx) => {
    const val = e.target.value.replace(/\D/g, "");
    const newOtp = [...otp];

    if (val.length > 1) {
      const pasted = val.slice(0, OTP_LENGTH - idx);
      pasted.split("").forEach((digit, i) => {
        if (idx + i < OTP_LENGTH) {
          newOtp[idx + i] = digit;
        }
      });
      setOtp(newOtp);
      inputsRef.current[Math.min(idx + pasted.length, OTP_LENGTH - 1)]?.focus();
    } else {
      newOtp[idx] = val;
      setOtp(newOtp);
      if (val && idx < OTP_LENGTH - 1) {
        inputsRef.current[idx + 1]?.focus();
      }
    }
    setInputError("");
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];
      if (otp[idx] === "") {
        if (idx > 0) {
          newOtp[idx - 1] = "";
          inputsRef.current[idx - 1]?.focus();
        }
      } else {
        newOtp[idx] = "";
      }
      setOtp(newOtp);
      setInputError("");
    } else if (e.key === "ArrowLeft" && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    } else if (e.key === "ArrowRight" && idx < OTP_LENGTH - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("Text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (pasted.length) {
      setOtp(
        pasted.split("").concat(Array(OTP_LENGTH - pasted.length).fill(""))
      );
      inputsRef.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
    }
    setInputError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join("");

    if (fullOtp.length !== OTP_LENGTH) {
      setInputError("Please enter the full OTP.");
      return;
    }

    if (!confirmationResult.current) {
      toast.error("OTP not sent yet or session expired. Please resend OTP.");
      return;
    }

    try {
      const credential = PhoneAuthProvider.credential(
        confirmationResult.current.verificationId,
        fullOtp
      );
      await signInWithCredential(auth, credential);
      const idToken = await auth.currentUser.getIdToken();

      const dispatchResult = await dispatch(verifyOtp(idToken));

      if (dispatchResult.meta.requestStatus === "fulfilled") {
        setSuccess(true);
        toast.success("OTP Verified Successfully!");

        setTimeout(() => {
          const verifiedUser = dispatchResult.payload.user;
          if (verifiedUser) {
            if (
              !verifiedUser.onboardingComplete &&
              verifiedUser.role === "provider"
            ) {
              navigate("/onboarding");
            } else if (verifiedUser.role === "provider") {
              navigate("/provider/dashboard");
            } else if (verifiedUser.role === "admin") {
              navigate("/admin/dashboard");
            } else {
              navigate("/customer/home");
            }
          } else {
            navigate("/");
          }
        }, 1200);
      } else {
        setInputError(
          dispatchResult.payload || "OTP verification failed. Please try again."
        );
        toast.error(dispatchResult.payload || "OTP verification failed.");
      }
    } catch (firebaseError) {
      let errorMessage = firebaseError.message || "Invalid OTP.";
      if (firebaseError.code === "auth/invalid-verification-code") {
        errorMessage = "The verification code is invalid.";
      } else if (firebaseError.code === "auth/code-expired") {
        errorMessage = "The verification code has expired. Please resend.";
      }
      setInputError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleResend = useCallback(async () => {
    try {
      await setupRecaptcha();
      await sendOtp();
    } catch (error) {
      console.error("Resend OTP failed:", error);
    }
  }, [sendOtp, setupRecaptcha]);

  useEffect(() => {
    async function initOtp() {
      if (registerStatus === "otp" && recipient) {
        try {
          await setupRecaptcha();
          await sendOtp();
        } catch (error) {
          console.error("OTP Setup failed:", error);
          toast.error("Failed to set up OTP. Please refresh and try again.");
        }
      }
    }
    initOtp();
  }, [registerStatus, recipient, setupRecaptcha, sendOtp]);

  const otpGroupLabel = "One Time Password input";

  return (
    <>
      <div
        id="recaptcha-container"
        style={{ height: "78px", visibility: "hidden" }}
      ></div>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex min-h-screen items-center justify-center bg-gray-50 p-4 sm:p-6"
        >
          {/* reCAPTCHA container */}

          <Paper
            elevation={6}
            sx={{
              borderRadius: "12px",
              p: { xs: 3, sm: 4 },
              maxWidth: 440,
              width: "100%",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            }}
          >
            <Box className="flex flex-col items-center">
              <Typography
                variant="h5"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.primary.main,
                  mb: 2,
                  fontSize: { xs: "1.5rem", sm: "1.75rem" },
                }}
              >
                Verify OTP
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                className="text-center mb-6 text-sm sm:text-base"
                sx={{ lineHeight: 1.6 }}
              >
                Please enter the 6-digit code sent to{" "}
                <span className="font-semibold text-gray-800">
                  {recipient
                    ? recipient.includes("@")
                      ? `${recipient.replace(/(.{2}).+(@.+)/, "$1******$2")}`
                      : `${maskPhone(recipient)}`
                    : "your registered contact"}
                </span>
              </Typography>

              <form onSubmit={handleSubmit} className="w-full">
                <fieldset
                  aria-label={otpGroupLabel}
                  className="flex justify-center gap-2 mb-4"
                  onPaste={handlePaste}
                >
                  {otp.map((digit, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ scale: 0.95, opacity: 0.8 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.15, delay: idx * 0.02 }}
                      className="flex"
                    >
                      <input
                        ref={(el) => (inputsRef.current[idx] = el)}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(e, idx)}
                        onKeyDown={(e) => handleKeyDown(e, idx)}
                        disabled={loading || success}
                        aria-label={`OTP digit ${idx + 1}`}
                        aria-invalid={!!inputError || !!error}
                        aria-required="true"
                        className={`
                        w-10 h-12 sm:w-12 sm:h-14 text-2xl sm:text-3xl
                        text-center rounded-lg border-2 focus:outline-none focus:ring-2
                        transition-all duration-200
                        ${
                          inputError || error
                            ? "border-red-400 focus:border-red-500"
                            : digit
                            ? "border-primary-500 focus:border-primary-600"
                            : "border-gray-300 focus:border-primary-400"
                        }
                        shadow-sm
                      `}
                        style={{
                          color: theme.palette.text.primary,
                          fontFamily: theme.typography.fontFamily,
                        }}
                      />
                    </motion.div>
                  ))}
                </fieldset>
                <AnimatePresence>
                  {(inputError || error) && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center justify-center gap-2 text-red-600 font-medium mb-2 text-xs sm:text-sm">
                        <ErrorOutline fontSize="small" />
                        {inputError ||
                          (error && typeof error === "object"
                            ? error.error
                            : error) ||
                          "An unknown error occurred."}
                      </div>
                    </motion.div>
                  )}
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center justify-center gap-2 text-green-600 font-semibold mb-2 text-sm sm:text-base">
                        <CheckCircle fontSize="small" />
                        OTP Verified Successfully!
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={
                    loading ||
                    success ||
                    otp.some((d) => !d) ||
                    otp.join("").length < OTP_LENGTH
                  }
                  sx={{
                    mt: 2,
                    py: 1.5,
                    borderRadius: "8px",
                    fontWeight: 700,
                    fontSize: "1rem",
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    color: "#fff",
                    boxShadow: "0 4px 14px 0 rgba(0,0,0,0.1)",
                    "&:hover": {
                      boxShadow: "0 6px 20px 0 rgba(0,0,0,0.15)",
                      background: `linear-gradient(90deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                    },
                    "&:active": {
                      transform: "scale(0.98)",
                    },
                  }}
                  component={motion.button}
                  whileTap={{ scale: 0.97 }}
                  endIcon={
                    loading ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : null
                  }
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </Button>
              </form>
              <div className="mt-4 flex flex-col items-center w-full">
                <Typography
                  variant="body2"
                  color="text.secondary"
                  className="font-semibold mb-2 text-xs sm:text-sm"
                  sx={{ letterSpacing: 0.2 }}
                >
                  Didn&apos;t receive the code?
                </Typography>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  startIcon={<Refresh />}
                  onClick={handleResend}
                  disabled={timer > 0 || resending || loading}
                  className="rounded font-semibold px-3 py-1 text-xs sm:text-sm shadow transition-all duration-150"
                  sx={{
                    opacity: timer > 0 || loading ? 0.7 : 1,
                    fontFamily: theme.typography.fontFamily,
                    boxShadow:
                      timer > 0 || loading
                        ? "none"
                        : `0 2px 8px 0 ${theme.palette.secondary.main}11`,
                  }}
                  component={motion.button}
                  whileTap={{ scale: 0.97 }}
                >
                  {resending ? (
                    <CircularProgress size={16} color="secondary" />
                  ) : timer > 0 ? (
                    `Resend in ${timer}s`
                  ) : (
                    "Resend OTP"
                  )}
                </Button>
              </div>
            </Box>
          </Paper>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default VerifyOtp;
