"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  Search,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  ShoppingBag,
  CreditCard,
  AlertCircle,
  Calendar
} from "lucide-react";

import { fredoka, sniglet } from "@/lib/fonts";
import DotdLoader from "@/components/loader/3dot";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

// Import Server Action yang baru dibuat
import { encryptTransactionId } from "@/app/actions/security"; 

// --- TIPE DATA MOCKUP ---
type OrderStatus = "PENDING" | "PAID" | "PROCESSED" | "SHIPPED" | "COMPLETED" | "CANCELLED";

interface TrackResult {
  id: number;
  reference: string;
  status: OrderStatus;
  created_at: string;
  grand_total: number;
  resi_number?: string;
  courier: string;
  service: string;
  buyer_name: string;
  buyer_address: string;
  items: {
    id: number;
    name: string;
    image: string;
    qty: number;
    price: number;
  }[];
  history: {
    status: OrderStatus;
    description: string;
    date: string;
  }[];
}

export default function TrackOrderPage() {
  const router = useRouter();
  
  // --- STATE ---
  const [searchCode, setSearchCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TrackResult | null>(null);
  
  // State untuk menyimpan ID yang sudah dienkripsi
  const [encryptedId, setEncryptedId] = useState<string>("");

  // --- HANDLER ---
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) {
      Swal.fire({ icon: "warning", title: "Oops...", text: "Masukkan kode transaksi terlebih dahulu!" });
      return;
    }

    setIsLoading(true);
    setResult(null);
    setEncryptedId(""); // Reset encrypted ID

    // --- SIMULASI API CALL ---
    setTimeout(async () => {
      // Logika Dummy: Jika kode == "TRX-NOTFOUND", return null/error
      if (searchCode === "TRX-NOTFOUND") {
        Swal.fire({ icon: "error", title: "Tidak Ditemukan", text: "Kode transaksi tidak ditemukan." });
        setIsLoading(false);
        return;
      }

      // Data Dummy Sukses
      const mockData: TrackResult = {
        id: 1,
        reference: searchCode.toUpperCase(),
        status: "SHIPPED", 
        created_at: new Date().toISOString(),
        grand_total: 450000,
        resi_number: "JP1234567890",
        courier: "JNE",
        service: "REG",
        buyer_name: "Budi Santoso",
        buyer_address: "Jl. Merpati No. 12, Jakarta Timur",
        items: [
          { id: 1, name: "Paket Melukis Anak Eco-Friendly", image: "/api/placeholder/100/100", qty: 1, price: 150000 },
          { id: 2, name: "Crayon Organik Set 12 Warna", image: "/api/placeholder/100/100", qty: 2, price: 142500 },
        ],
        history: [
          { status: "PENDING", description: "Pesanan dibuat, menunggu pembayaran", date: new Date(Date.now() - 86400000 * 3).toISOString() },
          { status: "PAID", description: "Pembayaran diterima", date: new Date(Date.now() - 86400000 * 2).toISOString() },
          { status: "PROCESSED", description: "Pesanan sedang dikemas", date: new Date(Date.now() - 86400000 * 1).toISOString() },
          { status: "SHIPPED", description: "Pesanan diserahkan ke kurir (JNE)", date: new Date().toISOString() },
        ]
      };

      // [NEW] Enkripsi Reference ID menggunakan Server Action
      try {
        // Kita mengenkripsi reference code (misal: TRX-2025...)
        const encrypted = await encryptTransactionId(mockData.reference);
        setEncryptedId(encrypted);
      } catch (error) {
        console.error("Encryption failed", error);
      }

      setResult(mockData);
      setIsLoading(false);
    }, 1500);
  };

  // --- HELPER UTILS ---
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "PAID": return "bg-blue-100 text-blue-700 border-blue-200";
      case "PROCESSED": return "bg-indigo-100 text-indigo-700 border-indigo-200";
      case "SHIPPED": return "bg-purple-100 text-purple-700 border-purple-200";
      case "COMPLETED": return "bg-green-100 text-green-700 border-green-200";
      case "CANCELLED": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStepStatus = (step: string, currentStatus: OrderStatus) => {
    const order = ["PENDING", "PAID", "PROCESSED", "SHIPPED", "COMPLETED"];
    const currentIndex = order.indexOf(currentStatus);
    const stepIndex = order.indexOf(step);

    if (currentStatus === "CANCELLED") return "inactive";
    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "inactive";
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-white to-[#DFF19D]/10 pt-24 pb-12 ${sniglet.className}`}>
      <div className="container mx-auto px-6 lg:px-12">
        
        {/* TITLE SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-10">
           <div className="inline-flex items-center gap-2 bg-[#A3B18A]/10 px-4 py-2 rounded-full mb-4">
              <Truck className="w-4 h-4 text-[#A3B18A]" />
              <span className="text-sm font-medium text-[#A3B18A]">Lacak Kiriman</span>
            </div>
            <h1 className={`text-4xl font-bold text-gray-900 mb-4 ${fredoka.className}`}>
              Lacak Status <span className="text-[#A3B18A]">Pesanan Anda</span>
            </h1>
            <p className="text-gray-600">
              Masukkan Kode Transaksi (contoh: TRX-2025...) yang dikirimkan ke email Anda untuk mengetahui posisi paket terkini.
            </p>
        </div>

        {/* SEARCH FORM */}
        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input 
                type="text" 
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="Masukkan Kode Transaksi..." 
                className="w-full pl-14 pr-32 py-5 rounded-full border-2 border-gray-200 focus:border-[#A3B18A] focus:ring-4 focus:ring-[#A3B18A]/20 shadow-lg text-lg outline-none transition-all"
              />
              <button 
                type="submit"
                disabled={isLoading}
                className="absolute right-2 top-2 bottom-2 bg-[#A3B18A] text-white px-6 rounded-full font-bold hover:bg-[#A3B18A]/90 transition-colors disabled:opacity-70"
              >
                {isLoading ? "Mencari..." : "Lacak"}
              </button>
            </div>
          </form>
        </div>

        {/* LOADING STATE */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <DotdLoader />
          </div>
        )}

        {/* RESULT SECTION */}
        {!isLoading && result && (
          <div className="max-w-4xl mx-auto animate-fade-in-up">
            
            {/* Header Card */}
            <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-lg border border-gray-100 mb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Kode Transaksi</p>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-gray-900">{result.reference}</h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(result.status)}`}>
                      {result.status}
                    </span>
                  </div>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-sm text-gray-500 mb-1">Tanggal Pemesanan</p>
                  <div className="flex items-center gap-2 text-gray-900 font-medium">
                    <Calendar className="w-4 h-4 text-[#A3B18A]" />
                    {format(new Date(result.created_at), 'dd MMM yyyy, HH:mm', { locale: idLocale })}
                  </div>
                </div>
              </div>

              {/* Alert if Pending */}
              {result.status === "PENDING" && (
                <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-bold text-yellow-800">Menunggu Pembayaran</p>
                      <p className="text-sm text-yellow-700">Pesanan belum dibayar. Silakan upload bukti transfer.</p>
                    </div>
                  </div>
                  
                  {/* Menggunakan ID yang sudah dienkripsi */}
                  {encryptedId ? (
                    <Link 
                      href={`/guest/transaction/${encodeURIComponent(encryptedId)}`}
                      className="bg-yellow-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-yellow-600 transition-colors whitespace-nowrap shadow-lg shadow-yellow-500/30"
                    >
                      Bayar Sekarang
                    </Link>
                  ) : (
                    <div className="h-10 w-32 bg-gray-200 rounded-xl animate-pulse"></div>
                  )}
                  
                </div>
              )}

              {/* Timeline Visual */}
              <div className="relative px-4 py-4">
                {/* Mobile Timeline (Vertical) */}
                <div className="block md:hidden space-y-8 pl-4 border-l-2 border-gray-100 ml-2">
                  {[
                    { key: "PENDING", label: "Pesanan Dibuat", icon: Package },
                    { key: "PAID", label: "Pembayaran Diterima", icon: CreditCard },
                    { key: "PROCESSED", label: "Diproses", icon: Clock },
                    { key: "SHIPPED", label: "Dikirim", icon: Truck },
                    { key: "COMPLETED", label: "Selesai", icon: CheckCircle },
                  ].map((step, idx) => {
                    const status = getStepStatus(step.key, result.status);
                    const isActive = status === 'current' || status === 'completed';
                    return (
                      <div key={idx} className="relative pl-6">
                        <div className={`absolute -left-[25px] top-0 w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 bg-white ${
                           isActive ? "border-[#A3B18A] text-[#A3B18A]" : "border-gray-200 text-gray-300"
                        }`}>
                           <step.icon className="w-4 h-4" />
                        </div>
                        <p className={`font-bold ${isActive ? "text-gray-900" : "text-gray-400"}`}>{step.label}</p>
                        {status === 'current' && <p className="text-xs text-[#A3B18A] mt-1">Status Saat Ini</p>}
                      </div>
                    )
                  })}
                </div>

                {/* Desktop Timeline (Horizontal) */}
                <div className="hidden md:flex justify-between items-center relative">
                  {/* Line Background */}
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-0 -translate-y-1/2 rounded-full" />
                  
                  {/* Dynamic Progress Line */}
                  <div className="absolute top-1/2 left-0 h-1 bg-[#A3B18A] -z-0 -translate-y-1/2 rounded-full transition-all duration-1000" 
                       style={{ 
                         width: result.status === 'COMPLETED' ? '100%' : 
                                result.status === 'SHIPPED' ? '75%' : 
                                result.status === 'PROCESSED' ? '50%' : 
                                result.status === 'PAID' ? '25%' : '0%' 
                       }} 
                  />

                  {[
                    { key: "PENDING", label: "Dibuat", icon: Package },
                    { key: "PAID", label: "Dibayar", icon: CreditCard },
                    { key: "PROCESSED", label: "Diproses", icon: Clock },
                    { key: "SHIPPED", label: "Dikirim", icon: Truck },
                    { key: "COMPLETED", label: "Selesai", icon: CheckCircle },
                  ].map((step, idx) => {
                     const status = getStepStatus(step.key, result.status);
                     const isActive = status === 'current' || status === 'completed';
                     return (
                       <div key={idx} className="relative z-10 flex flex-col items-center bg-white px-2">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 mb-3 transition-all duration-300 ${
                             isActive ? "border-[#A3B18A] bg-[#A3B18A] text-white" : "border-gray-100 bg-gray-50 text-gray-400"
                          }`}>
                             <step.icon className="w-5 h-5" />
                          </div>
                          <span className={`text-sm font-bold ${isActive ? "text-[#A3B18A]" : "text-gray-400"}`}>{step.label}</span>
                       </div>
                     );
                  })}
                </div>
              </div>

              {/* Detail Tracking Log */}
              {result.history.length > 0 && (
                 <div className="mt-8 bg-gray-50 rounded-2xl p-5 space-y-6">
                    {result.history.map((log, idx) => (
                        <div key={idx} className="flex gap-4 relative">
                            <div className="flex flex-col items-center">
                                <div className="w-3 h-3 rounded-full bg-[#A3B18A]" />
                                {idx !== result.history.length - 1 && <div className="w-0.5 h-full bg-gray-200 mt-1" />}
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-mono mb-0.5">
                                   {format(new Date(log.date), 'dd MMM yyyy, HH:mm', { locale: idLocale })}
                                </p>
                                <p className="text-sm font-bold text-gray-800">{log.status}</p>
                                <p className="text-sm text-gray-600">{log.description}</p>
                            </div>
                        </div>
                    ))}
                 </div>
              )}
            </div>

            {/* 2 Columns: Shipping & Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Shipping Info */}
              <div className="bg-white rounded-3xl p-6 shadow-lg h-full">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                   <MapPin className="w-5 h-5 text-[#A3B18A]" /> Informasi Pengiriman
                </h3>
                <div className="space-y-4 text-sm">
                  <div className="bg-gray-50 p-4 rounded-2xl">
                     <p className="text-gray-500 text-xs mb-1">Penerima</p>
                     <p className="font-bold text-gray-900">{result.buyer_name}</p>
                     <p className="text-gray-600 mt-1">{result.buyer_address}</p>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl">
                     <div>
                        <p className="text-gray-500 text-xs">Ekspedisi</p>
                        <p className="font-bold text-gray-900 text-lg">{result.courier.toUpperCase()}</p>
                        <p className="text-xs text-gray-400">{result.service}</p>
                     </div>
                     {result.resi_number && (
                        <div className="text-right">
                           <p className="text-gray-500 text-xs">No. Resi</p>
                           <p className="font-mono font-bold text-[#A3B18A]">{result.resi_number}</p>
                        </div>
                     )}
                  </div>
                </div>
              </div>

              {/* Items Info */}
              <div className="bg-white rounded-3xl p-6 shadow-lg h-full">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                   <ShoppingBag className="w-5 h-5 text-[#A3B18A]" /> Detail Produk
                </h3>
                <div className="space-y-4 max-h-[250px] overflow-y-auto custom-scrollbar pr-2">
                   {result.items.map((item) => (
                      <div key={item.id} className="flex gap-3 items-center">
                         <div className="w-14 h-14 relative flex-shrink-0">
                            <Image 
                               src={item.image} 
                               alt={item.name} 
                               fill 
                               className="object-cover rounded-xl bg-gray-100" 
                            />
                         </div>
                         <div className="flex-1">
                            <p className="text-sm font-bold text-gray-800 line-clamp-2">{item.name}</p>
                            <p className="text-xs text-gray-500">{item.qty} x Rp {item.price.toLocaleString('id-ID')}</p>
                         </div>
                         <p className="font-bold text-[#A3B18A] text-sm">
                            Rp {(item.qty * item.price).toLocaleString('id-ID')}
                         </p>
                      </div>
                   ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                   <span className="text-gray-600 font-medium">Total Belanja</span>
                   <span className="text-xl font-bold text-[#A3B18A]">Rp {result.grand_total.toLocaleString('id-ID')}</span>
                </div>
              </div>

            </div>

          </div>
        )}
      </div>
    </div>
  );
}