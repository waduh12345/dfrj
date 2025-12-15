"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Heart,
  ArrowLeft,
  CreditCard,
  Sparkles,
  Truck,
  Star,
  ShoppingBag,
} from "lucide-react";
import { Product } from "@/types/admin/product";
import { useGetProductListQuery } from "@/services/product.service";
import DotdLoader from "@/components/loader/3dot";

// === Import logic checkout ===
import { Combobox } from "@/components/ui/combo-box";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  useGetProvincesQuery,
  useGetCitiesQuery,
  useGetDistrictsQuery,
} from "@/services/shop/open-shop/open-shop.service";
import {
  useGetCurrentUserQuery,
  useCheckShippingCostQuery,
} from "@/services/auth.service";
import { useCreateTransactionMutation } from "@/services/admin/transaction.service";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";
import { useGetUserAddressListQuery } from "@/services/address.service";
import type { Address } from "@/types/address";
import { fredoka, sniglet } from "@/lib/fonts";
import { Voucher } from "@/types/voucher";
import PaymentMethod from "@/components/payment-method";
import VoucherPicker from "@/components/voucher-picker";

// ✅ Import Hook Zustand
import useCart from "@/hooks/use-cart";
import { TransactionResponseData } from "./public-transactions";

// --- Types ---
interface CartItemView {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  category: string;
  ageGroup: string;
  isEcoFriendly: boolean;
  inStock: boolean;
}

interface RelatedProductView {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  category: string;
  __raw: Product;
}

interface ShippingCostOption {
  name: string;
  code: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
}

function getImageUrlFromProduct(p: Product): string {
  if (typeof p.image === "string" && p.image) return p.image;
  const media = (p as unknown as { media?: Array<{ original_url: string }> })
    ?.media;
  if (Array.isArray(media) && media[0]?.original_url)
    return media[0].original_url;
  return "/api/placeholder/300/300";
}

type ErrorBag = Record<string, string[] | string>;
type PaymentType = "automatic" | "manual" | "cod";

// --- Theme Constants (Matches PublicTransaction) ---
const THEME = {
  primary: "#d43893ff",
  textMain: "#5B4A3B",
};

export default function CartPage() {
  const router = useRouter();
  const { data: session } = useSession();

  // ✅ Menggunakan useCart Zustand
  const {
    cartItems: rawCartItems,
    removeItem,
    increaseItemQuantity,
    decreaseItemQuantity,
    addItem,
    clearCart,
  } = useCart();

  // Handle Hydration Mismatch
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Map data dari Zustand ke format View
  const cartItems: CartItemView[] = useMemo(() => {
    if (!isMounted) return [];
    return rawCartItems.map((it) => ({
      id: it.id,
      name: it.name,
      price: it.price,
      originalPrice: undefined,
      image: getImageUrlFromProduct(it),
      quantity: it.quantity ?? 1,
      category: it.category_name,
      ageGroup: "Semua usia",
      isEcoFriendly: false,
      inStock: (it.stock ?? 0) > 0,
    }));
  }, [rawCartItems, isMounted]);

  const [shippingCourier, setShippingCourier] = useState<string | null>(null);
  const [shippingMethod, setShippingMethod] =
    useState<ShippingCostOption | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<PaymentType>("manual");
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    phone: "",
    email: "",
    address_line_1: "",
    city: "",
    postal_code: "",
    kecamatan: "",
    rajaongkir_province_id: 0,
    rajaongkir_city_id: 0,
    rajaongkir_district_id: 0,
  });

  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const validatePhone = (phone: string) => {
    const regex = /^(?:\+62|62|0)8\d{8,11}$/;
    return regex.test(phone);
  };

  const { data: currentUserResp } = useGetCurrentUserQuery();
  const currentUser = useMemo(() => currentUserResp || null, [currentUserResp]);

  useEffect(() => {
    setIsPhoneValid(validatePhone(shippingInfo.phone));
  }, [shippingInfo.phone]);

  const handleInputChange = (field: string, value: string) => {
    setShippingInfo((prev) => ({ ...prev, [field]: value }));
  };

  const { data: userAddressList } = useGetUserAddressListQuery({
    page: 1,
    paginate: 100,
  });

  const defaultAddress: Address | undefined = userAddressList?.data?.find(
    (a) => a.is_default
  );

  // ✅ Logic Pre-fill Data Profile (Nama, Email, HP) & Alamat Default
  useEffect(() => {
    if (currentUser) {
      setShippingInfo((prev) => ({
        ...prev,
        fullName:
          prev.fullName || currentUser.name || session?.user?.name || "",
        email: prev.email || currentUser.email || session?.user?.email || "",
        phone: prev.phone || currentUser.phone || "",
      }));
    }
  }, [currentUser, session]);

  // ✅ Logic Pre-fill Alamat Default
  useEffect(() => {
    if (defaultAddress) {
      setShippingInfo((prev) => ({
        ...prev,
        // Jika phone kosong dari profile, coba ambil dari alamat (opsional)
        phone: prev.phone || currentUser?.phone || "",
        address_line_1: defaultAddress.address_line_1 ?? prev.address_line_1,
        postal_code: defaultAddress.postal_code ?? prev.postal_code,
        rajaongkir_province_id:
          defaultAddress.rajaongkir_province_id ?? prev.rajaongkir_province_id,
        rajaongkir_city_id:
          defaultAddress.rajaongkir_city_id ?? prev.rajaongkir_city_id,
        rajaongkir_district_id:
          defaultAddress.rajaongkir_district_id ?? prev.rajaongkir_district_id,
      }));
    }
  }, [defaultAddress, currentUser]);

  const { data: provinces = [], isLoading: loadingProvince } =
    useGetProvincesQuery();
  const { data: cities = [], isLoading: loadingCity } = useGetCitiesQuery(
    shippingInfo.rajaongkir_province_id,
    { skip: !shippingInfo.rajaongkir_province_id }
  );
  const { data: districts = [], isLoading: loadingDistrict } =
    useGetDistrictsQuery(shippingInfo.rajaongkir_city_id, {
      skip: !shippingInfo.rajaongkir_city_id,
    });

  const [createTransaction] = useCreateTransactionMutation();

  const {
    data: shippingOptions = [],
    isLoading: isShippingLoading,
    isError: isShippingError,
  } = useCheckShippingCostQuery(
    {
      shop_id: 1,
      destination: String(shippingInfo.rajaongkir_district_id),
      weight: 1000,
      height: 10,
      length: 10,
      width: 10,
      diameter: 10,
      courier: shippingCourier ?? "",
    },
    {
      skip: !shippingInfo.rajaongkir_district_id || !shippingCourier,
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    if (!isShippingLoading && shippingOptions.length > 0) {
      setShippingMethod(shippingOptions[0]);
    } else {
      setShippingMethod(null);
    }
  }, [shippingOptions, isShippingLoading]);

  const {
    data: relatedResp,
    isLoading: isRelLoading,
    isError: isRelError,
  } = useGetProductListQuery({
    page: 1,
    paginate: 6,
  });

  const relatedProducts: RelatedProductView[] = useMemo(() => {
    const arr = relatedResp?.data ?? [];
    return arr.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      originalPrice: undefined,
      image: getImageUrlFromProduct(p),
      rating:
        typeof p.rating === "number"
          ? p.rating
          : parseFloat(p.rating || "0") || 0,
      category: p.category_name,
      __raw: p,
    }));
  }, [relatedResp]);

  const addRelatedToCart = (p: Product) => {
    addItem({ ...p, quantity: 1 }); // ✅ Gunakan fungsi dari useCart

    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: "Produk berhasil ditambahkan ke keranjang",
      position: "top-end",
      toast: true,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: "#ffffff",
      color: THEME.textMain,
      iconColor: THEME.primary,
    });
  };

  const subtotal = cartItems.reduce(
    (sum, it) => sum + it.price * it.quantity,
    0
  );

  const voucherDiscount = useMemo(() => {
    if (!selectedVoucher) return 0;
    if (selectedVoucher.type === "fixed") {
      const cut = Math.max(0, selectedVoucher.fixed_amount);
      return Math.min(cut, subtotal);
    }
    const pct = Math.max(0, selectedVoucher.percentage_amount);
    return Math.round((subtotal * pct) / 100);
  }, [selectedVoucher, subtotal]);

  const discount = voucherDiscount;

  const shippingCost = shippingMethod?.cost ?? 0;
  const total = subtotal - discount + shippingCost;

  const handleCheckout = async () => {
    setIsCheckingOut(true);

    if (
      !shippingMethod ||
      !shippingInfo.fullName ||
      !shippingInfo.address_line_1 ||
      !shippingInfo.postal_code ||
      !isPhoneValid
    ) {
      await Swal.fire({
        icon: "warning",
        title: "Lengkapi Data",
        text: "Harap lengkapi semua informasi yang diperlukan untuk melanjutkan.",
        confirmButtonColor: THEME.primary,
      });
      setIsCheckingOut(false);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        address_line_1: shippingInfo.address_line_1,
        postal_code: shippingInfo.postal_code,
        payment_type: paymentMethod,
        data: [
          {
            shop_id: 1,
            details: rawCartItems.map((item) => ({
              product_id: item.id,
              quantity: item.quantity ?? 1,
            })),
            shipment: {
              parameter: JSON.stringify({
                destination: String(shippingInfo.rajaongkir_district_id),
                weight: 1000,
                height: 0,
                length: 0,
                width: 0,
                diameter: 0,
                courier: shippingCourier ?? "",
              }),
              shipment_detail: JSON.stringify(shippingMethod),
              courier: shippingCourier ?? "",
              cost: shippingMethod.cost,
            },
            customer_info: {
              name: shippingInfo.fullName,
              phone: shippingInfo.phone,
              email: shippingInfo.email,
              address_line_1: shippingInfo.address_line_1,
              postal_code: shippingInfo.postal_code,
              province_id: shippingInfo.rajaongkir_province_id,
              city_id: shippingInfo.rajaongkir_city_id,
              district_id: shippingInfo.rajaongkir_district_id,
            },
          },
        ],
      };

      const res = await createTransaction(payload).unwrap();

      if (res && typeof res.data === "object") {
        const responseData = res.data as unknown as TransactionResponseData;

        if (paymentMethod === "manual") {
          await Swal.fire({
            icon: "success",
            title: "Pesanan Berhasil Dibuat",
            text: "Silakan lakukan pembayaran dan upload bukti transfer.",
            confirmButtonText: "Lanjut",
            confirmButtonColor: THEME.primary,
          });

          clearCart();
          router.push(`/guest/transaction/${responseData.id}`);
        } else if ("payment_link" in responseData) {
          await Swal.fire({
            icon: "success",
            title: "Pesanan Berhasil Dibuat",
            text: "Kami arahkan ke halaman pembayaran dan pelacakan.",
            confirmButtonText: "Lanjut",
            confirmButtonColor: THEME.primary,
          });

          if (responseData.payment_link) {
            window.open(responseData.payment_link, "_blank");
          }

          clearCart();
          router.push(`/cek-order?code=${responseData.reference}`);
        } else {
          await Swal.fire({
            icon: "success",
            title: "Pesanan Berhasil Dibuat",
            text: "Untuk informasi lebih lanjut cek menu track order.",
            confirmButtonColor: THEME.primary,
          });
          clearCart();
          router.push("/me");
        }
      }
    } catch (err: unknown) {
      console.error("Error creating transaction:", err);

      let serverMessage =
        "Terjadi kesalahan saat membuat pesanan. Silakan coba lagi.";
      let fieldErrors = "";

      if (typeof err === "object" && err !== null) {
        const apiErr = err as {
          data?: { message?: string; errors?: ErrorBag };
        };
        const genericErr = err as { message?: string };

        if (apiErr.data?.message) {
          serverMessage = apiErr.data.message;
        } else if (genericErr.message) {
          serverMessage = genericErr.message;
        }

        const rawErrors: ErrorBag | undefined = apiErr.data?.errors;
        if (rawErrors) {
          fieldErrors = Object.entries(rawErrors)
            .map(([field, msgs]) => {
              const list = Array.isArray(msgs) ? msgs : [msgs];
              return `${field}: ${list.join(", ")}`;
            })
            .join("\n");
        }
      }

      await Swal.fire({
        icon: "error",
        title: "Gagal Membuat Pesanan",
        html:
          `<p style="text-align:left">${serverMessage}</p>` +
          (fieldErrors
            ? `<pre style="text-align:left;white-space:pre-wrap;background:#f8f9fa;padding:12px;border-radius:8px;margin-top:8px">${fieldErrors}</pre>`
            : ""),
        confirmButtonColor: THEME.primary,
      });
    } finally {
      setIsSubmitting(false);
      setIsCheckingOut(false);
    }
  };

  // --- EMPTY STATE ---
  if (isMounted && cartItems.length === 0) {
    return (
      <div
        className={`min-h-screen w-full bg-gradient-to-br from-white to-[#FFF0F5] pt-24 ${sniglet.className}`}
      >
        <div className="container mx-auto px-6">
          <div className="mx-auto text-center py-20">
            <div className="w-32 h-32 bg-[#d43893ff]/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingCart className="w-16 h-16 text-[#d43893ff]" />
            </div>
            <h1
              className={`text-4xl font-bold text-[#5B4A3B] mb-4 ${fredoka.className}`}
            >
              Keranjang Belum Terisi
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto">
              Mari dukung karya difabelpreneur! Jelajahi ragam kuliner otentik,
              kriya, dan fashion kami.
            </p>
            <a
              href="/product"
              className="inline-flex bg-[#d43893ff] text-white px-8 py-4 rounded-full font-bold hover:bg-[#b02e7a] transition-all transform hover:scale-105 items-center gap-2 shadow-lg shadow-pink-200"
            >
              <ArrowLeft className="w-5 h-5" />
              Mulai Berbelanja
            </a>

            <div className="mt-20">
              <h2
                className={`text-2xl font-bold text-[#5B4A3B] mb-8 ${fredoka.className}`}
              >
                Karya Rekomendasi
              </h2>
              {isRelLoading && (
                <div className="text-gray-600 w-full flex items-center justify-center min-h-64">
                  <DotdLoader />
                </div>
              )}
              {isRelError && (
                <div className="text-red-600">Gagal memuat rekomendasi.</div>
              )}
              {!isRelLoading && !isRelError && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-[2rem] overflow-hidden shadow-lg shadow-pink-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group border border-gray-50"
                    >
                      <div className="relative h-52">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#d43893ff] shadow-sm uppercase">
                          {product.category}
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-[#5B4A3B] mb-2 line-clamp-1">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= Math.round(product.rating)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-400">
                            ({product.rating.toFixed(1)})
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex flex-col">
                            <span className="text-xl font-bold text-[#d43893ff]">
                              Rp {product.price.toLocaleString("id-ID")}
                            </span>
                            {product.originalPrice && (
                              <span className="text-xs text-gray-400 line-through">
                                Rp{" "}
                                {product.originalPrice.toLocaleString("id-ID")}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => addRelatedToCart(product.__raw)}
                          className="w-full bg-gray-50 text-[#5B4A3B] py-3 rounded-xl font-bold hover:bg-[#d43893ff] hover:text-white transition-all flex items-center justify-center gap-2 group-hover:shadow-md"
                        >
                          <Plus className="w-4 h-4" />
                          Tambah
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- MAIN LAYOUT ---
  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-white to-[#FFF0F5] pt-24 ${sniglet.className}`}
    >
      <div className="container mx-auto px-6 lg:px-12 pb-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <a
              href="/product"
              className="flex items-center gap-2 text-gray-500 hover:text-[#d43893ff] transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Lanjut Belanja
            </a>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-[#d43893ff]/10 px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-[#d43893ff]" />
              <span className="text-sm font-bold text-[#d43893ff] tracking-wide">
                Keranjang Belanja
              </span>
            </div>
            <h1
              className={`text-4xl lg:text-5xl font-bold text-[#5B4A3B] mb-4 ${fredoka.className}`}
            >
              Karya <span className="text-[#d43893ff]">Pilihan Anda</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Review produk favorit dan lanjutkan untuk mendapatkan pengalaman
              berkreasi terbaik untuk si kecil
            </p>
          </div>
        </div>

        {/* --- MAIN GRID LAYOUT (3 Columns) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* --- KOLOM KIRI (2 Span) --- */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Cart Items List */}
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-[2rem] p-6 shadow-lg shadow-gray-100 hover:shadow-xl transition-shadow border border-gray-50"
              >
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="relative w-full sm:w-32 h-48 sm:h-32 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded-2xl"
                    />
                    {!item.inStock && (
                      <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          Habis
                        </span>
                      </div>
                    )}
                    {item.isEcoFriendly && (
                      <div className="absolute top-2 left-2 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                        <Sparkles className="w-3 h-3" />
                        Eco
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                      <div>
                        <span className="text-xs font-bold text-[#d43893ff] uppercase tracking-wider bg-pink-50 px-2 py-1 rounded-md">
                          {item.category}
                        </span>
                        <h3 className="text-lg font-bold text-[#5B4A3B] mt-2 leading-tight">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Untuk anak {item.ageGroup}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 mt-2 sm:mt-0">
                        <button
                          className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                          title="Hapus Karya"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-[#d43893ff]">
                          Rp {item.price.toLocaleString("id-ID")}
                        </span>
                        {item.originalPrice && (
                          <span className="text-lg text-gray-300 line-through">
                            Rp {item.originalPrice.toLocaleString("id-ID")}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center bg-gray-50 rounded-full border border-gray-100">
                          <button
                            onClick={() => decreaseItemQuantity(item.id)}
                            disabled={!item.inStock}
                            className="p-3 hover:bg-gray-200 rounded-l-full transition-colors disabled:opacity-30 text-[#5B4A3B]"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-2 font-bold min-w-[2rem] text-center text-[#5B4A3B]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => increaseItemQuantity(item.id)}
                            disabled={!item.inStock}
                            className="p-3 hover:bg-gray-200 rounded-r-full transition-colors disabled:opacity-30 text-[#5B4A3B]"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="text-right min-w-[80px]">
                          <div className="font-bold text-[#5B4A3B]">
                            Rp{" "}
                            {(item.price * item.quantity).toLocaleString(
                              "id-ID"
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* 2. Informasi Pengiriman Form */}
            <div className="bg-white rounded-[2rem] p-8 shadow-lg shadow-gray-100 border border-gray-50">
              <h3
                className={`font-bold text-[#5B4A3B] text-xl mb-6 flex items-center gap-2 ${fredoka.className}`}
              >
                <Truck className="w-6 h-6 text-[#d43893ff]" />
                Informasi Pengiriman
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    value={shippingInfo.fullName}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    placeholder="Masukkan nama lengkap"
                    className="w-full px-5 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#d43893ff] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Nomor Telepon *
                      </label>
                      <input
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        placeholder="08xxxxxxxxxx"
                        className="w-full px-5 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#d43893ff] focus:border-transparent transition-all"
                      />
                      {!isPhoneValid && shippingInfo.phone && (
                        <p className="text-sm text-red-500 mt-1">
                          Nomor telepon tidak valid
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        placeholder="Masukkan email"
                        className="w-full px-5 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#d43893ff] focus:border-transparent transition-all"
                      />
                      {shippingInfo.email &&
                        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                          shippingInfo.email
                        ) && (
                          <p className="text-sm text-red-500 mt-1">
                            Email tidak valid
                          </p>
                        )}
                    </div>
                  </div>
                </div>

                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Alamat Lengkap *
                  </label>
                  <textarea
                    value={shippingInfo.address_line_1}
                    onChange={(e) =>
                      handleInputChange("address_line_1", e.target.value)
                    }
                    rows={3}
                    placeholder="Nama jalan, RT/RW, Kelurahan"
                    className="w-full px-5 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#d43893ff] focus:border-transparent transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Provinsi
                  </label>
                  <Combobox
                    value={shippingInfo.rajaongkir_province_id}
                    onChange={(id) => {
                      setShippingInfo((prev) => ({
                        ...prev,
                        rajaongkir_province_id: id,
                        rajaongkir_city_id: 0,
                        rajaongkir_district_id: 0,
                      }));
                      setShippingCourier(null);
                      setShippingMethod(null);
                    }}
                    data={provinces}
                    isLoading={loadingProvince}
                    getOptionLabel={(item) => item.name}
                    placeholder="Pilih Provinsi"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Kota / Kabupaten
                  </label>
                  <Combobox
                    value={shippingInfo.rajaongkir_city_id}
                    onChange={(id) => {
                      setShippingInfo((prev) => ({
                        ...prev,
                        rajaongkir_city_id: id,
                        rajaongkir_district_id: 0,
                      }));
                      setShippingCourier(null);
                      setShippingMethod(null);
                    }}
                    data={cities}
                    isLoading={loadingCity}
                    getOptionLabel={(item) => item.name}
                    disabled={!shippingInfo.rajaongkir_province_id}
                    placeholder="Pilih Kota/Kab"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Kecamatan
                  </label>
                  <Combobox
                    value={shippingInfo.rajaongkir_district_id}
                    onChange={(id) => {
                      setShippingInfo((prev) => ({
                        ...prev,
                        rajaongkir_district_id: id,
                      }));
                      setShippingCourier(null);
                      setShippingMethod(null);
                    }}
                    data={districts}
                    isLoading={loadingDistrict}
                    getOptionLabel={(item) => item.name}
                    disabled={!shippingInfo.rajaongkir_city_id}
                    placeholder="Pilih Kecamatan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Kode Pos
                  </label>
                  <input
                    type="text"
                    value={shippingInfo.postal_code}
                    onChange={(e) =>
                      handleInputChange("postal_code", e.target.value)
                    }
                    placeholder="xxxxx"
                    className="w-full px-5 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#d43893ff] focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* 3. Metode Pengiriman Selection */}
            <div className="bg-white rounded-[2rem] p-8 shadow-lg shadow-gray-100 border border-gray-50">
              <h3
                className={`font-bold text-[#5B4A3B] text-xl mb-4 ${fredoka.className}`}
              >
                Jasa Pengiriman
              </h3>
              <div className="mb-4">
                <label className="block w-full text-sm font-bold text-gray-700 mb-2">
                  Pilih Ekspedisi
                </label>
                <Select
                  value={shippingCourier ?? ""}
                  onValueChange={(val) => {
                    setShippingCourier(val);
                    setShippingMethod(null); // Reset method when courier changes
                  }}
                  disabled={!shippingInfo.rajaongkir_district_id}
                >
                  <SelectTrigger className="w-full rounded-xl py-6 border-gray-200 focus:ring-[#d43893ff]">
                    <SelectValue placeholder="Pilih Kurir" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jne">JNE</SelectItem>
                    <SelectItem value="pos">POS Indonesia</SelectItem>
                    <SelectItem value="tiki">TIKI</SelectItem>
                  </SelectContent>
                </Select>
                {!shippingInfo.rajaongkir_district_id && (
                  <p className="text-sm text-[#d43893ff] mt-2 bg-pink-50 p-2 rounded-lg inline-block">
                    ⓘ Lengkapi alamat tujuan untuk melihat opsi kurir.
                  </p>
                )}
              </div>

              <div className="space-y-3">
                {isShippingLoading ? (
                  <div className="flex justify-center items-center py-6">
                    <DotdLoader />
                  </div>
                ) : isShippingError ? (
                  <p className="text-center text-red-500 bg-red-50 p-3 rounded-xl">
                    Gagal memuat opsi pengiriman.
                  </p>
                ) : shippingOptions.length > 0 ? (
                  shippingOptions.map((option, index) => (
                    <label
                      key={index}
                      className={`flex items-center gap-4 p-4 border rounded-2xl cursor-pointer transition-all ${
                        shippingMethod?.service === option.service
                          ? "border-[#d43893ff] bg-pink-50 ring-1 ring-[#d43893ff]"
                          : "border-gray-100 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="shipping-service"
                        checked={shippingMethod?.service === option.service}
                        onChange={() => setShippingMethod(option)}
                        className="form-radio text-[#d43893ff] h-5 w-5 focus:ring-[#d43893ff]"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <p className="font-bold text-[#5B4A3B] uppercase">
                            {option.service}
                          </p>
                          <p className="text-lg font-bold text-[#d43893ff]">
                            Rp {option.cost.toLocaleString("id-ID")}
                          </p>
                        </div>
                        <p className="text-sm text-gray-500">
                          {option.description}
                        </p>
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                          <Truck className="w-3 h-3" /> Estimasi: {option.etd}{" "}
                          hari
                        </p>
                      </div>
                    </label>
                  ))
                ) : (
                  shippingInfo.rajaongkir_district_id &&
                  shippingCourier && (
                    <p className="text-center text-gray-500 bg-gray-50 p-4 rounded-xl">
                      Tidak ada opsi pengiriman tersedia.
                    </p>
                  )
                )}
              </div>
            </div>
          </div>

          {/* --- KOLOM KANAN (Sticky) (1 Span) --- */}
          <div className="lg:col-span-1 space-y-6 sticky top-24">
            {/* 1. Voucher Picker */}
            <VoucherPicker
              selected={selectedVoucher}
              onChange={setSelectedVoucher}
            />

            {/* 2. Metode Pembayaran */}
            <PaymentMethod
              value={paymentMethod}
              onChange={(val) => setPaymentMethod(val)}
            />

            {/* 3. Ringkasan Pesanan */}
            <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-200 border border-gray-100">
              <h3
                className={`font-bold text-[#5B4A3B] text-xl mb-6 ${fredoka.className}`}
              >
                Rincian Biaya
              </h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    Total Karya ({cartItems.length})
                  </span>
                  <span className="font-semibold text-[#5B4A3B]">
                    Rp {subtotal.toLocaleString("id-ID")}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-[#d43893ff] bg-pink-50 px-3 py-1 rounded-lg">
                    <span className="flex items-center gap-1 text-sm font-bold">
                      <Sparkles className="w-3 h-3" /> Diskon
                      {selectedVoucher?.code
                        ? ` (${selectedVoucher.code})`
                        : ""}
                    </span>
                    <span className="font-bold">
                      - Rp {discount.toLocaleString("id-ID")}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Ongkos Kirim</span>
                  <span className="font-semibold text-[#5B4A3B]">
                    {shippingMethod
                      ? `Rp ${shippingCost.toLocaleString("id-ID")}`
                      : "-"}
                  </span>
                </div>

                <div className="border-t border-dashed border-gray-200 pt-4 mt-2">
                  <div className="flex justify-between items-end">
                    <span className="font-bold text-gray-600">Total Bayar</span>
                    <span className="text-2xl font-bold text-[#d43893ff]">
                      Rp {total.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={
                  isCheckingOut ||
                  isSubmitting ||
                  cartItems.some((it) => !it.inStock) ||
                  !shippingMethod ||
                  !shippingInfo.fullName ||
                  !shippingInfo.address_line_1 ||
                  !shippingInfo.postal_code ||
                  !isPhoneValid
                }
                className="w-full bg-[#d43893ff] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#b02e7a] transition-all transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-pink-200"
              >
                {isCheckingOut || isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Checkout Sekarang
                  </>
                )}
              </button>

              {(!paymentMethod ||
                !shippingMethod ||
                !shippingInfo.fullName ||
                !shippingInfo.address_line_1) && (
                <p className="text-gray-400 text-xs text-center mt-4">
                  * Tombol aktif setelah data pengiriman lengkap
                </p>
              )}

              {cartItems.some((it) => !it.inStock) && (
                <p className="text-red-500 text-sm text-center mt-3">
                  Beberapa produk tidak tersedia. Hapus untuk melanjutkan.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* --- RECOMMENDED PRODUCTS (Below Grid) --- */}
        <div className="mt-20 border-t border-gray-200 pt-12">
          <div className="text-center mb-12">
            <h2
              className={`text-3xl font-bold text-[#5B4A3B] mb-3 ${fredoka.className}`}
            >
              Lengkapi <span className="text-[#d43893ff]">Koleksi Anda</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Karya difabelpreneur lainnya yang mungkin Anda suka
            </p>
          </div>
          {isRelLoading && (
            <div className="text-center text-gray-600 flex justify-center">
              <DotdLoader />
            </div>
          )}
          {isRelError && (
            <div className="text-center text-red-600">
              Gagal memuat rekomendasi.
            </div>
          )}
          {!isRelLoading && !isRelError && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-[2rem] overflow-hidden shadow-lg shadow-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group border border-gray-50"
                >
                  <div className="relative h-56">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#d43893ff] shadow-sm uppercase">
                      {product.category}
                    </div>
                    <button className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors">
                      <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
                    </button>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-[#5B4A3B] mb-2 line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= Math.round(product.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-400">
                        ({product.rating.toFixed(1)})
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex flex-col">
                        <span className="text-xl font-bold text-[#d43893ff]">
                          Rp {product.price.toLocaleString("id-ID")}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-gray-400 line-through">
                            Rp {product.originalPrice.toLocaleString("id-ID")}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => addRelatedToCart(product.__raw)}
                        className="w-full bg-gray-50 text-[#5B4A3B] py-3 rounded-xl font-bold hover:bg-[#d43893ff] hover:text-white transition-all flex items-center justify-center gap-2 group-hover:shadow-md"
                      >
                        <Plus className="w-4 h-4" />
                        Tambah
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}