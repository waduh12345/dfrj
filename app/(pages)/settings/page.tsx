"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

// Lazy load CreateShopForm
const CreateShopForm = dynamic(() => import("@/components/create-shop-form"), {
  ssr: false,
});

export default function SettingsPage() {
  const { data: session } = useSession();
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const router = useRouter();

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

  const handleUpdatePassword = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
  };

  return (
    <div
      className={`p-6 max-w-7xl mx-auto grid gap-6 ${
        showCreateForm ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
      }`}
    >
      {/* Bagian Kiri: Settings */}
      <div className="bg-white rounded-lg shadow border p-6">
        <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

        {/* Profile */}
        <h2 className="text-lg font-semibold mb-4">My Profile</h2>
        <div className="flex flex-wrap justify-between items-center">
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
          <div className="my-4 flex flex-wrap gap-2">
            <Button
              onClick={() => router.push("/admin/product-category")}
              variant="outline"
            >
              Admin Settings
            </Button>
            <Button
              variant="default"
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              {showCreateForm ? "Tutup Form" : "Tambah Toko"}
            </Button>
          </div>
        </div>

        {/* Account Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Full Name
            </label>
            <Input value={session?.user?.name || ""} disabled />
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

      {/* Bagian Kanan: Create Shop Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow border p-6">
          <CreateShopForm
            defaultEmail={session?.user?.email || ""}
            onClose={() => setShowCreateForm(false)}
          />
        </div>
      )}
    </div>
  );
}
