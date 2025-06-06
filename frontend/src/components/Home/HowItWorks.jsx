import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger, MotionPathPlugin } from "gsap/all";
import StepCard from "./StepCard";
import SearchIcon from "@mui/icons-material/Search";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const steps = [
  {
    icon: SearchIcon,
    title: "Choose Service",
    description: "Find exactly what your car needs from our curated services.",
  },
  {
    icon: AssignmentTurnedInIcon,
    title: "Book Instantly",
    description: "Select a time and confirm your booking in a few taps.",
  },
  {
    icon: DirectionsCarFilledIcon,
    title: "Relax & Track",
    description: "Sit back, track service status in real-time, stress-free.",
  },
];

const HowItWorks = () => {
  const pathRef = useRef(null);
  const carRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(carRef.current, {
        scrollTrigger: {
          trigger: pathRef.current,
          start: "top center",
          end: "bottom center",
          scrub: 1,
        },
        motionPath: {
          path: "#journeyPath",
          align: "#journeyPath",
          alignOrigin: [0.5, 0.5],
          autoRotate: true,
        },
        ease: "none",
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      aria-label="Journey Section"
      className="relative overflow-hidden py-20 sm:py-28 bg-gradient-to-b from-[#f8fafc] via-[#e0f2fe] to-[#c7d2fe]"
    >
      {/* Backgrounds */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-300 to-transparent opacity-30" />
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-gray-400 to-transparent blur-2xl opacity-20" />
      </div>

      {/* Road Path — Desktop */}
      <svg
        ref={pathRef}
        className="hidden sm:block absolute top-1/2 -translate-y-[35%] left-1/2 -translate-x-1/2 w-[170%] h-[600px]"
        viewBox="0 0 1200 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          id="journeyPath"
          d="M 50 200 Q 300 100 550 200 Q 800 300 1050 200"
          stroke="#0f172a"
          strokeWidth="5"
          fill="none"
          strokeDasharray="15 10"
          strokeLinecap="round"
        />
      </svg>

      {/* Road Path — Mobile Vertical */}
      <svg
        ref={pathRef}
        className="block sm:hidden absolute -top-[40%] left-[90%] -translate-x-[90%] w-[95%] h-[2490px]"
        viewBox="0 0 400 1200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          id="journeyPath"
          d="M 200 50 Q 100 300 200 550 Q 300 800 200 1050"
          stroke="#0f172a"
          strokeWidth="5"
          fill="none"
          strokeDasharray="15 10"
          strokeLinecap="round"
        />
      </svg>

      {/* Title */}
      <div className="relative text-center mb-16 z-10 px-6">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 leading-tight">
          Your Journey with Trasure
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Every step of car care — smooth, fast, transparent.
        </p>
      </div>
{/* Step Cards */}
<div className="relative z-10 flex flex-col items-center  text-center sm:grid sm:grid-cols-3 sm:text-left gap-10 px-4 sm:px-8 max-w-7xl mx-auto">
  {steps.map((step, idx) => (
    <StepCard key={step.title} step={idx + 1} {...step} />
  ))}
</div>

    </section>
  );
};

export default HowItWorks;
