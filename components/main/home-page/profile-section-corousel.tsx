"use client";

import Image from "next/image";
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import KoperasiOverview from "../../koperasi-overview";

export default function ProfileSectionWithCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  const images = [
    {
      src: "/images/koperasi-1.jpg",
      desc: "Bekerja Bersama: Kekuatan koperasi terletak pada kebersamaan dan gotong royong seluruh anggotanya.",
    },
    {
      src: "/images/koperasi-2.jpg",
      desc: "Disiplin: Setiap anggota menjunjung tinggi tanggung jawab, etos kerja, dan kedisiplinan dalam menjalankan tugas.",
    },
    {
      src: "/images/koperasi-3.jpg",
      desc: "Rapat: Pengambilan keputusan dilakukan secara musyawarah dalam forum rapat yang demokratis.",
    },
  ];

  return (
    <section className="bg-white relative overflow-hidden py-20">
      {/* Ornamen background pola */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/pattern.svg')] bg-repeat opacity-5 pointer-events-none z-0" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Text Section */}
        <KoperasiOverview />

        {/* Carousel Image Section */}
        <div className="flex justify-center md:justify-end">
          <Carousel
            plugins={[plugin.current]}
            className="w-full max-w-md"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent>
              {images.map(({ src, desc }, index) => (
                <CarouselItem key={index} className="p-2">
                  <Card className="overflow-hidden rounded-xl shadow-md">
                    <CardContent className="p-0 relative">
                      <Image
                        src={src}
                        alt={`Kegiatan ${index + 1}`}
                        width={600}
                        height={600}
                        className="w-full h-96 object-cover"
                      />

                      {/* Overlay Masking Deskripsi */}
                      <div className="absolute bottom-0 left-0 w-full h-96 bg-gradient-to-t from-black/80 to-transparent text-white px-4 py-4 flex items-end">
                        <p className="text-sm">{desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
