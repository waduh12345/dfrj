"use client";

import { useState } from "react";
import { X } from "lucide-react";
import VirtualTour360 from "../VirtualTour360";

export default function VirtualTourModal({
  imageUrl,
  onClose,
}: {
  imageUrl: string;
  onClose: () => void;
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-xl w-full max-w-5xl p-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-xl text-gray-600 hover:text-black dark:text-white"
        >
          <X />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">
          360° Virtual Tour
        </h2>

        {!isLoaded && (
          <div className="w-full h-[500px] flex items-center justify-center">
            <span className="text-sm text-gray-500">Memuat panorama...</span>
          </div>
        )}

        {imageUrl ? (
          <div className={isLoaded ? "block" : "hidden"}>
            <VirtualTour360
              imageUrl={imageUrl}
              onLoad={() => setIsLoaded(true)}
            />
          </div>
        ) : (
          <p className="text-center text-sm text-gray-500">
            Panorama tidak tersedia.
          </p>
        )}
      </div>
    </div>
  );
}