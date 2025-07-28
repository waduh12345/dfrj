"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/footer/footer";
import Navbar from "@/components/header/navbar";
import TopHeader from "@/components/header/top-header";
import CartSidebar from "@/components/main/product-page/cart-sidebar";
import ScrollToTopButton from "@/components/ui/scroll-top-button";
import useCart from "@/hooks/use-cart";
import clsx from "clsx";

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen, close, cartItems, removeItem } = useCart();
  const pathname = usePathname();
  const isWisataPage = pathname === "/wisata" || pathname === "/profile";

  return (
    <div className="w-full bg-white">
      <header
        className={clsx(
          "z-50",
          isWisataPage ? "fixed w-full" : "sticky top-0"
        )}
      >
        <Navbar />
        <TopHeader />
      </header>

      {/* Padding-top untuk menghindari content ketutupan header saat fixed */}
      <main className={clsx({ "": isWisataPage })}>{children}</main>

      <CartSidebar
        isOpen={isOpen}
        onClose={close}
        cartItems={cartItems}
        onRemove={removeItem}
      />
      <ScrollToTopButton />
      <Footer />
    </div>
  );
}