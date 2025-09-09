"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { fredoka, sniglet } from "@/lib/fonts";
import {
  ShoppingCart,
  CreditCard,
  User,
  Package,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Shield,
  Truck,
  HeadphonesIcon,
  Mail,
  MessageCircle,
  Star,
  Play,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

interface Step {
  id: number;
  title: string;
  description: string;
  details: string[];
  icon: React.ReactNode;
  image: string;
  tips?: string[];
}
interface FAQ {
  question: string;
  answer: string;
}

export default function HowToOrderPage() {
  const [activeStep, setActiveStep] = useState(1);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  // === THEME (urut ke-2: #F6CCD0), selang-seling dgn putih ===
  const THEME = {
    primary: "#F6CCD0", // warna halaman ini
    bubbleA: "#DFF19D",
    bubbleB: "#BFF0F5",
  };

  const orderSteps: Step[] = [
    {
      id: 1,
      title: "Pilih Produk Favorit",
      description:
        "Jelajahi koleksi produk ramah lingkungan dan pilih yang sesuai untuk anak Anda",
      details: [
        "Browse kategori produk (Art Supplies, Craft Kits, Educational Toys)",
        "Gunakan filter usia untuk menemukan produk yang tepat",
        "Baca detail produk dan review dari orang tua lain",
        "Klik 'Tambah ke Keranjang' untuk produk pilihan",
      ],
      icon: <ShoppingCart className="w-8 h-8" />,
      image: "/api/placeholder/500/400",
      tips: [
        "Gunakan filter usia untuk hasil yang lebih akurat",
        "Baca review produk untuk insight dari orang tua lain",
        "Cek badge 'Eco-Friendly' untuk produk ramah lingkungan",
      ],
    },
    {
      id: 2,
      title: "Review Keranjang Belanja",
      description:
        "Periksa kembali produk pilihan dan jumlah pesanan sebelum checkout",
      details: [
        "Klik icon keranjang di header untuk melihat daftar produk",
        "Ubah quantity atau hapus produk jika diperlukan",
        "Cek total harga dan estimasi ongkos kirim",
        "Klik 'Checkout' untuk melanjutkan pemesanan",
      ],
      icon: <Package className="w-8 h-8" />,
      image: "/api/placeholder/500/400",
      tips: [
        "Manfaatkan free shipping untuk pembelian di atas Rp 250.000",
        "Cek kode promo yang tersedia",
        "Pastikan semua produk masih tersedia",
      ],
    },
    {
      id: 3,
      title: "Isi Data Pengiriman",
      description:
        "Lengkapi informasi pengiriman dan kontak untuk proses delivery",
      details: [
        "Isi nama lengkap dan nomor telepon yang bisa dihubungi",
        "Masukkan alamat lengkap dengan detail patokan",
        "Pilih metode pengiriman yang diinginkan",
        "Tambahkan catatan khusus jika diperlukan",
      ],
      icon: <User className="w-8 h-8" />,
      image: "/api/placeholder/500/400",
      tips: [
        "Pastikan nomor telepon aktif untuk koordinasi pengiriman",
        "Tulis alamat selengkap mungkin termasuk patokan",
        "Simpan alamat untuk kemudahan pemesanan berikutnya",
      ],
    },
    {
      id: 4,
      title: "Pilih Metode Pembayaran",
      description:
        "Proses pembayaran aman menggunakan gateway Midtrans yang terpercaya",
      details: [
        "Pilih metode pembayaran: Transfer Bank, E-Wallet, atau Virtual Account",
        "Sistem akan redirect ke halaman pembayaran Midtrans",
        "Ikuti instruksi pembayaran sesuai metode yang dipilih",
        "Konfirmasi pembayaran akan diterima otomatis",
      ],
      icon: <CreditCard className="w-8 h-8" />,
      image: "/api/placeholder/500/400",
      tips: [
        "Semua metode pembayaran aman dan terenkripsi",
        "Simpan bukti pembayaran untuk referensi",
        "Konfirmasi pembayaran biasanya dalam 1-5 menit",
      ],
    },
    {
      id: 5,
      title: "Pesanan Berhasil",
      description: "Pesanan dikonfirmasi dan akan diproses untuk pengiriman",
      details: [
        "Anda akan menerima email konfirmasi pesanan",
        "Pesanan akan diproses dalam 1-2 hari kerja",
        "Update status pengiriman akan dikirim via WhatsApp/Email",
        "Estimasi pengiriman 3-7 hari kerja",
      ],
      icon: <CheckCircle className="w-8 h-8" />,
      image: "/api/placeholder/500/400",
      tips: [
        "Simpan nomor pesanan untuk tracking",
        "Cek email dan WhatsApp untuk update status",
        "Hubungi customer service jika ada pertanyaan",
      ],
    },
    {
      id: 6,
      title: "Cek Status Pesanan",
      description: "Monitor progress pesanan melalui halaman profile Anda",
      details: [
        "Login ke akun COLORE Anda",
        "Buka menu 'Profile' → 'Pesanan Saya'",
        "Lihat status real-time dari pesanan",
        "Download invoice atau berikan review produk",
      ],
      icon: <Truck className="w-8 h-8" />,
      image: "/api/placeholder/500/400",
      tips: [
        "Status akan update otomatis saat ada perubahan",
        "Gunakan nomor resi untuk tracking di expedisi",
        "Berikan review setelah produk diterima",
      ],
    },
  ];

  const faqs: FAQ[] = [
    {
      question: "Berapa lama proses pengiriman?",
      answer:
        "Estimasi pengiriman 3-7 hari kerja untuk wilayah Jabodetabek, dan 7-14 hari kerja untuk luar kota. Kami menggunakan ekspedisi terpercaya seperti JNE, TIKI, dan J&T.",
    },
    {
      question: "Apakah ada minimum pembelian?",
      answer:
        "Tidak ada minimum pembelian. Namun untuk pembelian di atas Rp 250.000, Anda mendapat free shipping ke seluruh Indonesia.",
    },
    {
      question: "Metode pembayaran apa saja yang tersedia?",
      answer:
        "Kami menerima transfer bank (BCA, Mandiri, BRI, BNI), e-wallet (GoPay, OVO, DANA, ShopeePay), dan virtual account. Semua pembayaran diproses melalui Midtrans yang aman.",
    },
    {
      question: "Bisakah mengubah atau membatalkan pesanan?",
      answer:
        "Pesanan dapat diubah atau dibatalkan dalam 1 jam setelah pembayaran dikonfirmasi. Setelah itu, pesanan akan masuk proses packing dan tidak dapat diubah.",
    },
    {
      question: "Bagaimana jika produk rusak atau salah?",
      answer:
        "Kami menyediakan garansi 30 hari untuk produk rusak atau salah kirim. Hubungi customer service kami dengan foto produk untuk proses penggantian.",
    },
    {
      question: "Apakah ada program loyalitas?",
      answer:
        "Ya! Setiap pembelian akan mendapat poin COLORE yang bisa ditukar dengan diskon atau produk gratis. Bergabunglah dengan COLORE Club untuk benefit eksklusif.",
    },
  ];

  const paymentMethods = [
    {
      name: "Transfer Bank",
      icon: "🏦",
      description: "BCA, Mandiri, BRI, BNI",
    },
    {
      name: "E-Wallet",
      icon: "📱",
      description: "GoPay, OVO, DANA, ShopeePay",
    },
    { name: "Virtual Account", icon: "💳", description: "VA Bank & Retail" },
    { name: "Credit Card", icon: "💳", description: "Visa, Mastercard, JCB" },
  ];

  const benefits = [
    {
      icon: <Shield className="w-6 h-6" style={{ color: THEME.primary }} />,
      title: "Pembayaran Aman",
      description: "Dilindungi enkripsi SSL dan gateway Midtrans",
    },
    {
      icon: <Truck className="w-6 h-6" style={{ color: THEME.primary }} />,
      title: "Pengiriman Cepat",
      description: "3-7 hari kerja dengan tracking real-time",
    },
    {
      icon: (
        <HeadphonesIcon className="w-6 h-6" style={{ color: THEME.primary }} />
      ),
      title: "Customer Support",
      description: "Tim support siap membantu 24/7",
    },
  ];

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(180deg, #FFFFFF 0%, ${THEME.primary}1A 100%)`,
      }}
    >
      {/* ============== HERO (blend warna halaman + putih) ============== */}
      <section className="relative pt-24 pb-12 px-6 lg:px-12 overflow-hidden">
        {/* bubbles blend */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute -top-24 -left-24 w-[40rem] h-[40rem] rounded-full"
            style={{
              background: THEME.primary,
              filter: "blur(80px)",
              opacity: 0.7,
            }}
          />
          <div
            className="absolute -top-10 right-[-10%] w-[28rem] h-[28rem] rounded-full"
            style={{
              background: THEME.bubbleA,
              filter: "blur(80px)",
              opacity: 0.35,
            }}
          />
          <div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] rounded-full"
            style={{
              background: THEME.bubbleB,
              filter: "blur(80px)",
              opacity: 0.35,
            }}
          />
        </div>

        <div className="container mx-auto text-center relative z-10">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ backgroundColor: `${THEME.primary}33` }}
          >
            <Sparkles className="w-4 h-4" style={{ color: THEME.primary }} />
            <span
              className={cn(fredoka.className, "text-sm font-medium")}
              style={{ color: THEME.primary }}
            >
              Panduan Pemesanan
            </span>
          </div>

          <h1
            className={cn(
              fredoka.className,
              "text-4xl lg:text-6xl font-bold text-gray-900 mb-6"
            )}
          >
            Cara Pesan di
            <span className="block" style={{ color: THEME.primary }}>
              COLORE
            </span>
          </h1>

          <p
            className={cn(
              sniglet.className,
              "text-xl text-gray-700 max-w-3xl mx-auto mb-8"
            )}
          >
            Ikuti 6 langkah mudah untuk mendapatkan produk seni ramah lingkungan
            terbaik untuk anak Anda. Proses yang simple, aman, dan menyenangkan!
          </p>

          {/* Quick Stats */}
          <div
            className={cn(
              sniglet.className,
              "grid grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto"
            )}
          >
            {benefits.map((benefit, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex justify-center mb-3">{benefit.icon}</div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">
                  {benefit.title}
                </h3>
                <p className="text-xs text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== STEP NAV + CONTENT (section putih) ============== */}
      <section className="px-6 lg:px-12 mb-16">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2
              className={cn(
                fredoka.className,
                "text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
              )}
            >
              Langkah-langkah{" "}
              <span style={{ color: THEME.primary }}>Pemesanan</span>
            </h2>
            <p
              className={cn(
                sniglet.className,
                "text-gray-600 max-w-2xl mx-auto"
              )}
            >
              Proses pemesanan yang simple dan user-friendly, dirancang untuk
              kemudahan Anda
            </p>
          </div>

          {/* Step Navigation */}
          <div className="flex justify-center mb-12">
            <div
              className="bg-white rounded-3xl p-6 shadow-lg"
              style={{ border: `1px solid ${THEME.primary}33` }}
            >
              <div className="flex flex-wrap gap-3">
                {orderSteps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <button
                      onClick={() => setActiveStep(step.id)}
                      className="flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all duration-300"
                      style={
                        activeStep === step.id
                          ? {
                              backgroundColor: THEME.primary,
                              color: "#fff",
                              boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
                            }
                          : { backgroundColor: "#F3F4F6", color: "#374151" }
                      }
                    >
                      <div
                        className="p-2 rounded-xl"
                        style={{
                          backgroundColor:
                            activeStep === step.id ? "#FFFFFF33" : "#fff",
                        }}
                      >
                        <div
                          style={{
                            color:
                              activeStep === step.id ? "#fff" : THEME.primary,
                          }}
                        >
                          {step.icon}
                        </div>
                      </div>
                      <span className="hidden sm:block">
                        {step.id}. {step.title}
                      </span>
                      <span className="sm:hidden">{step.id}</span>
                    </button>
                    {index < orderSteps.length - 1 && (
                      <ArrowRight className="w-5 h-5 text-gray-300 mx-2 hidden lg:block" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Active Step Content */}
          {orderSteps.map((step) => (
            <div
              key={step.id}
              className={`transition-all duration-500 ${
                activeStep === step.id
                  ? "opacity-100 visible"
                  : "opacity-0 invisible absolute"
              }`}
            >
              {activeStep === step.id && (
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Content */}
                    <div className="p-8 lg:p-12">
                      <div className="flex items-center gap-4 mb-6">
                        <div
                          className="w-16 h-16 rounded-2xl flex items-center justify-center text-white"
                          style={{ backgroundColor: THEME.primary }}
                        >
                          {step.icon}
                        </div>
                        <div>
                          <div
                            className="font-semibold text-sm"
                            style={{ color: THEME.primary }}
                          >
                            Langkah {step.id}
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900">
                            {step.title}
                          </h3>
                        </div>
                      </div>

                      <p className="text-gray-600 text-lg mb-6">
                        {step.description}
                      </p>

                      <div className="space-y-4 mb-8">
                        <h4 className="font-semibold text-gray-900">
                          Detail Langkah:
                        </h4>
                        {step.details.map((detail, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div
                              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                              style={{ backgroundColor: `${THEME.primary}1A` }}
                            >
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: THEME.primary }}
                              />
                            </div>
                            <span className="text-gray-700">{detail}</span>
                          </div>
                        ))}
                      </div>

                      {step.tips && (
                        <div
                          className="rounded-2xl p-6"
                          style={{ backgroundColor: `${THEME.primary}29` }}
                        >
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <AlertCircle
                              className="w-5 h-5"
                              style={{ color: THEME.primary }}
                            />
                            Tips Berguna:
                          </h4>
                          <ul className="space-y-2">
                            {step.tips.map((tip, index) => (
                              <li
                                key={index}
                                className="text-sm flex items-start gap-2"
                                style={{ color: "#374151" }}
                              >
                                <Star
                                  className="w-4 h-4 flex-shrink-0 mt-0.5"
                                  style={{ color: THEME.primary }}
                                />
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Visual (section berwarna lembut) */}
                    <div
                      className="relative flex items-center justify-center p-8"
                      style={{
                        background: `linear-gradient(135deg, ${THEME.primary}26 0%, ${THEME.bubbleB}26 100%)`,
                      }}
                    >
                      <div className="relative w-full max-w-md">
                        <Image
                          src={step.image}
                          alt={step.title}
                          width={400}
                          height={300}
                          className="w-full h-auto rounded-2xl shadow-lg"
                        />
                        <div
                          className="absolute -top-4 -right-4 w-8 h-8 rounded-full opacity-60"
                          style={{ backgroundColor: THEME.bubbleA }}
                        />
                        <div
                          className="absolute -bottom-4 -left-4 w-6 h-6 rounded-full opacity-60"
                          style={{ backgroundColor: THEME.bubbleB }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
              disabled={activeStep === 1}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed border"
              style={{
                color: THEME.primary,
                borderColor: THEME.primary,
              }}
            >
              <ArrowLeft className="w-5 h-5" />
              Langkah Sebelumnya
            </button>

            <button
              onClick={() => setActiveStep(Math.min(6, activeStep + 1))}
              disabled={activeStep === 6}
              className="flex items-center gap-2 px-6 py-3 text-white rounded-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: THEME.primary }}
            >
              Langkah Selanjutnya
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* ============== PAYMENT (section putih) ============== */}
      <section className="px-6 lg:px-12 mb-16">
        <div className="container mx-auto">
          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-lg">
            <div className="text-center mb-12">
              <h2
                className={cn(
                  fredoka.className,
                  "text-3xl font-bold text-gray-900 mb-4"
                )}
              >
                Metode <span style={{ color: THEME.primary }}>Pembayaran</span>
              </h2>
              <p
                className={cn(
                  sniglet.className,
                  "text-gray-600 max-w-2xl mx-auto"
                )}
              >
                Kami menyediakan berbagai metode pembayaran yang aman dan
                terpercaya melalui gateway Midtrans
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {paymentMethods.map((method, index) => (
                <div
                  key={index}
                  className="text-center p-6 rounded-2xl transition-all duration-300 border"
                  style={{ borderColor: "#E5E7EB" }}
                >
                  <div className="text-4xl mb-4">{method.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {method.name}
                  </h3>
                  <p className="text-sm text-gray-600">{method.description}</p>
                </div>
              ))}
            </div>

            <div
              className="rounded-2xl p-6 text-center"
              style={{ backgroundColor: `${THEME.primary}1A` }}
            >
              <div className="flex justify-center mb-4">
                <Shield className="w-8 h-8" style={{ color: THEME.primary }} />
              </div>
              <h3
                className={cn(
                  fredoka.className,
                  "font-semibold text-gray-900 mb-2 text-lg"
                )}
              >
                Keamanan Terjamin
              </h3>
              <p className={cn(sniglet.className, "text-gray-600")}>
                Semua transaksi dilindungi enkripsi SSL 256-bit dan diproses
                melalui Midtrans yang telah tersertifikasi PCI DSS Level 1
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============== CONTACT (section berwarna) ============== */}
      <section className="px-6 lg:px-12 mb-16">
        <div className="container mx-auto">
          <div
            className="rounded-3xl p-8 lg:p-12 text-gray-900"
            style={{
              background: `linear-gradient(90deg, ${THEME.primary} 0%, ${THEME.primary}CC 100%)`,
              color: "#fff",
            }}
          >
            <div className="text-center mb-8">
              <h2 className={cn(fredoka.className, "text-3xl font-bold mb-4")}>
                Butuh Bantuan?
              </h2>
              <p
                className={cn(
                  sniglet.className,
                  "text-white/90 max-w-2xl mx-auto"
                )}
              >
                Tim Customer Services akan siap membantu fast response hari
                Senin - Jumat jam 08.00 - 17.00 WIB. Jangan ragu untuk
                menghubungi kami!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {/* phone icon replaced with Mail & MessageCircle above; keeping consistent */}
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">WhatsApp</h3>
                <p className="text-white/90">+62 817 694 2128</p>
                <p className="text-sm text-white/70">
                  Respon cepat dalam 5 menit
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-white/90">help@coloreartcrafts.com</p>
                <p className="text-sm text-white/70">Respon dalam 2 jam</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <HeadphonesIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Customer Support</h3>
                <p className="text-white/90">24/7 Online</p>
                <p className="text-sm text-white/70">Live chat tersedia</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== CTA (section putih) ============== */}
      <section className="px-6 lg:px-12 mb-16">
        <div className="container mx-auto">
          <div className="bg-white rounded-3xl p-8 lg:p-12 text-center shadow-lg">
            <h2
              className={cn(
                fredoka.className,
                "text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
              )}
            >
              Yuk Mulai Belanja Sekarang
            </h2>
            <p
              className={cn(
                sniglet.className,
                "text-gray-600 mb-8 max-w-2xl mx-auto"
              )}
            >
              Jelajahi koleksi produk ramah lingkungan kami dan berikan yang
              terbaik untuk perkembangan kreativitas anak Anda.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="text-white px-8 py-4 rounded-2xl font-semibold transition-colors flex items-center justify-center gap-2"
                style={{ backgroundColor: THEME.primary }}
              >
                <ShoppingCart className="w-5 h-5" />
                Mulai Berbelanja
              </button>
              <button
                className="px-8 py-4 rounded-2xl font-semibold transition-colors flex items-center justify-center gap-2 border"
                style={{ color: THEME.primary, borderColor: THEME.primary }}
              >
                <Play className="w-5 h-5" />
                Lihat Video Tutorial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============== FAQ (section putih) ============== */}
      <section className="px-6 lg:px-12 mb-16">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2
              className={cn(
                fredoka.className,
                "text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
              )}
            >
              Pertanyaan <span style={{ color: THEME.primary }}>Umum</span>
            </h2>
            <p
              className={cn(
                sniglet.className,
                "text-gray-600 max-w-2xl mx-auto"
              )}
            >
              Temukan jawaban untuk pertanyaan yang sering ditanyakan tentang
              proses pemesanan
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedFAQ(expandedFAQ === index ? null : index)
                    }
                    className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </h3>
                    {expandedFAQ === index ? (
                      <ChevronUp
                        className="w-5 h-5"
                        style={{ color: THEME.primary }}
                      />
                    ) : (
                      <ChevronDown
                        className="w-5 h-5"
                        style={{ color: THEME.primary }}
                      />
                    )}
                  </button>
                  {expandedFAQ === index && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
