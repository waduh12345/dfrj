"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";

export default function Footer() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Apa itu Koperasi Merah Putih?",
      answer:
        "Koperasi Merah Putih adalah koperasi digital yang bertujuan membangun ekonomi kerakyatan melalui transparansi dan gotong royong.",
    },
    {
      question: "Bagaimana cara menjadi anggota?",
      answer:
        "Anda dapat mengisi formulir pendaftaran melalui halaman Join dan mengikuti proses verifikasi dari pengurus koperasi.",
    },
    {
      question: "Apakah semua orang bisa bergabung?",
      answer:
        "Ya, siapa saja bisa menjadi anggota asalkan memenuhi syarat dan ketentuan koperasi.",
    },
  ];

  return (
    <footer className="bg-[#1D1D1D] text-neutral-300 pt-16 pb-8 px-6 md:px-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Company Info */}
        <div>
          <h3 className="text-white text-xl font-semibold mb-4">
            Koperasi Merah Putih
          </h3>
          <p className="text-sm leading-relaxed">
            Bersama membangun masa depan ekonomi kerakyatan berbasis digital
            yang modern, adil, dan terpercaya.
          </p>
          <p className="mt-4 text-sm">
            📍 Jl. Kemerdekaan No. 17, Jakarta, Indonesia
          </p>
          <p className="text-sm">📞 (021) 123-4567</p>
          <p className="text-sm">✉️ info@koperasimerahputih.id</p>

          {/* Sosial Media */}
          <div className="mt-6 flex gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#A80038] transition"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#A80038] transition"
            >
              <FaFacebookF size={20} />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#A80038] transition"
            >
              <FaYoutube size={20} />
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-white text-xl font-semibold mb-4">Navigasi</h3>
          <ul className="flex space-x-2 text-sm">
            <li>
              <a href="#" className="hover:text-white transition">
                Beranda
              </a>
            </li>
            <li>
              <a href="#produk" className="hover:text-white transition">
                Produk
              </a>
            </li>
            <li>
              <a href="#tentang" className="hover:text-white transition">
                Tentang Kami
              </a>
            </li>
            <li>
              <a href="#join" className="hover:text-white transition">
                Gabung
              </a>
            </li>
            <li>
              <a href="#faq" className="hover:text-white transition">
                FAQ
              </a>
            </li>
          </ul>
        </div>

        {/* FAQ */}
        <div id="faq">
          <h3 className="text-white text-xl font-semibold mb-4">FAQ</h3>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-[#2a2a2a] rounded-md px-4 py-3">
                <button
                  className="w-full flex justify-between items-center text-left text-sm font-medium text-white"
                  onClick={() => setActiveIndex(activeIndex === i ? null : i)}
                >
                  <span>{faq.question}</span>
                  {activeIndex === i ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {activeIndex === i && (
                  <p className="mt-2 text-sm text-neutral-300">{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 text-center text-xs text-neutral-400 border-t border-neutral-700 pt-6">
        © {new Date().getFullYear()} Koperasi Merah Putih. Semua hak dilindungi.
      </div>
    </footer>
  );
}
