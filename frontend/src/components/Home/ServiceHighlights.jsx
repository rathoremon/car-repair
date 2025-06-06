import React from "react";
import { motion } from "framer-motion";
import { FaClock, FaShieldAlt, FaMapMarkedAlt, FaLeaf } from "react-icons/fa";

const highlights = [
  {
    icon: <FaClock size={28} />,
    title: "60-min Response",
    description: "Rapid dispatch to get you back on the road faster.",
  },
  {
    icon: <FaShieldAlt size={28} />,
    title: "Trusted Experts",
    description: "Certified professionals ensuring quality service.",
  },
  {
    icon: <FaMapMarkedAlt size={28} />,
    title: "Nationwide Coverage",
    description: "Service available in all major cities and towns.",
  },
  {
    icon: <FaLeaf size={28} />,
    title: "Eco-Friendly",
    description: "Sustainable and environment-conscious services.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.25 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
};

const ServiceHighlights = () => (
  <section className="relative py-24 bg-gradient-to-b from-[#ecf3fc] via-[#f8fbfe] to-white overflow-hidden">
    {/* Background decorative SVGs */}
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="absolute top-0 right-0 w-96 h-96 opacity-10"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle fill="#c7d2fe" cx="100" cy="100" r="80" />
      </svg>
      <svg
        className="absolute bottom-0 left-0 w-64 h-64 opacity-10"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle fill="#a5b4fc" cx="100" cy="100" r="60" />
      </svg>
    </div>

    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 px-6 md:px-12 z-10 relative">
      {/* Left Text Block */}
      <motion.div
        className="flex-1 text-center lg:text-left"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-800 mb-6 leading-tight">
          <span className="text-indigo-600">Why</span> Trasure?
        </h2>
        <p className="text-lg text-gray-500 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
          Elevating your journey — fast, transparent, eco-friendly, and
          everywhere you need us.
        </p>
      </motion.div>

      {/* Right Animated Grid */}
      <motion.div
        className="flex-1 grid grid-cols-2 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {highlights.map((item) => (
          <motion.div
            key={item.title}
            variants={itemVariants}
            className="relative p-8 rounded-3xl bg-white/80 backdrop-blur-xl border border-gray-200 shadow-lg hover:shadow-2xl transition hover:scale-105 flex flex-col items-center text-center"
          >
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-6 shadow-lg hover:shadow-indigo-300 transition">
              {item.icon}
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-3">
              {item.title}
            </h3>
            <p className="text-gray-500 text-sm">{item.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default ServiceHighlights;
