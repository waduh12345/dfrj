"use client";
import React, { useState, useEffect } from "react";
import {
  Database,
  Store,
  ShoppingCart,
  Users,
  Package,
  Tag,
  BookDashed,
} from "lucide-react";
import Header from "@/components/admin-components/header";
import Sidebar from "@/components/admin-components/sidebar";
import { AdminLayoutProps, MenuItem } from "@/types";
import { IconLibraryPhoto, IconNews } from "@tabler/icons-react";

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <BookDashed className="h-5 w-5" />,
      href: "/admin/dashboard",
    },
    {
      id: "profile-toko",
      label: "Profile Toko",
      icon: <Store className="h-5 w-5" />,
      href: "/admin/profile-toko",
    },
    {
      id: "master",
      label: "Master",
      icon: <Database className="h-5 w-5" />,
      href: "#",
      children: [
        {
          id: "master-product-category",
          label: "Kategori Produk",
          href: "/admin/product-category",
        },
        {
          id: "master-product-merk",
          label: "Merk Produk",
          href: "/admin/product-merk",
        },
      ],
    },
    {
      id: "product",
      label: "Produk",
      icon: <Package className="h-5 w-5" />,
      href: "/admin/product-list",
    },
    {
      id: "gallery",
      label: "Galeri",
      icon: <IconLibraryPhoto className="h-5 w-5" />,
      href: "/admin/gallery",
    },
    {
      id: "news",
      label: "Berita",
      icon: <IconNews className="h-5 w-5" />,
      href: "/admin/news",
    },
    {
      id: "voucher",
      label: "Voucher",
      icon: <Tag className="h-5 w-5" />,
      href: "/admin/voucher",
    },
    {
      id: "transaction",
      label: "Transaksi",
      icon: <ShoppingCart className="h-5 w-5" />,
      href: "/admin/transaction",
    },
    {
      id: "pengguna",
      label: "Data Pengguna",
      icon: <Users className="h-5 w-5" />,
      href: "/admin/customer",
    },
  ];

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        menuItems={menuItems}
      />

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} title={title} />

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
