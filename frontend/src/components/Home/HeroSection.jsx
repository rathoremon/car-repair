import React from "react";
import { useNavigate } from "react-router-dom";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import { motion } from "framer-motion";

const HeroSection = () => {
  const navigate = useNavigate();
  const userName = "Pravesh"; // Dynamic user
  const carModel = "Honda Accord"; // Dynamic car

  return (
    <section
      aria-label="Hero Section"
      role="region"
      className="relative flex flex-col items-center justify-center min-h-[95vh] overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-500 to-indigo-700 px-6 sm:px-10 md:px-16"
    >
      {/* Background Blurred Shapes */}
      <div className="absolute inset-0 pointer-events-none select-none -z-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-16 right-24 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[400px] bg-white/5 rounded-full blur-[180px] -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Hero Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center text-center w-full max-w-6xl mx-auto pt-0"
      >
        {/* Advanced Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="w-full max-w-2xl mb-4 px-6  sm:px-8 py-8 sm:py-2 rounded-3xl backdrop-blur-md shadow-2xl border border-white/10 bg-gradient-to-r from-white/10 via-white/5 to-white/10 hover:from-white/20 hover:to-white/10 transition-all duration-500 mb-16 sm:mb-0"
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-white gap-3">
            {/* Greeting Info */}
            <div className="text-center sm:text-left">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xl md:text-2xl lg:text-[1.5rem] font-bold tracking-wide text-white drop-shadow-lg"
              >
                👋 Hello, <span className="text-yellow-300">{userName}</span>
              </motion.p>
              <p className="mt-2 text-base md:text-md lg:text-[0.5] font-light text-blue-100">
                <span className="text-[1.5rem]">🚗</span> {carModel} • Next
                Service in{" "}
                <span className="font-semibold text-yellow-200">5 Days</span>
              </p>
            </div>

            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/customer/book-service")}
              className="inline-flex items-center justify-center px-8 py-[12px] rounded-full bg-yellow-400 text-indigo-900 font-bold text-base md:text-lg shadow-xl hover:shadow-2xl hover:bg-yellow-300 transition-all duration-300"
            >
              Book Now →
            </motion.button>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-white font-extrabold leading-tight tracking-tight drop-shadow-xl"
          style={{
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            lineHeight: 1.1,
            maxWidth: "25ch",
          }}
        >
          Your Car's Best Ally — Anytime, Anywhere
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mt-6 text-blue-100 font-light leading-relaxed"
          style={{
            fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
            maxWidth: "42ch",
          }}
        >
          Instant, Reliable Car Care — Wherever You Are.
          <br className="hidden sm:inline" />
          Stress-Free Service, Trusted by 10,000+ Owners.
        </motion.p>

        {/* Call to Action */}
        <motion.button
          type="button"
          aria-label="Book a Service"
          whileHover={{
            scale: 1.06,
            transition: { type: "spring", stiffness: 400, damping: 18 },
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/customer/book-service")}
          className="relative overflow-hidden inline-flex items-center gap-3 px-8 py-5 sm:px-10 sm:py-3 rounded-full bg-gray-200 text-gray-900 font-bold shadow-md hover:shadow-lg transition-all duration-300 text-base sm:text-lg md:text-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-gray-400 active:scale-95 my-8"
        >
          <DirectionsCarIcon className="text-gray-900 text-xl" />
          Book a Service
        </motion.button>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 1.8,
            ease: "easeInOut",
          }}
          className="mt-8 flex justify-center lg:mt-1  sm:bottom-8 sm:left-1/2 sm:-translate-x-1/2"
        >
          <div
            className="w-7 h-12 sm:w-5 sm:h-9 border-2 border-white rounded-full flex justify-center items-start p-1 relative"
            aria-hidden="true"
          >
            <div className="w-2 h-2 bg-white rounded-full animate-scrollDot" />
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll Dot Keyframes */}
      <style>{`
        @keyframes scrollDot {
          0% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(6px); opacity: 0.7; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-scrollDot {
          animation: scrollDot 1.8s infinite;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
