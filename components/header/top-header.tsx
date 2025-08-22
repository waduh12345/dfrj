"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ShoppingCart, User, Heart, Globe } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

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
  const [cartCount, setCartCount] = useState(0);
  
  const pathname = usePathname();

  // Konfigurasi teks untuk setiap bahasa
  const translations: Translations = {
    id: {
      home: "Beranda",
      about: "Tentang Kami",
      products: "Produk",
      gallery: "Galeri",
      news: "Berita",
      howToOrder: "Cara Pemesanan",
      tagline: "Art & Crafts Ramah Lingkungan untuk Anak",
      switchLanguage: "Ganti ke English"
    },
    en: {
      home: "Home",
      about: "About Us",
      products: "Products",
      gallery: "Gallery",
      news: "News",
      howToOrder: "How to Order",
      tagline: "Eco-Friendly Art & Crafts for Kids",
      switchLanguage: "Switch to Bahasa"
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

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle mobile menu body scroll
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Load language preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("colore-language");
      if (savedLanguage === "id" || savedLanguage === "en") {
        setLanguage(savedLanguage);
      }
    }
  }, []);

  // Get cart count from localStorage (simple implementation)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateCartCount = () => {
        const cart = localStorage.getItem("colore-cart");
        if (cart) {
          try {
            const cartItems = JSON.parse(cart);
            setCartCount(Array.isArray(cartItems) ? cartItems.length : 0);
          } catch {
            setCartCount(0);
          }
        }
      };

      updateCartCount();
      window.addEventListener("storage", updateCartCount);
      window.addEventListener("cartUpdated", updateCartCount);

      return () => {
        window.removeEventListener("storage", updateCartCount);
        window.removeEventListener("cartUpdated", updateCartCount);
      };
    }
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleLanguage = () => {
    const newLang = language === "id" ? "en" : "id";
    setLanguage(newLang);

    if (typeof window !== "undefined") {
      localStorage.setItem("colore-language", newLang);
      window.dispatchEvent(new CustomEvent("languageChanged", { detail: newLang }));
    }
  };

  const handleCartClick = () => {
    // Dispatch custom event to open cart or navigate to cart page
    window.dispatchEvent(new CustomEvent("openCart"));
  };

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-white/95 backdrop-blur-lg shadow-lg" 
            : "bg-white/90 backdrop-blur-sm"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-[#A3B18A] to-[#DFF19D] rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <span className="text-white font-bold text-xl">C</span>
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold text-[#A3B18A] group-hover:text-[#A3B18A]/80 transition-colors">
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
                  className={`relative font-medium transition-all duration-300 py-2 px-1 group ${
                    isActiveLink(item.href)
                      ? "text-[#A3B18A]"
                      : "text-gray-700 hover:text-[#A3B18A]"
                  }`}
                >
                  {item.name}
                  <span 
                    className={`absolute bottom-0 left-0 h-0.5 bg-[#A3B18A] transition-all duration-300 ${
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
                className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl bg-[#A3B18A]/10 hover:bg-[#A3B18A]/20 transition-all duration-300 group"
                title={t.switchLanguage}
              >
                <Globe className="w-4 h-4 text-[#A3B18A] group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-[#A3B18A]">
                  {language.toUpperCase()}
                </span>
              </button>

              {/* User Icon */}
              <button className="p-2 rounded-xl hover:bg-[#A3B18A]/10 transition-all duration-300 group">
                <User className="w-5 h-5 text-gray-700 group-hover:text-[#A3B18A] transition-colors" />
              </button>

              {/* Cart */}
              <button 
                onClick={handleCartClick}
                className="relative p-2 rounded-xl hover:bg-[#A3B18A]/10 transition-all duration-300 group"
              >
                <ShoppingCart className="w-5 h-5 text-gray-700 group-hover:text-[#A3B18A] transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#F6CCD0] text-[#A3B18A] text-xs font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center border-2 border-white">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 rounded-xl border border-[#A3B18A]/20 hover:bg-[#A3B18A]/10 transition-all duration-300"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-[#A3B18A]" />
                ) : (
                  <Menu className="w-5 h-5 text-[#A3B18A]" />
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
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-[#DFF19D]/20 to-[#BFF0F5]/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#A3B18A] to-[#DFF19D] rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">C</span>
                </div>
                <div>
                  <h2 className="font-bold text-[#A3B18A]">COLORE</h2>
                  <p className="text-xs text-gray-600">{t.tagline}</p>
                </div>
              </div>
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
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
                className={`flex items-center gap-4 p-4 rounded-2xl font-medium transition-all duration-300 group ${
                  isActiveLink(item.href)
                    ? "bg-[#A3B18A]/10 text-[#A3B18A] border border-[#A3B18A]/20"
                    : "text-gray-700 hover:text-[#A3B18A] hover:bg-[#A3B18A]/5"
                }`}
                style={{ 
                  animationDelay: `${index * 50}ms`,
                  animation: isMobileMenuOpen ? "slideInRight 0.3s ease-out forwards" : "none"
                }}
              >
                <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isActiveLink(item.href) ? "bg-[#A3B18A]" : "bg-gray-300 group-hover:bg-[#A3B18A]"
                }`} />
                <span className="flex-1">{item.name}</span>
                {isActiveLink(item.href) && (
                  <div className="w-1 h-6 bg-[#A3B18A] rounded-full" />
                )}
              </Link>
            ))}

            {/* Language Toggle - Mobile */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-4 p-4 w-full rounded-2xl text-gray-700 hover:text-[#A3B18A] hover:bg-[#A3B18A]/5 font-medium transition-all duration-300 mt-6 border border-gray-200"
            >
              <Globe className="w-5 h-5 text-[#A3B18A]" />
              <span className="flex-1 text-left">{t.switchLanguage}</span>
              <span className="text-sm font-bold text-[#A3B18A] bg-[#A3B18A]/10 px-2 py-1 rounded-lg">
                {language === "id" ? "EN" : "ID"}
              </span>
            </button>
          </div>

          {/* Mobile Footer */}
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center justify-center gap-4">
              <button className="flex-1 bg-[#A3B18A] text-white py-3 rounded-xl font-medium hover:bg-[#A3B18A]/90 transition-colors">
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