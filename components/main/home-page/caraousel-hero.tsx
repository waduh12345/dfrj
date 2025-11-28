"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEditMode } from "@/hooks/use-edit-mode"; // Hook Edit Mode
import { EditableImage } from "@/components/ui/editable"; // Komponen Gambar Editable

// Default data (Initial State)
const defaultImages = [
  { url: "/hero-colore.webp" },
  {
    url: "https://8nc5ppykod.ufs.sh/f/H265ZJJzf6brtLyODtex0OYVvL2QeijZs4TN9tB6HcnbPodI",
  },
  {
    url: "https://8nc5ppykod.ufs.sh/f/H265ZJJzf6bri3rJ2rdJLrZYECsOD7ov0VHgdItKxMcf2my3",
  },
];

export default function ImageCarousel() {
  const isEditMode = useEditMode();

  // Ubah data statis menjadi State agar bisa diedit
  const [images, setImages] = useState(defaultImages);
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  // Fungsi untuk update gambar spesifik berdasarkan index slide
  const handleImageUpdate = (index: number, newUrl: string) => {
    setImages((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], url: newUrl };
      return updated;
    });
  };

  // Auto-play carousel (Pause jika sedang mode edit agar tidak mengganggu)
  useEffect(() => {
    if (isEditMode) return; // Optional: Stop auto-play saat mode edit

    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [isEditMode, images.length]); // Dependency updated

  return (
    <div className="relative w-full h-96 md:h-full overflow-hidden group">
      {/* Slides Container */}
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {images.map((item, index) => (
          <div key={index} className="w-full h-full flex-shrink-0 relative">
            {/* Menggunakan EditableImage 
                containerClassName="w-full h-full" memastikan wrapper mengisi slide
                className="object-cover" memastikan gambar tidak gepeng
            */}
            <EditableImage
              isEditMode={isEditMode}
              src={item.url}
              onSave={(newUrl) => handleImageUpdate(index, newUrl)}
              alt={`Slide ${index + 1}`}
              containerClassName="w-full h-full"
              className="w-full h-full object-cover"
              width={1200} // Wajib untuk Next/Image (aspect ratio) atau gunakan fill={true}
              height={800}
              priority={index === 0} // Optimasi LCP untuk slide pertama
            />
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 z-10"
      >
        <ChevronLeft className="w-6 h-6 text-gray-800" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 z-10"
      >
        <ChevronRight className="w-6 h-6 text-gray-800" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              currentSlide === index
                ? "bg-white shadow-lg scale-110"
                : "bg-white/60 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}