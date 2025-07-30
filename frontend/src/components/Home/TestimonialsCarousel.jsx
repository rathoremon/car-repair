import React, { useState, useEffect } from "react";
import { Avatar, Rating } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const testimonials = [
  {
    name: "Amit Sharma",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    review:
      "Super fast and reliable! My car was fixed within hours. Highly recommended.",
  },
  {
    name: "Priya Verma",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4,
    review: "Transparent pricing and friendly staff. Booking was a breeze.",
  },
  {
    name: "Rahul Singh",
    photo: "https://randomuser.me/api/portraits/men/65.jpg",
    rating: 5,
    review: "Loved the live tracking feature. Great experience overall!",
  },
];

const cardVariants = {
  enter: { opacity: 0, scale: 0.8, rotateY: 30 },
  center: {
    opacity: 1,
    scale: 1,
    rotateY: 0,
    transition: { type: "spring", stiffness: 200, damping: 24 },
  },
  exit: { opacity: 0, scale: 0.8, rotateY: -30, transition: { duration: 0.3 } },
};

const TestimonialsCarousel = () => {
  const [idx, setIdx] = useState(0);

  const handlePrev = () =>
    setIdx((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  const handleNext = () =>
    setIdx((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));

  // Auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      setIdx((prev) => (prev + 1) % testimonials.length);
    }, 8000); // 8 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative overflow-hidden py-28 sm:py-36 bg-gradient-to-br from-[#f8fafc] via-[#e0f2fe] to-[#c7d2fe] flex flex-col items-center"
      aria-label="Testimonials"
    >
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute w-96 h-96 bg-indigo-400 rounded-full blur-[180px] opacity-20 top-1/4 left-1/3 animate-float" />
        <div className="absolute w-80 h-80 bg-blue-300 rounded-full blur-[180px] opacity-15 bottom-10 right-20 animate-float2" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/hexellence.png')] opacity-5" />
      </div>

      {/* Title */}
      <div className="text-center mb-20 px-6 z-10">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-6">
          What Our Customers Say
        </h2>
        <p className="text-lg text-gray-600 max-w-xl mx-auto font-medium">
          Real reviews from real users — your car deserves the best care.
        </p>
      </div>

      {/* Card */}
      <div className="relative w-full flex justify-center items-center px-6 sm:px-10 max-w-4xl z-10">
        <button
          onClick={handlePrev}
          aria-label="Previous testimonial"
          className="absolute left-0 md:-left-8 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-md text-gray-900 rounded-full shadow-lg p-3 hover:scale-105 transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <ChevronLeftIcon />
        </button>

        <div className="w-full flex justify-center">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={idx}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-lg"
            >
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 flex flex-col items-center border border-gray-200 transition-all duration-300 hover:shadow-2xl hover:border-indigo-300">
                <Avatar
                  src={testimonials[idx].photo}
                  alt={testimonials[idx].name}
                  className="w-20 h-20 mb-4 shadow-md"
                  imgProps={{ loading: "lazy" }}
                />
                <Rating
                  value={testimonials[idx].rating}
                  readOnly
                  className="mb-3"
                />
                <p className="italic text-gray-700 mb-4 text-center leading-relaxed text-lg">
                  "{testimonials[idx].review}"
                </p>
                <div className="h-[1px] w-16 bg-indigo-500 mb-3"></div>
                <h4 className="font-bold text-xl tracking-wide text-gray-900">
                  {testimonials[idx].name}
                </h4>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          onClick={handleNext}
          aria-label="Next testimonial"
          className="absolute right-0 md:-right-8 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-md text-gray-900 rounded-full shadow-lg p-3 hover:scale-105 transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <ChevronRightIcon />
        </button>
      </div>

      {/* Dots */}
      <div className="flex gap-3 mt-8 z-10">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            aria-label={`Go to testimonial ${i + 1}`}
            className={`w-4 h-4 rounded-full border-2 transition transform ${
              idx === i
                ? "bg-indigo-500 border-indigo-500 scale-110 shadow-md"
                : "bg-gray-300 border-gray-400 hover:scale-105"
            }`}
          />
        ))}
      </div>

      {/* Animation Keyframes */}
      <style>
        {`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 10s ease-in-out infinite;
        }
        .animate-float2 {
          animation: float 12s ease-in-out infinite alternate;
        }
      `}
      </style>
    </section>
  );
};

export default TestimonialsCarousel;
