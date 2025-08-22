"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  ShoppingCart, 
  CreditCard, 
  User, 
  Package, 
  CheckCircle,
  ArrowRight,
  ArrowDown,
  Sparkles,
  Shield,
  Clock,
  Truck,
  HeadphonesIcon,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Star,
  Play,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Gift,
  Heart,
  Smartphone,
  ArrowLeft
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

  const orderSteps: Step[] = [
    {
      id: 1,
      title: "Pilih Produk Favorit",
      description: "Jelajahi koleksi produk ramah lingkungan dan pilih yang sesuai untuk anak Anda",
      details: [
        "Browse kategori produk (Art Supplies, Craft Kits, Educational Toys)",
        "Gunakan filter usia untuk menemukan produk yang tepat",
        "Baca detail produk dan review dari orang tua lain",
        "Klik 'Tambah ke Keranjang' untuk produk pilihan"
      ],
      icon: <ShoppingCart className="w-8 h-8" />,
      image: "/api/placeholder/500/400",
      tips: [
        "Gunakan filter usia untuk hasil yang lebih akurat",
        "Baca review produk untuk insight dari orang tua lain",
        "Cek badge 'Eco-Friendly' untuk produk ramah lingkungan"
      ]
    },
    {
      id: 2,
      title: "Review Keranjang Belanja",
      description: "Periksa kembali produk pilihan dan jumlah pesanan sebelum checkout",
      details: [
        "Klik icon keranjang di header untuk melihat daftar produk",
        "Ubah quantity atau hapus produk jika diperlukan",
        "Cek total harga dan estimasi ongkos kirim",
        "Klik 'Checkout' untuk melanjutkan pemesanan"
      ],
      icon: <Package className="w-8 h-8" />,
      image: "/api/placeholder/500/400",
      tips: [
        "Manfaatkan free shipping untuk pembelian di atas Rp 250.000",
        "Cek kode promo yang tersedia",
        "Pastikan semua produk masih tersedia"
      ]
    },
    {
      id: 3,
      title: "Isi Data Pengiriman",
      description: "Lengkapi informasi pengiriman dan kontak untuk proses delivery",
      details: [
        "Isi nama lengkap dan nomor telepon yang bisa dihubungi",
        "Masukkan alamat lengkap dengan detail patokan",
        "Pilih metode pengiriman yang diinginkan",
        "Tambahkan catatan khusus jika diperlukan"
      ],
      icon: <User className="w-8 h-8" />,
      image: "/api/placeholder/500/400",
      tips: [
        "Pastikan nomor telepon aktif untuk koordinasi pengiriman",
        "Tulis alamat selengkap mungkin termasuk patokan",
        "Simpan alamat untuk kemudahan pemesanan berikutnya"
      ]
    },
    {
      id: 4,
      title: "Pilih Metode Pembayaran",
      description: "Proses pembayaran aman menggunakan gateway Midtrans yang terpercaya",
      details: [
        "Pilih metode pembayaran: Transfer Bank, E-Wallet, atau Virtual Account",
        "Sistem akan redirect ke halaman pembayaran Midtrans",
        "Ikuti instruksi pembayaran sesuai metode yang dipilih",
        "Konfirmasi pembayaran akan diterima otomatis"
      ],
      icon: <CreditCard className="w-8 h-8" />,
      image: "/api/placeholder/500/400",
      tips: [
        "Semua metode pembayaran aman dan terenkripsi",
        "Simpan bukti pembayaran untuk referensi",
        "Konfirmasi pembayaran biasanya dalam 1-5 menit"
      ]
    },
    {
      id: 5,
      title: "Pesanan Berhasil",
      description: "Pesanan dikonfirmasi dan akan diproses untuk pengiriman",
      details: [
        "Anda akan menerima email konfirmasi pesanan",
        "Pesanan akan diproses dalam 1-2 hari kerja",
        "Update status pengiriman akan dikirim via WhatsApp/Email",
        "Estimasi pengiriman 3-7 hari kerja"
      ],
      icon: <CheckCircle className="w-8 h-8" />,
      image: "/api/placeholder/500/400",
      tips: [
        "Simpan nomor pesanan untuk tracking",
        "Cek email dan WhatsApp untuk update status",
        "Hubungi customer service jika ada pertanyaan"
      ]
    },
    {
      id: 6,
      title: "Cek Status Pesanan",
      description: "Monitor progress pesanan melalui halaman profile Anda",
      details: [
        "Login ke akun COLORE Anda",
        "Buka menu 'Profile' → 'Pesanan Saya'",
        "Lihat status real-time dari pesanan",
        "Download invoice atau berikan review produk"
      ],
      icon: <Truck className="w-8 h-8" />,
      image: "/api/placeholder/500/400",
      tips: [
        "Status akan update otomatis saat ada perubahan",
        "Gunakan nomor resi untuk tracking di expedisi",
        "Berikan review setelah produk diterima"
      ]
    }
  ];

  const faqs: FAQ[] = [
    {
      question: "Berapa lama proses pengiriman?",
      answer: "Estimasi pengiriman 3-7 hari kerja untuk wilayah Jabodetabek, dan 7-14 hari kerja untuk luar kota. Kami menggunakan ekspedisi terpercaya seperti JNE, TIKI, dan J&T."
    },
    {
      question: "Apakah ada minimum pembelian?",
      answer: "Tidak ada minimum pembelian. Namun untuk pembelian di atas Rp 250.000, Anda mendapat free shipping ke seluruh Indonesia."
    },
    {
      question: "Metode pembayaran apa saja yang tersedia?",
      answer: "Kami menerima transfer bank (BCA, Mandiri, BRI, BNI), e-wallet (GoPay, OVO, DANA, ShopeePay), dan virtual account. Semua pembayaran diproses melalui Midtrans yang aman."
    },
    {
      question: "Bisakah mengubah atau membatalkan pesanan?",
      answer: "Pesanan dapat diubah atau dibatalkan dalam 1 jam setelah pembayaran dikonfirmasi. Setelah itu, pesanan akan masuk proses packing dan tidak dapat diubah."
    },
    {
      question: "Bagaimana jika produk rusak atau salah?",
      answer: "Kami menyediakan garansi 30 hari untuk produk rusak atau salah kirim. Hubungi customer service kami dengan foto produk untuk proses penggantian."
    },
    {
      question: "Apakah ada program loyalitas?",
      answer: "Ya! Setiap pembelian akan mendapat poin COLORE yang bisa ditukar dengan diskon atau produk gratis. Bergabunglah dengan COLORE Club untuk benefit eksklusif."
    }
  ];

  const paymentMethods = [
    { name: "Transfer Bank", icon: "🏦", description: "BCA, Mandiri, BRI, BNI" },
    { name: "E-Wallet", icon: "📱", description: "GoPay, OVO, DANA, ShopeePay" },
    { name: "Virtual Account", icon: "💳", description: "VA Bank & Retail" },
    { name: "Credit Card", icon: "💳", description: "Visa, Mastercard, JCB" }
  ];

  const benefits = [
    {
      icon: <Shield className="w-6 h-6 text-[#A3B18A]" />,
      title: "Pembayaran Aman",
      description: "Dilindungi enkripsi SSL dan gateway Midtrans"
    },
    {
      icon: <Truck className="w-6 h-6 text-[#A3B18A]" />,
      title: "Pengiriman Cepat",
      description: "3-7 hari kerja dengan tracking real-time"
    },
    {
      icon: <Gift className="w-6 h-6 text-[#A3B18A]" />,
      title: "Free Shipping",
      description: "Gratis ongkir untuk pembelian di atas 250k"
    },
    {
      icon: <HeadphonesIcon className="w-6 h-6 text-[#A3B18A]" />,
      title: "Customer Support",
      description: "Tim support siap membantu 24/7"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#DFF19D]/10">
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-6 lg:px-12">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#A3B18A]/10 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-[#A3B18A]" />
            <span className="text-sm font-medium text-[#A3B18A]">Panduan Pemesanan</span>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Cara Pesan di
            <span className="block text-[#A3B18A]">COLORE</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Ikuti 6 langkah mudah untuk mendapatkan produk seni ramah lingkungan 
            terbaik untuk anak Anda. Proses yang simple, aman, dan menyenangkan!
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm">
                <div className="flex justify-center mb-3">
                  {benefit.icon}
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{benefit.title}</h3>
                <p className="text-xs text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Step-by-Step Process */}
      <section className="px-6 lg:px-12 mb-16">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Langkah-langkah <span className="text-[#A3B18A]">Pemesanan</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Proses pemesanan yang simple dan user-friendly, dirancang untuk kemudahan Anda
            </p>
          </div>

          {/* Step Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-[#A3B18A]/10">
              <div className="flex flex-wrap gap-3">
                {orderSteps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <button
                      onClick={() => setActiveStep(step.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all duration-300 ${
                        activeStep === step.id
                          ? "bg-[#A3B18A] text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-[#A3B18A]/10"
                      }`}
                    >
                      <div className={`p-2 rounded-xl ${
                        activeStep === step.id ? "bg-white/20" : "bg-white"
                      }`}>
                        <div className={`${activeStep === step.id ? "text-white" : "text-[#A3B18A]"}`}>
                          {step.icon}
                        </div>
                      </div>
                      <span className="hidden sm:block">{step.id}. {step.title}</span>
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
                activeStep === step.id ? "opacity-100 visible" : "opacity-0 invisible absolute"
              }`}
            >
              {activeStep === step.id && (
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Content */}
                    <div className="p-8 lg:p-12">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-[#A3B18A] rounded-2xl flex items-center justify-center text-white">
                          {step.icon}
                        </div>
                        <div>
                          <div className="text-[#A3B18A] font-semibold text-sm">Langkah {step.id}</div>
                          <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                        </div>
                      </div>

                      <p className="text-gray-600 text-lg mb-6">{step.description}</p>

                      <div className="space-y-4 mb-8">
                        <h4 className="font-semibold text-gray-900">Detail Langkah:</h4>
                        {step.details.map((detail, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-[#A3B18A]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="w-2 h-2 bg-[#A3B18A] rounded-full"></div>
                            </div>
                            <span className="text-gray-700">{detail}</span>
                          </div>
                        ))}
                      </div>

                      {step.tips && (
                        <div className="bg-[#DFF19D]/20 rounded-2xl p-6">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-[#A3B18A]" />
                            Tips Berguna:
                          </h4>
                          <ul className="space-y-2">
                            {step.tips.map((tip, index) => (
                              <li key={index} className="text-gray-700 text-sm flex items-start gap-2">
                                <Star className="w-4 h-4 text-[#A3B18A] flex-shrink-0 mt-0.5" />
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Visual */}
                    <div className="relative bg-gradient-to-br from-[#DFF19D]/20 to-[#BFF0F5]/20 flex items-center justify-center p-8">
                      <div className="relative w-full max-w-md">
                        <Image
                          src={step.image}
                          alt={step.title}
                          width={400}
                          height={300}
                          className="w-full h-auto rounded-2xl shadow-lg"
                        />
                        {/* Floating elements for visual appeal */}
                        <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#F6CCD0] rounded-full opacity-60"></div>
                        <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-[#BFF0F5] rounded-full opacity-60"></div>
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
              className="flex items-center gap-2 px-6 py-3 border border-[#A3B18A] text-[#A3B18A] rounded-2xl hover:bg-[#A3B18A] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-5 h-5" />
              Langkah Sebelumnya
            </button>
            
            <button
              onClick={() => setActiveStep(Math.min(6, activeStep + 1))}
              disabled={activeStep === 6}
              className="flex items-center gap-2 px-6 py-3 bg-[#A3B18A] text-white rounded-2xl hover:bg-[#A3B18A]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Langkah Selanjutnya
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="px-6 lg:px-12 mb-16">
        <div className="container mx-auto">
          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-lg">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Metode <span className="text-[#A3B18A]">Pembayaran</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Kami menyediakan berbagai metode pembayaran yang aman dan terpercaya 
                melalui gateway Midtrans
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {paymentMethods.map((method, index) => (
                <div key={index} className="text-center p-6 border border-gray-200 rounded-2xl hover:border-[#A3B18A] hover:bg-[#A3B18A]/5 transition-all duration-300">
                  <div className="text-4xl mb-4">{method.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{method.name}</h3>
                  <p className="text-sm text-gray-600">{method.description}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#A3B18A]/5 rounded-2xl p-6 text-center">
              <div className="flex justify-center mb-4">
                <Shield className="w-8 h-8 text-[#A3B18A]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Keamanan Terjamin</h3>
              <p className="text-gray-600">
                Semua transaksi dilindungi enkripsi SSL 256-bit dan diproses melalui 
                Midtrans yang telah tersertifikasi PCI DSS Level 1
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 lg:px-12 mb-16">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Pertanyaan <span className="text-[#A3B18A]">Umum</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Temukan jawaban untuk pertanyaan yang sering ditanyakan tentang proses pemesanan
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                    className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="font-semibold text-gray-900 pr-4">{faq.question}</h3>
                    {expandedFAQ === index ? (
                      <ChevronUp className="w-5 h-5 text-[#A3B18A] flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#A3B18A] flex-shrink-0" />
                    )}
                  </button>
                  {expandedFAQ === index && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="px-6 lg:px-12 mb-16">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-[#A3B18A] to-[#A3B18A]/80 rounded-3xl p-8 lg:p-12 text-white">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Butuh Bantuan?</h2>
              <p className="text-white/90 max-w-2xl mx-auto">
                Tim customer service COLORE siap membantu Anda 24/7. 
                Jangan ragu untuk menghubungi kami!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8" />
                </div>
                <h3 className="font-semibold mb-2">Telepon</h3>
                <p className="text-white/90">+62 21 1234 5678</p>
                <p className="text-sm text-white/70">Senin - Minggu, 08:00 - 22:00</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8" />
                </div>
                <h3 className="font-semibold mb-2">WhatsApp</h3>
                <p className="text-white/90">+62 812 3456 7890</p>
                <p className="text-sm text-white/70">Respon cepat dalam 5 menit</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8" />
                </div>
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-white/90">help@colore.co.id</p>
                <p className="text-sm text-white/70">Respon dalam 2 jam</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 lg:px-12 mb-16">
        <div className="container mx-auto">
          <div className="bg-white rounded-3xl p-8 lg:p-12 text-center shadow-lg">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Siap Mulai Berbelanja?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Jelajahi koleksi produk ramah lingkungan kami dan berikan yang terbaik 
              untuk perkembangan kreativitas anak Anda.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-[#A3B18A] text-white px-8 py-4 rounded-2xl font-semibold hover:bg-[#A3B18A]/90 transition-colors flex items-center justify-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Mulai Berbelanja
              </button>
              <button className="border border-[#A3B18A] text-[#A3B18A] px-8 py-4 rounded-2xl font-semibold hover:bg-[#A3B18A] hover:text-white transition-colors flex items-center justify-center gap-2">
                <Play className="w-5 h-5" />
                Lihat Video Tutorial
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#A3B18A] mb-1">5000+</div>
                <div className="text-sm text-gray-600">Pesanan Berhasil</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#A3B18A] mb-1">4.9</div>
                <div className="text-sm text-gray-600">Rating Kepuasan</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#A3B18A] mb-1">24/7</div>
                <div className="text-sm text-gray-600">Customer Support</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#A3B18A] mb-1">100%</div>
                <div className="text-sm text-gray-600">Aman & Terpercaya</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}