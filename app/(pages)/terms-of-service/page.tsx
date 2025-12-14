"use client";

import React from "react";
import {
  Scale,
  ShoppingBag,
  UserCheck,
  Copyright,
  AlertCircle,
  Gavel,
  HelpCircle,
  Mail,
  ArrowLeft,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import { fredoka, sniglet } from "@/lib/fonts";

export default function TermsOfServicePage() {
  const lastUpdated = "14 Desember 2025";
  const waNumber = "628176942128"; 
  const emailAddress = "admin@difaraja.id"; 

  return (
    <div className={`min-h-screen bg-white text-[#5B4A3B] ${sniglet.className}`}>
      {/* ================= Header Section ================= */}
      <section className="relative bg-gradient-to-br from-[#d43893ff] to-[#a0226d] text-white pt-32 pb-20 px-6 lg:px-12 overflow-hidden rounded-b-[3rem]">
        {/* Abstract Background Patterns */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-300 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-purple-400 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center p-4 bg-white/20 backdrop-blur-md rounded-3xl mb-6 shadow-xl border border-white/20">
            <Scale className="w-10 h-10 text-white" />
          </div>
          <h1 className={`text-4xl lg:text-6xl font-bold mb-4 ${fredoka.className}`}>
            Syarat & Ketentuan
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
            Harap baca ketentuan ini dengan saksama sebelum mendukung karya difabelpreneur melalui layanan kami.
          </p>
          <div className="mt-6 inline-block">
            <span className="text-sm bg-white/10 backdrop-blur-md px-5 py-2 rounded-full border border-white/10">
                Terakhir diperbarui: {lastUpdated}
            </span>
          </div>
        </div>
      </section>

      {/* ================= Content Section ================= */}
      <section className="px-6 lg:px-12 py-16">
        <div className="container mx-auto max-w-4xl">
          {/* Introduction */}
          <div className="bg-white border border-[#d43893ff]/10 rounded-[2rem] p-8 shadow-sm mb-12">
            <p className="leading-loose text-lg">
              Selamat datang di <strong>DIFARAJA</strong>. Syarat dan Ketentuan ini mengatur penggunaan Anda atas platform kami dan pembelian karya (Kuliner, Kriya, Fashion) dari mitra difabelpreneur kami. Dengan mengakses layanan ini, Anda setuju untuk terikat oleh ketentuan berikut.
            </p>
          </div>

          <div className="space-y-8">
            {/* 1. Account */}
            <div className="bg-[#FFF0F5] rounded-[2rem] p-8 border border-pink-100 hover:border-[#d43893ff]/30 transition-all group hover:shadow-lg">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 text-[#d43893ff] shadow-sm group-hover:bg-[#d43893ff] group-hover:text-white transition-colors">
                  <UserCheck size={24} />
                </div>
                <div>
                  <h3 className={`text-xl font-bold text-[#5B4A3B] mb-3 ${fredoka.className}`}>
                    1. Akun Pengguna
                  </h3>
                  <p className="text-sm leading-relaxed text-[#5B4A3B]/80">
                    Saat membuat akun di DIFARAJA, Anda wajib memberikan informasi yang akurat (nama, alamat pengiriman, kontak). Anda bertanggung jawab menjaga kerahasiaan akun Anda demi keamanan transaksi karya teman-teman difabel.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Products & Purchases (Adapted for Handmade/Culinary) */}
            <div className="bg-[#FFF0F5] rounded-[2rem] p-8 border border-pink-100 hover:border-[#d43893ff]/30 transition-all group hover:shadow-lg">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 text-[#d43893ff] shadow-sm group-hover:bg-[#d43893ff] group-hover:text-white transition-colors">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <h3 className={`text-xl font-bold text-[#5B4A3B] mb-3 ${fredoka.className}`}>
                    2. Karya & Pembelian
                  </h3>
                  <ul className="list-disc list-inside text-sm space-y-3 text-[#5B4A3B]/80 ml-1">
                    <li>
                      <strong>Variasi Handmade:</strong> Produk Kriya kami adalah buatan tangan. Sedikit perbedaan warna atau detail antar produk adalah wajar dan menjadi ciri khas keunikan karya.
                    </li>
                    <li>
                      <strong>Produk Kuliner:</strong> Kami menjamin kualitas dan higienitas saat pengiriman. Segera konsumsi produk basah setelah diterima.
                    </li>
                    <li>
                      Harga dan stok dapat berubah sewaktu-waktu sesuai ketersediaan bahan baku mitra difabelpreneur.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 3. Intellectual Property */}
            <div className="bg-[#FFF0F5] rounded-[2rem] p-8 border border-pink-100 hover:border-[#d43893ff]/30 transition-all group hover:shadow-lg">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 text-[#d43893ff] shadow-sm group-hover:bg-[#d43893ff] group-hover:text-white transition-colors">
                  <Copyright size={24} />
                </div>
                <div>
                  <h3 className={`text-xl font-bold text-[#5B4A3B] mb-3 ${fredoka.className}`}>
                    3. Hak Kekayaan Intelektual
                  </h3>
                  <p className="text-sm leading-relaxed text-[#5B4A3B]/80">
                    Seluruh konten, desain produk, foto karya, dan logo DIFARAJA adalah aset intelektual kami dan mitra difabelpreneur. Dilarang menggunakan atau menduplikasi tanpa izin tertulis demi menghargai orisinalitas karya.
                  </p>
                </div>
              </div>
            </div>

            {/* 4. Limitation of Liability */}
            <div className="bg-[#FFF0F5] rounded-[2rem] p-8 border border-pink-100 hover:border-[#d43893ff]/30 transition-all group hover:shadow-lg">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 text-[#d43893ff] shadow-sm group-hover:bg-[#d43893ff] group-hover:text-white transition-colors">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <h3 className={`text-xl font-bold text-[#5B4A3B] mb-3 ${fredoka.className}`}>
                    4. Batasan Tanggung Jawab
                  </h3>
                  <p className="text-sm leading-relaxed text-[#5B4A3B]/80">
                    DIFARAJA tidak bertanggung jawab atas keterlambatan pengiriman yang disebabkan oleh pihak ekspedisi atau kerusakan akibat kesalahan penanganan setelah barang diterima. Namun, kami akan membantu proses klaim sebaik mungkin.
                  </p>
                </div>
              </div>
            </div>

            {/* 5. Governing Law */}
            <div className="bg-[#FFF0F5] rounded-[2rem] p-8 border border-pink-100 hover:border-[#d43893ff]/30 transition-all group hover:shadow-lg">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 text-[#d43893ff] shadow-sm group-hover:bg-[#d43893ff] group-hover:text-white transition-colors">
                  <Gavel size={24} />
                </div>
                <div>
                  <h3 className={`text-xl font-bold text-[#5B4A3B] mb-3 ${fredoka.className}`}>
                    5. Hukum yang Berlaku
                  </h3>
                  <p className="text-sm leading-relaxed text-[#5B4A3B]/80">
                    Ketentuan ini diatur oleh hukum Negara Republik Indonesia. Segala sengketa akan diselesaikan secara musyawarah untuk mufakat terlebih dahulu.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="mt-16 text-center bg-gradient-to-r from-[#d43893ff] to-[#a0226d] rounded-[2.5rem] p-12 text-white shadow-2xl shadow-pink-200 relative overflow-hidden">
             {/* Decor */}
             <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
             <div className="absolute bottom-0 right-0 w-32 h-32 bg-yellow-300/20 rounded-full blur-2xl"></div>

            <div className="relative z-10">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <HelpCircle size={28} className="text-white" />
                </div>
                <h2 className={`text-3xl font-bold mb-3 ${fredoka.className}`}>
                Perlu Bantuan?
                </h2>
                <p className="text-white/90 mb-8 max-w-md mx-auto">
                Jika ada poin yang kurang jelas mengenai syarat dan ketentuan ini, tim kami siap membantu Anda.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a
                    href={`https://wa.me/${waNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#d43893ff] rounded-xl font-bold hover:bg-green-50 hover:text-green-600 transition-all shadow-lg"
                >
                    <FaWhatsapp size={22} />
                    WhatsApp Admin
                </a>
                <a
                    href={`mailto:${emailAddress}`}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold hover:bg-white/10 transition-all"
                >
                    <Mail size={22} />
                    Email Kami
                </a>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Navigation */}
      <div className="text-center pb-16">
        <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-[#d43893ff] font-bold hover:text-[#a0226d] transition-colors bg-pink-50 px-6 py-3 rounded-full"
        >
          <ArrowLeft size={18} /> Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}