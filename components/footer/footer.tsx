"use client";

import { useState } from "react";
import { 
  ChevronDown, 
  ChevronUp, 
  MapPin, 
  Phone, 
  Mail,
  Heart,
  Leaf,
  Shield,
  Award,
  ArrowRight,
  Send
} from "lucide-react";
import { FaInstagram, FaFacebookF, FaYoutube, FaTiktok, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [email, setEmail] = useState("");

  const faqs = [
    {
      question: "Apakah produk COLORE aman untuk anak?",
      answer:
        "Ya! Semua produk COLORE menggunakan bahan non-toxic dan telah tersertifikasi aman untuk anak. Kami menggunakan bahan daur ulang dan ramah lingkungan yang telah lulus uji keamanan internasional.",
    },
    {
      question: "Berapa usia yang cocok untuk produk COLORE?",
      answer:
        "Produk COLORE dirancang untuk anak usia 1-12 tahun dengan kategori yang berbeda. Setiap produk memiliki label usia yang jelas untuk membantu Anda memilih yang tepat untuk si kecil.",
    },
    {
      question: "Bagaimana cara merawat produk seni COLORE?",
      answer:
        "Produk COLORE mudah dibersihkan dengan air hangat dan sabun lembut. Simpan di tempat kering dan sejuk, hindari paparan sinar matahari langsung untuk menjaga kualitas warna dan bahan.",
    },
    {
      question: "Apakah ada garansi untuk produk yang rusak?",
      answer:
        "Kami memberikan garansi 30 hari untuk produk rusak atau cacat produksi. Hubungi customer service kami dengan foto produk untuk proses penggantian yang cepat dan mudah.",
    },
  ];

  const quickLinks = [
    { name: "Beranda", href: "/" },
    { name: "Tentang Kami", href: "/about" },
    { name: "Produk", href: "/product" },
    { name: "Galeri", href: "/gallery" },
    { name: "Berita", href: "/news" },
    { name: "Cara Pemesanan", href: "/how-to-order" }
  ];

  const productCategories = [
    { name: "Art Supplies", href: "/product?category=art-supplies" },
    { name: "Craft Kits", href: "/product?category=craft-kits" },
    { name: "Educational Toys", href: "/product?category=educational-toys" },
    { name: "Workshop Kits", href: "/product?category=workshop-kits" }
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Newsletter subscription:", email);
    setEmail("");
    // You can add actual subscription logic here
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 text-gray-300 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full shadow-2xl"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full shadow-2xl"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full shadow-xl"></div>
        <div className="absolute bottom-10 left-1/4 w-20 h-20 bg-gradient-to-br from-lime-500 to-green-500 rounded-full shadow-xl"></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="pt-16 pb-8 px-6 lg:px-12">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              {/* Company Info */}
              <div className="lg:col-span-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <span className="text-white font-bold text-xl">C</span>
                  </div>
                  <div>
                    <h3 className="text-white text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">COLORE</h3>
                    <p className="text-sm text-gray-400">Art & Crafts</p>
                  </div>
                </div>
                
                <p className="text-gray-400 leading-relaxed mb-6">
                  Menciptakan masa depan yang lebih berwarna melalui produk seni dan kerajinan 
                  ramah lingkungan untuk mengembangkan kreativitas anak Indonesia.
                </p>

                {/* Values */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Leaf className="w-4 h-4 text-emerald-400" />
                    <span>100% Ramah Lingkungan</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-cyan-400" />
                    <span>Aman untuk Anak</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>Tersertifikasi Internasional</span>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-pink-400 flex-shrink-0" />
                    <span>Jl. Kreativitas No. 123, Jakarta Selatan, Indonesia</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-lime-400 flex-shrink-0" />
                    <span>+62 21 7890 1234</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-teal-400 flex-shrink-0" />
                    <span>hello@colore.co.id</span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-white text-lg font-semibold mb-6 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Menu Utama</h4>
                <ul className="space-y-3">
                  {quickLinks.map((link, index) => (
                    <li key={index}>
                      <a 
                        href={link.href} 
                        className="text-gray-400 hover:text-emerald-400 transition-colors duration-300 flex items-center group"
                      >
                        <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
                        <span className="group-hover:translate-x-1 transition-transform duration-300">
                          {link.name}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Product Categories */}
              <div>
                <h4 className="text-white text-lg font-semibold mb-6">Kategori Produk</h4>
                <ul className="space-y-3">
                  {productCategories.map((category, index) => (
                    <li key={index}>
                      <a 
                        href={category.href} 
                        className="text-gray-400 hover:text-[#A3B18A] transition-colors duration-300 flex items-center group"
                      >
                        <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="group-hover:translate-x-1 transition-transform duration-300">
                          {category.name}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>

                {/* Newsletter */}
                <div className="mt-8">
                  <h4 className="text-white text-lg font-semibold mb-4">Newsletter</h4>
                  <p className="text-gray-400 text-sm mb-4">
                    Dapatkan tips kreatif dan info produk terbaru!
                  </p>
                  <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Anda"
                        className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#A3B18A] focus:border-transparent"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[#A3B18A] text-white py-3 rounded-2xl font-semibold hover:bg-[#A3B18A]/90 transition-colors flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Subscribe
                    </button>
                  </form>
                </div>
              </div>

              {/* FAQ */}
              <div>
                <h4 className="text-white text-lg font-semibold mb-6">FAQ</h4>
                <div className="space-y-4">
                  {faqs.map((faq, i) => (
                    <div key={i} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
                      <button
                        className="w-full flex justify-between items-center text-left p-4 text-white hover:bg-gray-700/30 transition-colors"
                        onClick={() => setActiveIndex(activeIndex === i ? null : i)}
                      >
                        <span className="font-medium text-sm pr-2">{faq.question}</span>
                        <div className="flex-shrink-0">
                          {activeIndex === i ? (
                            <ChevronUp className="w-4 h-4 text-[#A3B18A]" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-[#A3B18A]" />
                          )}
                        </div>
                      </button>
                      {activeIndex === i && (
                        <div className="px-4 pb-4">
                          <p className="text-sm text-gray-400 leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media & Bottom Bar */}
        <div className="border-t border-gray-700/50 bg-gray-900/50 backdrop-blur-sm">
          <div className="container mx-auto px-6 lg:px-12 py-6">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
              {/* Social Media */}
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <p className="text-gray-400 text-sm">Ikuti kami di:</p>
                <div className="flex gap-4">
                  <a
                    href="https://instagram.com/colore.indonesia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-2xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
                  >
                    <FaInstagram size={18} />
                  </a>
                  <a
                    href="https://facebook.com/colore.indonesia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-2xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-600 transition-all duration-300"
                  >
                    <FaFacebookF size={18} />
                  </a>
                  <a
                    href="https://youtube.com/@colore.indonesia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-2xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-600 transition-all duration-300"
                  >
                    <FaYoutube size={18} />
                  </a>
                  <a
                    href="https://tiktok.com/@colore.indonesia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-2xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-black transition-all duration-300"
                  >
                    <FaTiktok size={18} />
                  </a>
                  <a
                    href="https://wa.me/6281234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-2xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-green-500 transition-all duration-300"
                  >
                    <FaWhatsapp size={18} />
                  </a>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#A3B18A]" />
                  <span>SSL Secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-[#A3B18A]" />
                  <span>Made with Love</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="bg-gray-900 border-t border-gray-800">
          <div className="container mx-auto px-6 lg:px-12 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-4">
                <p>© {new Date().getFullYear()} COLORE Art & Crafts. All rights reserved.</p>
              </div>
              <div className="flex gap-6">
                <a href="/privacy-policy" className="hover:text-[#A3B18A] transition-colors">
                  Privacy Policy
                </a>
                <a href="/terms-of-service" className="hover:text-[#A3B18A] transition-colors">
                  Terms of Service
                </a>
                <a href="/sitemap" className="hover:text-[#A3B18A] transition-colors">
                  Sitemap
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}