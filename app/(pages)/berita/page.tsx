"use client";

import { useState, useMemo } from "react";
import Headline from "@/components/main/berita/headline";
import NewsCardList from "@/components/main/berita/newscard";
import PopularNews from "@/components/main/berita/popular-news";
import BeritaDetailModal from "@/components/main/berita/detail-berita";
import { beritaList } from "@/components/main/berita/data";
import useModal from "@/hooks/use-modal";
import { Berita } from "@/types/berita"; // pastikan tipe ini ada

export default function BeritaPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("Semua");

  const [selectedBerita, setSelectedBerita] = useState<Berita | null>(null);
  const { isOpen, openModal, closeModal } = useModal();

  const kategoriList = useMemo(() => {
    const kategoriSet = new Set(beritaList.map((item) => item.kategori));
    return ["Semua", ...Array.from(kategoriSet)];
  }, []);

  const filteredBerita = beritaList.filter((berita) => {
    const matchSearch = berita.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchKategori =
      selectedKategori === "Semua" || berita.kategori === selectedKategori;
    return matchSearch && matchKategori;
  });

  const headline = filteredBerita[0];
  const beritaLainnya = filteredBerita.slice(1);

  const handleOpenDetail = (berita: Berita) => {
    setSelectedBerita(berita);
    openModal();
  };

  return (
    <div className="min-h-screen bg-neutral-50 px-6 py-10 md:px-12">
      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
        <input
          type="text"
          placeholder="Cari berita..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm"
        />
        <select
          value={selectedKategori}
          onChange={(e) => setSelectedKategori(e.target.value)}
          className="px-4 py-2 border border-neutral-300 rounded-md text-sm"
        >
          {kategoriList.map((kategori) => (
            <option key={kategori} value={kategori}>
              {kategori}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <Headline
            berita={headline}
            onClick={() => handleOpenDetail(headline)}
          />
          <NewsCardList list={beritaLainnya} onClick={handleOpenDetail} />
        </div>

        <div className="lg:col-span-1">
          <PopularNews onClick={handleOpenDetail} />
        </div>
      </div>

      {/* Detail Modal */}
      {selectedBerita && (
        <BeritaDetailModal
          isOpen={isOpen}
          onClose={closeModal}
          berita={selectedBerita}
        />
      )}
    </div>
  );
}