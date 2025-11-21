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
  Heart,
  Leaf,
  CheckCircle,
  AlertCircle,
  User,
  Phone,
  ArrowLeft,
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
        setSuccessMsg("Berhasil masuk. Mengarahkan…");
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
    if (!registerData.agreeToTerms)
      newErrors.push("Anda harus menyetujui syarat dan ketentuan");

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
      setSuccessMsg("Registrasi berhasil! Silakan masuk.");
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
      <div className="min-h-screen bg-gradient-to-br from-[#DFF19D]/20 via-[#BFF0F5]/20 to-[#F6CCD0]/20 flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-md relative">
          {/* Mobile Back Button for Modal */}
          <button
            onClick={() => setShowForgotPassword(false)}
            className="absolute top-4 left-4 p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors sm:hidden"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <div className="text-center mb-8 mt-4 sm:mt-0">
            <div className="w-16 h-16 bg-[#A3B18A] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t["fp-title"]}
            </h2>
            <p className="text-gray-600">{t["fp-subtitle"]}</p>
          </div>

          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A3B18A] focus:border-transparent"
                  placeholder={t["fp-email-placeholder"]}
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
                {t["fb-cancel-btn"]}
              </button>
              <button
                type="submit"
                className="flex-1 bg-[#A3B18A] text-white py-4 rounded-2xl font-semibold hover:bg-[#A3B18A]/90 transition-colors"
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
    <div className="min-h-screen bg-gradient-to-br from-[#DFF19D]/20 via-[#BFF0F5]/20 to-[#F6CCD0]/20 flex items-center justify-center p-4 sm:p-6 relative">
      
      {/* --- Mobile Specific Back Button (Fixed at top-left of screen) --- */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => router.push("/")}
          className="rounded-full w-10 h-10 p-0 shadow-md bg-white/90 backdrop-blur text-gray-700 hover:bg-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      {/* Background Decorations */}
      <div className="fixed top-20 left-10 w-20 h-20 bg-[#F6CCD0] rounded-full opacity-60 animate-pulse -z-10" />
      <div className="fixed bottom-32 right-16 w-16 h-16 bg-[#BFF0F5] rounded-full opacity-60 animate-pulse delay-1000 -z-10" />
      <div className="fixed top-1/2 left-1/4 w-12 h-12 bg-[#DFF19D] rounded-full opacity-40 animate-pulse delay-500 -z-10" />

      {/* Main Container */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[2rem] shadow-2xl overflow-hidden my-4 lg:my-0">
        
        {/* Left Side (Branding Panel) */}
        <div className="bg-gradient-to-br from-[#A3B18A] to-[#DFF19D] p-8 lg:p-12 flex flex-col justify-center text-white relative overflow-hidden min-h-[200px] lg:min-h-[600px]">
          
          {/* Desktop Back Button (Absolute on card) */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/")}
            className={`hidden lg:flex text-[#A3B18A] cursor-pointer shadow-lg bg-white border-[#A3B18A]/20 hover:bg-gray-50 hover:text-[#8FA078] transition-all absolute top-8 left-8 z-20 ${fredoka.className}`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t["back-button"]}
          </Button>

          {/* Background Patterns */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full" />
            <div className="absolute bottom-20 left-10 w-24 h-24 bg-white rounded-full" />
            <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white rounded-full" />
          </div>

          <div className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Logo */}
            <div className="flex justify-center items-center mb-8 w-full">
              <div className="bg-white/20 p-3 rounded-3xl backdrop-blur-sm flex justify-center items-center">
                <Image
                  src="/logo-colore.png"
                  alt="Colore Logo"
                  width={96}
                  height={96}
                  className="w-24 h-24 lg:w-32 lg:h-32 object-contain"
                />
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className={`mb-6 lg:mb-8 ${fredoka.className}`}>
              <h2 className="text-2xl lg:text-4xl font-bold mb-2 lg:mb-4 leading-tight">
                {isLogin ? t["left-login-title"] : t["left-register-title"]}
              </h2>
              <p className="text-white/90 text-sm lg:text-lg">
                {isLogin
                  ? t["left-login-subtitle"]
                  : t["left-register-subtitle"]}
              </p>
            </div>

            {/* Feature List (Hidden on Mobile to save space) */}
            <div className={`hidden lg:flex flex-col space-y-4 ${fredoka.className}`}>
              <div className="flex items-center gap-3">
                <Leaf className="w-6 h-6 text-white/90" />
                <span className="text-white/90">{t["left-item-1"]}</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-white/90" />
                <span className="text-white/90">{t["left-item-2"]}</span>
              </div>
              <div className="flex items-center gap-3">
                <Heart className="w-6 h-6 text-white/90" />
                <span className="text-white/90">{t["left-item-3"]}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side (Form Panel) */}
        <div className="p-6 sm:p-8 lg:p-12 h-full flex flex-col justify-center bg-white">
          <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-6 lg:mb-8">
              <div className="inline-flex items-center gap-2 bg-[#A3B18A]/10 px-4 py-2 rounded-full mb-4">
                <Sparkles className="w-4 h-4 text-[#A3B18A]" />
                <span className="text-sm font-medium text-[#A3B18A]">
                  {isLogin ? t["right-login-badge"] : t["right-register-badge"]}
                </span>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                {isLogin ? t["right-login-title"] : t["right-register-title"]}
              </h3>
              <p className="text-gray-600 text-sm lg:text-base">
                {isLogin
                  ? t["right-login-subtitle"]
                  : t["right-register-subtitle"]}
              </p>
            </div>

            {/* Messages */}
            {errors.length > 0 && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl animate-in fade-in slide-in-from-top-2">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-800 mb-1">
                      Terjadi Kesalahan:
                    </h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      {errors.map((error) => (
                        <li key={error}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {successMsg && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 animate-in fade-in slide-in-from-top-2">
                <CheckCircle className="w-5 h-5 inline mr-2" />
                {successMsg}
              </div>
            )}

            {/* Forms */}
            {isLogin ? (
              // --- LOGIN FORM ---
              <form onSubmit={handleLoginSubmit} className="space-y-5 lg:space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="w-full pl-12 pr-4 py-3.5 lg:py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A3B18A] focus:border-transparent transition-all"
                      placeholder="nama@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      className="w-full pl-12 pr-12 py-3.5 lg:py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A3B18A] focus:border-transparent transition-all"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
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
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-[#A3B18A] border-gray-300 rounded focus:ring-[#A3B18A]"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      {t["remember-me"]}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-[#A3B18A] font-medium hover:underline"
                  >
                    {t["forgot-password"]}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full bg-[#A3B18A] text-white py-3.5 lg:py-4 rounded-2xl font-semibold hover:bg-[#A3B18A]/90 transition-all shadow-lg shadow-[#A3B18A]/20 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
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
              <form onSubmit={handleRegisterSubmit} className="space-y-4 lg:space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={registerData.fullName}
                      onChange={(e) =>
                        setRegisterData((prev) => ({
                          ...prev,
                          fullName: e.target.value,
                        }))
                      }
                      className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A3B18A] focus:border-transparent"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={registerData.email}
                      onChange={(e) =>
                        setRegisterData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A3B18A] focus:border-transparent"
                      placeholder="nama@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                    Nomor Telepon
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={registerData.phone}
                      onChange={(e) =>
                        setRegisterData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A3B18A] focus:border-transparent"
                      placeholder="+62 812 3456 7890"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={registerData.password}
                      onChange={(e) =>
                        setRegisterData((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      className="w-full pl-12 pr-12 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A3B18A] focus:border-transparent"
                      placeholder="Min. 8 karakter"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                    Konfirmasi Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={registerData.confirmPassword}
                      onChange={(e) =>
                        setRegisterData((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      className="w-full pl-12 pr-12 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A3B18A] focus:border-transparent"
                      placeholder="Ulangi password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-start pt-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={registerData.agreeToTerms}
                    onChange={(e) =>
                      setRegisterData((prev) => ({
                        ...prev,
                        agreeToTerms: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-[#A3B18A] border-gray-300 rounded focus:ring-[#A3B18A] mt-1 cursor-pointer"
                  />
                  <label htmlFor="terms" className="ml-3 text-sm text-gray-600 cursor-pointer">
                    {t["terms-1"]}{" "}
                    <a href="/terms" className="text-[#A3B18A] hover:underline font-medium">
                      {t["terms-2"]}
                    </a>{" "}
                    {t["terms-3"]}{" "}
                    <a
                      href="/privacy"
                      className="text-[#A3B18A] hover:underline font-medium"
                    >
                      {t["terms-4"]}
                    </a>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isRegistering}
                  className="w-full bg-[#A3B18A] text-white py-3.5 lg:py-4 rounded-2xl font-semibold hover:bg-[#A3B18A]/90 transition-all shadow-lg shadow-[#A3B18A]/20 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
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
                  className="text-[#A3B18A] font-bold hover:underline ml-1"
                >
                  {isLogin ? t["regsiter-here"] : t["login-here"]}
                </button>
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-center gap-6 text-xs lg:text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-[#A3B18A]" />
                  <span>SSL Secure</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-[#A3B18A]" />
                  <span>{t["data-save"]}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}