"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import {
  Heart,
  ShoppingCart,
  Eye,
  Star,
  Search,
  Grid3X3,
  List,
  Sparkles,
  Package,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { fredoka, sniglet } from "@/lib/fonts";
import { Product } from "@/types/admin/product";
import {
  useGetProductListQuery,
  useGetProductBySlugQuery,
} from "@/services/product.service";
import DotdLoader from "@/components/loader/3dot";

// ==== Cart
import useCart from "@/hooks/use-cart";
import { useTranslation } from "@/hooks/use-translation";
import id from "@/translations/product/id";
import en from "@/translations/product/en";

// SweetAlert2
import Swal from "sweetalert2";
import { useRouter, useSearchParams } from "next/navigation";

// --- IMPORTS MODE EDIT ---
import { useEditMode } from "@/hooks/use-edit-mode";
import { EditableText } from "@/components/ui/editable";
import {
  EditableSection,
  BackgroundConfig,
} from "@/components/ui/editable-section";

type ViewMode = "grid" | "list";

// Komponen utama (Wrapper untuk Suspense)
export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <DotdLoader />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const t = useTranslation({ id, en });
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Hook Edit Mode
  const isEditMode = useEditMode();

  // === STATE UNTUK EDITABLE HERO ===
  // Background awal sesuai design (#F6CCD0)
  const [heroBg, setHeroBg] = useState<BackgroundConfig>({
    type: "solid",
    color1: "#F6CCD0",
  });

  // Text content state
  const [heroTexts, setHeroTexts] = useState({
    heroBadge: t["hero-badge"],
    heroTitle: t["hero-title"],
    heroTitleHighlight: t["hero-title-highlight"],
    heroSubtitle: t["hero-subtitle"],
    heroBullet1: t["hero-bullet-1"],
    heroBullet2: t["hero-bullet-2"],
    heroBullet3: t["hero-bullet-3"],
  });

  // === SINKRONISASI BAHASA ===
  // Update state editable saat bahasa berubah
  useEffect(() => {
    setHeroTexts((prev) => ({
      ...prev,
      heroBadge: t["hero-badge"],
      heroTitle: t["hero-title"],
      heroTitleHighlight: t["hero-title-highlight"],
      heroSubtitle: t["hero-subtitle"],
      heroBullet1: t["hero-bullet-1"],
      heroBullet2: t["hero-bullet-2"],
      heroBullet3: t["hero-bullet-3"],
    }));
  }, [t]);

  // Helper update text
  const updateHeroText = (key: keyof typeof heroTexts, val: string) => {
    setHeroTexts((prev) => ({ ...prev, [key]: val }));
  };

  // === PRODUCT LOGIC (EXISTING) ===
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [filter, setFilter] = useState({
    category: "all",
    ageGroup: "all",
    priceRange: "all",
    sort: "featured",
  });

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setFilter((prev) => ({ ...prev, category: categoryParam }));
    }
  }, [searchParams]);

  const { addItem } = useCart();
  const ITEMS_PER_PAGE = 12;

  const {
    data: listResp,
    isLoading,
    isError,
    refetch,
  } = useGetProductListQuery({
    page: currentPage,
    paginate: ITEMS_PER_PAGE,
  });

  const totalPages = useMemo(() => listResp?.last_page ?? 1, [listResp]);
  const products = useMemo(() => listResp?.data ?? [], [listResp]);

  const {
    data: detailProduct,
    isLoading: isDetailLoading,
    error: isDetailError,
  } = useGetProductBySlugQuery(selectedSlug ?? "", {
    skip: !selectedSlug,
  });

  const openProductDetailPage = (slug: string) => {
    router.push(`/product/detail?slug=${slug}`);
  };

  const addToCart = (product: Product) => {
    addItem(product);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    }
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: `${product.name} berhasil ditambahkan ke keranjang`,
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    });
  };

  const openProductModal = (p: Product) => {
    setSelectedSlug(p.slug);
    setIsModalOpen(true);
  };

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  const getImageUrl = (p: Product): string => {
    if (typeof p.image === "string" && p.image) return p.image;
    const media = (p as unknown as { media?: Array<{ original_url: string }> })
      .media;
    if (Array.isArray(media) && media.length > 0 && media[0]?.original_url) {
      return media[0].original_url;
    }
    return "/api/placeholder/400/400";
  };

  const toNumber = (val: number | string): number => {
    if (typeof val === "number") return val;
    const parsed = parseFloat(val);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(term) ||
        p.category_name.toLowerCase().includes(term);
      const matchCategory =
        filter.category === "all" || p.category_name === filter.category;
      const price = p.price;
      const matchPrice =
        filter.priceRange === "all" ||
        (filter.priceRange === "under-100k" && price < 100_000) ||
        (filter.priceRange === "100k-200k" &&
          price >= 100_000 &&
          price <= 200_000) ||
        (filter.priceRange === "above-200k" && price > 200_000);
      return matchSearch && matchCategory && matchPrice;
    });
  }, [products, searchTerm, filter.category, filter.priceRange]);

  const sortedProducts = useMemo(() => {
    const arr = [...filteredProducts];
    switch (filter.sort) {
      case "price-low":
        return arr.sort((a, b) => a.price - b.price);
      case "price-high":
        return arr.sort((a, b) => b.price - a.price);
      case "rating":
        return arr.sort((a, b) => toNumber(b.rating) - toNumber(a.rating));
      case "newest":
        return arr;
      default:
        return arr;
    }
  }, [filteredProducts, filter.sort]);

  const handleCategoryChange = (categoryName: string) => {
    setFilter({ ...filter, category: categoryName });
    const params = new URLSearchParams(searchParams.toString());
    if (categoryName === "all") {
      params.delete("category");
    } else {
      params.set("category", categoryName);
    }
    router.replace(`/product?${params.toString()}`, { scroll: false });
  };

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-3">
            Gagal memuat produk.
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 rounded-xl border"
          >
            Coba lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#DFF19D]/10">
      {/* ===================== Header / Hero (EDITABLE) ===================== */}
      <EditableSection
        isEditMode={isEditMode}
        config={heroBg}
        onSave={setHeroBg}
        className="relative pt-24 pb-12 px-6 lg:px-12 overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-24 w-[40rem] h-[40rem] rounded-full bg-[#DFF19D] blur-3xl opacity-80" />
          <div className="absolute -top-10 right-[-10%] w-[28rem] h-[28rem] rounded-full bg-[#F6CCD0] blur-3xl opacity-40" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] rounded-full bg-[#BFF0F5] blur-3xl opacity-40" />
        </div>

        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#DFF19D]/20 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-[#DFF19D]" />
            <EditableText
              isEditMode={isEditMode}
              text={heroTexts.heroBadge}
              onSave={(v) => updateHeroText("heroBadge", v)}
              as="span"
              className={cn(
                fredoka.className,
                "text-sm font-medium text-emerald-900"
              )}
            />
          </div>

          <h1
            className={cn(
              fredoka.className,
              "text-4xl lg:text-6xl font-bold text-[#5C4A3B] mb-6"
            )}
          >
            <EditableText
              isEditMode={isEditMode}
              text={heroTexts.heroTitle}
              onSave={(v) => updateHeroText("heroTitle", v)}
              as="span"
            />
            <EditableText
              isEditMode={isEditMode}
              text={heroTexts.heroTitleHighlight}
              onSave={(v) => updateHeroText("heroTitleHighlight", v)}
              as="span"
              className="block text-[#35966d]"
            />
          </h1>

          <EditableText
            isEditMode={isEditMode}
            text={heroTexts.heroSubtitle}
            onSave={(v) => updateHeroText("heroSubtitle", v)}
            as="p"
            multiline
            className={cn(
              sniglet.className,
              "text-xl text-gray-700 text-center mx-auto mb-8"
            )}
          />
        </div>
      </EditableSection>

      {/* ===================== Filters & Search (NON-EDITABLE) ===================== */}
      <section className="px-6 lg:px-12 mb-8">
        <div className="container mx-auto">
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-[#DFF19D]/40">
            <div className="flex flex-wrap lg:flex-nowrap items-center gap-4">
              {/* Search */}
              <div className="relative flex-1 min-w-[300px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t["search-placeholder"]}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#DFF19D] focus:border-transparent"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                <select
                  value={filter.category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#DFF19D] bg-white"
                >
                  <option value="all">{t["filter-category"]}</option>
                  {Array.from(
                    new Set(products.map((p) => p.category_name))
                  ).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <select
                  value={filter.priceRange}
                  onChange={(e) =>
                    setFilter({ ...filter, priceRange: e.target.value })
                  }
                  className="px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#DFF19D] bg-white"
                >
                  <option value="all">{t["filter-price"]}</option>
                  <option value="under-100k">{t["filter-price-under"]}</option>
                  <option value="100k-200k">{t["filter-price-mid"]}</option>
                  <option value="above-200k">{t["filter-price-above"]}</option>
                </select>
              </div>

              {/* View Mode */}
              {/* <div className="flex bg-gray-100 rounded-2xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-xl transition-colors ${
                    viewMode === "grid"
                      ? "bg-white shadow-sm text-emerald-700"
                      : "text-gray-500 hover:text-emerald-700"
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-xl transition-colors ${
                    viewMode === "list"
                      ? "bg-white shadow-sm text-emerald-700"
                      : "text-gray-500 hover:text-emerald-700"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid / List */}
      <section className="px-6 lg:px-12 mb-12">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            {isLoading ? (
              <div className="w-full flex justify-center items-center min-h-48">
                <DotdLoader />
              </div>
            ) : (
              <p className="text-gray-600">
                {t["list-showing"]
                  .replace("{count}", String(sortedProducts?.length ?? 0))
                  .replace("{total}", String(products?.length ?? 0))}
                {filter.category !== "all" && (
                  <span className="ml-2 bg-[#A3B18A]/20 text-[#A3B18A] px-2 py-1 rounded-lg text-sm font-medium">
                    Filter: {filter.category}
                  </span>
                )}
              </p>
            )}
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 md:gap-8">
              {sortedProducts.map((product) => {
                const img = getImageUrl(product);
                const ratingNum = toNumber(product.rating);
                const reviews = product.total_reviews;

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:-translate-y-2"
                  >
                    <div
                      onClick={() => openProductDetailPage(product.slug)}
                      className="relative cursor-pointer"
                    >
                      <Image
                        src={img}
                        alt={product.name}
                        width={400}
                        height={300}
                        className="w-full h-32 md:h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openProductDetailPage(product.slug);
                          }}
                          className="p-2 bg-white text-gray-600 hover:text-[#A3B18A] rounded-full shadow-lg transition-colors"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4 md:p-6">
                      <div className="mb-3">
                        <span className="text-xs text-[#A3B18A] font-medium">
                          {product.category_name}
                        </span>
                        <h3 className="text-lg font-bold text-gray-900 mt-1 line-clamp-2">
                          {product.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= Math.round(ratingNum)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          ({reviews})
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-lg md:text-2xl font-bold text-[#A3B18A]">
                          Rp {product.price.toLocaleString("id-ID")}
                        </span>
                      </div>
                      <div className="flex gap-2 bg-[#A3B18A] rounded-2xl">
                        <button
                          onClick={() => addToCart(product)}
                          className="text-xs md:text-base flex-1 bg-black/50 text-white px-1 py-3 rounded-2xl font-semibold hover:bg-[#A3B18A]/90 transition-colors flex items-center justify-center gap-1 md:gap-2"
                        >
                          <ShoppingCart className="w-4 md:w-5 h-5" />
                          {t["list-add-cart"]}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-6">
              {sortedProducts.map((product) => {
                const img = getImageUrl(product);
                const ratingNum = toNumber(product.rating);
                const reviews = product.total_reviews;
                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="relative md:w-80">
                        <Image
                          src={img}
                          alt={product.name}
                          width={400}
                          height={300}
                          className="w-full h-64 md:h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 p-6 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <span className="text-sm text-[#A3B18A] font-medium">
                                {product.category_name}
                              </span>
                              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                                {product.name}
                              </h3>
                            </div>
                          </div>
                          <p className="text-gray-600 mb-4 line-clamp-3">
                            {product.description}
                          </p>
                          <div className="flex items-center gap-2 mb-4">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= Math.round(ratingNum)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">
                              ({reviews} ulasan)
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-xl md:text-3xl font-bold text-[#A3B18A]">
                              Rp {product.price.toLocaleString("id-ID")}
                            </span>
                          </div>
                          <div className="flex gap-2 md:gap-3">
                            <button
                              onClick={() => openProductModal(product)}
                              className="px-2 md:px-6 py-1 md:py-3 border border-[#A3B18A] text-[#A3B18A] rounded-2xl hover:bg-[#A3B18A] hover:text-white transition-colors"
                            >
                              Detail
                            </button>
                            <button
                              onClick={() => addToCart(product)}
                              className="px-4 md:px-6 py-2 md:py-3 bg-[#A3B18A] text-white rounded-2xl hover:bg-[#A3B18A]/90 transition-colors flex items-center gap-2"
                            >
                              <ShoppingCart className="w-5 h-5" />
                              {t["list-add-cart"]}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && sortedProducts.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-[#A3B18A]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-12 h-12 text-[#A3B18A]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {t["empty-title"]}
              </h3>
              <p className="text-gray-600 mb-6">{t["empty-subtitle"]}</p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilter({
                    category: "all",
                    ageGroup: "all",
                    priceRange: "all",
                    sort: "featured",
                  });
                  const params = new URLSearchParams(searchParams.toString());
                  params.delete("category");
                  router.replace(`/product?${params.toString()}`);
                }}
                className="bg-[#A3B18A] text-white px-6 py-3 rounded-2xl hover:bg-[#A3B18A]/90 transition-colors"
              >
                {t["empty-reset"]}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <section className="px-6 lg:px-12 mb-12">
          <div className="container mx-auto">
            <div className="flex justify-center items-center gap-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-6 py-3 border border-[#A3B18A] text-[#A3B18A] rounded-2xl hover:bg-[#A3B18A] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t["pagination-prev"]}
              </button>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-12 h-12 rounded-2xl font-semibold transition-colors ${
                        currentPage === page
                          ? "bg-[#A3B18A] text-white"
                          : "border border-[#A3B18A] text-[#A3B18A] hover:bg-[#A3B18A] hover:text-white"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-6 py-3 border border-[#A3B18A] text-[#A3B18A] rounded-2xl hover:bg-[#A3B18A] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t["pagination-next"]}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Product Detail Modal */}
      {isModalOpen && selectedSlug && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {t["modal-title"]}
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedSlug(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-2xl transition-colors"
                >
                  ✕
                </button>
              </div>
              {isDetailError && (
                <div className="text-red-600">{t["modal-error"]}</div>
              )}
              {isDetailLoading && (
                <div className="w-full flex justify-center items-center min-h-32">
                  <DotdLoader />
                </div>
              )}
              {detailProduct && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative">
                    <Image
                      src={getImageUrl(detailProduct)}
                      alt={detailProduct.name}
                      width={500}
                      height={400}
                      className="w-full h-96 object-cover rounded-2xl"
                    />
                  </div>
                  <div>
                    <span className="text-sm text-[#A3B18A] font-medium">
                      {detailProduct.category_name}
                    </span>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2 mb-4">
                      {detailProduct.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-5 h-5 ${
                              star <= Math.round(toNumber(detailProduct.rating))
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-gray-600">
                        ({detailProduct.total_reviews} ulasan)
                      </span>
                    </div>
                    <p className="text-gray-600 mb-6">
                      {detailProduct.description}
                    </p>
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-4xl font-bold text-[#A3B18A]">
                        Rp {detailProduct.price.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span className="font-medium">
                          {t["modal-category"]}
                        </span>
                        <span>{detailProduct.category_name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span className="font-medium">{t["modal-brand"]}</span>
                        <span>{detailProduct.merk_name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span className="font-medium">{t["modal-stock"]}</span>
                        <span>{detailProduct.stock}</span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          addToCart(detailProduct);
                          setIsModalOpen(false);
                          setSelectedSlug(null);
                        }}
                        className="flex-1 bg-[#A3B18A] text-white py-4 rounded-2xl font-semibold hover:bg-[#A3B18A]/90 transition-colors flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        {t["modal-add-cart"]}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* INDIKATOR MODE EDIT */}
      {isEditMode && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full shadow-lg z-50 text-sm font-bold flex items-center gap-2 animate-bounce pointer-events-none">
          Mode Editor Aktif
        </div>
      )}
    </div>
  );
}