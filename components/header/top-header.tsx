"use client";

import Image from "next/image";
import { IconUser, IconShoppingCart } from "@tabler/icons-react";
import SearchToggle from "../ui/search-toggle";
import useCart from "@/hooks/use-cart";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import clsx from "clsx";

export default function TopHeader() {
  const pathname = usePathname();
  const isWisataPage = pathname === "/wisata" || pathname === "/profile";

  const [isScrolled, setIsScrolled] = useState(false);
  const openCart = useCart((state) => state.open);
  const cartCount = useCart((state) => state.cartItems.length);

  useEffect(() => {
    if (!isWisataPage) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isWisataPage]);

  return (
    <nav
      className={clsx(
        "w-full px-6 py-4 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-2 transition-all duration-300",
        isWisataPage
          ? isScrolled
            ? "bg-white text-black shadow-sm"
            : "bg-transparent text-white"
          : "bg-white text-green-600 shadow-sm"
      )}
    >
      {/* Kiri: Logo */}
      <div className="flex items-center gap-2">
        <Image
          src="/icon-pndok.png"
          alt="Logo Koperasi"
          width={64}
          height={64}
        />
        <div className="leading-tight">
          <p className="text-lg font-bold text-green-800">Marketplace Pondok</p>
        </div>
      </div>

      {/* Tengah: Search + Donasi */}
      <div className="flex justify-between items-center lg:gap-4">
        <div className="flex items-center gap-4">
          <SearchToggle />
          <button
            className={clsx(
              "px-4 py-2 text-sm rounded-md transition",
              isWisataPage && !isScrolled
                ? "bg-white/10 text-white border border-white hover:bg-white/30"
                : "bg-green-700 text-white hover:bg-green-700"
            )}
          >
            Search
          </button>
        </div>

        {/* Kanan: User + Cart */}
        <div className="flex items-center gap-4">
          <IconUser
            size={24}
            className={clsx(
              "cursor-pointer transition",
              isWisataPage && !isScrolled ? "text-white" : "text-green-700"
            )}
            onClick={() => {
              window.location.href = "/settings";
            }}
          />
          <div className="relative">
            <IconShoppingCart
              size={24}
              className={clsx(
                "cursor-pointer transition",
                isWisataPage && !isScrolled ? "text-white" : "text-green-700"
              )}
              onClick={openCart}
            />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-green-600 text-white text-[10px] px-[6px] rounded-full">
                {cartCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}