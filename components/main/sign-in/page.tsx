"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  ArrowRight,
  Sparkles,
  Shield,
  Heart,
  Leaf,
  Star,
  CheckCircle,
  AlertCircle,
  User,
  Phone,
  Calendar,
  ArrowLeft
} from "lucide-react";
import { FaGoogle, FaFacebookF, FaApple } from "react-icons/fa";

interface LoginFormData {
  email: string;
  password: string;
}

interface RegisterFormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  birthDate: string;
  agreeToTerms: boolean;
}

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  const [loginData, setLoginData] = useState<LoginFormData>({
    email: "",
    password: ""
  });

  const [registerData, setRegisterData] = useState<RegisterFormData>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    birthDate: "",
    agreeToTerms: false
  });

  const [forgotEmail, setForgotEmail] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]);

    // Basic validation
    const newErrors: string[] = [];
    if (!loginData.email) newErrors.push("Email wajib diisi");
    if (!loginData.password) newErrors.push("Password wajib diisi");
    
    if (newErrors.length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Handle successful login
      console.log("Login successful", loginData);
    }, 2000);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]);

    // Basic validation
    const newErrors: string[] = [];
    if (!registerData.fullName) newErrors.push("Nama lengkap wajib diisi");
    if (!registerData.email) newErrors.push("Email wajib diisi");
    if (!registerData.phone) newErrors.push("Nomor telepon wajib diisi");
    if (!registerData.password) newErrors.push("Password wajib diisi");
    if (registerData.password !== registerData.confirmPassword) newErrors.push("Konfirmasi password tidak sesuai");
    if (!registerData.agreeToTerms) newErrors.push("Anda harus menyetujui syarat dan ketentuan");
    
    if (newErrors.length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Handle successful registration
      console.log("Registration successful", registerData);
    }, 2000);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setShowForgotPassword(false);
      alert("Link reset password telah dikirim ke email Anda!");
    }, 2000);
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Social login with ${provider}`);
    // Handle social login
  };

  // Forgot Password Modal
  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#DFF19D]/20 via-[#BFF0F5]/20 to-[#F6CCD0]/20 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#A3B18A] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Lupa Password?</h2>
            <p className="text-gray-600">
              Masukkan email Anda dan kami akan mengirimkan link untuk reset password
            </p>
          </div>

          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A3B18A] focus:border-transparent"
                  placeholder="Masukkan email Anda"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="flex-1 py-4 border border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-[#A3B18A] text-white py-4 rounded-2xl font-semibold hover:bg-[#A3B18A]/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Kirim Link"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#DFF19D]/20 via-[#BFF0F5]/20 to-[#F6CCD0]/20 flex items-center justify-center p-6 mt-12">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-[#F6CCD0] rounded-full opacity-60 animate-pulse"></div>
      <div className="absolute bottom-32 right-16 w-16 h-16 bg-[#BFF0F5] rounded-full opacity-60 animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-[#DFF19D] rounded-full opacity-40 animate-pulse delay-500"></div>

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Left Side - Branding */}
        <div className="bg-gradient-to-br from-[#A3B18A] to-[#DFF19D] p-8 lg:p-12 flex flex-col justify-center text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full"></div>
            <div className="absolute bottom-20 left-10 w-24 h-24 bg-white rounded-full"></div>
            <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white rounded-full"></div>
          </div>

          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
                <span className="text-[#A3B18A] font-bold text-xl">C</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">COLORE</h1>
                <p className="text-white/90 text-sm">Art & Crafts</p>
              </div>
            </div>

            {/* Welcome Message */}
            <div className="mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                {isLogin ? "Selamat Datang Kembali!" : "Bergabung dengan COLORE"}
              </h2>
              <p className="text-white/90 text-lg">
                {isLogin 
                  ? "Masuk untuk melanjutkan perjalanan kreatif anak Anda dengan produk ramah lingkungan terbaik."
                  : "Daftar sekarang dan berikan yang terbaik untuk kreativitas si kecil dengan produk ramah lingkungan."
                }
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Leaf className="w-6 h-6 text-white/90" />
                <span className="text-white/90">100% Ramah Lingkungan</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-white/90" />
                <span className="text-white/90">Aman untuk Anak</span>
              </div>
              <div className="flex items-center gap-3">
                <Heart className="w-6 h-6 text-white/90" />
                <span className="text-white/90">Mengembangkan Kreativitas</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/20">
              <div className="text-center">
                <div className="text-2xl font-bold">5000+</div>
                <div className="text-white/80 text-sm">Keluarga Puas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">50+</div>
                <div className="text-white/80 text-sm">Produk Kreatif</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">4.9</div>
                <div className="text-white/80 text-sm">Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-8 lg:p-12">
          <div className="max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-[#A3B18A]/10 px-4 py-2 rounded-full mb-4">
                <Sparkles className="w-4 h-4 text-[#A3B18A]" />
                <span className="text-sm font-medium text-[#A3B18A]">
                  {isLogin ? "Masuk Akun" : "Daftar Baru"}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {isLogin ? "Masuk ke Akun Anda" : "Buat Akun Baru"}
              </h3>
              <p className="text-gray-600">
                {isLogin 
                  ? "Masukkan email dan password untuk melanjutkan"
                  : "Lengkapi data di bawah untuk membuat akun"
                }
              </p>
            </div>

            {/* Error Messages */}
            {errors.length > 0 && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-800 mb-1">Terjadi Kesalahan:</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      {errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Login Form */}
            {isLogin ? (
              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A3B18A] focus:border-transparent"
                      placeholder="nama@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A3B18A] focus:border-transparent"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input type="checkbox" className="w-4 h-4 text-[#A3B18A] border-gray-300 rounded focus:ring-[#A3B18A]" />
                    <span className="ml-2 text-sm text-gray-600">Ingat saya</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-[#A3B18A] hover:underline"
                  >
                    Lupa password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#A3B18A] text-white py-4 rounded-2xl font-semibold hover:bg-[#A3B18A]/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      Masuk
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Register Form */
              <form onSubmit={handleRegisterSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={registerData.fullName}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, fullName: e.target.value }))}
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A3B18A] focus:border-transparent"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A3B18A] focus:border-transparent"
                      placeholder="nama@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Nomor Telepon
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={registerData.phone}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A3B18A] focus:border-transparent"
                      placeholder="+62 812 3456 7890"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={registerData.password}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A3B18A] focus:border-transparent"
                      placeholder="Minimal 8 karakter"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Konfirmasi Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A3B18A] focus:border-transparent"
                      placeholder="Ulangi password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={registerData.agreeToTerms}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
                    className="w-4 h-4 text-[#A3B18A] border-gray-300 rounded focus:ring-[#A3B18A] mt-1"
                  />
                  <label htmlFor="terms" className="ml-3 text-sm text-gray-600">
                    Saya setuju dengan{" "}
                    <a href="/terms" className="text-[#A3B18A] hover:underline">
                      Syarat & Ketentuan
                    </a>{" "}
                    dan{" "}
                    <a href="/privacy" className="text-[#A3B18A] hover:underline">
                      Kebijakan Privasi
                    </a>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#A3B18A] text-white py-4 rounded-2xl font-semibold hover:bg-[#A3B18A]/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      Daftar Sekarang
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Switch Form */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setErrors([]);
                  }}
                  className="text-[#A3B18A] font-semibold hover:underline"
                >
                  {isLogin ? "Daftar di sini" : "Masuk di sini"}
                </button>
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-[#A3B18A]" />
                  <span>SSL Secure</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-[#A3B18A]" />
                  <span>Data Terlindungi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}