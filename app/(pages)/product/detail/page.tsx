"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { useGetProductBySlugQuery } from "@/services/product.service";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ShoppingCart, X } from "lucide-react";
import useCart from "@/hooks/use-cart";
import Swal from "sweetalert2";
import { useTranslation } from "@/hooks/use-translation";
// Pastikan path import terjemahan sesuai struktur project Anda
import id from "@/translations/product/id";
import en from "@/translations/product/en";

// --- Konstanta ---
const THUMBNAILS_VISIBLE = 4; // Jumlah thumbnail yang muncul sekaligus

// 1. Komponen Utama Halaman
const ProductDetailPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center bg-white">
          <div className="text-lg font-medium text-gray-500 animate-pulse">
            Memuat detail produk...
          </div>
        </div>
      }
    >
      <ProductDetailContent />
    </Suspense>
  );
};

// 2. Wrapper untuk mengambil Search Params
const ProductDetailContent = () => {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");

  if (!slug) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-red-500 mb-2">
            Produk Tidak Ditemukan
          </h2>
          <p className="text-gray-600">
            Parameter URL tidak valid atau produk tidak tersedia.
          </p>
          <a
            href="/product"
            className="mt-6 inline-block rounded-lg bg-gray-900 px-6 py-2 text-sm font-semibold text-white transition hover:bg-gray-700"
          >
            Kembali ke Katalog
          </a>
        </div>
      </div>
    );
  }

  return <ProductDetail slug={slug} />;
};

// 3. Komponen Detail Produk (Logic Utama)
const ProductDetail = ({ slug }: { slug: string }) => {
  const router = useRouter();
  const { data: product, isLoading, isError } = useGetProductBySlugQuery(slug);
  const { addItem } = useCart();
  const t = useTranslation({ id, en });

  // -- State --
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  
  // State untuk sliding thumbnail (indeks awal dari window thumbnail)
  const [thumbStartIndex, setThumbStartIndex] = useState<number>(0);

  // -- Effects --
  // Set gambar utama saat data produk selesai dimuat
  useEffect(() => {
    if (product && !selectedImage) {
      const firstImg = (product.image as string) || "";
      setSelectedImage(firstImg);
    }
  }, [product, selectedImage]);

  // -- Data Preparation --
  const productImageUrl =
    product && typeof product.image === "string"
      ? product.image
      : "/fallback-image.jpg"; // Ganti dengan path placeholder Anda jika ada

  // Mengumpulkan semua gambar valid ke dalam satu array
  const allImages = product
    ? [
        product.image,
        product.image_2,
        product.image_3,
        product.image_4,
        product.image_5,
        product.image_6,
        product.image_7,
      ].filter((img): img is string => Boolean(img) && img !== "")
    : [];

  // Gambar yang sedang aktif (ditampilkan besar)
  const currentActiveImage = selectedImage || productImageUrl;
  // Index global gambar aktif (untuk keperluan lightbox navigasi)
  const currentGlobalIndex = allImages.indexOf(currentActiveImage);

  // -- Handlers --

  const addToCart = () => {
    if (product) {
      addItem({ ...product });
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: `"${product.name}" ditambahkan!`,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
  };

  // Handler Thumbnail
  const handleThumbClick = (url: string) => {
    setSelectedImage(url);
  };

  // Logic Slider Thumbnail (Next/Prev untuk strip kecil)
  const slideNext = () => {
    if (thumbStartIndex + THUMBNAILS_VISIBLE < allImages.length) {
      setThumbStartIndex((prev) => prev + 1);
    }
  };

  const slidePrev = () => {
    if (thumbStartIndex > 0) {
      setThumbStartIndex((prev) => prev - 1);
    }
  };

  // Logic Lightbox
  const openLightbox = () => {
    if (allImages.length > 0) setLightboxOpen(true);
  };

  const lightboxNext = () => {
    if (allImages.length === 0) return;
    const nextIndex = (currentGlobalIndex + 1) % allImages.length;
    setSelectedImage(allImages[nextIndex]);
  };

  const lightboxPrev = () => {
    if (allImages.length === 0) return;
    const prevIndex =
      (currentGlobalIndex - 1 + allImages.length) % allImages.length;
    setSelectedImage(allImages[prevIndex]);
  };

  // -- Loading / Error States --
  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"></div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-center">
        <p className="text-lg font-medium text-red-500">
          Gagal memuat data produk.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-sm underline text-gray-600 hover:text-black"
        >
          Muat Ulang Halaman
        </button>
      </div>
    );
  }

  // Slice array gambar untuk thumbnail slider
  const visibleThumbnails = allImages.slice(
    thumbStartIndex,
    thumbStartIndex + THUMBNAILS_VISIBLE
  );

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-24 bg-white">
      {/* Tombol Back Fixed/Sticky */}
      <div className="fixed top-24 left-4 z-40 lg:absolute lg:top-0 lg:left-0 lg:mb-8">
        <button
          onClick={() => router.push("/product")} // Gunakan router.push agar lebih cepat (SPA navigation)
          className="flex items-center gap-2 bg-white/90 backdrop-blur-sm hover:bg-gray-100 border border-gray-200 px-4 py-2 rounded-full shadow-lg font-semibold text-sm transition-all duration-200 text-gray-700 hover:text-black"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>{t["button-back"] || "Kembali"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mt-16 lg:mt-12">
        {/* === KOLOM KIRI: Galeri === */}
        <div className="flex flex-col gap-6">
          {/* 1. Main Image */}
          <div
            className="group relative w-full aspect-square overflow-hidden rounded-2xl bg-gray-50 border border-gray-100 cursor-zoom-in"
            onClick={openLightbox}
          >
            <Image
              src={currentActiveImage}
              alt={product.name}
              fill
              className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
          </div>

          {/* 2. Thumbnail Slider (Hanya muncul jika > 1 gambar) */}
          {allImages.length > 1 && (
            <div className="relative flex items-center justify-center gap-3 select-none">
              
              {/* Tombol Prev (Hanya muncul jika bisa geser kiri) */}
              <button
                onClick={slidePrev}
                disabled={thumbStartIndex === 0}
                className={`p-2 rounded-full border shadow-sm transition-all ${
                  thumbStartIndex === 0
                    ? "text-gray-300 border-gray-100 cursor-default opacity-0" // Hide if disabled
                    : "text-gray-700 border-gray-300 hover:bg-gray-100 hover:scale-110 opacity-100"
                }`}
                aria-label="Previous thumbnails"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* List Thumbnail */}
              <div className="flex gap-3 overflow-hidden py-1">
                {visibleThumbnails.map((img, index) => {
                  // Karena visibleThumbnails adalah potongan, kita butuh index asli jika ingin key unik yang absolut
                  // Tapi menggunakan URL img sebagai key cukup aman jika URL unik.
                  const isActive = img === currentActiveImage;
                  return (
                    <button
                      key={`${img}-${index}`}
                      onClick={() => handleThumbClick(img)}
                      className={`relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                        isActive
                          ? "border-[#E91E63] shadow-md opacity-100 scale-100"
                          : "border-transparent opacity-60 hover:opacity-100 hover:border-gray-300 scale-95"
                      }`}
                    >
                      <Image
                        src={img}
                        alt="thumbnail"
                        fill
                        className="object-cover"
                        sizes="100px"
                      />
                    </button>
                  );
                })}
              </div>

              {/* Tombol Next (Hanya muncul jika bisa geser kanan) */}
              <button
                onClick={slideNext}
                disabled={thumbStartIndex + THUMBNAILS_VISIBLE >= allImages.length}
                className={`p-2 rounded-full border shadow-sm transition-all ${
                  thumbStartIndex + THUMBNAILS_VISIBLE >= allImages.length
                    ? "text-gray-300 border-gray-100 cursor-default opacity-0" // Hide if disabled
                    : "text-gray-700 border-gray-300 hover:bg-gray-100 hover:scale-110 opacity-100"
                }`}
                aria-label="Next thumbnails"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* === KOLOM KANAN: Info === */}
        <div className="flex flex-col h-full">
          <div className="border-b border-gray-100 pb-8 mb-8">
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
              {product.name}
            </h1>
            <p className="text-3xl font-bold text-[#E91E63]">
              Rp {product.price.toLocaleString("id-ID")}
            </p>
          </div>

          <div className="prose prose-sm md:prose-base text-gray-600 mb-10 flex-grow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Deskripsi
            </h3>
            <p className="whitespace-pre-line leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="mt-auto pt-4">
            <button
              onClick={addToCart}
              disabled={product.stock === 0}
              className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-bold text-lg uppercase tracking-wide shadow-xl transition-all duration-300 transform active:scale-[0.98] ${
                product.stock > 0
                  ? "bg-[#4CAF50] text-white hover:bg-[#43a047] hover:shadow-2xl"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              <ShoppingCart className="w-6 h-6" />
              {product.stock > 0 ? "Tambah ke Keranjang" : "Stok Habis"}
            </button>
            {product.stock > 0 && product.stock <= 5 && (
              <p className="text-center text-red-500 text-sm mt-3 font-medium animate-pulse">
                Segera! Stok tinggal {product.stock} unit.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* === Lightbox Modal === */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Tombol Close */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 z-20 p-2 bg-white/10 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-8 h-8" />
          </button>

          <div
            className="relative w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()} // Mencegah klik gambar menutup modal
          >
            {/* Prev Lightbox */}
            {allImages.length > 1 && (
              <button
                onClick={lightboxPrev}
                className="absolute left-2 md:left-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all z-10"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
            )}

            {/* Gambar Lightbox */}
            <div className="relative w-full h-full max-h-[85vh] max-w-[1200px]">
              <Image
                src={currentActiveImage}
                alt="Product Zoom"
                fill
                className="object-contain"
                priority
                sizes="100vw"
              />
            </div>

            {/* Next Lightbox */}
            {allImages.length > 1 && (
              <button
                onClick={lightboxNext}
                className="absolute right-2 md:right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all z-10"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            )}
            
            {/* Counter Lightbox */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-1 rounded-full text-white text-sm font-medium">
              {currentGlobalIndex + 1} / {allImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;