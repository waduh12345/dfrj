"use client";

import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Shield,
  CheckCircle,
  AlertCircle,
  User,
  Phone,
  ArrowLeft,
  Heart, // Ikon tambahan untuk brand emotion
} from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useTranslation } from "@/hooks/use-translation";
import id from "@/translations/auth/id";
import en from "@/translations/auth/en";
import { useRegisterMutation } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { fredoka } from "@/lib/fonts";

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
  agreeToTerms: boolean;
}

type RegisterPayload = {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
};

// CONSTANTS BRAND COLORS
const THEME = {
  primary: "#d43893ff", // Brand Pink
  textMain: "#5B4A3B", // Cocoa Brown
};

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslation({ id, en });

  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false);

  const [loginData, setLoginData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState<RegisterFormData>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [registerMutation, { isLoading: isRegistering }] =
    useRegisterMutation();

  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // ===== Handlers
  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors([]);
    setSuccessMsg(null);

    const newErrors: string[] = [];
    if (!loginData.email) newErrors.push("Email wajib diisi");
    if (!loginData.password) newErrors.push("Password wajib diisi");
    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsLoggingIn(true);
      const res = await signIn("credentials", {
        redirect: false,
        email: loginData.email,
        password: loginData.password,
      });

      if (res?.ok) {
        setSuccessMsg("Selamat datang kembali! Mengarahkan...");
        router.push("/me");
      } else {
        setErrors(["Gagal masuk. Email atau password salah."]);
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrors(["Login gagal. Cek kembali email dan password."]);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors([]);
    setSuccessMsg(null);

    const newErrors: string[] = [];
    if (!registerData.fullName) newErrors.push("Nama lengkap wajib diisi");
    if (!registerData.email) newErrors.push("Email wajib diisi");
    if (!registerData.phone) newErrors.push("Nomor telepon wajib diisi");
    if (!registerData.password) newErrors.push("Password wajib diisi");
    if (registerData.password !== registerData.confirmPassword)
      newErrors.push("Konfirmasi password tidak sesuai");
    
    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload: RegisterPayload = {
      name: registerData.fullName,
      email: registerData.email,
      phone: registerData.phone,
      password: registerData.password,
      password_confirmation: registerData.confirmPassword,
    };

    try {
      await registerMutation(payload).unwrap();
      setSuccessMsg("Registrasi berhasil! Silakan masuk untuk mulai mendukung difabelpreneur.");
      setLoginData((p) => ({ ...p, email: registerData.email }));
      setIsLogin(true);
    } catch (err) {
      const msg =
        (err as { data?: { message?: string } }).data?.message ??
        "Registrasi gagal. Coba lagi.";
      setErrors([msg]);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowForgotPassword(false);
    setSuccessMsg("Jika email terdaftar, tautan reset akan dikirim.");
  };

  // ===== UI: Forgot Password Modal
  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-[#FFF0F5] to-[#d43893ff]/10 flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white rounded-[2rem] shadow-xl p-8 w-full max-w-md relative border border-gray-100">
          {/* Mobile Back Button for Modal */}
          <button
            onClick={() => setShowForgotPassword(false)}
            className="absolute top-4 left-4 p-2 text-gray-400 hover:bg-pink-50 hover:text-[#d43893ff] rounded-full transition-colors sm:hidden"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <div className="text-center mb-8 mt-4 sm:mt-0">
            <div className="w-20 h-20 bg-[#d43893ff]/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Lock className="w-8 h-8 text-[#d43893ff]" />
            </div>
            <h2 className={`text-2xl font-bold text-[#5B4A3B] mb-2 ${fredoka.className}`}>
              {t["fp-title"]}
            </h2>
            <p className="text-gray-500">{t["fp-subtitle"]}</p>
          </div>

          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#d43893ff] focus:border-transparent transition-all"
                  placeholder={t["fp-email-placeholder"]}
                  required
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="flex-1 py-4 border border-gray-200 text-gray-600 rounded-2xl font-bold hover:bg-gray-50 transition-colors"
              >
                {t["fb-cancel-btn"]}
              </button>
              <button
                type="submit"
                className="flex-1 bg-[#d43893ff] text-white py-4 rounded-2xl font-bold hover:bg-[#b02e7a] transition-colors shadow-lg shadow-pink-200"
              >
                {t["fb-send-btn"]}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#FFF0F5] to-[#d43893ff]/5 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* --- Mobile Specific Back Button --- */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => router.push("/")}
          className="rounded-full w-10 h-10 p-0 shadow-md bg-white/90 backdrop-blur text-gray-600 hover:text-[#d43893ff]"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      {/* Background Decorations (Soft Pink & Warm Tones) */}
      <div className="fixed top-20 left-10 w-32 h-32 bg-[#d43893ff] rounded-full opacity-5 animate-pulse -z-10 blur-3xl" />
      <div className="fixed bottom-32 right-16 w-40 h-40 bg-yellow-200 rounded-full opacity-10 animate-pulse delay-1000 -z-10 blur-3xl" />
      <div className="fixed top-1/2 left-1/4 w-24 h-24 bg-pink-300 rounded-full opacity-10 animate-pulse delay-500 -z-10 blur-2xl" />

      {/* Main Container */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[2.5rem] shadow-2xl shadow-pink-100/50 overflow-hidden my-4 lg:my-0 border border-gray-50">
        
        {/* Left Side (Branding Panel) */}
        <div className="bg-gradient-to-br from-[#d43893ff] to-[#b02e7a] p-8 lg:p-12 flex flex-col justify-center text-white relative overflow-hidden min-h-[220px] lg:min-h-[600px]">
          {/* Desktop Back Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/")}
            className={`hidden lg:flex text-[#d43893ff] cursor-pointer shadow-lg bg-white border-none hover:bg-gray-50 hover:text-[#b02e7a] transition-all absolute top-8 left-8 z-20 ${fredoka.className} font-bold rounded-xl`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t["back-button"]}
          </Button>

          {/* Pattern Overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px"}}></div>
          
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>

          <div className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Logo Placeholder - Disesuaikan */}
            <div className="flex justify-center items-center w-full lg:justify-start mb-6">
              <div className="w-full backdrop-blur-md rounded-2xl flex items-center justify-center overflow-hidden">
                <Image
                  src="/logo-difaraja.webp"
                  alt="Logo Difaraja"
                  width={320}
                  height={80}
                  className="object-contain w-full h-20"
                  priority
                />
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className={`mb-6 lg:mb-8 ${fredoka.className}`}>
              <h2 className="text-3xl lg:text-5xl font-bold mb-3 lg:mb-5 leading-tight text-white drop-shadow-sm">
                {isLogin ? "Selamat Datang" : "Bergabunglah"}
                <br/>
                <span className="text-pink-100">di Difaraja</span>
              </h2>
              <p className="text-white/90 text-sm lg:text-lg font-medium leading-relaxed max-w-md">
                {isLogin
                  ? "Masuk untuk mengakses koleksi kuliner dan kriya terbaik dari difabelpreneur."
                  : "Daftar sekarang dan jadilah bagian dari ekosistem pemberdayaan difabelpreneur."}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side (Form Panel) */}
        <div className="p-6 sm:p-8 lg:p-12 h-full flex flex-col justify-center bg-white relative">
          <div className="w-full max-w-md mx-auto relative z-10">
            <div className="text-center mb-8 lg:mb-10">
              <div className="inline-flex items-center gap-2 bg-[#d43893ff]/10 px-4 py-1.5 rounded-full mb-4 border border-[#d43893ff]/20">
                <Heart className="w-4 h-4 text-[#d43893ff] fill-[#d43893ff]" />
                <span className="text-xs font-bold text-[#d43893ff] uppercase tracking-wide">
                  {isLogin ? "Akses Akun" : "Buat Akun Baru"}
                </span>
              </div>
              <h3 className={`text-2xl lg:text-3xl font-bold text-[#5B4A3B] mb-2 ${fredoka.className}`}>
                {isLogin ? t["right-login-title"] : t["right-register-title"]}
              </h3>
              <p className="text-gray-500 text-sm lg:text-base">
                {isLogin
                  ? t["right-login-subtitle"]
                  : t["right-register-subtitle"]}
              </p>
            </div>

            {/* Messages */}
            {errors.length > 0 && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl animate-in fade-in slide-in-from-top-2">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-red-700 mb-1 text-sm">
                      Perhatian:
                    </h4>
                    <ul className="text-sm text-red-600 space-y-1">
                      {errors.map((error) => (
                        <li key={error}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {successMsg && (
              <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-2xl text-green-700 animate-in fade-in slide-in-from-top-2 font-medium">
                <CheckCircle className="w-5 h-5 inline mr-2 text-green-500" />
                {successMsg}
              </div>
            )}

            {/* Forms */}
            {isLogin ? (
              // --- LOGIN FORM ---
              <form
                onSubmit={handleLoginSubmit}
                className="space-y-5 lg:space-y-6"
              >
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#d43893ff] transition-colors" />
                    <input
                      type="email"
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#d43893ff] focus:border-transparent transition-all placeholder:text-gray-400"
                      placeholder="nama@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#d43893ff] transition-colors" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#d43893ff] focus:border-transparent transition-all placeholder:text-gray-400"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#d43893ff] p-1 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-[#d43893ff] border-gray-300 rounded focus:ring-[#d43893ff] cursor-pointer"
                    />
                    <span className="ml-2 text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                      {t["remember-me"]}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-[#d43893ff] font-bold hover:text-[#b02e7a] hover:underline transition-colors"
                  >
                    {t["forgot-password"]}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full bg-[#d43893ff] text-white py-4 rounded-2xl font-bold hover:bg-[#b02e7a] transition-all shadow-lg shadow-pink-200 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isLoggingIn ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      {t["login-cta"]}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              // --- REGISTER FORM ---
              <form
                onSubmit={handleRegisterSubmit}
                className="space-y-4 lg:space-y-5"
              >
                <div className="md:max-h-[32vh] md:overflow-y-auto custom-scrollbar pr-1">
                  <div className="mb-4">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Nama Lengkap
                    </label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#d43893ff] transition-colors" />
                      <input
                        type="text"
                        value={registerData.fullName}
                        onChange={(e) =>
                          setRegisterData((prev) => ({
                            ...prev,
                            fullName: e.target.value,
                          }))
                        }
                        className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#d43893ff] focus:border-transparent transition-all"
                        placeholder="Nama sesuai identitas"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#d43893ff] transition-colors" />
                      <input
                        type="email"
                        value={registerData.email}
                        onChange={(e) =>
                          setRegisterData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#d43893ff] focus:border-transparent transition-all"
                        placeholder="nama@email.com"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Nomor Telepon
                    </label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#d43893ff] transition-colors" />
                      <input
                        type="tel"
                        value={registerData.phone}
                        onChange={(e) =>
                          setRegisterData((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#d43893ff] focus:border-transparent transition-all"
                        placeholder="08xxxxxxxxxx"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#d43893ff] transition-colors" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={registerData.password}
                        onChange={(e) =>
                          setRegisterData((prev) => ({
                            ...prev,
                            password: e.target.value,
                          }))
                        }
                        className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#d43893ff] focus:border-transparent transition-all"
                        placeholder="Min. 8 karakter"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#d43893ff] p-1 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Konfirmasi Password
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#d43893ff] transition-colors" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={registerData.confirmPassword}
                        onChange={(e) =>
                          setRegisterData((prev) => ({
                            ...prev,
                            confirmPassword: e.target.value,
                          }))
                        }
                        className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#d43893ff] focus:border-transparent transition-all"
                        placeholder="Ketik ulang password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#d43893ff] p-1 transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isRegistering}
                  className="w-full bg-[#d43893ff] text-white py-4 rounded-2xl font-bold hover:bg-[#b02e7a] transition-all shadow-lg shadow-pink-200 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 mt-4"
                >
                  {isRegistering ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      {t["register-cta"]}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="mt-8 text-center">
              <p className="text-gray-600 text-sm lg:text-base">
                {isLogin ? t["not-have-account"] : t["have-account"]}{" "}
                <button
                  onClick={() => {
                    setIsLogin((v) => !v);
                    setErrors([]);
                    setSuccessMsg(null);
                  }}
                  className="text-[#d43893ff] font-bold hover:text-[#b02e7a] hover:underline ml-1 transition-colors"
                >
                  {isLogin ? t["regsiter-here"] : t["login-here"]}
                </button>
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-center gap-6 text-xs lg:text-sm text-gray-400">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-[#d43893ff]" />
                  <span>Jaminan Keamanan</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-[#d43893ff]" />
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