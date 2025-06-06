import React from "react";
import { useNavigate } from "react-router-dom";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import { motion } from "framer-motion";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section
      aria-label="Hero Section"
      role="region"
      className="relative flex flex-col items-center justify-center min-h-[70vh] overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-500 to-indigo-700 px-6 sm:px-10 md:px-16"
    >
      {/* Background Blurred Shapes */}
      <div className="absolute inset-0 pointer-events-none select-none -z-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-16 right-24 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-[180px] -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Hero Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center text-center w-full max-w-6xl mx-auto pt-14"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="inline-block mb-2 px-5 py-2 bg-white/20 rounded-full text-white text-sm sm:text-base font-semibold backdrop-blur-sm shadow-md"
        >
          ⭐️ Rated 4.9/5 by 10,000+ Car Owners
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
          className="mt-8 text-blue-100 font-light leading-relaxed"
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
          className="relative overflow-hidden inline-flex items-center gap-3 px-8 py-3 sm:px-10 sm:py-4 rounded-full bg-gray-200 text-gray-900 font-bold shadow-md hover:shadow-lg transition-all duration-300 text-base sm:text-lg md:text-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-gray-400 active:scale-95 mt-8"
        >
          <DirectionsCarIcon className="text-gray-900 text-2xl" />
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
          className="mt-[40px] flex justify-center"
        >
          <div
            className="w-6 h-10 border-2 border-white rounded-full flex justify-center items-start p-1 relative"
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
