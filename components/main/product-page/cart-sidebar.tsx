"use client";

import Image from "next/image";
import { X, Minus, Plus } from "lucide-react"; // Import ikon Plus dan Minus
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
// import { CartItem } from "@/hooks/use-cart";
import useCart from "@/hooks/use-cart"; // Import useCart hook

type CartSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  // cartItems, onRemove tidak lagi diperlukan di props karena diambil dari hook
};

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  // Ambil state dan fungsi dari hook useCart
  const { cartItems, removeItem, increaseItemQuantity, decreaseItemQuantity } =
    useCart();

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const router = useRouter();

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
          Keranjang Belanja ({totalQuantity})
        </h2>

        <div className="space-y-4 overflow-y-auto max-h-[60vh]">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 border-b pb-4"
            >
              {typeof item.image === "string" && item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  width={60}
                  height={60}
                  className="rounded-md object-cover"
                />
              ) : (
                <div className="w-[60px] h-[60px] bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">
                  No Image
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm font-medium">{item.name}</p>
                {/* Bagian untuk menambah/mengurangi kuantitas */}
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => decreaseItemQuantity(item.id)}
                    className="p-1 rounded-full text-green-600 border border-green-600 hover:bg-green-600 hover:text-white transition"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => increaseItemQuantity(item.id)}
                    className="p-1 rounded-full text-green-600 border border-green-600 hover:bg-green-600 hover:text-white transition"
                  >
                    <Plus size={12} />
                  </button>
                </div>
                <p className="text-xs text-neutral-600 mt-1">
                  Total: Rp
                  {(item.price * item.quantity).toLocaleString("id-ID")}
                </p>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-gray-400 hover:text-green-600"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Ringkasan & Tombol */}
        {cartItems.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between text-sm mb-4">
              <span>{totalQuantity} Produk</span>
              <span className="font-semibold">
                Rp{totalPrice.toLocaleString("id-ID")}
              </span>
            </div>
            <Button
              onClick={() => router.push("/checkout")}
              className="w-full bg-green-600 text-white hover:bg-[#7a002a] mb-3"
            >
              Beli Sekarang
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}