import React, { useState, useRef, useEffect, useCallback } from "react";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../../features/auth/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineExclamationCircle,
  HiOutlineCheckCircle,
  HiOutlineArrowLeft,
} from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";

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
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [login, setLogin] = useState({ emailOrUsername: "", password: "" });
  const [tab, setTab] = useState("customer");
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const passwordRef = useRef();
  const capsLock = useCapsLock(passwordRef);

  const tabOptions = [
    { value: "customer", label: "Customer" },
    { value: "provider", label: "Provider" },
  ];

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ emailOrUsername: true, password: true });
    if (Object.keys(errors).length > 0) return;

    dispatch(loginStart());
    try {
      // Simulate API call
      setTimeout(() => {
        if (login.emailOrUsername === "admin" && login.password === "admin") {
          dispatch(
            loginSuccess({
              user: { username: login.emailOrUsername },
              token: "fake-jwt-token",
            })
          );
          setSuccess(true);
          setTimeout(() => setSuccess(false), 2000);
        } else {
          dispatch(loginFailure("Invalid credentials"));
        }
      }, 1000);
    } catch (err) {
      dispatch(loginFailure("Login failed"));
    }
  };

  return (
    <div
      className="flex items-center justify-center w-full p-0 font-sans"
      style={{
        minHeight: "100vh",
        height: "100vh",
        background: `linear-gradient(120deg, ${theme.palette.background.default} 0%, #fff 100%)`,
      }}
    >
      <form
        className="w-full max-w-xs sm:max-w-sm space-y-4"
        onSubmit={handleSubmit}
        autoComplete="off"
        aria-label="Login form"
        noValidate
      >
        <h3
          className="text-2xl font-bold mb-3 text-center tracking-tight"
          style={{ color: theme.palette.primary.main }}
        >
          Sign In
        </h3>
        {/* Social Login */}
        <div className="flex flex-col gap-2 mb-2">
          <button
            type="button"
            className="flex items-center justify-center gap-2 w-full py-1 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition font-semibold text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            onClick={() => alert("Google login not implemented in this demo.")}
            aria-label="Sign in with Google"
          >
            <FcGoogle className="text-xl" aria-hidden="true" />
            Sign in with Google
          </button>
          <div className="flex items-center my-2">
            <span className="flex-1 h-px bg-gray-200"></span>
            <span className="mx-2 text-xs text-gray-400">or</span>
            <span className="flex-1 h-px bg-gray-200"></span>
          </div>
          {/* Modern Tab Switcher */}
          <div className="relative flex items-center justify-center w-full">
            <div
              className="relative flex rounded-full p-0.5 w-full max-w-[180px] mx-auto h-7"
              style={{
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              }}
            >
              {/* Animated Indicator */}
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
        {/* Animated tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="grid gap-3"
          >
            {/* Email/Username */}
            <div>
              <label
                htmlFor="login-email"
                className="block mb-1 text-xs font-semibold"
                style={{ color: theme.palette.text.primary }}
              >
                Email or Username
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
                  placeholder="Email or username"
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
                  className="flex items-center gap-1 text-xs text-red-600 mt-1"
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
                className="block mb-1 text-xs font-semibold"
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
                  tabIndex={0}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                </button>
              </div>
              <div className="flex items-center gap-2 mt-1">
                {capsLock && (
                  <span className="flex items-center gap-1 text-xs text-yellow-600">
                    <HiOutlineExclamationCircle aria-hidden="true" />
                    Caps Lock is on
                  </span>
                )}
              </div>
              {errors.password && (
                <div
                  className="flex items-center gap-1 text-xs text-red-600 mt-1"
                  id="login-password-error"
                >
                  <HiOutlineExclamationCircle aria-hidden="true" />
                  {errors.password}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-end">
          <button
            type="button"
            className="text-xs text-indigo-600 font-semibold underline hover:text-indigo-800 focus:outline-none"
            tabIndex={0}
            aria-label="Forgot your password?"
            onClick={() =>
              alert("Password recovery not implemented in this demo.")
            }
          >
            Forgot your password?
          </button>
        </div>
        {success && (
          <div className="flex items-center gap-2 text-green-600 text-xs font-semibold animate-fadeIn">
            <HiOutlineCheckCircle className="text-lg" aria-hidden="true" />
            Login successful!
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 text-red-600 text-xs font-semibold animate-fadeIn">
            <HiOutlineExclamationCircle
              className="text-lg"
              aria-hidden="true"
            />
            {error}
          </div>
        )}
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
            tabIndex={0}
            aria-label="Go to register"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
