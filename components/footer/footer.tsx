"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useTranslation } from "@/hooks/use-translation";
import id from "@/translations/footer/id";
import en from "@/translations/footer/en";
import {
  ChevronDown,
  ChevronUp,
  Mail,
  Heart,
  Shield,
  ArrowRight,
  MapPin,
  Phone,
} from "lucide-react";
import { FaInstagram, FaFacebookF, FaWhatsapp, FaTiktok } from "react-icons/fa";
import Image from "next/image";
import { IconBrandWhatsapp } from "@tabler/icons-react";

import { useGetProductCategoryListQuery } from "@/services/public/product-category.service";
import type { ProductCategory } from "@/types/master/product-category";

// Brand Color Constant
const BRAND_COLOR = "#d43893ff";

export default function Footer() {
  const router = useRouter();
  const t = useTranslation({ id, en });
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Fetch categories from API
  const {
    data: categoriesResponse,
    isLoading,
    isError,
  } = useGetProductCategoryListQuery({ page: 1, paginate: 100 });

  // Map API response to link items
  const productCategories = useMemo(() => {
    const list: ProductCategory[] = categoriesResponse?.data ?? [];
    return list.map((cat) => {
      const name = cat.name ?? "Unknown";
      const href = `/product?category=${encodeURIComponent(name)}`;
      return { name, href };
    });
  }, [categoriesResponse]);

  const goTofaqPage = () => {
    router.push("/faq");
  };

  // FAQ Disesuaikan dengan Difaraja (Kuliner, Kriya, Fashion)
  const faqs = [
    {
      question: "Apa itu DIFARAJA?",
      answer:
        "DIFARAJA (Difabelpreneur Raden Wijaya) adalah wadah pemberdayaan ekonomi bagi penyandang disabilitas untuk menghasilkan karya mandiri berupa Kuliner, Kriya, dan Fashion yang berkualitas.",
    },
    {
      question: "Apakah produk makanan aman dikirim ke luar kota?",
      answer:
        "Tentu! Untuk produk kuliner kering, kami menggunakan packing aman (bubble wrap & kardus). Untuk makanan basah/frozen, kami menyarankan pengiriman Instant, Sameday, atau Paxel.",
    },
    {
      question: "Bisakah memesan hampers atau souvenir custom?",
      answer:
        "Sangat bisa. Kami melayani pemesanan dalam jumlah besar (bulk order) untuk souvenir pernikahan, seminar, atau hampers lebaran dengan kustomisasi produk kriya dan kuliner.",
    },
  ];

  const quickLinks = [
    { name: t["col-2-b"], href: "/" }, // Beranda
    { name: t["col-2-c"], href: "/about" }, // Tentang Kami
    { name: t["col-2-g"], href: "/how-to-order" }, // Cara Pesan
    { name: t["col-2-d"], href: "/product" }, // Produk
    { name: t["col-2-h"], href: "/lacak-pesanan" }, // Lacak Pesanan
    { name: t["col-2-f"], href: "/news" }, // Berita/Artikel
    { name: t["col-2-e"], href: "/gallery" }, // Galeri
  ];

  return (
    <footer className="bg-gradient-to-br from-[#d43893ff] to-[#a0226d] text-white relative overflow-hidden">
      {/* Background Pattern (Updated Colors for Pink Theme) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-48 h-48 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-yellow-300 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-purple-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-pink-300 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 bg-black/10 backdrop-blur-[2px]">
        {/* Main Footer Content */}
        <div className="pt-20 pb-12 px-6 lg:px-12">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              {/* Company Info */}
              <div className="lg:col-span-1">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-xl">
                    <Image
                      src="/logo-difaraja-only.webp"
                      alt="Logo Difaraja"
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white tracking-wide">
                      DIFARAJA
                    </h3>
                    <p className="text-xs text-pink-100 uppercase tracking-wider font-semibold">
                      Difabelpreneur Raden Wijaya
                    </p>
                  </div>
                </div>

                <p className="text-white/90 leading-relaxed mb-8 text-sm">
                  Membangun kemandirian ekonomi dan inklusivitas melalui karya
                  otentik. Setiap produk Kuliner dan Kriya yang Anda beli adalah
                  dukungan nyata bagi semangat juang difabelpreneur Indonesia.
                </p>

                {/* Contact Info */}
                <div className="space-y-4 text-sm font-medium">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <IconBrandWhatsapp className="w-4 h-4 text-white" />
                    </div>
                    <span>+62 817-1111-222</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    <span>admin@difaraja.id</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <span>
                      Jl. Raden Wijaya No. 12,
                      <br />
                      Mojokerto, Jawa Timur
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-lg font-bold mb-6 text-white border-b border-white/20 pb-2 inline-block">
                  {t["col-2-a"]}
                </h4>
                <ul className="space-y-3">
                  {quickLinks.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className="text-white/80 hover:text-white transition-all flex items-center group"
                      >
                        <ArrowRight className="w-3 h-3 mr-2 text-pink-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="group-hover:translate-x-1 transition-transform">
                          {link.name}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Product Categories (from API) */}
              <div>
                <h4 className="text-lg font-bold mb-6 text-white border-b border-white/20 pb-2 inline-block">
                  Kategori Karya
                </h4>

                {isLoading ? (
                  <p className="text-white/80 text-sm">Memuat kategori...</p>
                ) : isError ? (
                  <p className="text-white/80 text-sm">
                    Gagal memuat kategori.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {productCategories.length === 0 ? (
                      <li className="text-white/80 text-sm">
                        Belum ada kategori.
                      </li>
                    ) : (
                      productCategories.slice(0, 6).map((category, index) => (
                        <li key={index}>
                          <a
                            href={category.href}
                            className="text-white/80 hover:text-white transition-all flex items-center group"
                          >
                            <ArrowRight className="w-3 h-3 mr-2 text-pink-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="group-hover:translate-x-1 transition-transform">
                              {category.name}
                            </span>
                          </a>
                        </li>
                      ))
                    )}
                  </ul>
                )}
              </div>

              {/* FAQ */}
              <div>
                <h4 className="text-lg font-bold mb-6 text-white border-b border-white/20 pb-2 inline-block">
                  Pertanyaan Umum
                </h4>
                <div className="space-y-3 mb-6">
                  {faqs.map((faq, i) => (
                    <div
                      key={i}
                      className="bg-white/10 rounded-xl overflow-hidden border border-white/5 transition-colors hover:bg-white/20"
                    >
                      <button
                        className="w-full flex justify-between items-start text-left p-4 text-white"
                        onClick={() =>
                          setActiveIndex(activeIndex === i ? null : i)
                        }
                      >
                        <span className="font-semibold text-sm pr-2 leading-snug">
                          {faq.question}
                        </span>
                        <div className="flex-shrink-0 mt-0.5">
                          {activeIndex === i ? (
                            <ChevronUp className="w-4 h-4 text-pink-200" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-pink-200" />
                          )}
                        </div>
                      </button>
                      {activeIndex === i && (
                        <div className="px-4 pb-4 pt-0">
                          <p className="text-sm text-white/90 leading-relaxed border-t border-white/10 pt-3">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={goTofaqPage}
                  type="button"
                  className="w-full bg-white text-[#d43893ff] py-3.5 rounded-xl font-bold hover:bg-pink-50 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  Lihat Semua FAQ
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media & Bottom Bar */}
        <div className="border-t border-white/20 bg-black/20 backdrop-blur-md">
          <div className="container mx-auto px-6 lg:px-12 py-8">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
              {/* Social Media */}
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <p className="text-white text-sm font-medium tracking-wide">
                  Ikuti Keseruan Kami:
                </p>
                <div className="flex gap-3">
                  <a
                    href="https://www.instagram.com/difaraja/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-pink-600 transition-all shadow-md hover:scale-110"
                    aria-label="Instagram"
                  >
                    <FaInstagram size={20} />
                  </a>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-blue-600 transition-all shadow-md hover:scale-110"
                    aria-label="Facebook"
                  >
                    <FaFacebookF size={18} />
                  </a>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all shadow-md hover:scale-110"
                    aria-label="TikTok"
                  >
                    <FaTiktok size={18} />
                  </a>
                  <a
                    href="https://wa.me/62811223213"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-green-500 transition-all shadow-md hover:scale-110"
                    aria-label="WhatsApp"
                  >
                    <FaWhatsapp size={20} />
                  </a>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-6 text-sm text-white/90 font-medium">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-pink-200" />
                  <span>Jaminan Aman</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-pink-200" />
                  <span>Dibuat Sepenuh Hati</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="bg-white border-t border-white/20">
          <div className="container mx-auto px-6 lg:px-12 py-5">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs lg:text-sm text-gray-500">
              <div className="flex items-center gap-4">
                <p>
                  © {new Date().getFullYear()} <strong>Difaraja</strong>.
                  Difabelpreneur Raden Wijaya. All rights reserved.
                </p>
              </div>
              <div className="flex gap-6 font-medium">
                <a
                  href="/privacy-policy"
                  className="hover:text-[#d43893ff] transition-colors"
                >
                  Kebijakan Privasi
                </a>
                <a
                  href="/terms-of-service"
                  className="hover:text-[#d43893ff] transition-colors"
                >
                  Syarat & Ketentuan
                </a>
                <a
                  href="/sitemap"
                  className="hover:text-[#d43893ff] transition-colors"
                >
                  Peta Situs
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}