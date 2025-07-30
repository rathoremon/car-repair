import React from "react";
import { motion } from "framer-motion";
import { FaWrench, FaOilCan, FaCarBattery, FaCarSide } from "react-icons/fa";

const trendingServices = [
  {
    icon: <FaWrench size={24} />,
    title: "Emergency Repairs",
  },
  {
    icon: <FaOilCan size={24} />,
    title: "Oil Change",
  },
  {
    icon: <FaCarBattery size={24} />,
    title: "Battery Replacement",
  },
  {
    icon: <FaCarSide size={24} />,
    title: "Flat Tire Assistance",
  },
];

const PopularServices = () => (
  <section className="relative py-20 bg-gradient-to-b from-[#eef2ff] via-[#e0f7fa] to-[#f8f9fa] overflow-hidden">
    <div className="text-center mb-14">
      <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">
        Popular Services
      </h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Most booked services by our happy customers.
      </p>
    </div>
    <div className="flex flex-wrap justify-center gap-8 px-8 max-w-7xl mx-auto">
      {trendingServices.map((service) => (
        <motion.div
          key={service.title}
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-2xl shadow-lg p-6 w-64 text-center transition hover:shadow-2xl"
        >
          <div className="bg-gradient-to-tr from-indigo-500 to-blue-500 p-4 rounded-full text-white mx-auto mb-5">
            {service.icon}
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            {service.title}
          </h3>
        </motion.div>
      ))}
    </div>
  </section>
);

export default PopularServices;
