import React from "react";
import HeroSection from "../../components/Home/HeroSection";
import ServiceCategoriesGrid from "../../components/Home/ServiceCategoriesGrid";
import ServiceHighlights from "../../components/Home/ServiceHighlights"; // Why Choose Us
import HowItWorks from "../../components/Home/HowItWorks"; // Journey
import TrustFactors from "../../components/Home/TrustFactors"; // Why Trust Trasure
import TestimonialsCarousel from "../../components/Home/TestimonialsCarousel"; // Customer Testimonials
import BlogSnippets from "../../components/Home/BlogSnippets"; // Blog Tips
import GetStartedCTA from "../../components/Home/GetStartedCTA"; // Final Call to Action
import StickyMobileCTA from "../../components/Home/StickyMobileCTA"; // Mobile CTA

const Home = () => {
  return (
    <main
      className="font-sans bg-[#f0f4ff] min-h-screen transition-colors duration-300"
      aria-label="Trasure Customer Home Page"
      role="main"
    >
      {/* Hero Section */}
      <section
        aria-label="Hero Section"
        className="w-full relative overflow-hidden"
        role="region"
      >
        <HeroSection />
      </section>
      {/* Service Categories */}
      <section
        aria-label="Service Categories"
        className="mx-auto"
        role="region"
      >
        <ServiceCategoriesGrid />
      </section>
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
