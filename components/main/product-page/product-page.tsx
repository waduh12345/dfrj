"use client";

import { useState, useEffect } from "react";
import { 
  Heart, 
  ShoppingCart, 
  Eye, 
  Star,
  Filter,
  Search,
  ChevronDown,
  Palette,
  Scissors,
  PaintBucket,
  Package,
  Grid3X3,
  List,
  Sparkles
} from "lucide-react";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  ageGroup: string;
  rating: number;
  reviews: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  isEcoFriendly?: boolean;
  description: string;
}

export default function ProductsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [filter, setFilter] = useState({
    category: "all",
    ageGroup: "all",
    priceRange: "all",
    sort: "featured"
  });

  const ITEMS_PER_PAGE = 12;

  // Mock products data
  const mockProducts: Product[] = [
    {
      id: 1,
      name: "Eco Paint Set Premium",
      price: 149000,
      originalPrice: 199000,
      image: "/api/placeholder/400/400",
      category: "Art Supplies",
      ageGroup: "3-6",
      rating: 4.9,
      reviews: 124,
      isBestSeller: true,
      isEcoFriendly: true,
      description: "Set cat air ramah lingkungan dengan 24 warna cerah dan brush berkualitas tinggi."
    },
    {
      id: 2,
      name: "Nature Craft Kit",
      price: 89000,
      originalPrice: 119000,
      image: "/api/placeholder/400/400",
      category: "Craft Kits",
      ageGroup: "4-8",
      rating: 4.8,
      reviews: 89,
      isNew: true,
      isEcoFriendly: true,
      description: "Kit kerajinan dengan bahan-bahan alami untuk mengembangkan kreativitas anak."
    },
    {
      id: 3,
      name: "Creative Clay Set",
      price: 129000,
      originalPrice: 169000,
      image: "/api/placeholder/400/400",
      category: "Educational Toys",
      ageGroup: "3-7",
      rating: 4.9,
      reviews: 156,
      isBestSeller: true,
      isEcoFriendly: true,
      description: "Clay non-toxic dengan tools lengkap untuk membentuk dan mencetak."
    },
    {
      id: 4,
      name: "Rainbow Crayon Pack",
      price: 65000,
      image: "/api/placeholder/400/400",
      category: "Art Supplies",
      ageGroup: "2-5",
      rating: 4.7,
      reviews: 201,
      isEcoFriendly: true,
      description: "24 crayon warna-warni dari bahan organik yang aman untuk balita."
    },
    {
      id: 5,
      name: "Paper Craft Workshop",
      price: 95000,
      image: "/api/placeholder/400/400",
      category: "Workshop Kits",
      ageGroup: "5-10",
      rating: 4.8,
      reviews: 78,
      isNew: true,
      isEcoFriendly: true,
      description: "Kit lengkap untuk membuat berbagai kerajinan kertas yang menarik."
    },
    {
      id: 6,
      name: "Finger Painting Set",
      price: 75000,
      image: "/api/placeholder/400/400",
      category: "Art Supplies",
      ageGroup: "1-4",
      rating: 4.6,
      reviews: 92,
      isEcoFriendly: true,
      description: "Cat jari non-toxic untuk eksplorasi seni anak usia dini."
    },
    {
      id: 7,
      name: "Origami Master Kit",
      price: 110000,
      image: "/api/placeholder/400/400",
      category: "Educational Toys",
      ageGroup: "6-12",
      rating: 4.9,
      reviews: 145,
      isBestSeller: true,
      isEcoFriendly: true,
      description: "Set origami lengkap dengan 100 kertas warna dan buku panduan."
    },
    {
      id: 8,
      name: "Wooden Art Easel",
      price: 299000,
      originalPrice: 399000,
      image: "/api/placeholder/400/400",
      category: "Art Supplies",
      ageGroup: "3-10",
      rating: 4.8,
      reviews: 67,
      isEcoFriendly: true,
      description: "Easel kayu premium dengan papan tulis dan whiteboard."
    },
    {
      id: 9,
      name: "Eco Coloring Books",
      price: 45000,
      image: "/api/placeholder/400/400",
      category: "Educational Toys",
      ageGroup: "2-8",
      rating: 4.7,
      reviews: 189,
      isEcoFriendly: true,
      description: "Set 6 buku mewarnai dengan tema edukatif dan kertas daur ulang."
    }
  ];

  // Filter products
  const filteredProducts = mockProducts.filter((product) => {
    const matchCategory = filter.category === "all" || product.category === filter.category;
    const matchAgeGroup = filter.ageGroup === "all" || product.ageGroup === filter.ageGroup;
    const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchPrice = filter.priceRange === "all" || 
      (filter.priceRange === "under-100k" && product.price < 100000) ||
      (filter.priceRange === "100k-200k" && product.price >= 100000 && product.price <= 200000) ||
      (filter.priceRange === "above-200k" && product.price > 200000);

    return matchCategory && matchAgeGroup && matchSearch && matchPrice;
  });

  // Sort products
  const sortedProducts = filteredProducts.sort((a, b) => {
    switch (filter.sort) {
      case "price-low": return a.price - b.price;
      case "price-high": return b.price - a.price;
      case "rating": return b.rating - a.rating;
      case "newest": return a.isNew ? -1 : 1;
      default: return a.isBestSeller ? -1 : 1;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedProducts = sortedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const toggleWishlist = (productId: number) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const addToCart = (product: Product) => {
    setCartCount(prev => prev + 1);
    // Dispatch custom event for cart update
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    }
  };

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#DFF19D]/10">
      {/* Header Section */}
      <section className="pt-24 pb-12 px-6 lg:px-12">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#A3B18A]/10 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-[#A3B18A]" />
            <span className="text-sm font-medium text-[#A3B18A]">Produk Ramah Lingkungan</span>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Koleksi Produk
            <span className="block text-[#A3B18A]">COLORE</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Jelajahi koleksi lengkap produk seni dan kerajinan ramah lingkungan yang dirancang khusus 
            untuk mengembangkan kreativitas anak dengan cara yang aman dan menyenangkan.
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#A3B18A] rounded-full"></div>
              <span>100% Ramah Lingkungan</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#F6CCD0] rounded-full"></div>
              <span>Aman untuk Anak</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#BFF0F5] rounded-full"></div>
              <span>Tersertifikasi Internasional</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="px-6 lg:px-12 mb-8">
        <div className="container mx-auto">
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-[#A3B18A]/10">
            <div className="flex flex-wrap lg:flex-nowrap items-center gap-4">
              {/* Search */}
              <div className="relative flex-1 min-w-[300px]">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari produk favorit anak..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A3B18A] focus:border-transparent"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                <select
                  value={filter.category}
                  onChange={(e) => setFilter({...filter, category: e.target.value})}
                  className="px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A3B18A] bg-white"
                >
                  <option value="all">Semua Kategori</option>
                  <option value="Art Supplies">Art Supplies</option>
                  <option value="Craft Kits">Craft Kits</option>
                  <option value="Educational Toys">Educational Toys</option>
                  <option value="Workshop Kits">Workshop Kits</option>
                </select>

                <select
                  value={filter.ageGroup}
                  onChange={(e) => setFilter({...filter, ageGroup: e.target.value})}
                  className="px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A3B18A] bg-white"
                >
                  <option value="all">Semua Usia</option>
                  <option value="1-4">1-4 Tahun</option>
                  <option value="3-6">3-6 Tahun</option>
                  <option value="4-8">4-8 Tahun</option>
                  <option value="5-10">5-10 Tahun</option>
                  <option value="6-12">6-12 Tahun</option>
                </select>

                <select
                  value={filter.priceRange}
                  onChange={(e) => setFilter({...filter, priceRange: e.target.value})}
                  className="px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A3B18A] bg-white"
                >
                  <option value="all">Semua Harga</option>
                  <option value="under-100k">Di bawah 100k</option>
                  <option value="100k-200k">100k - 200k</option>
                  <option value="above-200k">Di atas 200k</option>
                </select>

                <select
                  value={filter.sort}
                  onChange={(e) => setFilter({...filter, sort: e.target.value})}
                  className="px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A3B18A] bg-white"
                >
                  <option value="featured">Unggulan</option>
                  <option value="newest">Terbaru</option>
                  <option value="price-low">Harga: Rendah - Tinggi</option>
                  <option value="price-high">Harga: Tinggi - Rendah</option>
                  <option value="rating">Rating Tertinggi</option>
                </select>
              </div>

              {/* View Mode */}
              <div className="flex bg-gray-100 rounded-2xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-xl transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white shadow-sm text-[#A3B18A]' 
                      : 'text-gray-500 hover:text-[#A3B18A]'
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-xl transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white shadow-sm text-[#A3B18A]' 
                      : 'text-gray-500 hover:text-[#A3B18A]'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="px-6 lg:px-12 mb-12">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <p className="text-gray-600">
              Menampilkan {displayedProducts.length} dari {sortedProducts.length} produk
            </p>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {displayedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:-translate-y-2"
                >
                  <div className="relative">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={400}
                      height={300}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {product.isBestSeller && (
                        <span className="bg-[#A3B18A] text-white px-3 py-1 rounded-full text-xs font-semibold">
                          Best Seller
                        </span>
                      )}
                      {product.isNew && (
                        <span className="bg-[#F6CCD0] text-white px-3 py-1 rounded-full text-xs font-semibold">
                          New
                        </span>
                      )}
                      {product.isEcoFriendly && (
                        <span className="bg-[#DFF19D] text-gray-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Eco
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className={`p-2 rounded-full shadow-lg transition-colors ${
                          wishlist.includes(product.id)
                            ? 'bg-red-500 text-white'
                            : 'bg-white text-gray-600 hover:text-red-500'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${wishlist.includes(product.id) ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => openProductModal(product)}
                        className="p-2 bg-white text-gray-600 hover:text-[#A3B18A] rounded-full shadow-lg transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Discount Badge */}
                    {product.originalPrice && (
                      <div className="absolute bottom-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="mb-3">
                      <span className="text-xs text-[#A3B18A] font-medium">{product.category}</span>
                      <h3 className="text-lg font-bold text-gray-900 mt-1 line-clamp-2">
                        {product.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= product.rating 
                                ? 'fill-yellow-400 text-yellow-400' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">({product.reviews})</span>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl font-bold text-[#A3B18A]">
                        Rp {product.price.toLocaleString('id-ID')}
                      </span>
                      {product.originalPrice && (
                        <span className="text-lg text-gray-400 line-through">
                          Rp {product.originalPrice.toLocaleString('id-ID')}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => addToCart(product)}
                        className="flex-1 bg-[#A3B18A] text-white py-3 rounded-2xl font-semibold hover:bg-[#A3B18A]/90 transition-colors flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {displayedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="relative md:w-80">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={400}
                        height={300}
                        className="w-full h-64 md:h-full object-cover"
                      />
                      
                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {product.isBestSeller && (
                          <span className="bg-[#A3B18A] text-white px-3 py-1 rounded-full text-xs font-semibold">
                            Best Seller
                          </span>
                        )}
                        {product.isNew && (
                          <span className="bg-[#F6CCD0] text-white px-3 py-1 rounded-full text-xs font-semibold">
                            New
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <span className="text-sm text-[#A3B18A] font-medium">{product.category}</span>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{product.name}</h3>
                          </div>
                          <button
                            onClick={() => toggleWishlist(product.id)}
                            className={`p-2 rounded-full transition-colors ${
                              wishlist.includes(product.id)
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-100 text-gray-600 hover:text-red-500'
                            }`}
                          >
                            <Heart className={`w-5 h-5 ${wishlist.includes(product.id) ? 'fill-current' : ''}`} />
                          </button>
                        </div>

                        <p className="text-gray-600 mb-4">{product.description}</p>

                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex items-center gap-1">
                            {[1,2,3,4,5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= product.rating 
                                    ? 'fill-yellow-400 text-yellow-400' 
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">({product.reviews} ulasan)</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl font-bold text-[#A3B18A]">
                            Rp {product.price.toLocaleString('id-ID')}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xl text-gray-400 line-through">
                              Rp {product.originalPrice.toLocaleString('id-ID')}
                            </span>
                          )}
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => openProductModal(product)}
                            className="px-6 py-3 border border-[#A3B18A] text-[#A3B18A] rounded-2xl hover:bg-[#A3B18A] hover:text-white transition-colors"
                          >
                            Detail
                          </button>
                          <button
                            onClick={() => addToCart(product)}
                            className="px-6 py-3 bg-[#A3B18A] text-white rounded-2xl hover:bg-[#A3B18A]/90 transition-colors flex items-center gap-2"
                          >
                            <ShoppingCart className="w-5 h-5" />
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {displayedProducts.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-[#A3B18A]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-12 h-12 text-[#A3B18A]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Produk tidak ditemukan</h3>
              <p className="text-gray-600 mb-6">Coba ubah filter atau kata kunci pencarian Anda.</p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilter({
                    category: "all",
                    ageGroup: "all", 
                    priceRange: "all",
                    sort: "featured"
                  });
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

      {/* Product Detail Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Detail Produk</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-2xl transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative">
                  <Image
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    width={500}
                    height={400}
                    className="w-full h-96 object-cover rounded-2xl"
                  />
                </div>

                <div>
                  <span className="text-sm text-[#A3B18A] font-medium">{selectedProduct.category}</span>
                  <h3 className="text-3xl font-bold text-gray-900 mt-2 mb-4">{selectedProduct.name}</h3>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= selectedProduct.rating 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-600">({selectedProduct.reviews} ulasan)</span>
                  </div>

                  <p className="text-gray-600 mb-6">{selectedProduct.description}</p>

                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-4xl font-bold text-[#A3B18A]">
                      Rp {selectedProduct.price.toLocaleString('id-ID')}
                    </span>
                    {selectedProduct.originalPrice && (
                      <span className="text-2xl text-gray-400 line-through">
                        Rp {selectedProduct.originalPrice.toLocaleString('id-ID')}
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="font-medium">Kategori:</span>
                      <span>{selectedProduct.category}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="font-medium">Usia:</span>
                      <span>{selectedProduct.ageGroup} tahun</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="font-medium">Ramah Lingkungan:</span>
                      <span>{selectedProduct.isEcoFriendly ? '✓ Ya' : '✗ Tidak'}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        addToCart(selectedProduct);
                        setIsModalOpen(false);
                      }}
                      className="flex-1 bg-[#A3B18A] text-white py-4 rounded-2xl font-semibold hover:bg-[#A3B18A]/90 transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Tambah ke Keranjang
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}