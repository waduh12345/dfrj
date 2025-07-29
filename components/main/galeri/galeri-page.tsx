"use client";

import { useState } from "react";
import Image from "next/image";
import { galeriList, GaleriItem } from "./galeri-list";
import useModal from "@/hooks/use-modal";
import GaleriModal from "./galeri-modal";

const categories = ["Semua", "Kegiatan", "Produk", "Wisata"];

export default function GaleriPage() {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedItem, setSelectedItem] = useState<GaleriItem | null>(null);
  const { isOpen, openModal, closeModal } = useModal();

  const filteredList =
    selectedCategory === "Semua"
      ? galeriList
      : galeriList.filter((item) => item.category === selectedCategory);

  const handleClick = (item: GaleriItem) => {
    setSelectedItem(item);
    openModal();
  };

  return (
    <div className="mx-auto px-4 py-8 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-200">
      <h1 className="text-3xl font-bold text-center text-green-600 dark:text-[#FF6384] mb-2">
        Galeri Marketplace Pondok
      </h1>
      <p className="text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
        Dokumentasi kegiatan, produk, dan wisata bersama yang dilakukan oleh
        anggota Marketplace Pondok.
      </p>

      {/* Filter */}
      <div className="flex md:justify-center items-center gap-4 mb-6 flex-wrap mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded border transition-all duration-200
              ${
                selectedCategory === cat
                  ? "bg-green-600 text-white border-green-600 dark:bg-[#FF6384] dark:border-[#FF6384]"
                  : "border-gray-300 text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              }
              hover:bg-green-600 hover:text-white hover:border-green-600
              dark:hover:bg-[#FF6384] dark:hover:text-white dark:hover:border-[#FF6384]
            `}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Galeri Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 auto-rows-[150px] gap-4">
        {filteredList.map((item, index) => {
          const patternIndex = index % 6;
          let className = "col-span-2 row-span-1";

          if (patternIndex === 3) {
            className = "col-span-3 row-span-2";
          } else if (patternIndex === 4) {
            className = "col-span-3 row-span-2";
          }

          return (
            <div
              key={item.id}
              onClick={() => handleClick(item)}
              className={`relative overflow-hidden rounded-lg cursor-pointer group ${className}`}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover rounded-lg group-hover:scale-105 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-white text-center text-sm font-semibold">
                  {item.title}
                </h3>
              </div>
              <h3 className="mt-2 text-center font-medium text-gray-800 dark:text-gray-100 p-2 block md:hidden">
                {item.title}
              </h3>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <GaleriModal isOpen={isOpen} onClose={closeModal} item={selectedItem} />
    </div>
  );
}
