// ServiceCard.jsx
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 150, damping: 20 },
  },
};

const ServiceCard = ({ icon, title, description, link, color }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{
        scale: 1.05,
        rotate: 0.5,
        boxShadow: "0 20px 30px rgba(0, 0, 0, 0.12)",
      }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className="group relative overflow-hidden bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200 cursor-pointer transition-all duration-300"
      onClick={() => navigate(link)}
      role="listitem"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && navigate(link)}
    >
      {/* Glow Background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white via-transparent to-white opacity-5 group-hover:opacity-10 transition-all" />

      <div className="flex flex-col items-center px-6 py-10 relative z-10">
        {/* Icon */}
        <div
          className={`relative w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-tr ${color} text-white shadow-lg mb-6`}
        >
          <span className="text-4xl">{icon}</span>
          <div className="absolute inset-0 rounded-full bg-white/10 blur-md opacity-30 animate-pulse" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition text-center mb-3">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-center text-base leading-relaxed max-w-xs">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
