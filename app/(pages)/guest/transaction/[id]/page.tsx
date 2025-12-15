"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  Copy,
  UploadCloud,
  CreditCard,
  CheckCircle,
  Clock,
  MapPin,
  User,
  Package,
  ArrowLeft,
  Download,
  Heart, // Ikon tambahan
} from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

// Importing necessary services
import {
  useGetPublicTransactionByIdQuery,
  useUpdatePublicTransactionWithFormMutation,
} from "@/services/public-transactions.service";
import Image from "next/image";
import DotdLoader from "@/components/loader/3dot";
import { formatRupiahWithRp } from "@/lib/format-utils";
import { fredoka, sniglet } from "@/lib/fonts";

// Brand Colors
const THEME = {
  primary: "#d43893ff", // Pink Magenta
  textMain: "#5B4A3B",  // Cocoa Brown
  bgLight: "#FFF0F5",   // Soft Pink
};

export default function GuestConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const transactionId = params.id as string;

  // State hooks
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch transaction data
  const {
    data: transactionData,
    isLoading,
    isError,
  } = useGetPublicTransactionByIdQuery(transactionId);

  // Mutation hook
  const [uploadPaymentProof] = useUpdatePublicTransactionWithFormMutation();

  useEffect(() => {
    if (transactionData) {
      // Logic tambahan jika diperlukan
    }
  }, [transactionData]);

  const handleCopyRekening = (text: string) => {
    navigator.clipboard.writeText(text);
    Swal.fire({
      icon: "success",
      title: "Disalin!",
      text: "Nomor berhasil disalin.",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1500,
      background: "#fff",
      color: THEME.textMain,
      iconColor: THEME.primary,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file.size > 2 * 1024 * 1024) {
        Swal.fire({
          icon: "error",
          title: "File Terlalu Besar",
          text: "Maksimal ukuran file adalah 2MB",
          confirmButtonColor: THEME.primary,
        });
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      Swal.fire({
        icon: "warning",
        title: "Pilih File",
        text: "Mohon upload bukti transfer terlebih dahulu.",
        confirmButtonColor: THEME.primary,
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("transaction_id", transactionId);

      await uploadPaymentProof({ id: transactionId, formData }).unwrap();

      Swal.fire({
        icon: "success",
        title: "Terima Kasih!",
        text: "Bukti pembayaran diterima. Tim kami akan segera memproses karya pesanan Anda.",
        confirmButtonText: "Kembali ke Beranda",
        confirmButtonColor: THEME.primary,
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/");
        }
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal Mengirim",
        text: "Terjadi kesalahan saat mengupload. Silakan coba lagi.",
        confirmButtonColor: THEME.primary,
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Loading and error states
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF0F5]">
        <DotdLoader />
      </div>
    );
  }

  if (isError || !transactionData) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center bg-[#FFF0F5] gap-4 ${sniglet.className}`}>
        <p className="text-red-500 font-bold text-xl">
          Data Transaksi Tidak Ditemukan
        </p>
        <button
          onClick={() => router.push("/")}
          className="text-[#d43893ff] hover:underline font-bold"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  // Status mapping
  const getStatusText = (status: number) => {
    switch (status) {
      case 0: return "Menunggu Pembayaran";
      case 1: 
      case 2: return "Sudah Dibayar";
      case 3: return "Diproses";
      case 4: return "Dalam Pengiriman";
      case 5: return "Selesai";
      default: return "Status Tidak Diketahui";
    }
  };

  const calculateTotal = () => {
    let total = 0;
    transactionData.stores?.forEach((store) => {
      store.details.forEach((item) => {
        total += item.total;
      });
    });
    return total;
  };

  const totalProductPrice = calculateTotal();
  const totalWithShipping =
      totalProductPrice +
      ((transactionData.stores?.[0]?.shipment_cost ?? 0));

  return (
    <div className={`min-h-screen bg-gradient-to-br from-white to-[#FFF0F5] pt-24 pb-12 ${sniglet.className}`}>
      <div className="container mx-auto px-6 lg:px-12">
        {/* HEADER */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-gray-500 hover:text-[#d43893ff] transition-colors mb-4 font-bold"
          >
            <ArrowLeft className="w-5 h-5" /> Kembali ke Beranda
          </button>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-[#d43893ff]/10 px-4 py-2 rounded-full mb-4 border border-[#d43893ff]/20">
              <Heart className="w-4 h-4 text-[#d43893ff] fill-[#d43893ff]" />
              <span className="text-sm font-bold text-[#d43893ff]">
                {getStatusText(transactionData.status)}
              </span>
            </div>
            <h1 className={`text-3xl lg:text-4xl font-bold text-[#5B4A3B] mb-2 ${fredoka.className}`}>
              Selesaikan <span className="text-[#d43893ff]">Dukungan Anda</span>
            </h1>
            <p className="text-gray-500">
              Kode Referensi:{" "}
              <span className="font-mono font-bold text-[#5B4A3B] bg-white px-2 py-1 rounded border border-gray-200">
                {transactionData.reference}
              </span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* === KOLOM KIRI: INSTRUKSI & UPLOAD === */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Informasi Rekening & Nominal */}
            <div className="bg-white rounded-[2rem] p-8 shadow-lg shadow-pink-100/50 border border-gray-50">
              <h3 className={`font-bold text-xl text-[#5B4A3B] mb-6 flex items-center gap-2 ${fredoka.className}`}>
                <CreditCard className="w-6 h-6 text-[#d43893ff]" />
                Metode Pembayaran
              </h3>

              {/* Tabs */}
              <div className="mb-6 flex gap-3 flex-wrap">
                <button
                  className={`px-5 py-2.5 rounded-full font-bold transition-all text-sm ${
                    previewUrl !== "qris"
                      ? "bg-[#d43893ff] text-white shadow-md shadow-pink-200"
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  }`}
                  onClick={() => setPreviewUrl(null)}
                  type="button"
                >
                  Transfer Bank (BCA)
                </button>
                <button
                  className={`px-5 py-2.5 rounded-full font-bold transition-all text-sm ${
                    previewUrl === "qris"
                      ? "bg-[#d43893ff] text-white shadow-md shadow-pink-200"
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  }`}
                  onClick={() => setPreviewUrl("qris")}
                  type="button"
                >
                  Scan QRIS
                </button>
              </div>

              {/* Content based on Tab */}
              {previewUrl !== "qris" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Bank Info */}
                  <div className="bg-[#FFF0F5] rounded-2xl p-6 border border-pink-100">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-10 bg-white rounded-lg flex items-center justify-center text-[#0060AF] font-bold italic border border-gray-100 shadow-sm">
                        BCA
                      </div>
                      <div>
                        <p className="text-xs text-[#d43893ff] font-bold uppercase tracking-wide">Bank Central Asia</p>
                        <p className="font-bold text-[#5B4A3B]">
                          DIFARAJA INDONESIA
                        </p>
                      </div>
                    </div>

                    <div className="mb-2">
                      <p className="text-sm text-gray-500 mb-1">Nomor Rekening</p>
                      <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-pink-200">
                        <span className="text-xl font-mono font-bold text-[#5B4A3B] tracking-wider">
                          7311087405
                        </span>
                        <button
                          onClick={() => handleCopyRekening("7311087405")}
                          className="p-2 hover:bg-pink-50 rounded-lg transition-colors text-[#d43893ff]"
                          title="Salin"
                        >
                          <Copy className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Total Info */}
                  <div className="flex flex-col justify-center">
                    <p className="text-gray-500 mb-1 text-sm font-bold">
                      Total Tagihan:
                    </p>
                    <div className="flex items-center justify-between mb-4 bg-gray-50 p-3 rounded-xl">
                      <span className="text-2xl lg:text-3xl font-bold text-[#d43893ff]">
                        {formatRupiahWithRp(totalWithShipping)}
                      </span>
                      <button
                        onClick={() =>
                          handleCopyRekening(totalWithShipping.toString())
                        }
                        className="text-gray-400 hover:text-[#d43893ff]"
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="bg-yellow-50 text-yellow-800 px-4 py-3 rounded-xl text-xs flex items-start gap-2 leading-relaxed">
                      <Clock className="w-4 h-4 flex-shrink-0 mt-0.5 text-yellow-600" />
                      <p>
                        Mohon transfer sesuai nominal hingga 3 digit terakhir agar pesanan karya Anda diproses otomatis.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-6 py-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex flex-col md:flex-row items-center gap-8 px-6">
                    <div className="flex-shrink-0">
                      <div className="relative w-48 h-48 md:w-56 md:h-56 bg-white p-2 rounded-xl shadow-sm">
                        <Image
                          src="/images/qris-transfer.jpeg"
                          alt="QRIS Difaraja"
                          fill
                          className="object-contain rounded-lg"
                        />
                      </div>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <p className={`font-bold text-[#5B4A3B] mb-2 text-lg ${fredoka.className}`}>Scan QRIS Difaraja</p>
                      <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                        Gunakan aplikasi E-Wallet (GoPay, OVO, ShopeePay, DANA) atau Mobile Banking Anda untuk scan kode di samping.
                      </p>
                      <div className="inline-block text-center md:text-left bg-white px-4 py-2 rounded-xl border border-pink-100">
                        <span className="text-gray-400 text-xs uppercase font-bold block mb-1">Total Bayar</span>
                        <span className="text-2xl font-bold text-[#d43893ff]">
                          {formatRupiahWithRp(totalWithShipping)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Upload Bukti Bayar */}
            <div className="bg-white rounded-[2rem] p-8 shadow-lg shadow-pink-100/50 border border-gray-50">
              <h3 className={`font-bold text-xl text-[#5B4A3B] mb-4 flex items-center gap-2 ${fredoka.className}`}>
                <UploadCloud className="w-6 h-6 text-[#d43893ff]" />
                Konfirmasi Transfer
              </h3>

              <p className="text-gray-500 mb-6 text-sm">
                Bantu kami memverifikasi dukungan Anda lebih cepat dengan mengunggah bukti transfer/struk di sini.
              </p>

              <div className="border-2 border-dashed border-[#d43893ff]/30 rounded-3xl p-8 text-center hover:bg-[#FFF0F5] transition-colors relative group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  disabled={isUploading}
                />

                {previewUrl ? (
                  <div className="relative w-full h-64 max-w-xs mx-auto">
                    <Image
                      src={previewUrl}
                      alt="Preview Bukti"
                      fill
                      className="object-contain rounded-xl shadow-sm"
                    />
                    <div className="absolute bottom-2 right-2 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-[#5B4A3B] shadow border border-gray-200 z-20">
                      Ganti Foto
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6">
                    <div className="w-16 h-16 bg-[#d43893ff]/10 rounded-full flex items-center justify-center mb-4 text-[#d43893ff] group-hover:scale-110 transition-transform">
                      <Download className="w-8 h-8" />
                    </div>
                    <p className="text-lg font-bold text-[#5B4A3B] mb-1">
                      Tap untuk Upload Bukti
                    </p>
                    <p className="text-xs text-gray-400">
                      Format: JPG, PNG (Max 2MB)
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="w-full mt-6 bg-[#d43893ff] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#b02e7a] transition-all shadow-lg shadow-pink-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-6 h-6" />
                    Kirim Konfirmasi
                  </>
                )}
              </button>
            </div>
          </div>

          {/* === KOLOM KANAN: DETAIL TRANSAKSI === */}
          <div className="lg:col-span-1 space-y-6">
            {/* Ringkasan Status */}
            <div className="bg-white rounded-[2rem] p-6 shadow-lg shadow-pink-100/50 border border-gray-50">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
                <span className="text-gray-500 text-sm">Tanggal Pesanan</span>
                <span className="font-bold text-[#5B4A3B]">
                  {format(new Date(transactionData.created_at), "dd MMM yyyy", {
                    locale: idLocale,
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Status Saat Ini</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold capitalize">
                  {getStatusText(transactionData.status)}
                </span>
              </div>
            </div>

            {/* Detail Pembeli & Pengiriman */}
            <div className="bg-white rounded-[2rem] p-6 shadow-lg shadow-pink-100/50 border border-gray-50">
              <h3 className={`font-bold text-[#5B4A3B] mb-4 flex items-center gap-2 ${fredoka.className}`}>
                <User className="w-5 h-5 text-[#d43893ff]" />
                Data Pemesan
              </h3>
              <div className="space-y-3 text-sm text-gray-600 mb-6 bg-[#FFF0F5] p-4 rounded-xl">
                <div>
                  <p className="text-xs text-[#d43893ff] font-bold uppercase">Nama</p>
                  <p className="font-bold text-[#5B4A3B]">
                    {transactionData.guest_name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#d43893ff] font-bold uppercase">Kontak</p>
                  <p className="font-medium text-[#5B4A3B]">{transactionData.guest_email}</p>
                  <p className="font-medium text-[#5B4A3B]">{transactionData.guest_phone}</p>
                </div>
              </div>

              <h3 className={`font-bold text-[#5B4A3B] mb-4 flex items-center gap-2 pt-4 border-t border-gray-100 ${fredoka.className}`}>
                <MapPin className="w-5 h-5 text-[#d43893ff]" />
                Tujuan Pengiriman
              </h3>
              <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="font-medium text-[#5B4A3B] mb-1">
                  {transactionData.address_line_1}
                </p>
                {transactionData.address_line_2 && (
                  <p className="mb-1 text-gray-500">{transactionData.address_line_2}</p>
                )}
                <p className="text-gray-500">
                  {transactionData.district_name}, {transactionData.city_name}
                </p>
                <p className="text-gray-500">
                  {transactionData.province_name} {transactionData.postal_code}
                </p>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <div className="bg-[#d43893ff] text-white px-3 py-1 rounded-lg font-bold uppercase text-xs tracking-wider">
                  {transactionData.courier}
                </div>
                <span className="text-gray-500 font-medium">{transactionData.service}</span>
              </div>
            </div>

            {/* Detail Produk */}
            <div className="bg-white rounded-[2rem] p-6 shadow-lg shadow-pink-100/50 border border-gray-50">
              <h3 className={`font-bold text-[#5B4A3B] mb-4 flex items-center gap-2 ${fredoka.className}`}>
                <Package className="w-5 h-5 text-[#d43893ff]" />
                Rincian Karya
              </h3>

              <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                {transactionData.stores?.map((store) =>
                  store.details.map((item) => (
                    <div key={item.id} className="flex gap-3 items-start border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                      <div className="relative w-14 h-14 flex-shrink-0">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover rounded-xl bg-gray-100"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-[#5B4A3B] line-clamp-2 leading-tight mb-1">
                          {item.product.name}
                        </p>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                            {item.quantity} x {formatRupiahWithRp(item.price)}
                          </span>
                          <span className="font-bold text-[#d43893ff]">
                            {formatRupiahWithRp(item.quantity * item.price)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-dashed border-gray-200 space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Ongkos Kirim</span>
                  <span>
                    {formatRupiahWithRp(transactionData.shipping_cost)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg text-[#5B4A3B] pt-2">
                  <span>Total</span>
                  <span className="text-[#d43893ff]">
                    {formatRupiahWithRp(totalWithShipping)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}