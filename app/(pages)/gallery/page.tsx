"use client";

import { useMemo, useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useTranslation } from "@/hooks/use-translation";
import id from "@/translations/gallery/id";
import en from "@/translations/gallery/en";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Palette,
  Users,
  Award,
  Sparkles,
  Camera,
  Play,
  Heart,
  Share2,
  Filter,
  Utensils, // Icon untuk Kuliner
  Shirt,     // Icon untuk Fashion
  ShoppingBag // Icon untuk Produk Umum
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

// ==== CONSTANTS BRAND ====
const THEME = {
  primary: "#d43893ff", // Brand Pink
  textMain: "#5B4A3B", // Cocoa Brown
};

// Kategori untuk filter (Disesuaikan dengan Difaraja)
const categories = [
  { name: "Semua", icon: <Camera className="w-4 h-4" />, color: "bg-gray-100" },
  {
    name: "Kuliner",
    icon: <Utensils className="w-4 h-4" />,
    color: "bg-orange-100", // Warm color for food
  },
  {
    name: "Kriya",
    icon: <Palette className="w-4 h-4" />,
    color: "bg-purple-100", // Artistic color
  },
  {
    name: "Fashion",
    icon: <Shirt className="w-4 h-4" />,
    color: "bg-pink-100", // Fashion color
  },
  {
    name: "Kegiatan",
    icon: <Users className="w-4 h-4" />,
    color: "bg-blue-100",
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

// Helper untuk mapping kategori otomatis berdasarkan judul/deskripsi
function toCategoryFromTitle(title: string): string {
  const t = title.toLowerCase();
  
  // Logic Kuliner
  if (t.includes("makanan") || t.includes("snack") || t.includes("kue") || t.includes("keripik") || t.includes("kuliner")) return "Kuliner";
  
  // Logic Fashion
  if (t.includes("baju") || t.includes("kaos") || t.includes("kain") || t.includes("batik") || t.includes("fashion")) return "Fashion";
  
  // Logic Kriya
  if (t.includes("tas") || t.includes("dompet") || t.includes("craft") || t.includes("kriya") || t.includes("kerajinan")) return "Kriya";
  
  // Logic Kegiatan
  if (t.includes("pelatihan") || t.includes("workshop") || t.includes("kegiatan") || t.includes("event")) return "Kegiatan";
  
  return "Kriya"; // Default fallback
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-[2rem] max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="relative h-64 md:h-[500px] w-full flex-shrink-0 bg-gray-100">
          <Image
            src={item.image_url}
            alt={item.title}
            fill
            className="object-contain"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-2 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all text-gray-700"
          >
            ✕
          </button>
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md rounded-2xl px-4 py-2 shadow-sm">
            <span className="text-xs text-[#d43893ff] font-bold uppercase tracking-wide">
              {item.category}
            </span>
          </div>
        </div>
        <div className="p-8 overflow-y-auto bg-gradient-to-b from-white to-pink-50/30">
          <h2 className={`text-2xl lg:text-3xl font-bold text-[#5C4A3B] mb-4 ${fredoka.className}`}>
            {item.title}
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed text-lg">{item.__raw.description}</p>
          <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100">
            <span className="text-sm text-gray-500 font-medium flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#d43893ff]" />
                {item.date}
            </span>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-pink-50 text-[#d43893ff] rounded-xl hover:bg-pink-100 transition-colors font-semibold">
                <Heart className="w-4 h-4" /> Suka
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold">
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

  // === BACKGROUND STATES (Pink Theme) ===
  const [heroBg, setHeroBg] = useState<BackgroundConfig>({
    type: "gradient",
    color1: "#d43893ff",
    color2: "#b02e7a",
    direction: "to bottom right",
  });

  const [statsBg, setStatsBg] = useState<BackgroundConfig>({
    type: "gradient",
    color1: "#d43893ff",
    color2: "#b02e7a",
    direction: "to right",
  });

  // === TEXT STATES (Difaraja Context) ===
  const [pageTexts, setPageTexts] = useState({
    // Hero
    heroBadge: "Galeri Difaraja",
    heroTitle1: "Jejak Karya &",
    heroTitle2: "Inspirasi Kami",
    heroSubtitle: "Menyelami ragam kreativitas difabelpreneur melalui lensa kamera. Dari dapur kuliner hingga meja kriya, inilah bukti ketangguhan kami.",
    heroItem1: "Kuliner Otentik",
    heroItem2: "Kriya Handmade",
    heroItem3: "Fashion",
    // Stats
    statsTitle: "Dampak Kebahagiaan",
    // CTA
    ctaTitle: "Tertarik dengan Karya Kami?",
    ctaSubtitle: "Dukung kemandirian difabelpreneur dengan memiliki produk-produk istimewa ini.",
    ctaBtn1: "Hubungi Kami",
    ctaBtn2: "Lihat Produk",
  });

  // Sync Language changes
  useEffect(() => {
    // Note: Jika file translasi JSON sudah diupdate, gunakan t[key].
    // Kode ini mempertahankan state local jika user mengedit text via CMS mode.
    setPageTexts((prev) => ({
      ...prev,
      heroBadge: t["hero-badge"] || "Galeri Difaraja",
      // ... map others if needed from translation file
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
  const waText = encodeURIComponent("Halo Difaraja, saya tertarik dengan karya di galeri foto...");
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
      className={`min-h-screen bg-gradient-to-b from-white to-[#FFF0F5] ${sniglet.className}`}
    >
      {/* ===================== HERO SECTION (EDITABLE) ===================== */}
      <EditableSection
        isEditMode={isEditMode}
        config={heroBg}
        onSave={setHeroBg}
        className="pt-28 pb-16 px-6 lg:px-12 relative overflow-hidden"
      >
        {/* Decorative Circles */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <div className="absolute -top-20 -left-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
             <div className="absolute bottom-0 right-0 w-80 h-80 bg-yellow-300 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto text-center text-white relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full mb-8 shadow-sm animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-white" />
            <EditableText
              isEditMode={isEditMode}
              text={pageTexts.heroBadge}
              onSave={(v) => updateText("heroBadge", v)}
              as="span"
              className="text-sm font-bold tracking-wide uppercase"
            />
          </div>

          {/* Title */}
          <h1
            className={`text-4xl lg:text-7xl font-bold mb-8 ${fredoka.className} leading-tight drop-shadow-sm`}
          >
            <EditableText
              isEditMode={isEditMode}
              text={pageTexts.heroTitle1}
              onSave={(v) => updateText("heroTitle1", v)}
            />{" "}
            <EditableText
              isEditMode={isEditMode}
              text={pageTexts.heroTitle2}
              onSave={(v) => updateText("heroTitle2", v)}
              as="span"
              className="block text-yellow-100" // Highlight color
            />
          </h1>

          {/* Subtitle */}
          <EditableText
            isEditMode={isEditMode}
            text={pageTexts.heroSubtitle}
            onSave={(v) => updateText("heroSubtitle", v)}
            as="p"
            multiline
            className="text-lg lg:text-xl text-white/95 max-w-3xl mx-auto mb-10 leading-relaxed font-light"
          />

          {/* Tags */}
          <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2.5 rounded-full hover:bg-white/20 transition-colors">
              <Utensils className="w-4 h-4 text-white" />
              <EditableText
                isEditMode={isEditMode}
                text={pageTexts.heroItem1}
                onSave={(v) => updateText("heroItem1", v)}
                as="span"
              />
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2.5 rounded-full hover:bg-white/20 transition-colors">
              <Palette className="w-4 h-4 text-white" />
              <EditableText
                isEditMode={isEditMode}
                text={pageTexts.heroItem2}
                onSave={(v) => updateText("heroItem2", v)}
                as="span"
              />
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2.5 rounded-full hover:bg-white/20 transition-colors">
              <Shirt className="w-4 h-4 text-white" />
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

      {/* ===================== FILTER SECTION ===================== */}
      <section className="px-6 lg:px-12 mb-12 -mt-8 relative z-20">
        <div className="container mx-auto">
          <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-gray-50">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6">
              <div className="flex items-center gap-2 text-[#5C4A3B] px-2">
                <Filter className="w-5 h-5 text-[#d43893ff]" />
                <h3 className="text-lg font-bold">
                  {t["category-filter"]}
                </h3>
              </div>

              <div className="flex flex-wrap gap-2 w-full">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:scale-105 active:scale-95 ${
                      selectedCategory === category.name
                        ? "bg-[#d43893ff] text-white shadow-lg shadow-pink-200"
                        : `${category.color} text-[#5C4A3B] hover:bg-[#d43893ff] hover:text-white border border-transparent`
                    }`}
                  >
                    {category.icon}
                    {category.name}
                    {selectedCategory === category.name && (
                      <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs ml-1">
                        {filteredList.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== GALLERY GRID ===================== */}
      <section className="px-6 lg:px-12 mb-16">
        <div className="container mx-auto">
          <div className="mb-8 flex items-center justify-between">
            {isLoading ? (
              <div className="w-full flex justify-center items-center">
                <DotdLoader />
              </div>
            ) : isError ? (
              <div className="flex items-center gap-3 bg-red-50 px-4 py-2 rounded-xl text-red-600">
                <p>{t["error-info"]}</p>
                <button
                  onClick={() => refetch()}
                  className="font-bold underline"
                >
                  {t["error-cta"]}
                </button>
              </div>
            ) : (
              <p className="text-gray-500 font-medium">
                Menampilkan{" "}
                <span className="font-bold text-[#d43893ff]">
                  {filteredList.length}
                </span>{" "}
                foto dokumentasi
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {(isLoading ? [] : filteredList).map((item, index) => {
              const isWide = index % 6 === 0 || index % 6 === 3;
              const fixedImgHeight = "h-56 sm:h-64 lg:h-72 xl:h-80";

              return (
                <div
                  key={item.id}
                  onClick={() => handleClick(item)}
                  className={`relative overflow-hidden rounded-[2rem] cursor-pointer group shadow-lg shadow-gray-100 hover:shadow-2xl hover:shadow-pink-100/50 transition-all duration-500 hover:-translate-y-2 bg-white ${
                    isWide ? "sm:col-span-2" : ""
                  }`}
                >
                  <div className={`relative ${fixedImgHeight} overflow-hidden`}>
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      className="object-cover will-change-transform group-hover:scale-110 transition-transform duration-700"
                      sizes="(min-width:1280px) 25vw, (min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                    />
                    
                    {/* Badge Category */}
                    <div className="absolute top-4 left-4 z-20">
                      <span className="bg-white/95 backdrop-blur-sm text-[#d43893ff] px-3 py-1 rounded-full text-xs font-bold shadow-sm uppercase tracking-wide">
                        {item.category}
                      </span>
                    </div>

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#5C4A3B]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                    
                    {/* Hover Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-6 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                      <h3 className={`font-bold text-lg mb-2 leading-tight ${fredoka.className}`}>
                        {item.title}
                      </h3>
                      {item.__raw.description && (
                        <p className="text-xs text-white/80 line-clamp-2 mb-3 font-light">
                          {item.__raw.description}
                        </p>
                      )}
                      {item.date && (
                        <div className="flex items-center gap-2 text-xs font-medium text-pink-200">
                           <Camera className="w-3 h-3" /> {item.date}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Mobile Only Title (Below Image) */}
                  <div className="p-4 sm:hidden bg-white">
                    <h3 className="font-bold text-[#5C4A3B] text-center text-sm mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#d43893ff] text-center font-medium">
                      {item.category}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {!isLoading && !isError && filteredList.length === 0 && (
            <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-gray-200">
              <div className="w-24 h-24 bg-[#d43893ff]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Camera className="w-10 h-10 text-[#d43893ff]" />
              </div>
              <h3 className="text-2xl font-bold text-[#5C4A3B] mb-4">
                {t["empty-title"]}
              </h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">{t["empty-subtile"]}</p>
              <button
                onClick={() => setSelectedCategory("Semua")}
                className="bg-[#d43893ff] text-white px-8 py-3 rounded-full hover:bg-[#b02e7a] transition-colors font-bold shadow-lg shadow-pink-200"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ===================== STATS SECTION (EDITABLE) ===================== */}
      <section className="hidden lg:block px-6 lg:px-12 mb-16">
        <div className="container mx-auto">
          <EditableSection
            isEditMode={isEditMode}
            config={statsBg}
            onSave={setStatsBg}
            className="rounded-[3rem] p-12 text-white text-center shadow-xl shadow-pink-200/50"
          >
            <h3 className={`text-5xl font-bold mb-10 ${fredoka.className}`}>
              <EditableText
                isEditMode={isEditMode}
                text={pageTexts.statsTitle}
                onSave={(v) => updateText("statsTitle", v)}
              />
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-x divide-white/20">
              <div>
                <div className="text-5xl font-bold mb-3 tracking-tight">500+</div>
                <div className="text-white/90 font-medium text-lg">Mitra Difabel</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-3 tracking-tight">50+</div>
                <div className="text-white/90 font-medium text-lg">
                  {lang === "id" ? "Varian Produk" : "Product Variants"}
                </div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-3 tracking-tight">1000+</div>
                <div className="text-white/90 font-medium text-lg">
                  {lang === "id" ? "Karya Terjual" : "Works Sold"}
                </div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-3 tracking-tight">100%</div>
                <div className="text-white/90 font-medium text-lg">
                  {lang === "id" ? "Buatan Hati" : "Heart Made"}
                </div>
              </div>
            </div>
          </EditableSection>
        </div>
      </section>

      {/* ===================== CTA SECTION (EDITABLE) ===================== */}
      <section className="px-6 lg:px-12 mb-16">
        <div className="container mx-auto">
          <div className="bg-white rounded-[2.5rem] p-10 text-center shadow-xl border border-gray-100 relative overflow-hidden">
             {/* Decor */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#d43893ff]/5 rounded-bl-full"></div>
             <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#d43893ff]/5 rounded-tr-full"></div>

            <h3
              className={`text-4xl font-bold text-[#5C4A3B] mb-4 relative z-10 ${fredoka.className}`}
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
              className="text-gray-500 mb-8 max-w-2xl mx-auto text-lg relative z-10"
            />
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <EditableLink
                isEditMode={isEditMode}
                label={pageTexts.ctaBtn1}
                href={waUrlWithPhone}
                onSave={(l) => updateText("ctaBtn1", l)}
                icon={Utensils}
                target="_blank"
                className="bg-[#d43893ff] text-white px-8 py-4 rounded-full font-bold hover:bg-[#b02e7a] transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-lg shadow-pink-200"
              />
              <EditableLink
                isEditMode={isEditMode}
                label={pageTexts.ctaBtn2}
                href="/product"
                onSave={(l) => updateText("ctaBtn2", l)}
                className="border-2 border-[#d43893ff] text-[#d43893ff] px-8 py-4 rounded-full font-bold hover:bg-[#d43893ff] hover:text-white transition-all hover:scale-105"
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