// ServiceCategoriesGrid.jsx
import React from "react";
import ServiceCard from "./ServiceCard";
import BuildIcon from "@mui/icons-material/Build";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import LocalCarWashIcon from "@mui/icons-material/LocalCarWash";
import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";
import { motion } from "framer-motion";

const services = [
  {
    icon: <DirectionsCarIcon fontSize="inherit" />,
    title: "Breakdown Assistance",
    description:
      "Instant on-road help, wherever you are — 24/7 trusted service.",
    link: "/customer/services/breakdown",
    color: "from-indigo-500 via-blue-500 to-indigo-600",
  },
  {
    icon: <BuildIcon fontSize="inherit" />,
    title: "General Repairs",
    description: "Certified mechanics delivering quality, guaranteed repairs.",
    link: "/customer/services/repairs",
    color: "from-green-400 via-emerald-400 to-green-500",
  },
  {
    icon: <LocalCarWashIcon fontSize="inherit" />,
    title: "Car Wash & Detailing",
    description: "Premium wash & detailing — shine like brand new, at home.",
    link: "/customer/services/wash",
    color: "from-yellow-400 via-amber-400 to-yellow-500",
  },
  {
    icon: <BatteryChargingFullIcon fontSize="inherit" />,
    title: "Battery & Electrical",
    description:
      "Quick battery service, diagnostics, and hassle-free replacements.",
    link: "/customer/services/battery",
    color: "from-pink-400 via-rose-400 to-pink-500",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const ServiceCategoriesGrid = () => (
  <section className="relative py-20 sm:py-28 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
    {/* Decorative Background Pattern */}
    <div className="absolute inset-0 pointer-events-none -z-10">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-50 via-white to-slate-100 opacity-40" />
      <div className="absolute top-20 left-1/2 w-[80%] h-[80%] rounded-full bg-indigo-100/20 blur-[120px] -translate-x-1/2" />
    </div>

    {/* Section Heading */}
    <div className="text-center mb-16 px-4">
      <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
        Explore Our Services
      </h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Trusted by thousands of car owners — pick the service you need, and
        relax.
      </p>
    </div>

    {/* Cards */}
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      role="list"
    >
      {services.map((service) => (
        <ServiceCard key={service.title} {...service} tabIndex={0} />
      ))}
    </motion.div>
  </section>
);

export default ServiceCategoriesGrid;
