"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Heart,
  ArrowLeft,
  ArrowRight,
  Gift,
  Truck,
  Shield,
  Star,
  Sparkles,
  Package,
  CreditCard,
  Tag,
  X,
  CheckCircle
} from "lucide-react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  category: string;
  ageGroup: string;
  isEcoFriendly: boolean;
  inStock: boolean;
}

interface RelatedProduct {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  category: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "Eco Paint Set Premium",
      price: 149000,
      originalPrice: 199000,
      image: "/api/placeholder/300/300",
      quantity: 2,
      category: "Art Supplies",
      ageGroup: "3-6 tahun",
      isEcoFriendly: true,
      inStock: true
    },
    {
      id: 2,
      name: "Nature Craft Kit",
      price: 89000,
      originalPrice: 119000,
      image: "/api/placeholder/300/300",
      quantity: 1,
      category: "Craft Kits",
      ageGroup: "4-8 tahun",
      isEcoFriendly: true,
      inStock: true
    },
    {
      id: 3,
      name: "Creative Clay Set",
      price: 129000,
      image: "/api/placeholder/300/300",
      quantity: 1,
      category: "Educational Toys",
      ageGroup: "3-7 tahun",
      isEcoFriendly: true,
      inStock: false
    }
  ]);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const relatedProducts: RelatedProduct[] = [
    {
      id: 4,
      name: "Rainbow Crayon Pack",
      price: 65000,
      image: "/api/placeholder/300/300",
      rating: 4.7,
      category: "Art Supplies"
    },
    {
      id: 5,
      name: "Origami Master Kit",
      price: 110000,
      originalPrice: 140000,
      image: "/api/placeholder/300/300",
      rating: 4.9,
      category: "Educational Toys"
    },
    {
      id: 6,
      name: "Finger Painting Set",
      price: 75000,
      image: "/api/placeholder/300/300",
      rating: 4.6,
      category: "Art Supplies"
    }
  ];

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(id);
      return;
    }
    setCartItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === "colore10") {
      setAppliedCoupon("COLORE10");
      setCouponCode("");
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Simulate checkout process
    setTimeout(() => {
      setIsCheckingOut(false);
      // Redirect to checkout page
    }, 2000);
  };

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = appliedCoupon === "COLORE10" ? subtotal * 0.1 : 0;
  const shipping = subtotal >= 250000 ? 0 : 15000;
  const total = subtotal - discount + shipping;

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-[#DFF19D]/10 pt-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mx-auto text-center py-20">
            <div className="w-32 h-32 bg-[#A3B18A]/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingCart className="w-16 h-16 text-[#A3B18A]" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Keranjang Kosong
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Belum ada produk kreatif di keranjang Anda. 
              Yuk, jelajahi koleksi produk ramah lingkungan kami!
            </p>
            <button className="bg-[#A3B18A] text-white px-8 py-4 rounded-2xl font-semibold hover:bg-[#A3B18A]/90 transition-colors flex items-center gap-2 mx-auto">
              <ArrowLeft className="w-5 h-5" />
              Mulai Berbelanja
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#DFF19D]/10 pt-24">
      <div className="container mx-auto px-6 lg:px-12 pb-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <button className="flex items-center gap-2 text-gray-600 hover:text-[#A3B18A] transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Lanjut Belanja
            </button>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-[#A3B18A]/10 px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-[#A3B18A]" />
              <span className="text-sm font-medium text-[#A3B18A]">Keranjang Belanja</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Produk <span className="text-[#A3B18A]">Pilihan Anda</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Review produk favorit dan lanjutkan untuk mendapatkan pengalaman berkreasi terbaik untuk si kecil
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Product Image */}
                  <div className="relative w-full sm:w-32 h-48 sm:h-32 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded-2xl"
                    />
                    {!item.inStock && (
                      <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">Stok Habis</span>
                      </div>
                    )}
                    {item.isEcoFriendly && (
                      <div className="absolute top-2 left-2 bg-[#DFF19D] text-gray-800 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Eco
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                      <div>
                        <span className="text-sm text-[#A3B18A] font-medium">{item.category}</span>
                        <h3 className="text-lg font-bold text-gray-900 mt-1">{item.name}</h3>
                        <p className="text-sm text-gray-600">Untuk anak {item.ageGroup}</p>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2 sm:mt-0">
                        <button 
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          title="Tambah ke Wishlist"
                        >
                          <Heart className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          title="Hapus dari Keranjang"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      {/* Price */}
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-[#A3B18A]">
                          Rp {item.price.toLocaleString('id-ID')}
                        </span>
                        {item.originalPrice && (
                          <span className="text-lg text-gray-400 line-through">
                            Rp {item.originalPrice.toLocaleString('id-ID')}
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center bg-gray-100 rounded-2xl">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={!item.inStock}
                            className="p-2 hover:bg-gray-200 rounded-l-2xl transition-colors disabled:opacity-50"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={!item.inStock}
                            className="p-2 hover:bg-gray-200 rounded-r-2xl transition-colors disabled:opacity-50"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-bold text-gray-900">
                            Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                          </div>
                          {!item.inStock && (
                            <div className="text-xs text-red-500">Tidak tersedia</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Coupon Section */}
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#A3B18A]" />
                Kode Promo
              </h3>
              
              {appliedCoupon ? (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-800">{appliedCoupon}</span>
                    <span className="text-sm text-green-600">- 10% Diskon</span>
                  </div>
                  <button onClick={removeCoupon} className="text-green-600 hover:text-green-800">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Masukkan kode promo"
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A3B18A] focus:border-transparent"
                  />
                  <button
                    onClick={applyCoupon}
                    className="px-6 py-3 bg-[#A3B18A] text-white rounded-2xl font-semibold hover:bg-[#A3B18A]/90 transition-colors"
                  >
                    Pakai
                  </button>
                </div>
              )}
              
              <div className="mt-4 text-sm text-gray-600">
                <p>💡 Coba kode: <strong>COLORE10</strong> untuk diskon 10%</p>
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <h3 className="font-bold text-gray-900 mb-4">Ringkasan Pesanan</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({cartItems.length} produk)</span>
                  <span className="font-semibold">Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Diskon Promo</span>
                    <span>- Rp {discount.toLocaleString('id-ID')}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Ongkos Kirim</span>
                  <span className={`font-semibold ${shipping === 0 ? 'text-green-600' : ''}`}>
                    {shipping === 0 ? 'GRATIS' : `Rp ${shipping.toLocaleString('id-ID')}`}
                  </span>
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-[#A3B18A]">Rp {total.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Shield className="w-4 h-4 text-[#A3B18A]" />
                  <span>Pembayaran 100% aman</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Truck className="w-4 h-4 text-[#A3B18A]" />
                  <span>Gratis ongkir untuk belanja di atas 250k</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Package className="w-4 h-4 text-[#A3B18A]" />
                  <span>Garansi 30 hari</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut || cartItems.some(item => !item.inStock)}
                className="w-full bg-[#A3B18A] text-white py-4 rounded-2xl font-semibold hover:bg-[#A3B18A]/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCheckingOut ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Memproses...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Checkout Sekarang
                  </>
                )}
              </button>

              {cartItems.some(item => !item.inStock) && (
                <p className="text-red-500 text-sm text-center mt-3">
                  Beberapa produk tidak tersedia. Hapus untuk melanjutkan.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Produk <span className="text-[#A3B18A]">Rekomendasi</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Lengkapi koleksi kreatif si kecil dengan produk pilihan lainnya
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
                <div className="relative h-48">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors">
                    <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
                  </button>
                </div>

                <div className="p-6">
                  <span className="text-sm text-[#A3B18A] font-medium">{product.category}</span>
                  <h3 className="text-lg font-bold text-gray-900 mt-1 mb-3">{product.name}</h3>
                  
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
                    <span className="text-sm text-gray-600">({product.rating})</span>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xl font-bold text-[#A3B18A]">
                      Rp {product.price.toLocaleString('id-ID')}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        Rp {product.originalPrice.toLocaleString('id-ID')}
                      </span>
                    )}
                  </div>

                  <button className="w-full bg-[#A3B18A] text-white py-3 rounded-2xl font-semibold hover:bg-[#A3B18A]/90 transition-colors flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" />
                    Tambah ke Keranjang
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}