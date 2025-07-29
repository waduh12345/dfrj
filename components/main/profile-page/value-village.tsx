"use client";

import Image from "next/image";
import { useState } from "react";
import clsx from "clsx";

const tabs = [
  {
    label: "Nilai Kami",
    image: "/images/profile-desa.jpeg",
    content: [
      {
        title: "Inovatif, Kreatif, Adaptif",
        points: [
          "Mengikuti perkembangan teknologi untuk mendukung operasional koperasi.",
          "Berpikir kreatif dalam memecahkan tantangan ekonomi desa.",
          "Fleksibel dalam beradaptasi dengan perubahan zaman dan kebutuhan anggota.",
        ],
      },
      {
        title: "Profesionalisme & Keahlian",
        points: [
          "Tim pengurus yang berkompeten dan berpengalaman.",
          "Memberikan layanan koperasi berkualitas tinggi dan terpercaya.",
        ],
      },
      {
        title: "Empati & Inisiatif",
        points: [
          "Mendengarkan kebutuhan masyarakat dengan empati.",
          "Proaktif dalam mencari solusi untuk kesejahteraan anggota.",
        ],
      },
    ],
  },
  {
    label: "Visi Kami",
    image: "/images/visi.jpeg",
    content: [
      {
        title: "Membangun Desa Mandiri dan Berdaya",
        points: [
          "Menjadi koperasi digital terpercaya di tingkat nasional.",
          "Menumbuhkan semangat gotong royong dan solidaritas ekonomi.",
        ],
      },
    ],
  },
  {
    label: "Misi Kami",
    image: "/images/misi.jpeg",
    content: [
      {
        title: "Misi Marketplace Pondok",
        points: [
          "Memberikan akses layanan simpan pinjam dan usaha produktif.",
          "Mendorong digitalisasi koperasi hingga ke pelosok desa.",
          "Mengembangkan SDM koperasi melalui pelatihan dan pendampingan.",
        ],
      },
    ],
  },
];

export default function ValueVillage() {
  const [activeTab, setActiveTab] = useState(0);
  const current = tabs[activeTab];

  return (
    <section
      id="profile-desa"
      className="relative bg-white py-20 overflow-hidden"
    >
      {/* Pola Background (opsional) */}
      <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-repeat opacity-5 pointer-events-none z-0" />

      <div className="container mx-auto px-6 md:px-12 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Text & Tab Section */}
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-green-600 leading-tight text-center md:text-left">
            Mengenal Marketplace Pondok
          </h2>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={clsx(
                  "px-4 py-2 text-sm rounded-md transition border",
                  activeTab === i
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-green-600 border-neutral-300 hover:bg-[#fce4ec]"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="space-y-6">
            {current.content.map((section, i) => (
              <div key={i}>
                <h4 className="font-semibold text-green-600 text-base md:text-lg mb-1">
                  ✅ {section.title}
                </h4>
                <ul className="list-disc list-inside text-neutral-700 text-sm md:text-base space-y-1 pl-4">
                  {section.points.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Image Section */}
        <div className="flex justify-center md:justify-end">
          <Image
            src={current.image}
            alt={current.label}
            width={600}
            height={600}
            className="rounded-lg w-full h-[400px] md:h-[500px] object-cover shadow-md"
          />
        </div>
      </div>
    </section>
  );
}
