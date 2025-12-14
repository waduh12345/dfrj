"use client";

import React from "react";
import { Shield, Lock, Eye, FileText, Mail, Server, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { fredoka, sniglet } from "@/lib/fonts";

export default function PrivacyPolicyPage() {
  const lastUpdated = "14 Desember 2025"; 

  return (
    <div className={`min-h-screen bg-white text-gray-600 ${sniglet.className}`}>
      {/* ================= Header Section ================= */}
      <section className="relative bg-gradient-to-br from-[#d43893ff] to-[#a0226d] text-white pt-32 pb-20 px-6 lg:px-12 overflow-hidden rounded-b-[3rem]">
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-48 h-48 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-yellow-300 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-purple-400 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center p-4 bg-white/20 backdrop-blur-md rounded-3xl mb-8 shadow-xl border border-white/20">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className={`text-4xl lg:text-6xl font-bold mb-6 ${fredoka.className}`}>
            Kebijakan Privasi
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto leading-relaxed font-light">
            Di <strong>DIFARAJA</strong>, kepercayaan Anda adalah amanah bagi kami. Dokumen ini menjelaskan bagaimana kami menjaga dan mengelola data pribadi Anda dalam setiap transaksi karya difabelpreneur.
          </p>
          <div className="mt-8 inline-block">
             <span className="text-sm bg-white/10 backdrop-blur-md px-5 py-2 rounded-full border border-white/10">
                Terakhir diperbarui: {lastUpdated}
             </span>
          </div>
        </div>
      </section>

      {/* ================= Content Section ================= */}
      <section className="px-6 lg:px-12 py-16">
        <div className="container mx-auto max-w-4xl">
          {/* Introduction Card */}
          <div className="bg-white border border-[#d43893ff]/20 rounded-[2rem] p-8 lg:p-10 shadow-xl shadow-pink-100/50 mb-10">
            <h2 className={`text-2xl font-bold text-[#d43893ff] mb-4 flex items-center gap-3 ${fredoka.className}`}>
              <FileText className="w-7 h-7" />
              Pendahuluan
            </h2>
            <p className="leading-loose mb-4 text-[#5B4A3B]">
              Selamat datang di <strong>DIFARAJA (Difabelpreneur Raden Wijaya)</strong>. Kami berkomitmen penuh untuk melindungi privasi Anda saat berbelanja produk Kuliner, Kriya, dan Fashion kami.
            </p>
            <p className="leading-loose text-[#5B4A3B]">
              Kebijakan ini dibuat agar Anda memahami informasi apa yang kami kumpulkan, mengapa kami mengumpulkannya, dan bagaimana kami menggunakannya untuk memberikan layanan terbaik bagi Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Data Collection */}
            <div className="bg-[#FFF0F5] rounded-[2rem] p-8 border border-pink-100 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 text-[#d43893ff] shadow-sm">
                <Eye className="w-7 h-7" />
              </div>
              <h3 className={`text-xl font-bold text-[#5B4A3B] mb-4 ${fredoka.className}`}>
                Informasi yang Kami Kumpulkan
              </h3>
              <ul className="space-y-3 text-sm text-[#5B4A3B]/80">
                <li className="flex gap-3">
                  <span className="text-[#d43893ff] mt-1">●</span>
                  <span>
                    <strong>Identitas & Kontak:</strong> Nama lengkap, alamat email, dan nomor WhatsApp (untuk koordinasi pengiriman).
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#d43893ff] mt-1">●</span>
                  <span>
                    <strong>Alamat Pengiriman:</strong> Detail lokasi untuk memastikan produk kuliner/kriya sampai dengan aman.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#d43893ff] mt-1">●</span>
                  <span>
                    <strong>Riwayat Pesanan:</strong> Daftar karya yang pernah Anda beli untuk rekomendasi di masa depan.
                  </span>
                </li>
              </ul>
            </div>

            {/* Data Usage */}
            <div className="bg-[#FFF0F5] rounded-[2rem] p-8 border border-pink-100 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 text-[#d43893ff] shadow-sm">
                <Server className="w-7 h-7" />
              </div>
              <h3 className={`text-xl font-bold text-[#5B4A3B] mb-4 ${fredoka.className}`}>
                Penggunaan Informasi
              </h3>
              <ul className="space-y-3 text-sm text-[#5B4A3B]/80">
                <li className="flex gap-3">
                  <span className="text-[#d43893ff] mt-1">●</span>
                  <span>Memproses transaksi dan mengatur pengiriman ekspedisi/kurir.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#d43893ff] mt-1">●</span>
                  <span>
                    Mengirimkan update status pesanan (resi) melalui Email atau WhatsApp.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#d43893ff] mt-1">●</span>
                  <span>
                    Meningkatkan kualitas layanan dan variasi produk difabelpreneur.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Security & Cookies */}
          <div className="space-y-8 bg-white p-8 lg:p-10 rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-50">
            <div className="group">
              <h2 className={`text-2xl font-bold text-[#5B4A3B] mb-4 flex items-center gap-4 ${fredoka.className}`}>
                <span className="w-12 h-12 bg-[#d43893ff] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-pink-200 group-hover:scale-110 transition-transform duration-300">
                  <Lock size={22} />
                </span>
                Keamanan Transaksi
              </h2>
              <p className="leading-loose pl-0 lg:pl-16 text-gray-600">
                Kami bekerja sama dengan gateway pembayaran terpercaya (Midtrans) untuk memastikan setiap transaksi aman. Difaraja <strong>tidak pernah</strong> menyimpan data kartu kredit atau kredensial perbankan Anda di server kami.
              </p>
            </div>

            <div className="w-full h-px bg-gray-100 my-6"></div>

            <div className="group">
              <h2 className={`text-2xl font-bold text-[#5B4A3B] mb-4 flex items-center gap-4 ${fredoka.className}`}>
                <span className="w-12 h-12 bg-[#d43893ff] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-pink-200 group-hover:scale-110 transition-transform duration-300">
                  <Shield size={22} />
                </span>
                Kendali Privasi Anda
              </h2>
              <p className="leading-loose pl-0 lg:pl-16 text-gray-600">
                Anda memiliki hak penuh atas data Anda. Jika Anda ingin mengubah informasi akun, menghapus data, atau berhenti berlangganan newsletter kami, Anda dapat melakukannya kapan saja melalui pengaturan akun atau menghubungi tim kami.
              </p>
            </div>
          </div>

          {/* Contact Box */}
          <div className="mt-16 bg-gradient-to-r from-[#d43893ff] to-[#a0226d] rounded-[2.5rem] p-10 md:p-14 text-center text-white shadow-2xl shadow-pink-200 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className={`text-3xl font-bold mb-4 ${fredoka.className}`}>Butuh Bantuan Lebih Lanjut?</h2>
              <p className="mb-8 text-white/90 max-w-lg mx-auto leading-relaxed">
                Tim Difaraja siap membantu menjawab pertanyaan Anda seputar privasi data dan keamanan berbelanja.
              </p>
              <a
                href="mailto:admin@difaraja.id"
                className="inline-flex items-center gap-3 bg-white text-[#d43893ff] px-8 py-4 rounded-full font-bold hover:bg-pink-50 transition-all transform hover:scale-105 shadow-lg"
              >
                <Mail className="w-5 h-5" />
                admin@difaraja.id
              </a>
            </div>

            {/* Decorative Circle */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          </div>
        </div>
      </section>

      {/* Back to Home Text */}
      <div className="text-center pb-16">
        <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-[#d43893ff] font-bold hover:text-[#a0226d] transition-colors bg-pink-50 px-6 py-3 rounded-full"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}