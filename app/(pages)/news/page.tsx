"use client";

import { useMemo, useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useTranslation } from "@/hooks/use-translation";
import id from "@/translations/news/id";
import en from "@/translations/news/en";
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  BookOpen,
  Filter,
  Search,
  Heart,
  MessageCircle,
  PenTool, // Icon baru untuk penulis/kriya
} from "lucide-react";
import { News } from "@/types/admin/news";
import {
  useGetNewsListQuery,
  useGetNewsBySlugQuery,
} from "@/services/public-news.service";
import DotdLoader from "@/components/loader/3dot";
import { fredoka, sniglet } from "@/lib/fonts";
import { extractCategoryNamesFromArticle } from "@/utils/helper-news";

// --- IMPORTS MODE EDIT ---
import { useEditMode } from "@/hooks/use-edit-mode";
import { EditableText } from "@/components/ui/editable";
import {
  EditableSection,
  BackgroundConfig,
} from "@/components/ui/editable-section";

// ==== CONSTANTS BRAND ====
const THEME = {
  primary: "#d43893ff", // Brand Pink
  secondary: "#A3B18A", // Soft Green/Sage for accents
  textMain: "#5B4A3B", // Cocoa Brown
  bgLight: "#FFF0F5", // Light Pink for backgrounds
};

// ==== Utils ====
const getImageUrl = (img: File | string) =>
  typeof img === "string" && img ? img : "/api/placeholder/600/400";

const plainText = (htmlOrMd: string) =>
  htmlOrMd
    .replace(/<[^>]*>/g, " ")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();

const makeExcerpt = (content: string, max = 160) => {
  const text = plainText(content);
  return text.length > max ? `${text.slice(0, max)}…` : text;
};

const estimateReadTime = (content: string) => {
  const words = plainText(content).split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} menit baca`; // Added 'baca'
};

// =========================================
// DEFAULT EXPORT (WRAPPER SUSPENSE)
// =========================================
export default function NewsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-pink-50">
          <DotdLoader />
        </div>
      }
    >
      <NewsContent />
    </Suspense>
  );
}

// =========================================
// MAIN CONTENT
// =========================================
function NewsContent() {
  const t = useTranslation({ id, en });
  const isEditMode = useEditMode();

  // ===== EDITABLE STATES =====

  // 1. Background Configs
  const [heroBg, setHeroBg] = useState<BackgroundConfig>({
    type: "solid",
    color1: "transparent",
  });
  const [nlBg, setNlBg] = useState<BackgroundConfig>({
    type: "gradient",
    color1: THEME.primary,
    color2: "#b02e7a",
    direction: "to bottom right",
  });

  // 2. Text Configs
  const [texts, setTexts] = useState({
    heroBadge: "Jurnal Difaraja",
    heroTitle1: "Cerita,",
    heroTitle2: "Inspirasi & Karya",
    heroSubtitle: "Temukan kisah ketangguhan para difabelpreneur, update produk terbaru, dan wawasan seputar dunia kriya & kuliner.",
    nlTitle: "Dapatkan Kabar Terbaru",
    nlSubtitle: "Berlangganan newsletter kami untuk info promo, rilis produk baru, dan kisah inspiratif langsung ke inbox Anda.",
    nlPlaceholder: "Masukkan alamat email Anda...",
    nlCta: "Berlangganan",
  });

  // 3. Sync Language (Optional: jika ingin multi-bahasa aktif, sesuaikan initial state di atas dengan t[key])
  // Di sini saya set default hardcoded Bahasa Indonesia agar sesuai brand Difaraja dulu.
  
  const updateText = (key: keyof typeof texts, val: string) => {
    setTexts((prev) => ({ ...prev, [key]: val }));
  };

  // ===== LIST LOGIC =====
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [likedArticles, setLikedArticles] = useState<number[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const ARTICLES_PER_PAGE = 6;

  const {
    data: listResp,
    isLoading,
    isError,
    refetch,
  } = useGetNewsListQuery({
    page: currentPage,
    paginate: ARTICLES_PER_PAGE,
  });

  const totalPages = useMemo(() => listResp?.last_page ?? 1, [listResp]);
  const listItems: News[] = useMemo(() => listResp?.data ?? [], [listResp]);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const a of listItems ?? []) {
      const names = extractCategoryNamesFromArticle(a);
      if (names.length === 0) {
        counts.set("Kabar", (counts.get("Kabar") ?? 0) + 1);
      } else {
        for (const n of names) {
          counts.set(n, (counts.get(n) ?? 0) + 1);
        }
      }
    }
    const total = listItems?.length ?? 0;
    const result: { name: string; icon: React.ReactNode; count: number }[] = [
      { name: "Semua", icon: <BookOpen className="w-4 h-4" />, count: total },
    ];
    const keys = Array.from(counts.keys()).sort((a, b) => a.localeCompare(b));
    for (const k of keys) {
      if (k === "Semua") continue;
      result.push({
        name: k,
        icon: <Sparkles className="w-4 h-4" />,
        count: counts.get(k) ?? 0,
      });
    }
    return result;
  }, [listItems, listResp]);

  const filteredArticles = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return (listItems ?? []).filter((a) => {
      if (selectedCategory && selectedCategory !== "Semua") {
        const cats = extractCategoryNamesFromArticle(a);
        const matched = cats.some((c) =>
          c.toLowerCase().includes(selectedCategory.toLowerCase())
        );
        if (!matched) return false;
      }
      if (q) {
        const title = typeof a.title === "string" ? a.title.toLowerCase() : "";
        const body =
          typeof a.content === "string"
            ? plainText(a.content).toLowerCase()
            : "";
        if (!title.includes(q) && !body.includes(q)) return false;
      }
      return true;
    });
  }, [listItems, selectedCategory, searchTerm]);

  const featured = useMemo(() => {
    if (currentPage !== 1 || selectedCategory !== "Semua" || searchTerm)
      return null;
    return filteredArticles[0] ?? null;
  }, [filteredArticles, currentPage, selectedCategory, searchTerm]);

  const displayedArticles = filteredArticles; // Logic featured bisa dipisah jika ingin featured tidak muncul di list bawah

  const toggleLike = (articleId: number) => {
    setLikedArticles((prev) =>
      prev.includes(articleId)
        ? prev.filter((id) => id !== articleId)
        : [...prev, articleId]
    );
  };

  const openArticle = (article: News) => {
    setSelectedSlug(article.slug ?? String(article.id));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeArticle = () => setSelectedSlug(null);

  const {
    data: detail,
    isLoading: isDetailLoading,
    isError: isDetailError,
  } = useGetNewsBySlugQuery(selectedSlug ?? "", { skip: !selectedSlug });

  // ===== ARTICLE DETAIL VIEW =====
  if (selectedSlug) {
    const title = detail?.title ?? "";
    const image = detail
      ? getImageUrl(detail.image)
      : "/api/placeholder/600/400";
    const published = detail?.published_at
      ? new Date(detail.published_at).toLocaleDateString("id-ID", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "-";
    const readTime = detail ? estimateReadTime(detail.content) : "";

    return (
      <div className={`min-h-screen bg-white ${sniglet.className}`}>
        {/* Header Detail */}
        <div className="relative bg-gradient-to-r from-[#d43893ff] to-[#a0226d] text-white">
            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-10" style={{backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px"}}></div>
          
          <div className="container mx-auto px-6 lg:px-12 py-8 relative z-10">
            <button
              onClick={closeArticle}
              className="flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5" /> Kembali ke Jurnal
            </button>
            <div className="max-w-4xl">
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold tracking-wide">
                  Inspirasi Difaraja
                </span>
              </div>
              <h1 className={`text-3xl lg:text-5xl font-bold mb-6 leading-tight ${fredoka.className}`}>
                {isDetailLoading ? "Memuat Cerita..." : title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm lg:text-base">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Tim Difaraja</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{published}</span>
                </div>
                {detail && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{readTime}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative h-64 lg:h-[500px] w-full">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content Body */}
        <div className="container mx-auto px-6 lg:px-12 py-12">
          <div className="max-w-6xl mx-auto">
            {isDetailError && (
              <div className="p-4 rounded-2xl bg-red-50 text-red-700 mb-6 text-center">
                Gagal memuat cerita.{" "}
                <button
                  className="underline font-bold"
                  onClick={() => window.location.reload()}
                >
                  Muat ulang
                </button>
              </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Main Text */}
              <div className="lg:col-span-8">
                {isDetailLoading ? (
                  <div className="flex justify-center py-10"><DotdLoader/></div>
                ) : (
                  <div
                    className="text-[#5B4A3B] leading-loose text-lg space-y-6"
                    dangerouslySetInnerHTML={{
                      __html: (detail?.content ?? "")
                        .replace(/\n/g, "<br/>")
                        .replace(
                          /## (.*?)(<br\/>|$)/g,
                          `<h2 class="${fredoka.className} text-3xl font-bold text-[#d43893ff] mt-10 mb-4">$1</h2>`
                        )
                        .replace(
                          /### (.*?)(<br\/>|$)/g,
                          `<h3 class="${fredoka.className} text-2xl font-semibold text-[#5B4A3B] mt-8 mb-3">$1</h3>`
                        )
                        .replace(
                          /<p>/g, '<p class="mb-4 opacity-90">'
                        ),
                    }}
                  />
                )}
                
                {/* Interaction Bar */}
                <div className="mt-12 pt-8 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => detail && toggleLike(detail.id)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 transform active:scale-95 ${
                        detail && likedArticles.includes(detail.id)
                          ? "bg-pink-100 text-[#d43893ff] font-bold shadow-sm"
                          : "bg-gray-50 text-gray-600 hover:bg-pink-50 hover:text-[#d43893ff]"
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          detail && likedArticles.includes(detail.id)
                            ? "fill-current"
                            : ""
                        }`}
                      />
                      <span>Suka Cerita Ini</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-4">
                <div className="sticky top-24 space-y-8">
                  {/* Author Card */}
                  <div className="bg-gradient-to-br from-[#FFF0F5] to-white rounded-[2rem] p-8 shadow-sm border border-pink-100">
                    <h4 className={`font-bold text-[#d43893ff] mb-4 text-lg ${fredoka.className}`}>
                      Dibalik Layar
                    </h4>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 bg-[#d43893ff] rounded-full flex items-center justify-center shadow-lg shadow-pink-200">
                        <PenTool className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-[#5C4A3B] text-lg">
                          Redaksi Difaraja
                        </div>
                        <div className="text-sm text-gray-500">Menebar Inspirasi</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Kami berkomitmen mengangkat cerita ketangguhan difabelpreneur dan inovasi produk lokal.
                    </p>
                  </div>

                  {/* Related Articles */}
                  {listItems.length > 1 && (
                    <div className="bg-white rounded-[2rem] p-8 shadow-lg border border-gray-100">
                      <h4 className={`font-bold text-[#5C4A3B] mb-6 text-lg ${fredoka.className}`}>
                        Baca Juga
                      </h4>
                      <div className="space-y-6">
                        {listItems
                          .filter((a) => a.slug !== selectedSlug)
                          .slice(0, 3)
                          .map((a) => (
                            <div
                              key={a.id}
                              onClick={() => openArticle(a)}
                              className="cursor-pointer group flex gap-4 items-start"
                            >
                              <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                                <Image src={getImageUrl(a.image)} alt={a.title} fill className="object-cover" />
                              </div>
                              <div>
                                <h5 className="font-bold text-[#5C4A3B] group-hover:text-[#d43893ff] transition-colors text-sm leading-snug line-clamp-2 mb-1">
                                  {a.title}
                                </h5>
                                <p className="text-xs text-gray-400">
                                  {estimateReadTime(a.content)}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== MAIN LIST VIEW =====
  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-white to-[#FFF0F5]/50 ${sniglet.className}`}
    >
      {/* ===================== HERO SECTION ===================== */}
      <EditableSection
        isEditMode={isEditMode}
        config={heroBg}
        onSave={setHeroBg}
        className={`relative pt-28 pb-12 px-6 lg:px-12`}
      >
        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#d43893ff]/10 px-5 py-2.5 rounded-full mb-6 animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-[#d43893ff]" />
            <EditableText
              isEditMode={isEditMode}
              text={texts.heroBadge}
              onSave={(v) => updateText("heroBadge", v)}
              as="span"
              className={`text-sm font-bold text-[#d43893ff] tracking-wide uppercase`}
            />
          </div>

          <h1
            className={`text-5xl lg:text-7xl font-bold text-[#5C4A3B] mb-6 ${fredoka.className} leading-tight`}
          >
            <EditableText
              isEditMode={isEditMode}
              text={texts.heroTitle1}
              onSave={(v) => updateText("heroTitle1", v)}
            />{" "}
            <EditableText
              isEditMode={isEditMode}
              text={texts.heroTitle2}
              onSave={(v) => updateText("heroTitle2", v)}
              as="span"
              className="text-[#d43893ff] inline-block" // Brand Pink
            />
          </h1>

          <div className="max-w-2xl mx-auto">
            <EditableText
              isEditMode={isEditMode}
              text={texts.heroSubtitle}
              onSave={(v) => updateText("heroSubtitle", v)}
              as="p"
              multiline
              className="text-xl text-gray-500 mb-10 leading-relaxed"
            />
          </div>
        </div>
      </EditableSection>

      {/* Search & Filter Section */}
      <section className="px-6 lg:px-12 mb-16 relative z-20">
        <div className="container mx-auto">
          <div className="bg-white rounded-[2rem] p-3 shadow-xl shadow-pink-100/50 border border-gray-100 max-w-4xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-2">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari kisah, resep, atau inspirasi..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-14 pr-6 py-4 rounded-3xl border-none bg-transparent focus:ring-0 text-[#5C4A3B] placeholder:text-gray-400"
                />
              </div>

              {/* Categories Desktop */}
              <div className="hidden lg:flex items-center gap-2 p-1.5 bg-gray-50 rounded-3xl">
                 <div className="flex gap-1 overflow-x-auto no-scrollbar max-w-md px-2">
                  {categories.map((category) => (
                    <button
                      key={category.name}
                      onClick={() => {
                        setSelectedCategory(category.name);
                        setCurrentPage(1);
                      }}
                      className={`px-4 py-2.5 rounded-2xl font-bold text-sm whitespace-nowrap transition-all duration-300 ${
                        selectedCategory === category.name
                          ? "bg-[#d43893ff] text-white shadow-md"
                          : "text-gray-500 hover:bg-white hover:text-[#d43893ff]"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                 </div>
              </div>

               {/* Categories Mobile */}
               <div className="lg:hidden p-2 border-t border-gray-100">
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full py-3 px-4 rounded-2xl bg-gray-50 border-none text-[#5C4A3B] font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name} ({c.count})
                      </option>
                    ))}
                  </select>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featured && !isLoading && (
        <section className="px-6 lg:px-12 mb-16">
          <div className="container mx-auto">
            <div
              onClick={() => openArticle(featured)}
              className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl shadow-gray-100 hover:shadow-2xl transition-all duration-500 cursor-pointer group border border-gray-100"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-80 lg:h-[450px] overflow-hidden">
                  <Image
                    src={getImageUrl(featured.image)}
                    alt={featured.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-6 left-6">
                    <span className="bg-[#d43893ff] text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg">
                      Sorotan Utama
                    </span>
                  </div>
                </div>
                <div className="p-8 lg:p-14 flex flex-col justify-center bg-gradient-to-br from-white to-[#FFF0F5]/30">
                  <span className="text-[#d43893ff] font-bold tracking-wide uppercase text-sm mb-4">
                    Kisah Pilihan
                  </span>
                  <h2
                    className={`text-3xl lg:text-5xl font-bold text-[#5C4A3B] mb-6 group-hover:text-[#d43893ff] transition-colors leading-tight ${fredoka.className}`}
                  >
                    {featured.title}
                  </h2>
                  <p className="text-gray-600 text-lg mb-8 leading-relaxed line-clamp-3">
                    {makeExcerpt(featured.content, 220)}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8 font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#d43893ff]" />
                      <span>
                        {new Date(featured.published_at).toLocaleDateString(
                          "id-ID", {day: 'numeric', month: 'long', year: 'numeric'}
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#d43893ff]" />
                      <span>{estimateReadTime(featured.content)}</span>
                    </div>
                  </div>

                  <button className="self-start bg-[#d43893ff] text-white px-8 py-4 rounded-full font-bold hover:bg-[#b02e7a] transition-all transform hover:translate-x-1 flex items-center gap-3 shadow-lg shadow-pink-200">
                    Baca Selengkapnya
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Article Grid */}
      <section className="px-6 lg:px-12 pb-12">
        <div className="container mx-auto">
          {isError && (
            <div className="p-8 rounded-3xl bg-red-50 text-red-700 mb-8 text-center">
              <p className="font-bold mb-2">Gagal memuat konten</p>
              <button className="underline hover:text-red-800" onClick={() => refetch()}>
                Coba lagi
              </button>
            </div>
          )}
          
          {isLoading && (
            <div className="w-full flex justify-center items-center py-20">
              <DotdLoader />
            </div>
          )}

          {!isLoading && (
            <>
                <div className="flex items-end justify-between mb-10 border-b border-gray-100 pb-4">
                  <div>
                    <h3 className={`text-3xl font-bold text-[#5C4A3B] mb-2 ${fredoka.className}`}>
                        {selectedCategory === "Semua" ? "Kabar Terbaru" : selectedCategory}
                    </h3>
                    <p className="text-gray-500">
                        Menemukan {filteredArticles.length} inspirasi untuk Anda
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayedArticles.map((article) => (
                    <div
                    key={article.id}
                    onClick={() => openArticle(article)}
                    className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-lg shadow-gray-100/50 hover:shadow-2xl hover:shadow-pink-100/50 transition-all duration-500 cursor-pointer group flex flex-col h-full"
                    >
                    <div className="relative h-56 overflow-hidden">
                        <Image
                        src={getImageUrl(article.image)}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute top-4 left-4">
                            {/* Chip Kategori (Mockup logic) */}
                            <span className="bg-white/95 backdrop-blur-sm text-[#5C4A3B] px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                Inspirasi
                            </span>
                        </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                        <h3 className={`text-xl font-bold text-[#5C4A3B] mb-3 group-hover:text-[#d43893ff] transition-colors line-clamp-2 ${fredoka.className}`}>
                        {article.title}
                        </h3>
                        <p className="text-gray-500 mb-6 line-clamp-3 text-sm leading-relaxed flex-1">
                        {makeExcerpt(article.content, 120)}
                        </p>
                        
                        <div className="pt-4 border-t border-gray-50 flex items-center justify-between mt-auto">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                                {new Date(article.published_at).toLocaleDateString("id-ID", {month:'short', day:'numeric'})}
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleLike(article.id);
                                }}
                                className={`p-2 rounded-full transition-colors ${
                                    likedArticles.includes(article.id)
                                    ? "bg-pink-50 text-[#d43893ff]"
                                    : "text-gray-400 hover:bg-pink-50 hover:text-[#d43893ff]"
                                }`}
                                >
                                <Heart className={`w-5 h-5 ${likedArticles.includes(article.id) ? "fill-current" : ""}`} />
                                </button>
                            </div>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            </>
          )}

          {!isLoading && displayedArticles.length === 0 && (
            <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-gray-200">
              <div className="w-24 h-24 bg-[#d43893ff]/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-[#d43893ff]" />
              </div>
              <h3 className={`text-2xl font-bold text-[#5C4A3B] mb-3 ${fredoka.className}`}>
                Belum ada cerita ditemukan
              </h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Coba ubah kata kunci pencarian atau pilih kategori lain.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("Semua");
                  setCurrentPage(1);
                }}
                className="bg-[#d43893ff] text-white px-8 py-3 rounded-full font-bold hover:bg-[#b02e7a] transition-colors"
              >
                Reset Pencarian
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Pagination */}
      {totalPages > 1 && !isLoading && (
        <section className="px-6 lg:px-12 mb-20">
          <div className="container mx-auto">
            <div className="flex justify-center items-center gap-3">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="w-12 h-12 flex items-center justify-center border border-gray-200 text-[#5C4A3B] rounded-full hover:border-[#d43893ff] hover:text-[#d43893ff] transition-colors disabled:opacity-30 disabled:cursor-not-allowed bg-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-12 h-12 rounded-full font-bold transition-all ${
                        currentPage === page
                          ? "bg-[#d43893ff] text-white shadow-lg shadow-pink-200 transform scale-110"
                          : "bg-white text-gray-500 hover:bg-pink-50 hover:text-[#d43893ff]"
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
                className="w-12 h-12 flex items-center justify-center border border-gray-200 text-[#5C4A3B] rounded-full hover:border-[#d43893ff] hover:text-[#d43893ff] transition-colors disabled:opacity-30 disabled:cursor-not-allowed bg-white"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Indikator Mode Edit */}
      {isEditMode && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full shadow-lg z-50 text-sm font-bold flex items-center gap-2 animate-bounce pointer-events-none">
          Mode Editor Aktif
        </div>
      )}
    </div>
  );
}