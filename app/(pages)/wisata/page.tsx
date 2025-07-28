import React from "react";
import HeroSection from "@/components/main/wisata/pages/hero-wisata";
import WisataPage from "@/components/main/wisata/pages/wisata-360-page";

export default function Wisata() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Hero Section */}
      <HeroSection
        title="Jelajahi Keindahan Wisata Indonesia"
        subtitle="Temukan petualangan tak terlupakan di destinasi-destinasi menakjubkan kami."
        backgroundImage="/images/bg-wisata.jpg"
      />
     <WisataPage />
    </div>
  );
}
