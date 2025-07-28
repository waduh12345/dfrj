import { create } from "zustand";
import { Product } from "@/types/product";

type CartStore = {
  isOpen: boolean;
  cartItems: Product[];
  open: () => void;
  close: () => void;
  toggle: () => void;
  addItem: (product: Product) => void;
  removeItem: (id: number) => void;
};

const useCart = create<CartStore>((set) => ({
  isOpen: false,
  cartItems: [],
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  addItem: (product) =>
    set((state) => ({
      cartItems: [...state.cartItems, product],
    })),
  removeItem: (id) =>
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.id !== id),
    })),
}));

export default useCart;