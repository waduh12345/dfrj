"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowLeft,
  ArrowRight,
  Sparkles,
  BookOpen,
  Award,
  Users,
  Heart,
  Share2,
  MessageCircle,
  Filter,
  Search,
  Tag,
  TrendingUp,
  Star
} from "lucide-react";

interface NewsArticle {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  likes: number;
  comments: number;
  isFeatured?: boolean;
  isNew?: boolean;
  tags: string[];
}

// Mock news data
const newsArticles: NewsArticle[] = [
  {
    id: 1,
    title: "Tips Mengembangkan Kreativitas Anak Melalui Seni",
    excerpt: "Pelajari cara-cara efektif untuk mengasah kreativitas anak menggunakan produk seni ramah lingkungan.",
    content: `Kreativitas adalah salah satu aspek penting dalam perkembangan anak. Melalui kegiatan seni, anak dapat mengekspresikan diri, mengembangkan motorik halus, dan meningkatkan kemampuan problem solving.

Di COLORE, kami percaya bahwa setiap anak memiliki potensi kreatif yang luar biasa. Berikut adalah beberapa tips yang dapat membantu orang tua dalam mengembangkan kreativitas anak:

## 1. Sediakan Lingkungan yang Mendukung

Ciptakan ruang khusus untuk anak berkarya. Pastikan area tersebut aman, nyaman, dan mudah dibersihkan. Sediakan berbagai alat seni yang aman dan ramah lingkungan.

## 2. Biarkan Anak Mengeksplorasi

Jangan terlalu membatasi anak dalam berkarya. Biarkan mereka mengeksplorasi berbagai warna, bentuk, dan teknik. Kesalahan adalah bagian dari proses pembelajaran.

## 3. Gunakan Produk yang Aman

Pastikan semua alat seni yang digunakan aman untuk anak. Produk COLORE dibuat khusus dengan bahan non-toxic dan ramah lingkungan untuk keamanan anak.

## 4. Berikan Apresiasi

Selalu berikan apresiasi positif terhadap karya anak, regardless hasilnya. Ini akan meningkatkan kepercayaan diri mereka dalam berkreasi.

Dengan pendekatan yang tepat, aktivitas seni dapat menjadi momen bonding yang berharga antara orang tua dan anak.`,
    image: "/api/placeholder/600/400",
    category: "Tips & Trik",
    author: "Dr. Sarah Wijaya",
    date: "2024-03-15",
    readTime: "5 menit",
    likes: 124,
    comments: 18,
    isFeatured: true,
    tags: ["kreativitas", "anak", "seni", "tips parenting"]
  },
  {
    id: 2,
    title: "Manfaat Produk Ramah Lingkungan untuk Anak",
    excerpt: "Mengapa memilih produk ramah lingkungan penting untuk kesehatan anak dan masa depan bumi.",
    content: `Dalam era modern ini, kesadaran akan pentingnya menjaga lingkungan semakin meningkat. Sebagai orang tua, memilih produk ramah lingkungan untuk anak bukan hanya investasi untuk kesehatan mereka, tapi juga untuk masa depan planet ini.

## Mengapa Produk Ramah Lingkungan Penting?

### 1. Kesehatan Anak Terjaga
Produk ramah lingkungan bebas dari bahan kimia berbahaya yang dapat mengganggu kesehatan anak. Bahan non-toxic memastikan keamanan saat anak bermain dan berkreasi.

### 2. Mengajarkan Nilai Peduli Lingkungan
Dengan menggunakan produk ramah lingkungan, anak belajar untuk menghargai dan menjaga alam sejak dini.

### 3. Kualitas yang Lebih Baik
Produk ramah lingkungan biasanya dibuat dengan standar kualitas yang lebih tinggi dan tahan lama.

Di COLORE, semua produk kami menggunakan bahan daur ulang dan proses produksi yang berkelanjutan. Kami berkomitmen untuk menciptakan produk yang tidak hanya aman untuk anak, tapi juga untuk bumi.`,
    image: "/api/placeholder/600/400",
    category: "Edukatif",
    author: "Lisa Chen",
    date: "2024-03-10",
    readTime: "4 menit",
    likes: 89,
    comments: 12,
    isNew: true,
    tags: ["ramah lingkungan", "kesehatan", "edukatif"]
  },
  {
    id: 3,
    title: "Workshop COLORE: Membuat Clay Art bersama Anak",
    excerpt: "Recap workshop clay art yang seru bersama 50 anak dan orang tua di Jakarta.",
    content: `Workshop clay art COLORE bulan lalu menjadi momen yang tak terlupakan bagi 50 keluarga di Jakarta. Acara yang berlangsung selama 3 jam ini berhasil menciptakan karya seni yang luar biasa.

## Highlight Workshop

### Antusiasme Peserta
Anak-anak menunjukkan kreativitas yang luar biasa dalam membentuk clay menjadi berbagai bentuk. Mulai dari hewan, bunga, hingga miniatur rumah.

### Pembelajaran Bersama
Orang tua dan anak bekerja sama menciptakan karya, memperkuat bonding keluarga sambil belajar teknik clay art yang benar.

### Produk Ramah Lingkungan
Semua clay yang digunakan dibuat dari bahan alami yang aman untuk anak dan dapat terurai secara alami.

Terima kasih untuk semua peserta yang telah bergabung. Workshop berikutnya akan diadakan bulan depan dengan tema finger painting!`,
    image: "/api/placeholder/600/400",
    category: "Event",
    author: "Tim COLORE",
    date: "2024-03-05",
    readTime: "3 menit",
    likes: 156,
    comments: 24,
    tags: ["workshop", "clay art", "event", "jakarta"]
  },
  {
    id: 4,
    title: "Inovasi Terbaru: Eco Paint Set untuk Balita",
    excerpt: "Peluncuran produk terbaru COLORE yang dirancang khusus untuk anak usia 1-3 tahun.",
    content: `COLORE dengan bangga memperkenalkan inovasi terbaru: Eco Paint Set yang dirancang khusus untuk balita usia 1-3 tahun. Produk ini merupakan hasil riset selama 2 tahun dengan ahli perkembangan anak.

## Fitur Unggulan

### Formula Khusus Balita
- 100% bahan alami dan food-grade
- Mudah dibersihkan dari kulit dan pakaian
- Warna cerah yang menarik perhatian balita

### Kemasan Ramah Anak
- Tutup yang mudah dibuka oleh anak
- Brush dengan pegangan ergonomis
- Packaging yang menarik dan edukatif

### Sertifikasi Internasional
Produk telah mendapat sertifikasi dari berbagai lembaga internasional untuk keamanan produk anak.

Eco Paint Set untuk Balita akan tersedia mulai minggu depan di seluruh toko COLORE dan online store.`,
    image: "/api/placeholder/600/400",
    category: "Produk Baru",
    author: "Tim R&D COLORE",
    date: "2024-03-01",
    readTime: "4 menit",
    likes: 201,
    comments: 35,
    isNew: true,
    tags: ["produk baru", "balita", "paint set", "inovasi"]
  }
];

const categories = [
  { name: "Semua", icon: <BookOpen className="w-4 h-4" />, count: newsArticles.length },
  { name: "Tips & Trik", icon: <Star className="w-4 h-4" />, count: newsArticles.filter(a => a.category === "Tips & Trik").length },
  { name: "Edukatif", icon: <Award className="w-4 h-4" />, count: newsArticles.filter(a => a.category === "Edukatif").length },
  { name: "Event", icon: <Users className="w-4 h-4" />, count: newsArticles.filter(a => a.category === "Event").length },
  { name: "Produk Baru", icon: <TrendingUp className="w-4 h-4" />, count: newsArticles.filter(a => a.category === "Produk Baru").length }
];

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [likedArticles, setLikedArticles] = useState<number[]>([]);

  const ARTICLES_PER_PAGE = 6;

  // Filter articles
  const filteredArticles = newsArticles.filter(article => {
    const matchCategory = selectedCategory === "Semua" || article.category === selectedCategory;
    const matchSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchCategory && matchSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE);
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const displayedArticles = filteredArticles.slice(startIndex, startIndex + ARTICLES_PER_PAGE);

  const toggleLike = (articleId: number) => {
    setLikedArticles(prev => 
      prev.includes(articleId) 
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    );
  };

  const openArticle = (article: NewsArticle) => {
    setSelectedArticle(article);
  };

  const closeArticle = () => {
    setSelectedArticle(null);
  };

  // Article Detail View
  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#A3B18A] to-[#A3B18A]/80 text-white">
          <div className="container mx-auto px-6 lg:px-12 py-8">
            <button
              onClick={closeArticle}
              className="flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Kembali ke Berita
            </button>
            
            <div className="max-w-4xl">
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                  {selectedArticle.category}
                </span>
                {selectedArticle.isNew && (
                  <span className="bg-[#F6CCD0] text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
                    Baru
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                {selectedArticle.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{selectedArticle.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(selectedArticle.date).toLocaleDateString('id-ID', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{selectedArticle.readTime} baca</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative h-96 lg:h-[500px]">
          <Image
            src={selectedArticle.image}
            alt={selectedArticle.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 lg:px-12 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              {/* Article Content */}
              <div className="lg:col-span-3">
                <div className="prose prose-lg max-w-none">
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: selectedArticle.content.replace(/\n/g, '<br/>').replace(/## (.*?)(<br\/>|$)/g, '<h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h2>').replace(/### (.*?)(<br\/>|$)/g, '<h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">$1</h3>')
                    }}
                  />
                </div>

                {/* Tags */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">Tags:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedArticle.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-[#A3B18A]/10 text-[#A3B18A] px-3 py-1 rounded-full text-sm font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Social Actions */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => toggleLike(selectedArticle.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-2xl transition-colors ${
                        likedArticles.includes(selectedArticle.id)
                          ? 'bg-red-50 text-red-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${likedArticles.includes(selectedArticle.id) ? 'fill-current' : ''}`} />
                      <span>{selectedArticle.likes + (likedArticles.includes(selectedArticle.id) ? 1 : 0)}</span>
                    </button>
                    
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-2xl hover:bg-[#A3B18A]/10 hover:text-[#A3B18A] transition-colors">
                      <Share2 className="w-5 h-5" />
                      Bagikan
                    </button>
                    
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-2xl hover:bg-[#A3B18A]/10 hover:text-[#A3B18A] transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      <span>{selectedArticle.comments}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-8">
                  {/* Author Info */}
                  <div className="bg-gray-50 rounded-3xl p-6">
                    <h4 className="font-bold text-gray-900 mb-4">Tentang Penulis</h4>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-[#A3B18A] rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{selectedArticle.author}</div>
                        <div className="text-sm text-gray-600">Penulis COLORE</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Ahli dalam pengembangan kreativitas anak dan produk ramah lingkungan.
                    </p>
                  </div>

                  {/* Related Articles */}
                  <div className="bg-gray-50 rounded-3xl p-6">
                    <h4 className="font-bold text-gray-900 mb-4">Artikel Terkait</h4>
                    <div className="space-y-4">
                      {newsArticles
                        .filter(article => article.id !== selectedArticle.id && article.category === selectedArticle.category)
                        .slice(0, 3)
                        .map(article => (
                          <div
                            key={article.id}
                            onClick={() => openArticle(article)}
                            className="cursor-pointer group"
                          >
                            <h5 className="font-medium text-gray-900 group-hover:text-[#A3B18A] transition-colors text-sm leading-snug">
                              {article.title}
                            </h5>
                            <p className="text-xs text-gray-500 mt-1">{article.readTime} baca</p>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main News List View
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#DFF19D]/10">
      {/* Header Section */}
      <section className="pt-24 pb-12 px-6 lg:px-12">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#A3B18A]/10 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-[#A3B18A]" />
            <span className="text-sm font-medium text-[#A3B18A]">Berita & Artikel</span>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Inspirasi Kreatif
            <span className="block text-[#A3B18A]">untuk Keluarga</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Temukan tips parenting, update produk terbaru, dan cerita inspiratif 
            tentang perkembangan kreativitas anak bersama COLORE.
          </p>

          {/* Featured Stats */}
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <div className="w-3 h-3 bg-[#A3B18A] rounded-full"></div>
              <span className="text-gray-700">Tips Edukatif</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <div className="w-3 h-3 bg-[#F6CCD0] rounded-full"></div>
              <span className="text-gray-700">Update Produk</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <div className="w-3 h-3 bg-[#BFF0F5] rounded-full"></div>
              <span className="text-gray-700">Event & Workshop</span>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="px-6 lg:px-12 mb-12">
        <div className="container mx-auto">
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-[#A3B18A]/10">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari artikel, tips, atau topik..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A3B18A] focus:border-transparent"
                />
              </div>

              {/* Categories */}
              <div className="flex items-center gap-3 overflow-x-auto">
                <Filter className="w-5 h-5 text-[#A3B18A] flex-shrink-0" />
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => {
                      setSelectedCategory(category.name);
                      setCurrentPage(1);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-medium whitespace-nowrap transition-all duration-300 ${
                      selectedCategory === category.name
                        ? "bg-[#A3B18A] text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-[#A3B18A] hover:text-white"
                    }`}
                  >
                    {category.icon}
                    {category.name}
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      selectedCategory === category.name ? "bg-white/20" : "bg-gray-200"
                    }`}>
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {selectedCategory === "Semua" && !searchTerm && (
        <section className="px-6 lg:px-12 mb-12">
          <div className="container mx-auto">
            {newsArticles.filter(article => article.isFeatured)[0] && (
              <div 
                onClick={() => openArticle(newsArticles.filter(article => article.isFeatured)[0])}
                className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer group"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="relative h-80 lg:h-96">
                    <Image
                      src={newsArticles.filter(article => article.isFeatured)[0].image}
                      alt={newsArticles.filter(article => article.isFeatured)[0].title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#A3B18A] text-white px-4 py-2 rounded-full text-sm font-semibold">
                        Featured
                      </span>
                    </div>
                  </div>
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <span className="text-[#A3B18A] font-semibold mb-3">
                      {newsArticles.filter(article => article.isFeatured)[0].category}
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 group-hover:text-[#A3B18A] transition-colors">
                      {newsArticles.filter(article => article.isFeatured)[0].title}
                    </h2>
                    <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                      {newsArticles.filter(article => article.isFeatured)[0].excerpt}
                    </p>
                    <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{newsArticles.filter(article => article.isFeatured)[0].author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(newsArticles.filter(article => article.isFeatured)[0].date).toLocaleDateString('id-ID')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{newsArticles.filter(article => article.isFeatured)[0].readTime}</span>
                      </div>
                    </div>
                    <button className="self-start bg-[#A3B18A] text-white px-6 py-3 rounded-2xl font-semibold hover:bg-[#A3B18A]/90 transition-colors flex items-center gap-2">
                      Baca Selengkapnya
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Articles Grid */}
      <section className="px-6 lg:px-12 mb-12">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">
              {selectedCategory === "Semua" ? "Semua Artikel" : selectedCategory}
            </h3>
            <p className="text-gray-600">
              {filteredArticles.length} artikel ditemukan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => openArticle(article)}
                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer group hover:-translate-y-2"
              >
                <div className="relative h-48">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-white/90 backdrop-blur-sm text-[#A3B18A] px-3 py-1 rounded-full text-xs font-semibold">
                      {article.category}
                    </span>
                    {article.isNew && (
                      <span className="bg-[#F6CCD0] text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">
                        Baru
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#A3B18A] transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {new Date(article.date).toLocaleDateString('id-ID')}
                    </span>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{article.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{article.comments}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {displayedArticles.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-[#A3B18A]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-12 h-12 text-[#A3B18A]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Artikel tidak ditemukan</h3>
              <p className="text-gray-600 mb-6">Coba ubah filter atau kata kunci pencarian Anda.</p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("Semua");
                  setCurrentPage(1);
                }}
                className="bg-[#A3B18A] text-white px-6 py-3 rounded-2xl hover:bg-[#A3B18A]/90 transition-colors"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <section className="px-6 lg:px-12 mb-12">
          <div className="container mx-auto">
            <div className="flex justify-center items-center gap-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="px-6 py-3 border border-[#A3B18A] text-[#A3B18A] rounded-2xl hover:bg-[#A3B18A] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-12 h-12 rounded-2xl font-semibold transition-colors ${
                      currentPage === page
                        ? 'bg-[#A3B18A] text-white'
                        : 'border border-[#A3B18A] text-[#A3B18A] hover:bg-[#A3B18A] hover:text-white'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="px-6 py-3 border border-[#A3B18A] text-[#A3B18A] rounded-2xl hover:bg-[#A3B18A] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="px-6 lg:px-12 mb-12">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-[#A3B18A] to-[#A3B18A]/80 rounded-3xl p-8 lg:p-12 text-white text-center">
            <h3 className="text-3xl lg:text-4xl font-bold mb-4">
              Jangan Lewatkan Update Terbaru
            </h3>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Dapatkan tips parenting, info produk terbaru, dan artikel inspiratif 
              langsung di inbox Anda setiap minggu.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Masukkan email Anda"
                className="flex-1 px-6 py-4 rounded-2xl text-gray-900 outline-none ring-2 ring-white focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-white text-[#A3B18A] px-8 py-4 rounded-2xl font-semibold hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}