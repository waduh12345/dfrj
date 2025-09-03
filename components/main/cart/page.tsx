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
  Tag,
  X,
  CheckCircle,
  Sparkles,
  Package,
  Shield,
  Truck,
  Star,
} from "lucide-react";
import { Product } from "@/types/admin/product";
import { useGetProductListQuery } from "@/services/product.service";
import DotdLoader from "@/components/loader/3dot";

// === Tambahan import logic checkout (tidak mengubah warna UI) ===
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
import { useCreateTransactionMutation } from "@/services/admin/transaction.service";
import { useRouter } from "next/navigation";
// SweetAlert
import Swal from "sweetalert2";

const STORAGE_KEY = "cart-storage";

type StoredCartItem = Product & { quantity: number };
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

function parseStorage(): StoredCartItem[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    const items: unknown = parsed?.state?.cartItems;
    return Array.isArray(items) ? (items as StoredCartItem[]) : [];
  } catch {
    return [];
  }
}

function writeStorage(nextItems: StoredCartItem[]) {
  if (typeof window === "undefined") return;
  const raw = localStorage.getItem(STORAGE_KEY);
  let base = {
    state: { cartItems: [] as StoredCartItem[] },
    version: 0 as number,
  };
  try {
    base = raw ? JSON.parse(raw) : base;
  } catch {}
  base.state = { ...(base.state || {}), cartItems: nextItems };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(base));
  window.dispatchEvent(new CustomEvent("cartUpdated"));
}

function getImageUrlFromProduct(p: Product): string {
  if (typeof p.image === "string" && p.image) return p.image;
  const media = (p as unknown as { media?: Array<{ original_url: string }> })
    ?.media;
  if (Array.isArray(media) && media[0]?.original_url)
    return media[0].original_url;
  return "/api/placeholder/300/300";
}

function mapStoredToView(items: StoredCartItem[]): CartItemView[] {
  return items.map((it) => ({
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
}

type ErrorBag = Record<string, string[] | string>;

export default function CartPage() {
  const router = useRouter();

  // ===== Cart from localStorage (sinkron)
  const [cartItems, setCartItems] = useState<CartItemView[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  // === STATE Tambahan untuk logic checkout ===
  const [paymentMethod, setPaymentMethod] = useState("");
  const [shippingMethod, setShippingMethod] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false); // spinner tombol
  const [isSubmitting, setIsSubmitting] = useState(false); // status request API

  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    kecamatan: "",
    rajaongkir_province_id: 0,
    rajaongkir_city_id: 0,
    rajaongkir_district_id: 0,
  });

  const handleInputChange = (field: string, value: string) => {
    setShippingInfo((prev) => ({ ...prev, [field]: value }));
  };

  // === Data wilayah (provinsi/kota/kecamatan) ===
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

  // === Mutation transaksi ===
  const [createTransaction] = useCreateTransactionMutation();

  // initial load + listen to changes from other tabs/pages
  useEffect(() => {
    const sync = () => setCartItems(mapStoredToView(parseStorage()));
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("cartUpdated", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("cartUpdated", sync);
    };
  }, []);

  // helpers untuk update storage dan state tampilan
  const updateStorageAndState = (
    updater: (items: StoredCartItem[]) => StoredCartItem[]
  ) => {
    const current = parseStorage();
    const next = updater(current);
    writeStorage(next);
    setCartItems(mapStoredToView(next));
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    updateStorageAndState((items) =>
      items.map((it) => (it.id === id ? { ...it, quantity: newQuantity } : it))
    );
  };

  const removeItem = (id: number) => {
    updateStorageAndState((items) => items.filter((it) => it.id !== id));
  };

  const clearCart = () => {
    writeStorage([]);
    setCartItems([]);
  };

  const applyCoupon = () => {
    if (couponCode.trim().toLowerCase() === "colore10") {
      setAppliedCoupon("COLORE10");
      setCouponCode("");
    }
  };

  const removeCoupon = () => setAppliedCoupon(null);

  // ===== Related products via service
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
    updateStorageAndState((items) => {
      const found = items.find((it) => it.id === p.id);
      if (found) {
        return items.map((it) =>
          it.id === p.id ? { ...it, quantity: (it.quantity ?? 1) + 1 } : it
        );
      }
      const fresh: StoredCartItem = { ...p, quantity: 1 };
      return [...items, fresh];
    });
  };

  // ===== Calculations
  const subtotal = cartItems.reduce(
    (sum, it) => sum + it.price * it.quantity,
    0
  );
  const discount =
    appliedCoupon === "COLORE10" ? Math.round(subtotal * 0.1) : 0;

  // === Shipping cost now mengikuti pilihan metode (sesuai contoh) ===
  const shippingCost =
    shippingMethod === "express"
      ? 15000
      : shippingMethod === "regular"
      ? 10000
      : shippingMethod === "pickup"
      ? 0
      : 0;

  const total = subtotal - discount + shippingCost;

  // === Mapping courier info (mengikuti contoh: lowercase "jne" | "pickup") ===
  const getCourierInfo = () => {
    switch (shippingMethod) {
      case "express":
        return {
          courier: "jne",
          parameter: JSON.stringify({
            destination: String(shippingInfo.rajaongkir_district_id || "486"),
            weight: 1000,
            height: 0,
            length: 0,
            width: 0,
            diameter: 0,
            courier: "jne",
          }),
          shipment_detail: JSON.stringify({
            name: "Jalur Nugraha Ekakurir (JNE)",
            code: "jne",
            service: "YES",
            description: "JNE Yakin Esok Sampai",
            cost: 15000,
            etd: "1 day",
          }),
        };
      case "regular":
        return {
          courier: "jne",
          parameter: JSON.stringify({
            destination: String(shippingInfo.rajaongkir_district_id || "486"),
            weight: 1000,
            height: 0,
            length: 0,
            width: 0,
            diameter: 0,
            courier: "jne",
          }),
          shipment_detail: JSON.stringify({
            name: "Jalur Nugraha Ekakurir (JNE)",
            code: "jne",
            service: "CTC",
            description: "JNE City Courier",
            cost: 10000,
            etd: "2-3 days",
          }),
        };
      case "pickup":
        return {
          courier: "pickup",
          parameter: JSON.stringify({
            destination: "0",
            weight: 0,
            height: 0,
            length: 0,
            width: 0,
            diameter: 0,
            courier: "pickup",
          }),
          shipment_detail: JSON.stringify({
            name: "Ambil di Tempat",
            code: "pickup",
            service: "PICKUP",
            description: "Ambil langsung di toko",
            cost: 0,
            etd: "0 day",
          }),
        };
      default:
        return null;
    }
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);

    if (
      !paymentMethod ||
      !shippingMethod ||
      !shippingInfo.fullName ||
      !shippingInfo.address
    ) {
      await Swal.fire({
        icon: "warning",
        title: "Lengkapi Data",
        text: "Harap lengkapi semua informasi yang diperlukan",
      });
      setIsCheckingOut(false);
      return;
    }

    const courierInfo = getCourierInfo();
    if (!courierInfo) {
      await Swal.fire({
        icon: "error",
        title: "Metode Pengiriman",
        text: "Metode pengiriman tidak valid",
      });
      setIsCheckingOut(false);
      return;
    }

    setIsSubmitting(true);
    try {
      const stored = parseStorage();
      const payload = {
        data: [
          {
            shop_id: 1, // TODO: buat dinamis jika diperlukan
            details: stored.map((item) => ({
              product_id: item.id,
              quantity: item.quantity ?? 1,
            })),
            shipment: {
              parameter: courierInfo.parameter,
              shipment_detail: courierInfo.shipment_detail,
              courier: courierInfo.courier, // "jne" | "pickup"
              cost: shippingCost,
            },
          },
        ],
      };

      const result = await createTransaction(payload).unwrap();

      if (
        result &&
        result.data &&
        typeof result.data === "object" &&
        "payment_link" in result.data
      ) {
        await Swal.fire({
          icon: "success",
          title: "Pesanan Berhasil Dibuat",
          text: `Reference: ${
            (result.data as { reference?: string }).reference || "N/A"
          }`,
          confirmButtonText: "Lanjut ke Pembayaran",
        });
        window.open(
          (result.data as { payment_link: string }).payment_link,
          "_blank"
        );
        clearCart();
        setTimeout(() => {
          router.push("/me");
        }, 2000);
      } else {
        console.warn("Unexpected response format:", result);
        await Swal.fire({
          icon: "info",
          title: "Pesanan Dibuat",
          text: "Pesanan berhasil dibuat, tetapi tidak dapat membuka link pembayaran.",
        });
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
      });
    } finally {
      setIsSubmitting(false);
      setIsCheckingOut(false);
    }
  };

  // ===== Empty cart
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-white to-[#DFF19D]/10 pt-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mx-auto text-center py-20">
            <div className="w-32 h-32 bg-[#A3B18A]/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingCart className="w-16 h-16 text-[#A3B18A]" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Keranjang Kosong
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Belum ada produk kreatif di keranjang Anda. Yuk, jelajahi koleksi
              produk ramah lingkungan kami!
            </p>
            <a
              href="/product"
              className="inline-flex bg-[#A3B18A] text-white px-8 py-4 rounded-2xl font-semibold hover:bg-[#A3B18A]/90 transition-colors items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Mulai Berbelanja
            </a>

            {/* Related section tetap tampil saat kosong */}
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Produk Rekomendasi
              </h2>
              {isRelLoading && (
                <div className="text-gray-600 w-full flex items-center justify-center min-h-96">
                  <DotdLoader />
                </div>
              )}
              {isRelError && (
                <div className="text-red-600">Gagal memuat rekomendasi.</div>
              )}
              {!isRelLoading && !isRelError && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-80">
                  {relatedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="min-w-80 bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
                    >
                      <div className="relative h-48">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <button className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors">
                          <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
                        </button>
                      </div>
                      <div className="p-6">
                        <span className="text-sm text-[#A3B18A] font-medium">
                          {product.category}
                        </span>
                        <h3 className="text-lg font-bold text-gray-900 mt-1 mb-3">
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
                          <span className="text-sm text-gray-600">
                            ({product.rating.toFixed(1)})
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-xl font-bold text-[#A3B18A]">
                            Rp {product.price.toLocaleString("id-ID")}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-400 line-through">
                              Rp {product.originalPrice.toLocaleString("id-ID")}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => addRelatedToCart(product.__raw)}
                          className="w-full bg-[#A3B18A] text-white py-3 rounded-2xl font-semibold hover:bg-[#A3B18A]/90 transition-colors flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Tambah ke Keranjang
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

  // ===== Main cart page
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#DFF19D]/10 pt-24">
      <div className="container mx-auto px-6 lg:px-12 pb-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <a
              href="/product"
              className="flex items-center gap-2 text-gray-600 hover:text-[#A3B18A] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Lanjut Belanja
            </a>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-[#A3B18A]/10 px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-[#A3B18A]" />
              <span className="text-sm font-medium text-[#A3B18A]">
                Keranjang Belanja
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Produk <span className="text-[#A3B18A]">Pilihan Anda</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Review produk favorit dan lanjutkan untuk mendapatkan pengalaman
              berkreasi terbaik untuk si kecil
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Image */}
                  <div className="relative w-full sm:w-32 h-48 sm:h-32 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded-2xl"
                    />
                    {!item.inStock && (
                      <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          Stok Habis
                        </span>
                      </div>
                    )}
                    {item.isEcoFriendly && (
                      <div className="absolute top-2 left-2 bg-[#DFF19D] text-gray-800 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Eco
                      </div>
                    )}
                  </div>

                  {/* Detail */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                      <div>
                        <span className="text-sm text-[#A3B18A] font-medium">
                          {item.category}
                        </span>
                        <h3 className="text-lg font-bold text-gray-900 mt-1">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Untuk anak {item.ageGroup}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 mt-2 sm:mt-0">
                        <button
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          title="Tambah ke Wishlist"
                        >
                          <Heart className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          title="Hapus dari Keranjang"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      {/* Price */}
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-[#A3B18A]">
                          Rp {item.price.toLocaleString("id-ID")}
                        </span>
                        {item.originalPrice && (
                          <span className="text-lg text-gray-400 line-through">
                            Rp {item.originalPrice.toLocaleString("id-ID")}
                          </span>
                        )}
                      </div>

                      {/* Quantity */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center bg-gray-100 rounded-2xl">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={!item.inStock}
                            className="p-2 hover:bg-gray-200 rounded-l-2xl transition-colors disabled:opacity-50"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={!item.inStock}
                            className="p-2 hover:bg-gray-200 rounded-r-2xl transition-colors disabled:opacity-50"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="font-bold text-gray-900">
                            Rp{" "}
                            {(item.price * item.quantity).toLocaleString(
                              "id-ID"
                            )}
                          </div>
                          {!item.inStock && (
                            <div className="text-xs text-red-500">
                              Tidak tersedia
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Informasi Pengiriman (baru, warna tetap konsisten) */}
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#A3B18A]" />
                Informasi Pengiriman
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    value={shippingInfo.fullName}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    placeholder="Masukkan nama lengkap"
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A3B18A] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor Telepon *
                  </label>
                  <input
                    type="tel"
                    value={shippingInfo.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A3B18A] focus:border-transparent"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alamat Lengkap *
                  </label>
                  <textarea
                    value={shippingInfo.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    rows={3}
                    placeholder="Nama jalan, RT/RW, Kelurahan"
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A3B18A] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    }}
                    data={provinces}
                    isLoading={loadingProvince}
                    getOptionLabel={(item) => item.name}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kota / Kabupaten
                  </label>
                  <Combobox
                    value={shippingInfo.rajaongkir_city_id}
                    onChange={(id) =>
                      setShippingInfo((prev) => ({
                        ...prev,
                        rajaongkir_city_id: id,
                        rajaongkir_district_id: 0,
                      }))
                    }
                    data={cities}
                    isLoading={loadingCity}
                    getOptionLabel={(item) => item.name}
                    disabled={!shippingInfo.rajaongkir_province_id}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kecamatan
                  </label>
                  <Combobox
                    value={shippingInfo.rajaongkir_district_id}
                    onChange={(id) =>
                      setShippingInfo((prev) => ({
                        ...prev,
                        rajaongkir_district_id: id,
                      }))
                    }
                    data={districts}
                    isLoading={loadingDistrict}
                    getOptionLabel={(item) => item.name}
                    disabled={!shippingInfo.rajaongkir_city_id}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kode Pos
                  </label>
                  <input
                    type="text"
                    value={shippingInfo.postalCode}
                    onChange={(e) =>
                      handleInputChange("postalCode", e.target.value)
                    }
                    placeholder="16911"
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A3B18A] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Metode Pengiriman (radio) */}
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <h3 className="font-bold text-gray-900 mb-4">
                Metode Pengiriman
              </h3>

              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors">
                  <input
                    type="radio"
                    name="shipping"
                    value="regular"
                    checked={shippingMethod === "regular"}
                    onChange={(e) => setShippingMethod(e.target.value)}
                  />
                  <div className="flex-1">
                    <p className="font-medium">Reguler (2-3 hari)</p>
                    <p className="text-sm text-neutral-500">Rp 10.000</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors">
                  <input
                    type="radio"
                    name="shipping"
                    value="express"
                    checked={shippingMethod === "express"}
                    onChange={(e) => setShippingMethod(e.target.value)}
                  />
                  <div className="flex-1">
                    <p className="font-medium">Express (1 hari)</p>
                    <p className="text-sm text-neutral-500">Rp 15.000</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors">
                  <input
                    type="radio"
                    name="shipping"
                    value="pickup"
                    checked={shippingMethod === "pickup"}
                    onChange={(e) => setShippingMethod(e.target.value)}
                  />
                  <div className="flex-1">
                    <p className="font-medium">Ambil di Tempat</p>
                    <p className="text-sm text-neutral-500">Gratis</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Kode Promo */}
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#A3B18A]" />
                Kode Promo
              </h3>

              {appliedCoupon ? (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-800">
                      {appliedCoupon}
                    </span>
                    <span className="text-sm text-green-600">- 10% Diskon</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-green-600 hover:text-green-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Masukkan kode promo"
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A3B18A] focus:border-transparent"
                  />
                  <button
                    onClick={applyCoupon}
                    className="px-6 py-3 bg-[#A3B18A] text-white rounded-2xl font-semibold hover:bg-[#A3B18A]/90 transition-colors"
                  >
                    Pakai
                  </button>
                </div>
              )}

              <div className="mt-4 text-sm text-gray-600">
                <p>
                  💡 Coba kode: <strong>COLORE10</strong> untuk diskon 10%
                </p>
              </div>
            </div>

            {/* Metode Pembayaran */}
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#A3B18A]" />
                Metode Pembayaran
              </h3>
              <Select
                value={paymentMethod}
                onValueChange={(val) => setPaymentMethod(val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Metode Pembayaran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cod">Bayar di Tempat (COD)</SelectItem>
                  <SelectItem value="transfer">Transfer Bank</SelectItem>
                  <SelectItem value="ewallet">
                    E-Wallet (GoPay/OVO/Dana)
                  </SelectItem>
                  <SelectItem value="qris">QRIS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Ringkasan Pesanan */}
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <h3 className="font-bold text-gray-900 mb-4">
                Ringkasan Pesanan
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Subtotal ({cartItems.length} produk)
                  </span>
                  <span className="font-semibold">
                    Rp {subtotal.toLocaleString("id-ID")}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Diskon Promo</span>
                    <span>- Rp {discount.toLocaleString("id-ID")}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600">Ongkos Kirim</span>
                  <span
                    className={`font-semibold ${
                      shippingCost === 0 ? "text-green-600" : ""
                    }`}
                  >
                    {shippingCost === 0
                      ? "GRATIS"
                      : `Rp ${shippingCost.toLocaleString("id-ID")}`}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-[#A3B18A]">
                      Rp {total.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Shield className="w-4 h-4 text-[#A3B18A]" />
                  <span>Pembayaran 100% aman</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Truck className="w-4 h-4 text-[#A3B18A]" />
                  <span>Gratis ongkir untuk belanja di atas 250k</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Package className="w-4 h-4 text-[#A3B18A]" />
                  <span>Garansi 30 hari</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={
                  isCheckingOut ||
                  isSubmitting ||
                  cartItems.some((it) => !it.inStock) ||
                  !paymentMethod ||
                  !shippingMethod ||
                  !shippingInfo.fullName ||
                  !shippingInfo.address
                }
                className="w-full bg-[#A3B18A] text-white py-4 rounded-2xl font-semibold hover:bg-[#A3B18A]/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                !shippingInfo.address) && (
                <p className="text-red-500 text-sm text-center mt-3">
                  * Harap lengkapi semua informasi yang diperlukan
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

        {/* Related Products (TIDAK DIUBAH tampilannya) */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Produk <span className="text-[#A3B18A]">Rekomendasi</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Lengkapi koleksi kreatif si kecil dengan produk pilihan lainnya
            </p>
          </div>

          {isRelLoading && (
            <div className="text-center text-gray-600">
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
                  className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
                >
                  <div className="relative h-48">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors">
                      <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
                    </button>
                  </div>

                  <div className="p-6">
                    <span className="text-sm text-[#A3B18A] font-medium">
                      {product.category}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 mt-1 mb-3">
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
                      <span className="text-sm text-gray-600">
                        ({product.rating.toFixed(1)})
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xl font-bold text-[#A3B18A]">
                        Rp {product.price.toLocaleString("id-ID")}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          Rp {product.originalPrice.toLocaleString("id-ID")}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => addRelatedToCart(product.__raw)}
                      className="w-full bg-[#A3B18A] text-white py-3 rounded-2xl font-semibold hover:bg-[#A3B18A]/90 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Tambah ke Keranjang
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