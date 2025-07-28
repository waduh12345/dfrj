"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import Image from "next/image";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [firstName, setFirstName] = useState("Brian"); // dummy default
  const [lastName, setLastName] = useState("Frederin"); // dummy default
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async () => {
    if (!newPassword)
      return Swal.fire("Error", "Password tidak boleh kosong", "error");

    setLoading(true);
    try {
      const res = await fetch("/api/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session?.user?.email, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        Swal.fire("Berhasil", "Password berhasil diperbarui", "success");
        setNewPassword("");
      } else {
        Swal.fire(
          "Gagal",
          data.message || "Gagal memperbarui password",
          "error"
        );
      }
    } catch (error) {
      Swal.fire("Gagal", "Terjadi kesalahan server", "error");
      console.error(error);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Yakin ingin logout?",
      text: "Anda akan keluar dari akun Anda.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Ya, Logout",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      await signOut({ callbackUrl: "/auth/login" });
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

      <div className="bg-white rounded-lg shadow border p-6">
        {/* Profile Info */}
        <h2 className="text-lg font-semibold mb-4">My Profile</h2>

        <div className="flex items-center gap-4 mb-6">
          <Image
            src={session?.user?.image || "/images/profile-icon.jpeg"}
            alt="Profile"
            width={80}
            height={80}
            className="w-40 h-40 rounded-full object-cover"
          />
          <div>
            <Button variant="outline" className="mr-2">
              Change Image
            </Button>
            <Button variant="ghost">Remove Image</Button>
            <p className="text-sm text-muted-foreground mt-1">
              We support PNGs, JPEGs and GIFs under 2MB
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              First Name
            </label>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Last Name
            </label>
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        {/* Security */}
        <h2 className="text-lg font-semibold mb-4">Account Security</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mb-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Email
            </label>
            <Input value={session?.user?.email || ""} disabled />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mb-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              New Password
            </label>
            <Input
              type="password"
              placeholder="Masukkan password baru"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="mt-6">
            <Button onClick={handleUpdatePassword} disabled={loading}>
              {loading ? "Updating..." : "Change Password"}
            </Button>
          </div>
        </div>

        {/* Logout */}
        <div className="border-t pt-6 mt-6 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Log out of your account
          </p>
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
