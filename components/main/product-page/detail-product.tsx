"use client";

import { Heart, ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import useCart from "@/hooks/use-cart"; // ✅ import useCart store

type ProductDetailProps = {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
};

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
}: ProductDetailProps) {
  const { addItem, open } = useCart(); // ✅ pakai dari Zustand

  if (!isOpen) return null;

  const handleAdd = () => {
    addItem(product);
    open(); // buka sidebar
    onClose(); // tutup modal
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-3xl rounded-md shadow-lg relative p-6 mx-4">
        {/* Tombol Close */}
        <Button
          variant="ghost"
          onClick={onClose}
          className="absolute top-4 right-4"
        >
          <X size={24} />
        </Button>

        {/* Isi Konten Modal */}
        <div className="flex flex-col md:flex-row gap-6 mt-4">
          {/* Gambar Produk */}
          <div className="flex-shrink-0 w-full md:w-1/2">
            <Image
              src={product.image}
              alt={product.name}
              width={400}
              height={400}
              className="rounded-md object-cover w-full h-64"
            />
          </div>

          {/* Detail Produk */}
          <div className="flex flex-col justify-between w-full md:w-1/2 space-y-4">
            <div>
              <h3 className="text-2xl font-semibold text-[#A80038]">
                {product.name}
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                {product.kecamatan} • {product.kategori}
              </p>
              <p className="text-lg font-bold text-[#A80038] mt-2">
                Rp {product.price.toLocaleString("id-ID")}
              </p>
              <p className="text-sm text-gray-700 mt-4">
                {product.description ||
                  "Produk unggulan dari koperasi kami. Kualitas terbaik dan harga bersahabat."}
              </p>
            </div>

            {/* Tombol Aksi */}
            <div className="flex gap-3">
              <Button
                onClick={handleAdd}
                className="bg-[#A80038] text-white hover:bg-[#7a002a] flex gap-2 items-center"
              >
                <ShoppingCart className="w-4 h-4" />
                Tambah ke Keranjang
              </Button>
              <Button
                variant="ghost"
                className="border border-[#A80038] text-[#A80038] hover:bg-[#A80038] hover:text-white p-2"
              >
                <Heart className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}