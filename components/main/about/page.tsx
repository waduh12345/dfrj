"use client";

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
  Globe,
  Recycle,
  Baby
} from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: <Leaf className="w-8 h-8 text-[#A3B18A]" />,
      title: "Ramah Lingkungan",
      description: "Semua produk dibuat dari bahan daur ulang dan non-toxic untuk melindungi planet dan masa depan anak-anak kita."
    },
    {
      icon: <Shield className="w-8 h-8 text-[#A3B18A]" />,
      title: "Keselamatan Anak",
      description: "Tersertifikasi aman dengan standar internasional, memberikan ketenangan pikiran untuk orang tua."
    },
    {
      icon: <Palette className="w-8 h-8 text-[#A3B18A]" />,
      title: "Mengembangkan Kreativitas",
      description: "Produk dirancang khusus untuk merangsang imajinasi dan mengembangkan keterampilan motorik anak."
    },
    {
      icon: <Heart className="w-8 h-8 text-[#A3B18A]" />,
      title: "Kualitas Premium",
      description: "Menggunakan bahan berkualitas tinggi yang tahan lama untuk pengalaman bermain yang optimal."
    }
  ];

  const milestones = [
    {
      year: "2019",
      title: "Berdiri",
      description: "COLORE didirikan dengan misi menyediakan produk seni ramah lingkungan untuk anak-anak Indonesia."
    },
    {
      year: "2020",
      title: "Sertifikasi Internasional",
      description: "Mendapat sertifikasi keamanan internasional untuk semua lini produk kami."
    },
    {
      year: "2021", 
      title: "1000+ Keluarga",
      description: "Mencapai milestone 1000 keluarga yang mempercayai produk COLORE."
    },
    {
      year: "2022",
      title: "Ekspansi Produk",
      description: "Meluncurkan 50+ varian produk dengan inovasi terbaru dalam edukasi kreatif."
    },
    {
      year: "2023",
      title: "Award Winner",
      description: "Menerima penghargaan 'Best Eco-Friendly Kids Product' dari Indonesian Parenting Awards."
    },
    {
      year: "2024",
      title: "Go Digital",
      description: "Meluncurkan platform e-commerce untuk memberikan pengalaman belanja yang lebih mudah."
    }
  ];

  const team = [
    {
      name: "Sarah Wijaya",
      role: "Founder & CEO",
      image: "/api/placeholder/300/300",
      description: "Seorang ibu dengan passion pada pendidikan anak dan lingkungan hidup."
    },
    {
      name: "Dr. Ahmad Rizki",
      role: "Head of Product Development",
      image: "/api/placeholder/300/300", 
      description: "Ahli psikologi anak dengan 15 tahun pengalaman dalam pengembangan mainan edukatif."
    },
    {
      name: "Lisa Chen",
      role: "Creative Director",
      image: "/api/placeholder/300/300",
      description: "Desainer berpengalaman yang menciptakan produk yang indah dan fungsional."
    }
  ];

  const stats = [
    { number: "5000+", label: "Keluarga Bahagia", icon: <Users className="w-6 h-6" /> },
    { number: "50+", label: "Produk Kreatif", icon: <Palette className="w-6 h-6" /> },
    { number: "15+", label: "Penghargaan", icon: <Award className="w-6 h-6" /> },
    { number: "100%", label: "Ramah Lingkungan", icon: <TreePine className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#DFF19D]/20 via-[#BFF0F5]/20 to-[#F6CCD0]/20"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-24 h-24 bg-[#F6CCD0] rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-20 h-20 bg-[#BFF0F5] rounded-full opacity-60 animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-[#DFF19D] rounded-full opacity-40 animate-pulse delay-500"></div>

        <div className="relative z-10 container mx-auto px-6 lg:px-12 pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="text-center lg:text-left space-y-8">
              <div className="inline-flex items-center gap-2 bg-[#A3B18A]/10 px-4 py-2 rounded-full">
                <Sparkles className="w-4 h-4 text-[#A3B18A]" />
                <span className="text-sm font-medium text-[#A3B18A]">Tentang COLORE</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Menciptakan Masa Depan
                <span className="block text-[#A3B18A]">Yang Lebih</span>
                <span className="block text-[#F6CCD0]">Berwarna</span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                COLORE Art & Crafts hadir sebagai solusi terpercaya untuk menyediakan produk seni dan kerajinan 
                ramah lingkungan yang aman, edukatif, dan menyenangkan untuk anak-anak Indonesia.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg">
                  <div className="w-12 h-12 bg-[#A3B18A] rounded-xl flex items-center justify-center">
                    <TreePine className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">100% Eco-Friendly</div>
                    <div className="text-sm text-gray-600">Ramah Lingkungan</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg">
                  <div className="w-12 h-12 bg-[#F6CCD0] rounded-xl flex items-center justify-center">
                    <Baby className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Child-Safe</div>
                    <div className="text-sm text-gray-600">Aman untuk Anak</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative w-full h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/api/placeholder/600/600"
                  alt="COLORE Art & Crafts Story"
                  fill
                  className="object-cover"
                  priority
                />
                {/* Floating Badge */}
                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {[1,2,3,4].map((i) => (
                        <div key={i} className="w-8 h-8 bg-[#BFF0F5] rounded-full border-2 border-white"></div>
                      ))}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">5000+</div>
                      <div className="text-xs text-gray-600">Keluarga Puas</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gradient-to-r from-[#A3B18A]/5 to-[#DFF19D]/5">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-[#A3B18A] rounded-2xl flex items-center justify-center">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Misi Kami</h2>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Menyediakan produk seni dan kerajinan berkualitas tinggi yang ramah lingkungan, 
                aman untuk anak-anak, dan dapat mengembangkan kreativitas serta keterampilan motorik 
                anak dengan cara yang menyenangkan dan edukatif.
              </p>
              <div className="space-y-3">
                {[
                  "Mengutamakan keselamatan dan kesehatan anak",
                  "Menggunakan bahan 100% ramah lingkungan",
                  "Mendukung perkembangan kreativitas anak"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#A3B18A]" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-[#F6CCD0] rounded-2xl flex items-center justify-center">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Visi Kami</h2>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Menjadi brand terdepan di Indonesia dalam menyediakan produk seni dan kerajinan 
                ramah lingkungan untuk anak-anak, serta berkontribusi dalam menciptakan generasi 
                yang kreatif, peduli lingkungan, dan berkarakter.
              </p>
              <div className="space-y-3">
                {[
                  "Brand #1 untuk produk seni anak di Indonesia",
                  "Standar baru produk ramah lingkungan",
                  "Inspirasi untuk generasi kreatif"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-[#F6CCD0]" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Nilai-Nilai <span className="text-[#A3B18A]">COLORE</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Prinsip-prinsip yang menjadi fondasi dalam setiap produk dan layanan yang kami berikan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center group hover:bg-[#A3B18A]/5 p-8 rounded-3xl transition-all duration-300">
                <div className="mb-6 flex justify-center">
                  <div className="p-4 bg-[#A3B18A]/10 rounded-2xl group-hover:bg-[#A3B18A]/20 transition-colors group-hover:scale-110 transform duration-300">
                    {value.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-[#BFF0F5]/10 to-[#F6CCD0]/10">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Pencapaian <span className="text-[#A3B18A]">Kami</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Angka-angka yang membuktikan dedikasi kami dalam memberikan yang terbaik.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-[#A3B18A] rounded-2xl flex items-center justify-center text-white">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-4xl font-bold text-[#A3B18A] mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Perjalanan <span className="text-[#A3B18A]">COLORE</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Melihat kembali milestone penting dalam perjalanan kami menciptakan produk terbaik.
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-0.5 w-1 h-full bg-[#A3B18A]/20 hidden lg:block"></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center gap-8 ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                  {/* Content */}
                  <div className="flex-1 lg:text-right lg:pr-8 lg:even:text-left lg:even:pl-8">
                    <div className="bg-white border border-[#A3B18A]/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                      <div className="text-2xl font-bold text-[#A3B18A] mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="hidden lg:flex w-4 h-4 bg-[#A3B18A] rounded-full border-4 border-white shadow-lg z-10"></div>

                  {/* Spacer */}
                  <div className="flex-1 hidden lg:block"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-r from-[#DFF19D]/10 to-[#BFF0F5]/10">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Tim <span className="text-[#A3B18A]">COLORE</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Orang-orang hebat di balik produk berkualitas tinggi yang kami ciptakan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
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
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#A3B18A] to-[#A3B18A]/80 text-white">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Bergabunglah dengan Misi Kami!
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Mari bersama-sama menciptakan masa depan yang lebih berwarna untuk anak-anak Indonesia 
              dengan produk yang aman, edukatif, dan ramah lingkungan.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-[#A3B18A] font-semibold px-8 py-4 rounded-2xl text-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2">
                <Palette className="w-5 h-5" />
                Lihat Produk Kami
              </button>
              <button className="bg-transparent text-white border-2 border-white font-semibold px-8 py-4 rounded-2xl text-lg hover:bg-white hover:text-[#A3B18A] transition-all duration-300">
                Hubungi Kami
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}