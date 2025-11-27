// hooks/use-cart.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Product } from "@/types/admin/product";

export type CartItem = Product & {
  quantity: number;
};

type CartStore = {
  isOpen: boolean;
  cartItems: CartItem[];
  open: () => void;
  close: () => void;
  toggle: () => void;
  addItem: (product: Product & { quantity?: number }) => void;
  removeItem: (id: number) => void;
  increaseItemQuantity: (id: number, by?: number) => void;
  decreaseItemQuantity: (id: number, by?: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
};

const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      isOpen: false,
      cartItems: [],

      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),

      // IMPORTANT: always use get() inside action to obtain freshest state (avoid stale closures)
      addItem: (product) => {
        const qtyToAdd =
          typeof product.quantity === "number" && product.quantity > 0
            ? product.quantity
            : 1;

        // read latest state
        const current = get().cartItems ?? [];

        const found = current.find((it) => it.id === product.id);

        if (found) {
          // update existing
          const updated = current.map((it) =>
            it.id === product.id
              ? { ...it, quantity: it.quantity + qtyToAdd }
              : it
          );
          set({ cartItems: updated });
        } else {
          const newItem: CartItem = { ...product, quantity: qtyToAdd };
          set({ cartItems: [...current, newItem] });
        }

        // notify other listeners (legacy code / header that listens to cartUpdated)
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("cartUpdated"));
        }
      },

      removeItem: (id) => {
        const current = get().cartItems ?? [];
        const next = current.filter((it) => it.id !== id);
        set({ cartItems: next });
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("cartUpdated"));
        }
      },

      increaseItemQuantity: (id, by = 1) => {
        const current = get().cartItems ?? [];
        const next = current.map((it) =>
          it.id === id ? { ...it, quantity: it.quantity + by } : it
        );
        set({ cartItems: next });
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("cartUpdated"));
        }
      },

      decreaseItemQuantity: (id, by = 1) => {
        const current = get().cartItems ?? [];
        const item = current.find((it) => it.id === id);
        if (!item) return;
        const nextQty = item.quantity - by;
        const next =
          nextQty > 0
            ? current.map((it) =>
                it.id === id ? { ...it, quantity: nextQty } : it
              )
            : current.filter((it) => it.id !== id);
        set({ cartItems: next });
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("cartUpdated"));
        }
      },

      clearCart: () => {
        set({ cartItems: [] });
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("cartUpdated"));
        }
      },

      getTotalItems: () => {
        const s = get();
        return (s.cartItems ?? []).reduce((acc, it) => acc + it.quantity, 0);
      },

      getTotalPrice: () => {
        const s = get();
        return (s.cartItems ?? []).reduce(
          (acc, it) => acc + (it.price ?? 0) * it.quantity,
          0
        );
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCart;