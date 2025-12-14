"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Map,
  Home,
  Box,
  Image as ImageIcon,
  Newspaper,
  ShoppingCart,
  Shield,
  FileText,
  Mail,
  ArrowUpRight,
  Compass,
  Utensils,
} from "lucide-react";
import { FaInstagram, FaFacebookF, FaWhatsapp, FaTiktok } from "react-icons/fa";
import { fredoka, sniglet } from "@/lib/fonts";

// Service & Types
import { useGetProductCategoryListQuery } from "@/services/public/product-category.service";
import type { ProductCategory } from "@/types/master/product-category";

export default function SitemapPage() {
  // === 1. Fetch Categories ===
  const {
    data: categoriesResponse,
    isLoading,
    isError,
  } = useGetProductCategoryListQuery({ page: 1, paginate: 100 });

  const productCategories = useMemo(() => {
    const list: ProductCategory[] = categoriesResponse?.data ?? [];
    return list.map((cat) => {
      const name = cat.name ?? "Unknown";
      const href = `/product?category=${encodeURIComponent(name)}`;
      return { name, href };
    });
  }, [categoriesResponse]);

  // === 2. Static Data ===
  const mainLinks = [
    { name: "Beranda", href: "/", icon: Home },
    { name: "Tentang Kami", href: "/about", icon: Compass },
    { name: "Karya (Produk)", href: "/product", icon: Box },
    { name: "Galeri Kegiatan", href: "/gallery", icon: ImageIcon },
    { name: "Artikel & Berita", href: "/news", icon: Newspaper },
    { name: "Cara Pemesanan", href: "/how-to-order", icon: ShoppingCart },
  ];

  const legalLinks = [
    { name: "Kebijakan Privasi", href: "/privacy-policy", icon: Shield },
    { name: "Syarat & Ketentuan", href: "/terms-of-service", icon: FileText },
  ];

  // Updated Social Links for Difaraja
  const socialLinks = [
    {
      icon: FaInstagram,
      href: "https://www.instagram.com/difaraja/", // Ganti dengan link Difaraja jika ada
      color: "hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-red-500 hover:to-purple-500",
      text: "IG",
    },
    {
      icon: FaFacebookF,
      href: "#",
      color: "hover:bg-blue-600",
      text: "FB",
    },
    {
      icon: FaTiktok,
      href: "#",
      color: "hover:bg-black",
      text: "TT",
    },
    {
      icon: FaWhatsapp,
      href: "https://wa.me/628176942128",
      color: "hover:bg-green-500",
      text: "WA",
    },
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-b from-white to-[#FFF0F5] text-gray-700 font-sans selection:bg-[#d43893ff] selection:text-white relative overflow-hidden ${sniglet.className}`}>
      {/* === Decorative Background Elements === */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#d43893ff]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-yellow-200/20 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4"></div>
      </div>

      {/* === Header Section === */}
      <section className="pt-28 pb-12 px-6 lg:px-12 text-center relative z-10">
        <div className="inline-flex items-center justify-center p-4 bg-white rounded-[2rem] shadow-lg shadow-pink-100 mb-6 text-[#d43893ff] ring-1 ring-[#d43893ff]/20">
          <Map className="w-8 h-8" />
        </div>
        <h1 className={`text-4xl lg:text-6xl font-bold text-[#5B4A3B] mb-6 tracking-tight ${fredoka.className}`}>
          Peta Situs
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
          Navigasi lengkap untuk menjelajahi ekosistem pemberdayaan{" "}
          <span className="text-[#d43893ff] font-bold">DIFARAJA</span>.
        </p>
      </section>

      {/* === Main Grid Content (Bento Grid Layout) === */}
      <section className="px-6 lg:px-12 pb-24 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
            {/* 1. Brand Card (Large) */}
            <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-xl shadow-pink-100/50 border border-pink-50 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
              <div>
                <div className="flex items-center gap-4 mb-8">
                  {/* Logo Placeholder */}
                  <div className="w-12 h-12 bg-[#d43893ff] rounded-xl flex items-center justify-center text-white font-bold text-xl">
                    D
                  </div>
                  <span className={`text-2xl font-bold text-[#5B4A3B] ${fredoka.className}`}>DIFARAJA</span>
                </div>
                <h2 className={`text-2xl font-bold text-[#5B4A3B] mb-4 ${fredoka.className}`}>
                  Karya & Kemandirian
                </h2>
                <p className="text-gray-500 leading-relaxed mb-8 max-w-md">
                  Wadah kewirausahaan sosial yang menghadirkan produk kuliner otentik, kriya handmade, dan fashion berkualitas karya difabelpreneur Indonesia.
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-[#d43893ff] uppercase tracking-wider mb-4">
                  Terhubung Bersama Kami
                </p>
                <div className="flex gap-3 flex-wrap">
                  {socialLinks.map((Social, idx) => (
                    <a
                      key={idx}
                      href={Social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-12 h-12 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 transition-all duration-300 text-xl ${Social.color} hover:text-white hover:shadow-lg hover:scale-110`}
                      aria-label={Social.text}
                    >
                      <Social.icon />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Navigation Card (Vertical List) */}
            <div className="bg-gradient-to-br from-[#d43893ff] to-[#b02e7a] text-white rounded-[2.5rem] p-8 lg:p-10 shadow-xl shadow-pink-200 lg:row-span-2 flex flex-col relative overflow-hidden group">
              {/* Pattern Overlay */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-colors duration-500"></div>

              <h3 className={`text-2xl font-bold mb-8 flex items-center gap-3 relative z-10 ${fredoka.className}`}>
                <Compass className="w-6 h-6" />
                Menu Utama
              </h3>
              <ul className="space-y-3 flex-1 relative z-10">
                {mainLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group/item flex items-center justify-between p-4 rounded-2xl bg-white/10 hover:bg-white border border-transparent hover:border-white/20 hover:text-[#d43893ff] transition-all duration-300 backdrop-blur-sm"
                    >
                      <div className="flex items-center gap-4">
                        <link.icon className="w-5 h-5 opacity-80 group-hover/item:opacity-100" />
                        <span className="font-bold">{link.name}</span>
                      </div>
                      <ArrowUpRight className="w-4 h-4 opacity-50 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-300" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Contact Info Card */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-pink-100/50 border border-pink-50 hover:-translate-y-1 transition-transform duration-300">
              <h3 className={`text-xl font-bold text-[#5B4A3B] mb-6 flex items-center gap-2 ${fredoka.className}`}>
                <span className="w-2 h-8 bg-[#d43893ff] rounded-full"></span>
                Hubungi Admin
              </h3>
              <div className="space-y-5">
                <a
                  href="https://wa.me/628176942128"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-green-50 hover:bg-green-100 border border-green-100 transition-colors group"
                >
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-green-500 shadow-sm group-hover:scale-110 transition-transform">
                    <FaWhatsapp size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-green-600/70 font-bold uppercase tracking-wide">
                      WhatsApp
                    </p>
                    <p className="font-bold text-[#5B4A3B] text-sm">
                      +62 817-6942-128
                    </p>
                  </div>
                </a>
                <a
                  href="mailto:admin@difaraja.id"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-pink-50 hover:bg-pink-100 border border-pink-100 transition-colors group"
                >
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#d43893ff] shadow-sm group-hover:scale-110 transition-transform">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-pink-600/70 font-bold uppercase tracking-wide">
                      Email
                    </p>
                    <p className="font-bold text-[#5B4A3B] text-sm">
                      admin@difaraja.id
                    </p>
                  </div>
                </a>
              </div>
            </div>

            {/* 4. Products Categories (Wide Card) */}
            <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-xl shadow-pink-100/50 border border-pink-50 relative overflow-hidden hover:-translate-y-1 transition-transform duration-300 group">
              {/* Background Decor */}
              <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-500 pointer-events-none text-[#d43893ff]">
                <Utensils size={140} />
              </div>

              <h3 className={`text-xl font-bold text-[#5B4A3B] mb-6 flex items-center gap-3 ${fredoka.className}`}>
                <span className="p-2 bg-[#d43893ff]/10 text-[#d43893ff] rounded-xl">
                  <Box className="w-6 h-6" />
                </span>
                Kategori Karya
              </h3>

              {isLoading ? (
                <div className="flex gap-3 flex-wrap">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="h-10 w-24 bg-gray-100 rounded-full animate-pulse"
                    ></div>
                  ))}
                </div>
              ) : isError ? (
                <p className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-xl inline-block">
                  Gagal memuat kategori.
                </p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {productCategories.length === 0 ? (
                    <p className="text-gray-400 italic">
                      Belum ada kategori tersedia.
                    </p>
                  ) : (
                    productCategories.map((cat, idx) => (
                      <Link
                        key={idx}
                        href={cat.href}
                        className="group/tag relative px-6 py-3 rounded-full bg-pink-50 border border-pink-100 hover:border-[#d43893ff] hover:bg-[#d43893ff] transition-all duration-300 overflow-hidden"
                      >
                        <span className="relative z-10 text-sm font-bold text-[#5B4A3B]/80 group-hover/tag:text-white transition-colors">
                          {cat.name}
                        </span>
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* 5. Legal & Extra */}
            <div className="bg-[#2a221b] text-gray-300 rounded-[2.5rem] p-8 shadow-xl flex flex-col justify-center relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#d43893ff]/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2 group-hover:bg-[#d43893ff]/20 transition-colors"></div>

              <h3 className={`text-white font-bold mb-6 text-lg tracking-wide border-b border-gray-700 pb-2 ${fredoka.className}`}>
                Legalitas
              </h3>
              <ul className="space-y-2 relative z-10">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 hover:text-white transition-all duration-200"
                    >
                      <span className="p-1.5 bg-white/5 rounded-lg text-gray-400">
                        <link.icon className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-sm font-medium">{link.name}</span>
                    </Link>
                  </li>
                ))}
                <li className="pt-2 mt-2 border-t border-gray-700">
                  <Link
                    href="/faq"
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 hover:text-white transition-all duration-200"
                  >
                    <span className="w-7 h-7 flex items-center justify-center font-bold text-xs bg-white/5 text-gray-400 rounded-lg">
                      ?
                    </span>
                    <span className="text-sm font-medium">Bantuan & FAQ</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer of Sitemap */}
          <div className="mt-16 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[#5B4A3B]/60 font-bold hover:text-[#d43893ff] transition-colors group px-6 py-3 rounded-full hover:bg-white"
            >
              Kembali ke Beranda
              <span className="bg-pink-100 p-1 rounded-full group-hover:bg-[#d43893ff] group-hover:text-white transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}