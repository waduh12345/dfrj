"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { useGetProductBySlugQuery } from "@/services/product.service"; // API service
import Image from "next/image";
import { ShoppingCart, Heart, Truck, Clock, Package, Star } from "lucide-react"; // Menambahkan ikon baru untuk visual
import useCart from "@/hooks/use-cart";
import Swal from "sweetalert2";
import Link from "next/link"; // Menggunakan Link jika perlu navigasi

// Komponen yang merender halaman detail Produk berdasarkan slug
const ProductDetailPage = () => {
  return (
    <Suspense
      fallback={
        <div className="text-center text-lg text-gray-600 py-20">
          Memuat detail produk...
        </div>
      }
    >
      <ProductDetailContent />
    </Suspense>
  );
};

// Komponen yang bertanggung jawab untuk mengambil detail produk berdasarkan slug
const ProductDetailContent = () => {
  const searchParams = useSearchParams(); // Dapatkan search params dari URL
  const slug = searchParams.get("slug"); // Ekstrak 'slug' dari query URL

  if (!slug) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-red-600">
            Produk tidak ditemukan
          </h2>
          <p className="text-gray-600 mt-2">Slug produk tidak tersedia.</p>
        </div>
      </div>
    );
  }

  return <ProductDetail slug={slug} />;
};

// Komponen yang bertanggung jawab untuk mengambil detail produk berdasarkan slug
const ProductDetail = ({ slug }: { slug: string }) => {
  const { data: product, isLoading, isError } = useGetProductBySlugQuery(slug);
  const { addItem } = useCart();

  // State untuk menyimpan gambar yang dipilih, diinisialisasi dengan gambar utama produk jika ada
  const [selectedImage, setSelectedImage] = useState<string>("");

  useEffect(() => {
    if (product && selectedImage === "") {
      setSelectedImage(product.image as string);
    }
  }, [product, selectedImage]);

  const addToCart = () => {
    if (product) {
      // Menambahkan ukuran yang dipilih ke produk sebelum ditambahkan ke keranjang
      const productWithDetails = {
        ...product,
      };

      addItem(productWithDetails);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: `"${product.name}" \n Berhasil ditambahkan ke keranjang!`,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="text-center text-xl font-medium text-gray-700 py-32 animate-pulse">
        Memuat detail produk...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-xl font-medium text-red-500 py-32">
        Gagal memuat detail produk. Silakan coba lagi.
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center text-xl font-medium text-gray-700 py-32">
        Produk tidak ditemukan.
      </div>
    );
  }

  // Fallback image untuk memastikan `Image` memiliki URL yang valid
  const productImageUrl =
    typeof product.image === "string" ? product.image : "/fallback-image.jpg";

  // Mendapatkan semua gambar yang tersedia dan memfilter yang tidak ada (falsy)
  const images = [
    product.image,
    product.image_2,
    product.image_3,
    product.image_4,
    product.image_5,
    product.image_6,
    product.image_7,
  ].filter(Boolean) as string[];

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-[6rem] bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
        {/* Kolom Kiri: Galeri Gambar Produk */}
        <div className="lg:sticky lg:top-8 self-start">
          {/* Gambar Utama yang Dipilih */}
          <div className="relative w-full aspect-square mb-6 overflow-hidden rounded-xl shadow-2xl">
            <Image
              src={selectedImage || productImageUrl}
              alt={product.name}
              width={800}
              height={800}
              className="w-full h-full object-cover transform transition-all duration-500 hover:scale-105"
              priority
            />
          </div>
        </div>

        {/* Kolom Kanan: Informasi Produk & Aksi */}
        <div className="flex flex-col">
          <div className="mb-8 border-b pb-6">
            <h1 className="text-5xl font-extrabold text-gray-900 mt-3 mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Harga */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-extrabold text-[#E91E63]">
                Rp {product.price.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          {/* Deskripsi */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Deskripsi Produk
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Tombol Aksi Utama */}
          <div className="flex gap-4">
            <button
              onClick={addToCart}
              disabled={product.stock === 0}
              className={`flex-1 flex items-center justify-center gap-3 bg-[#4CAF50] text-white py-4 px-6 rounded-xl font-bold text-lg uppercase transition-all duration-300 shadow-lg hover:bg-[#45A049] ${
                product.stock === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <ShoppingCart className="w-6 h-6" />
              {product.stock > 0 ? "Tambahkan ke Keranjang" : "Stok Habis"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;