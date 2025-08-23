"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  User as UserIcon,
  MapPin,
  Package,
  BarChart3,
  LogOut,
  Edit3,
  Save,
  Plus,
  Trash2,
  Eye,
  Star,
  Calendar,
  Phone,
  Mail,
  CheckCircle,
  Gift,
  Camera,
  CreditCard,
  Truck,
  Download,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useLogoutMutation } from "@/services/auth.service"; // pastikan path sesuai
import Swal from "sweetalert2";

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  birthDate: string;
  avatar: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
}

interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault: boolean;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  items: {
    id: string;
    name: string;
    image: string;
    quantity: number;
    price: number;
  }[];
  trackingNumber?: string;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [logoutReq, { isLoading: isLoggingOut }] = useLogoutMutation();

  const [activeTab, setActiveTab] = useState<
    "dashboard" | "profile" | "addresses" | "orders"
  >("dashboard");
  const [isEditing, setIsEditing] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);

  // Ambil name & email dari session
  const sessionName = useMemo(() => session?.user?.name ?? "User", [session]);
  const sessionEmail = useMemo(
    () => session?.user?.email ?? "user@email.com",
    [session]
  );

  // Mock user data (tetap ada untuk elemen lain), tapi fullName & email disinkronkan dari session
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id:
      (session?.user as { id?: number } | undefined)?.id?.toString?.() ??
      "user-id",
    fullName: sessionName,
    email: sessionEmail,
    phone: "+62 812 3456 7890",
    birthDate: "1990-05-15",
    avatar: "/api/placeholder/150/150",
    joinDate: "2023-06-15",
    totalOrders: 12,
    totalSpent: 1_450_000,
    loyaltyPoints: 2500,
  });

  // Sinkronkan ketika session berubah
  useEffect(() => {
    setUserProfile((prev) => ({
      ...prev,
      id:
        (session?.user as { id?: number } | undefined)?.id?.toString?.() ??
        prev.id,
      fullName: sessionName,
      email: sessionEmail,
    }));
  }, [sessionName, sessionEmail, session]);

  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "addr1",
      label: "Rumah",
      fullName: sessionName,
      phone: "+62 812 3456 7890",
      address: "Jl. Kemanggisan Raya No. 123, RT/RW 05/02",
      city: "Jakarta Barat",
      province: "DKI Jakarta",
      postalCode: "11480",
      isDefault: true,
    },
    {
      id: "addr2",
      label: "Kantor",
      fullName: sessionName,
      phone: "+62 812 3456 7890",
      address: "Jl. Sudirman No. 456, Lantai 10",
      city: "Jakarta Pusat",
      province: "DKI Jakarta",
      postalCode: "10220",
      isDefault: false,
    },
  ]);

  const [orders] = useState<Order[]>([
    {
      id: "order1",
      orderNumber: "COL240001",
      date: "2024-03-15",
      status: "delivered",
      total: 298_000,
      items: [
        {
          id: "item1",
          name: "Eco Paint Set Premium",
          image: "/api/placeholder/80/80",
          quantity: 2,
          price: 149_000,
        },
      ],
      trackingNumber: "JNE123456789",
    },
    {
      id: "order2",
      orderNumber: "COL240002",
      date: "2024-03-20",
      status: "shipped",
      total: 178_000,
      items: [
        {
          id: "item2",
          name: "Nature Craft Kit",
          image: "/api/placeholder/80/80",
          quantity: 1,
          price: 89_000,
        },
        {
          id: "item3",
          name: "Creative Clay Set",
          image: "/api/placeholder/80/80",
          quantity: 1,
          price: 89_000,
        },
      ],
      trackingNumber: "JNE987654321",
    },
    {
      id: "order3",
      orderNumber: "COL240003",
      date: "2024-03-25",
      status: "processing",
      total: 149_000,
      items: [
        {
          id: "item4",
          name: "Rainbow Crayon Pack",
          image: "/api/placeholder/80/80",
          quantity: 1,
          price: 65_000,
        },
      ],
    },
  ]);

  const tabs = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <BarChart3 className="w-5 h-5" />,
    },
    { id: "profile", label: "Profile", icon: <UserIcon className="w-5 h-5" /> },
    { id: "addresses", label: "Alamat", icon: <MapPin className="w-5 h-5" /> },
    { id: "orders", label: "Pesanan", icon: <Package className="w-5 h-5" /> },
  ] as const;

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "delivered":
        return "text-green-600 bg-green-50";
      case "shipped":
        return "text-blue-600 bg-blue-50";
      case "processing":
        return "text-yellow-600 bg-yellow-50";
      case "pending":
        return "text-orange-600 bg-orange-50";
      case "cancelled":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "delivered":
        return "Diterima";
      case "shipped":
        return "Dikirim";
      case "processing":
        return "Diproses";
      case "pending":
        return "Menunggu";
      case "cancelled":
        return "Dibatalkan";
      default:
        return status;
    }
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Konfirmasi Logout",
      text: "Apakah Anda yakin ingin keluar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Keluar",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      // 1) Logout ke backend
      await logoutReq().unwrap();
      await Swal.fire("Berhasil!", "Anda telah keluar.", "success");
    } catch (e) {
      console.error("Logout API error:", e);
      await Swal.fire("Gagal!", "Terjadi kesalahan saat logout.", "error");
    } finally {
      // 2) Hapus sesi NextAuth & redirect
      await signOut({ callbackUrl: "/login" });
    }
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    // Di sini bisa integrasi update profile ke API jika dibutuhkan
    // console.log("Profile saved:", userProfile);
  };

  const handleDeleteAddress = (addressId: string) => {
    const ok = confirm("Apakah Anda yakin ingin menghapus alamat ini?");
    if (!ok) return;
    setAddresses((prev) => prev.filter((addr) => addr.id !== addressId));
  };

  const setDefaultAddress = (addressId: string) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === addressId,
      }))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#DFF19D]/10 pt-24">
      <div className="container mx-auto px-6 lg:px-12 pb-12">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-[#A3B18A]/10 px-4 py-2 rounded-full mb-4">
              <span className="text-sm font-medium text-[#A3B18A]">
                Profil Pengguna
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Selamat Datang,{" "}
              <span className="text-[#A3B18A]">
                {userProfile.fullName.split(" ")[0]}
              </span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Kelola profil, alamat, dan pesanan Anda dengan mudah
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              {/* User Info */}
              <div className="text-center mb-6 pb-6 border-b border-gray-200">
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <Image
                    src={userProfile.avatar}
                    alt={userProfile.fullName}
                    fill
                    className="object-cover rounded-full"
                  />
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-[#A3B18A] rounded-full flex items-center justify-center">
                    <Camera className="w-3 h-3 text-white" />
                  </div>
                </div>
                <h3 className="font-bold text-gray-900">
                  {userProfile.fullName}
                </h3>
                <p className="text-sm text-gray-600">{userProfile.email}</p>
                <div className="mt-3 flex items-center justify-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-semibold text-[#A3B18A]">
                    {userProfile.loyaltyPoints} Poin
                  </span>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-2 mb-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all duration-300 ${
                      activeTab === tab.id
                        ? "bg-[#A3B18A] text-white shadow-lg"
                        : "text-gray-700 hover:bg-[#A3B18A]/10 hover:text-[#A3B18A]"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </nav>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                title={isLoggingOut ? "Sedang keluar..." : "Keluar"}
              >
                <LogOut className="w-5 h-5" />
                {isLoggingOut ? "Keluar..." : "Keluar"}
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              {/* Dashboard Tab */}
              {activeTab === "dashboard" && (
                <div className="space-y-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-[#A3B18A] rounded-2xl flex items-center justify-center text-white">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Dashboard
                    </h2>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-r from-[#A3B18A] to-[#DFF19D] rounded-2xl p-6 text-white">
                      <div className="flex items-center gap-3 mb-3">
                        <Package className="w-6 h-6" />
                        <span className="font-semibold">Total Pesanan</span>
                      </div>
                      <div className="text-3xl font-bold">
                        {userProfile.totalOrders}
                      </div>
                      <div className="text-white/80 text-sm">
                        Sejak bergabung
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-[#F6CCD0] to-[#BFF0F5] rounded-2xl p-6 text-white">
                      <div className="flex items-center gap-3 mb-3">
                        <CreditCard className="w-6 h-6" />
                        <span className="font-semibold">Total Belanja</span>
                      </div>
                      <div className="text-3xl font-bold">
                        Rp {userProfile.totalSpent / 1000}k
                      </div>
                      <div className="text-white/80 text-sm">
                        Lifetime value
                      </div>
                    </div>

                  </div>

                  {/* Recent Orders */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900">
                        Pesanan Terbaru
                      </h3>
                      <button
                        onClick={() => setActiveTab("orders")}
                        className="text-[#A3B18A] font-semibold hover:underline"
                      >
                        Lihat Semua
                      </button>
                    </div>

                    <div className="space-y-4">
                      {orders.slice(0, 3).map((order) => (
                        <div
                          key={order.id}
                          className="border border-gray-200 rounded-2xl p-4 hover:border-[#A3B18A] transition-colors"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                #{order.orderNumber}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {new Date(order.date).toLocaleDateString(
                                  "id-ID"
                                )}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-[#A3B18A]">
                                Rp {order.total.toLocaleString("id-ID")}
                              </div>
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                  order.status
                                )}`}
                              >
                                {getStatusText(order.status)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {order.items.slice(0, 3).map((item, index) => (
                              <div
                                key={`${order.id}-${item.id}-${index}`}
                                className="w-10 h-10 relative rounded-lg overflow-hidden"
                              >
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ))}
                            {order.items.length > 3 && (
                              <span className="text-sm text-gray-500">
                                +{order.items.length - 3} lainnya
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#A3B18A] rounded-2xl flex items-center justify-center text-white">
                        <UserIcon className="w-5 h-5" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Informasi Profil
                      </h2>
                    </div>
                    <button
                      onClick={() =>
                        isEditing ? handleSaveProfile() : setIsEditing(true)
                      }
                      className="flex items-center gap-2 px-4 py-2 bg-[#A3B18A] text-white rounded-2xl font-semibold hover:bg-[#A3B18A]/90 transition-colors"
                    >
                      {isEditing ? (
                        <>
                          <Save className="w-4 h-4" />
                          Simpan
                        </>
                      ) : (
                        <>
                          <Edit3 className="w-4 h-4" />
                          Edit
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Nama Lengkap
                      </label>
                      <div className="relative">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={userProfile.fullName}
                          onChange={(e) =>
                            setUserProfile((prev) => ({
                              ...prev,
                              fullName: e.target.value,
                            }))
                          }
                          disabled={!isEditing}
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A3B18A] focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={userProfile.email}
                          onChange={(e) =>
                            setUserProfile((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          disabled={!isEditing}
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A3B18A] focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Nomor Telepon
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          value={userProfile.phone}
                          onChange={(e) =>
                            setUserProfile((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                          disabled={!isEditing}
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A3B18A] focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Tanggal Lahir
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="date"
                          value={userProfile.birthDate}
                          onChange={(e) =>
                            setUserProfile((prev) => ({
                              ...prev,
                              birthDate: e.target.value,
                            }))
                          }
                          disabled={!isEditing}
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A3B18A] focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Account Info */}
                  <div className="bg-[#A3B18A]/5 rounded-2xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Informasi Akun
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Bergabung sejak:</span>
                        <div className="font-semibold text-gray-900">
                          {new Date(userProfile.joinDate).toLocaleDateString(
                            "id-ID",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">ID Pengguna:</span>
                        <div className="font-semibold text-gray-900">
                          {userProfile.id}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Status Akun:</span>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="font-semibold text-green-600">
                            Terverifikasi
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Level Member:</span>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="font-semibold text-[#A3B18A]">
                            Gold Member
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === "addresses" && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#A3B18A] rounded-2xl flex items-center justify-center text-white">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Alamat Pengiriman
                      </h2>
                    </div>
                    <button
                      onClick={() => setShowAddAddress(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#A3B18A] text-white rounded-2xl font-semibold hover:bg-[#A3B18A]/90 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Tambah Alamat
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className={`border-2 rounded-2xl p-6 transition-all ${
                          address.isDefault
                            ? "border-[#A3B18A] bg-[#A3B18A]/5"
                            : "border-gray-200 hover:border-[#A3B18A]/50"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-bold text-gray-900">
                                {address.label}
                              </h3>
                              {address.isDefault && (
                                <span className="px-2 py-1 bg-[#A3B18A] text-white text-xs font-semibold rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="font-semibold text-gray-900">
                              {address.fullName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {address.phone}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button className="p-2 text-gray-400 hover:text-[#A3B18A] transition-colors">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(address.id)}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="text-sm text-gray-600 mb-4">
                          <p>{address.address}</p>
                          <p>
                            {address.city}, {address.province}{" "}
                            {address.postalCode}
                          </p>
                        </div>

                        {!address.isDefault && (
                          <button
                            onClick={() => setDefaultAddress(address.id)}
                            className="text-[#A3B18A] text-sm font-semibold hover:underline"
                          >
                            Jadikan Default
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === "orders" && (
                <div className="space-y-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-[#A3B18A] rounded-2xl flex items-center justify-center text-white">
                      <Package className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Riwayat Pesanan
                    </h2>
                  </div>

                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-gray-200 rounded-2xl p-6 hover:border-[#A3B18A] transition-colors"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                              #{order.orderNumber}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {new Date(order.date).toLocaleDateString(
                                    "id-ID"
                                  )}
                                </span>
                              </div>
                              {order.trackingNumber && (
                                <div className="flex items-center gap-2">
                                  <Truck className="w-4 h-4" />
                                  <span>{order.trackingNumber}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-4 mt-4 md:mt-0">
                            <span
                              className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {getStatusText(order.status)}
                            </span>
                            <div className="text-right">
                              <div className="font-bold text-xl text-[#A3B18A]">
                                Rp {order.total.toLocaleString("id-ID")}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-4"
                            >
                              <div className="w-16 h-16 relative rounded-xl overflow-hidden">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900">
                                  {item.name}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-gray-900">
                                  Rp{" "}
                                  {(item.price * item.quantity).toLocaleString(
                                    "id-ID"
                                  )}
                                </div>
                                <div className="text-sm text-gray-500">
                                  @Rp {item.price.toLocaleString("id-ID")}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                          <button className="flex items-center gap-2 px-4 py-2 border border-[#A3B18A] text-[#A3B18A] rounded-2xl hover:bg-[#A3B18A] hover:text-white transition-colors">
                            <Eye className="w-4 h-4" />
                            Detail
                          </button>
                          {order.status === "delivered" && (
                            <button className="flex items-center gap-2 px-4 py-2 bg-[#A3B18A] text-white rounded-2xl hover:bg-[#A3B18A]/90 transition-colors">
                              <Download className="w-4 h-4" />
                              Invoice
                            </button>
                          )}
                          {order.trackingNumber && (
                            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-colors">
                              <Truck className="w-4 h-4" />
                              Lacak
                            </button>
                          )}
                          {order.status === "delivered" && (
                            <button className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-2xl hover:bg-yellow-200 transition-colors">
                              <Star className="w-4 h-4" />
                              Beri Review
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {orders.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 bg-[#A3B18A]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Package className="w-12 h-12 text-[#A3B18A]" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Belum Ada Pesanan
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Anda belum memiliki riwayat pesanan. Mulai belanja
                        sekarang!
                      </p>
                      <button className="bg-[#A3B18A] text-white px-6 py-3 rounded-2xl font-semibold hover:bg-[#A3B18A]/90 transition-colors">
                        Mulai Berbelanja
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}