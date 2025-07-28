"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function ProfileDesa() {
  return (
    <section
      id="profile-desa"
      className="relative w-full h-[600px] pt-32 lg:pt-0 md:h-[700px] lg:h-[800px] bg-black/80 overflow-hidden flex items-center"
    >
      {/* Background Image */}
      <Image
        src="/images/bg-profile.jpeg"
        alt="Background Desa"
        fill
        style={{ objectFit: "cover" }}
        quality={90}
        objectPosition="center"
        className="absolute inset-0 z-0"
        priority
      />

      {/* Overlay Hitam */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* Content */}
      <div className="relative z-20 container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text Kiri */}
          <div className="text-white space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Profil <span className="text-[#A80038]">Desa</span> Koperasi Merah
              Putih
            </h2>
            <p className="text-base md:text-lg text-neutral-200 max-w-xl">
              Koperasi Merah Putih hadir di tengah desa-desa Indonesia, menjadi
              motor penggerak ekonomi rakyat yang adil dan mandiri. Melalui
              akses pembiayaan, pelatihan, dan teknologi, kami membangun desa
              yang produktif dan berkelanjutan.
            </p>
            <p className="hidden lg:block text-base md:text-lg text-neutral-200 max-w-xl">
              Visi kami: menjadikan desa sebagai pusat pertumbuhan ekonomi
              berbasis gotong royong yang modern dan inklusif.
            </p>
            <button className="inline-flex items-center gap-2 bg-[#A80038] text-white font-semibold px-5 py-3 rounded-md text-sm hover:bg-white hover:text-[#A80038] transition">
              Pelajari Lebih Lanjut
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Logo Kanan */}
          <div className="hidden md:flex justify-center md:justify-end">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-3xl scale-110 z-0" />
              <Image
                src="/logo-village.png"
                alt="Logo Desa"
                width={400}
                height={400}
                className="relative z-10 object-contain rounded-full border-4 border-white shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}