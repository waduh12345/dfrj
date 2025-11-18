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

  return (
    <Suspense
      fallback={
        <div className="text-center text-lg text-gray-600 py-20">
          Memuat detail produk...
        </div>
      }
    >
      <ProductDetail slug={slug} />
    </Suspense>
  );
};

// Komponen yang bertanggung jawab untuk mengambil detail produk berdasarkan slug
const ProductDetail = ({ slug }: { slug: string }) => {
  const { data: product, isLoading, isError } = useGetProductBySlugQuery(slug);
  const { addItem } = useCart();

  // State untuk menyimpan gambar yang dipilih, diinisialisasi dengan gambar utama produk jika ada
  const [selectedImage, setSelectedImage] = useState<string>("");
  // State untuk menyimpan ukuran yang dipilih (contoh implementasi)
  const [selectedSize, setSelectedSize] = useState<string>("M");

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
        selectedSize: selectedSize,
        // Anda mungkin ingin menambahkan kuantitas juga
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

  // Data tiruan untuk rating
  const averageRating = 4.5;
  const totalReviews = 50;

  // Warna-warna yang lebih modern dan kalem
  const primaryColor = "bg-[#4CAF50]"; // Hijau yang menenangkan
  const primaryHoverColor = "hover:bg-[#45A049]";
  const priceColor = "text-[#E91E63]"; // Merah muda/ungu untuk harga

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
          {/* Thumbnail Galeri */}
          <div className="w-full absolute bottom-6 backdrop-blur-sm bg-black/30 p-2 rounded-lg overflow-y-auto">
            <div className="flex flex-wrap gap-4 pb-2">
              {images.map((img, index) => (
                <div
                  key={index}
                  className={`flex-shrink-0 w-20 h-20 md:w-32 md:h-24 p-1 cursor-pointer rounded-lg border-2 transition-all duration-300 ${
                    selectedImage === img
                      ? "border-[#4CAF50] shadow-md scale-105"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                  onClick={() => setSelectedImage(img)}
                >
                  <Image
                    src={img}
                    alt={`product-thumb-${index}`}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full rounded-md transition-opacity duration-300 opacity-90 hover:opacity-100"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Informasi Produk & Aksi */}
        <div className="flex flex-col">
          <div className="mb-8 border-b pb-6">
            <span className="text-sm font-semibold uppercase tracking-wider text-[#4CAF50] bg-[#E8F5E9] px-3 py-1 rounded-full">
              {product.category_name}
            </span>
            <h1 className="text-5xl font-extrabold text-gray-900 mt-3 mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Rating dan Ulasan */}
            <div className="flex items-center mb-4 space-x-2">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(averageRating)
                        ? "fill-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600 font-semibold">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-gray-500">({totalReviews} Ulasan)</span>
            </div>

            {/* Harga */}
            <div className="flex items-baseline gap-3">
              <span className={`text-4xl font-extrabold ${priceColor}`}>
                Rp {product.price.toLocaleString("id-ID")}
              </span>
              {/* Tambahkan diskon jika ada */}
              {/* <span className="text-lg text-gray-400 line-through">Rp 150.000</span>
              <span className="text-lg font-bold text-red-500">(20% OFF)</span> */}
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
          {/* Informasi Tambahan/Stok */}
          <div className="grid grid-cols-2 gap-4 mb-8 text-gray-700 border-t pt-4">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-[#4CAF50]" />
              <span className="font-medium">Stok:</span>
              <span className="text-sm font-bold text-green-600">
                {product.stock} Tersedia
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#FF9800]" />
              <span className="font-medium">Waktu Proses:</span>
              <span className="text-sm">1-2 hari kerja</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#2196F3]" />
              <span className="font-medium">Pengiriman:</span>
              <span className="text-sm">Seluruh Indonesia</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#F44336]" />
              <span className="font-medium">Brand:</span>
              <span className="text-sm">{product.merk_name}</span>
            </div>
          </div>

          {/* Tombol Aksi Utama */}
          <div className="flex gap-4">
            <button
              onClick={addToCart}
              disabled={product.stock === 0}
              className={`flex-1 flex items-center justify-center gap-3 ${primaryColor} text-white py-4 px-6 rounded-xl font-bold text-lg uppercase transition-all duration-300 shadow-lg ${primaryHoverColor} ${
                product.stock === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <ShoppingCart className="w-6 h-6" />
              {product.stock > 0 ? "Tambahkan ke Keranjang" : "Stok Habis"}
            </button>
            <button
              className="p-4 border-2 border-gray-300 rounded-xl text-gray-600 hover:text-[#F44336] hover:border-[#F44336] transition-colors duration-300"
              title="Tambahkan ke Wishlist"
            >
              <Heart className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
