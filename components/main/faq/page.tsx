"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { Sparkles, ChevronRight } from "lucide-react";
import FaqItems from "./faq-items";
import { fredoka, sniglet } from "@/lib/fonts";

const FaqPage = () => {
  const [groupsActive, setGroupsActive] = useState<Array<number>>([]);

  const groupedFaqs: {
    name: string;
    items: { question: string; answer: string }[];
  }[] = [
    {
      name: "Produk",
      items: [
        {
          question: "Apakah produk COLORE aman untuk anak?",
          answer:
            "Ya! Semua produk COLORE menggunakan bahan non-toxic dan telah tersertifikasi aman untuk anak. Kami menggunakan bahan daur ulang dan ramah lingkungan yang telah lulus uji keamanan internasional.",
        },
        {
          question: "Berapa usia yang cocok untuk produk COLORE?",
          answer:
            "Produk COLORE dirancang untuk anak usia 1-12 tahun dengan kategori yang berbeda. Setiap produk memiliki label usia yang jelas untuk membantu Anda memilih yang tepat untuk si kecil.",
        },
        {
          question: "Bagaimana cara merawat produk seni COLORE?",
          answer:
            "Produk COLORE mudah dibersihkan dengan air hangat dan sabun lembut. Simpan di tempat kering dan sejuk, hindari paparan sinar matahari langsung untuk menjaga kualitas warna dan bahan.",
        },
        {
          question: "Apakah ada garansi untuk produk yang rusak?",
          answer:
            "Kami memberikan garansi 30 hari untuk produk rusak atau cacat produksi. Hubungi customer service kami dengan foto produk untuk proses penggantian yang cepat dan mudah.",
        },
      ],
    },
    {
      name: "Pemesanan",
      items: [
        {
          question: "Berapa lama proses pengiriman?",
          answer:
            "Estimasi pengiriman 3-7 hari kerja untuk wilayah Jabodetabek, dan 7-14 hari kerja untuk luar kota. Kami menggunakan ekspedisi terpercaya seperti JNE, TIKI, dan J&T.",
        },
        {
          question: "Apakah ada minimum pembelian?",
          answer:
            "Tidak ada minimum pembelian. Namun untuk pembelian di atas Rp 250.000, Anda mendapat free shipping ke seluruh Indonesia.",
        },
        {
          question: "Metode pembayaran apa saja yang tersedia?",
          answer:
            "Kami menerima transfer bank (BCA, Mandiri, BRI, BNI), e-wallet (GoPay, OVO, DANA, ShopeePay), dan virtual account. Semua pembayaran diproses melalui Midtrans yang aman.",
        },
        {
          question: "Bisakah mengubah atau membatalkan pesanan?",
          answer:
            "Pesanan dapat diubah atau dibatalkan dalam 1 jam setelah pembayaran dikonfirmasi. Setelah itu, pesanan akan masuk proses packing dan tidak dapat diubah.",
        },
        {
          question: "Bagaimana jika produk rusak atau salah?",
          answer:
            "Kami menyediakan garansi 30 hari untuk produk rusak atau salah kirim. Hubungi customer service kami dengan foto produk untuk proses penggantian.",
        },
        {
          question: "Apakah ada program loyalitas?",
          answer:
            "Ya! Setiap pembelian akan mendapat poin COLORE yang bisa ditukar dengan diskon atau produk gratis. Bergabunglah dengan COLORE Club untuk benefit eksklusif.",
        },
      ],
    },
  ];

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-white to-[#DFF19D]/10 ${sniglet.className}`}
    >
      {/* Header Section */}
      <section className="pt-24 pb-4 px-6 lg:px-12">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#A3B18A]/10 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-[#A3B18A]" />
            <span className="text-sm font-medium text-[#A3B18A]">FAQ</span>
          </div>

          <h1 className={`text-4xl lg:text-6xl font-bold text-gray-900 mb-6 ${fredoka.className}`}>
            Ada Pertanyaan?
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Temukan jawaban cepat untuk pertanyaan umum seputar layanan kami.
          </p>
        </div>
      </section>

      <section className="pt-4 pb-24 px-6 lg:px-12">
        <div className="container mx-auto max-w-3xl">
          <div className="space-y-2">
            {groupedFaqs.map((item, index) => (
              <div
                key={index}
                className={cn(
                  "border-b border-[#A3B18A]/30 py-2",
                  "overflow-hidden"
                )}
              >
                <button
                  onClick={() => {
                    setGroupsActive((state) => {
                      if (state.includes(index)) {
                        return state.filter((x) => x !== index);
                      } else {
                        return [...state, index];
                      }
                    });
                  }}
                  className="w-full flex items-center gap-x-1 cursor-pointer"
                >
                  <div>
                    <ChevronRight
                      className={cn({
                        "rotate-90": groupsActive.includes(index),
                      })}
                      strokeWidth={2.3}
                    />
                  </div>
                  <span className="text-lg font-medium">{item.name}</span>
                </button>
                {groupsActive.includes(index) && <FaqItems faqs={item.items} />}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FaqPage;
