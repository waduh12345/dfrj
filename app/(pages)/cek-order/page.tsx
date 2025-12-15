"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
  Calendar,
  FileQuestion,
  SearchX,
  Info,
  Box,
} from "lucide-react";

import { fredoka, sniglet } from "@/lib/fonts";
import DotdLoader from "@/components/loader/3dot";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { getEncryptedTransactionId } from "@/app/actions/security";

// Importing the service hook
import { useGetPublicTransactionByReferenceQuery } from "@/services/public-transactions.service";

// --- TIPE DATA ---
type OrderStatus =
  | "PENDING" // Dibuat (Status 0)
  | "PAID" // Dibayar (Status 1)
  | "PROCESSED" // Diproses (Status 2)
  | "SHIPPED" // Dikirim (Shipment 1)
  | "DELIVERED" // Selesai (Shipment 2)
  | "RETURNED" // Dikembalikan (Status 3)
  | "CANCELLED"; // Dibatalkan (Status 4)

interface TrackResult {
  id: number;
  reference: string;
  encypted_id: string;
  status: OrderStatus;
  original_status: number;
  shipment_status: number;
  created_at: string;
  grand_total: number;
  resi_number?: string | null;
  courier: string;
  service: string;
  buyer_name: string;
  buyer_address: string;
  payment_type?: string;
  payment_link?: string;
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

interface Product {
  id: number;
  name: string;
  image: string;
}

interface TransactionDetail {
  id: number;
  product: Product;
  quantity: number;
  price: number;
}

// --- DEFINISI STEP TRANSAKSI ---
const TRANSACTION_STEPS = [
  { key: "PENDING", label: "Dibuat", icon: FileQuestion },
  { key: "PAID", label: "Dibayar", icon: CreditCard },
  { key: "PROCESSED", label: "Diproses", icon: Box },
  { key: "SHIPPED", label: "Dikirim", icon: Truck },
  { key: "DELIVERED", label: "Selesai", icon: CheckCircle },
];

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-gradient-to-br from-white to-[#DFF19D]/10">
          <div className="flex flex-col items-center">
            <DotdLoader />
            <p className="mt-4 text-gray-500 font-medium">Memuat halaman...</p>
          </div>
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}

function TrackOrderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- STATE ---
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCode, setSearchCode] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [result, setResult] = useState<TrackResult | null>(null);
  const [encryptedPaymentId, setEncryptedPaymentId] = useState<string | null>(
    null
  );

  const {
    data: transactionData,
    isLoading: isFetching,
    isError,
    refetch,
  } = useGetPublicTransactionByReferenceQuery(searchCode, {
    skip: !searchCode,
  });

  // 1. LOGIC OTOMATIS DARI URL
  useEffect(() => {
    const codeFromUrl = searchParams.get("code");
    if (codeFromUrl) {
      setSearchTerm(codeFromUrl);
      setSearchCode(codeFromUrl);
      setHasSearched(true);
      setIsLoading(true);
    }
  }, [searchParams]);

  // 2. HELPER MAPPING STATUS (Logic Fixed)
  const mapStatus = (status: number, shipmentStatus: number): OrderStatus => {
    // Priority 1: Cek Return/Cancel dulu
    if (status === 3) return "RETURNED";
    if (status === 4) return "CANCELLED";

    // Priority 2: Cek Shipment Status (Jika barang sudah bergerak)
    // Berdasarkan JSON: shipment_status 1 = Dikirim, 2 = Selesai
    if (shipmentStatus === 2) return "DELIVERED";
    if (shipmentStatus === 1) return "SHIPPED";

    // Priority 3: Cek Transaction Status (Jika barang belum dikirim/masih proses)
    // Jika shipment_status masih 0
    if (status === 2) return "PROCESSED"; // Diproses
    if (status === 1) return "PAID"; // Dibayar

    // Default: status 0 & shipment 0 => PENDING
    return "PENDING";
  };

  // 3. LOGIC PEMETAAN DATA
  useEffect(() => {
    if (transactionData) {
      // Ambil data status
      const rawStatus = transactionData.status ?? 0;

      // ✅ FIX: Ambil shipment_status dari dalam stores[0], bukan root
      // Jika stores kosong atau shipment_status null, default ke 0
      const rawShipmentStatus =
        transactionData.stores?.[0]?.shipment_status ?? 0;

      // Terapkan mapping logic
      const mappedStatus = mapStatus(rawStatus, rawShipmentStatus);

      // Parsing shipment_detail jika bentuknya string JSON (seperti di contoh JSON Anda)
      let serviceName = "";
      try {
        const shipmentDetailStr = transactionData.stores?.[0]?.shipment_detail;
        if (shipmentDetailStr) {
          // Cek apakah string json atau string biasa
          if (shipmentDetailStr.startsWith("{")) {
            const parsed = JSON.parse(shipmentDetailStr);
            serviceName = parsed.service || parsed.name || "";
          } else {
            serviceName = shipmentDetailStr;
          }
        }
      } catch (e) {
        serviceName = transactionData.stores?.[0]?.shipment_detail || "";
      }

      const mockData: TrackResult = {
        id: transactionData.id,
        reference: transactionData.reference,
        encypted_id: transactionData.encypted_id || "",
        status: mappedStatus, // Status hasil kalkulasi yang benar
        original_status: rawStatus,
        shipment_status: rawShipmentStatus,
        created_at: transactionData.created_at,
        grand_total: transactionData.grand_total,
        resi_number: transactionData.stores?.[0]?.receipt_code,
        courier: transactionData.stores?.[0]?.courier || "",
        service: serviceName,
        buyer_name: transactionData.guest_name,
        buyer_address: transactionData.address_line_1,
        payment_type: transactionData.payment_type,
        payment_link: transactionData.payment_link || "",
        items:
          transactionData.stores?.[0]?.details.map(
            (detail: TransactionDetail) => ({
              id: detail.id,
              name: detail.product.name,
              image: detail.product.image,
              qty: detail.quantity,
              price: detail.price,
            })
          ) || [],
        history: [
          {
            status: mappedStatus, // Gunakan status terkini
            description: "Status terkini pesanan Anda",
            date: transactionData.updated_at || transactionData.created_at,
          },
        ],
      };
      setResult(mockData);
      setIsLoading(false);
    } else if (isError) {
      setIsLoading(false);
    }
  }, [transactionData, isError]);

  // Efek samping untuk generate encrypted ID
  useEffect(() => {
    const generateEncryptedId = async () => {
      if (result && result.id) {
        const res = await getEncryptedTransactionId(result.id);
        if (res.success && res.data) {
          setEncryptedPaymentId(res.data);
        }
      }
    };

    generateEncryptedId();
  }, [result]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Masukkan kode transaksi terlebih dahulu!",
      });
      return;
    }

    setHasSearched(true);
    setSearchCode(searchTerm);
    if (searchCode === searchTerm) {
      refetch();
    }
  };

  const showLoading = isLoading || isFetching;

  // --- HELPER UTILS UI ---
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "PAID":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "PROCESSED":
        return "bg-indigo-100 text-indigo-700 border-indigo-200";
      case "SHIPPED":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "DELIVERED":
        return "bg-green-100 text-green-700 border-green-200";
      case "RETURNED":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "CANCELLED":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "Menunggu Pembayaran";
      case "PAID":
        return "Sudah Dibayar";
      case "PROCESSED":
        return "Sedang Diproses";
      case "SHIPPED":
        return "Sedang Dikirim";
      case "DELIVERED":
        return "Selesai";
      case "RETURNED":
        return "Dikembalikan";
      case "CANCELLED":
        return "Dibatalkan";
      default:
        return status;
    }
  };

  // Logic Visual Step Timeline
  const getStepStatus = (stepKey: string, currentStatus: OrderStatus) => {
    const order = ["PENDING", "PAID", "PROCESSED", "SHIPPED", "DELIVERED"];

    const currentIndex = order.indexOf(currentStatus);
    const stepIndex = order.indexOf(stepKey);

    if (currentStatus === "CANCELLED" || currentStatus === "RETURNED")
      return "inactive";

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";

    return "inactive";
  };

  // Progress Bar Logic
  const getProgressWidth = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "0%";
      case "PAID":
        return "25%";
      case "PROCESSED":
        return "50%";
      case "SHIPPED":
        return "75%";
      case "DELIVERED":
        return "100%";
      default:
        return "0%";
    }
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-white to-[#DFF19D]/10 pt-24 pb-12 ${sniglet.className}`}
    >
      <div className="container mx-auto px-6 lg:px-12">
        {/* TITLE SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-[#A3B18A]/10 px-4 py-2 rounded-full mb-4">
            <Truck className="w-4 h-4 text-[#A3B18A]" />
            <span className="text-sm font-medium text-[#A3B18A]">
              Lacak Kiriman
            </span>
          </div>
          <h1
            className={`text-4xl font-bold text-[#5C4A3B] mb-4 ${fredoka.className}`}
          >
            Lacak Status <span className="text-[#A3B18A]">Pesanan Anda</span>
          </h1>
          <p className="text-gray-600">
            Masukkan Kode Transaksi (contoh: TRX-2025...) yang dikirimkan ke
            email Anda untuk mengetahui posisi paket terkini.
          </p>
        </div>

        {/* SEARCH FORM */}
        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="relative group">
            <div className="relative z-10">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6 group-focus-within:text-[#A3B18A] transition-colors" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Masukkan Kode Transaksi..."
                className="w-full pl-14 pr-32 py-5 rounded-full border-2 border-gray-200 focus:border-[#A3B18A] focus:ring-4 focus:ring-[#A3B18A]/20 shadow-lg text-lg outline-none transition-all"
              />
              <button
                type="submit"
                disabled={showLoading}
                className="absolute right-2 top-2 bottom-2 bg-[#A3B18A] text-white px-6 rounded-full font-bold hover:bg-[#A3B18A]/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {showLoading ? "Mencari..." : "Lacak"}
              </button>
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-[#A3B18A]/20 to-blue-200/20 rounded-full blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
          </form>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="min-h-[400px]">
          {/* 1. LOADING STATE */}
          {showLoading && (
            <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
              <DotdLoader />
              <p className="mt-4 text-gray-500 font-medium">
                Sedang mencari data transaksi...
              </p>
            </div>
          )}

          {/* 2. INITIAL STATE */}
          {!showLoading && !hasSearched && (
            <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm text-center animate-fade-in-up">
              <div className="w-20 h-20 bg-[#A3B18A]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileQuestion className="w-10 h-10 text-[#A3B18A]" />
              </div>
              <h3
                className={`text-2xl font-bold text-[#5C4A3B] mb-3 ${fredoka.className}`}
              >
                Belum Melacak Pesanan?
              </h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Silakan masukkan <strong>Kode Referensi (TRX-...)</strong>{" "}
                {`yang Anda dapatkan pada halaman "Terima Kasih" atau yang kami kirimkan melalui Email/WhatsApp.`}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                    <Search className="w-4 h-4 text-blue-600" />
                  </div>
                  <h4 className="font-bold text-gray-800 text-sm mb-1">
                    1. Masukkan Kode
                  </h4>
                  <p className="text-xs text-gray-500">
                    Input kode transaksi dengan benar.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                    <Truck className="w-4 h-4 text-purple-600" />
                  </div>
                  <h4 className="font-bold text-gray-800 text-sm mb-1">
                    2. Cek Status
                  </h4>
                  <p className="text-xs text-gray-500">
                    Lihat posisi terkini paket Anda.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mb-3">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <h4 className="font-bold text-gray-800 text-sm mb-1">
                    3. Selesai
                  </h4>
                  <p className="text-xs text-gray-500">
                    Paket diterima dengan aman.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 3. NOT FOUND STATE */}
          {!showLoading && hasSearched && !result && (
            <div className="max-w-2xl mx-auto bg-red-50 rounded-3xl p-8 border border-red-100 text-center animate-shake">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <SearchX className="w-8 h-8 text-red-500" />
              </div>
              <h3
                className={`text-xl font-bold text-[#5C4A3B] mb-2 ${fredoka.className}`}
              >
                Data Tidak Ditemukan
              </h3>
              <p className="text-gray-600 mb-6">
                Maaf, kami tidak dapat menemukan data transaksi dengan kode{" "}
                <br />
                <span className="font-mono font-bold text-red-500 bg-red-100 px-2 py-1 rounded-md mx-1">
                  {searchTerm}
                </span>
              </p>
              <div className="bg-white p-4 rounded-xl text-left border border-red-100 inline-block w-full md:w-auto">
                <h4 className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4 text-gray-400" /> Tips Pencarian:
                </h4>
                <ul className="text-sm text-gray-500 list-disc list-inside space-y-1">
                  <li>Pastikan kode transaksi sudah benar (Case Sensitive).</li>
                  <li>Periksa kembali email konfirmasi pesanan Anda.</li>
                  <li>Hubungi admin jika Anda yakin sudah membayar.</li>
                </ul>
              </div>
            </div>
          )}

          {/* 4. RESULT SECTION */}
          {!showLoading && result && (
            <div className="max-w-4xl mx-auto animate-fade-in-up">
              {/* Header Card */}
              <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-lg border border-gray-100 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Kode Transaksi</p>
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold text-[#5C4A3B]">
                        {result.reference}
                      </h2>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(
                          result.status
                        )}`}
                      >
                        {getStatusLabel(result.status)}
                      </span>
                    </div>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-sm text-gray-500 mb-1">
                      Tanggal Pemesanan
                    </p>
                    <div className="flex items-center gap-2 text-[#5C4A3B] font-medium">
                      <Calendar className="w-4 h-4 text-[#A3B18A]" />
                      {format(
                        new Date(result.created_at),
                        "dd MMM yyyy, HH:mm",
                        {
                          locale: idLocale,
                        }
                      )}
                    </div>
                  </div>
                </div>

                {/* Alert if Pending */}
                {result.status === "PENDING" && (
                  <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="font-bold text-yellow-800">
                          Menunggu Pembayaran
                        </p>
                        <p className="text-sm text-yellow-700">
                          {result.payment_type === "automatic"
                            ? "Selesaikan pembayaran otomatis Anda."
                            : "Pesanan belum dibayar. Silakan upload bukti transfer."}
                        </p>
                      </div>
                    </div>

                    {/* Logic Tombol Bayar */}
                    <div>
                      {result.payment_type === "automatic" ? (
                        result.payment_link ? (
                          <button
                            onClick={() =>
                              window.open(result.payment_link!, "_blank")
                            }
                            className="bg-yellow-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-yellow-600 transition-colors whitespace-nowrap shadow-lg shadow-yellow-500/30"
                          >
                            Bayar Sekarang
                          </button>
                        ) : (
                          <div className="h-10 w-32 bg-yellow-200 rounded-xl flex items-center justify-center text-yellow-600 text-xs">
                            Link Error
                          </div>
                        )
                      ) : result.encypted_id ? (
                        <Link
                          href={`/guest/transaction/${result.encypted_id}`}
                          className="bg-yellow-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-yellow-600 transition-colors whitespace-nowrap shadow-lg shadow-yellow-500/30"
                        >
                          Bayar Sekarang
                        </Link>
                      ) : (
                        <div className="h-10 w-32 bg-yellow-200 rounded-xl animate-pulse flex items-center justify-center text-yellow-600 text-xs">
                          Menyiapkan...
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Timeline Visual - STEP BY STEP */}
                <div className="relative px-4 py-4">
                  {/* Mobile Timeline (Vertical) */}
                  <div className="md:hidden space-y-6 relative">
                    <div className="absolute top-0 left-5 h-full w-1 bg-gray-100 -z-10 rounded-full" />
                    {TRANSACTION_STEPS.map((step, idx) => {
                      const status = getStepStatus(step.key, result.status);
                      const isActive =
                        status === "current" || status === "completed";
                      return (
                        <div key={idx} className="flex items-center gap-4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center border-4 z-10 transition-colors duration-300 ${
                              isActive
                                ? "border-[#A3B18A] bg-[#A3B18A] text-white"
                                : "border-gray-100 bg-white text-gray-300"
                            }`}
                          >
                            <step.icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p
                              className={`text-sm font-bold ${
                                isActive ? "text-[#A3B18A]" : "text-gray-400"
                              }`}
                            >
                              {step.label}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Desktop Timeline (Horizontal) */}
                  <div className="hidden md:flex justify-between items-center relative mb-8">
                    {/* Line Background */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-0 -translate-y-1/2 rounded-full" />
                    {/* Active Line Progress */}
                    <div
                      className="absolute top-1/2 left-0 h-1 bg-[#A3B18A] -z-0 -translate-y-1/2 rounded-full transition-all duration-1000"
                      style={{
                        width: getProgressWidth(result.status),
                      }}
                    />
                    {TRANSACTION_STEPS.map((step, idx) => {
                      const status = getStepStatus(step.key, result.status);
                      const isActive =
                        status === "current" || status === "completed";
                      return (
                        <div
                          key={idx}
                          className="relative z-10 flex flex-col items-center bg-white px-2"
                        >
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center border-4 mb-3 transition-all duration-500 ${
                              isActive
                                ? "border-[#A3B18A] bg-[#A3B18A] text-white"
                                : "border-gray-100 bg-gray-50 text-gray-400"
                            }`}
                          >
                            <step.icon className="w-5 h-5" />
                          </div>
                          <span
                            className={`text-sm font-bold ${
                              isActive ? "text-[#A3B18A]" : "text-gray-400"
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 2 Columns: Shipping & Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Shipping Info */}
                <div className="bg-white rounded-3xl p-6 shadow-lg h-full">
                  <h3 className="font-bold text-[#5C4A3B] mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#A3B18A]" /> Informasi
                    Pengiriman
                  </h3>
                  <div className="space-y-4 text-sm">
                    <div className="bg-gray-50 p-4 rounded-2xl">
                      <p className="text-gray-500 text-xs mb-1">Penerima</p>
                      <p className="font-bold text-[#5C4A3B]">
                        {result.buyer_name}
                      </p>
                      <p className="text-gray-600 mt-1">
                        {result.buyer_address}
                      </p>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl">
                      <div>
                        <p className="text-gray-500 text-xs">Ekspedisi</p>
                        <p className="font-bold text-[#5C4A3B] text-lg">
                          {result.courier.toUpperCase()}
                        </p>
                        <p className="text-xs text-gray-400">
                          {result.service}
                        </p>
                      </div>
                      {result.resi_number && (
                        <div className="text-right">
                          <p className="text-gray-500 text-xs">No. Resi</p>
                          <p className="font-mono font-bold text-[#A3B18A]">
                            {result.resi_number}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Items Info */}
                <div className="bg-white rounded-3xl p-6 shadow-lg h-full">
                  <h3 className="font-bold text-[#5C4A3B] mb-4 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#A3B18A]" /> Detail
                    Produk
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
                          <p className="text-sm font-bold text-gray-800 line-clamp-2">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.qty} x Rp {item.price.toLocaleString("id-ID")}
                          </p>
                        </div>
                        <p className="font-bold text-[#A3B18A] text-sm">
                          Rp {(item.qty * item.price).toLocaleString("id-ID")}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-gray-600 font-medium">
                      Total Belanja
                    </span>
                    <span className="text-xl font-bold text-[#A3B18A]">
                      Rp{" "}
                      {result.items
                        .reduce(
                          (total, item) => total + item.qty * item.price,
                          0
                        )
                        .toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}