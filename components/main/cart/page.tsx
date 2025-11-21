"use client";

import { useEffect, useMemo, useState, useRef } from "react";
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
} from "@/services/auth.service"; // ✅ Imported new hook
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

interface ShippingCostOption {
  name: string;
  code: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
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
type PaymentType = "automatic" | "manual" | "cod";

export default function CartPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const sessionName = useMemo(() => session?.user?.name ?? "", [session]);

  const [cartItems, setCartItems] = useState<CartItemView[]>([]);

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
  const didPrefill = useRef(false);

  useEffect(() => {
    if (didPrefill.current) return;
    if (sessionName) {
      setShippingInfo((prev) => ({ ...prev, fullName: sessionName }));
    }
  }, [sessionName]);

  useEffect(() => {
    if (didPrefill.current) return;
    if (defaultAddress) {
      setShippingInfo((prev) => ({
        ...prev,
        phone: currentUser?.phone || "",
        address_line_1: defaultAddress.address_line_1 ?? prev.address_line_1,
        postal_code: defaultAddress.postal_code ?? prev.postal_code,
        rajaongkir_province_id:
          defaultAddress.rajaongkir_province_id ?? prev.rajaongkir_province_id,
        rajaongkir_city_id:
          defaultAddress.rajaongkir_city_id ?? prev.rajaongkir_city_id,
        rajaongkir_district_id:
          defaultAddress.rajaongkir_district_id ?? prev.rajaongkir_district_id,
      }));
      didPrefill.current = true;
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

  // ✅ New RTK Query hook for fetching shipping costs
  const {
    data: shippingOptions = [],
    isLoading: isShippingLoading,
    isError: isShippingError,
  } = useCheckShippingCostQuery(
    {
      shop_id: 1, // Assuming shop ID is 1 for this example
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

  // Reset shipping method when options change
  useEffect(() => {
    if (!isShippingLoading && shippingOptions.length > 0) {
      // You can set a default option here, e.g., the cheapest one
      setShippingMethod(shippingOptions[0]);
    } else {
      setShippingMethod(null);
    }
  }, [shippingOptions, isShippingLoading]);

  // Initial load + listen to changes
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

    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: "Produk berhasil ditambahkan ke keranjang",
      position: "top-end", // Position it to the top-right
      toast: true, // Makes it appear as a toast
      showConfirmButton: false, // Hides the confirm button for a toast effect
      timer: 3000, // Time for the toast to stay before disappearing (in ms)
      timerProgressBar: true, // Adds a progress bar on the toast
      background: "#ffffff", // White background for the toast
      color: "#333333", // Text color
      iconColor: "#4CAF50", // Color for the success icon (green)
      customClass: {
        popup: "toast-popup", // Custom class to style the popup if needed
      },
      willOpen: (toast) => {
        // Adding a gradient background to make the alert colorful and lively
        toast.style.background =
          "linear-gradient(45deg, #ff7f50, #ff6347, #ff1493, #ff4500)";
      },
    });
  };

  // const discount =
  //   appliedCoupon === "COLORE10" ? Math.round(subtotal * 0.1) : 0;

  // const shippingCost = shippingMethod?.cost ?? 0;
  // const total = subtotal - discount + shippingCost;

  const subtotal = cartItems.reduce(
    (sum, it) => sum + it.price * it.quantity,
    0
  );

  // Diskon dari voucher terpilih
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
      });
      setIsCheckingOut(false);
      return;
    }

    setIsSubmitting(true);
    try {
      const stored = parseStorage();
      const payload = {
        address_line_1: shippingInfo.address_line_1,
        postal_code: shippingInfo.postal_code,
        data: [
          {
            shop_id: 1,
            details: stored.map((item) => ({
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
              address_line_1: shippingInfo.address_line_1,
              postal_code: shippingInfo.postal_code,
              province_id: shippingInfo.rajaongkir_province_id,
              city_id: shippingInfo.rajaongkir_city_id,
              district_id: shippingInfo.rajaongkir_district_id,
            },
            payment_type: paymentMethod,
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
          text: "Silakan lanjutkan ke halaman pembayaran.",
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

  if (cartItems.length === 0) {
    return (
      <div
        className={`min-h-screen w-full bg-gradient-to-br from-white to-[#A3B18A]/10 pt-24 ${sniglet.className}`}
      >
        <div className="container mx-auto px-6">
          <div className="mx-auto text-center py-20">
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
            <div className="mt-16">
              <h2
                className={`text-2xl font-bold text-gray-900 mb-6 ${fredoka.className}`}
              >
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        <div className="flex gap-2 bg-[#A3B18A] rounded-2xl">
                          <button
                            onClick={() => addRelatedToCart(product.__raw)}
                            className="w-full bg-[#A3B18A] text-white py-3 rounded-2xl font-semibold hover:bg-[#A3B18A]/90 transition-colors flex items-center justify-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Tambah ke Keranjang
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
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-white to-[#DFF19D]/10 pt-24 ${sniglet.className}`}
    >
      <div className="container mx-auto px-6 lg:px-12 pb-12">
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
            <h1
              className={`text-4xl lg:text-5xl font-bold text-gray-900 mb-4 ${fredoka.className}`}
            >
              Produk <span className="text-[#A3B18A]">Pilihan Anda</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Review produk favorit dan lanjutkan untuk mendapatkan pengalaman
              berkreasi terbaik untuk si kecil
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow"
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

            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#A3B18A]" />
                Informasi Pengiriman
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nomor Telepon *
                      </label>
                      <input
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        placeholder="08xxxxxxxxxx"
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A3B18A] focus:border-transparent"
                      />
                      {!isPhoneValid && shippingInfo.phone && (
                        <p className="text-sm text-red-500 mt-0.5">
                          Nomor telepon tidak valid
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        placeholder="Masukkan email"
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A3B18A] focus:border-transparent"
                      />
                      {!isPhoneValid && shippingInfo.email && (
                        <p className="text-sm text-red-500 mt-0.5">
                          Email tidak valid
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alamat Lengkap *
                  </label>
                  <textarea
                    value={shippingInfo.address_line_1}
                    onChange={(e) =>
                      handleInputChange("address_line_1", e.target.value)
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
                      setShippingCourier(null);
                      setShippingMethod(null);
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
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kode Pos
                  </label>
                  <input
                    type="text"
                    value={shippingInfo.postal_code}
                    onChange={(e) =>
                      handleInputChange("postal_code", e.target.value)
                    }
                    placeholder="16911"
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A3B18A] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 shadow-lg">
                <h3 className="font-bold text-gray-900 mb-4">
                  Metode Pengiriman
                </h3>
                <div className="mb-4">
                  <label className="block  w-full text-sm font-medium text-gray-700 mb-2">
                    Pilih Kurir
                  </label>
                  <Select
                    value={shippingCourier ?? ""}
                    onValueChange={(val) => {
                      setShippingCourier(val);
                    }}
                    disabled={!shippingInfo.rajaongkir_district_id}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih Kurir" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jne">JNE</SelectItem>
                      <SelectItem value="pos">POS</SelectItem>
                      <SelectItem value="tiki">TIKI</SelectItem>
                    </SelectContent>
                  </Select>
                  {!shippingInfo.rajaongkir_district_id && (
                    <p className="text-sm text-red-500 mt-1">
                      Pilih kecamatan untuk melihat opsi kurir.
                    </p>
                  )}
                </div>
                <div className="space-y-3">
                  {isShippingLoading ? (
                    <div className="flex justify-center items-center py-4">
                      <DotdLoader />
                    </div>
                  ) : isShippingError ? (
                    <p className="text-center text-red-500">
                      Gagal memuat opsi pengiriman.
                    </p>
                  ) : shippingOptions.length > 0 ? (
                    shippingOptions.map((option, index) => (
                      <label
                        key={index}
                        className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                          shippingMethod?.service === option.service
                            ? "border-[#A3B18A] bg-[#DFF19D]/30"
                            : "border-gray-200 hover:bg-neutral-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="shipping-service"
                          checked={shippingMethod?.service === option.service}
                          onChange={() => setShippingMethod(option)}
                          className="form-radio text-[#A3B18A] h-4 w-4"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{option.service}</p>
                          <p className="text-sm text-neutral-500">
                            {option.description}
                          </p>
                          <p className="text-sm font-semibold">
                            Rp {option.cost.toLocaleString("id-ID")}
                          </p>
                          <p className="text-xs text-neutral-400">
                            Estimasi: {option.etd}
                          </p>
                        </div>
                      </label>
                    ))
                  ) : (
                    shippingInfo.rajaongkir_district_id &&
                    shippingCourier && (
                      <p className="text-center text-gray-500">
                        Tidak ada opsi pengiriman tersedia.
                      </p>
                    )
                  )}
                </div>
              </div>
              <div>
                <VoucherPicker
                  selected={selectedVoucher}
                  onChange={setSelectedVoucher}
                />
                <hr className="my-6" />
                <PaymentMethod
                  value={paymentMethod}
                  onChange={(val) => setPaymentMethod(val)}
                />
                <hr className="my-6" />
                {/* === Ringkasan Pesanan (update baris diskon) === */}
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
                        <span>
                          Diskon{" "}
                          {selectedVoucher?.code
                            ? `(${selectedVoucher.code})`
                            : "Voucher"}
                        </span>
                        <span>- Rp {discount.toLocaleString("id-ID")}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-gray-600">Ongkos Kirim</span>
                      <span className="font-semibold">
                        Rp {shippingCost.toLocaleString("id-ID")}
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
                    !shippingInfo.address_line_1) && (
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
          </div>
        </div>
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
                    <div className="flex gap-2 bg-[#A3B18A] rounded-2xl">
                      <button
                        onClick={() => addRelatedToCart(product.__raw)}
                        className="w-full bg-black/50 text-white py-3 rounded-2xl font-semibold hover:bg-[#A3B18A]/90 transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Tambah ke Keranjang
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
