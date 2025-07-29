"use client";

import Image from "next/image";
import { Banknote, ShoppingBag, Smartphone, Leaf } from "lucide-react";

export default function ProdukKoperasiSection() {
  const produk = [
    {
      icon: <Banknote className="w-6 h-6 text-green-600" />,
      title: "Produk Simpan Pinjam",
      items: [
        "Simpanan Pokok, Wajib & Sukarela",
        "Deposito Berjangka",
        "Pinjaman dengan bunga rendah",
      ],
    },
    {
      icon: <ShoppingBag className="w-6 h-6 text-green-600" />,
      title: "Produk Konsumsi & Retail",
      items: [
        "Sembako & kebutuhan harian",
        "Produk UMKM lokal",
        "Barang rumah tangga dengan cicilan",
      ],
    },
    {
      icon: <Smartphone className="w-6 h-6 text-green-600" />,
      title: "Layanan & Produk Digital",
      items: [
        "Pembayaran PPOB (listrik, pulsa, dll)",
        "Marketplace koperasi",
        "Aplikasi Mobile Koperasi",
      ],
    },
    {
      icon: <Leaf className="w-6 h-6 text-green-600" />,
      title: "Produk Berdasarkan Sektor",
      items: [
        "Pupuk & bibit (koperasi tani)",
        "Seragam & alat tulis (koperasi sekolah)",
        "Pinjaman karyawan (koperasi pegawai)",
      ],
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/bg-product.jpg"
          alt="Produk Alumni Pondok"
          layout="fill"
          objectFit="cover"
          className="brightness-50"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content on top of background */}
      <div className="relative z-10 container mx-auto px-6 md:px-12 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Produk & Layanan Koperasi
        </h2>
        <p className="max-w-2xl mx-auto mb-12 text-neutral-200">
          Marketplace Pondok menyediakan berbagai produk unggulan untuk
          mendukung kesejahteraan anggota dan masyarakat melalui sistem simpan
          pinjam, layanan digital, serta produk konsumsi dan sektor khusus.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
          {produk.map((p, idx) => (
            <div
              key={idx}
              className="bg-white/90 backdrop-blur-md rounded-xl shadow-md p-6 space-y-4 hover:-translate-y-2 transition text-neutral-800 cursor-pointer"
            >
              <div>{p.icon}</div>
              <h3 className="font-semibold text-lg">{p.title}</h3>
              <ul className="list-disc list-inside text-sm space-y-1">
                {p.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
