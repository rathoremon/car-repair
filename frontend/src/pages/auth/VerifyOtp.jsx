import React, { useState, useEffect, useRef } from "react";
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
import { auth, RecaptchaVerifier } from "../../firebase";
import { signInWithPhoneNumber } from "firebase/auth";

const RESEND_INTERVAL = 15;
const OTP_LENGTH = 6;

// Mask phone for privacy
function maskPhone(phone) {
  if (!phone) return "";
  return phone
    .replace(/.(?=..)/g, "*")
    .replace(/\*{6,}/, "******")
    .replace(/(\*+)(\d{2})$/, "$1$2");
}

const VerifyOtp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const { loading, error, user } = useSelector((state) => state.auth);

  const recipient = user?.phone || user?.email || "";

  // OTP state as array of digits
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [success, setSuccess] = useState(false);
  const [timer, setTimer] = useState(RESEND_INTERVAL);
  const [resending, setResending] = useState(false);
  const [inputError, setInputError] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [firebaseError, setFirebaseError] = useState("");
  const inputsRef = useRef([]);

  // Countdown timer for resend
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Focus first input on mount
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  // Send OTP using Firebase on mount
  useEffect(() => {
    if (!user?.phone) return;
    if (window.recaptchaVerifier) return; // Prevent duplicate
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      { size: "invisible" },
      auth
    );
    signInWithPhoneNumber(auth, user.phone, window.recaptchaVerifier)
      .then((result) => {
        setConfirmationResult(result);
      })
      .catch((error) => {
        setFirebaseError("Failed to send OTP: " + error.message);
      });
  }, [user]);

  // Move focus to next input on change, handle paste
  const handleOtpChange = (e, idx) => {
    const val = e.target.value.replace(/\D/g, "");
    if (val.length > 1) {
      // Paste: distribute digits
      const arr = val.split("").slice(0, OTP_LENGTH);
      setOtp((prev) => {
        const next = [...prev];
        arr.forEach((digit, i) => {
          if (idx + i < OTP_LENGTH) next[idx + i] = digit;
        });
        return next;
      });
      const nextFocus = Math.min(idx + arr.length, OTP_LENGTH - 1);
      inputsRef.current[nextFocus]?.focus();
    } else {
      setOtp((prev) => {
        const arr = [...prev];
        arr[idx] = val;
        return arr;
      });
      if (val && idx < OTP_LENGTH - 1) {
        inputsRef.current[idx + 1]?.focus();
      }
    }
    setInputError("");
    setFirebaseError("");
  };

  // Keyboard navigation and backspace
  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      if (!otp[idx] && idx > 0) {
        setOtp((prev) => {
          const arr = [...prev];
          arr[idx - 1] = "";
          return arr;
        });
        inputsRef.current[idx - 1]?.focus();
      }
    }
    if (e.key === "ArrowLeft" && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
    if (e.key === "ArrowRight" && idx < OTP_LENGTH - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  // Handle full OTP paste
  const handlePaste = (e) => {
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
    e.preventDefault();
    setInputError("");
    setFirebaseError("");
  };

  // Submit OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length < OTP_LENGTH) {
      setInputError("Please enter the complete OTP.");
      return;
    }
    setInputError("");
    setFirebaseError("");
    if (!confirmationResult) {
      setFirebaseError("OTP not sent yet. Please try again.");
      return;
    }
    try {
      const result = await confirmationResult.confirm(otpValue);
      const idToken = await result.user.getIdToken();
      const dispatchResult = await dispatch(verifyOtp(idToken));
      if (dispatchResult.meta.requestStatus === "fulfilled") {
        setSuccess(true);
        setTimeout(() => {
          if (!dispatchResult.payload.user.onboardingComplete) {
            navigate("/onboarding");
          } else if (dispatchResult.payload.user.role === "provider") {
            navigate("/provider/dashboard");
          } else if (dispatchResult.payload.user.role === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/customer/home");
          }
        }, 1200);
      }
    } catch (err) {
      setFirebaseError("Invalid OTP or verification failed.");
    }
  };

  // Resend OTP
  const handleResend = async () => {
    setResending(true);
    setFirebaseError("");
    setInputError("");
    try {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        { size: "invisible" },
        auth
      );
      let phone = user.phone;
      if (!phone.startsWith("+")) {
        phone = "+91" + phone; // or your country code
      }
      const result = await signInWithPhoneNumber(
        auth,
        user.phone,
        window.recaptchaVerifier
      );
      setConfirmationResult(result);
      setTimer(RESEND_INTERVAL);
    } catch (e) {
      setFirebaseError("Failed to resend OTP: " + e.message);
    }
    setResending(false);
  };

  // Accessibility: label for OTP group
  const otpGroupLabel = "One Time Password input";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-white transition-colors duration-300">
      <div id="recaptcha-container"></div>
      <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto px-2 sm:px-4">
        {/* Decorative gradients and dots */}
        <div className="absolute -top-16 -left-16 w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-blue-300 via-indigo-200 to-purple-200 opacity-20 blur-2xl z-0" />
        <div className="absolute bottom-0 right-0 w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-purple-200 to-blue-200 opacity-10 blur-xl z-0" />
        <div className="absolute top-1/2 left-1/2 w-24 h-24 sm:w-32 sm:h-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-blue-100 via-white to-purple-100 opacity-10 pointer-events-none z-0" />

        <Paper
          elevation={10}
          className="relative z-10 w-full rounded-lg sm:rounded-xl shadow-lg bg-white/95 backdrop-blur-lg px-3 py-6 sm:px-6 sm:py-8 flex flex-col items-center"
        >
          <Typography
            variant="h6"
            fontWeight={700}
            color="primary"
            className="mb-1 text-center tracking-wide"
            sx={{
              letterSpacing: 1.1,
              fontFamily: theme.typography.fontFamily,
              fontSize: { xs: 18, sm: 20, md: 22 },
            }}
          >
            OTP Verification
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            className="mb-4 text-center"
            sx={{
              fontWeight: 500,
              fontFamily: theme.typography.fontFamily,
              fontSize: { xs: 12, sm: 14, md: 15 },
            }}
          >
            Enter the code sent to
            <span className="text-primary font-semibold ml-1">
              {recipient
                ? recipient.includes("@")
                  ? `${recipient.replace(/(.{2}).+(@.+)/, "$1******$2")}`
                  : `${maskPhone(recipient)}`
                : "your registered contact"}
            </span>
          </Typography>
          <form onSubmit={handleSubmit} autoComplete="off" className="w-full">
            <fieldset
              aria-label={otpGroupLabel}
              className="flex justify-center gap-1 sm:gap-2 md:gap-3 mb-2 sm:mb-3 mt-3"
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
                    aria-invalid={!!inputError || !!error || !!firebaseError}
                    aria-required="true"
                    className={`
                      w-8 h-10 sm:w-10 sm:h-12 md:w-11 md:h-14
                      text-base sm:text-lg md:text-xl
                      text-center rounded border-2
                      font-semibold tracking-widest
                      outline-none transition-all duration-150
                      bg-gray-50 focus:bg-white
                      ${
                        inputError || error || firebaseError
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
              {(inputError || error || firebaseError) && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-center gap-2 text-red-600 font-medium mb-2 text-xs sm:text-sm">
                    <ErrorOutline fontSize="small" />
                    {inputError || firebaseError || error?.error || error}
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
                    OTP Verified!
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              className="rounded font-bold text-xs sm:text-sm mt-2 sm:mt-4 py-2 shadow-md transition-all duration-150"
              sx={{
                letterSpacing: 0.5,
                fontFamily: theme.typography.fontFamily,
                boxShadow: `0 2px 12px 0 ${theme.palette.primary.main}18`,
              }}
              disabled={
                loading ||
                success ||
                otp.some((d) => d === "") ||
                otp.join("").length < OTP_LENGTH
              }
              component={motion.button}
              whileTap={{ scale: 0.97 }}
              endIcon={
                loading ? <CircularProgress size={18} color="inherit" /> : null
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
              disabled={timer > 0 || resending}
              className="rounded font-semibold px-3 py-1 text-xs sm:text-sm shadow transition-all duration-150"
              sx={{
                opacity: timer > 0 ? 0.7 : 1,
                fontFamily: theme.typography.fontFamily,
                boxShadow:
                  timer > 0
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
        </Paper>
      </div>
    </div>
  );
};

export default VerifyOtp;
