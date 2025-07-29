"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";

type CartSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  cartItems: Product[];
  onRemove: (id: number) => void;
};

export default function CartSidebar({
  isOpen,
  onClose,
  cartItems,
  onRemove,
}: CartSidebarProps) {
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      } bg-black/40`}
    >
      <div
        className={`w-full max-w-sm bg-white h-full shadow-lg p-6 relative transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Tombol Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-green-600"
        >
          <X size={24} />
        </button>

        <h2 className="text-lg font-bold mb-6">
          Keranjang Belanja ({cartItems.length})
        </h2>

        <div className="space-y-4 overflow-y-auto max-h-[60vh]">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 border-b pb-4"
            >
              <Image
                src={item.image}
                alt={item.name}
                width={60}
                height={60}
                className="rounded-md object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-neutral-600">
                  1x Rp{item.price.toLocaleString("id-ID")}
                </p>
              </div>
              <button
                onClick={() => onRemove(item.id)}
                className="text-gray-400 hover:text-green-600"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Ringkasan & Tombol */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between text-sm mb-4">
            <span>{cartItems.length} Produk</span>
            <span className="font-semibold">
              Rp{totalPrice.toLocaleString("id-ID")}
            </span>
          </div>
          <Button className="w-full bg-green-600 text-white hover:bg-[#7a002a] mb-3">
            Beli Sekarang
          </Button>
          <Button
            variant="ghost"
            className="w-full text-green-600 border border-green-600 hover:bg-green-600 hover:text-white"
          >
            Masukkan Keranjang
          </Button>
        </div>
      </div>
    </div>
  );
}