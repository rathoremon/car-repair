import React from "react";
import { Button } from "@mui/material";
import { motion } from "framer-motion";

const GreetingBanner = ({ userName = "Abhijit", vehicle = "Tesla Model 3", dueDate = "5 June" }) => {
  return (
    <section className="relative flex items-center justify-center min-h-[80vh] bg-gradient-to-tr from-blue-100 via-white to-purple-100 overflow-hidden">
      {/* Parallax circles */}
      <div className="absolute top-0 left-1/2 w-96 h-96 bg-indigo-300/20 rounded-full blur-[150px] animate-float" />
      <div className="absolute bottom-0 right-1/2 w-96 h-96 bg-pink-300/20 rounded-full blur-[150px] animate-float2" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 text-center px-6 max-w-2xl"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 font-['Poppins'] mb-4">
          Hello, {userName} 👋
        </h1>
        <p className="text-lg md:text-xl text-gray-600 font-['Poppins'] mb-8">
          {vehicle} | Next Service: {dueDate}
        </p>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Button
            variant="contained"
            sx={{
              background: "linear-gradient(90deg, #4F46E5, #9333EA)",
              borderRadius: "9999px",
              px: 4,
              py: 1.5,
              fontSize: "1rem",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Book Service Now
          </Button>
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(20px); }
        }
        .animate-float {
          animation: float 10s ease-in-out infinite;
        }
        .animate-float2 {
          animation: float2 12s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default GreetingBanner;
