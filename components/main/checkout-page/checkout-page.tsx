"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  ShoppingBag,
  CreditCard,
  User,
  MapPin,
  Truck,
  Gift,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Lock,
  Sparkles,
  Shield,
  Package,
  Heart,
  Edit3,
  TicketPercent,
  XCircle
} from "lucide-react";

interface CheckoutItem {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  category: string;
  ageGroup: string;
  isEcoFriendly: boolean;
}

interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  province: string;
  notes?: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  icon: string;
  fee: number;
  description: string;
}

export default function CheckoutPage() {
  // --- STATE MANAGEMENT ---
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    province: "",
    notes: ""
  });
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [selectedShipping, setSelectedShipping] = useState("regular");
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Voucher States
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<{code: string, amount: number} | null>(null);
  const [voucherError, setVoucherError] = useState("");

  // --- DATA DUMMY ---
  const checkoutItems: CheckoutItem[] = [
    {
      id: 1,
      name: "Eco Paint Set Premium",
      price: 149000,
      originalPrice: 199000,
      image: "/api/placeholder/300/300",
      quantity: 2,
      category: "Art Supplies",
      ageGroup: "3-6 tahun",
      isEcoFriendly: true
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
      isEcoFriendly: true
    }
  ];

  const paymentMethods: PaymentMethod[] = [
    { id: "bank_transfer", name: "Transfer Bank", type: "bank", icon: "🏦", fee: 0, description: "BCA, Mandiri, BRI, BNI" },
    { id: "ewallet", name: "E-Wallet", type: "digital", icon: "📱", fee: 0, description: "GoPay, OVO, DANA, ShopeePay" },
    { id: "virtual_account", name: "Virtual Account", type: "va", icon: "💳", fee: 2500, description: "VA Bank & Retail" },
    { id: "credit_card", name: "Kartu Kredit", type: "card", icon: "💳", fee: 5000, description: "Visa, Mastercard, JCB" }
  ];

  const shippingOptions = [
    { id: "regular", name: "Pengiriman Reguler", duration: "5-7 hari kerja", price: 15000, description: "JNE, TIKI, J&T" },
    { id: "express", name: "Pengiriman Express", duration: "2-3 hari kerja", price: 25000, description: "Same day delivery" },
    { id: "free", name: "Gratis Ongkir", duration: "5-7 hari kerja", price: 0, description: "Min. belanja Rp 250rb" }
  ];

  const steps = [
    { id: 1, title: "Informasi", icon: <User className="w-5 h-5" /> },
    { id: 2, title: "Pengiriman", icon: <Truck className="w-5 h-5" /> },
    { id: 3, title: "Pembayaran", icon: <CreditCard className="w-5 h-5" /> },
    { id: 4, title: "Konfirmasi", icon: <CheckCircle className="w-5 h-5" /> }
  ];

  // --- CALCULATIONS ---
  const subtotal = checkoutItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = subtotal >= 250000 ? 0 : shippingOptions.find(opt => opt.id === selectedShipping)?.price || 0;
  const paymentFee = paymentMethods.find(method => method.id === selectedPayment)?.fee || 0;
  const discountAmount = appliedVoucher ? appliedVoucher.amount : 0;
  
  const total = Math.max(0, subtotal + shippingCost + paymentFee - discountAmount);

  // --- HANDLERS ---
  const handleInputChange = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleApplyVoucher = () => {
    setVoucherError("");
    if (!voucherCode) {
      setVoucherError("Masukkan kode voucher terlebih dahulu");
      return;
    }
    
    // Simulasi validasi voucher
    if (voucherCode.toUpperCase() === "HEMAT50") {
      setAppliedVoucher({ code: "HEMAT50", amount: 50000 });
      setVoucherCode("");
    } else if (voucherCode.toUpperCase() === "DISKON10") {
      setAppliedVoucher({ code: "DISKON10", amount: subtotal * 0.1 });
      setVoucherCode("");
    } else {
      setVoucherError("Kode voucher tidak valid");
    }
  };

  const removeVoucher = () => {
    setAppliedVoucher(null);
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1: return !!(shippingInfo.fullName && shippingInfo.email && shippingInfo.phone);
      case 2: return !!(shippingInfo.address && shippingInfo.city && shippingInfo.postalCode && shippingInfo.province);
      case 3: return !!(selectedPayment && selectedShipping);
      case 4: return agreeToTerms;
      default: return false;
    }
  };

  const nextStep = () => {
    if (validateStep() && currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert("Redirecting to payment gateway...");
    }, 2000);
  };

  // --- SUB COMPONENTS ---
  
  // Component: Voucher Input Section
  const VoucherSection = ({ className = "" }: { className?: string }) => (
    <div className={`bg-white rounded-3xl p-6 shadow-lg border border-[#A3B18A]/20 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <TicketPercent className="w-5 h-5 text-[#A3B18A]" />
        <h3 className="font-bold text-gray-900">Kode Voucher & Diskon</h3>
      </div>
      
      {appliedVoucher ? (
        <div className="bg-[#A3B18A]/10 border border-[#A3B18A] rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#A3B18A] rounded-full flex items-center justify-center text-white">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-[#A3B18A]">{appliedVoucher.code}</p>
              <p className="text-xs text-gray-600">Berhasil hemat Rp {appliedVoucher.amount.toLocaleString('id-ID')}</p>
            </div>
          </div>
          <button onClick={removeVoucher} className="text-red-500 hover:text-red-700 transition-colors">
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
              placeholder="Masukkan kode (ex: HEMAT50)"
              className="flex-1 px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A3B18A] focus:border-transparent uppercase"
            />
            <button 
              onClick={handleApplyVoucher}
              className="px-6 py-3 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 transition-colors font-medium"
            >
              Pakai
            </button>
          </div>
          {voucherError && (
            <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
              <XCircle className="w-3 h-3" /> {voucherError}
            </p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#DFF19D]/10 pt-24 font-sans">
      <div className="container mx-auto px-4 md:px-6 lg:px-12 pb-12">
        
        {/* Header */}
        <div className="mb-8">
          <button className="flex items-center gap-2 text-gray-600 hover:text-[#A3B18A] transition-colors mb-6">
            <ArrowLeft className="w-5 h-5" /> Kembali ke Keranjang
          </button>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-[#A3B18A]/10 px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-[#A3B18A]" />
              <span className="text-sm font-medium text-[#A3B18A]">Checkout Aman</span>
            </div>
            <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
              Selesaikan <span className="text-[#A3B18A]">Pesanan</span>
            </h1>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="bg-white rounded-3xl p-6 shadow-lg mx-auto max-w-4xl">
            <div className="flex items-center justify-between relative">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center relative z-10 w-1/4">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center font-semibold transition-all duration-300 ${
                    currentStep >= step.id ? "bg-[#A3B18A] text-white shadow-lg" : "bg-gray-100 text-gray-500"
                  }`}>
                    {currentStep > step.id ? <CheckCircle className="w-5 h-5 md:w-6 md:h-6" /> : step.icon}
                  </div>
                  <span className={`text-xs md:text-sm font-medium mt-2 text-center ${
                    currentStep >= step.id ? "text-[#A3B18A]" : "text-gray-400"
                  }`}>{step.title}</span>
                </div>
              ))}
              {/* Progress Line Background */}
              <div className="absolute top-5 md:top-6 left-0 w-full h-1 bg-gray-100 -z-0 rounded-full">
                 <div 
                    className="h-full bg-[#A3B18A] transition-all duration-500 rounded-full"
                    style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                 />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* COLUMN 1: FORM (Left) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg">
              
              {/* Step 1: Customer Info */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 bg-[#A3B18A] rounded-xl flex items-center justify-center text-white">
                      <User className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Informasi Kontak</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap *</label>
                      <input
                        type="text"
                        value={shippingInfo.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A3B18A] focus:bg-white transition-all"
                        placeholder="Nama Penerima"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A3B18A] focus:bg-white transition-all"
                        placeholder="email@example.com"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Nomor Telepon *</label>
                      <input
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A3B18A] focus:bg-white transition-all"
                        placeholder="0812..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Shipping */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 bg-[#A3B18A] rounded-xl flex items-center justify-center text-white">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Alamat Pengiriman</h2>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Alamat Lengkap *</label>
                    <textarea
                      value={shippingInfo.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A3B18A] focus:bg-white transition-all"
                      placeholder="Nama jalan, nomor rumah, RT/RW..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Kota *</label>
                      <input type="text" value={shippingInfo.city} onChange={(e) => handleInputChange("city", e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A3B18A]" placeholder="Jakarta" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Kode Pos *</label>
                      <input type="text" value={shippingInfo.postalCode} onChange={(e) => handleInputChange("postalCode", e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A3B18A]" placeholder="12345" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Provinsi *</label>
                      <select value={shippingInfo.province} onChange={(e) => handleInputChange("province", e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A3B18A]">
                        <option value="">Pilih Provinsi</option>
                        <option value="DKI Jakarta">DKI Jakarta</option>
                        <option value="Jawa Barat">Jawa Barat</option>
                      </select>
                    </div>
                  </div>

                  {/* Shipping Options */}
                  <div className="space-y-3 pt-4">
                    <h3 className="font-bold text-gray-900">Pilih Kurir</h3>
                    {shippingOptions.map((option) => (
                      <div key={option.id} onClick={() => setSelectedShipping(option.id)}
                        className={`p-4 border-2 rounded-2xl cursor-pointer flex justify-between items-center transition-all ${
                          selectedShipping === option.id ? "border-[#A3B18A] bg-[#A3B18A]/5" : "border-gray-100 hover:border-gray-300"
                        }`}>
                        <div className="flex items-center gap-3">
                           <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedShipping === option.id ? "border-[#A3B18A]" : "border-gray-300"}`}>
                              {selectedShipping === option.id && <div className="w-2.5 h-2.5 bg-[#A3B18A] rounded-full" />}
                           </div>
                           <div>
                             <p className="font-bold text-gray-800">{option.name}</p>
                             <p className="text-xs text-gray-500">{option.duration} • {option.description}</p>
                           </div>
                        </div>
                        <span className="font-bold text-[#A3B18A]">{option.price === 0 ? "GRATIS" : `Rp ${option.price.toLocaleString('id-ID')}`}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* SECTION VOUCHER (Di dalam Step 3 agar user set voucher sebelum pilih bayar) */}
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
                     <div className="flex gap-3">
                       <Gift className="w-6 h-6 text-blue-600 flex-shrink-0" />
                       <div>
                         <h4 className="font-bold text-blue-900">Punya kode voucher?</h4>
                         <p className="text-sm text-blue-700">Pastikan Anda memasukkan kode voucher di kolom sebelah kanan (Desktop) atau di bawah (Mobile) sebelum memilih pembayaran untuk mendapatkan potongan harga.</p>
                       </div>
                     </div>
                  </div>

                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 bg-[#A3B18A] rounded-xl flex items-center justify-center text-white">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Metode Pembayaran</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {paymentMethods.map((method) => (
                      <div key={method.id} onClick={() => setSelectedPayment(method.id)}
                        className={`p-4 border-2 rounded-2xl cursor-pointer transition-all relative overflow-hidden ${
                          selectedPayment === method.id ? "border-[#A3B18A] bg-[#A3B18A]/5" : "border-gray-100 hover:border-gray-300"
                        }`}>
                        <div className="flex items-center gap-3 relative z-10">
                          <div className="text-2xl">{method.icon}</div>
                          <div>
                            <p className="font-bold text-gray-800">{method.name}</p>
                            <p className="text-xs text-gray-500">{method.description}</p>
                          </div>
                        </div>
                        {method.fee > 0 && (
                           <span className="absolute top-2 right-2 text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                             +Rp {method.fee.toLocaleString('id-ID')}
                           </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Confirmation */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 bg-[#A3B18A] rounded-xl flex items-center justify-center text-white">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Konfirmasi Akhir</h2>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                     <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-gray-900">Data Pengiriman</h3>
                        <button onClick={() => setCurrentStep(1)} className="text-[#A3B18A] text-sm hover:underline flex items-center gap-1"><Edit3 className="w-3 h-3"/> Edit</button>
                     </div>
                     <div className="text-sm text-gray-600 space-y-1">
                        <p className="font-medium text-gray-900">{shippingInfo.fullName}</p>
                        <p>{shippingInfo.phone}</p>
                        <p>{shippingInfo.address}, {shippingInfo.city}</p>
                        <p>{shippingInfo.province}, {shippingInfo.postalCode}</p>
                     </div>
                  </div>

                  <div className="flex items-center bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                      className="w-5 h-5 text-[#A3B18A] border-gray-300 rounded focus:ring-[#A3B18A] cursor-pointer"
                    />
                    <label htmlFor="terms" className="ml-3 text-sm text-gray-600 cursor-pointer select-none">
                      Saya menyetujui <span className="text-[#A3B18A] font-medium">Syarat & Ketentuan</span> yang berlaku.
                    </label>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-8 mt-4 border-t border-gray-100">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-600 rounded-2xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  <ArrowLeft className="w-5 h-5" /> Kembali
                </button>

                {currentStep < 4 ? (
                  <button
                    onClick={nextStep}
                    disabled={!validateStep()}
                    className="flex items-center gap-2 px-8 py-3 bg-[#A3B18A] text-white rounded-2xl hover:bg-[#A3B18A]/90 shadow-lg shadow-[#A3B18A]/30 transition-all disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed font-bold"
                  >
                    Selanjutnya <ArrowRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!validateStep() || isProcessing}
                    className="flex items-center gap-2 px-10 py-3 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                  >
                    {isProcessing ? "Memproses..." : "Bayar Sekarang"} <Lock className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* COLUMN 2: SIDEBAR (Right) */}
          <div className="space-y-6 sticky top-24">
            
            {/* 1. POSISI VOUCHER (PALING ATAS) */}
            {/* Sesuai permintaan: "metode pembayaran dan ringkasan pesanan itu posisi nya dibawah vocher" */}
            <VoucherSection className="mb-6" />

            {/* 2. RINGKASAN PESANAN (DIBAWAH VOUCHER) */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                <ShoppingBag className="w-5 h-5 text-[#A3B18A]" /> Ringkasan Pesanan
              </h3>

              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {checkoutItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-14 h-14 flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover rounded-xl bg-gray-100" />
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-900 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-gray-500 mb-1">{item.category}</p>
                      <div className="flex justify-between items-center">
                         <span className="font-bold text-[#A3B18A] text-sm">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 pt-4 border-t border-gray-100 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({checkoutItems.length} item)</span>
                  <span className="font-medium">Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Ongkos Kirim</span>
                  <span className={shippingCost === 0 ? "text-green-600 font-medium" : "font-medium"}>
                    {shippingCost === 0 ? "GRATIS" : `Rp ${shippingCost.toLocaleString('id-ID')}`}
                  </span>
                </div>
                {paymentFee > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Biaya Layanan</span>
                    <span className="font-medium">Rp {paymentFee.toLocaleString('id-ID')}</span>
                  </div>
                )}
                
                {/* Tampilan Diskon */}
                {appliedVoucher && (
                  <div className="flex justify-between text-green-600 bg-green-50 p-2 rounded-lg">
                    <span className="flex items-center gap-1"><TicketPercent className="w-4 h-4"/> Diskon ({appliedVoucher.code})</span>
                    <span className="font-bold">- Rp {appliedVoucher.amount.toLocaleString('id-ID')}</span>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900 text-lg">Total Tagihan</span>
                    <span className="text-2xl font-bold text-[#A3B18A]">Rp {total.toLocaleString('id-ID')}</span>
                  </div>
                  <p className="text-xs text-right text-gray-400 mt-1">Termasuk pajak PPN 11%</p>
                </div>
              </div>
            </div>

            {/* 3. TRUST INDICATORS (DIBAWAH SUMMARY) */}
            <div className="bg-white/60 backdrop-blur rounded-3xl p-6 border border-white/50">
              <div className="space-y-3 text-xs font-medium text-gray-600">
                <div className="flex items-center gap-3 p-2 hover:bg-white rounded-xl transition-colors">
                  <Shield className="w-5 h-5 text-[#A3B18A]" /> <span>Garansi Uang Kembali</span>
                </div>
                <div className="flex items-center gap-3 p-2 hover:bg-white rounded-xl transition-colors">
                  <Package className="w-5 h-5 text-[#A3B18A]" /> <span>Packing Aman & Rapi</span>
                </div>
                <div className="flex items-center gap-3 p-2 hover:bg-white rounded-xl transition-colors">
                  <Heart className="w-5 h-5 text-[#A3B18A]" /> <span>Layanan Pelanggan 24/7</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}