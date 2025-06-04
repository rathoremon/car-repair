import React, { useState, useRef, useEffect, useCallback } from "react";
import { useTheme } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineExclamationCircle,
  HiOutlineCheckCircle,
  HiOutlineArrowLeft,
} from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { register as registerThunk } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "../../firebase"; // Import Firebase auth
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

function useCapsLock(ref) {
  const [capsLock, setCapsLock] = useState(false);
  useEffect(() => {
    const handler = (e) =>
      setCapsLock(e.getModifierState && e.getModifierState("CapsLock"));
    const node = ref.current;
    if (node) {
      node.addEventListener("keyup", handler);
      node.addEventListener("keydown", handler);
      return () => {
        node.removeEventListener("keyup", handler);
        node.removeEventListener("keydown", handler);
      };
    }
  }, [ref]);
  return capsLock;
}

export default function Register({ onSwitch }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const recaptchaVerifierRef = useRef(null);
  const { loading } = useSelector((state) => state.auth);

  const [reg, setReg] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [tab, setTab] = useState("customer");
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);
  const passwordRef = useRef();
  const confirmRef = useRef();
  const capsLock = useCapsLock(passwordRef);
  const confirmCapsLock = useCapsLock(confirmRef);

  const tabOptions = [
    { value: "customer", label: "Customer" },
    { value: "provider", label: "Provider" },
  ];

  const setupRecaptcha = async () => {
    if (!recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            console.log("reCAPTCHA Resolved", response);
          },
          "expired-callback": () => {
            toast.error("Recaptcha expired. Please try again.");
          },
        },
        auth
      );
      await recaptchaVerifierRef.current.render(); // ✅ Must render
    }
  };

  useEffect(() => {
    const errs = {};
    if (touched.username && !reg.username.trim())
      errs.username = "Please enter a username.";
    if (touched.email && !reg.email.trim())
      errs.email = "Please enter your email.";
    if (touched.phone && !reg.phone.trim())
      errs.phone = "Please enter your phone number.";
    if (touched.password && !reg.password)
      errs.password = "Please enter a password.";
    if (touched.confirm && reg.confirm !== reg.password)
      errs.confirm = "Passwords do not match.";
    setErrors(errs);
  }, [reg, touched]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setReg((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      username: true,
      email: true,
      phone: true,
      password: true,
      confirm: true,
    });

    if (Object.keys(errors).length > 0) return;

    try {
      const payload = {
        name: reg.username,
        email: reg.email,
        phone: reg.phone,
        password: reg.password,
        role: tab,
      };
      const resultAction = await dispatch(registerThunk(payload));

      if (registerThunk.fulfilled.match(resultAction)) {
        // ✅ Setup recaptcha and initiate Firebase OTP
        const phoneNumber = reg.phone.startsWith("+")
          ? reg.phone
          : `+91${reg.phone}`;
        await setupRecaptcha();
        const appVerifier = recaptchaVerifierRef.current;

        const confirmationResult = await signInWithPhoneNumber(
          auth,
          phoneNumber,
          appVerifier
        );

        window.confirmationResult = confirmationResult; // ⬅️ Store it globally

        setSuccess(true);
        toast.success("Registration successful! OTP sent.", {
          position: "top-center",
          transition: Slide,
          autoClose: 1200,
        });

        setTimeout(() => {
          setSuccess(false);
          navigate("/verify-otp");
        }, 1200);
      } else {
        const msg =
          resultAction.payload?.error ||
          resultAction.error?.message ||
          "Registration failed";
        toast.error(msg, { position: "top-center", transition: Slide });
      }
    } catch (err) {
      let errorMessage =
        err.message || "Registration failed. Please try again.";
      if (err.code === "auth/invalid-phone-number") {
        errorMessage = "Invalid phone number format.";
      } else if (err.code === "auth/too-many-requests") {
        errorMessage = "Too many requests. Please try again later.";
      } else if (err.code === "auth/captcha-check-failed") {
        errorMessage = "Recaptcha verification failed.";
      }
      toast.error(errorMessage, { position: "top-center", transition: Slide });
    }
  };

  return (
    <div
      className="flex items-center justify-center w-full p-0 font-sans"
      style={{
        background: `linear-gradient(120deg, ${theme.palette.background.default} 0%, #fff 100%)`,
      }}
    >
      <div id="recaptcha-container"></div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <form
        className="w-full max-w-sm sm:max-w-md bg-white px-4 sm:px-6 py-5 flex flex-col justify-center relative"
        onSubmit={handleSubmit}
        autoComplete="off"
        aria-label="Register form"
        noValidate
      >
        <h3
          className="text-[22px] font-bold mb-2 text-center tracking-tight"
          style={{ color: theme.palette.primary.main }}
        >
          Create Account
        </h3>
        {/* Social Login */}
        <div className="flex flex-col gap-2 mb-1">
          <button
            type="button"
            className="flex items-center justify-center gap-2 w-full py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition font-semibold text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            onClick={() =>
              toast.info("Google login not implemented in this demo.", {
                position: "top-center",
                transition: Slide,
              })
            }
            aria-label="Sign up with Google"
          >
            <FcGoogle className="text-xl" aria-hidden="true" />
            Sign up with Google
          </button>
          <div className="flex items-center my-0.5">
            <span className="flex-1 h-px bg-gray-200"></span>
            <span className="mx-2 text-xs text-gray-400">or</span>
            <span className="flex-1 h-px bg-gray-200"></span>
          </div>
          <div className="relative flex items-center justify-center w-full my-1">
            <div
              className="relative flex rounded-full p-0.5 w-full max-w-[180px] mx-auto h-7"
              style={{
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              }}
            >
              <motion.div
                className="absolute top-1 left-1 h-5 rounded-full bg-white shadow z-0"
                style={{
                  width: "calc(50% - 8px)",
                }}
                animate={{
                  left: tab === "provider" ? "calc(50% + 2px)" : "2px",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
              />
              {tabOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTab(option.value)}
                  className={`relative z-10 flex-1 h-5 rounded-full font-semibold text-xs transition-all duration-200
                    ${
                      tab === option.value
                        ? "text-indigo-700"
                        : "text-white opacity-80 hover:opacity-100"
                    }
                  `}
                  style={{
                    letterSpacing: "0.01em",
                  }}
                  aria-pressed={tab === option.value}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="grid gap-1.5"
          >
            {/* Username */}
            <div>
              <label
                htmlFor="register-username"
                className="block mb-0.5 text-xs font-semibold"
                style={{ color: theme.palette.text.primary }}
              >
                Username
              </label>
              <div className="relative">
                <input
                  id="register-username"
                  name="username"
                  type="text"
                  className={`w-full pl-9 pr-3 py-2 rounded-lg border transition focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 bg-gray-50 text-sm ${
                    errors.username ? "border-red-400" : "border-gray-300"
                  }`}
                  placeholder="Your username"
                  value={reg.username}
                  onChange={handleChange}
                  aria-invalid={!!errors.username}
                  aria-describedby={
                    errors.username ? "register-username-error" : undefined
                  }
                  maxLength={32}
                  autoComplete="username"
                  required
                />
                <HiOutlineUser
                  className="absolute left-2.5 top-1/2 -translate-y-1/2"
                  style={{ color: theme.palette.primary.main, fontSize: 20 }}
                  aria-hidden="true"
                />
              </div>
              {errors.username && (
                <div
                  className="flex items-center gap-1 text-xs text-red-600 mt-0.5"
                  id="register-username-error"
                >
                  <HiOutlineExclamationCircle aria-hidden="true" />
                  {errors.username}
                </div>
              )}
            </div>
            {/* Email */}
            <div>
              <label
                htmlFor="register-email"
                className="block mb-0.5 text-xs font-semibold"
                style={{ color: theme.palette.text.primary }}
              >
                Email
              </label>
              <div className="relative">
                <input
                  id="register-email"
                  name="email"
                  type="email"
                  className={`w-full pl-9 pr-3 py-2 rounded-lg border transition focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 bg-gray-50 text-sm ${
                    errors.email ? "border-red-400" : "border-gray-300"
                  }`}
                  placeholder="you@email.com"
                  value={reg.email}
                  onChange={handleChange}
                  aria-invalid={!!errors.email}
                  aria-describedby={
                    errors.email ? "register-email-error" : undefined
                  }
                  autoComplete="email"
                  required
                />
                <HiOutlineMail
                  className="absolute left-2.5 top-1/2 -translate-y-1/2"
                  style={{ color: theme.palette.primary.main, fontSize: 20 }}
                  aria-hidden="true"
                />
              </div>
              {errors.email && (
                <div
                  className="flex items-center gap-1 text-xs text-red-600 mt-0.5"
                  id="register-email-error"
                >
                  <HiOutlineExclamationCircle aria-hidden="true" />
                  {errors.email}
                </div>
              )}
            </div>
            {/* Phone */}
            <div>
              <label
                htmlFor="register-phone"
                className="block mb-0.5 text-xs font-semibold"
                style={{ color: theme.palette.text.primary }}
              >
                Phone
              </label>
              <div className="relative">
                <input
                  id="register-phone"
                  name="phone"
                  type="tel"
                  className={`w-full pl-9 pr-3 py-2 rounded-lg border transition focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 bg-gray-50 text-sm ${
                    errors.phone ? "border-red-400" : "border-gray-300"
                  }`}
                  placeholder="Your phone number"
                  value={reg.phone}
                  onChange={handleChange}
                  aria-invalid={!!errors.phone}
                  aria-describedby={
                    errors.phone ? "register-phone-error" : undefined
                  }
                  autoComplete="tel"
                  required
                />
                <HiOutlinePhone
                  className="absolute left-2.5 top-1/2 -translate-y-1/2"
                  style={{ color: theme.palette.primary.main, fontSize: 20 }}
                  aria-hidden="true"
                />
              </div>
              {errors.phone && (
                <div
                  className="flex items-center gap-1 text-xs text-red-600 mt-0.5"
                  id="register-phone-error"
                >
                  <HiOutlineExclamationCircle aria-hidden="true" />
                  {errors.phone}
                </div>
              )}
            </div>
            {/* Password */}
            <div>
              <label
                htmlFor="register-password"
                className="block mb-0.5 text-xs font-semibold"
                style={{ color: theme.palette.text.primary }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="register-password"
                  name="password"
                  ref={passwordRef}
                  type={showPassword ? "text" : "password"}
                  className={`w-full pl-9 pr-9 py-2 rounded-lg border transition focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 bg-gray-50 text-sm ${
                    errors.password ? "border-red-400" : "border-gray-300"
                  }`}
                  placeholder="Password"
                  value={reg.password}
                  onChange={handleChange}
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password
                      ? "register-password-error"
                      : "register-password-reqs"
                  }
                  maxLength={64}
                  autoComplete="new-password"
                  required
                />
                <HiOutlineLockClosed
                  className="absolute left-2.5 top-1/2 -translate-y-1/2"
                  style={{ color: theme.palette.primary.main, fontSize: 20 }}
                  aria-hidden="true"
                />
                <button
                  type="button"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-indigo-400 focus:outline-none"
                  tabIndex={0}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                </button>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                {capsLock && (
                  <span className="flex items-center gap-1 text-xs text-yellow-600">
                    <HiOutlineExclamationCircle aria-hidden="true" />
                    Caps Lock is on
                  </span>
                )}
              </div>
              {errors.password && (
                <div
                  className="flex items-center gap-1 text-xs text-red-600 mt-0.5"
                  id="register-password-error"
                >
                  <HiOutlineExclamationCircle aria-hidden="true" />
                  {errors.password}
                </div>
              )}
            </div>
            {/* Confirm Password */}
            <div>
              <label
                htmlFor="register-confirm"
                className="block mb-0.5 text-xs font-semibold"
                style={{ color: theme.palette.text.primary }}
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="register-confirm"
                  name="confirm"
                  ref={confirmRef}
                  type={showConfirm ? "text" : "password"}
                  className={`w-full pl-9 pr-9 py-2 rounded-lg border transition focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 bg-gray-50 text-sm ${
                    errors.confirm ? "border-red-400" : "border-gray-300"
                  }`}
                  placeholder="Confirm password"
                  value={reg.confirm}
                  onChange={handleChange}
                  aria-invalid={!!errors.confirm}
                  aria-describedby={
                    errors.confirm ? "register-confirm-error" : undefined
                  }
                  maxLength={64}
                  autoComplete="new-password"
                  required
                />
                <HiOutlineLockClosed
                  className="absolute left-2.5 top-1/2 -translate-y-1/2"
                  style={{ color: theme.palette.primary.main, fontSize: 20 }}
                  aria-hidden="true"
                />
                <button
                  type="button"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-indigo-400 focus:outline-none"
                  tabIndex={0}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                  onClick={() => setShowConfirm((v) => !v)}
                >
                  {showConfirm ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                </button>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                {confirmCapsLock && (
                  <span className="flex items-center gap-1 text-xs text-yellow-600">
                    <HiOutlineExclamationCircle aria-hidden="true" />
                    Caps Lock is on
                  </span>
                )}
              </div>
              {errors.confirm && (
                <div
                  className="flex items-center gap-1 text-xs text-red-600 mt-0.5"
                  id="register-confirm-error"
                >
                  <HiOutlineExclamationCircle aria-hidden="true" />
                  {errors.confirm}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
        {success && (
          <div className="flex items-center gap-2 text-green-600 text-xs font-semibold animate-fadeIn mt-1">
            <HiOutlineCheckCircle className="text-lg" aria-hidden="true" />
            Registration successful!
          </div>
        )}
        <button
          type="submit"
          className="w-full py-2 rounded-lg font-bold text-base mt-2 shadow-lg hover:from-indigo-700 hover:to-blue-600 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          style={{
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            color: "#fff",
          }}
          aria-label="Register"
          disabled={Object.keys(errors).length > 0 || loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
        <div className="mt-3 text-center text-xs text-gray-600 flex items-center justify-center gap-2">
          <HiOutlineArrowLeft className="animate-bounce-x" aria-hidden="true" />
          Already have an account?{" "}
          <button
            type="button"
            className="text-indigo-600 font-semibold underline hover:text-indigo-800 focus:outline-none"
            onClick={onSwitch}
            tabIndex={0}
            aria-label="Go to login"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
