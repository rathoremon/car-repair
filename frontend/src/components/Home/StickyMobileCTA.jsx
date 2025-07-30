import React from "react";
import { FaCarCrash } from "react-icons/fa";

const StickyMobileCTA = () => (
  <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[90%] sm:hidden">
    <button className="w-full flex justify-center items-center gap-3 px-6 py-4 rounded-full bg-indigo-600 text-white font-bold text-lg shadow-lg hover:bg-indigo-700 transition">
      <FaCarCrash size={22} /> Book a Service
    </button>
  </div>
);

export default StickyMobileCTA;
