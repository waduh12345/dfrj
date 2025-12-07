"use client";

import { useMemo, useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useTranslation } from "@/hooks/use-translation";
import id from "@/translations/gallery/id";
import en from "@/translations/gallery/en";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Palette,
  Scissors,
  Users,
  Award,
  Sparkles,
  Camera,
  Play,
  Heart,
  Share2,
  Filter,
} from "lucide-react";

// === TYPES ===
import { GaleriItem } from "@/types/gallery";

// === SERVICES ===
import { useGetGalleryListQuery } from "@/services/gallery.service";
import DotdLoader from "@/components/loader/3dot";
import { fredoka, sniglet } from "@/lib/fonts";
import { useRouter } from "next/navigation";

// === IMPORTS MODE EDIT ===
import { useEditMode } from "@/hooks/use-edit-mode";
import { EditableText, EditableLink } from "@/components/ui/editable";
import {
  EditableSection,
  BackgroundConfig,
} from "@/components/ui/editable-section";

// Kategori untuk filter (UI)
const categories = [
  { name: "Semua", icon: <Camera className="w-4 h-4" />, color: "bg-gray-100" },
  {
    name: "Workshop",
    icon: <Users className="w-4 h-4" />,
    color: "bg-[#A3B18A]/10",
  },
  {
    name: "Produk",
    icon: <Palette className="w-4 h-4" />,
    color: "bg-[#DFF19D]/20",
  },
  {
    name: "Kegiatan",
    icon: <Scissors className="w-4 h-4" />,
    color: "bg-[#F6CCD0]/20",
  },
  {
    name: "Event",
    icon: <Award className="w-4 h-4" />,
    color: "bg-[#BFF0F5]/20",
  },
];

// View-model
type GaleriCard = {
  id: number;
  title: string;
  description: string;
  date?: string;
  category: string;
  image_url: string;
  __raw: GaleriItem;
};

interface GaleriModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: GaleriCard | null;
}

// Helpers
function toImageUrl(img: GaleriItem["image"]): string {
  if (typeof img === "string" && img) return img;
  return "/api/placeholder/400/300";
}

function toCategoryFromTitle(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("workshop")) return "Workshop";
  if (t.includes("produk") || t.includes("product")) return "Produk";
  if (t.includes("kegiatan") || t.includes("activity")) return "Kegiatan";
  if (t.includes("event") || t.includes("exhibition") || t.includes("pameran"))
    return "Event";
  return "Kegiatan";
}

function toReadableDate(published_at?: string): string | undefined {
  if (!published_at) return undefined;
  const d = new Date(published_at);
  if (isNaN(d.getTime())) return undefined;
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// Modal Component
function GaleriModal({ isOpen, onClose, item }: GaleriModalProps) {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="relative h-64 md:h-96 w-full flex-shrink-0">
          <Image
            src={item.image_url}
            alt={item.title}
            fill
            className="object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors"
          >
            ✕
          </button>
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-2xl p-3">
            <span className="text-xs text-[#A3B18A] font-medium">
              {item.category}
            </span>
          </div>
        </div>
        <div className="p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold text-[#5C4A3B] mb-3">
            {item.title}
          </h2>
          <p className="text-gray-600 mb-4">{item.__raw.description}</p>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-sm text-gray-500">{item.date}</span>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-[#A3B18A]/10 text-[#A3B18A] rounded-xl hover:bg-[#A3B18A]/20 transition-colors">
                <Heart className="w-4 h-4" /> Suka
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#F6CCD0]/20 text-gray-700 rounded-xl hover:bg-[#F6CCD0]/30 transition-colors">
                <Share2 className="w-4 h-4" /> Bagikan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =========================================
// DEFAULT EXPORT (WRAPPER SUSPENSE)
// =========================================
export default function GaleriPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <DotdLoader />
        </div>
      }
    >
      <GaleriContent />
    </Suspense>
  );
}

// =========================================
// CONTENT COMPONENT
// =========================================
function GaleriContent() {
  const t = useTranslation({ id, en });
  const { lang } = useLanguage();
  const router = useRouter();
  const isEditMode = useEditMode();

  // === BACKGROUND STATES ===
  const [heroBg, setHeroBg] = useState<BackgroundConfig>({
    type: "gradient",
    color1: "#A3B18A",
    color2: "#8a9a70", // Agak lebih gelap untuk gradient
    direction: "to right",
  });

  const [statsBg, setStatsBg] = useState<BackgroundConfig>({
    type: "gradient",
    color1: "#A3B18A",
    color2: "#8a9a70",
    direction: "to right",
  });

  // === TEXT STATES ===
  const [pageTexts, setPageTexts] = useState({
    // Hero
    heroBadge: t["hero-badge"],
    heroTitle1: t["hero-title-1"],
    heroTitle2: t["hero-title-2"],
    heroSubtitle: t["hero-subtitle"],
    heroItem1: t["hero-item-1"],
    heroItem2: t["hero-item-2"],
    heroItem3: t["hero-item-3"],
    // Stats
    statsTitle: t["stats-title"],
    // CTA
    ctaTitle: t["cta-title"],
    ctaSubtitle: t["cta-subtitle"],
    ctaBtn1: t["cta-btn-1"],
    ctaBtn2: t["cta-btn-2"],
  });

  // Sync Language changes
  useEffect(() => {
    setPageTexts((prev) => ({
      ...prev,
      heroBadge: t["hero-badge"],
      heroTitle1: t["hero-title-1"],
      heroTitle2: t["hero-title-2"],
      heroSubtitle: t["hero-subtitle"],
      heroItem1: t["hero-item-1"],
      heroItem2: t["hero-item-2"],
      heroItem3: t["hero-item-3"],
      statsTitle: t["stats-title"],
      ctaTitle: t["cta-title"],
      ctaSubtitle: t["cta-subtitle"],
      ctaBtn1: t["cta-btn-1"],
      ctaBtn2: t["cta-btn-2"],
    }));
  }, [t]);

  const updateText = (key: keyof typeof pageTexts, val: string) => {
    setPageTexts((prev) => ({ ...prev, [key]: val }));
  };

  // === GALLERY LOGIC ===
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedItem, setSelectedItem] = useState<GaleriCard | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const phone = "628176942128";
  const waText = encodeURIComponent("saya ingin mendaftar workshop");
  const waUrlWithPhone = `https://wa.me/${phone}?text=${waText}`;

  const { data, isLoading, isError, refetch } = useGetGalleryListQuery({
    page: 1,
    paginate: 12,
  });

  const galeriCards: GaleriCard[] = useMemo(() => {
    const list = data?.data ?? [];
    return list.map((g) => ({
      id: g.id,
      title: g.title,
      description: g.description,
      date: toReadableDate(g.published_at),
      category: toCategoryFromTitle(g.title),
      image_url: toImageUrl(g.image),
      __raw: g,
    }));
  }, [data]);

  const filteredList: GaleriCard[] =
    selectedCategory === "Semua"
      ? galeriCards
      : galeriCards.filter((item) => item.category === selectedCategory);

  const handleClick = (item: GaleriCard) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-white to-[#DFF19D]/10 ${sniglet.className}`}
    >
      {/* ===================== HERO SECTION (EDITABLE) ===================== */}
      <EditableSection
        isEditMode={isEditMode}
        config={heroBg}
        onSave={setHeroBg}
        className="pt-24 pb-12 px-6 lg:px-12"
      >
        <div className="container mx-auto text-center text-white">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-white" />
            <EditableText
              isEditMode={isEditMode}
              text={pageTexts.heroBadge}
              onSave={(v) => updateText("heroBadge", v)}
              as="span"
              className="text-sm font-medium"
            />
          </div>

          {/* Title */}
          <h1
            className={`text-4xl lg:text-6xl font-bold mb-6 ${fredoka.className}`}
          >
            <EditableText
              isEditMode={isEditMode}
              text={pageTexts.heroTitle1}
              onSave={(v) => updateText("heroTitle1", v)}
            />
            <EditableText
              isEditMode={isEditMode}
              text={pageTexts.heroTitle2}
              onSave={(v) => updateText("heroTitle2", v)}
              as="span"
              className="block"
            />
          </h1>

          {/* Subtitle */}
          <EditableText
            isEditMode={isEditMode}
            text={pageTexts.heroSubtitle}
            onSave={(v) => updateText("heroSubtitle", v)}
            as="p"
            multiline
            className="text-xl text-white/90 max-w-3xl mx-auto mb-8"
          />

          {/* Tags */}
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full shadow-sm">
              <div className="w-3 h-3 rounded-full bg-[#DFF19D]"></div>
              <EditableText
                isEditMode={isEditMode}
                text={pageTexts.heroItem1}
                onSave={(v) => updateText("heroItem1", v)}
                as="span"
              />
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full shadow-sm">
              <div className="w-3 h-3 rounded-full bg-[#F6CCD0]"></div>
              <EditableText
                isEditMode={isEditMode}
                text={pageTexts.heroItem2}
                onSave={(v) => updateText("heroItem2", v)}
                as="span"
              />
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full shadow-sm">
              <div className="w-3 h-3 rounded-full bg-[#BFF0F5]"></div>
              <EditableText
                isEditMode={isEditMode}
                text={pageTexts.heroItem3}
                onSave={(v) => updateText("heroItem3", v)}
                as="span"
              />
            </div>
          </div>
        </div>
      </EditableSection>

      {/* ===================== FILTER SECTION (STATIC UI) ===================== */}
      <section className="px-6 lg:px-12 mb-12">
        <div className="container mx-auto">
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-[#A3B18A]/10 mt-8">
            <div className="flex items-center gap-3 mb-4">
              <Filter className="w-5 h-5 text-[#A3B18A]" />
              <h3 className="text-lg font-semibold text-[#5C4A3B]">
                {t["category-filter"]}
              </h3>
            </div>

            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all duration-300 hover:scale-105 ${
                    selectedCategory === category.name
                      ? "bg-[#A3B18A] text-white shadow-lg"
                      : `${category.color} text-gray-700 hover:bg-[#A3B18A] hover:text-white border border-gray-200`
                  }`}
                >
                  {category.icon}
                  {category.name}
                  {selectedCategory === category.name && (
                    <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                      {filteredList.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== GALLERY GRID ===================== */}
      <section className="px-6 lg:px-12 mb-12">
        <div className="container mx-auto">
          <div className="mb-6 flex items-center justify-between">
            {isLoading ? (
              <div className="w-full flex justify-center items-center">
                <DotdLoader />
              </div>
            ) : isError ? (
              <div className="flex items-center gap-3">
                <p className="text-red-600">{t["error-info"]}</p>
                <button
                  onClick={() => refetch()}
                  className="px-3 py-1.5 rounded-xl border text-sm"
                >
                  {t["error-cta"]}
                </button>
              </div>
            ) : (
              <p className="text-gray-600">
                Menampilkan{" "}
                <span className="font-semibold text-[#A3B18A]">
                  {filteredList.length}
                </span>{" "}
                foto
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(isLoading ? [] : filteredList).map((item, index) => {
              const isWide = index % 6 === 0 || index % 6 === 3;
              const fixedImgHeight = "h-44 sm:h-48 lg:h-56 xl:h-60";

              return (
                <div
                  key={item.id}
                  onClick={() => handleClick(item)}
                  className={`relative overflow-hidden rounded-2xl cursor-pointer group shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white ${
                    isWide ? "sm:col-span-2" : ""
                  }`}
                >
                  <div className={`relative ${fixedImgHeight} overflow-hidden`}>
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      className="object-cover will-change-transform group-hover:scale-[1.03] transition-transform duration-300"
                      sizes="(min-width:1280px) 25vw, (min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                    />
                    <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <span className="bg-white/90 backdrop-blur-sm text-[#A3B18A] px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
                        {item.category}
                      </span>
                    </div>
                    {(item.category === "Workshop" ||
                      item.category === "Event") && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md">
                          <Play className="w-5 h-5 text-[#A3B18A] ml-0.5" />
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-200">
                      <h3 className="font-bold text-base mb-1.5 line-clamp-2">
                        {item.title}
                      </h3>
                      {item.__raw.description && (
                        <p className="text-xs text-white/90 line-clamp-2">
                          {item.__raw.description}
                        </p>
                      )}
                      {item.date && (
                        <p className="text-[11px] text-white/70 mt-1.5">
                          {item.date}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="p-3 sm:hidden">
                    <h3 className="font-semibold text-[#5C4A3B] text-center text-sm">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-600 text-center mt-0.5">
                      {item.category}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {!isLoading && !isError && filteredList.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-[#A3B18A]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Camera className="w-12 h-12 text-[#A3B18A]" />
              </div>
              <h3 className="text-2xl font-bold text-[#5C4A3B] mb-4">
                {t["empty-title"]}
              </h3>
              <p className="text-gray-600 mb-6">{t["empty-subtile"]}</p>
              <button
                onClick={() => setSelectedCategory("Semua")}
                className="bg-[#A3B18A] text-white px-6 py-3 rounded-2xl hover:bg-[#A3B18A]/90 transition-colors"
              >
                {t["empty-cta"]}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ===================== STATS SECTION (EDITABLE) ===================== */}
      <section className="hidden lg:block px-6 lg:px-12 mb-12">
        <div className="container mx-auto">
          <EditableSection
            isEditMode={isEditMode}
            config={statsBg}
            onSave={setStatsBg}
            className="rounded-3xl p-8 text-white text-center"
          >
            <h3 className={`text-4xl font-bold mb-8 ${fredoka.className}`}>
              <EditableText
                isEditMode={isEditMode}
                text={pageTexts.statsTitle}
                onSave={(v) => updateText("statsTitle", v)}
              />
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <div className="text-4xl font-bold mb-2">500+</div>
                <div className="text-white/90">Workshop</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">50+</div>
                <div className="text-white/90">
                  {lang === "id" ? "Produk" : "Product"}
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">1000+</div>
                <div className="text-white/90">
                  {lang === "id" ? "Anak Bahagia" : "Happy Child"}
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">100%</div>
                <div className="text-white/90">
                  {lang === "id" ? "Ramah Lingkungan" : "ECO Friendly"}
                </div>
              </div>
            </div>
          </EditableSection>
        </div>
      </section>

      {/* ===================== CTA SECTION (EDITABLE) ===================== */}
      <section className="px-6 lg:px-12 mb-12">
        <div className="container mx-auto">
          <div className="bg-white rounded-3xl p-8 text-center shadow-lg border border-[#A3B18A]/10">
            <h3
              className={`text-4xl font-bold text-[#5C4A3B] mb-4 ${fredoka.className}`}
            >
              <EditableText
                isEditMode={isEditMode}
                text={pageTexts.ctaTitle}
                onSave={(v) => updateText("ctaTitle", v)}
              />
            </h3>
            <EditableText
              isEditMode={isEditMode}
              text={pageTexts.ctaSubtitle}
              onSave={(v) => updateText("ctaSubtitle", v)}
              as="p"
              multiline
              className="text-gray-600 mb-6 max-w-2xl mx-auto"
            />
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <EditableLink
                isEditMode={isEditMode}
                label={pageTexts.ctaBtn1}
                href={waUrlWithPhone}
                onSave={(l) => updateText("ctaBtn1", l)}
                icon={Users}
                target="_blank"
                className="bg-[#A3B18A] text-white px-8 py-4 rounded-2xl font-semibold hover:bg-[#A3B18A]/90 transition-colors flex items-center justify-center gap-2"
              />
              <EditableLink
                isEditMode={isEditMode}
                label={pageTexts.ctaBtn2}
                href="/product"
                onSave={(l) => updateText("ctaBtn2", l)}
                className="border border-[#A3B18A] text-[#A3B18A] px-8 py-4 rounded-2xl font-semibold hover:bg-[#A3B18A] hover:text-white transition-colors"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      <GaleriModal
        isOpen={isModalOpen}
        onClose={closeModal}
        item={selectedItem}
      />

      {/* Indikator Mode Edit */}
      {isEditMode && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full shadow-lg z-50 text-sm font-bold flex items-center gap-2 animate-bounce pointer-events-none">
          Mode Editor Aktif
        </div>
      )}
    </div>
  );
}