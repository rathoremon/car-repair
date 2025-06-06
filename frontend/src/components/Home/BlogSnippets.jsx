import React from "react";
import { motion } from "framer-motion";

const blogs = [
  {
    title: "5 Signs Your Car Battery Needs Replacement",
    desc: "Stay proactive with your car maintenance. Recognize these signs before your battery fails.",
    image:
      "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FyJTIwY2FyZXxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    title: "How Often Should You Service Your Car?",
    desc: "Understand the key service milestones for your vehicle to ensure longevity and performance.",
    image:
      "https://images.unsplash.com/photo-1675034743372-672c3c3f8377?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGNhciUyMGNhcmV8ZW58MHx8MHx8fDA%3D",
  },
  {
    title: "Top 10 Car Care Tips for Summer",
    desc: "Essential maintenance to prevent overheating and keep your car summer-ready.",
    image:
      "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
];

const BlogSnippets = () => (
  <section className="relative py-24 bg-gradient-to-tr from-[#edf2f7] via-[#f0f4ff] to-[#ffffff] overflow-hidden">
    {/* Soft Pattern Background */}
    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/geometry2.png')] opacity-5 pointer-events-none" />

    <div className="relative text-center mb-16 px-6 z-10">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-4">
        Car Care Insights
      </h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Stay updated with professional advice and keep your vehicle road-ready.
      </p>
    </div>

    {/* Blog Cards */}
    <div className="relative max-w-7xl mx-auto grid gap-y-16 gap-x-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 px-6 z-10">
      {blogs.map((blog, idx) => (
        <motion.div
          key={blog.title}
          whileHover={{
            scale: 1.02,
            boxShadow: "0 20px 30px rgba(0, 0, 0, 0.1)",
          }}
          transition={{ type: "spring", stiffness: 150, damping: 20 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden group cursor-pointer"
        >
          <div className="overflow-hidden h-48">
            <img
              src={blog.image}
              alt={blog.title}
              className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
          </div>
          <div className="p-6 flex flex-col h-full">
            <span className="inline-block mb-3 text-xs uppercase font-semibold text-indigo-500 tracking-wider">
              Expert Tips
            </span>
            <h3 className="text-lg font-bold text-gray-800 mb-3 leading-snug group-hover:text-indigo-600 transition-colors">
              {blog.title}
            </h3>
            <p className="text-gray-500 flex-grow">{blog.desc}</p>
            <button className="mt-6 self-start text-indigo-600 font-semibold inline-flex items-center group-hover:underline">
              Read More
              <svg
                className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

export default BlogSnippets;
