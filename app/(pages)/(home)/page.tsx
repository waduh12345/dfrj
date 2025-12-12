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
// Import Hooks
import { useTranslation } from "@/hooks/use-translation";
import { useLanguage } from "@/contexts/LanguageContext";
// Import Translations
import en from "@/translations/home/en";
import id from "@/translations/home/id";

import { useCallback, useMemo, useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";

// --- SERVICES ---
import {
  useGetProductMerkListQuery,
  useGetProductMerkBySlugQuery,
} from "@/services/products-merk.service";
import type { ProductMerk } from "@/types/master/product-merk";

// Service Hero
import {
  useGetHeroListQuery,
  useCreateHeroMutation,
  useUpdateHeroMutation,
} from "@/services/customize/home/hero.service";

// Service Kategori Produk
import {
  useGetKategoriProdukListQuery,
  useCreateKategoriProdukMutation,
  useUpdateKategoriProdukMutation,
} from "@/services/customize/home/kategori-produk.service";

// Service Mengapa (Features)
import {
  useGetMengapaListQuery,
  useCreateMengapaMutation,
  useUpdateMengapaMutation,
} from "@/services/customize/home/why.service"; // Pastikan path ini benar (why.service / mengapa.service)

import { useGetProductListQuery } from "@/services/product.service";
import type { Product } from "@/types/admin/product";

// Components & Utils
import DotdLoader from "@/components/loader/3dot";
import { fredoka, sniglet } from "@/lib/fonts";
import ImageCarousel from "@/components/main/home-page/caraousel-hero";
import Swal from "sweetalert2";
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
import { useCreateProdukMutation, useGetProdukListQuery, useUpdateProdukMutation } from "@/services/customize/home/product.service";
import { useCreateCTAMutation, useGetCTAListQuery, useUpdateCTAMutation } from "@/services/customize/home/cta.service";

function HomeContent() {
  const router = useRouter();

  // 1. Ambil Language Context & Translation
  const { lang } = useLanguage();
  const t = useTranslation({ en, id }); // Static translation

  const isEditMode = useEditMode();

  // ========== STATES CONFIG BACKGROUND ==========
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

  // Client Code State
  const [clientCode, setClientCode] = useState<string>("");

  useEffect(() => {
    const code = localStorage.getItem("code_client");
    if (code) setClientCode(code);
  }, []);

  // ==========================================
  // 1. API: HERO SECTION
  // ==========================================
  const { data: heroApiResult, refetch: refetchHero } = useGetHeroListQuery(
    { client_code: clientCode, bahasa: lang },
    { skip: !clientCode }
  );

  const [createHero, { isLoading: isCreatingHero }] = useCreateHeroMutation();
  const [updateHero, { isLoading: isUpdatingHero }] = useUpdateHeroMutation();

  const currentHeroData = useMemo(() => {
    if (heroApiResult?.data?.items && heroApiResult.data.items.length > 0) {
      return heroApiResult.data.items[0];
    }
    return null;
  }, [heroApiResult]);

  // ==========================================
  // 2. API: KATEGORI PRODUK SECTION
  // ==========================================
  const { data: catApiResult, refetch: refetchCategory } =
    useGetKategoriProdukListQuery(
      { client_code: clientCode, bahasa: lang },
      { skip: !clientCode }
    );

  const [createCategory, { isLoading: isCreatingCategory }] =
    useCreateKategoriProdukMutation();
  const [updateCategory, { isLoading: isUpdatingCategory }] =
    useUpdateKategoriProdukMutation();

  const currentCategoryData = useMemo(() => {
    if (catApiResult?.data?.items && catApiResult.data.items.length > 0) {
      return catApiResult.data.items[0];
    }
    return null;
  }, [catApiResult]);

  // ==========================================
  // 3. API: FEATURES / MENGAPA SECTION
  // ==========================================
  const { data: mengapaApiResult, refetch: refetchMengapa } =
    useGetMengapaListQuery(
      { client_code: clientCode, bahasa: lang },
      { skip: !clientCode }
    );

  const [createMengapa, { isLoading: isCreatingMengapa }] =
    useCreateMengapaMutation();
  const [updateMengapa, { isLoading: isUpdatingMengapa }] =
    useUpdateMengapaMutation();

  const currentMengapaData = useMemo(() => {
    if (
      mengapaApiResult?.data?.items &&
      mengapaApiResult.data.items.length > 0
    ) {
      return mengapaApiResult.data.items[0];
    }
    return null;
  }, [mengapaApiResult]);

  const { data: produkApiResult, refetch: refetchProduk } =
    useGetProdukListQuery(
      { client_code: clientCode, bahasa: lang },
      { skip: !clientCode }
    );

  const [createProduk, { isLoading: isCreatingProduk }] =
    useCreateProdukMutation();
  const [updateProduk, { isLoading: isUpdatingProduk }] =
    useUpdateProdukMutation();

  const currentProdukData = useMemo(() => {
    if (produkApiResult?.data?.items && produkApiResult.data.items.length > 0) {
      return produkApiResult.data.items[0];
    }
    return null;
  }, [produkApiResult]);

  const { data: ctaApiResult, refetch: refetchCTA } = useGetCTAListQuery(
    { client_code: clientCode, bahasa: lang },
    { skip: !clientCode }
  );

  const [createCTA, { isLoading: isCreatingCTA }] = useCreateCTAMutation();
  const [updateCTA, { isLoading: isUpdatingCTA }] = useUpdateCTAMutation();

  const currentCTAData = useMemo(() => {
    if (ctaApiResult?.data?.items && ctaApiResult.data.items.length > 0) {
      return ctaApiResult.data.items[0];
    }
    return null;
  }, [ctaApiResult]);

  // ========== Editable Content States (Inisialisasi Awal) ==========
  const [editableData, setEditableData] = useState({
    // Hero Data
    heroTitle1: t["hero-title-1"],
    heroTitle2: t["hero-title-2"],
    heroTitle3: t["hero-title-3"],
    heroSubtitle: t["hero-subtitle"],
    heroCtaText: t["hero-cta"],
    heroCtaUrl: "/product",
    heroStat1: `1000+ ${t["hero-other-1"]}`,
    heroStat2: `50+ ${t["hero-other-2"]}`,

    // Categories Data
    sec2Title1: t["sec-2-title-1"],
    sec2Title2: t["sec-2-title-2"],
    sec2Subtitle: t["sec-2-subtitle"],

    // Features Data (Header)
    sec3Title1: t["sec-3-title-1"],
    sec3Title2: t["sec-3-title-2"],

    // Products Data
    sec4Title1: t["sec-4-title-1"],
    sec4Title2: t["sec-4-title-2"],
    sec4Subtitle: t["sec-4-subtitle"],
    sec4CtaMain: t["sec-4-cta"],
    sec4CtaUrl: t["sec-4-cta-url"],

    // CTA Data
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

  // ========== MAIN SYNCHRONIZATION EFFECT ==========
  // Effect tunggal untuk menyinkronkan data API atau Translation ke State UI
  useEffect(() => {
    // Default values (Translation)
    const defaults = {
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
      sec4CtaUrl: "/product",

      sec5Title1: t["sec-5-title-1"],
      sec5Title2: t["sec-5-title-2"],
      sec5Title3: t["sec-5-title-3"],
      sec5Title4: t["sec-5-title-4"],
      sec5Title5: t["sec-5-title-5"],
      sec5Subtitle: t["sec-5-subtitle"],
      sec5Btn1Text: t["sec-5-cta-1"],
      sec5Btn2Text: t["sec-5-cta-2"],
      sec5Btn1Url: "/product",
      sec5Btn2Url: "/about",
    };

    setEditableData((prev) => ({
      ...prev,
      // --- MAPPING HERO ---
      heroTitle1: currentHeroData?.judul || defaults.heroTitle1,
      heroTitle2: currentHeroData?.sub_judul || defaults.heroTitle2,
      heroTitle3: currentHeroData?.tagline || defaults.heroTitle3,
      heroSubtitle: currentHeroData?.deskripsi || defaults.heroSubtitle,
      heroCtaText: currentHeroData?.button_text_1 || defaults.heroCtaText,
      heroCtaUrl: currentHeroData?.button_text_2 || defaults.heroCtaUrl,
      heroStat1: currentHeroData?.info_1 || defaults.heroStat1,
      heroStat2: currentHeroData?.info_nilai_1 || defaults.heroStat2,

      // --- MAPPING CATEGORIES ---
      sec2Title1: currentCategoryData?.judul || defaults.sec2Title1,
      sec2Title2: currentCategoryData?.sub_judul || defaults.sec2Title2,
      sec2Subtitle: currentCategoryData?.deskripsi || defaults.sec2Subtitle,

      // --- MAPPING FEATURES (HEADER) ---
      sec3Title1: currentMengapaData?.judul || defaults.sec3Title1,
      sec3Title2: currentMengapaData?.sub_judul || defaults.sec3Title2,

      // --- MAPPING PRODUCTS SECTION ---
      sec4Title1: currentProdukData?.judul || defaults.sec4Title1,
      sec4Title2: currentProdukData?.sub_judul || defaults.sec4Title2,
      sec4Subtitle: currentProdukData?.deskripsi || defaults.sec4Subtitle,
      sec4CtaMain: currentProdukData?.button_text || defaults.sec4CtaMain,
      sec4CtaUrl: currentProdukData?.link || "/product",

      // --- MAPPING CTA SECTION ---
      // Judul utama & highlight
      sec5Title1: currentCTAData?.judul || defaults.sec5Title1,
      sec5Title2: currentCTAData?.sub_judul || defaults.sec5Title2,

      // Memanfaatkan field info_judul untuk menyimpan pecahan judul lainnya
      sec5Title3: currentCTAData?.info_judul_1 || defaults.sec5Title3,
      sec5Title4: currentCTAData?.info_judul_2 || defaults.sec5Title4,
      sec5Title5: currentCTAData?.info_judul_3 || defaults.sec5Title5,

      sec5Subtitle: currentCTAData?.deskripsi || defaults.sec5Subtitle,

      // Buttons
      sec5Btn1Text: currentCTAData?.button_1 || defaults.sec5Btn1Text,
      sec5Btn1Url: currentCTAData?.button_link_1 || defaults.sec5Btn1Url,
      sec5Btn2Text: currentCTAData?.button_2 || defaults.sec5Btn2Text,
      sec5Btn2Url: currentCTAData?.button_link_2 || defaults.sec5Btn2Url,
    }));

    // --- MAPPING FEATURE ITEMS (ARRAY) ---
    setFeatureItems([
      {
        id: 1,
        icon:
          currentMengapaData?.info_icon_1 ||
          "/images/advantage/advantage-1.png",
        title: currentMengapaData?.info_judul_1 || t["sec-3-item-1-title"],
        description:
          currentMengapaData?.info_deskripsi_1 || t["sec-3-item-1-content"],
      },
      {
        id: 2,
        icon:
          currentMengapaData?.info_icon_2 ||
          "/images/advantage/advantage-2.png",
        title: currentMengapaData?.info_judul_2 || t["sec-3-item-2-title"],
        description:
          currentMengapaData?.info_deskripsi_2 || t["sec-3-item-2-content"],
      },
      {
        id: 3,
        icon:
          currentMengapaData?.info_icon_3 ||
          "/images/advantage/advantage-3.png",
        title: currentMengapaData?.info_judul_3 || t["sec-3-item-3-title"],
        description:
          currentMengapaData?.info_deskripsi_3 || t["sec-3-item-3-content"],
      },
      {
        id: 4,
        icon:
          currentMengapaData?.info_icon_4 ||
          "/images/advantage/advantage-4.png",
        title: currentMengapaData?.info_judul_4 || t["sec-3-item-4-title"],
        description:
          currentMengapaData?.info_deskripsi_4 || t["sec-3-item-4-content"],
      },
    ]);
  }, [currentHeroData, currentCategoryData, currentMengapaData, t, lang]); // Dependency Array

  // ========== HANDLER: SAVE HERO ==========
  const handleSaveHero = async () => {
    if (!clientCode) return Swal.fire("Error", "Client Code missing", "error");
    try {
      const formData = new FormData();
      formData.append("client_id", "5");
      formData.append("bahasa", lang);
      formData.append("status", "1");

      formData.append("judul", editableData.heroTitle1);
      formData.append("sub_judul", editableData.heroTitle2 || "");
      formData.append("tagline", editableData.heroTitle3 || "");
      formData.append("deskripsi", editableData.heroSubtitle);
      formData.append("button_text_1", editableData.heroCtaText || "");
      formData.append("button_text_2", editableData.heroCtaUrl || "");
      formData.append("info_1", editableData.heroStat1 || "");
      formData.append("info_nilai_1", editableData.heroStat2 || "");

      if (currentHeroData?.id) {
        await updateHero({ id: currentHeroData.id, data: formData }).unwrap();
        Swal.fire(
          "Success",
          `Hero (${lang.toUpperCase()}) updated!`,
          "success"
        );
      } else {
        await createHero(formData).unwrap();
        Swal.fire(
          "Success",
          `Hero (${lang.toUpperCase()}) created!`,
          "success"
        );
      }
      refetchHero();
    } catch (error) {
      console.error("Save Hero Error:", error);
      Swal.fire("Error", "Failed to save Hero", "error");
    }
  };

  // ========== HANDLER: SAVE CATEGORIES ==========
  const handleSaveCategories = async () => {
    if (!clientCode) return Swal.fire("Error", "Client Code missing", "error");
    try {
      const formData = new FormData();
      formData.append("client_id", "5");
      formData.append("bahasa", lang);
      formData.append("status", "1");

      formData.append("judul", editableData.sec2Title1);
      formData.append("sub_judul", editableData.sec2Title2 || "");
      formData.append("deskripsi", editableData.sec2Subtitle);

      if (currentCategoryData?.id) {
        await updateCategory({
          id: currentCategoryData.id,
          data: formData,
        }).unwrap();
        Swal.fire(
          "Success",
          `Categories (${lang.toUpperCase()}) updated!`,
          "success"
        );
      } else {
        await createCategory(formData).unwrap();
        Swal.fire(
          "Success",
          `Categories (${lang.toUpperCase()}) created!`,
          "success"
        );
      }
      refetchCategory();
    } catch (error) {
      console.error("Save Category Error:", error);
      Swal.fire("Error", "Failed to save Categories", "error");
    }
  };

  // ========== HANDLER: SAVE FEATURES / MENGAPA ==========
  const handleSaveFeatures = async () => {
    if (!clientCode) return Swal.fire("Error", "Client Code missing", "error");
    try {
      const formData = new FormData();
      formData.append("client_id", "5");
      formData.append("bahasa", lang);
      formData.append("status", "1");

      // Headers
      formData.append("judul", editableData.sec3Title1);
      formData.append("sub_judul", editableData.sec3Title2 || "");
      formData.append("tagline", "Features");

      // Features Items (1-4)
      formData.append("info_judul_1", featureItems[0].title);
      formData.append("info_deskripsi_1", featureItems[0].description);
      // formData.append("info_icon_1", featureItems[0].icon);

      formData.append("info_judul_2", featureItems[1].title);
      formData.append("info_deskripsi_2", featureItems[1].description);

      formData.append("info_judul_3", featureItems[2].title);
      formData.append("info_deskripsi_3", featureItems[2].description);

      formData.append("info_judul_4", featureItems[3].title);
      formData.append("info_deskripsi_4", featureItems[3].description);

      if (currentMengapaData?.id) {
        await updateMengapa({
          id: currentMengapaData.id,
          data: formData,
        }).unwrap();
        Swal.fire(
          "Success",
          `Features (${lang.toUpperCase()}) updated!`,
          "success"
        );
      } else {
        await createMengapa(formData).unwrap();
        Swal.fire(
          "Success",
          `Features (${lang.toUpperCase()}) created!`,
          "success"
        );
      }
      refetchMengapa();
    } catch (error) {
      console.error("Save Features Error:", error);
      Swal.fire("Error", "Failed to save Features", "error");
    }
  };

  // ========== HANDLER: SAVE PRODUCTS SECTION ==========
  const handleSaveProducts = async () => {
    if (!clientCode) return Swal.fire("Error", "Client Code missing", "error");
    try {
      const formData = new FormData();
      formData.append("client_id", "5");
      formData.append("bahasa", lang);
      formData.append("status", "1");

      formData.append("judul", editableData.sec4Title1);
      formData.append("sub_judul", editableData.sec4Title2 || "");
      formData.append("deskripsi", editableData.sec4Subtitle);
      formData.append("button_text", editableData.sec4CtaMain);
      formData.append("link", editableData.sec4CtaUrl);

      if (currentProdukData?.id) {
        await updateProduk({
          id: currentProdukData.id,
          data: formData,
        }).unwrap();
        Swal.fire(
          "Success",
          `Products Section (${lang.toUpperCase()}) updated!`,
          "success"
        );
      } else {
        await createProduk(formData).unwrap();
        Swal.fire(
          "Success",
          `Products Section (${lang.toUpperCase()}) created!`,
          "success"
        );
      }
      refetchProduk();
    } catch (error) {
      console.error("Save Products Error:", error);
      Swal.fire("Error", "Failed to save Products Section", "error");
    }
  };

  // ========== HANDLER: SAVE CTA SECTION ==========
  const handleSaveCTA = async () => {
    if (!clientCode) return Swal.fire("Error", "Client Code missing", "error");
    try {
      const formData = new FormData();
      formData.append("client_id", "5");
      formData.append("bahasa", lang);
      formData.append("status", "1");

      // Mapping UI Title parts to API fields
      formData.append("judul", editableData.sec5Title1);
      formData.append("sub_judul", editableData.sec5Title2 || "");
      formData.append("info_judul_1", editableData.sec5Title3 || "");
      formData.append("info_judul_2", editableData.sec5Title4 || "");
      formData.append("info_judul_3", editableData.sec5Title5 || "");

      formData.append("deskripsi", editableData.sec5Subtitle);

      // Buttons
      formData.append("button_1", editableData.sec5Btn1Text);
      formData.append("button_link_1", editableData.sec5Btn1Url);
      formData.append("button_2", editableData.sec5Btn2Text);
      formData.append("button_link_2", editableData.sec5Btn2Url);

      // Field wajib lain yang mungkin tidak dipakai di UI tapi wajib di API (isi default)
      formData.append("info_deskripsi_1", "-");
      formData.append("info_deskripsi_2", "-");
      formData.append("info_deskripsi_3", "-");
      formData.append("info_judul_4", "-");
      formData.append("info_deskripsi_4", "-");

      if (currentCTAData?.id) {
        await updateCTA({
          id: currentCTAData.id,
          data: formData,
        }).unwrap();
        Swal.fire(
          "Success",
          `CTA Section (${lang.toUpperCase()}) updated!`,
          "success"
        );
      } else {
        await createCTA(formData).unwrap();
        Swal.fire(
          "Success",
          `CTA Section (${lang.toUpperCase()}) created!`,
          "success"
        );
      }
      refetchCTA();
    } catch (error) {
      console.error("Save CTA Error:", error);
      Swal.fire("Error", "Failed to save CTA Section", "error");
    }
  };

  // Helper Functions
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

  const safeCategoryImg = (img: ProductMerk["image"]) =>
    typeof img === "string" && img.length > 0 ? img : "/kategori.webp";
  const formatIDR = (value: number | string) => {
    const num = typeof value === "string" ? Number(value) : value ?? 0;
    if (!Number.isFinite(num)) return "Rp 0";
    return `Rp ${num.toLocaleString("id-ID")}`;
  };
  const safeProductImg = (img: Product["image"]) =>
    typeof img === "string" && img.length > 0 ? img : "/produk-1.webp";
  const toInt = (v: unknown) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };
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

  // Data Fetching List Products
  const {
    data: listData,
    isLoading: isListLoading,
    isError: isListError,
  } = useGetProductMerkListQuery({ page, paginate });
  const categories = useMemo(() => listData?.data ?? [], [listData]);
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

  const {
    data: productList,
    isLoading: isProductsLoading,
    isError: isProductsError,
  } = useGetProductListQuery({ page: 1, paginate: 3 });
  const topProducts = useMemo(() => productList?.data ?? [], [productList]);

  const CART_KEY = "cart-storage";
  const addToCart = (product: Product, qty: number = 1) => {
    if (typeof window === "undefined") return;
    let cartData: {
      state: {
        isOpen: boolean;
        cartItems: Array<Product & { quantity: number }>;
      };
      version: number;
    } = {
      state: { isOpen: false, cartItems: [] },
      version: 0,
    };
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.state && Array.isArray(parsed.state.cartItems)) {
          cartData = parsed;
        }
      }
    } catch {}
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
      title: "Success!",
      text: "Product added to cart",
      position: "top-end",
      toast: true,
      showConfirmButton: false,
      timer: 1500,
      background: "white",
      color: "#333",
      iconColor: "#ff5722",
    });
  };

  const makeBadge = (p: Product) =>
    p.terlaris ? "Best Seller" : p.terbaru ? "New" : "Product";

  return (
    <div className="min-h-screen bg-white">
      {/* ======================= HERO SECTION ======================= */}
      <EditableSection
        isEditMode={isEditMode}
        config={heroBg}
        onSave={setHeroBg}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {isEditMode && (
          <div className="absolute top-24 left-6 z-50 animate-in fade-in zoom-in duration-300">
            <Button
              onClick={handleSaveHero}
              disabled={isCreatingHero || isUpdatingHero}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg border-2 border-white/20"
              size="sm"
            >
              {isCreatingHero || isUpdatingHero ? (
                <div className="flex items-center gap-2">
                  <DotdLoader /> Saving...
                </div>
              ) : (
                `💾 Save Hero (${lang.toUpperCase()})`
              )}
            </Button>
          </div>
        )}
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
                className={`${fredoka.className} text-5xl lg:text-6xl font-semibold text-[#5C4A3B] leading-tight`}
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
        className="py-20 relative"
      >
        {/* BUTTON SAVE CATEGORY */}
        {isEditMode && (
          <div className="absolute top-4 left-6 z-50">
            <Button
              onClick={handleSaveCategories}
              disabled={isCreatingCategory || isUpdatingCategory}
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg border-2 border-white/20"
              size="sm"
            >
              {isCreatingCategory || isUpdatingCategory ? (
                <div className="flex items-center gap-2">
                  <DotdLoader /> Saving...
                </div>
              ) : (
                `💾 Save Category (${lang.toUpperCase()})`
              )}
            </Button>
          </div>
        )}

        <div className="container mx-auto px-6 lg:px-12">
          <div className={`text-center mb-10 ${fredoka.className}`}>
            <h2 className="text-4xl lg:text-5xl font-semibold text-[#5C4A3B] mb-6 flex flex-col items-center justify-center">
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
                            <h3 className="text-xl font-bold text-[#5C4A3B]">
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
        className="py-20 relative"
      >
        {/* BUTTON SAVE FEATURES */}
        {isEditMode && (
          <div className="absolute top-4 left-6 z-50">
            <Button
              onClick={handleSaveFeatures}
              disabled={isCreatingMengapa || isUpdatingMengapa}
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg border-2 border-white/20"
              size="sm"
            >
              {isCreatingMengapa || isUpdatingMengapa ? (
                <div className="flex items-center gap-2">
                  <DotdLoader /> Saving...
                </div>
              ) : (
                `💾 Save Features (${lang.toUpperCase()})`
              )}
            </Button>
          </div>
        )}

        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mx-auto">
            <h2
              className={`text-4xl lg:text-5xl font-extrabold text-[#5C4A3B] ${fredoka.className} flex flex-col items-center`}
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
                <h3 className="mt-5 text-center text-base font-semibold text-[#5C4A3B]">
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

      {/* ===================== Products Section ===================== */}
      <EditableSection
        isEditMode={isEditMode}
        config={productsBg}
        onSave={setProductsBg}
        className="py-20 relative"
      >
        {/* BUTTON SAVE PRODUCTS */}
        {isEditMode && (
          <div className="absolute top-4 left-6 z-50">
            <Button
              onClick={handleSaveProducts}
              disabled={isCreatingProduk || isUpdatingProduk}
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg border-2 border-white/20"
              size="sm"
            >
              {isCreatingProduk || isUpdatingProduk ? (
                <div className="flex items-center gap-2">
                  <DotdLoader /> Saving...
                </div>
              ) : (
                `💾 Save Products (${lang.toUpperCase()})`
              )}
            </Button>
          </div>
        )}

        <div className="container mx-auto px-6 lg:px-12">
          <div className={`text-center mb-16 ${fredoka.className}`}>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#5C4A3B] mb-6 flex justify-center gap-2 items-center flex-wrap">
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
                          <h3 className="text-lg md:text-xl font-bold text-[#5C4A3B] mb-2 line-clamp-1">
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
        {/* BUTTON SAVE CTA */}
        {isEditMode && (
          <div className="absolute top-4 left-6 z-50">
            <Button
              onClick={handleSaveCTA}
              disabled={isCreatingCTA || isUpdatingCTA}
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg border-2 border-white/20"
              size="sm"
            >
              {isCreatingCTA || isUpdatingCTA ? (
                <div className="flex items-center gap-2">
                  <DotdLoader /> Saving...
                </div>
              ) : (
                `💾 Save CTA (${lang.toUpperCase()})`
              )}
            </Button>
          </div>
        )}

        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full opacity-80 animate-pulse shadow-lg pointer-events-none"></div>
        <div className="absolute bottom-32 right-16 w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full opacity-80 animate-pulse delay-1000 shadow-lg pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-gradient-to-br from-lime-500 to-green-500 rounded-full opacity-70 animate-pulse delay-500 shadow-lg pointer-events-none"></div>

        <div className="container mx-auto px-6 lg:px-12 text-center relative z-10">
          <div className={`max-w-4xl mx-auto ${fredoka.className}`}>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-[#5C4A3B] flex flex-wrap justify-center gap-2">
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

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <DotdLoader />
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}