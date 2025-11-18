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

export default function AboutPage() {
  const t = useTranslation({ id, en });

  const values = [
    {
      icon: <Leaf className="w-8 h-8 text-[#35966d]" />,
      title: t["value-item-1-title"],
      description: t["value-item-1-content"],
    },
    {
      icon: <Shield className="w-8 h-8 text-[#35966d]" />,
      title: t["value-item-2-title"],
      description: t["value-item-2-content"],
    },
    {
      icon: <Palette className="w-8 h-8 text-[#35966d]" />,
      title: t["value-item-3-title"],
      description: t["value-item-3-content"],
    },
    {
      icon: <Heart className="w-8 h-8 text-[#35966d]" />,
      title: t["value-item-4-title"],
      description: t["value-item-4-content"],
    },
  ];

  const milestones = [
    {
      year: "2019",
      title: t["2019-title"],
      description: t["2019-content"],
    },
    {
      year: "2020",
      title: t["2020-title"],
      description: t["2020-content"],
    },
    {
      year: "2021",
      title: t["2021-title"],
      description: t["2021-content"],
    },
    {
      year: "2022",
      title: t["2022-title"],
      description: t["2022-content"],
    },
    {
      year: "2023",
      title: t["2023-title"],
      description: t["2023-content"],
    },
    {
      year: "2024",
      title: t["2024-title"],
      description: t["2024-content"],
    },
  ];

  const team = [
    {
      name: "Sarah Wijaya",
      role: "Founder & CEO",
      image: "/api/placeholder/300/300",
      description:
        "Seorang ibu dengan passion pada pendidikan anak dan lingkungan hidup.",
    },
    {
      name: "Dr. Ahmad Rizki",
      role: "Head of Product Development",
      image: "/api/placeholder/300/300",
      description:
        "Ahli psikologi anak dengan 15 tahun pengalaman dalam pengembangan mainan edukatif.",
    },
    {
      name: "Lisa Chen",
      role: "Creative Director",
      image: "/api/placeholder/300/300",
      description:
        "Desainer berpengalaman yang menciptakan produk yang indah dan fungsional.",
    },
  ];

  const stats = [
    {
      number: "5000+",
      label: t["stats-label-1"],
      icon: <Users className="w-6 h-6" />,
    },
    {
      number: "50+",
      label: t["stats-label-2"],
      icon: <Palette className="w-6 h-6" />,
    },
    {
      number: "15+",
      label: t["stats-label-3"],
      icon: <Award className="w-6 h-6" />,
    },
    {
      number: "100%",
      label: t["stats-label-4"],
      icon: <TreePine className="w-6 h-6" />,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#DFF19D]/20 via-[#BFF0F5]/20 to-[#d43893ff]/20"></div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-24 h-24 bg-[#d43893ff] rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-20 h-20 bg-[#BFF0F5] rounded-full opacity-60 animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-[#DFF19D] rounded-full opacity-40 animate-pulse delay-500"></div>

        <div className="relative z-10 container mx-auto px-6 lg:px-12 pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="text-center lg:text-left space-y-8">
              <div className="inline-flex items-center gap-2 bg-[#35966d]/10 px-4 py-2 rounded-full">
                <Sparkles className="w-4 h-4 text-[#35966d]" />
                <span
                  className={`text-sm font-medium text-[#35966d] ${sniglet.className}`}
                >
                  {t["hero-badge"]}
                </span>
              </div>

              <h1
                className={`text-5xl lg:text-6xl font-semibold text-[#5B4A3B] leading-tight ${fredoka.className}`}
              >
                {t["hero-title-1"]}
                <span className="block text-[#35966d]">
                  {t["hero-title-2"]}
                </span>
                <span className="block text-[#d43893ff]">
                  {t["hero-title-3"]}
                </span>
              </h1>

              <p
                className={`text-xl text-gray-600 leading-relaxed ${sniglet.className}`}
              >
                {t["hero-subtitle"]}
              </p>

              <div
                className={`flex flex-col sm:flex-row gap-4 ${sniglet.className}`}
              >
                <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg">
                  <div className="w-12 h-12 bg-[#35966d] rounded-xl flex items-center justify-center">
                    <TreePine className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">
                      {t["hero-item-1-title"]}
                    </div>
                    <div className="text-sm text-gray-600">
                      {t["hero-item-1-content"]}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg">
                  <div className="w-12 h-12 bg-[#d43893ff] rounded-xl flex items-center justify-center">
                    <Baby className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">
                      {t["hero-item-2-title"]}
                    </div>
                    <div className="text-sm text-gray-600">
                      {t["hero-item-2-content"]}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative w-full h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://8nc5ppykod.ufs.sh/f/H265ZJJzf6brtLyODtex0OYVvL2QeijZs4TN9tB6HcnbPodI"
                  alt="COLORE Art & Crafts Story"
                  fill
                  className="object-cover"
                  priority
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
                      <div className="text-xs text-gray-600">
                        {t["hero-item-3-content"]}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section
        className={`py-20 bg-gradient-to-r from-[#35966d]/5 to-[#DFF19D]/5 ${sniglet.className}`}
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
                  {t["misi-title"]}
                </h2>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {t["misi-subtitle"]}
              </p>
              <div className="space-y-3">
                {[t["misi-item-1"], t["misi-item-2"], t["misi-item-3"]].map(
                  (item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-[#35966d]" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  )
                )}
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
                  {t["visi-title"]}
                </h2>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {t["visi-subtitle"]}
              </p>
              <div className="space-y-3">
                {[t["visi-item-1"], t["visi-item-2"], t["visi-item-3"]].map(
                  (item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Star className="w-5 h-5 text-[#d43893ff]" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className={`py-20 bg-white ${sniglet.className}`}>
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2
              className={`text-4xl lg:text-5xl font-bold text-[#5B4A3B] mb-6 ${fredoka.className}`}
            >
              {t["value-title-1"]}{" "}
              <span className="text-[#35966d]">{t["value-title-2"]}</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t["value-subtitle"]}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="text-center group hover:bg-[#35966d]/5 p-8 rounded-3xl transition-all duration-300"
              >
                <div className="mb-6 flex justify-center">
                  <div className="p-4 bg-[#35966d]/10 rounded-2xl group-hover:bg-[#35966d]/20 transition-colors group-hover:scale-110 transform duration-300">
                    {value.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        className={`py-20 bg-gradient-to-r from-[#BFF0F5]/10 to-[#d43893ff]/10 ${sniglet.className}`}
      >
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2
              className={`text-4xl lg:text-5xl font-bold text-gray-900 mb-6 ${fredoka.className}`}
            >
              {t["stats-title-1"]}{" "}
              <span className="text-[#35966d]">{t["stats-title-2"]}</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t["stats-subtitle"]}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-[#35966d] rounded-2xl flex items-center justify-center text-white">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-4xl font-bold text-[#35966d] mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      {/* <section className={`py-20 bg-white ${sniglet.className}`}>
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2
              className={`text-4xl lg:text-5xl font-bold text-gray-900 mb-6 ${fredoka.className}`}
            >
              {t["journey-title-1"]}{" "}
              <span className="text-[#35966d]">{t["journey-title-2"]}</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t["journet-subtitle"]}
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-0.5 w-1 h-full bg-[#35966d]/20 hidden lg:block"></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-8 ${
                    index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
                >
                  <div className="flex-1 lg:text-right lg:pr-8 lg:even:text-left lg:even:pl-8">
                    <div className="bg-white border border-[#35966d]/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                      <div className="text-2xl font-bold text-[#35966d] mb-2">
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>

                  <div className="hidden lg:flex w-4 h-4 bg-[#35966d] rounded-full border-4 border-white shadow-lg z-10"></div>

                  <div className="flex-1 hidden lg:block"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section> */}

      {/* Team Section */}
      {/* <section
        className={`py-20 bg-gradient-to-r from-[#DFF19D]/10 to-[#BFF0F5]/10 ${sniglet.className}`}
      >
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2
              className={`text-4xl lg:text-5xl font-bold text-gray-900 mb-6 ${fredoka.className}`}
            >
              {t["team-title-1"]}{" "}
              <span className="text-[#35966d]">{t["team-title-2"]}</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t["team-subtitle"]}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative h-80">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{member.name}</h3>
                    <p className="text-sm opacity-90">{member.role}</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section
        className={`py-20 bg-gradient-to-r from-[#35966d] to-[#35966d]/80 text-white ${sniglet.className}`}
      >
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className={`text-4xl lg:text-5xl font-bold mb-6 ${fredoka.className}`}>
              {t["cta-title"]}
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              {t["cta-subtitle"]}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-[#35966d] font-semibold px-8 py-4 rounded-2xl text-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2">
                <Palette className="w-5 h-5" />
                {t["cta-btn-1"]}
              </button>
              <button className="bg-transparent text-white border-2 border-white font-semibold px-8 py-4 rounded-2xl text-lg hover:bg-white hover:text-[#35966d] transition-all duration-300">
                {t["cta-btn-2"]}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
