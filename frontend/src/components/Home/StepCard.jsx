import React from "react";
import { motion } from "framer-motion";

const StepCard = ({ step, icon: Icon, title, description }) => (
  <motion.div
    whileHover={{
      scale: 1.05,
      rotate: 1,
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
    }}
    transition={{ type: "spring", stiffness: 150, damping: 20 }}
    className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200 px-5 py-8 text-center w-64 flex flex-col items-center"
    role="listitem"
    tabIndex={0}
  >
    <div className="text-sm font-bold text-indigo-500 mb-3 uppercase tracking-wider">
      Step {step}
    </div>
    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-500 text-white shadow-lg mb-6">
      <Icon fontSize="large" />
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition">
      {title}
    </h3>
    <p className="text-gray-500 text-sm leading-relaxed max-w-[260px]">
      {description}
    </p>
  </motion.div>
);

export default StepCard;
