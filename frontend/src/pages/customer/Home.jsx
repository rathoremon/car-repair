import React from "react";
import { useTheme } from "@mui/material/styles";
import HeroSection from "../../components/Home/HeroSection";
import QuickActionsGrid from "../../components/Home/QuickActionsGrid"; // Service Categories
import ServiceHighlights from "../../components/Home/ServiceHighlights"; // Why Choose Us
import HowItWorks from "../../components/Home/HowItWorks"; // Journey
import TrustFactors from "../../components/Home/TrustFactors"; // Why Trust Trasure
import TestimonialsCarousel from "../../components/Home/TestimonialsCarousel"; // Customer Testimonials
import BlogSnippets from "../../components/Home/BlogSnippets"; // Blog Tips
import GetStartedCTA from "../../components/Home/GetStartedCTA"; // Final Call to Action
import StickyMobileCTA from "../../components/Home/StickyMobileCTA"; // Mobile CTA
import ActiveServiceTile from "../../components/Home/ActiveServiceTile";

const activeService = {
  isActive: true,
  type: "Tyre Replacement",
  mechanicName: "Rajesh Kumar",
  mechanicAvatar: "https://i.pravatar.cc/150?img=12", // Random avatar
  eta: 12, // minutes
  distance: 2.5, // km
  status: "En Route", // Could be "On-Site", "Work Started", "Completed"
  vehicle: "Tesla Model 3",
  onTrack: () => alert("Opening Live Track..."),
  onChat: () => alert("Opening Chat..."),
  onCancel: () => alert("Cancelling Service..."),
};

const noActiveService = {
  isActive: false,
  lastService: {
    type: "Oil Change",
    cost: 3500,
    date: "2 months ago",
    vehicle: "Hyundai i20",
  },
  onRebook: () => alert("Rebooking Last Service..."),
};
const Home = () => {
  const theme = useTheme();
  return (
    <main
      className="font-sans bg-[#f0f4ff] min-h-screen transition-colors duration-300"
      aria-label="Trasure Customer Home Page"
      role="main"
    >
      {/* Hero Section */}
      <section aria-label="Hero Section" className="w-full " role="region">
        <HeroSection />
      </section>
      <div
        style={{
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, #111827, #1f2937)"
              : "linear-gradient(135deg, #f9fafb, #e5e7eb)",

          padding: "4rem 0",
        }}
      >
        <section className="mx-auto ">
          <QuickActionsGrid />
        </section>

        <section className="mx-auto ">
          <ActiveServiceTile service={activeService} />
          {/* <ActiveServiceTile service={noActiveService} /> */}
        </section>
      </div>

      {/* Why Choose Trasure (Highlights) */}
      <section
        aria-label="Why Choose Trasure"
        className="mx-auto"
        role="region"
      >
        <ServiceHighlights />
      </section>
      {/* How It Works Journey */}
      <section aria-label="How It Works" className="md:py-0" role="region">
        <div className="mx-auto">
          <HowItWorks />
        </div>
      </section>
      {/* Trust Factors */}
      <section aria-label="Trust Factors" className="mx-auto" role="region">
        {/* <TrustFactors /> */}
      </section>
      {/* Testimonials */}
      <section
        aria-label="Customer Testimonials"
        className="mx-auto"
        role="region"
      >
        <div className="mx-auto">{/* <TestimonialsCarousel /> */}</div>
      </section>
      {/* Blog Snippets */}
      <section
        aria-label="Car Care Blog Tips"
        className="mx-auto"
        role="region"
      >
        {/* <BlogSnippets /> */}
      </section>
      {/* Get Started CTA */}
      <section aria-label="Get Started CTA" className="mx-auto" role="region">
        <div className="mx-auto">{/* <GetStartedCTA /> */}</div>
      </section>
      <section
        aria-label="Sticky Mobile Call to Action"
        className=""
        role="region"
      >
        <div className="mx-auto">
          <StickyMobileCTA />
        </div>
      </section>
    </main>
  );
};

export default Home;
