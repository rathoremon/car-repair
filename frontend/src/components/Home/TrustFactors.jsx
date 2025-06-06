import React from "react";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { motion } from "framer-motion";

const factors = [
  {
    icon: <VerifiedUserIcon fontSize="inherit" />,
    text: "Verified Providers",
  },
  {
    icon: <AttachMoneyIcon fontSize="inherit" />,
    text: "Transparent Pricing",
  },
  {
    icon: <SupportAgentIcon fontSize="inherit" />,
    text: "24/7 Customer Support",
  },
  {
    icon: <LocationOnIcon fontSize="inherit" />,
    text: "Live Service Tracking",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.25 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 18 },
  },
};

const TrustFactors = () => (
  <section
    aria-label="Trust Factors"
    className="relative overflow-hidden py-28 sm:py-36 bg-[#0f172a] text-white"
  >
    {/* Subtle Grid Background */}
    <div className="absolute inset-0 bg-grid-pattern opacity-10 -z-10"></div>

    {/* Stars / particles */}
    <div className="absolute inset-0 overflow-hidden -z-10">
      <div className="absolute w-96 h-96 bg-indigo-500 rounded-full blur-[200px] opacity-20 top-1/3 left-1/3 animate-slowFloat"></div>
      <div className="absolute w-96 h-96 bg-blue-400 rounded-full blur-[200px] opacity-10 top-2/3 right-1/4 animate-slowFloat2"></div>
    </div>

    {/* Title */}
    <div className="text-center mb-20 px-6">
      <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
        Why Trust <span className="text-indigo-400">Trasure</span>
      </h2>
      <p className="text-lg text-gray-300 max-w-2xl mx-auto font-medium">
        We bring premium car services — with the trust of 10,000+ customers.
      </p>
    </div>

    {/* Trust Factors */}
    <motion.ul
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl mx-auto px-6"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      role="list"
    >
      {factors.map((factor) => (
        <motion.li
          key={factor.text}
          variants={itemVariants}
          whileHover={{
            scale: 1.1,
            rotateX: 5,
            rotateY: 5,
            boxShadow: "0 30px 60px rgba(0,0,0,0.4)",
          }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="group flex flex-col items-center justify-center text-center bg-white/10 backdrop-blur-lg rounded-3xl p-10 transition-all duration-300 hover:scale-105 hover:bg-white/20"
          tabIndex={0}
          aria-label={factor.text}
        >
          <div className="flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-500 text-white shadow-lg mb-6">
            <span className="text-5xl">{factor.icon}</span>
          </div>
          <p className="text-xl font-bold text-white group-hover:text-indigo-300 transition">
            {factor.text}
          </p>
        </motion.li>
      ))}
    </motion.ul>

    {/* Tailwind + Custom CSS */}
    <style>
      {`
      @keyframes slowFloat {
        0% { transform: translateY(0); }
        50% { transform: translateY(30px); }
        100% { transform: translateY(0); }
      }
      .animate-slowFloat {
        animation: slowFloat 20s ease-in-out infinite;
      }
      .animate-slowFloat2 {
        animation: slowFloat 25s ease-in-out infinite reverse;
      }
      .bg-grid-pattern {
        background-image: linear-gradient(
          to right, rgba(255,255,255,0.05) 1px, transparent 1px
        ), linear-gradient(
          to bottom, rgba(255,255,255,0.05) 1px, transparent 1px
        );
        background-size: 40px 40px;
      }
      `}
    </style>
  </section>
);

export default TrustFactors;
