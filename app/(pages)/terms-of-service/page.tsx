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
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa"; // Pastikan install react-icons jika belum
import Link from "next/link";

export default function TermsOfServicePage() {
  const lastUpdated = "27 November 2025";
  const waNumber = "628176942128"; // Nomor dari footer
  const emailAddress = "hello@colore.co.id"; // Email dari footer

  return (
    <div className="min-h-screen bg-white text-gray-600 font-sans">
      {/* ================= Header Section ================= */}
      <section className="relative bg-[#A3B18A] text-white pt-32 pb-16 px-6 lg:px-12 overflow-hidden rounded-b-[3rem]">
        {/* Abstract Background Patterns */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-900 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
        </div>

        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center p-3 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 shadow-lg">
            <Scale className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Harap baca syarat dan ketentuan ini dengan saksama sebelum
            menggunakan layanan kami.
          </p>
          <p className="mt-4 text-sm bg-white/10 inline-block px-4 py-1 rounded-full">
            Terakhir diperbarui: {lastUpdated}
          </p>
        </div>
      </section>

      {/* ================= Content Section ================= */}
      <section className="px-6 lg:px-12 py-12">
        <div className="container mx-auto max-w-4xl">
          {/* Introduction */}
          <div className="prose prose-lg max-w-none text-gray-600 mb-12">
            <p>
              {`Selamat datang di COLORE. Syarat dan Ketentuan ini ("Ketentuan")
              mengatur penggunaan Anda atas situs web kami dan pembelian produk
              dari COLORE. Dengan mengakses atau menggunakan layanan kami, Anda
              setuju untuk terikat oleh Ketentuan ini. Jika Anda tidak setuju
              dengan bagian mana pun dari ketentuan ini, Anda tidak
              diperkenankan menggunakan layanan kami.`}
            </p>
          </div>

          <div className="space-y-6">
            {/* 1. Account */}
            <div className="bg-gray-50 rounded-3xl p-6 md:p-8 border border-gray-100 hover:border-[#A3B18A]/50 transition-colors group">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#A3B18A]/10 rounded-xl flex items-center justify-center flex-shrink-0 text-[#A3B18A] group-hover:bg-[#A3B18A] group-hover:text-white transition-colors">
                  <UserCheck size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    1. Akun Pengguna
                  </h3>
                  <p className="text-sm leading-relaxed">
                    Saat Anda membuat akun di COLORE, Anda harus memberikan
                    informasi yang akurat, lengkap, dan terkini. Kegagalan untuk
                    melakukannya merupakan pelanggaran terhadap Syarat, yang
                    dapat mengakibatkan penghentian segera akun Anda. Anda
                    bertanggung jawab untuk menjaga kerahasiaan kata sandi dan
                    akun Anda.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Products & Purchases */}
            <div className="bg-gray-50 rounded-3xl p-6 md:p-8 border border-gray-100 hover:border-[#A3B18A]/50 transition-colors group">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#A3B18A]/10 rounded-xl flex items-center justify-center flex-shrink-0 text-[#A3B18A] group-hover:bg-[#A3B18A] group-hover:text-white transition-colors">
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    2. Produk & Pembelian
                  </h3>
                  <ul className="list-disc list-inside text-sm space-y-2 ml-1">
                    <li>
                      Kami berhak menolak pesanan apa pun yang Anda buat pada
                      kami.
                    </li>
                    <li>
                      Harga produk dapat berubah sewaktu-waktu tanpa
                      pemberitahuan.
                    </li>
                    <li>
                      Kami berusaha menampilkan warna dan gambar produk kami
                      seakurat mungkin, namun kami tidak dapat menjamin tampilan
                      monitor komputer Anda akan akurat.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 3. Intellectual Property */}
            <div className="bg-gray-50 rounded-3xl p-6 md:p-8 border border-gray-100 hover:border-[#A3B18A]/50 transition-colors group">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#A3B18A]/10 rounded-xl flex items-center justify-center flex-shrink-0 text-[#A3B18A] group-hover:bg-[#A3B18A] group-hover:text-white transition-colors">
                  <Copyright size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    3. Hak Kekayaan Intelektual
                  </h3>
                  <p className="text-sm leading-relaxed">
                    Layanan dan konten aslinya (tidak termasuk Konten yang
                    disediakan oleh pengguna), fitur, dan fungsionalitas adalah
                    dan akan tetap menjadi milik eksklusif COLORE dan pemberi
                    lisensinya. Layanan ini dilindungi oleh hak cipta, merek
                    dagang, dan hukum lainnya.
                  </p>
                </div>
              </div>
            </div>

            {/* 4. Limitation of Liability */}
            <div className="bg-gray-50 rounded-3xl p-6 md:p-8 border border-gray-100 hover:border-[#A3B18A]/50 transition-colors group">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#A3B18A]/10 rounded-xl flex items-center justify-center flex-shrink-0 text-[#A3B18A] group-hover:bg-[#A3B18A] group-hover:text-white transition-colors">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    4. Batasan Tanggung Jawab
                  </h3>
                  <p className="text-sm leading-relaxed">
                    Dalam keadaan apa pun COLORE, direktur, karyawan, mitra,
                    agen, pemasok, atau afiliasinya tidak bertanggung jawab atas
                    segala kerugian tidak langsung, insidental, khusus,
                    konsekuensial, atau hukuman, termasuk namun tidak terbatas
                    pada, hilangnya keuntungan, data, penggunaan, niat baik,
                    atau kerugian tidak berwujud lainnya.
                  </p>
                </div>
              </div>
            </div>

            {/* 5. Governing Law */}
            <div className="bg-gray-50 rounded-3xl p-6 md:p-8 border border-gray-100 hover:border-[#A3B18A]/50 transition-colors group">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#A3B18A]/10 rounded-xl flex items-center justify-center flex-shrink-0 text-[#A3B18A] group-hover:bg-[#A3B18A] group-hover:text-white transition-colors">
                  <Gavel size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    5. Hukum yang Berlaku
                  </h3>
                  <p className="text-sm leading-relaxed">
                    Ketentuan ini akan diatur dan ditafsirkan sesuai dengan
                    hukum Negara Republik Indonesia, tanpa memperhatikan
                    pertentangan ketentuan hukumnya.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section (Updated) */}
          <div className="mt-12 text-center bg-[#A3B18A]/5 rounded-3xl p-10 border border-[#A3B18A]/20">
            <div className="w-12 h-12 bg-[#A3B18A] rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg">
              <HelpCircle size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Hubungi Kami
            </h2>
            <p className="text-gray-600 mb-6">
              Jika Anda memiliki pertanyaan tentang Syarat dan Ketentuan ini,
              silakan hubungi kami.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href={`https://wa.me/${waNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-xl font-semibold hover:bg-[#20bd5a] transition-colors shadow-sm"
              >
                <FaWhatsapp size={20} />
                WhatsApp Kami
              </a>
              <a
                href={`mailto:${emailAddress}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-[#A3B18A] text-[#A3B18A] rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-sm"
              >
                <Mail size={20} />
                {emailAddress}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Navigation */}
      <div className="text-center pb-12">
        <Link href="/" className="text-[#A3B18A] font-semibold hover:underline">
          &larr; Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}