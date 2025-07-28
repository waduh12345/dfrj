"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { WisataItem } from "@/types/wisata";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import VirtualTourModal from "./virtual-tour-modal";

export default function WisataModal({
  data,
  onClose,
}: {
  data: WisataItem;
  onClose: () => void;
}) {
  const [show360, setShow360] = useState(false);

  // Opsional: blokir scroll di background saat modal 360 terbuka
  useEffect(() => {
    if (show360) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [show360]);

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
        <div className="bg-white dark:bg-neutral-900 max-w-4xl w-full min-h-96 rounded-xl shadow-xl p-6 relative z-50">
          <button
            onClick={onClose}
            className="absolute z-40 rounded-md shadow-md p-2 bg-white top-4 right-4 text-2xl text-gray-600 hover:text-black dark:text-white"
          >
            <X />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gambar kiri (50%) */}
            <div className="relative w-full h-[300px] md:h-auto aspect-[4/3] md:aspect-auto md:min-h-[400px]">
              <Image
                src={data.gambar}
                alt={data.nama}
                fill
                className="object-cover rounded-xl"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Konten kanan */}
            <div className="flex flex-col justify-between w-full space-y-4 px-4 md:px-0">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">{data.nama}</h2>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {data.deskripsi}
                </p>
              </div>
              <div className="space-y-2">
                <Button
                  className="w-full bg-[#A80038] text-white hover:bg-[#5b0f0f]"
                  onClick={() => setShow360(true)}
                >
                  Virtual Tour 360
                </Button>
                <Button
                  onClick={() => {
                    if (data.maps) window.open(data.maps, "_blank");
                  }}
                  className="w-full bg-[#A80038] text-white hover:bg-[#5b0f0f]"
                >
                  Maps
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Virtual Tour */}
      {show360 && (
        <VirtualTourModal
          imageUrl={data.gambar || "/images/panorama/sphere.jpg"}
          onClose={() => setShow360(false)}
        />
      )}
    </>
  );
}
