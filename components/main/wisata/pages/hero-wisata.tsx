"use client";

import React from "react";
import Image from "next/image";
import ReflectedButton from "@/components/ui/reflected-button";
interface HeroSectionProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  backgroundImage,
}) => {
  return (
    <section className="relative pt-32 lg:pt-0 h-[60vh] md:h-[70vh] lg:h-screen w-full flex items-center justify-center text-center overflow-hidden">
      <Image
        src={backgroundImage}
        alt="Destinasi Wisata"
        fill
        style={{ objectFit: "cover" }}
        quality={80}
        priority
        className="brightness-75 dark:brightness-50 transition-all duration-300"
      />

      {/* Overlay Gelap */}
      <div className="absolute inset-0 bg-black opacity-40"></div>

      {/* Konten Hero */}
      <div className="relative z-10 text-white p-4 max-w-4xl mx-auto">
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 text-white"
          style={{
            textShadow: "2px 2px 0 #A80038, 4px 4px 0 rgba(0,0,0,0.3)",
          }}
        >
          {title}
        </h1>
        <p
          className="hidden md:block text-lg md:text-xl mb-8 text-white opacity-90"
          style={{
            textShadow: "1px 1px 0 #A80038, 2px 2px 0 rgba(0,0,0,0.3)",
          }}
        >
          {subtitle}
        </p>
        <ReflectedButton
          text1="HAPPY"
          text2="TRAVEL"
          onClick={() => alert("Hello!")}
        />
      </div>
    </section>
  );
};

export default HeroSection;
