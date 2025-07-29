"use client";

import {
  Users,
  Handshake,
  ShieldCheck,
  Smartphone,
  TrendingUp,
  Globe,
} from "lucide-react";

export default function WhyJoinSection() {
  const reasons = [
    {
      icon: <Users className="w-10 h-10 text-green-600" />,
      title: "Gotong Royong",
      desc: "Koperasi dibangun atas dasar kebersamaan dan saling membantu antar anggota.",
    },
    {
      icon: <Handshake className="w-10 h-10 text-green-600" />,
      title: "Kepemilikan Bersama",
      desc: "Setiap anggota memiliki hak suara dan ikut ambil bagian dalam pengambilan keputusan.",
    },
    {
      icon: <ShieldCheck className="w-10 h-10 text-green-600" />,
      title: "Transparan & Aman",
      desc: "Sistem pengelolaan terbuka, laporan keuangan jelas, dan diawasi oleh anggota.",
    },
    {
      icon: <Smartphone className="w-10 h-10 text-green-600" />,
      title: "Digital & Modern",
      desc: "Akses layanan koperasi cukup lewat aplikasi, cepat dan efisien.",
    },
    {
      icon: <TrendingUp className="w-10 h-10 text-green-600" />,
      title: "Memberikan Keuntungan",
      desc: "Sisa hasil usaha dibagikan secara adil kepada seluruh anggota.",
    },
    {
      icon: <Globe className="w-10 h-10 text-green-600" />,
      title: "Dukungan Ekonomi Lokal",
      desc: "Koperasi mendukung UMKM dan pertumbuhan ekonomi di daerah.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 md:px-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1D1D1D] mb-4">
          Kenapa Harus Bergabung?
        </h2>
        <p className="text-neutral-600 max-w-2xl mx-auto mb-12">
          Bergabung dengan Marketplace Pondok bukan sekadar menabung atau
          meminjam, tapi menjadi bagian dari gerakan ekonomi kerakyatan berbasis
          teknologi.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="bg-neutral-100 rounded-lg shadow-sm p-6 hover:shadow-lg hover:-translate-y-2 transition"
            >
              <div className="flex flex-col items-center space-y-4">
                {reason.icon}
                <h3 className="text-lg font-semibold text-[#1D1D1D] text-center">
                  {reason.title}
                </h3>
                <p className="text-sm text-neutral-600 text-center">
                  {reason.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
