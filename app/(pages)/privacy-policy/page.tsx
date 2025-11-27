"use client";

import React from "react";
import { Shield, Lock, Eye, FileText, Mail, Server } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Opsional: Jika Anda ingin menggunakan font yang sama dengan Product Page
// import { fredoka, sniglet } from "@/lib/fonts";
// Jika tidak, hapus penggunaan variable font di className bawah.

export default function PrivacyPolicyPage() {
  const lastUpdated = "27 November 2025"; // Sesuaikan tanggal

  return (
    <div className="min-h-screen bg-white text-gray-600 font-sans">
      {/* ================= Header Section ================= */}
      {/* Menggunakan warna footer #A3B18A sebagai header background agar kontras dan senada */}
      <section className="relative bg-[#A3B18A] text-white pt-32 pb-16 px-6 lg:px-12 overflow-hidden rounded-b-[3rem]">
        {/* Background Patterns (Mirip Footer) */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-emerald-900 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center p-3 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Di COLORE, kami menghargai privasi dan keamanan data Anda dan buah
            hati. Dokumen ini menjelaskan bagaimana kami mengelola data Anda.
          </p>
          <p className="mt-4 text-sm bg-white/10 inline-block px-4 py-1 rounded-full">
            Terakhir diperbarui: {lastUpdated}
          </p>
        </div>
      </section>

      {/* ================= Content Section ================= */}
      <section className="px-6 lg:px-12 py-12">
        <div className="container mx-auto max-w-4xl">
          {/* Introduction Card */}
          <div className="bg-white border border-[#A3B18A]/30 rounded-3xl p-8 shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-[#A3B18A] mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Pendahuluan
            </h2>
            <p className="leading-relaxed mb-4">
              Selamat datang di COLORE. Kami berkomitmen untuk melindungi
              informasi pribadi Anda dan hak privasi Anda. Kebijakan Privasi ini
              berlaku untuk semua informasi yang dikumpulkan melalui situs web
              kami, serta layanan terkait, penjualan, pemasaran, atau acara apa
              pun.
            </p>
            <p className="leading-relaxed">
              Dengan mengakses atau menggunakan layanan kami, Anda menyetujui
              praktik pengumpulan dan penggunaan informasi yang dijelaskan dalam
              kebijakan ini.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Data Collection */}
            <div className="bg-gray-50 rounded-3xl p-8 border-l-4 border-[#A3B18A] hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#A3B18A]/10 rounded-2xl flex items-center justify-center mb-4 text-[#A3B18A]">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Informasi yang Kami Kumpulkan
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <span className="text-[#A3B18A]">•</span>
                  <span>
                    <strong>Identitas Pribadi:</strong> Nama, alamat email,
                    nomor telepon (untuk pengiriman).
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#A3B18A]">•</span>
                  <span>
                    <strong>Data Pembayaran:</strong> Kami tidak menyimpan data
                    kartu kredit. Pembayaran diproses oleh gateway aman.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#A3B18A]">•</span>
                  <span>
                    <strong>Data Penggunaan:</strong> Alamat IP, jenis browser,
                    dan halaman yang Anda kunjungi.
                  </span>
                </li>
              </ul>
            </div>

            {/* Data Usage */}
            <div className="bg-gray-50 rounded-3xl p-8 border-l-4 border-[#A3B18A] hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#A3B18A]/10 rounded-2xl flex items-center justify-center mb-4 text-[#A3B18A]">
                <Server className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Penggunaan Informasi
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <span className="text-[#A3B18A]">•</span>
                  <span>Memproses dan mengirimkan pesanan produk Anda.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#A3B18A]">•</span>
                  <span>
                    Mengirimkan konfirmasi pesanan dan update pengiriman.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#A3B18A]">•</span>
                  <span>
                    Meningkatkan pengalaman pengguna dan layanan pelanggan.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Security & Cookies */}
          <div className="space-y-8">
            <div className="group">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                <span className="w-10 h-10 bg-[#A3B18A] rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                  <Lock size={20} />
                </span>
                Keamanan Data
              </h2>
              <p className="leading-relaxed pl-14">
                Kami menerapkan langkah-langkah keamanan teknis dan organisasi
                yang sesuai untuk melindungi keamanan informasi pribadi Anda.
                Situs web kami menggunakan teknologi enkripsi SSL (Secure Socket
                Layer) untuk memastikan data Anda terkirim dengan aman melalui
                internet.
              </p>
            </div>

            <div className="group">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                <span className="w-10 h-10 bg-[#A3B18A] rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
                    <path d="M8.5 8.5v.01" />
                    <path d="M16 15.5v.01" />
                    <path d="M12 12v.01" />
                    <path d="M11 17v.01" />
                    <path d="M7 14v.01" />
                  </svg>
                </span>
                Cookies
              </h2>
              <p className="leading-relaxed pl-14">
                Kami menggunakan cookies untuk meningkatkan pengalaman browsing
                Anda, menayangkan iklan atau konten yang disesuaikan, dan
                menganalisis lalu lintas kami. Anda dapat memilih untuk
                menonaktifkan cookies melalui pengaturan browser Anda, namun hal
                ini dapat memengaruhi fungsi situs web.
              </p>
            </div>

            <div className="group">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                <span className="w-10 h-10 bg-[#A3B18A] rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                  <Shield size={20} />
                </span>
                Hak Anda
              </h2>
              <p className="leading-relaxed pl-14">
                Anda memiliki hak untuk meminta akses, koreksi, atau penghapusan
                data pribadi Anda yang kami simpan. Jika Anda ingin menggunakan
                hak ini, silakan hubungi kami melalui informasi kontak di bawah
                ini.
              </p>
            </div>
          </div>

          {/* Contact Box */}
          <div className="mt-12 bg-[#A3B18A] rounded-3xl p-8 md:p-12 text-center text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">Masih Ada Pertanyaan?</h2>
              <p className="mb-8 text-white/90 max-w-lg mx-auto">
                Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini,
                jangan ragu untuk menghubungi kami.
              </p>
              <a
                href="mailto:hello@colore.co.id"
                className="inline-flex items-center gap-2 bg-white text-[#A3B18A] px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg"
              >
                <Mail className="w-5 h-5" />
                hello@colore.co.id
              </a>
            </div>

            {/* Decorative Circle */}
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute top-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          </div>
        </div>
      </section>

      {/* Back to Home Text */}
      <div className="text-center pb-12">
        <Link href="/" className="text-[#A3B18A] font-semibold hover:underline">
          &larr; Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}