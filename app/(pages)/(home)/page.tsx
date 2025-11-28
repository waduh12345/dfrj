"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Star,
  Heart,
  ShoppingBag,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import en from "@/translations/home/en";
import id from "@/translations/home/id";
import { useCallback, useMemo, useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  useGetProductMerkListQuery,
  useGetProductMerkBySlugQuery,
} from "@/services/products-merk.service";
import type { ProductMerk } from "@/types/master/product-merk";

import { useGetProductListQuery } from "@/services/product.service";
import type { Product } from "@/types/admin/product";
import DotdLoader from "@/components/loader/3dot";
import { fredoka, sniglet } from "@/lib/fonts";
import ImageCarousel from "@/components/main/home-page/caraousel-hero";
import Swal from "sweetalert2";

// --- IMPORTS MODE EDIT ---
import { useEditMode } from "@/hooks/use-edit-mode";
import {
  EditableText,
  EditableLink,
  EditableImage,
} from "@/components/ui/editable";
import {
  EditableSection,
  BackgroundConfig,
} from "@/components/ui/editable-section";

export default function HomePage() {
  const router = useRouter();

  // Hook translation akan mentrigger re-render jika bahasa berubah
  const t = useTranslation({ en, id });

  // 1. Hook Edit Mode
  const isEditMode = useEditMode();

  // ========== STATES CONFIG BACKGROUND (Default Values) ==========

  const [heroBg, setHeroBg] = useState<BackgroundConfig>({
    type: "gradient",
    color1: "#d1fae5",
    color2: "#e0f2fe",
    direction: "to bottom right",
  });

  const [categoriesBg, setCategoriesBg] = useState<BackgroundConfig>({
    type: "solid",
    color1: "#ffffff",
  });

  const [featuresBg, setFeaturesBg] = useState<BackgroundConfig>({
    type: "solid",
    color1: "#DFF19D",
  });

  const [productsBg, setProductsBg] = useState<BackgroundConfig>({
    type: "solid",
    color1: "#ffffff",
  });

  const [ctaBg, setCtaBg] = useState<BackgroundConfig>({
    type: "gradient",
    color1: "#ecfdf5",
    color2: "#fff1f2",
    direction: "to bottom right",
  });

  // ========== Local UI states ==========
  const [page, setPage] = useState<number>(1);
  const paginate = 8;
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  // ========== Editable Content States (Inisialisasi Awal) ==========
  const [editableData, setEditableData] = useState({
    heroTitle1: t["hero-title-1"],
    heroTitle2: t["hero-title-2"],
    heroTitle3: t["hero-title-3"],
    heroSubtitle: t["hero-subtitle"],
    heroCtaText: t["hero-cta"],
    heroCtaUrl: "/product",
    heroStat1: `1000+ ${t["hero-other-1"]}`,
    heroStat2: `50+ ${t["hero-other-2"]}`,
    sec2Title1: t["sec-2-title-1"],
    sec2Title2: t["sec-2-title-2"],
    sec2Subtitle: t["sec-2-subtitle"],
    sec3Title1: t["sec-3-title-1"],
    sec3Title2: t["sec-3-title-2"],
    sec4Title1: t["sec-4-title-1"],
    sec4Title2: t["sec-4-title-2"],
    sec4Subtitle: t["sec-4-subtitle"],
    sec4CtaMain: t["sec-4-cta"],
    sec5Title1: t["sec-5-title-1"],
    sec5Title2: t["sec-5-title-2"],
    sec5Title3: t["sec-5-title-3"],
    sec5Title4: t["sec-5-title-4"],
    sec5Title5: t["sec-5-title-5"],
    sec5Subtitle: t["sec-5-subtitle"],
    sec5Btn1Text: t["sec-5-cta-1"],
    sec5Btn1Url: "/product",
    sec5Btn2Text: t["sec-5-cta-2"],
    sec5Btn2Url: "/about",
  });

  const [featureItems, setFeatureItems] = useState([
    {
      id: 1,
      icon: "/images/advantage/advantage-1.png",
      title: t["sec-3-item-1-title"],
      description: t["sec-3-item-1-content"],
    },
    {
      id: 2,
      icon: "/images/advantage/advantage-2.png",
      title: t["sec-3-item-2-title"],
      description: t["sec-3-item-2-content"],
    },
    {
      id: 3,
      icon: "/images/advantage/advantage-3.png",
      title: t["sec-3-item-3-title"],
      description: t["sec-3-item-3-content"],
    },
    {
      id: 4,
      icon: "/images/advantage/advantage-4.png",
      title: t["sec-3-item-4-title"],
      description: t["sec-3-item-4-content"],
    },
  ]);

  // ========== LOGIC SINKRONISASI BAHASA ==========
  // useEffect ini akan jalan setiap kali objek `t` berubah (bahasa ganti)
  useEffect(() => {
    // 1. Update Teks Umum
    setEditableData((prev) => ({
      ...prev,
      heroTitle1: t["hero-title-1"],
      heroTitle2: t["hero-title-2"],
      heroTitle3: t["hero-title-3"],
      heroSubtitle: t["hero-subtitle"],
      heroCtaText: t["hero-cta"],
      heroStat1: `1000+ ${t["hero-other-1"]}`,
      heroStat2: `50+ ${t["hero-other-2"]}`,
      sec2Title1: t["sec-2-title-1"],
      sec2Title2: t["sec-2-title-2"],
      sec2Subtitle: t["sec-2-subtitle"],
      sec3Title1: t["sec-3-title-1"],
      sec3Title2: t["sec-3-title-2"],
      sec4Title1: t["sec-4-title-1"],
      sec4Title2: t["sec-4-title-2"],
      sec4Subtitle: t["sec-4-subtitle"],
      sec4CtaMain: t["sec-4-cta"],
      sec5Title1: t["sec-5-title-1"],
      sec5Title2: t["sec-5-title-2"],
      sec5Title3: t["sec-5-title-3"],
      sec5Title4: t["sec-5-title-4"],
      sec5Title5: t["sec-5-title-5"],
      sec5Subtitle: t["sec-5-subtitle"],
      sec5Btn1Text: t["sec-5-cta-1"],
      sec5Btn2Text: t["sec-5-cta-2"],
    }));

    // 2. Update Feature Items (Array)
    setFeatureItems((prevItems) => [
      {
        ...prevItems[0],
        title: t["sec-3-item-1-title"],
        description: t["sec-3-item-1-content"],
      },
      {
        ...prevItems[1],
        title: t["sec-3-item-2-title"],
        description: t["sec-3-item-2-content"],
      },
      {
        ...prevItems[2],
        title: t["sec-3-item-3-title"],
        description: t["sec-3-item-3-content"],
      },
      {
        ...prevItems[3],
        title: t["sec-3-item-4-title"],
        description: t["sec-3-item-4-content"],
      },
    ]);
  }, [t]); // Dependency [t] penting agar update saat bahasa berubah

  const updateFeature = (
    index: number,
    field: Exclude<keyof (typeof featureItems)[0], "id">,
    value: string
  ) => {
    const newFeatures = [...featureItems];
    newFeatures[index][field] = value;
    setFeatureItems(newFeatures);
  };

  const updateContent = (key: keyof typeof editableData, val: string) => {
    setEditableData((prev) => ({ ...prev, [key]: val }));
  };

  // ========== Data Fetching & Helpers ==========
  const {
    data: listData,
    isLoading: isListLoading,
    isError: isListError,
  } = useGetProductMerkListQuery({ page, paginate });
  const categories: ProductMerk[] = useMemo(
    () => listData?.data ?? [],
    [listData]
  );
  const lastPage = listData?.last_page ?? 1;
  const currentPage = listData?.current_page ?? 1;
  const total = listData?.total ?? 0;

  const { data: detailData, isLoading: isDetailLoading } =
    useGetProductMerkBySlugQuery(selectedSlug ?? "", { skip: !selectedSlug });
  const handleOpenDetail = useCallback((slug: string) => {
    setSelectedSlug(slug);
    setOpenDetail(true);
  }, []);
  const handleCloseDetail = useCallback(() => {
    setOpenDetail(false);
    setTimeout(() => setSelectedSlug(null), 150);
  }, []);

  const gradientByIndex = (i: number) => {
    const list = [
      "from-emerald-500 to-teal-500",
      "from-lime-500 to-green-500",
      "from-pink-500 to-rose-500",
      "from-cyan-500 to-blue-500",
      "from-violet-500 to-purple-500",
      "from-amber-500 to-orange-500",
      "from-sky-500 to-indigo-500",
      "from-fuchsia-500 to-pink-500",
    ];
    return list[i % list.length];
  };
  const safeCategoryImg = (img: ProductMerk["image"]) =>
    typeof img === "string" && img.length > 0 ? img : "/kategori.webp";
  const formatIDR = (value: number | string) => {
    const num = typeof value === "string" ? Number(value) : value ?? 0;
    if (!Number.isFinite(num)) return "Rp 0";
    return `Rp ${num.toLocaleString("id-ID")}`;
  };
  const safeProductImg = (img: Product["image"]) =>
    typeof img === "string" && img.length > 0 ? img : "/produk-1.webp";
  const makeBadge = (p: Product) =>
    p.terlaris ? "Best Seller" : p.terbaru ? "New" : "Produk";
  const toInt = (v: unknown) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const {
    data: productList,
    isLoading: isProductsLoading,
    isError: isProductsError,
  } = useGetProductListQuery({ page: 1, paginate: 3 });
  const topProducts: Product[] = useMemo(
    () => productList?.data ?? [],
    [productList]
  );

  const CART_KEY = "cart-storage";
  type CartStorage = {
    state: {
      isOpen: boolean;
      cartItems: Array<Product & { quantity: number }>;
    };
    version: number;
  };

  const addToCart = (product: Product, qty: number = 1) => {
    if (typeof window === "undefined") return;
    let cartData: CartStorage = {
      state: { isOpen: false, cartItems: [] },
      version: 0,
    };
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (raw) {
        cartData = JSON.parse(raw) as CartStorage;
        if (!cartData?.state || !Array.isArray(cartData.state.cartItems)) {
          cartData = { state: { isOpen: false, cartItems: [] }, version: 0 };
        }
      }
    } catch {
      cartData = { state: { isOpen: false, cartItems: [] }, version: 0 };
    }
    const idx = cartData.state.cartItems.findIndex((i) => i.id === product.id);
    if (idx >= 0) {
      cartData.state.cartItems[idx].quantity += qty;
    } else {
      cartData.state.cartItems.push({ ...product, quantity: qty });
    }
    localStorage.setItem(CART_KEY, JSON.stringify(cartData));
    window.dispatchEvent(new CustomEvent("cartUpdated"));
    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: "Produk berhasil ditambahkan ke keranjang",
      position: "top-end",
      toast: true,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: "white",
      color: "#333",
      iconColor: "#ff5722",
      customClass: { popup: "toast-popup" },
      willOpen: (toast) => {
        toast.style.background =
          "linear-gradient(45deg, #ff6ec7, #f7bb97, #f7b7d7, #ff9a8b, #ff8cdd)";
      },
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ======================= HERO SECTION ======================= */}
      <EditableSection
        isEditMode={isEditMode}
        config={heroBg}
        onSave={setHeroBg}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full opacity-80 animate-pulse shadow-lg pointer-events-none"></div>
        <div className="absolute bottom-32 right-16 w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full opacity-80 animate-pulse delay-1000 shadow-lg pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-gradient-to-br from-lime-500 to-green-500 rounded-full opacity-70 animate-pulse delay-500 shadow-lg pointer-events-none"></div>

        <div className="relative z-10 container mx-auto px-6 lg:px-12 mt-22 md:mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="text-center lg:text-left space-y-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 rounded-full shadow-lg">
                <Image
                  src="https://8nc5ppykod.ufs.sh/f/H265ZJJzf6brl2xfj3HmgY8fkG9iJeAzFQyqLh5pudMZH7l2"
                  alt="Logo"
                  width={15}
                  height={15}
                />
                <span className={`text-sm font-medium ${sniglet.className}`}>
                  Eco Friendly & Enriching
                </span>
              </div>

              <h1
                className={`${fredoka.className} text-5xl lg:text-6xl font-semibold text-gray-900 leading-tight`}
              >
                <EditableText
                  isEditMode={isEditMode}
                  text={editableData.heroTitle1}
                  onSave={(val) => updateContent("heroTitle1", val)}
                />
                <EditableText
                  isEditMode={isEditMode}
                  text={editableData.heroTitle2}
                  onSave={(val) => updateContent("heroTitle2", val)}
                  as="span"
                  className="block bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"
                />
                <EditableText
                  isEditMode={isEditMode}
                  text={editableData.heroTitle3}
                  onSave={(val) => updateContent("heroTitle3", val)}
                  as="span"
                  className="block bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent"
                />
              </h1>

              <EditableText
                isEditMode={isEditMode}
                text={editableData.heroSubtitle}
                onSave={(val) => updateContent("heroSubtitle", val)}
                as="p"
                multiline={true}
                className={`text-xl text-gray-600 max-w-xl ${sniglet.className}`}
              />

              <div className="flex flex-col sm:flex-row pt-4">
                <EditableLink
                  isEditMode={isEditMode}
                  label={editableData.heroCtaText}
                  href={editableData.heroCtaUrl}
                  onSave={(l, h) => {
                    updateContent("heroCtaText", l);
                    updateContent("heroCtaUrl", h);
                  }}
                  icon={ShoppingBag}
                  className="w-full lg:w-1/2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold px-8 py-4 rounded-2xl text-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 transform hover:scale-105"
                />
              </div>

              <div className="flex items-center gap-8 pt-8">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full border-2 border-white shadow-md"
                      ></div>
                    ))}
                  </div>
                  <EditableText
                    isEditMode={isEditMode}
                    text={editableData.heroStat1}
                    onSave={(val) => updateContent("heroStat1", val)}
                    as="span"
                    className="text-sm text-gray-600 font-semibold"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-1 font-semibold">
                    4.9/5 Rating
                  </span>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative w-full md:h-[600px] rounded-3xl overflow-hidden shadow-2xl mb-2 lg:mb-0">
                <ImageCarousel />
                <div className="absolute top-6 right-6 bg-gradient-to-r from-emerald-600 to-teal-600 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-xl">
                  <div className="flex items-center gap-2 text-white">
                    <Image
                      src="https://8nc5ppykod.ufs.sh/f/H265ZJJzf6brUEfLy3BWSPehBoYMr1DQnmd5C42qTFw3NOEk"
                      alt="Leaf"
                      width={20}
                      height={20}
                    />
                    <span
                      className={`font-semibold text-sm ${sniglet.className}`}
                    >
                      Plant Based Colorant
                    </span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block absolute -bottom-6 -left-6 bg-gradient-to-r from-pink-500 to-rose-500 p-6 rounded-2xl shadow-xl">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">50+</div>
                  <EditableText
                    isEditMode={isEditMode}
                    text={editableData.heroStat2}
                    onSave={(val) => updateContent("heroStat2", val)}
                    className="text-sm text-white/90"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </EditableSection>

      {/* ===================== Categories Section ===================== */}
      <EditableSection
        isEditMode={isEditMode}
        config={categoriesBg}
        onSave={setCategoriesBg}
        className="py-20"
      >
        <div className="container mx-auto px-6 lg:px-12">
          <div className={`text-center mb-10 ${fredoka.className}`}>
            <h2 className="text-4xl lg:text-5xl font-semibold text-gray-900 mb-6 flex flex-col items-center justify-center">
              <EditableText
                isEditMode={isEditMode}
                text={editableData.sec2Title1}
                onSave={(val) => updateContent("sec2Title1", val)}
                as="span"
              />
              <EditableText
                isEditMode={isEditMode}
                text={editableData.sec2Title2}
                onSave={(val) => updateContent("sec2Title2", val)}
                as="span"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"
              />
            </h2>
            <EditableText
              isEditMode={isEditMode}
              text={editableData.sec2Subtitle}
              onSave={(val) => updateContent("sec2Subtitle", val)}
              as="p"
              multiline={true}
              className="text-xl text-gray-600 text-center mx-auto"
            />
          </div>

          {isListLoading && (
            <div className="w-full flex items-center justify-center py-10">
              <DotdLoader />
            </div>
          )}
          {isListError && (
            <div className="text-center text-red-600 py-10">
              Gagal memuat data.
            </div>
          )}

          {!isListLoading && !isListError && (
            <>
              {categories.length === 0 ? (
                <div className="text-center text-gray-600 py-10">
                  Belum ada merk.
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-8">
                  {categories.map((category, index) => (
                    <div key={category.id} className="group h-96">
                      <div className="relative h-full flex flex-col overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 transform">
                        <div
                          className={`bg-gradient-to-br ${gradientByIndex(
                            index
                          )} h-48 flex items-center justify-center overflow-hidden`}
                        >
                          <Image
                            src={safeCategoryImg(category.image)}
                            alt={category.name}
                            width={220}
                            height={220}
                            className="rounded-lg object-cover w-full opacity-80 max-h-48 group-hover:opacity-100 transition-all group-hover:scale-110 transform duration-500"
                          />
                        </div>
                        <div className="p-6 bg-white flex flex-col flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-bold text-gray-900">
                              {category.name}
                            </h3>
                            {Boolean(category.status) ? (
                              <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full text-xs font-semibold">
                                <CheckCircle className="w-4 h-4" />
                                {t["sec-2-card-active"]}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-xs font-semibold">
                                {t["sec-2-card-inactive"]}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                            {category.description || "—"}
                          </p>
                          <div className="mt-auto">
                            <button
                              onClick={() => handleOpenDetail(category.slug)}
                              className="flex items-center text-emerald-600 font-semibold"
                            >
                              <span>{t["sec-2-card-cta"]}</span>
                              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {total > paginate && (
                <div className="flex items-center justify-center gap-3 mt-10">
                  <Button
                    variant="outline"
                    disabled={currentPage <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Sebelumnya
                  </Button>
                  <span className="text-sm text-gray-600">
                    Halaman {currentPage} / {lastPage}
                  </span>
                  <Button
                    variant="outline"
                    disabled={currentPage >= lastPage}
                    onClick={() =>
                      setPage((p) => (p < lastPage ? p + 1 : lastPage))
                    }
                  >
                    Selanjutnya
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </EditableSection>

      {/* ===================== Features Section ===================== */}
      <EditableSection
        isEditMode={isEditMode}
        config={featuresBg}
        onSave={setFeaturesBg}
        className="py-20"
      >
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mx-auto">
            <h2
              className={`text-4xl lg:text-5xl font-extrabold text-gray-900 ${fredoka.className} flex flex-col items-center`}
            >
              <EditableText
                isEditMode={isEditMode}
                text={editableData.sec3Title1}
                onSave={(val) => updateContent("sec3Title1", val)}
                as="span"
              />
              <EditableText
                isEditMode={isEditMode}
                text={editableData.sec3Title2}
                onSave={(val) => updateContent("sec3Title2", val)}
                as="span"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"
              />
            </h2>
            <p className="mt-4 text-gray-700">{t["sec-2-subtitle"]}</p>
          </div>

          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6">
            {featureItems.map((f, i) => (
              <div
                key={f.id}
                className="group bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-32 h-32 rounded-2xl bg-emerald-50 flex items-center justify-center shadow-sm mx-auto p-1 overflow-hidden relative">
                  <div className="scale-130 relative w-full h-full flex items-center justify-center">
                    <EditableImage
                      isEditMode={isEditMode}
                      src={f.icon}
                      width={100}
                      height={100}
                      onSave={(url) => updateFeature(i, "icon", url)}
                      alt="icon"
                      className="object-contain"
                    />
                  </div>
                </div>
                <h3 className="mt-5 text-center text-base font-semibold text-gray-900">
                  <EditableText
                    isEditMode={isEditMode}
                    text={f.title}
                    onSave={(val) => updateFeature(i, "title", val)}
                    as="span"
                  />
                </h3>
                <div className="mt-2 text-center text-sm text-gray-600">
                  <EditableText
                    isEditMode={isEditMode}
                    text={f.description}
                    onSave={(val) => updateFeature(i, "description", val)}
                    as="p"
                    multiline
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </EditableSection>

      {/* ===================== Modal (SAMA) ===================== */}
      <Dialog open={openDetail} onOpenChange={setOpenDetail}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isDetailLoading ? "Memuat..." : detailData?.name ?? "Detail"}
            </DialogTitle>
            <DialogDescription>
              Informasi kategori yang dipilih.
            </DialogDescription>
          </DialogHeader>
          {isDetailLoading ? (
            <div className="w-full flex justify-center py-8">
              <DotdLoader />
            </div>
          ) : detailData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gray-50">
                <Image
                  src={safeCategoryImg(detailData.image)}
                  alt={detailData.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {Boolean(detailData.status) ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full text-xs font-semibold">
                      <CheckCircle className="w-4 h-4" />
                      Aktif
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-gray-700 bg-gray-100 px-2 py-1 rounded-full text-xs font-semibold">
                      Nonaktif
                    </span>
                  )}
                  <span className="text-xs text-gray-500">
                    Slug: <b>{detailData.slug}</b>
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-700">
                    Deskripsi
                  </h4>
                  <p className="text-sm text-gray-600">
                    {detailData.description || "—"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-gray-600">
              Data tidak ditemukan.
            </div>
          )}
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={handleCloseDetail}>
              Tutup
            </Button>
            {detailData?.slug && (
              <Button
                className="bg-emerald-700 hover:bg-emerald-800"
                onClick={() =>
                  router.push(`/product?category=${detailData.slug}`)
                }
              >
                Lihat Produk
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===================== Products Section ===================== */}
      <EditableSection
        isEditMode={isEditMode}
        config={productsBg}
        onSave={setProductsBg}
        className="py-20"
      >
        <div className="container mx-auto px-6 lg:px-12">
          <div className={`text-center mb-16 ${fredoka.className}`}>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 flex justify-center gap-2 items-center">
              <EditableText
                isEditMode={isEditMode}
                text={editableData.sec4Title1}
                onSave={(val) => updateContent("sec4Title1", val)}
                as="span"
              />
              <EditableText
                isEditMode={isEditMode}
                text={editableData.sec4Title2}
                onSave={(val) => updateContent("sec4Title2", val)}
                as="span"
                className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent"
              />
            </h2>
            <EditableText
              isEditMode={isEditMode}
              text={editableData.sec4Subtitle}
              onSave={(val) => updateContent("sec4Subtitle", val)}
              as="p"
              multiline
              className="text-xl text-gray-600 text-center mx-auto"
            />
          </div>

          {isProductsLoading && (
            <div className="w-full flex justify-center items-center py-10">
              <DotdLoader />
            </div>
          )}
          {isProductsError && (
            <div className="text-center text-red-600 py-10">
              Gagal memuat produk.
            </div>
          )}

          {!isProductsLoading && !isProductsError && (
            <>
              {topProducts.length === 0 ? (
                <div className="text-center text-gray-600 py-10">
                  Belum ada produk.
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8">
                  {topProducts.map((product) => {
                    const ratingInt = Math.min(
                      5,
                      Math.max(0, Math.round(toInt(product.rating)))
                    );
                    return (
                      <div
                        key={product.id}
                        className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:-translate-y-2 transform border border-gray-100"
                      >
                        <div className="relative">
                          <Image
                            src={safeProductImg(product.image)}
                            alt={product.name}
                            width={300}
                            height={300}
                            className="w-full h-32 md:h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-4 left-4">
                            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                              {makeBadge(product)}
                            </span>
                          </div>
                          <div className="absolute top-4 right-4">
                            <button className="bg-white/95 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors hover:scale-110 transform duration-200">
                              <Heart className="w-5 h-5 text-gray-600 hover:text-pink-500 transition-colors" />
                            </button>
                          </div>
                        </div>
                        <div className="p-4 md:p-6">
                          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                            {product.name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 mb-4">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i <= ratingInt
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">
                              ({toInt(product.total_reviews)}{" "}
                              {t["sec-4-card-reviews"]})
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mb-6">
                            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                              {formatIDR(product.price)}
                            </span>
                          </div>
                          <button
                            onClick={() => addToCart(product)}
                            className="text-xs w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold py-3 rounded-2xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                          >
                            <ShoppingBag className="w-4 md:w-5 h-4 md:h-5" />
                            {t["sec-4-card-cta"]}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
          <div className="text-center flex justify-center mt-12">
            <EditableLink
              isEditMode={isEditMode}
              label={editableData.sec4CtaMain}
              href="/product"
              onSave={(l) => updateContent("sec4CtaMain", l)}
              icon={ArrowRight}
              className="w-[17rem] bg-white text-emerald-600 border-2 border-emerald-600 font-semibold px-4 md:px-8 py-4 rounded-2xl text-sm md:text-lg hover:bg-emerald-600 hover:text-white transition-all duration-300 inline-flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            />
          </div>
        </div>
      </EditableSection>

      {/* ===================== CTA Section (Bottom) ===================== */}
      <EditableSection
        isEditMode={isEditMode}
        config={ctaBg}
        onSave={setCtaBg}
        className="py-20 relative overflow-hidden"
      >
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full opacity-80 animate-pulse shadow-lg pointer-events-none"></div>
        <div className="absolute bottom-32 right-16 w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full opacity-80 animate-pulse delay-1000 shadow-lg pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-gradient-to-br from-lime-500 to-green-500 rounded-full opacity-70 animate-pulse delay-500 shadow-lg pointer-events-none"></div>

        <div className="container mx-auto px-6 lg:px-12 text-center relative z-10">
          <div className={`max-w-4xl mx-auto ${fredoka.className}`}>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900 flex flex-wrap justify-center gap-2">
              <EditableText
                isEditMode={isEditMode}
                text={editableData.sec5Title1}
                onSave={(v) => updateContent("sec5Title1", v)}
                as="span"
              />
              <EditableText
                isEditMode={isEditMode}
                text={editableData.sec5Title2}
                onSave={(v) => updateContent("sec5Title2", v)}
                as="span"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"
              />
              <EditableText
                isEditMode={isEditMode}
                text={editableData.sec5Title3}
                onSave={(v) => updateContent("sec5Title3", v)}
                as="span"
              />
              <EditableText
                isEditMode={isEditMode}
                text={editableData.sec5Title4}
                onSave={(v) => updateContent("sec5Title4", v)}
                as="span"
                className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent"
              />
              <EditableText
                isEditMode={isEditMode}
                text={editableData.sec5Title5}
                onSave={(v) => updateContent("sec5Title5", v)}
                as="span"
              />
            </h2>
            <EditableText
              isEditMode={isEditMode}
              text={editableData.sec5Subtitle}
              onSave={(val) => updateContent("sec5Subtitle", val)}
              as="p"
              multiline
              className="text-xl mb-8 text-center mx-auto text-gray-600"
            />
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <EditableLink
                isEditMode={isEditMode}
                label={editableData.sec5Btn1Text}
                href={editableData.sec5Btn1Url}
                onSave={(l, h) => {
                  updateContent("sec5Btn1Text", l);
                  updateContent("sec5Btn1Url", h);
                }}
                icon={ShoppingBag}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold px-8 py-4 rounded-2xl text-lg hover:bg-gray-100 transition-all duration-300 inline-flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transform hover:scale-105"
              />
              <EditableLink
                isEditMode={isEditMode}
                label={editableData.sec5Btn2Text}
                href={editableData.sec5Btn2Url}
                onSave={(l, h) => {
                  updateContent("sec5Btn2Text", l);
                  updateContent("sec5Btn2Url", h);
                }}
                className="border-2 border-white font-semibold px-8 py-4 rounded-2xl text-lg bg-white text-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              />
            </div>
          </div>
        </div>
      </EditableSection>

      {/* INDIKATOR MODE EDIT */}
      {isEditMode && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full shadow-lg z-50 text-sm font-bold flex items-center gap-2 animate-bounce pointer-events-none">
          Mode Editor Aktif
        </div>
      )}
    </div>
  );
}