"use client";

import Link from "next/link";
import { useState } from "react";
import { IconMenu2, IconX } from "@tabler/icons-react";
import clsx from "clsx";

const navItems = [
  { label: "Beranda", href: "/" },
  { label: "Profil", href: "/profile" },
  { label: "Produk", href: "/product" },
  { label: "Berita", href: "/berita" },
  { label: "Galeri", href: "/galeri" },
];

export default function Navbar() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <nav className="w-full bg-green-600 shadow-md">
      <div className="flex flex-wrap items-center justify-end mx-auto px-4 py-2">
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-sm font-semibold">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-white hover:text-green-900 transition-colors"
            >
              {item.label}
            </Link>
          ))}

          <span className="text-white">|</span>
          <div className="flex items-center gap-3 text-sm font-medium">
            <Link
              href="/auth/register"
              className="text-white text-xs hover:text-green-900 transition-colors"
            >
              Sign Up
            </Link>
            <Link
              href="/auth/login"
              className="bg-white text-green-800 text-xs px-4 py-2 rounded-md hover:bg-green-800 hover:text-white border border-transparent hover:border-white transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
          <IconMenu2 size={28} className="text-white" />
        </button>
      </div>

      {/* Sidebar Overlay (mobile) */}
      <div
        className={clsx(
          "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity",
          isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={clsx(
          "fixed top-0 left-0 h-full w-64 bg-white z-50 p-6 transform transition-transform duration-300 shadow-lg",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex justify-between items-center mb-6">
          <span className="text-lg font-semibold">Menu</span>
          <button onClick={() => setSidebarOpen(false)}>
            <IconX size={24} />
          </button>
        </div>

        <div className="flex flex-col gap-4 text-sm font-semibold">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className="text-gray-800 hover:text-green-600 transition-colors"
            >
              {item.label}
            </Link>
          ))}

          <hr className="my-4" />

          <Link
            href="/auth/register"
            className="text-gray-800 hover:text-green-600 transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            Sign Up
          </Link>
          <Link
            href="/auth/login"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-white hover:border hover:border-green-600 hover:text-green-600 transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
}
