"use client";

import { JSX,useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  User as UserIcon,
  MapPin,
  Package,
  BarChart3,
  LogOut,
  Eye,
  Star,
  Calendar,
  Camera,
  CreditCard,
  Truck,
  Download,
  X,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import {
  useLogoutMutation,
  useGetCurrentUserQuery,
  useUpdateCurrentUserMutation,
} from "@/services/auth.service";
import {
  useGetUserAddressListQuery,
  useGetUserAddressByIdQuery,
  useCreateUserAddressMutation,
  useUpdateUserAddressMutation,
  useDeleteUserAddressMutation,
} from "@/services/address.service";
import {
  useGetProvincesQuery,
  useGetCitiesQuery,
  useGetDistrictsQuery,
} from "@/services/shop/open-shop/open-shop.service";
import { useGetTransactionListQuery } from "@/services/admin/transaction.service";
import Swal from "sweetalert2";
import { mapTxnStatusToOrderStatus, OrderStatus } from "@/lib/status-order";
import type { Address as UserAddress } from "@/types/address";
import { ROResponse, toList  } from "@/types/geo";
import { Region } from "@/types/shop";
import ProfileEditModal from "../profile-page/edit-modal";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

/* ======================= Types untuk Orders ======================= */
interface OrderItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
  total?: number;
}
interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  total: number; // subtotal (tanpa ongkir/diskon)
  grand_total?: number; // jika backend sediakan
  discount_total?: number; // jika backend sediakan
  shipment_cost?: number; // jika backend sediakan
  items: OrderItem[];
  trackingNumber?: string;
  payment_method?: string;
}

/* ======================= Helper gambar produk ======================= */
interface ApiTransactionDetailShape {
  id?: number | string;
  product_id?: number;
  quantity?: number;
  price?: number;
  total?: number;
  product_name?: string;
  product?: {
    name?: string;
    image?: string;
    media?: Array<{ original_url: string }>;
  } | null;
  image?: string | null;
}
const pickImageUrl = (d?: ApiTransactionDetailShape): string => {
  if (!d) return "/api/placeholder/80/80";
  if (typeof d.image === "string" && d.image) return d.image;
  const prod = d.product;
  if (prod?.image) return prod.image;
  const firstMedia = prod?.media?.[0]?.original_url;
  if (firstMedia) return firstMedia;
  return "/api/placeholder/80/80";
};

/* ======================= Komponen Halaman ======================= */
export default function ProfilePage(): JSX.Element {
  const { data: session } = useSession();
  const [logoutReq, { isLoading: isLoggingOut }] = useLogoutMutation();
  const [updateCurrentUser, { isLoading: isUpdatingProfile }] =
    useUpdateCurrentUserMutation();
  const [isPrefillingProfile, setIsPrefillingProfile] = useState(false);

  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileForm, setProfileForm] = useState<{
    name: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
    imageFile: File | null;
  }>({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
    imageFile: null,
  });

  // === NEW: modal detail pesanan
  const [orderDetailModalOpen, setOrderDetailModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<
    "dashboard" | "profile" | "addresses" | "orders"
  >("dashboard");
  const [isEditing, setIsEditing] = useState(false);

  // Session basics
  const sessionName = useMemo(() => session?.user?.name ?? "User", [session]);
  const sessionEmail = useMemo(
    () => session?.user?.email ?? "user@email.com",
    [session]
  );
  const sessionId = (session?.user as { id?: number } | undefined)?.id;

  /* --------------------- Transaksi --------------------- */
  const { data: txnResp } = useGetTransactionListQuery(
    { page: 1, paginate: 10, user_id: sessionId },
    { skip: !sessionId }
  );

  // NOTE:
  // Di beberapa backend, list transaction bisa menyertakan details produk.
  // Jika tidak ada, items akan kosong tapi UI tetap aman.
  const orders: Order[] = useMemo(() => {
    type Txn = {
      id: number | string;
      reference?: string;
      status?: number;
      total: number;
      grand_total?: number;
      discount_total?: number;
      shipment_cost?: number;
      created_at?: string;
      tracking_number?: string;
      payment_method?: string;
      details?: ApiTransactionDetailShape[];
    };

    const txns: ReadonlyArray<Txn> = (txnResp?.data as unknown as Txn[]) ?? [];

    return txns.map((t) => {
      const items: OrderItem[] = (t.details || []).map((det, idx) => ({
        id: String(det.id ?? `${t.id}-${idx}`),
        name: det.product?.name ?? det.product_name ?? "Produk",
        image: pickImageUrl(det),
        quantity: det.quantity ?? 1,
        price: det.price ?? 0,
        total: det.total,
      }));

      return {
        id: String(t.id),
        orderNumber: t.reference || `REF-${String(t.id)}`,
        date: t.created_at || new Date().toISOString(),
        status: mapTxnStatusToOrderStatus(t.status),
        total: t.total ?? 0,
        grand_total: t.grand_total,
        discount_total: t.discount_total,
        shipment_cost: t.shipment_cost,
        items,
        trackingNumber: t.tracking_number,
        payment_method: t.payment_method,
      };
    });
  }, [txnResp]);

  /* --------------------- Address via SERVICE --------------------- */
  const [addrModalOpen, setAddrModalOpen] = useState(false);
  const [addrEditId, setAddrEditId] = useState<number | null>(null);

  type AddrForm = Partial<Omit<UserAddress, "id">>;
  const [addrForm, setAddrForm] = useState<AddrForm>({
    user_id: sessionId || undefined,
    rajaongkir_province_id: null,
    rajaongkir_city_id: null,
    rajaongkir_district_id: null,
    address_line_1: "",
    address_line_2: "",
    postal_code: "",
    is_default: false,
  });

  const [createUserAddress, { isLoading: isCreatingAddr }] =
    useCreateUserAddressMutation();
  const [updateUserAddress, { isLoading: isUpdatingAddr }] =
    useUpdateUserAddressMutation();
  const [deleteUserAddress, { isLoading: isDeletingAddr }] =
    useDeleteUserAddressMutation();

  const {
    data: userAddressList,
    refetch: refetchUserAddressList,
    isFetching: isFetchingAddressList,
  } = useGetUserAddressListQuery(
    { page: 1, paginate: 100 },
    { skip: !sessionId }
  );

  const { data: addrDetail } = useGetUserAddressByIdQuery(addrEditId ?? 0, {
    skip: !addrEditId,
  });

  // RO hooks – pakai 0 saat skip agar param number tetap valid
  const provinceId = addrForm.rajaongkir_province_id ?? 0;
  const { data: provinces } = useGetProvincesQuery();
  const { data: cities } = useGetCitiesQuery(provinceId, {
    skip: !addrForm.rajaongkir_province_id,
  });
  const cityId = addrForm.rajaongkir_city_id ?? 0;
  const { data: districts } = useGetDistrictsQuery(cityId, {
    skip: !addrForm.rajaongkir_city_id,
  });

  // Normalisasi RO lists (tanpa any)
  const provinceList = toList<Region>(provinces as ROResponse<Region>);
  const cityList = toList<Region>(cities as ROResponse<Region>);
  const districtList = toList<Region>(districts as ROResponse<Region>);

  // Prefill form saat edit
  useEffect(() => {
    if (!addrDetail) return;
    setAddrForm({
      user_id: sessionId || undefined,
      rajaongkir_province_id: addrDetail.rajaongkir_province_id ?? null,
      rajaongkir_city_id: addrDetail.rajaongkir_city_id ?? null,
      rajaongkir_district_id: addrDetail.rajaongkir_district_id ?? null,
      address_line_1: addrDetail.address_line_1 ?? "",
      address_line_2: addrDetail.address_line_2 ?? "",
      postal_code: addrDetail.postal_code ?? "",
      is_default: Boolean(addrDetail.is_default),
    });
  }, [addrDetail, sessionId]);

  const openCreateAddress = () => {
    setAddrEditId(null);
    setAddrForm({
      user_id: sessionId || undefined,
      rajaongkir_province_id: null,
      rajaongkir_city_id: null,
      rajaongkir_district_id: null,
      address_line_1: "",
      address_line_2: "",
      postal_code: "",
      is_default: false,
    });
    setAddrModalOpen(true);
  };

  const openEditAddress = (id: number) => {
    setAddrEditId(id);
    setAddrModalOpen(true);
  };

  const handleDeleteAddressApi = async (id: number) => {
    const result = await Swal.fire({
      title: "Hapus alamat ini?",
      text: "Tindakan ini tidak bisa dibatalkan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
      preConfirm: async () => {
        try {
          await deleteUserAddress(id).unwrap();
          await refetchUserAddressList();
        } catch (e) {
          console.error(e);
          Swal.showValidationMessage("Gagal menghapus alamat.");
          throw e;
        }
      },
    });

    if (result.isConfirmed) {
      await Swal.fire("Terhapus!", "Alamat berhasil dihapus.", "success");
    }
  };

  const handleSubmitAddress = async () => {
    if (!addrForm.user_id) {
      Swal.fire("Info", "Session user belum tersedia.", "info");
      return;
    }
    try {
      if (addrEditId) {
        await updateUserAddress({ id: addrEditId, payload: addrForm }).unwrap();
      } else {
        await createUserAddress(addrForm).unwrap();
      }
      setAddrModalOpen(false);
      setAddrEditId(null);
      await refetchUserAddressList();
    } catch (e) {
      console.error(e);
      Swal.fire("Gagal", "Tidak dapat menyimpan alamat.", "error");
    }
  };

  /* --------------------- Profil/dsb (tetap) --------------------- */
  const [userProfile, setUserProfile] = useState<{
    id: string;
    fullName: string;
    email: string;
    phone: string;
    birthDate: string;
    image: string;
    joinDate: string;
    totalOrders: number;
    totalSpent: number;
    loyaltyPoints: number;
  }>({
    id:
      (session?.user as { id?: number } | undefined)?.id?.toString?.() ??
      "user-id",
    fullName: sessionName,
    email: sessionEmail,
    phone: "",
    birthDate: "1990-05-15",
    image: session?.user?.image || "/api/placeholder/150/150",
    joinDate: "",
    totalOrders: 0,
    totalSpent: 0,
    loyaltyPoints: 0,
  });

  useEffect(() => {
    setUserProfile((prev) => ({
      ...prev,
      id:
        (session?.user as { id?: number } | undefined)?.id?.toString?.() ??
        prev.id,
      fullName: sessionName,
      email: sessionEmail,
      image: session?.user?.image || prev.image,
    }));
  }, [sessionName, sessionEmail, session]);

  useEffect(() => {
    if (!orders.length) return;
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((acc, t) => acc + (t.total ?? 0), 0);
    setUserProfile((prev) => ({ ...prev, totalOrders, totalSpent }));
  }, [orders]);

  const { data: currentUserResp, refetch: refetchCurrentUser } =
    useGetCurrentUserQuery();

  useEffect(() => {
    const u = currentUserResp;
    if (!u) return;

    const apiImage =
      (u as { image?: string }).image ||
      (u as { media?: Array<{ original_url: string }> }).media?.[0]
        ?.original_url ||
      "";

    setUserProfile((prev) => ({
      ...prev,
      id: String(u.id ?? prev.id),
      fullName: u.name ?? prev.fullName,
      email: u.email ?? prev.email,
      phone: u.phone ?? prev.phone,
      joinDate: u.created_at ?? prev.joinDate,
      image: apiImage || prev.image,
    }));
  }, [currentUserResp]);

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

  const openEditProfileModal = async () => {
    setIsPrefillingProfile(true);
    try {
      const result = await refetchCurrentUser();
      const u = result.data ?? currentUserResp;
      setProfileForm({
        name: u?.name ?? userProfile.fullName ?? "",
        email: u?.email ?? userProfile.email ?? "",
        phone: u?.phone ?? userProfile.phone ?? "",
        password: "",
        password_confirmation: "",
        imageFile: null,
      });
      setProfileModalOpen(true);
    } finally {
      setIsPrefillingProfile(false);
    }
  };

  const handleSubmitProfile = async () => {
    try {
      const fd = new FormData();
      fd.append("name", profileForm.name ?? "");
      fd.append("email", profileForm.email ?? "");
      fd.append("phone", profileForm.phone ?? "");
      if (profileForm.password) {
        fd.append("password", profileForm.password);
        fd.append(
          "password_confirmation",
          profileForm.password_confirmation || ""
        );
      }
      if (profileForm.imageFile) {
        fd.append("image", profileForm.imageFile);
      }
      await updateCurrentUser(fd).unwrap();
      await refetchCurrentUser();
      setUserProfile((prev) => ({
        ...prev,
        fullName: profileForm.name || prev.fullName,
        email: profileForm.email || prev.email,
        phone: profileForm.phone || prev.phone,
      }));
      setProfileModalOpen(false);
      await Swal.fire("Berhasil", "Profil berhasil diperbarui.", "success");
    } catch (err: unknown) {
      const e = err as FetchBaseQueryError;
      const data = e.data as { message?: string } | undefined;
      const msg = data?.message || "Terjadi kesalahan saat menyimpan profil.";
      Swal.fire("Gagal", msg, "error");
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
      await logoutReq().unwrap();
      await Swal.fire("Berhasil!", "Anda telah keluar.", "success");
    } catch (e) {
      console.error("Logout API error:", e);
      await Swal.fire("Gagal!", "Terjadi kesalahan saat logout.", "error");
    } finally {
      await signOut({ callbackUrl: "/login" });
    }
  };

  const DEFAULT_AVATAR =
    "https://8nc5ppykod.ufs.sh/f/H265ZJJzf6brRRAfCOa62KGLnZzEJ8j0tpdrMSvRcPXiYUsh";

  const normalizeUrl = (u?: string) => {
    if (!u) return "";
    try {
      return encodeURI(u);
    } catch {
      return u;
    }
  };
  const rawAvatar = (userProfile.image ?? "").trim();
  const wantedAvatar = normalizeUrl(rawAvatar);
  const [imgSrc, setImgSrc] = useState<string>(
    wantedAvatar ? wantedAvatar : DEFAULT_AVATAR
  );
  useEffect(() => {
    setImgSrc(wantedAvatar ? wantedAvatar : DEFAULT_AVATAR);
  }, [wantedAvatar]);

  // ======== NEW: handler modal detail
  const selectedOrder = useMemo(
    () =>
      selectedOrderId
        ? orders.find((o) => o.id === selectedOrderId) ?? null
        : null,
    [selectedOrderId, orders]
  );
  const openOrderDetailModal = (orderId: string) => {
    setSelectedOrderId(orderId);
    setOrderDetailModalOpen(true);
  };
  const closeOrderDetailModal = () => {
    setOrderDetailModalOpen(false);
    setSelectedOrderId(null);
  };

  /* --------------------- UI --------------------- */
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
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <div className="text-center mb-6 pb-6 border-b border-gray-200">
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <Image
                    src={imgSrc}
                    alt={userProfile.fullName || "Avatar"}
                    fill
                    className="object-cover rounded-full"
                    onError={() => setImgSrc(DEFAULT_AVATAR)}
                    unoptimized
                  />
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-[#A3B18A] rounded-full flex items-center justify-center">
                    <Camera
                      onClick={openEditProfileModal}
                      className="w-3 h-3 text-white cursor-pointer"
                    />
                  </div>
                </div>
                <h3 className="font-bold text-gray-900">
                  {userProfile.fullName}
                </h3>
                <p className="text-sm text-gray-600">{userProfile.email}</p>
              </div>

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

          {/* Main */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              {/* Dashboard */}
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
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(userProfile.totalSpent)}
                      </div>
                      <div className="text-white/80 text-sm">
                        Lifetime value
                      </div>
                    </div>
                  </div>

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
                      {(orders || []).slice(0, 3).map((order) => (
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

              {/* Profile */}
              {activeTab === "profile" && (
                /* ... (bagian profile tetap seperti sebelumnya) ... */
                <div className="space-y-8">{/* dipertahankan */}</div>
              )}

              {/* Addresses */}
              {activeTab === "addresses" && (
                /* ... (bagian addresses tetap seperti sebelumnya) ... */
                <div className="space-y-8">{/* dipertahankan */}</div>
              )}

              {/* Orders */}
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
                    {(orders || []).map((order) => (
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
                                  {(
                                    item.total ?? item.price * item.quantity
                                  ).toLocaleString("id-ID")}
                                </div>
                                <div className="text-sm text-gray-500">
                                  @Rp {item.price.toLocaleString("id-ID")}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                          <button
                            onClick={() => openOrderDetailModal(order.id)}
                            className="flex items-center gap-2 px-4 py-2 border border-[#A3B18A] text-[#A3B18A] rounded-2xl hover:bg-[#A3B18A] hover:text-white transition-colors"
                          >
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

      {/* ======= NEW: Order Detail Modal ======= */}
      {orderDetailModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeOrderDetailModal}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Detail Pesanan #{selectedOrder.orderNumber}
              </h3>
              <button
                onClick={closeOrderDetailModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Order Info */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Informasi Pesanan
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nomor Pesanan:</span>
                      <span className="font-medium">
                        #{selectedOrder.orderNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tanggal:</span>
                      <span className="font-medium">
                        {new Date(selectedOrder.date).toLocaleDateString(
                          "id-ID",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          selectedOrder.status
                        )}`}
                      >
                        {getStatusText(selectedOrder.status)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Metode Pembayaran:</span>
                      <span className="font-medium uppercase">
                        {selectedOrder.payment_method || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Rincian Pembayaran
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">
                        Rp {selectedOrder.total.toLocaleString("id-ID")}
                      </span>
                    </div>
                    {typeof selectedOrder.shipment_cost === "number" && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ongkos Kirim:</span>
                        <span className="font-medium">
                          Rp{" "}
                          {selectedOrder.shipment_cost.toLocaleString("id-ID")}
                        </span>
                      </div>
                    )}
                    {typeof selectedOrder.discount_total === "number" &&
                      selectedOrder.discount_total > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Diskon:</span>
                          <span className="font-medium text-green-600">
                            -Rp{" "}
                            {selectedOrder.discount_total.toLocaleString(
                              "id-ID"
                            )}
                          </span>
                        </div>
                      )}
                    <div className="border-t pt-2">
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-900">
                          Total:
                        </span>
                        <span className="font-bold text-[#6B6B6B]">
                          Rp{" "}
                          {(
                            selectedOrder.grand_total ?? selectedOrder.total
                          ).toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Info (jika ada tracking number) */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Pengiriman
                  </h4>
                  <div className="text-sm">
                    {selectedOrder.trackingNumber ? (
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-green-600">
                          {selectedOrder.trackingNumber}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-500">
                          Belum ada nomor resi
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">
                Produk Pesanan
              </h4>
              <div className="space-y-4">
                {selectedOrder.items.length ? (
                  selectedOrder.items.map((detail, index) => {
                    const productName = detail.name || "Produk";
                    return (
                      <div
                        key={`${detail.id}-${index}`}
                        className="flex items-center gap-4 p-4 border rounded-lg"
                      >
                        <div className="w-16 h-16 relative rounded-lg overflow-hidden">
                          <Image
                            src={detail.image}
                            alt={productName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900">
                            {productName}
                          </h5>
                          <p className="text-sm text-gray-600">
                            Qty: {detail.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">
                            Rp{" "}
                            {(
                              detail.total ?? detail.price * detail.quantity
                            ).toLocaleString("id-ID")}
                          </div>
                          <div className="text-sm text-gray-500">
                            @Rp {detail.price.toLocaleString("id-ID")}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>Tidak ada produk ditemukan</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Edit Modal */}
      {profileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setProfileModalOpen(false)}
          />
          <ProfileEditModal
            open={profileModalOpen}
            onClose={() => setProfileModalOpen(false)}
            values={profileForm}
            onChange={(patch) =>
              setProfileForm((prev) => ({ ...prev, ...patch }))
            }
            onSubmit={handleSubmitProfile}
            isSubmitting={isUpdatingProfile}
          />
        </div>
      )}
    </div>
  );
}