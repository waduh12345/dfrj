"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { Menu, X, ShoppingCart, User, Globe } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import useCart from "@/hooks/use-cart"; // ← pakai zustand store

interface TranslationContent {
  home: string;
  about: string;
  products: string;
  gallery: string;
  news: string;
  howToOrder: string;
  tagline: string;
  switchLanguage: string;
}

interface Translations {
  id: TranslationContent;
  en: TranslationContent;
}

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<"id" | "en">("id");
  const [isScrolled, setIsScrolled] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  // ===== ambil keranjang langsung dari zustand (persisted ke localStorage)
  const cartItems = useCart((s) => s.cartItems);
  const cartCount = useMemo(
    () => cartItems.reduce((t, item) => t + item.quantity, 0),
    [cartItems]
  );

  const translations: Translations = {
    id: {
      home: "Beranda",
      about: "Tentang Kami",
      products: "Produk",
      gallery: "Galeri",
      news: "Berita",
      howToOrder: "Cara Pemesanan",
      tagline: "Art & Crafts Ramah Lingkungan untuk Anak",
      switchLanguage: "Ganti ke English",
    },
    en: {
      home: "Home",
      about: "About Us",
      products: "Products",
      gallery: "Gallery",
      news: "News",
      howToOrder: "How to Order",
      tagline: "Eco-Friendly Art & Crafts for Kids",
      switchLanguage: "Switch to Bahasa",
    },
  };

  const t = translations[language];

  const menuItems = [
    { name: t.home, href: "/" },
    { name: t.about, href: "/about" },
    { name: t.products, href: "/product" },
    { name: t.gallery, href: "/gallery" },
    { name: t.news, href: "/news" },
    { name: t.howToOrder, href: "/how-to-order" },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("colore-language");
      if (savedLanguage === "id" || savedLanguage === "en") {
        setLanguage(savedLanguage);
      }
    }
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen((v) => !v);

  const toggleLanguage = () => {
    const newLang = language === "id" ? "en" : "id";
    setLanguage(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("colore-language", newLang);
      window.dispatchEvent(
        new CustomEvent("languageChanged", { detail: newLang })
      );
    }
  };

  const handleCartClick = () => {
    window.location.assign("/cart");
    window.dispatchEvent(new CustomEvent("openCart"));
  };

  const handleUserClick = () => {
    if (status === "loading") return;
    if (session?.user) {
      router.push("/me");
    } else {
      router.push("/login"); // ganti ke "/auth/login" jika halaman login Anda di sana
    }
  };

  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-lg shadow-2xl border-b border-emerald-100"
            : "bg-white/90 backdrop-blur-sm shadow-lg"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                  <span className="text-white font-bold text-xl">C</span>
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent group-hover:from-emerald-700 group-hover:to-teal-700 transition-all duration-300">
                  COLORE
                </h1>
                <p className="text-xs text-gray-600 font-medium leading-tight">
                  {t.tagline}
                </p>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-8">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative font-semibold transition-all duration-300 py-2 px-3 group rounded-xl ${
                    isActiveLink(item.href)
                      ? "text-emerald-600 bg-gradient-to-r from-emerald-50 to-teal-50"
                      : "text-gray-700 hover:text-emerald-600 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50"
                  }`}
                >
                  {item.name}
                  <span
                    className={`absolute bottom-1 left-0 h-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full transition-all duration-300 ${
                      isActiveLink(item.href)
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              {/* Language Toggle - Desktop */}
              <button
                onClick={toggleLanguage}
                className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-100 to-teal-100 hover:from-emerald-200 hover:to-teal-200 transition-all duration-300 group shadow-md hover:shadow-lg"
                title={t.switchLanguage}
              >
                <Globe className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold text-emerald-600">
                  {language.toUpperCase()}
                </span>
              </button>

              {/* User Icon */}
              <button
                onClick={handleUserClick}
                className="p-3 rounded-xl hover:bg-gradient-to-r hover:from-emerald-100 hover:to-teal-100 transition-all duration-300 group shadow-sm hover:shadow-md"
                aria-label="User"
              >
                <User className="w-5 h-5 text-gray-700 group-hover:text-emerald-600 transition-colors" />
              </button>

              {/* Cart */}
              <button
                onClick={handleCartClick}
                className="relative p-3 cursor-pointer rounded-xl hover:bg-gradient-to-r hover:from-emerald-100 hover:to-teal-100 transition-all duration-300 group shadow-sm hover:shadow-md"
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5 text-gray-700 group-hover:text-emerald-600 transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold min-w-[20px] h-[20px] rounded-full flex items-center justify-center border-2 border-white shadow-lg animate-pulse">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-3 rounded-xl border-2 border-emerald-600/30 hover:bg-gradient-to-r hover:from-emerald-100 hover:to-teal-100 transition-all duration-300 shadow-md hover:shadow-lg"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Menu className="w-5 h-5 text-emerald-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-all duration-300 ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={toggleMobileMenu}
      >
        <div
          className={`fixed top-0 right-0 w-[85%] max-w-sm h-full bg-white shadow-2xl transform transition-transform duration-300 ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile Header */}
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-emerald-400/30 to-cyan-400/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold">C</span>
                </div>
                <div>
                  <h2 className="font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    COLORE
                  </h2>
                  <p className="text-xs text-gray-600">{t.tagline}</p>
                </div>
              </div>
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-lg hover:bg-white/50 transition-colors"
                aria-label="Close mobile menu"
              >
                <X className="w-5 h-5 text-emerald-600" />
              </button>
            </div>
          </div>

          {/* Mobile Menu Items */}
          <div className="p-6 space-y-2 flex-1 overflow-y-auto">
            {menuItems.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={toggleMobileMenu}
                className={`flex items-center gap-4 p-4 rounded-2xl font-semibold transition-all duration-300 group ${
                  isActiveLink(item.href)
                    ? "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-600 border-2 border-emerald-200 shadow-md"
                    : "text-gray-700 hover:text-emerald-600 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:shadow-sm"
                }`}
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: isMobileMenuOpen
                    ? "slideInRight 0.3s ease-out forwards"
                    : "none",
                }}
              >
                <div
                  className={`w-3 h-3 rounded-full transition-all duration-300 shadow-sm ${
                    isActiveLink(item.href)
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600"
                      : "bg-gray-300 group-hover:bg-gradient-to-r group-hover:from-emerald-600 group-hover:to-teal-600"
                  }`}
                />
                <span className="flex-1">{item.name}</span>
                {isActiveLink(item.href) && (
                  <div className="w-1 h-6 bg-gradient-to-b from-emerald-600 to-teal-600 rounded-full shadow-sm" />
                )}
              </Link>
            ))}

            {/* Language Toggle - Mobile */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-4 p-4 w-full rounded-2xl text-gray-700 hover:text-emerald-600 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 font-semibold transition-all duration-300 mt-6 border-2 border-emerald-200 bg-gradient-to-r from-emerald-100 to-teal-100"
            >
              <Globe className="w-5 h-5 text-emerald-600" />
              <span className="flex-1 text-left">{t.switchLanguage}</span>
              <span className="text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 px-3 py-1 rounded-lg shadow-md">
                {language === "id" ? "EN" : "ID"}
              </span>
            </button>
          </div>

          {/* Mobile Footer */}
          <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50">
            <div className="flex items-center justify-center gap-4">
              <button className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-2xl font-bold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                Belanja Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}