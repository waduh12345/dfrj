"use client";

import Image from "next/image";

const programs = [
  {
    title: "Simpanan Anggota",
    image: "/images/program-simpanan.jpeg",
  },
  {
    title: "Pinjaman Modal Usaha",
    image: "/images/program-pinjaman.jpeg",
  },
  {
    title: "Digitalisasi UMKM",
    image: "/images/program-umkm.jpeg",
  },
  {
    title: "Pelatihan Kewirausahaan",
    image: "/images/program-pelatihan.jpeg",
  },
  {
    title: "Pendampingan Desa",
    image: "/images/program-desa.jpeg",
  },
  {
    title: "Program Investasi",
    image: "/images/program-investasi.jpeg",
  },
];

export default function ProgramSection() {
  return (
    <section id="program" className="bg-white py-20 px-6 md:px-12">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#A80038] mb-4">
          Program Unggulan Kami
        </h2>
        <p className="text-center text-neutral-600 text-base md:text-lg mb-12 max-w-3xl mx-auto">
          Kami menghadirkan berbagai program strategis yang dirancang untuk
          memperkuat ekonomi anggota, mendukung UMKM, serta meningkatkan
          kesejahteraan masyarakat melalui pendekatan koperasi yang modern dan
          berkelanjutan.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program, index) => (
            <div
              key={index}
              className="relative rounded-xl overflow-hidden group"
            >
              <Image
                src={program.image}
                alt={program.title}
                width={600}
                height={400}
                className="w-full h-[250px] object-cover transform group-hover:scale-105 transition duration-300"
              />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
                <h3 className="text-white text-lg font-semibold">
                  {program.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
