"use client";

import { useMemo, useEffect, useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
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
  Utensils,
} from "lucide-react";

import {
  useCreatePublicTransactionMutation,
  type CreatePublicTransactionRequest,
} from "@/services/public-transactions.service";
import { useCheckShippingCostQuery } from "@/services/auth.service";
import { useGetProductListQuery } from "@/services/product.service";

import {
  useGetProvincesQuery,
  useGetCitiesQuery,
  useGetDistrictsQuery,
} from "@/services/shop/open-shop/open-shop.service";

import VoucherPicker from "@/components/voucher-picker";
import PaymentMethod from "@/components/payment-method";
import type { Voucher } from "@/types/voucher";
import type { Product } from "@/types/admin/product";
import { fredoka, sniglet } from "@/lib/fonts";
import { Combobox } from "@/components/ui/combo-box";
import DotdLoader from "@/components/loader/3dot";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// IMPORT ZUSTAND HOOK
import useCart from "@/hooks/use-cart";
import { useRouter } from "next/navigation";

/** ====== Helpers & Types ====== */

interface CartItemView {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  category: string;
  // ageGroup removed/ignored for Difaraja branding
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

type PaymentType = "automatic" | "manual" | "cod";

// Theme Colors for Difaraja
const THEME = {
  primary: "#d43893ff", // Magenta/Pink
  primaryLight: "#FFF0F5", // Soft Pink
  textMain: "#5B4A3B", // Cocoa Brown
};

function getImageUrlFromProduct(p: Product): string {
  if (typeof p.image === "string" && p.image) return p.image;
  const media = (p as unknown as { media?: Array<{ original_url: string }> })
    ?.media;
  if (Array.isArray(media) && media[0]?.original_url)
    return media[0].original_url;
  return "/api/placeholder/300/300";
}

export interface TransactionResponseData {
  reference: string;
  id?: string;
  payment_link?: string;
}

/** ====== Component ====== */
export default function PublicTransaction() {
  const router = useRouter();
  /** ——— Cart Logic (Menggunakan Zustand) ——— */
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
      isEcoFriendly: false, // Bisa disesuaikan logicnya jika ada field eco
      inStock: (it.stock ?? 0) > 0,
    }));
  }, [rawCartItems, isMounted]);

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
    addItem({ ...p, quantity: 1 });
    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: "Karya ditambahkan ke keranjang",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      background: "#fff",
      color: THEME.textMain,
      iconColor: THEME.primary
    });
  };

  /** ——— Guest Form State ——— */
  const [guest, setGuest] = useState({
    address_line_1: "",
    address_line_2: "",
    postal_code: "",
    guest_name: "",
    guest_email: "",
    guest_phone: "",
    rajaongkir_province_id: 0,
    rajaongkir_city_id: 0,
    rajaongkir_district_id: 0,
  });

  /** ——— Regional Data ——— */
  const { data: provinces = [], isLoading: provLoading } =
    useGetProvincesQuery();
  const { data: cities = [], isLoading: cityLoading } = useGetCitiesQuery(
    guest.rajaongkir_province_id,
    { skip: !guest.rajaongkir_province_id }
  );
  const { data: districts = [], isLoading: distLoading } = useGetDistrictsQuery(
    guest.rajaongkir_city_id,
    { skip: !guest.rajaongkir_city_id }
  );

  useEffect(() => {
    setGuest((s) => ({
      ...s,
      rajaongkir_city_id: 0,
      rajaongkir_district_id: 0,
    }));
  }, [guest.rajaongkir_province_id]);

  useEffect(() => {
    setGuest((s) => ({ ...s, rajaongkir_district_id: 0 }));
  }, [guest.rajaongkir_city_id]);

  const canChooseCourier = Boolean(
    guest.rajaongkir_district_id ||
      (guest.address_line_1.trim() && guest.postal_code.trim())
  );

  /** ——— Shipping Logic ——— */
  const [shippingCourier, setShippingCourier] = useState<string | null>(null);
  const [shippingMethod, setShippingMethod] =
    useState<ShippingCostOption | null>(null);

  useEffect(() => {
    setShippingCourier(null);
    setShippingMethod(null);
  }, [
    guest.address_line_1,
    guest.postal_code,
    guest.rajaongkir_province_id,
    guest.rajaongkir_city_id,
    guest.rajaongkir_district_id,
  ]);

  const {
    data: shippingOptions = [],
    isLoading: isShippingLoading,
    isError: isShippingError,
  } = useCheckShippingCostQuery(
    {
      shop_id: 1,
      destination: guest.rajaongkir_district_id
        ? String(guest.rajaongkir_district_id)
        : guest.postal_code,
      weight: 1000,
      height: 10,
      length: 10,
      width: 10,
      diameter: 10,
      courier: shippingCourier ?? "",
    },
    {
      skip: !canChooseCourier || !shippingCourier,
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

  /** ——— Payment & Voucher ——— */
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentType>("manual");

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

  /** ——— Checkout Action ——— */
  const [createPublicTransaction, { isLoading: isCreating }] =
    useCreatePublicTransactionMutation();

  const onCheckout = async () => {
    if (
      !guest.address_line_1 ||
      !guest.postal_code ||
      !guest.guest_name ||
      !guest.guest_email ||
      !guest.guest_phone ||
      !shippingCourier ||
      !shippingMethod
    ) {
      await Swal.fire({
        icon: "warning",
        title: "Lengkapi Data",
        text: "Mohon isi semua data pengiriman yang wajib.",
        confirmButtonColor: THEME.primary,
      });
      return;
    }

    if (cartItems.length === 0) {
      await Swal.fire({
        icon: "info",
        title: "Keranjang Kosong",
        text: "Tambahkan karya ke keranjang terlebih dahulu.",
        confirmButtonColor: THEME.primary,
      });
      return;
    }

    const details = rawCartItems.map((item) => ({
      product_id: item.id,
      quantity: item.quantity ?? 1,
    }));

    const payload: CreatePublicTransactionRequest = {
      address_line_1: guest.address_line_1,
      address_line_2: guest.address_line_2 || "",
      postal_code: guest.postal_code,
      guest_name: guest.guest_name,
      guest_email: guest.guest_email,
      guest_phone: guest.guest_phone,
      payment_type: paymentMethod,
      data: [
        {
          shop_id: 1,
          details,
          shipment: {
            parameter: JSON.stringify({
              destination: guest.rajaongkir_district_id
                ? String(guest.rajaongkir_district_id)
                : guest.postal_code,
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
        },
      ],
      voucher: selectedVoucher ? [selectedVoucher.id] : undefined,
    };

    try {
      const res = await createPublicTransaction(payload).unwrap();

      if (res && typeof res.data === "object") {
        const responseData = res.data as unknown as TransactionResponseData;

        // 1. JIKA PEMBAYARAN MANUAL
        if (paymentMethod === "manual") {
          await Swal.fire({
            icon: "success",
            title: "Pesanan Berhasil",
            text: "Karya difabelpreneur siap diproses! Silakan lakukan pembayaran.",
            confirmButtonText: "Lanjut Bayar",
            confirmButtonColor: THEME.primary,
          });

          clearCart();
          router.push(`/guest/transaction/${responseData.id}`);
        }

        // 2. JIKA PEMBAYARAN OTOMATIS
        else if ("payment_link" in responseData) {
          await Swal.fire({
            icon: "success",
            title: "Pesanan Berhasil",
            text: "Mengalihkan ke halaman pembayaran aman.",
            confirmButtonText: "Lanjut",
            confirmButtonColor: THEME.primary,
          });

          window.open(responseData.payment_link, "_blank");
          clearCart();
          router.push(`/cek-order?code=${responseData.reference}`);
        }

        // 3. FALLBACK
        else {
          await Swal.fire({
            icon: "success",
            title: "Pesanan Berhasil",
            text: "Terima kasih telah mendukung difabelpreneur.",
            confirmButtonColor: THEME.primary,
          });
          clearCart();
        }
      }
    } catch (e) {
      console.error(e);
      await Swal.fire({
        icon: "error",
        title: "Gagal Membuat Pesanan",
        text: "Terjadi kesalahan sistem, silakan coba lagi.",
        confirmButtonColor: THEME.primary,
      });
    }
  };

  /** ——— Render Empty State ——— */
  if (isMounted && cartItems.length === 0) {
    return (
      <div
        className={`min-h-screen w-full bg-gradient-to-br from-white to-[#FFF0F5] pt-24 ${sniglet.className}`}
      >
        <div className="container mx-auto px-6">
          <div className="mx-auto text-center py-20">
            <div className="w-32 h-32 bg-[#d43893ff]/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBag className="w-16 h-16 text-[#d43893ff]" />
            </div>
            <h1 className={`text-4xl font-bold text-[#5B4A3B] mb-4 ${fredoka.className}`}>
              Keranjang Belum Terisi
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto">
              Mari dukung karya difabelpreneur! Jelajahi ragam kuliner otentik, kriya, dan fashion kami.
            </p>
            <a
              href="/product"
              className="inline-flex bg-[#d43893ff] text-white px-8 py-4 rounded-full font-bold hover:bg-[#b02e7a] transition-all transform hover:scale-105 items-center gap-2 shadow-lg shadow-pink-200"
            >
              <ArrowLeft className="w-5 h-5" />
              Jelajahi Karya
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
                      </div>
                      <div className="p-6">
                        <span className="text-sm text-[#d43893ff] font-bold uppercase tracking-wide">
                          {product.category}
                        </span>
                        <h3 className="text-lg font-bold text-[#5B4A3B] mt-1 mb-3 line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-xl font-bold text-[#d43893ff]">
                            Rp {product.price.toLocaleString("id-ID")}
                          </span>
                        </div>
                        <button
                          onClick={() => addRelatedToCart(product.__raw)}
                          className="w-full bg-white border-2 border-[#d43893ff] text-[#d43893ff] py-3 rounded-xl font-bold hover:bg-[#d43893ff] hover:text-white transition-all flex items-center justify-center gap-2"
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
              Kembali ke Galeri Karya
            </a>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-[#d43893ff]/10 px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-[#d43893ff]" />
              <span className="text-sm font-bold text-[#d43893ff] tracking-wide">
                Checkout Tamu
              </span>
            </div>
            <h1
              className={`text-4xl lg:text-5xl font-bold text-[#5B4A3B] mb-4 ${fredoka.className}`}
            >
              Karya <span className="text-[#d43893ff]">Pilihan Anda</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Selesaikan pesanan untuk mendukung difabelpreneur Indonesia
            </p>
          </div>
        </div>

        {/* MAIN LAYOUT GRID (3 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* --- KOLOM KIRI --- */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Cart Items */}
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
                        {/* Removed generic ageGroup text */}
                      </div>

                      <div className="flex items-center gap-2 mt-2 sm:mt-0">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                          title="Hapus Karya"
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

            {/* 2. Informasi Pengiriman (Form Guest) */}
            <div className="bg-white rounded-[2rem] p-8 shadow-lg shadow-gray-100 border border-gray-50">
              <h3 className={`font-bold text-[#5B4A3B] text-xl mb-6 flex items-center gap-2 ${fredoka.className}`}>
                <Truck className="w-6 h-6 text-[#d43893ff]" />
                Tujuan Pengiriman
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    className="w-full px-5 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#d43893ff] focus:border-transparent transition-all"
                    value={guest.guest_name}
                    onChange={(e) =>
                      setGuest((s) => ({ ...s, guest_name: e.target.value }))
                    }
                    placeholder="Nama penerima paket"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Nomor WhatsApp *
                  </label>
                  <input
                    type="text"
                    className="w-full px-5 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#d43893ff] focus:border-transparent transition-all"
                    value={guest.guest_phone}
                    onChange={(e) =>
                      setGuest((s) => ({ ...s, guest_phone: e.target.value }))
                    }
                    placeholder="08xxxxxxxxxx"
                  />
                </div>

                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    className="w-full px-5 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#d43893ff] focus:border-transparent transition-all"
                    value={guest.guest_email}
                    onChange={(e) =>
                      setGuest((s) => ({ ...s, guest_email: e.target.value }))
                    }
                    placeholder="Untuk pengiriman invoice"
                  />
                </div>

                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Alamat Lengkap *
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-5 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#d43893ff] focus:border-transparent transition-all resize-none"
                    value={guest.address_line_1}
                    onChange={(e) =>
                      setGuest((s) => ({
                        ...s,
                        address_line_1: e.target.value,
                      }))
                    }
                    placeholder="Nama Jalan, No. Rumah, RT/RW, Kelurahan"
                  />
                </div>

                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Catatan Alamat (Opsional)
                  </label>
                  <input
                    type="text"
                    className="w-full px-5 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#d43893ff] focus:border-transparent transition-all"
                    value={guest.address_line_2}
                    onChange={(e) =>
                      setGuest((s) => ({
                        ...s,
                        address_line_2: e.target.value,
                      }))
                    }
                    placeholder="Contoh: Pagar hitam, dekat masjid"
                  />
                </div>

                {/* Provinsi */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Provinsi
                  </label>
                  <Combobox
                    value={guest.rajaongkir_province_id || null}
                    onChange={(id) => {
                      setGuest((s) => ({
                        ...s,
                        rajaongkir_province_id: id,
                        rajaongkir_city_id: 0,
                        rajaongkir_district_id: 0,
                      }));
                      setShippingCourier(null);
                      setShippingMethod(null);
                    }}
                    data={provinces}
                    isLoading={provLoading}
                    placeholder="Pilih Provinsi"
                    getOptionLabel={(item: { id: number; name: string }) =>
                      item.name
                    }
                  />
                </div>

                {/* Kabupaten / Kota */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Kabupaten / Kota
                  </label>
                  <Combobox
                    value={guest.rajaongkir_city_id || null}
                    onChange={(id) => {
                      setGuest((s) => ({
                        ...s,
                        rajaongkir_city_id: id,
                        rajaongkir_district_id: 0,
                      }));
                      setShippingCourier(null);
                      setShippingMethod(null);
                    }}
                    data={cities}
                    isLoading={cityLoading}
                    placeholder="Pilih Kab/Kota"
                    getOptionLabel={(item: { id: number; name: string }) =>
                      item.name
                    }
                    disabled={!guest.rajaongkir_province_id}
                  />
                </div>

                {/* Kecamatan */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Kecamatan
                  </label>
                  <Combobox
                    value={guest.rajaongkir_district_id || null}
                    onChange={(id) => {
                      setGuest((s) => ({ ...s, rajaongkir_district_id: id }));
                      setShippingCourier(null);
                      setShippingMethod(null);
                    }}
                    data={districts}
                    isLoading={distLoading}
                    placeholder="Pilih Kecamatan"
                    getOptionLabel={(item: { id: number; name: string }) =>
                      item.name
                    }
                    disabled={!guest.rajaongkir_city_id}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Kode Pos *
                  </label>
                  <input
                    type="text"
                    className="w-full px-5 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#d43893ff] focus:border-transparent transition-all"
                    value={guest.postal_code}
                    onChange={(e) =>
                      setGuest((s) => ({ ...s, postal_code: e.target.value }))
                    }
                    placeholder="xxxxx"
                  />
                </div>
              </div>
            </div>

            {/* 3. Metode Pengiriman (Kurir) */}
            <div className="bg-white rounded-[2rem] p-8 shadow-lg shadow-gray-100 border border-gray-50">
              <h3 className={`font-bold text-[#5B4A3B] text-xl mb-4 ${fredoka.className}`}>
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
                    setShippingMethod(null);
                  }}
                  disabled={!canChooseCourier}
                >
                  <SelectTrigger className="w-full rounded-xl py-6 border-gray-200 focus:ring-[#d43893ff]">
                    <SelectValue placeholder="Pilih Kurir (JNE/POS/TIKI)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jne">JNE</SelectItem>
                    <SelectItem value="pos">POS Indonesia</SelectItem>
                    <SelectItem value="tiki">TIKI</SelectItem>
                  </SelectContent>
                </Select>

                {!canChooseCourier && (
                  <p className="text-sm text-[#d43893ff] mt-2 bg-pink-50 p-2 rounded-lg inline-block">
                    ⓘ Lengkapi alamat tujuan untuk melihat ongkos kirim.
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
                    Gagal memuat opsi pengiriman. Coba cek koneksi internet.
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
                          <p className="font-bold text-[#5B4A3B] uppercase">{option.service}</p>
                          <p className="text-lg font-bold text-[#d43893ff]">
                            Rp {option.cost.toLocaleString("id-ID")}
                          </p>
                        </div>
                        <p className="text-sm text-gray-500">
                          {option.description}
                        </p>
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                          <Truck className="w-3 h-3"/> Estimasi: {option.etd} hari
                        </p>
                      </div>
                    </label>
                  ))
                ) : (
                  canChooseCourier &&
                  shippingCourier && (
                    <p className="text-center text-gray-500 bg-gray-50 p-4 rounded-xl">
                      Tidak ada layanan pengiriman tersedia untuk rute ini.
                    </p>
                  )
                )}
              </div>
            </div>
          </div>

          {/* --- KOLOM KANAN (Sticky) --- */}
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
              <h3 className={`font-bold text-[#5B4A3B] text-xl mb-6 ${fredoka.className}`}>
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
                       <Sparkles className="w-3 h-3"/> Diskon
                    </span>
                    <span className="font-bold">- Rp {discount.toLocaleString("id-ID")}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Ongkos Kirim</span>
                  <span className="font-semibold text-[#5B4A3B]">
                    {shippingMethod ? `Rp ${shippingCost.toLocaleString("id-ID")}` : "-"}
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
                onClick={onCheckout}
                disabled={
                  isCreating ||
                  cartItems.some((it) => !it.inStock) ||
                  !guest.address_line_1 ||
                  !guest.postal_code ||
                  !guest.guest_name ||
                  !guest.guest_email ||
                  !guest.guest_phone ||
                  !shippingCourier ||
                  !shippingMethod
                }
                className="w-full bg-[#d43893ff] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#b02e7a] transition-all transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-pink-200"
              >
                {isCreating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Bayar Sekarang
                  </>
                )}
              </button>

              {(!shippingMethod ||
                !shippingCourier ||
                !guest.guest_name ||
                !guest.address_line_1) && (
                <p className="text-gray-400 text-xs text-center mt-4">
                  * Tombol aktif setelah data pengiriman lengkap
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Produk Rekomendasi */}
        <div className="mt-20 border-t border-gray-200 pt-12">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold text-[#5B4A3B] mb-3 ${fredoka.className}`}>
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
  );
}