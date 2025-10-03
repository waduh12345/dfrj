"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { fredoka, sniglet } from "@/lib/fonts";
import { useTranslation } from "@/hooks/use-translation";
import { useLanguage } from "@/contexts/LanguageContext";
import id from "@/translations/how-to-order/id";
import en from "@/translations/how-to-order/en";
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
  const { lang } = useLanguage();
  const t = useTranslation({ id, en });
  const [activeStep, setActiveStep] = useState(1);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  // === THEME (urut ke-2: #F6CCD0), selang-seling dgn putih ===
  const THEME = {
    primary: "#F6CCD0", // warna halaman ini
    bubbleA: "#DFF19D",
    bubbleB: "#BFF0F5",
  };

  const orderStepsTranslation: Record<"id" | "en", Step[]> = {
    id: [
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
        icon: <CheckCircle className="w-8 h-8" />,
        image: "/api/placeholder/500/400",
        tips: [
          "Status akan update otomatis saat ada perubahan",
          "Gunakan nomor resi untuk tracking di expedisi",
          "Berikan review setelah produk diterima",
        ],
      },
    ],
    en: [
      {
        id: 1,
        title: "Choose Your Favorite Product",
        description:
          "Explore our eco-friendly product collection and pick the best fit for your child",
        details: [
          "Browse product categories (Art Supplies, Craft Kits, Educational Toys)",
          "Use the age filter to find the right product",
          "Read product details and reviews from other parents",
          "Click 'Add to Cart' for your chosen items",
        ],
        icon: <ShoppingCart className="w-8 h-8" />,
        image: "/api/placeholder/500/400",
        tips: [
          "Use the age filter for more accurate results",
          "Check product reviews for insights from other parents",
          "Look for the 'Eco-Friendly' badge for green products",
        ],
      },
      {
        id: 2,
        title: "Review Your Cart",
        description:
          "Double-check your selected items and quantities before checkout",
        details: [
          "Click the cart icon in the header to see your items",
          "Adjust quantity or remove items if needed",
          "Check total price and estimated shipping cost",
          "Click 'Checkout' to proceed with your order",
        ],
        icon: <Package className="w-8 h-8" />,
        image: "/api/placeholder/500/400",
        tips: [
          "Enjoy free shipping for orders above Rp 250,000",
          "Look for available promo codes",
          "Make sure all items are still in stock",
        ],
      },
      {
        id: 3,
        title: "Fill in Shipping Details",
        description:
          "Complete your shipping and contact information for delivery",
        details: [
          "Enter your full name and a reachable phone number",
          "Provide a complete address with nearby landmarks",
          "Choose your preferred shipping method",
          "Add special notes if necessary",
        ],
        icon: <User className="w-8 h-8" />,
        image: "/api/placeholder/500/400",
        tips: [
          "Ensure your phone number is active for delivery coordination",
          "Write the full address including landmarks",
          "Save your address for future orders",
        ],
      },
      {
        id: 4,
        title: "Choose Payment Method",
        description: "Secure payment process through trusted Midtrans gateway",
        details: [
          "Select a payment method: Bank Transfer, E-Wallet, or Virtual Account",
          "The system will redirect you to the Midtrans payment page",
          "Follow the instructions based on your chosen method",
          "Payment confirmation will be received automatically",
        ],
        icon: <CreditCard className="w-8 h-8" />,
        image: "/api/placeholder/500/400",
        tips: [
          "All payment methods are safe and encrypted",
          "Keep your payment receipt for reference",
          "Payment confirmation usually takes 1–5 minutes",
        ],
      },
      {
        id: 5,
        title: "Order Successful",
        description:
          "Your order is confirmed and will be processed for delivery",
        details: [
          "You will receive an order confirmation email",
          "Your order will be processed within 1–2 business days",
          "Shipping updates will be sent via WhatsApp/Email",
          "Estimated delivery time: 3–7 business days",
        ],
        icon: <CheckCircle className="w-8 h-8" />,
        image: "/api/placeholder/500/400",
        tips: [
          "Save your order number for tracking",
          "Check your email and WhatsApp for updates",
          "Contact customer service if you have any questions",
        ],
      },
      {
        id: 6,
        title: "Track Your Order",
        description: "Monitor your order progress from your profile page",
        details: [
          "Log in to your COLORE account",
          "Go to 'Profile' → 'My Orders'",
          "Check real-time order status",
          "Download invoice or leave a product review",
        ],
        icon: <Truck className="w-8 h-8" />,
        image: "/api/placeholder/500/400",
        tips: [
          "Status updates automatically when changes occur",
          "Use the tracking number for expedition tracking",
          "Leave a review after receiving your product",
        ],
      },
    ],
  };

  const orderSteps: Step[] = orderStepsTranslation[lang];

  const faqsTranslation: Record<"en" | "id", FAQ[]> = {
    id: [
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
    ],
    en: [
      {
        question: "How long is the shipping process?",
        answer:
          "Estimated delivery is 3–7 business days for Jabodetabek area, and 7–14 business days for other cities. We use trusted couriers such as JNE, TIKI, and J&T.",
      },
      {
        question: "Is there a minimum purchase?",
        answer:
          "There is no minimum purchase. However, for orders above Rp 250,000, you will get free shipping across Indonesia.",
      },
      {
        question: "What payment methods are available?",
        answer:
          "We accept bank transfers (BCA, Mandiri, BRI, BNI), e-wallets (GoPay, OVO, DANA, ShopeePay), and virtual accounts. All payments are securely processed via Midtrans.",
      },
      {
        question: "Can I change or cancel my order?",
        answer:
          "Orders can be changed or canceled within 1 hour after payment confirmation. After that, the order will proceed to packing and can no longer be modified.",
      },
      {
        question: "What if the product is damaged or incorrect?",
        answer:
          "We provide a 30-day guarantee for damaged or incorrect products. Contact our customer service with product photos for a replacement process.",
      },
      {
        question: "Is there a loyalty program?",
        answer:
          "Yes! Every purchase earns COLORE points that can be redeemed for discounts or free products. Join COLORE Club for exclusive benefits.",
      },
    ],
  };

  const faqs: FAQ[] = faqsTranslation[lang];

  const benefits = [
    {
      icon: <Shield className="w-6 h-6" style={{ color: THEME.primary }} />,
      title: t["hero-item-1-title"],
      description: t["hero-item-1-content"],
    },
    {
      icon: <Truck className="w-6 h-6" style={{ color: THEME.primary }} />,
      title: t["hero-item-2-title"],
      description: t["hero-item-2-content"],
    },
    {
      icon: (
        <HeadphonesIcon className="w-6 h-6" style={{ color: THEME.primary }} />
      ),
      title: t["hero-item-3-title"],
      description: t["hero-item-3-content"],
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
              {t["hero-badge"]}
            </span>
          </div>

          <h1
            className={cn(
              fredoka.className,
              "text-4xl lg:text-6xl font-bold text-gray-900 mb-6"
            )}
          >
            {t["hero-title-1"]}
            <span className="block" style={{ color: THEME.primary }}>
              {t["hero-title-2"]}
            </span>
          </h1>

          <p
            className={cn(
              sniglet.className,
              "text-xl text-gray-700 max-w-3xl mx-auto mb-8"
            )}
          >
            {t["hero-subtitle"]}
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
      <section className="p-6 lg:px-12 mb-16">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2
              className={cn(
                fredoka.className,
                "text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
              )}
            >
              {t["nav-step-title-1"]}{" "}
              <span style={{ color: THEME.primary }}>
                {t["nav-step-title-2"]}
              </span>
            </h2>
            <p
              className={cn(
                sniglet.className,
                "text-gray-600 max-w-2xl mx-auto"
              )}
            >
              {t["nav-step-subtitle"]}
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
                            {t["nav-step-header-1"]} {step.id}
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
                          {t["nav-step-header-2"]}
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
                            {t["nav-step-header-3"]}
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
              {t["nav-step-prev"]}
            </button>

            <button
              onClick={() => setActiveStep(Math.min(6, activeStep + 1))}
              disabled={activeStep === 6}
              className="flex items-center gap-2 px-6 py-3 text-white rounded-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: THEME.primary }}
            >
              {t["nav-step-next"]}
              <ArrowRight className="w-5 h-5" />
            </button>
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
              color: "#8F5D73",
            }}
          >
            <div className="text-center mb-8">
              <h2 className={cn(fredoka.className, "text-3xl font-bold mb-4")}>
                {t["help-title"]}
              </h2>
              <p
                className={cn(
                  sniglet.className,
                  "text-rose-900 max-w-2xl mx-auto"
                )}
              >
                {t["help-subtitle"]}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#6B4F4F]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {/* phone icon replaced with Mail & MessageCircle above; keeping consistent */}
                  <MessageCircle className="w-8 h-8 text-[#6B4F4F]" />
                </div>
                <h3 className="font-semibold mb-2">WhatsApp</h3>
                <p className="text-rose-900">+62 817 694 2128</p>
                <p className="text-sm text-rose-900/80">
                  {t["help-content-1"]}
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#6B4F4F]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-[#6B4F4F]" />
                </div>
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-rose-900">help@coloreartcrafts.com</p>
                <p className="text-sm text-rose-900/80">
                  {" "}
                  {t["help-content-2"]}
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#6B4F4F]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <HeadphonesIcon className="w-8 h-8 text-[#6B4F4F]" />
                </div>
                <h3 className="font-semibold mb-2">Customer Support</h3>
                <p className="text-rose-900">24/7 Online</p>
                <p className="text-sm text-rose-900/80">
                  {t["help-content-3"]}
                </p>
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
              {t["cta-title"]}
            </h2>
            <p
              className={cn(
                sniglet.className,
                "text-gray-600 mb-8 max-w-2xl mx-auto"
              )}
            >
              {t["cta-subtitle"]}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="text-white px-8 py-4 rounded-2xl font-semibold transition-colors flex items-center justify-center gap-2"
                style={{ backgroundColor: THEME.primary }}
              >
                <ShoppingCart className="w-5 h-5" />
                {t["cta-btn-1"]}
              </button>
              <button
                className="px-8 py-4 rounded-2xl font-semibold transition-colors flex items-center justify-center gap-2 border"
                style={{ color: THEME.primary, borderColor: THEME.primary }}
              >
                <Play className="w-5 h-5" />
                {t["cta-btn-2"]}
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
              {t["faq-title-1"]}{" "}
              <span style={{ color: THEME.primary }}>{t["faq-title-2"]}</span>
            </h2>
            <p
              className={cn(
                sniglet.className,
                "text-gray-600 max-w-2xl mx-auto"
              )}
            >
              {t["faq-subtitle"]}
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
