"use client";

import { useTranslation } from "@/hooks/use-translation";
import id from "@/translations/about/id";
import en from "@/translations/about/en";
import Image from "next/image";
import {
  Heart,
  Leaf,
  Award,
  Users,
  Target,
  Eye,
  TreePine,
  Palette,
  Shield,
  Sparkles,
  Star,
  CheckCircle,
  Baby,
} from "lucide-react";
import { fredoka, sniglet } from "@/lib/fonts";
import { useRouter } from "next/navigation";
import { useState, useEffect, Suspense, useMemo } from "react";

// --- IMPORTS REUSABLE ---
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
import DotdLoader from "@/components/loader/3dot";

// =========================================
// KOMPONEN KONTEN (LOGIC UTAMA)
// =========================================
function AboutContent() {
  const t = useTranslation({ id, en });
  const router = useRouter();
  const isEditMode = useEditMode();

  const phone = "628176942128";
  const waText = encodeURIComponent("Halo saya ingin bertanya");
  const waUrlWithPhone = `https://wa.me/${phone}?text=${waText}`;

  // ========== 1. BACKGROUND STATES ==========
  const [heroBg, setHeroBg] = useState<BackgroundConfig>({
    type: "gradient",
    color1: "#fdf4ff", // Light pinkish/white
    color2: "#f0fdfa", // Light teal/white
    direction: "to bottom right",
  });

  const [missionBg, setMissionBg] = useState<BackgroundConfig>({
    type: "gradient",
    color1: "#f0fdf4", // Light green tint
    color2: "#ecfccb", // Light lime tint
    direction: "to right",
  });

  const [valuesBg, setValuesBg] = useState<BackgroundConfig>({
    type: "solid",
    color1: "#ffffff",
  });

  const [statsBg, setStatsBg] = useState<BackgroundConfig>({
    type: "gradient",
    color1: "#ecfeff", // Cyan tint
    color2: "#fdf2f8", // Pink tint
    direction: "to right",
  });

  const [ctaBg, setCtaBg] = useState<BackgroundConfig>({
    type: "gradient",
    color1: "#35966d",
    color2: "#2d805d",
    direction: "to right",
  });

  // ========== 2. TEXT & CONTENT STATES ==========
  // State untuk teks tunggal
  const [texts, setTexts] = useState({
    heroBadge: t["hero-badge"],
    heroTitle1: t["hero-title-1"],
    heroTitle2: t["hero-title-2"],
    heroTitle3: t["hero-title-3"],
    heroSubtitle: t["hero-subtitle"],
    heroItem1Title: t["hero-item-1-title"],
    heroItem1Content: t["hero-item-1-content"],
    heroItem2Title: t["hero-item-2-title"],
    heroItem2Content: t["hero-item-2-content"],
    heroItem3Content: t["hero-item-3-content"],
    heroImage:
      "https://8nc5ppykod.ufs.sh/f/H265ZJJzf6brtLyODtex0OYVvL2QeijZs4TN9tB6HcnbPodI",

    misiTitle: t["misi-title"],
    misiSubtitle: t["misi-subtitle"],
    visiTitle: t["visi-title"],
    visiSubtitle: t["visi-subtitle"],

    valueTitle1: t["value-title-1"],
    valueTitle2: t["value-title-2"],
    valueSubtitle: t["value-subtitle"],

    statsTitle1: t["stats-title-1"],
    statsTitle2: t["stats-title-2"],
    statsSubtitle: t["stats-subtitle"],

    ctaTitle: t["cta-title"],
    ctaSubtitle: t["cta-subtitle"],
    ctaBtn1: t["cta-btn-1"],
    ctaBtn2: t["cta-btn-2"],
  });

  // State untuk Array (Values)
  const [valuesList, setValuesList] = useState([
    {
      id: 1,
      title: t["value-item-1-title"],
      description: t["value-item-1-content"],
    },
    {
      id: 2,
      title: t["value-item-2-title"],
      description: t["value-item-2-content"],
    },
    {
      id: 3,
      title: t["value-item-3-title"],
      description: t["value-item-3-content"],
    },
    {
      id: 4,
      title: t["value-item-4-title"],
      description: t["value-item-4-content"],
    },
  ]);

  // State untuk Array (Stats)
  const [statsList, setStatsList] = useState([
    { id: 1, number: "5000+", label: t["stats-label-1"] },
    { id: 2, number: "50+", label: t["stats-label-2"] },
    { id: 3, number: "15+", label: t["stats-label-3"] },
    { id: 4, number: "100%", label: t["stats-label-4"] },
  ]);

  // State untuk List Misi & Visi (Array String)
  const [misiList, setMisiList] = useState([
    t["misi-item-1"],
    t["misi-item-2"],
    t["misi-item-3"],
  ]);
  const [visiList, setVisiList] = useState([
    t["visi-item-1"],
    t["visi-item-2"],
    t["visi-item-3"],
  ]);

  // ========== 3. EFFECT: SYNC LANGUAGE ==========
  useEffect(() => {
    setTexts((prev) => ({
      ...prev,
      heroBadge: t["hero-badge"],
      heroTitle1: t["hero-title-1"],
      heroTitle2: t["hero-title-2"],
      heroTitle3: t["hero-title-3"],
      heroSubtitle: t["hero-subtitle"],
      heroItem1Title: t["hero-item-1-title"],
      heroItem1Content: t["hero-item-1-content"],
      heroItem2Title: t["hero-item-2-title"],
      heroItem2Content: t["hero-item-2-content"],
      heroItem3Content: t["hero-item-3-content"],
      misiTitle: t["misi-title"],
      misiSubtitle: t["misi-subtitle"],
      visiTitle: t["visi-title"],
      visiSubtitle: t["visi-subtitle"],
      valueTitle1: t["value-title-1"],
      valueTitle2: t["value-title-2"],
      valueSubtitle: t["value-subtitle"],
      statsTitle1: t["stats-title-1"],
      statsTitle2: t["stats-title-2"],
      statsSubtitle: t["stats-subtitle"],
      ctaTitle: t["cta-title"],
      ctaSubtitle: t["cta-subtitle"],
      ctaBtn1: t["cta-btn-1"],
      ctaBtn2: t["cta-btn-2"],
    }));

    setValuesList([
      {
        id: 1,
        title: t["value-item-1-title"],
        description: t["value-item-1-content"],
      },
      {
        id: 2,
        title: t["value-item-2-title"],
        description: t["value-item-2-content"],
      },
      {
        id: 3,
        title: t["value-item-3-title"],
        description: t["value-item-3-content"],
      },
      {
        id: 4,
        title: t["value-item-4-title"],
        description: t["value-item-4-content"],
      },
    ]);

    setStatsList([
      { id: 1, number: "5000+", label: t["stats-label-1"] },
      { id: 2, number: "50+", label: t["stats-label-2"] },
      { id: 3, number: "15+", label: t["stats-label-3"] },
      { id: 4, number: "100%", label: t["stats-label-4"] },
    ]);

    setMisiList([t["misi-item-1"], t["misi-item-2"], t["misi-item-3"]]);
    setVisiList([t["visi-item-1"], t["visi-item-2"], t["visi-item-3"]]);
  }, [t]);

  // ========== 4. HELPER UPDATERS ==========
  const updateText = (key: keyof typeof texts, val: string) => {
    setTexts((prev) => ({ ...prev, [key]: val }));
  };

  const updateValueList = (
    index: number,
    field: "title" | "description",
    val: string
  ) => {
    const newData = [...valuesList];
    newData[index][field] = val;
    setValuesList(newData);
  };

  const updateStatsList = (
    index: number,
    field: "number" | "label",
    val: string
  ) => {
    const newData = [...statsList];
    newData[index][field] = val;
    setStatsList(newData);
  };

  const updateSimpleList = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    val: string
  ) => {
    setter((prev) => {
      const newData = [...prev];
      newData[index] = val;
      return newData;
    });
  };

  // Helper Icon Map (Karena Icon React Component tidak bisa disimpan di DB String mudah)
  const icons = {
    values: [
      <Leaf key="1" className="w-8 h-8 text-[#35966d]" />,
      <Shield key="2" className="w-8 h-8 text-[#35966d]" />,
      <Palette key="3" className="w-8 h-8 text-[#35966d]" />,
      <Heart key="4" className="w-8 h-8 text-[#35966d]" />,
    ],
    stats: [
      <Users key="1" className="w-6 h-6" />,
      <Palette key="2" className="w-6 h-6" />,
      <Award key="3" className="w-6 h-6" />,
      <TreePine key="4" className="w-6 h-6" />,
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ================= HERO SECTION ================= */}
      <EditableSection
        isEditMode={isEditMode}
        config={heroBg}
        onSave={setHeroBg}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Decorative Elements (Static) */}
        <div className="absolute top-20 left-10 w-24 h-24 bg-[#d43893ff] rounded-full opacity-60 animate-pulse pointer-events-none"></div>
        <div className="absolute bottom-32 right-16 w-20 h-20 bg-[#BFF0F5] rounded-full opacity-60 animate-pulse delay-1000 pointer-events-none"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-[#DFF19D] rounded-full opacity-40 animate-pulse delay-500 pointer-events-none"></div>

        <div className="relative z-10 container mx-auto px-6 lg:px-12 pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="text-center lg:text-left space-y-8">
              <div className="inline-flex items-center gap-2 bg-[#35966d]/10 px-4 py-2 rounded-full">
                <Sparkles className="w-4 h-4 text-[#35966d]" />
                <EditableText
                  isEditMode={isEditMode}
                  text={texts.heroBadge}
                  onSave={(v) => updateText("heroBadge", v)}
                  as="span"
                  className={`text-sm font-medium text-[#35966d] ${sniglet.className}`}
                />
              </div>

              <h1
                className={`text-5xl lg:text-6xl font-semibold text-[#5B4A3B] leading-tight ${fredoka.className}`}
              >
                <EditableText
                  isEditMode={isEditMode}
                  text={texts.heroTitle1}
                  onSave={(v) => updateText("heroTitle1", v)}
                />
                <EditableText
                  isEditMode={isEditMode}
                  text={texts.heroTitle2}
                  onSave={(v) => updateText("heroTitle2", v)}
                  as="span"
                  className="block text-[#35966d]"
                />
                <EditableText
                  isEditMode={isEditMode}
                  text={texts.heroTitle3}
                  onSave={(v) => updateText("heroTitle3", v)}
                  as="span"
                  className="block text-[#d43893ff]"
                />
              </h1>

              <EditableText
                isEditMode={isEditMode}
                text={texts.heroSubtitle}
                onSave={(v) => updateText("heroSubtitle", v)}
                as="p"
                multiline
                className={`text-xl text-gray-600 leading-relaxed ${sniglet.className}`}
              />

              <div
                className={`flex flex-col sm:flex-row gap-4 ${sniglet.className}`}
              >
                {/* Hero Item 1 */}
                <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg">
                  <div className="w-12 h-12 bg-[#35966d] rounded-xl flex items-center justify-center">
                    <TreePine className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <EditableText
                      isEditMode={isEditMode}
                      text={texts.heroItem1Title}
                      onSave={(v) => updateText("heroItem1Title", v)}
                      className="font-bold text-gray-900"
                    />
                    <EditableText
                      isEditMode={isEditMode}
                      text={texts.heroItem1Content}
                      onSave={(v) => updateText("heroItem1Content", v)}
                      className="text-sm text-gray-600"
                    />
                  </div>
                </div>
                {/* Hero Item 2 */}
                <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg">
                  <div className="w-12 h-12 bg-[#d43893ff] rounded-xl flex items-center justify-center">
                    <Baby className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <EditableText
                      isEditMode={isEditMode}
                      text={texts.heroItem2Title}
                      onSave={(v) => updateText("heroItem2Title", v)}
                      className="font-bold text-gray-900"
                    />
                    <EditableText
                      isEditMode={isEditMode}
                      text={texts.heroItem2Content}
                      onSave={(v) => updateText("heroItem2Content", v)}
                      className="text-sm text-gray-600"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative w-full h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                <EditableImage
                  isEditMode={isEditMode}
                  src={texts.heroImage}
                  onSave={(url) => updateText("heroImage", url)}
                  alt="COLORE Story"
                  fill
                  priority
                  containerClassName="w-full h-full"
                  className="object-cover"
                />
                {/* Floating Badge */}
                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="w-8 h-8 bg-[#BFF0F5] rounded-full border-2 border-white"
                        ></div>
                      ))}
                    </div>
                    <div>
                      <div
                        className={`font-bold text-gray-900 ${sniglet.className}`}
                      >
                        5000+
                      </div>
                      <EditableText
                        isEditMode={isEditMode}
                        text={texts.heroItem3Content}
                        onSave={(v) => updateText("heroItem3Content", v)}
                        className="text-xs text-gray-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </EditableSection>

      {/* ================= MISSION & VISION SECTION ================= */}
      <EditableSection
        isEditMode={isEditMode}
        config={missionBg}
        onSave={setMissionBg}
        className={`py-20 ${sniglet.className}`}
      >
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-[#35966d] rounded-2xl flex items-center justify-center">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h2
                  className={`text-3xl font-bold text-[#5B4A3B] ${fredoka.className}`}
                >
                  <EditableText
                    isEditMode={isEditMode}
                    text={texts.misiTitle}
                    onSave={(v) => updateText("misiTitle", v)}
                  />
                </h2>
              </div>
              <EditableText
                isEditMode={isEditMode}
                text={texts.misiSubtitle}
                onSave={(v) => updateText("misiSubtitle", v)}
                as="p"
                multiline
                className="text-gray-600 text-lg leading-relaxed mb-6"
              />
              <div className="space-y-3">
                {misiList.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#35966d]" />
                    <EditableText
                      isEditMode={isEditMode}
                      text={item}
                      onSave={(v) => updateSimpleList(setMisiList, index, v)}
                      as="span"
                      className="text-gray-700"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-[#d43893ff] rounded-2xl flex items-center justify-center">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h2
                  className={`text-3xl font-bold text-[#5B4A3B] ${fredoka.className}`}
                >
                  <EditableText
                    isEditMode={isEditMode}
                    text={texts.visiTitle}
                    onSave={(v) => updateText("visiTitle", v)}
                  />
                </h2>
              </div>
              <EditableText
                isEditMode={isEditMode}
                text={texts.visiSubtitle}
                onSave={(v) => updateText("visiSubtitle", v)}
                as="p"
                multiline
                className="text-gray-600 text-lg leading-relaxed mb-6"
              />
              <div className="space-y-3">
                {visiList.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-[#d43893ff]" />
                    <EditableText
                      isEditMode={isEditMode}
                      text={item}
                      onSave={(v) => updateSimpleList(setVisiList, index, v)}
                      as="span"
                      className="text-gray-700"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </EditableSection>

      {/* ================= VALUES SECTION ================= */}
      <EditableSection
        isEditMode={isEditMode}
        config={valuesBg}
        onSave={setValuesBg}
        className={`py-20 ${sniglet.className}`}
      >
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2
              className={`text-4xl lg:text-5xl font-bold text-[#5B4A3B] mb-6 ${fredoka.className}`}
            >
              <EditableText
                isEditMode={isEditMode}
                text={texts.valueTitle1}
                onSave={(v) => updateText("valueTitle1", v)}
                as="span"
              />{" "}
              <EditableText
                isEditMode={isEditMode}
                text={texts.valueTitle2}
                onSave={(v) => updateText("valueTitle2", v)}
                as="span"
                className="text-[#35966d]"
              />
            </h2>
            <EditableText
              isEditMode={isEditMode}
              text={texts.valueSubtitle}
              onSave={(v) => updateText("valueSubtitle", v)}
              as="p"
              multiline
              className="text-xl text-gray-600 text-center mx-auto"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {valuesList.map((value, index) => (
              <div
                key={value.id}
                className="text-center group hover:bg-[#35966d]/5 p-8 rounded-3xl transition-all duration-300"
              >
                <div className="mb-6 flex justify-center">
                  <div className="p-4 bg-[#35966d]/10 rounded-2xl group-hover:bg-[#35966d]/20 transition-colors group-hover:scale-110 transform duration-300">
                    {icons.values[index]}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  <EditableText
                    isEditMode={isEditMode}
                    text={value.title}
                    onSave={(v) => updateValueList(index, "title", v)}
                  />
                </h3>
                <EditableText
                  isEditMode={isEditMode}
                  text={value.description}
                  onSave={(v) => updateValueList(index, "description", v)}
                  as="p"
                  multiline
                  className="text-gray-600 leading-relaxed"
                />
              </div>
            ))}
          </div>
        </div>
      </EditableSection>

      {/* ================= STATS SECTION ================= */}
      <EditableSection
        isEditMode={isEditMode}
        config={statsBg}
        onSave={setStatsBg}
        className={`py-20 ${sniglet.className}`}
      >
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2
              className={`text-4xl lg:text-5xl font-bold text-gray-900 mb-6 ${fredoka.className}`}
            >
              <EditableText
                isEditMode={isEditMode}
                text={texts.statsTitle1}
                onSave={(v) => updateText("statsTitle1", v)}
                as="span"
              />{" "}
              <EditableText
                isEditMode={isEditMode}
                text={texts.statsTitle2}
                onSave={(v) => updateText("statsTitle2", v)}
                as="span"
                className="text-[#35966d]"
              />
            </h2>
            <EditableText
              isEditMode={isEditMode}
              text={texts.statsSubtitle}
              onSave={(v) => updateText("statsSubtitle", v)}
              as="p"
              multiline
              className="text-xl text-gray-600 text-center mx-auto"
            />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {statsList.map((stat, index) => (
              <div
                key={stat.id}
                className="text-center bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-[#35966d] rounded-2xl flex items-center justify-center text-white">
                    {icons.stats[index]}
                  </div>
                </div>
                <div className="text-4xl font-bold text-[#35966d] mb-2">
                  <EditableText
                    isEditMode={isEditMode}
                    text={stat.number}
                    onSave={(v) => updateStatsList(index, "number", v)}
                  />
                </div>
                <div className="text-gray-600 font-medium">
                  <EditableText
                    isEditMode={isEditMode}
                    text={stat.label}
                    onSave={(v) => updateStatsList(index, "label", v)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </EditableSection>

      {/* ================= CTA SECTION ================= */}
      <EditableSection
        isEditMode={isEditMode}
        config={ctaBg}
        onSave={setCtaBg}
        className={`py-20 text-white ${sniglet.className}`}
      >
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <div className="max-w-4xl mx-auto">
            <h2
              className={`text-4xl lg:text-5xl font-bold mb-6 ${fredoka.className}`}
            >
              <EditableText
                isEditMode={isEditMode}
                text={texts.ctaTitle}
                onSave={(v) => updateText("ctaTitle", v)}
              />
            </h2>
            <EditableText
              isEditMode={isEditMode}
              text={texts.ctaSubtitle}
              onSave={(v) => updateText("ctaSubtitle", v)}
              as="p"
              multiline
              className="text-xl text-white/90 mb-8 text-center mx-auto"
            />

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <EditableLink
                isEditMode={isEditMode}
                label={texts.ctaBtn1}
                href="/product"
                onSave={(l) => updateText("ctaBtn1", l)}
                icon={Palette}
                className="bg-white text-[#35966d] font-semibold px-8 py-4 rounded-2xl text-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2"
              />
              <EditableLink
                isEditMode={isEditMode}
                label={texts.ctaBtn2}
                href={waUrlWithPhone}
                onSave={(l) => updateText("ctaBtn2", l)}
                className="bg-transparent text-white border-2 border-white font-semibold px-8 py-4 rounded-2xl text-lg hover:bg-white hover:text-[#35966d] transition-all duration-300"
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

// =========================================================
// DEFAULT EXPORT (WRAPPER SUSPENSE)
// =========================================================
export default function AboutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <DotdLoader />
        </div>
      }
    >
      <AboutContent />
    </Suspense>
  );
}