import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineExclamationCircle,
  HiOutlineCheckCircle,
  HiOutlineArrowLeft,
  HiOutlineInformationCircle,
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
  const [login, setLogin] = useState({ emailOrUsername: "", password: "" });
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const passwordRef = useRef();
  const capsLock = useCapsLock(passwordRef);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ emailOrUsername: true, password: true });
    if (Object.keys(errors).length > 0) return;
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <form
      className="w-full max-w-xs sm:max-w-sm space-y-4"
      onSubmit={handleSubmit}
      autoComplete="off"
      aria-label="Login form"
      noValidate
    >
      <h3 className="text-2xl font-bold text-indigo-700 mb-3 text-center tracking-tight">
        Sign In
      </h3>
      {/* Social Login */}
      <div className="flex flex-col gap-2 mb-2">
        <button
          type="button"
          className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition font-semibold text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <HiOutlineInformationCircle aria-hidden="true" />
          We only request your name and email from your Google profile. Your
          data is secure and never shared without your consent.
        </div>
      </div>
      <div className="grid gap-3">
        {/* Email/Username */}
        <div>
          <label
            htmlFor="login-email"
            className="block mb-1 text-xs font-semibold text-gray-700"
          >
            Email or Username
          </label>
          <div className="relative">
            <input
              id="login-email"
              name="emailOrUsername"
              type="text"
              className={`w-full pl-9 pr-3 py-2 rounded-lg border transition focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 bg-gray-50 text-sm ${
                errors.emailOrUsername ? "border-red-400" : "border-gray-300"
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
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-indigo-400 text-lg"
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
            className="block mb-1 text-xs font-semibold text-gray-700"
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
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-indigo-400 text-lg"
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
      </div>
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
      <button
        type="submit"
        className="w-full py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-bold text-base mt-2 shadow-lg hover:from-indigo-700 hover:to-blue-600 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        aria-label="Login"
        disabled={Object.keys(errors).length > 0}
      >
        Login
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
      <div className="mt-6 text-xs text-gray-400 text-center">
        <span>
          &copy; {new Date().getFullYear()} Trasure. All rights reserved.
        </span>
      </div>
    </form>
  );
}
