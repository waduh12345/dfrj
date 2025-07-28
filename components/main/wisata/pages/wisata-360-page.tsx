"use client";

import { useState } from "react";
import WisataCard from "../wisata-card";
import { wisataList } from "../data-wisata";
import WisataModal from "../modal/wisata-modal";
import useModal from "@/hooks/use-modal";
import { WisataItem } from "@/types/wisata";

export default function WisataPage() {
  const { isOpen, openModal, closeModal } = useModal();
  const [selected, setSelected] = useState<WisataItem | null>(null);

  const handleOpen = (item: WisataItem) => {
    setSelected(item);
    openModal();
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold">View Most Popular Contents</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Menghadirkan berbagai kontes menarik dan populer bagi para pengguna.
            🚀
          </p>
        </div>
        <button className="bg-[#A80038] text-white px-4 py-2 rounded-lg hover:bg-[#5b0f0f]">
          Lihat selengkapnya
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wisataList.map((item) => (
          <WisataCard
            key={item.id}
            item={item}
            onClick={() => handleOpen(item)}
          />
        ))}
      </div>

      {isOpen && selected && (
        <WisataModal data={selected} onClose={closeModal} />
      )}
    </div>
  );
}
