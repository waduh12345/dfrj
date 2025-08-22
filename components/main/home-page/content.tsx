"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  Star, 
  Leaf, 
  Heart, 
  Palette, 
  Recycle,
  Users,
  Award,
  ShoppingBag,
  ArrowRight,
  Play,
  CheckCircle,
  Sparkles,
  TreePine,
  Shield
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  const categories = [
    {
      title: "Art Supplies",
      description: "Peralatan seni ramah lingkungan untuk kreativitas tanpa batas",
      image: "/api/placeholder/400/300",
      color: "bg-[#A3B18A]"
    },
    {
      title: "Craft Kits", 
      description: "Paket kerajinan lengkap untuk projek seni yang menyenangkan",
      image: "/api/placeholder/400/300",
      color: "bg-[#DFF19D]"
    },
    {
      title: "Educational Toys",
      description: "Mainan edukatif yang mengembangkan kreativitas anak",
      image: "/api/placeholder/400/300", 
      color: "bg-[#F6CCD0]"
    },
    {
      title: "Workshop Kits",
      description: "Kit workshop untuk aktivitas seni kelompok yang seru",
      image: "/api/placeholder/400/300",
      color: "bg-[#BFF0F5]"
    }
  ];

  const features = [
    {
      icon: <Leaf className="w-8 h-8 text-[#A3B18A]" />,
      title: "100% Ramah Lingkungan",
      description: "Semua produk dibuat dari bahan daur ulang dan non-toxic"
    },
    {
      icon: <Award className="w-8 h-8 text-[#A3B18A]" />,
      title: "Sertifikat Aman",
      description: "Tersertifikasi aman untuk anak-anak dari berbagai lembaga"
    },
    {
      icon: <Heart className="w-8 h-8 text-[#A3B18A]" />,
      title: "Mengembangkan Kreativitas", 
      description: "Dirancang khusus untuk mengasah imajinasi dan keterampilan anak"
    },
    {
      icon: <Users className="w-8 h-8 text-[#A3B18A]" />,
      title: "Aktivitas Bersama",
      description: "Perfect untuk bonding time keluarga dan aktivitas kelompok"
    }
  ];

  const products = [
    {
      name: "Eco Paint Set",
      price: "Rp 149.000",
      originalPrice: "Rp 199.000", 
      image: "/api/placeholder/300/300",
      rating: 4.9,
      reviews: 124,
      badge: "Best Seller"
    },
    {
      name: "Nature Craft Kit",
      price: "Rp 89.000",
      originalPrice: "Rp 119.000",
      image: "/api/placeholder/300/300", 
      rating: 4.8,
      reviews: 89,
      badge: "New"
    },
    {
      name: "Creative Clay Set",
      price: "Rp 129.000", 
      originalPrice: "Rp 169.000",
      image: "/api/placeholder/300/300",
      rating: 4.9,
      reviews: 156,
      badge: "Popular"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#DFF19D]/20 via-[#BFF0F5]/20 to-[#F6CCD0]/20"></div>
        
        {/* Decorative shapes */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-[#F6CCD0] rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-16 h-16 bg-[#BFF0F5] rounded-full opacity-60 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-[#DFF19D] rounded-full opacity-40 animate-pulse delay-500"></div>

        <div className="relative z-10 container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="text-center lg:text-left space-y-8">
              <div className="inline-flex items-center gap-2 bg-[#A3B18A]/10 px-4 py-2 rounded-full">
                <Sparkles className="w-4 h-4 text-[#A3B18A]" />
                <span className="text-sm font-medium text-[#A3B18A]">Ramah Lingkungan & Edukatif</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Warnai Dunia
                <span className="block text-[#A3B18A]">Anak dengan</span>
                <span className="block text-[#F6CCD0]">COLORE</span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-xl">
                Produk seni dan kerajinan ramah lingkungan yang mengembangkan kreativitas anak 
                sambil menjaga kelestarian bumi untuk masa depan mereka.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button 
                  onClick={() => router.push("/products")}
                  className="bg-[#A3B18A] text-white font-semibold px-8 py-4 rounded-2xl text-lg hover:bg-[#A3B18A]/90 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Belanja Sekarang
                </button>
                <button className="bg-white text-[#A3B18A] border-2 border-[#A3B18A] font-semibold px-8 py-4 rounded-2xl text-lg hover:bg-[#A3B18A] hover:text-white transition-all duration-300 flex items-center justify-center gap-2">
                  <Play className="w-5 h-5" />
                  Lihat Demo
                </button>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex items-center gap-8 pt-8">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1,2,3,4].map((i) => (
                      <div key={i} className="w-10 h-10 bg-[#BFF0F5] rounded-full border-2 border-white"></div>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">1000+ Keluarga Puas</span>
                </div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">4.9/5 Rating</span>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative w-full h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/api/placeholder/600/600"
                  alt="Kids creating art with COLORE products"
                  fill
                  className="object-cover"
                  priority
                />
                {/* Floating badge */}
                <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                  <div className="flex items-center gap-2 text-[#A3B18A]">
                    <Shield className="w-5 h-5" />
                    <span className="font-semibold text-sm">100% Aman</span>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -bottom-6 -left-6 bg-[#F6CCD0] p-6 rounded-2xl shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">50+</div>
                  <div className="text-sm text-gray-600">Produk Kreatif</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gradient-to-r from-[#DFF19D]/10 to-[#BFF0F5]/10">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Jelajahi Kategori <span className="text-[#A3B18A]">Produk</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Temukan beragam produk seni dan kerajinan yang dirancang khusus untuk mengembangkan 
              kreativitas anak dengan cara yang menyenangkan dan ramah lingkungan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className={`${category.color} h-48 flex items-center justify-center`}>
                    <Image
                      src={category.image}
                      alt={category.title}
                      width={200}
                      height={200}
                      className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <div className="p-6 bg-white">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{category.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                    <div className="flex items-center text-[#A3B18A] font-semibold">
                      <span>Lihat Produk</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Mengapa Pilih <span className="text-[#A3B18A]">COLORE?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Kami berkomitmen memberikan yang terbaik untuk anak-anak dengan produk berkualitas 
              tinggi yang aman dan ramah lingkungan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group hover:bg-[#A3B18A]/5 p-8 rounded-3xl transition-all duration-300">
                <div className="mb-6 flex justify-center">
                  <div className="p-4 bg-[#A3B18A]/10 rounded-2xl group-hover:bg-[#A3B18A]/20 transition-colors">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gradient-to-r from-[#F6CCD0]/10 to-[#BFF0F5]/10">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Produk <span className="text-[#A3B18A]">Terlaris</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Produk pilihan yang paling disukai oleh anak-anak dan orang tua di seluruh Indonesia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <div key={index} className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:-translate-y-2">
                <div className="relative">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#A3B18A] text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {product.badge}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors">
                      <Heart className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" />
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map((i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({product.reviews} ulasan)</span>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl font-bold text-[#A3B18A]">{product.price}</span>
                    <span className="text-lg text-gray-400 line-through">{product.originalPrice}</span>
                  </div>
                  
                  <button className="w-full bg-[#A3B18A] text-white font-semibold py-3 rounded-2xl hover:bg-[#A3B18A]/90 transition-colors flex items-center justify-center gap-2">
                    <ShoppingBag className="w-5 h-5" />
                    Tambah ke Keranjang
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button 
              onClick={() => router.push("/products")}
              className="bg-white text-[#A3B18A] border-2 border-[#A3B18A] font-semibold px-8 py-4 rounded-2xl text-lg hover:bg-[#A3B18A] hover:text-white transition-all duration-300 inline-flex items-center gap-2"
            >
              Lihat Semua Produk
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#A3B18A] to-[#A3B18A]/80 text-white">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Mulai Perjalanan Kreatif Anak Anda Hari Ini!
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Bergabunglah dengan ribuan keluarga yang telah mempercayai COLORE 
              untuk mengembangkan kreativitas anak mereka dengan cara yang aman dan ramah lingkungan.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button 
                onClick={() => router.push("/products")}
                className="bg-white text-[#A3B18A] font-semibold px-8 py-4 rounded-2xl text-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                Mulai Belanja
              </button>
              <button className="bg-transparent text-white border-2 border-white font-semibold px-8 py-4 rounded-2xl text-lg hover:bg-white hover:text-[#A3B18A] transition-all duration-300">
                Pelajari Lebih Lanjut
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <TreePine className="w-12 h-12 mb-4" />
                <h3 className="text-xl font-bold mb-2">Ramah Lingkungan</h3>
                <p className="text-white/80">100% bahan daur ulang</p>
              </div>
              <div className="flex flex-col items-center">
                <Shield className="w-12 h-12 mb-4" />
                <h3 className="text-xl font-bold mb-2">Aman untuk Anak</h3>
                <p className="text-white/80">Tersertifikasi internasional</p>
              </div>
              <div className="flex flex-col items-center">
                <Heart className="w-12 h-12 mb-4" />
                <h3 className="text-xl font-bold mb-2">Mengembangkan Kreativitas</h3>
                <p className="text-white/80">Dirancang oleh ahli pendidikan</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}