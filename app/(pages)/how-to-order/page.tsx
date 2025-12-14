"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { cn } from "@/lib/utils";
import { fredoka, sniglet } from "@/lib/fonts";
import { useTranslation } from "@/hooks/use-translation";
import { useLanguage } from "@/contexts/LanguageContext";
import id from "@/translations/how-to-order/id";
import en from "@/translations/how-to-order/en";
import {
  ShoppingCart,
  CreditCard,
  User,
  Package,
  CheckCircle,
  Sparkles,
  Shield,
  Truck,
  HeadphonesIcon,
  Mail,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Utensils, // Added for Culinary
  Gift,     // Added for Crafts
} from "lucide-react";

// --- IMPORTS MODE EDIT ---
import { useEditMode } from "@/hooks/use-edit-mode";
import { EditableText, EditableImage } from "@/components/ui/editable";
import {
  EditableSection,
  BackgroundConfig,
} from "@/components/ui/editable-section";
import DotdLoader from "@/components/loader/3dot";

// --- INTERFACES ---
interface Step {
  id: number;
  title: string;
  description: string;
  details: string[];
  icon: React.ReactNode;
  image: string;
  tips?: string[];
}
interface FAQ {
  question: string;
  answer: string;
}

// =========================================
// KOMPONEN KONTEN (LOGIC UTAMA)
// =========================================
function HowToOrderContent() {
  const { lang } = useLanguage();
  const t = useTranslation({ id, en });
  const isEditMode = useEditMode();
  const [activeStep, setActiveStep] = useState(1);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // === THEME & BACKGROUND STATES ===
  const THEME = {
    primary: "#d43893ff",
    bubbleA: "#DFF19D",
    bubbleB: "#BFF0F5",
    COCOA: "#7F1D1D",
    textMain: "#5B4A3B",
  };
  const [pageBg, setPageBg] = useState<BackgroundConfig>({
    type: "gradient",
    color1: "#FFFFFF",
    color2: `${THEME.primary}0D`,
    direction: "to bottom",
  });
  const [heroBg, setHeroBg] = useState<BackgroundConfig>({
    type: "solid",
    color1: "transparent",
  }); 
  const [stepsBg, setStepsBg] = useState<BackgroundConfig>({
    type: "solid",
    color1: "transparent",
  });
  const [helpBg, setHelpBg] = useState<BackgroundConfig>({
    type: "gradient",
    color1: THEME.primary,
    color2: "#e05da9",
    direction: "to bottom right", 
  });
  const [faqBg, setFaqBg] = useState<BackgroundConfig>({
    type: "solid",
    color1: "transparent",
  });

  // === LOCAL STATES UNTUK KONTEN EDITABLE ===
  // 1. Hero & Section Titles
  const [heroText, setHeroText] = useState({
    badge: t["hero-badge"],
    title1: t["hero-title-1"],
    title2: t["hero-title-2"],
    subtitle: t["hero-subtitle"],
    navStepTitle1: t["nav-step-title-1"],
    navStepTitle2: t["nav-step-title-2"],
    navStepSubtitle: t["nav-step-subtitle"],
    helpTitle: t["help-title"],
    helpSubtitle: t["help-subtitle"],
    faqTitle1: t["faq-title-1"],
    faqTitle2: t["faq-title-2"],
  });

  // 2. Benefits List
  const [benefitsList, setBenefitsList] = useState([
    {
      icon: <Shield className="w-6 h-6" style={{ color: THEME.primary }} />,
      title: t["hero-item-1-title"],
      description: t["hero-item-1-content"],
    },
    {
      icon: <Truck className="w-6 h-6" style={{ color: THEME.primary }} />,
      title: t["hero-item-2-title"],
      description: t["hero-item-2-content"],
    },
    {
      icon: (
        <HeadphonesIcon className="w-6 h-6" style={{ color: THEME.primary }} />
      ),
      title: t["hero-item-3-title"],
      description: t["hero-item-3-content"],
    },
  ]);

  // 3. Order Steps List (Disesuaikan untuk Difaraja: Kuliner & Kriya)
  const initialSteps: Record<"id" | "en", Step[]> = {
    id: [
      {
        id: 1,
        title: "Pilih Karya & Rasa",
        description:
          "Jelajahi ragam produk kuliner otentik dan kerajinan tangan karya difabelpreneur.",
        details: [
          "Pilih kategori: Kuliner, Fashion, atau Kriya",
          "Baca deskripsi rasa atau spesifikasi bahan",
          "Lihat cerita di balik pembuatan produk",
          "Klik 'Tambah ke Keranjang' untuk memesan",
        ],
        icon: <Utensils className="w-6 h-6 lg:w-8 lg:h-8" />,
        image: "/api/placeholder/500/400",
        tips: [
          "Cek label 'Best Seller' untuk rekomendasi",
          "Pastikan varian rasa sesuai selera",
          "Perhatikan ukuran untuk produk Fashion",
        ],
      },
      {
        id: 2,
        title: "Cek Keranjang",
        description:
          "Pastikan detail pesanan Anda sudah sesuai sebelum melanjutkan pembayaran.",
        details: [
          "Periksa kembali jumlah item",
          "Tambahkan catatan (misal: tingkat kepedasan/warna)",
          "Gunakan kode voucher jika tersedia",
          "Lanjut ke Checkout",
        ],
        icon: <Package className="w-6 h-6 lg:w-8 lg:h-8" />,
        image: "/api/placeholder/500/400",
        tips: [
          "Beli paketan (hampers) lebih hemat",
          "Cek promo gratis ongkir",
          "Pastikan item tidak tertukar",
        ],
      },
      {
        id: 3,
        title: "Info Pengiriman",
        description:
          "Lengkapi alamat untuk memastikan paket kuliner atau kerajinan sampai dengan aman.",
        details: [
          "Isi alamat lengkap & titik lokasi",
          "Pilih kurir (Instant/Sameday disarankan untuk Makanan)",
          "Tambahkan asuransi untuk Kriya pecah belah",
          "Tulis instruksi khusus untuk kurir",
        ],
        icon: <User className="w-6 h-6 lg:w-8 lg:h-8" />,
        image: "/api/placeholder/500/400",
        tips: [
          "Pilih 'Instant' untuk makanan basah",
          "Pastikan nomor HP penerima aktif",
          "Simpan alamat 'Rumah' atau 'Kantor'",
        ],
      },
      {
        id: 4,
        title: "Pembayaran Aman",
        description:
          "Transaksi mudah dan terverifikasi otomatis melalui gateway Midtrans.",
        details: [
          "Pilih metode: QRIS, E-Wallet, atau Transfer",
          "Sistem redirect ke halaman aman Midtrans",
          "Selesaikan pembayaran sesuai nominal",
          "Verifikasi otomatis dalam hitungan detik",
        ],
        icon: <CreditCard className="w-6 h-6 lg:w-8 lg:h-8" />,
        image: "/api/placeholder/500/400",
        tips: [
          "Simpan bukti transfer/screenshot",
          "QRIS adalah metode tercepat",
          "Tidak perlu konfirmasi manual",
        ],
      },
      {
        id: 5,
        title: "Diproses Sepenuh Hati",
        description: "Pesanan Anda dikonfirmasi dan sedang disiapkan oleh tim Difaraja.",
        details: [
          "Notifikasi pesanan masuk via Email/WA",
          "Produk dikemas dengan standar higienis & aman",
          "Quality Control sebelum pengiriman",
          "Resi pengiriman diterbitkan",
        ],
        icon: <Gift className="w-6 h-6 lg:w-8 lg:h-8" />,
        image: "/api/placeholder/500/400",
        tips: [
          "Cek status di menu 'Pesanan Saya'",
          "Makanan dikirim fresh daily",
          "Packing kayu tersedia untuk kriya besar",
        ],
      },
      {
        id: 6,
        title: "Lacak & Apresiasi",
        description: "Pantau perjalanan paket dan berikan ulasan untuk mendukung difabelpreneur.",
        details: [
          "Lacak posisi kurir secara real-time",
          "Konfirmasi saat pesanan diterima",
          "Berikan rating & ulasan foto/video",
          "Bagikan ke media sosial Anda",
        ],
        icon: <Truck className="w-6 h-6 lg:w-8 lg:h-8" />,
        image: "/api/placeholder/500/400",
        tips: [
          "Ulasan Anda sangat berarti bagi kami",
          "Tag @difaraja di social media",
          "Dapatkan poin reward (jika ada)",
        ],
      },
    ],
    en: [
      {
        id: 1,
        title: "Choose Culinary & Craft",
        description: "Explore authentic snacks and handmade crafts by difabelpreneurs.",
        details: [
          "Select category: Food, Fashion, or Craft",
          "Read taste notes or material specs",
          "See the story behind the product",
          "Click 'Add to Cart'",
        ],
        icon: <Utensils className="w-6 h-6 lg:w-8 lg:h-8" />,
        image: "/api/placeholder/500/400",
        tips: ["Check 'Best Seller' labels", "Confirm flavor variants", "Check size charts for Fashion"],
      },
      {
        id: 2,
        title: "Review Cart",
        description: "Ensure your order details are correct before payment.",
        details: ["Check item quantity", "Add notes (e.g., spicy level)", "Use voucher codes", "Proceed to Checkout"],
        icon: <Package className="w-6 h-6 lg:w-8 lg:h-8" />,
        image: "/api/placeholder/500/400",
        tips: ["Buy bundles (hampers) to save", "Check free shipping", "Verify items"],
      },
      {
        id: 3,
        title: "Shipping Info",
        description: "Complete address for safe delivery of food or crafts.",
        details: [
          "Fill full address & pin location",
          "Select courier (Instant/Sameday for Food)",
          "Add insurance for fragile crafts",
          "Add specific instructions",
        ],
        icon: <User className="w-6 h-6 lg:w-8 lg:h-8" />,
        image: "/api/placeholder/500/400",
        tips: ["Choose 'Instant' for wet food", "Active phone number", "Save address labels"],
      },
      {
        id: 4,
        title: "Secure Payment",
        description: "Easy and automatically verified transaction via Midtrans.",
        details: [
          "Select: QRIS, E-Wallet, or Transfer",
          "Redirect to secure Midtrans page",
          "Complete payment",
          "Instant verification",
        ],
        icon: <CreditCard className="w-6 h-6 lg:w-8 lg:h-8" />,
        image: "/api/placeholder/500/400",
        tips: ["Save proof of payment", "QRIS is fastest", "No manual confirm needed"],
      },
      {
        id: 5,
        title: "Crafted with Heart",
        description: "Your order is confirmed and being prepared by the Difaraja team.",
        details: [
          "Order notification via Email/WA",
          "Hygienic & safe packaging",
          "Quality Control check",
          "Tracking number issued",
        ],
        icon: <Gift className="w-6 h-6 lg:w-8 lg:h-8" />,
        image: "/api/placeholder/500/400",
        tips: ["Check status in 'My Orders'", "Food shipped fresh", "Wood packing for large crafts"],
      },
      {
        id: 6,
        title: "Track & Support",
        description: "Monitor delivery and leave a review to empower difabelpreneurs.",
        details: ["Real-time tracking", "Confirm receipt", "Rate & Review", "Share on social media"],
        icon: <Truck className="w-6 h-6 lg:w-8 lg:h-8" />,
        image: "/api/placeholder/500/400",
        tips: ["Your review matters", "Tag @difaraja", "Earn reward points"],
      },
    ],
  };
  const [orderStepsList, setOrderStepsList] = useState<Step[]>(
    initialSteps[lang]
  );

  // 4. FAQs List (Disesuaikan untuk pertanyaan umum Difaraja)
  const initialFaqs: Record<"en" | "id", FAQ[]> = {
    id: [
      {
        question: "Apakah makanan aman dikirim ke luar kota?",
        answer: "Untuk produk kering (keripik, cookies), aman dikirim ke seluruh Indonesia dengan packing standar bubble wrap & kardus. Untuk makanan basah, kami sarankan menggunakan pengiriman Instant/Sameday atau Paxel (Frozen).",
      },
      {
        question: "Apakah bisa request custom hampers?",
        answer: "Tentu! Difaraja melayani pemesanan hampers custom untuk acara kantor, pernikahan, atau ulang tahun. Silakan hubungi admin WhatsApp kami untuk katalog dan penawaran khusus.",
      },
      {
        question: "Berapa lama proses pembuatan produk kriya?",
        answer: "Sebagian besar produk kriya kami Ready Stock. Namun untuk pemesanan dalam jumlah banyak (bulk order), estimasi pengerjaan adalah 3-7 hari kerja tergantung tingkat kerumitan dan jumlah pesanan.",
      },
    ],
    en: [
      { 
        question: "Is the food safe for inter-city shipping?", 
        answer: "Dry products (chips, cookies) are safe for nationwide shipping with standard bubble wrap & box packing. For wet food, we recommend Instant/Sameday delivery or Frozen courier services." 
      },
      { 
        question: "Can I request custom hampers?", 
        answer: "Absolutely! Difaraja offers custom hampers for corporate events, weddings, or birthdays. Please contact our WhatsApp admin for catalogs and special offers." 
      },
      { 
        question: "How long is the craft production process?", 
        answer: "Most of our craft items are Ready Stock. However, for bulk orders, the estimated production time is 3-7 business days depending on complexity and quantity." 
      },
    ],
  };
  const [faqsList, setFaqsList] = useState<FAQ[]>(initialFaqs[lang]);

  // === EFFECT: SINKRONISASI BAHASA ===
  useEffect(() => {
    // Update Teks Statis
    setHeroText({
      badge: t["hero-badge"],
      title1: t["hero-title-1"],
      title2: t["hero-title-2"],
      subtitle: t["hero-subtitle"],
      navStepTitle1: t["nav-step-title-1"],
      navStepTitle2: t["nav-step-title-2"],
      navStepSubtitle: t["nav-step-subtitle"],
      helpTitle: t["help-title"],
      helpSubtitle: t["help-subtitle"],
      faqTitle1: t["faq-title-1"],
      faqTitle2: t["faq-title-2"],
    });
    // Update Benefits List
    setBenefitsList([
      {
        icon: benefitsList[0].icon,
        title: t["hero-item-1-title"],
        description: t["hero-item-1-content"],
      },
      {
        icon: benefitsList[1].icon,
        title: t["hero-item-2-title"],
        description: t["hero-item-2-content"],
      },
      {
        icon: benefitsList[2].icon,
        title: t["hero-item-3-title"],
        description: t["hero-item-3-content"],
      },
    ]);
    // Update Steps & FAQs (Reset ke data awal bahasa baru)
    setOrderStepsList(initialSteps[lang]);
    setFaqsList(initialFaqs[lang]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, t]); // Dependency t dan lang penting

  // === HELPER FUNCTIONS UNTUK UPDATE STATE ===
  const updateHeroText = (key: keyof typeof heroText, val: string) =>
    setHeroText((prev) => ({ ...prev, [key]: val }));

  const updateOrderStep = (
    stepId: number,
    field: keyof Step,
    val: string | string[]
  ) => {
    setOrderStepsList((prev) =>
      prev.map((step) =>
        step.id === stepId ? { ...step, [field]: val } : step
      )
    );
  };

  const updateStepDetailOrTip = (
    stepId: number,
    type: "details" | "tips",
    index: number,
    val: string
  ) => {
    setOrderStepsList((prev) =>
      prev.map((step) => {
        if (step.id !== stepId) return step;
        const newArray = [...(step[type] || [])];
        newArray[index] = val;
        return { ...step, [type]: newArray };
      })
    );
  };

  const updateFaq = (index: number, field: keyof FAQ, val: string) => {
    const newData = [...faqsList];
    newData[index][field] = val;
    setFaqsList(newData);
  };

  // Scroll ke tombol active saat step berubah (UX Mobile)
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeButton = scrollContainerRef.current.querySelector(
        `[data-id="${activeStep}"]`
      );
      if (activeButton) {
        activeButton.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [activeStep]);

  return (
    <EditableSection
      isEditMode={isEditMode}
      config={pageBg}
      onSave={setPageBg}
      className="min-h-screen"
    >
      {/* ============== HERO SECTION ============== */}
      {/* (Catatan: Konten Hero biasanya dihandle oleh komponen parent atau file terpisah, 
          di sini kita fokus pada Steps & FAQ sesuai struktur code awal) */}

      {/* ============== STEPS SECTION ============== */}
      <EditableSection
        isEditMode={isEditMode}
        config={stepsBg}
        onSave={setStepsBg}
        className="px-4 lg:px-12 mb-16 md:pt-32 relative z-10"
      >
        <div className="container mx-auto">
          {/* Section Header */}
          <div className="text-center mb-8 lg:mb-12">
            <h2
              className={cn(
                fredoka.className,
                "text-3xl lg:text-4xl font-bold text-[#5B4A3B] mb-3"
              )}
            >
              <EditableText
                isEditMode={isEditMode}
                text={heroText.navStepTitle1}
                onSave={(v) => updateHeroText("navStepTitle1", v)}
                as="span"
              />{" "}
              <EditableText
                isEditMode={isEditMode}
                text={heroText.navStepTitle2}
                onSave={(v) => updateHeroText("navStepTitle2", v)}
                as="span"
                style={{ color: THEME.primary }}
              />
            </h2>
            <EditableText
              isEditMode={isEditMode}
              text={heroText.navStepSubtitle}
              onSave={(v) => updateHeroText("navStepSubtitle", v)}
              as="p"
              multiline
              className={cn(
                sniglet.className,
                "text-[#5B4A3B]/70 text-center mx-auto"
              )}
            />
          </div>

          {/* --- STEP NAVIGATION (Horizontal Scroll on Mobile) --- */}
          <div className="sticky top-20 z-30 bg-white/90 backdrop-blur-md rounded-b-3xl lg:static lg:bg-transparent lg:mb-10 shadow-sm lg:shadow-none -mx-4 px-4 py-3 lg:p-0 border-b lg:border-none border-gray-100">
            <div
              ref={scrollContainerRef}
              className="flex lg:flex-wrap lg:justify-center gap-3 overflow-x-auto no-scrollbar snap-x scroll-pl-4 pb-2 lg:pb-0"
            >
              {orderStepsList.map((step) => (
                <button
                  key={step.id}
                  data-id={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`flex-shrink-0 snap-center flex items-center gap-2 px-4 py-2.5 lg:px-5 lg:py-3 rounded-full font-medium transition-all duration-300 border ${
                    activeStep === step.id
                      ? "text-white shadow-lg scale-105"
                      : "bg-white text-gray-500 border-gray-200 hover:border-pink-300 hover:bg-pink-50"
                  }`}
                  style={
                    activeStep === step.id
                      ? {
                          backgroundColor: THEME.primary,
                          borderColor: THEME.primary,
                        }
                      : {}
                  }
                >
                  <span
                    className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                      activeStep === step.id ? "bg-white" : "bg-gray-100"
                    }`}
                    style={{
                      color: activeStep === step.id ? THEME.primary : "#9CA3AF",
                    }}
                  >
                    {step.id}
                  </span>
                  <span className="whitespace-nowrap text-sm lg:text-base">
                    <EditableText
                      isEditMode={isEditMode}
                      text={step.title}
                      onSave={(v) => updateOrderStep(step.id, "title", v)}
                    />
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* --- ACTIVE STEP CONTENT --- */}
          <div className="mt-6 lg:mt-0 min-h-[500px]">
            {orderStepsList.map((step) => (
              <div
                key={step.id}
                className={`transition-all duration-500 ease-in-out ${
                  activeStep === step.id
                    ? "opacity-100 translate-y-0 relative z-10"
                    : "opacity-0 translate-y-8 absolute inset-0 -z-10 pointer-events-none hidden"
                }`}
              >
                <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
                  <div className="flex flex-col-reverse lg:grid lg:grid-cols-2">
                    {/* Left Content */}
                    <div className="p-6 md:p-10 lg:p-12 flex flex-col justify-center">
                      <div className="flex items-start gap-5 mb-6">
                        <div className="relative">
                          <div
                            className="absolute inset-0 rounded-2xl rotate-6 opacity-20 scale-110"
                            style={{ backgroundColor: THEME.primary }}
                          />
                          <div
                            className="relative w-14 h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center text-white shadow-md"
                            style={{ backgroundColor: THEME.primary }}
                          >
                            {step.icon}
                          </div>
                        </div>
                        <div className="flex-1 pt-1">
                          <div
                            className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase mb-1"
                            style={{ color: THEME.primary }}
                          >
                            <span className="px-2 py-0.5 rounded-md bg-pink-50">
                              {t["nav-step-header-1"]}{" "}
                              {step.id.toString().padStart(2, "0")}
                            </span>
                          </div>
                          <h3
                            className={cn(
                              fredoka.className,
                              "text-2xl lg:text-4xl font-bold text-[#5B4A3B] leading-tight"
                            )}
                          >
                            <EditableText
                              isEditMode={isEditMode}
                              text={step.title}
                              onSave={(v) =>
                                updateOrderStep(step.id, "title", v)
                              }
                            />
                          </h3>
                        </div>
                      </div>
                      <EditableText
                        isEditMode={isEditMode}
                        text={step.description}
                        onSave={(v) =>
                          updateOrderStep(step.id, "description", v)
                        }
                        as="p"
                        multiline
                        className={cn(
                          sniglet.className,
                          "text-lg text-[#5B4A3B]/80 mb-8 leading-relaxed"
                        )}
                      />

                      {/* Details List */}
                      <div className="space-y-4 mb-8">
                        {step.details.map((detail, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-3 group"
                          >
                            <CheckCircle
                              className="w-5 h-5 mt-0.5 flex-shrink-0 transition-transform group-hover:scale-110"
                              style={{ color: THEME.primary }}
                            />
                            <EditableText
                              isEditMode={isEditMode}
                              text={detail}
                              onSave={(v) =>
                                updateStepDetailOrTip(
                                  step.id,
                                  "details",
                                  idx,
                                  v
                                )
                              }
                              as="span"
                              className="text-[#5B4A3B] text-sm lg:text-base"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Tips Box */}
                      {step.tips && step.tips.length > 0 && (
                        <div
                          className="rounded-2xl p-5 border border-l-4"
                          style={{
                            backgroundColor: `${THEME.primary}08`,
                            borderColor: `${THEME.primary}33`,
                            borderLeftColor: THEME.primary,
                          }}
                        >
                          <h4
                            className="font-bold text-sm mb-3 flex items-center gap-2"
                            style={{ color: THEME.primary }}
                          >
                            <Sparkles className="w-4 h-4" />
                            {t["nav-step-header-3"]}
                          </h4>
                          <div className="grid gap-2">
                            {step.tips.map((tip, idx) => (
                              <div
                                key={idx}
                                className="flex gap-2 text-sm text-[#5B4A3B]/80"
                              >
                                <span className="opacity-50">•</span>
                                <EditableText
                                  isEditMode={isEditMode}
                                  text={tip}
                                  onSave={(v) =>
                                    updateStepDetailOrTip(
                                      step.id,
                                      "tips",
                                      idx,
                                      v
                                    )
                                  }
                                  as="span"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Visual */}
                    <div className="relative h-64 lg:h-auto bg-gray-50 overflow-hidden">
                      <div
                        className="absolute inset-0 flex items-center justify-center p-8 lg:p-12"
                        style={{
                          background: `linear-gradient(135deg, ${THEME.primary}1A 0%, #fff 100%)`,
                        }}
                      >
                        <div
                          className="absolute top-10 right-10 w-20 h-20 rounded-full blur-2xl opacity-60"
                          style={{ background: THEME.bubbleA }}
                        />
                        <div
                          className="absolute bottom-10 left-10 w-32 h-32 rounded-full blur-3xl opacity-60"
                          style={{ background: THEME.bubbleB }}
                        />
                        <div className="relative w-full max-w-md transition-transform duration-700 hover:scale-105 h-full">
                          <EditableImage
                            isEditMode={isEditMode}
                            src={step.image}
                            onSave={(url) =>
                              updateOrderStep(step.id, "image", url)
                            }
                            alt={step.title}
                            fill
                            containerClassName="w-full h-full"
                            className="rounded-2xl shadow-2xl object-cover ring-8 ring-white/50"
                          />
                          <div className="absolute -bottom-4 -right-4 bg-white px-4 py-2 rounded-xl shadow-lg border border-gray-100 flex items-center gap-2 animate-bounce-slow">
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-xs font-bold text-gray-600">
                              Mudah & Cepat
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Nav Buttons */}
          <div className="flex justify-between mt-8 lg:hidden px-2">
            <button
              onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
              disabled={activeStep === 1}
              className="px-5 py-2.5 rounded-xl font-medium text-sm border transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-white"
              style={{ color: THEME.textMain, borderColor: "#e5e7eb" }}
            >
              {t["nav-step-prev"]}
            </button>
            <button
              onClick={() => setActiveStep(Math.min(6, activeStep + 1))}
              disabled={activeStep === 6}
              className="px-5 py-2.5 rounded-xl font-medium text-sm text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
              style={{ backgroundColor: THEME.primary }}
            >
              {t["nav-step-next"]}
            </button>
          </div>
        </div>
      </EditableSection>

      {/* ============== HELP CENTER ============== */}
      <EditableSection
        isEditMode={isEditMode}
        config={helpBg}
        onSave={setHelpBg}
        className="px-4 lg:px-12 mb-16"
      >
        <div className="container mx-auto">
          <div className="rounded-[2.5rem] p-8 lg:p-12 relative overflow-hidden text-center md:text-left">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl">
                <h2
                  className={cn(
                    fredoka.className,
                    "text-2xl md:text-3xl font-bold text-white mb-3"
                  )}
                >
                  <EditableText
                    isEditMode={isEditMode}
                    text={heroText.helpTitle}
                    onSave={(v) => updateHeroText("helpTitle", v)}
                  />
                </h2>
                <EditableText
                  isEditMode={isEditMode}
                  text={heroText.helpSubtitle}
                  onSave={(v) => updateHeroText("helpSubtitle", v)}
                  as="p"
                  multiline
                  className={cn(sniglet.className, "text-white/90 text-lg")}
                />
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="#"
                  className="bg-white/20 backdrop-blur-md border border-white/30 p-4 rounded-2xl flex flex-col items-center w-32 hover:bg-white/30 transition-all"
                >
                  <MessageCircle className="w-6 h-6 text-white mb-2" />
                  <span className="text-white text-xs font-bold">WhatsApp</span>
                </a>
                <a
                  href="#"
                  className="bg-white/20 backdrop-blur-md border border-white/30 p-4 rounded-2xl flex flex-col items-center w-32 hover:bg-white/30 transition-all"
                >
                  <Mail className="w-6 h-6 text-white mb-2" />
                  <span className="text-white text-xs font-bold">Email</span>
                </a>
                <a
                  href="#"
                  className="bg-white/20 backdrop-blur-md border border-white/30 p-4 rounded-2xl flex flex-col items-center w-32 hover:bg-white/30 transition-all"
                >
                  <HeadphonesIcon className="w-6 h-6 text-white mb-2" />
                  <span className="text-white text-xs font-bold">Support</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </EditableSection>

      {/* ============== FAQ SECTION ============== */}
      <EditableSection
        isEditMode={isEditMode}
        config={faqBg}
        onSave={setFaqBg}
        className="px-4 lg:p-12 mb-20"
      >
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-10">
            <h2
              className={cn(
                fredoka.className,
                "text-3xl font-bold text-[#5B4A3B] mb-3"
              )}
            >
              <EditableText
                isEditMode={isEditMode}
                text={heroText.faqTitle1}
                onSave={(v) => updateHeroText("faqTitle1", v)}
                as="span"
              />{" "}
              <EditableText
                isEditMode={isEditMode}
                text={heroText.faqTitle2}
                onSave={(v) => updateHeroText("faqTitle2", v)}
                as="span"
                style={{ color: THEME.primary }}
              />
            </h2>
          </div>

          <div className="space-y-3">
            {faqsList.map((faq, index) => (
              <div
                key={index}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden transition-all hover:shadow-md"
              >
                <button
                  onClick={() =>
                    setExpandedFAQ(expandedFAQ === index ? null : index)
                  }
                  className="w-full px-6 py-5 text-left flex items-center justify-between"
                >
                  <h3 className="font-bold text-[#5B4A3B] text-sm md:text-base pr-4">
                    <EditableText
                      isEditMode={isEditMode}
                      text={faq.question}
                      onSave={(v) => updateFaq(index, "question", v)}
                    />
                  </h3>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                    style={{
                      backgroundColor:
                        expandedFAQ === index ? THEME.primary : "#F3F4F6",
                    }}
                  >
                    {expandedFAQ === index ? (
                      <ChevronUp className="w-4 h-4 text-white" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                </button>
                <div
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                    expandedFAQ === index
                      ? "max-h-48 pb-6 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="text-[#5B4A3B]/80 text-sm leading-relaxed border-t border-gray-50 pt-4">
                    <EditableText
                      isEditMode={isEditMode}
                      text={faq.answer}
                      onSave={(v) => updateFaq(index, "answer", v)}
                      multiline
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </EditableSection>

      {/* INDIKATOR MODE EDIT */}
      {isEditMode && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full shadow-lg z-50 text-sm font-bold flex items-center gap-2 animate-bounce pointer-events-none">
          Mode Editor Aktif
        </div>
      )}
    </EditableSection>
  );
}

// =========================================================
// DEFAULT EXPORT (WRAPPER SUSPENSE)
// =========================================================
export default function HowToOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <DotdLoader />
        </div>
      }
    >
      <HowToOrderContent />
    </Suspense>
  );
}