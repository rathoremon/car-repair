import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const GetStartedCTA = () => {
  const navigate = useNavigate();

  return (
    <section
      className="relative overflow-hidden py-24 sm:py-32 bg-gradient-to-r from-[#1e3a8a] via-[#3b82f6] to-[#1e40af] rounded-l shadow-2xl "
      aria-label="Get Started CTA"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-20 left-1/2 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-blue-300/10 rounded-full blur-2xl animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[200px] -translate-x-1/2 -translate-y-1/2 animate-float-slow"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-12 flex flex-col items-center text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-white text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-8"
        >
          Premium Car Care, Redefined.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          className="text-blue-100 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Your car deserves the best. 10,000+ car owners trust{" "}
          <span className="font-bold text-white">Trasure</span> for quality,
          speed, and transparency.
        </motion.p>

        <motion.button
          whileHover={{
            scale: 1.08,
            backgroundColor: "#fff",
            color: "#1e3a8a",
            boxShadow: "0 12px 24px rgba(255,255,255,0.25)",
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/customer/book-service")}
          className="inline-flex items-center justify-center gap-3 bg-white/10 border-2 border-white text-white font-semibold px-8 py-4 rounded-full shadow-md hover:shadow-lg backdrop-blur-md transition-all text-lg sm:text-xl hover:backdrop-blur-xl"
        >
          Get Started Today
        </motion.button>
      </div>

      {/* Custom Animation Keyframes */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.7;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }
        @keyframes float-slow {
          0% {
            transform: translate(-50%, -50%) translateY(0);
          }
          50% {
            transform: translate(-50%, -50%) translateY(20px);
          }
          100% {
            transform: translate(-50%, -50%) translateY(0);
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s infinite;
        }
        .animate-float-slow {
          animation: float-slow 12s infinite ease-in-out;
        }
      `}</style>
    </section>
  );
};

export default GetStartedCTA;
