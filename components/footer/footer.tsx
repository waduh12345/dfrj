"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "@/hooks/use-translation";
import id from "@/translations/footer/id";
import en from "@/translations/footer/en";
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
  Send,
} from "lucide-react";
import {
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa";
import Image from "next/image";

export default function Footer() {
  const router = useRouter();
  const t = useTranslation({ id, en });
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [email, setEmail] = useState("");

  const goTofaqPage = () => {
    router.push("/faq");
  };

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
  ];

  const quickLinks = [
    { name: t["col-2-b"], href: "/" },
    { name: t["col-2-c"], href: "/about" },
    { name: t["col-2-d"], href: "/product" },
    { name: t["col-2-e"], href: "/gallery" },
    { name: t["col-2-f"], href: "/news" },
    { name: t["col-2-g"], href: "/how-to-order" },
  ];

  const productCategories = [
    { name: "Art Supplies", href: "/product?category=art-supplies" },
    { name: "Craft Kits", href: "/product?category=craft-kits" },
    { name: "Educational Toys", href: "/product?category=educational-toys" },
    { name: "Workshop Kits", href: "/product?category=workshop-kits" },
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Newsletter subscription:", email);
    setEmail("");
    // You can add actual subscription logic here
  };

  return (
    <footer className="bg-[#A3B18A] text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full shadow-2xl"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full shadow-2xl"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full shadow-xl"></div>
        <div className="absolute bottom-10 left-1/4 w-20 h-20 bg-gradient-to-br from-lime-500 to-green-500 rounded-full shadow-xl"></div>
      </div>

      <div className="relative z-10 bg-black/50">
        {/* Main Footer Content */}
        <div className="pt-16 pb-8 px-6 lg:px-12">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              {/* Company Info */}
              <div className="lg:col-span-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl">
                    <Image
                      src="/favicon.ico"
                      alt="Logo"
                      width={48}
                      height={48}
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">COLORE</h3>
                    <p className="text-sm text-white">Art & Crafts</p>
                  </div>
                </div>

                <p className="text-white leading-relaxed mb-6">
                  {t["col-1-a"]}
                </p>

                {/* Values */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Leaf className="w-4 h-4 text-white" />
                    <span>{t["col-1-b"]}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-white" />
                    <span>{t["col-1-c"]}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="w-4 h-4 text-white" />
                    <span>{t["col-1-d"]}</span>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-white flex-shrink-0" />
                    <span>
                      Jl. Kreativitas No. 123, Jakarta Selatan, Indonesia
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-white flex-shrink-0" />
                    <span>+62 21 7890 1234</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-white flex-shrink-0" />
                    <span>hello@colore.co.id</span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-lg font-semibold mb-6 text-white">
                  {t["col-2-a"]}
                </h4>
                <ul className="space-y-3">
                  {quickLinks.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className="text-white hover:text-gray-100 transition-colors flex items-center group"
                      >
                        <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity text-white" />
                        <span className="group-hover:translate-x-1 transition-transform">
                          {link.name}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Product Categories */}
              <div>
                <h4 className="text-lg font-semibold mb-6 text-white">
                  {t["col-3-a"]}
                </h4>
                <ul className="space-y-3">
                  {productCategories.map((category, index) => (
                    <li key={index}>
                      <a
                        href={category.href}
                        className="text-white hover:text-gray-100 transition-colors flex items-center group"
                      >
                        <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity text-white" />
                        <span className="group-hover:translate-x-1 transition-transform">
                          {category.name}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>

                {/* Newsletter */}
                <div className="mt-8">
                  <h4 className="text-lg font-semibold mb-4 text-white">
                    Newsletter
                  </h4>
                  <p className="text-white text-sm mb-4">{t["col-3-b"]}</p>
                  <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t["col-3-c"]}
                        className="w-full bg-white/10 border border-white/30 rounded-2xl px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-white text-[#A3B18A] py-3 rounded-2xl font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      {t["col-3-d"]}
                    </button>
                  </form>
                </div>
              </div>

              {/* FAQ */}
              <div>
                <h4 className="text-lg font-semibold mb-6 text-white">FAQ</h4>
                <div className="space-y-4 mb-4">
                  {faqs.map((faq, i) => (
                    <div
                      key={i}
                      className="bg-white/10 rounded-2xl overflow-hidden"
                    >
                      <button
                        className="w-full flex justify-between items-center text-left p-4 text-white hover:bg-white/20 transition-colors"
                        onClick={() =>
                          setActiveIndex(activeIndex === i ? null : i)
                        }
                      >
                        <span className="font-medium text-sm pr-2">
                          {faq.question}
                        </span>
                        <div className="flex-shrink-0">
                          {activeIndex === i ? (
                            <ChevronUp className="w-4 h-4 text-white" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-white" />
                          )}
                        </div>
                      </button>
                      {activeIndex === i && (
                        <div className="px-4 pb-4">
                          <p className="text-sm text-white leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}

                  <button
                    onClick={goTofaqPage}
                    type="button"
                    className="w-full bg-white text-[#A3B18A] py-3 rounded-2xl font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                  >
                    {t["col-4-a"]}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media & Bottom Bar */}
        <div className="border-t border-white/20 bg-white/10 backdrop-blur-sm">
          <div className="container mx-auto px-6 lg:px-12 py-6">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
              {/* Social Media */}
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <p className="text-white text-sm">{t["bottom-1"]}:</p>
                <div className="flex gap-4">
                  <a className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500">
                    <FaInstagram size={18} />
                  </a>
                  <a className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-blue-600">
                    <FaFacebookF size={18} />
                  </a>
                  <a className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-red-600">
                    <FaYoutube size={18} />
                  </a>
                  <a className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-black">
                    <FaTiktok size={18} />
                  </a>
                  <a className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-green-500">
                    <FaWhatsapp size={18} />
                  </a>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-6 text-sm text-white">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-white" />
                  <span>SSL Secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-white" />
                  <span>Made with Love</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="bg-white border-t border-white/20">
          <div className="container mx-auto px-6 lg:px-12 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-black/50">
              <div className="flex items-center gap-4">
                <p>
                  © {new Date().getFullYear()} COLORE Art & Crafts. All rights
                  reserved.
                </p>
              </div>
              <div className="flex gap-6">
                <a
                  href="/privacy-policy"
                  className="hover:text-gray-100 transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="/terms-of-service"
                  className="hover:text-gray-100 transition-colors"
                >
                  Terms of Service
                </a>
                <a
                  href="/sitemap"
                  className="hover:text-gray-100 transition-colors"
                >
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
