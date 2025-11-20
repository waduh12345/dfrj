"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { useGetProductBySlugQuery } from "@/services/product.service"; // API service
import Image from "next/image";
import { ChevronLeft, ChevronRight, ShoppingCart, X } from "lucide-react";
import useCart from "@/hooks/use-cart";
import Swal from "sweetalert2";
import { useTranslation } from "@/hooks/use-translation";
import id from "@/translations/product/id";
import en from "@/translations/product/en";
import Link from "next/link";

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
    const t = useTranslation({ id, en });

  // State untuk menyimpan gambar yang dipilih, diinisialisasi dengan gambar utama produk jika ada
  const [selectedImage, setSelectedImage] = useState<string>("");
  // State untuk lightbox modal
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  // optional index of selected image
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  useEffect(() => {
    if (product && selectedImage === "") {
      const first = (product.image as string) || "";
      setSelectedImage(first);
      setSelectedIndex(0);
    }
  }, [product, selectedImage]);

  const addToCart = () => {
    if (product) {
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

  // Handler klik thumbnail: set selected image and index
  function handleClickThumb(url: string, idx: number) {
    setSelectedImage(url);
    setSelectedIndex(idx);
  }

  // Handler klik utama: buka lightbox dengan gambar yang sedang dipilih
  function handleOpenLightbox() {
    if (!selectedImage) return;
    setLightboxOpen(true);
  }

  // navigate next/prev in lightbox
  function lightboxNext() {
    if (!images.length) return;
    const next = (selectedIndex + 1) % images.length;
    setSelectedIndex(next);
    setSelectedImage(images[next]);
  }
  function lightboxPrev() {
    if (!images.length) return;
    const prev = (selectedIndex - 1 + images.length) % images.length;
    setSelectedIndex(prev);
    setSelectedImage(images[prev]);
  }

  return (
    <div className="relative w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-[6rem] bg-white">
      <div className="absolute fixed top-[7rem] left-[3rem] z-50">
        <Link
          href="/product"
          className="flex items-center bg-white hover:bg-gray-200 px-4 py-2 rounded-lg shadow-xl font-bold"
        >
          <ChevronLeft className="w-6 h-6" />
          {t["button-back"]}
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
        {/* Kolom Kiri: Galeri Gambar Produk */}
        <div className="lg:sticky lg:top-8 self-start relative">
          {/* Gambar Utama yang Dipilih */}
          <div
            className="relative w-full aspect-square mb-4 overflow-hidden rounded-xl shadow-2xl cursor-zoom-in"
            onClick={handleOpenLightbox}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleOpenLightbox();
            }}
          >
            <Image
              src={selectedImage || productImageUrl}
              alt={product.name}
              width={1200}
              height={1200}
              className="w-full h-full object-cover transform transition-all duration-500 hover:scale-105"
              priority
            />
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 overflow-x-auto backdrop-blur-md rounded-lg py-2 px-4">
              {images.map((img, i) => {
                const isActive = img === (selectedImage || productImageUrl);
                return (
                  <button
                    key={i}
                    onClick={() => handleClickThumb(img, i)}
                    className={`relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden ring-1 ${
                      isActive
                        ? "ring-sky-500 shadow-lg"
                        : "ring-zinc-200 hover:ring-sky-200"
                    }`}
                    aria-pressed={isActive}
                    title={`Gambar ${i + 1}`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      width={160}
                      height={160}
                      className="object-cover w-full h-full"
                    />
                  </button>
                );
              })}
            </div>
          )}
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

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-w-[1200px] w-full max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prev */}
            {images.length > 1 && (
              <button
                onClick={lightboxPrev}
                aria-label="Sebelumnya"
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-white"
              >
                <ChevronLeft />
              </button>
            )}

            <div className="w-full h-full flex items-center justify-center">
              <Image
                src={selectedImage || productImageUrl}
                alt={product.name}
                width={1200}
                height={1200}
                className="max-h-[88vh] object-contain"
                priority
              />
            </div>

            {/* Next */}
            {images.length > 1 && (
              <button
                onClick={lightboxNext}
                aria-label="Berikutnya"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-white"
              >
                <ChevronRight />
              </button>
            )}

            {/* Close */}
            <button
              onClick={() => setLightboxOpen(false)}
              aria-label="Tutup"
              className="absolute top-4 right-4 rounded-lg bg-white/80 p-2 shadow hover:bg-white"
            >
              <X />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;