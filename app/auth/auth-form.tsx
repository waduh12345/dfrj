"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CarouselAuth } from "@/components/ui/corousel-auth";

// import { useLoginMutation } from "@/services/auth.service";
// import { LoginResponse } from "@/types/user";

type AuthFormProps = {
  mode: "login" | "register";
};

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // const [login] = useLoginMutation();

  const isLogin = mode === "login";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (isLogin) {
      try {
        // Step 1: Panggil login dari RTK
        // const res: LoginResponse = await login({ email, password }).unwrap();
        // const token = res?.data?.token;

        // if (!token) {
        //   throw new Error("Token tidak ditemukan.");
        // }

        // Step 2: Paksa next-auth sinkronisasi token lewat signIn
        const signInRes = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });
        console.log("signIn result", signInRes);

        if (signInRes?.ok) {
          router.push("/");
        } else {
          setError("Gagal masuk. Email atau password salah.");
        }
      } catch (err: unknown) {
        console.error("Login error:", err);
        setError("Login gagal. Cek kembali email dan password.");
      } finally {
        setIsLoading(false);
      }
    } else {
      // Simulasi register
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        router.push("/");
      } catch {
        setError("Gagal mendaftar.");
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-5 bg-white text-black dark:bg-black dark:text-white">
      <div className="flex items-center justify-center px-6 py-12 col-span-2">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">
              {isLogin ? "Masuk ke Akun Anda" : "Buat Akun Baru"}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isLogin
                ? "Masukkan email dan password Anda"
                : "Lengkapi form di bawah ini untuk mendaftar"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-sm text-red-500 -mt-2">{error}</p>}

            <Button
              type="submit"
              className="w-full bg-[#A80038] hover:bg-[#8a002c] text-white"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : isLogin ? "Login" : "Daftar Sekarang"}
            </Button>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              {isLogin
                ? "Masuk menggunakan akun yang sudah dibuatkan oleh SuperAdmin"
                : "Setelah mendaftar, akun Anda akan aktif secara otomatis"}
            </p>
          </form>

          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
            <a
              href={isLogin ? "/auth/register" : "/auth/login"}
              className="text-[#A80038] font-medium hover:underline"
            >
              {isLogin ? "Daftar sekarang" : "Masuk"}
            </a>
          </div>
        </div>
      </div>

      <div className="hidden lg:block bg-neutral-200 dark:bg-neutral-900 relative col-span-3">
        <CarouselAuth />
      </div>
    </div>
  );
}