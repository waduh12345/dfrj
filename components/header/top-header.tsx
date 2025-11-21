"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { Menu, X, ShoppingCart, User, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslation } from "@/hooks/use-translation";
import id from "@/translations/header/id";
import en from "@/translations/header/en";
import useCart from "@/hooks/use-cart";
import Image from "next/image";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { lang, switchLang } = useLanguage();
  const t = useTranslation({ id, en });
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

  // Mapping warna hover untuk setiap menu sesuai palet
  const menuItemColors = [
    {
      name: t.about,
      href: "/about",
      hoverBg: "hover:bg-[#DFF1AD]", // Light green
      activeBg: "bg-[#DFF1AD]",
      textColor: "text-[#6B7280]",
    },
    {
      name: t.products,
      href: "/product",
      hoverBg: "hover:bg-[#F6CCD0]", // Light pink
      activeBg: "bg-[#F6CCD0]",
      textColor: "text-[#6B7280]",
    },
    {
      name: t.howToOrder,
      href: "/how-to-order",
      hoverBg: "hover:bg-[#BFF0F5]", // Light blue
      activeBg: "bg-[#BFF0F5]",
      textColor: "text-[#6B7280]",
    },
    {
      name: t.cekOrder,
      href: "/cek-order",
      hoverBg: "hover:bg-[#BFF0F5]", // Light blue
      activeBg: "bg-[#BFF0F5]",
      textColor: "text-[#6B7280]",
    },
    {
      name: t.news,
      href: "/news",
      hoverBg: "hover:bg-[#DFF1AD]", // Light green
      activeBg: "bg-[#DFF1AD]",
      textColor: "text-[#6B7280]",
    },
    {
      name: t.gallery,
      href: "/gallery",
      hoverBg: "hover:bg-[#F6CCD0]", // Light pink
      activeBg: "bg-[#F6CCD0]",
      textColor: "text-[#6B7280]",
    },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen((v) => !v);

  const toggleLanguage = () => {
    const newLang = lang === "id" ? "en" : "id";
    switchLang(newLang);
    if (typeof window !== "undefined") {
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
      router.push("/login");
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
                <Image
                  src="/logo-colore.png"
                  alt="Colore Logo"
                  width={100}
                  height={100}
                />
              </div>
              {/* <div className="hidden sm:block">
                <h1 className="text-2xl font-bold transition-all duration-300">
                  <span className="text-[#B8D68C]">C</span>
                  <span className="text-[#E8A5AB]">O</span>
                  <span className="text-[#8FCED6]">L</span>
                  <span className="text-[#B8D68C]">O</span>
                  <span className="text-[#E8A5AB]">R</span>
                  <span className="text-[#8FCED6]">E</span>
                </h1>
                <p className="text-xs text-gray-600 font-medium leading-tight">
                  {t.tagline}
                </p>
              </div> */}
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-2">
              {menuItemColors.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative font-semibold transition-all duration-300 py-3 px-4 group rounded-xl ${
                    isActiveLink(item.href)
                      ? `${item.activeBg} text-gray-700 shadow-md`
                      : `text-gray-700 ${item.hoverBg} hover:shadow-sm`
                  }`}
                >
                  {item.name}
                  <span
                    className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 h-1 bg-gray-600 rounded-full transition-all duration-300 ${
                      isActiveLink(item.href) ? "w-8" : "w-0 group-hover:w-6"
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
                className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl bg-[#DFF1AD] hover:bg-[#D1E7A0] transition-all duration-300 group shadow-md hover:shadow-lg"
                title={t.switchLanguage}
              >
                <Globe className="w-4 h-4 text-gray-600 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold text-gray-600">
                  {lang.toUpperCase()}
                </span>
              </button>

              {/* User Icon */}
              <button
                onClick={handleUserClick}
                className="p-3 rounded-xl hover:bg-[#F6CCD0] transition-all duration-300 group shadow-sm hover:shadow-md"
                aria-label="User"
              >
                <User className="w-5 h-5 text-gray-700 group-hover:text-gray-800 transition-colors" />
              </button>

              {/* Cart */}
              <button
                onClick={handleCartClick}
                className="relative p-3 cursor-pointer rounded-xl hover:bg-[#BFF0F5] transition-all duration-300 group shadow-sm hover:shadow-md"
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5 text-gray-700 group-hover:text-gray-800 transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold min-w-[20px] h-[20px] rounded-full flex items-center justify-center border-2 border-white shadow-lg animate-pulse">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-3 rounded-xl border-2 border-gray-300 hover:bg-[#DFF1AD] hover:border-gray-400 transition-all duration-300 shadow-md hover:shadow-lg"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-600" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-600" />
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
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-[#DFF1AD]/50 to-[#BFF0F5]/50">
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
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Mobile Menu Items */}
          <div className="p-6 space-y-2 flex-1 overflow-y-auto">
            {menuItemColors.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={toggleMobileMenu}
                className={`flex items-center gap-4 p-4 rounded-2xl font-semibold transition-all duration-300 group ${
                  isActiveLink(item.href)
                    ? `${item.activeBg} text-gray-700 border-2 border-gray-300 shadow-md`
                    : `text-gray-700 ${item.hoverBg} hover:shadow-sm`
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
                      ? "bg-gray-600"
                      : "bg-gray-300 group-hover:bg-gray-500"
                  }`}
                />
                <span className="flex-1">{item.name}</span>
                {isActiveLink(item.href) && (
                  <div className="w-1 h-6 bg-gray-600 rounded-full shadow-sm" />
                )}
              </Link>
            ))}

            {/* Language Toggle - Mobile */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-4 p-4 w-full rounded-2xl text-gray-700 hover:bg-[#DFF1AD] font-semibold transition-all duration-300 mt-6 border-2 border-gray-300 bg-[#DFF1AD]/50"
            >
              <Globe className="w-5 h-5 text-gray-600" />
              <span className="flex-1 text-left">{t.switchLanguage}</span>
              <span className="text-sm font-bold text-white bg-gray-600 px-3 py-1 rounded-lg shadow-md">
                {lang === "id" ? "EN" : "ID"}
              </span>
            </button>
          </div>

          {/* Mobile Footer */}
          <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-[#DFF1AD]/30 to-[#F6CCD0]/30">
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
