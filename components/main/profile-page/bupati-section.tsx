"use client";

import Image from "next/image";

export default function SectionBupati() {
  return (
    <section className="relative py-20 bg-white" id="bupati">
      <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Gambar Bupati */}
        <div className="relative flex justify-center md:justify-start">
          {/* Lingkaran Background Lebih Besar */}
          <div className="absolute bottom-4 left-1/2 lg:left-1/3 -translate-x-1/2 w-[400px] h-[400px] bg-green-600/10 rounded-full z-0" />

          {/* Foto Bupati */}
          <Image
            src="/images/bupati-img.png"
            alt="Bupati"
            width={320}
            height={320}
            className="relative z-10 -top-8 object-contain rounded-b-full"
            priority
          />
        </div>

        {/* Deskripsi */}
        <div className="border-2 border-green-600 rounded-lg p-1">
          <div className="bg-green-600 border-2 border-light-200 rounded-lg p-6 md:p-8 space-y-4 text-white shadow-md text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold">Sambutan Bupati</h2>
            <p className="text-sm md:text-base leading-relaxed text-neutral-100">
              Marketplace Pondok merupakan langkah nyata dalam membangun
              kemandirian ekonomi masyarakat desa. Kami mendukung penuh
              transformasi koperasi melalui digitalisasi, transparansi, dan
              semangat gotong royong. Bersama, kita wujudkan desa yang mandiri,
              adil, dan sejahtera.
            </p>
            <p className="font-semibold text-white">Bupati Kabupaten XYZ</p>
          </div>
        </div>
      </div>
    </section>
  );
}
