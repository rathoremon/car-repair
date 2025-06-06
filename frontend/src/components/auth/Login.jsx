import React, { useState, useRef, useEffect, useCallback } from "react";
import { useTheme } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineExclamationCircle,
  HiOutlineArrowLeft,
} from "react-icons/hi";

import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer, Slide } from "react-toastify";
import { login as loginThunk } from "../../features/auth/authSlice";
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

export default function Login({ onSwitch }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  const [login, setLogin] = useState({ emailOrUsername: "", password: "" });
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const passwordRef = useRef();
  const capsLock = useCapsLock(passwordRef);

  const setupRecaptcha = async () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
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
    }
  };

  useEffect(() => {
    const errs = {};
    if (touched.emailOrUsername && !login.emailOrUsername.trim())
      errs.emailOrUsername = "Please enter your email or username.";
    if (touched.password && !login.password)
      errs.password = "Please enter your password.";
    setErrors(errs);
  }, [login, touched]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setLogin((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  function formatPhone(phone) {
    let p = phone.replace(/\D/g, "");
    if (!p.startsWith("91")) p = "91" + p;
    return "+" + p;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ emailOrUsername: true, password: true });

    if (!login.emailOrUsername.trim() || !login.password.trim()) {
      toast.error("Email/Phone and Password are required.");
      return;
    }

    try {
      const isEmail = login.emailOrUsername.includes("@");
      const payload = isEmail
        ? { email: login.emailOrUsername }
        : { phone: formatPhone(login.emailOrUsername) };

      payload.password = login.password;

      const resultAction = await dispatch(loginThunk(payload));
      const { user, next } = resultAction.payload || {};

      if (!user) {
        toast.error("Login failed. Please try again.");
        return;
      }

      // 👉 Admin: No OTP, Direct login
      if (user.role === "admin") {
        toast.success(`Welcome back, Admin!`);
        navigate("/admin/dashboard");
        return;
      }

      // Customer/Provider Logic
      if (next === "verify-otp") {
        await setupRecaptcha();
        const appVerifier = window.recaptchaVerifier; // ✅ Corrected
        const phoneNumber = user.phone;

        const confirmationResult = await signInWithPhoneNumber(
          auth,
          phoneNumber,
          appVerifier
        );

        window.confirmationResult = confirmationResult;

        toast.success("OTP sent successfully.");
        navigate("/verify-otp");
      } else if (next === "onboarding") {
        navigate("/onboarding");
      } else if (user) {
        toast.success(`Welcome back, ${user.name || "User"}!`);
        if (user.onboardingComplete) {
          if (user.role === "provider") {
            navigate("/provider/dashboard");
          } else if (user.role === "customer") {
            navigate("/customer/home");
          } else {
            navigate("/");
          }
        } else {
          navigate("/onboarding");
        }
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
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

      <form
        className="w-full max-w-sm sm:max-w-md bg-white px-4 sm:px-6 py-5 flex flex-col justify-center relative"
        onSubmit={handleSubmit}
        autoComplete="off"
        aria-label="Login form"
        noValidate
      >
        <h3
          className="text-[22px] font-bold mb-2 text-center tracking-tight"
          style={{ color: theme.palette.primary.main }}
        >
          Sign In
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
            aria-label="Sign in with Google"
          >
            <FcGoogle className="text-xl" aria-hidden="true" />
            Sign in with Google
          </button>
          <div className="flex items-center my-0.5">
            <span className="flex-1 h-px bg-gray-200"></span>
            <span className="mx-2 text-xs text-gray-400">or</span>
            <span className="flex-1 h-px bg-gray-200"></span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key="login-fields"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="grid gap-1.5"
          >
            <div className="grid gap-3">
              {/* Email/Phone */}
              <div>
                <label
                  htmlFor="login-email"
                  className="block mb-0.5 text-xs font-semibold"
                  style={{ color: theme.palette.text.primary }}
                >
                  Email or Phone
                </label>
                <div className="relative">
                  <input
                    id="login-email"
                    name="emailOrUsername"
                    type="text"
                    className={`w-full pl-9 pr-3 py-2 rounded-lg border transition focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 bg-gray-50 text-sm ${
                      errors.emailOrUsername
                        ? "border-red-400"
                        : "border-gray-300"
                    }`}
                    placeholder="Email or phone number"
                    value={login.emailOrUsername}
                    onChange={handleChange}
                    aria-invalid={!!errors.emailOrUsername}
                    aria-describedby={
                      errors.emailOrUsername ? "login-email-error" : undefined
                    }
                    autoComplete="username"
                    required
                  />
                  <HiOutlineMail
                    className="absolute left-2.5 top-1/2 -translate-y-1/2"
                    style={{ color: theme.palette.primary.main, fontSize: 20 }}
                    aria-hidden="true"
                  />
                </div>
                {errors.emailOrUsername && (
                  <div
                    className="flex items-center gap-1 text-xs text-red-600 mt-0.5"
                    id="login-email-error"
                  >
                    <HiOutlineExclamationCircle aria-hidden="true" />
                    {errors.emailOrUsername}
                  </div>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="login-password"
                  className="block mb-0.5 text-xs font-semibold"
                  style={{ color: theme.palette.text.primary }}
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    name="password"
                    ref={passwordRef}
                    type={showPassword ? "text" : "password"}
                    className={`w-full pl-9 pr-9 py-2 rounded-lg border transition focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 bg-gray-50 text-sm ${
                      errors.password ? "border-red-400" : "border-gray-300"
                    }`}
                    placeholder="Password"
                    value={login.password}
                    onChange={handleChange}
                    aria-invalid={!!errors.password}
                    aria-describedby={
                      errors.password ? "login-password-error" : undefined
                    }
                    maxLength={64}
                    autoComplete="current-password"
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
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                  </button>
                </div>
                {capsLock && (
                  <span className="flex items-center gap-1 text-xs text-yellow-600 mt-0.5">
                    <HiOutlineExclamationCircle aria-hidden="true" />
                    Caps Lock is on
                  </span>
                )}
                {errors.password && (
                  <div
                    className="flex items-center gap-1 text-xs text-red-600 mt-0.5"
                    id="login-password-error"
                  >
                    <HiOutlineExclamationCircle aria-hidden="true" />
                    {errors.password}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-end mt-1">
          <button
            type="button"
            className="text-xs text-indigo-600 font-semibold underline hover:text-indigo-800 focus:outline-none"
            onClick={() =>
              toast.info("Password recovery not implemented.", {
                position: "top-center",
                transition: Slide,
              })
            }
          >
            Forgot your password?
          </button>
        </div>

        <button
          type="submit"
          className="w-full py-2 rounded-lg font-bold text-base mt-2 shadow-lg hover:from-indigo-700 hover:to-blue-600 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          style={{
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            color: "#fff",
          }}
          aria-label="Login"
          disabled={Object.keys(errors).length > 0 || loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="mt-3 text-center text-xs text-gray-600 flex items-center justify-center gap-2">
          <HiOutlineArrowLeft className="animate-bounce-x" aria-hidden="true" />
          Don't have an account?{" "}
          <button
            type="button"
            className="text-indigo-600 font-semibold underline hover:text-indigo-800 ml-1 focus:outline-none"
            onClick={onSwitch}
          >
            Register
          </button>
        </div>
        <ToastContainer />
      </form>
    </div>
  );
}
