"use client";

import { useState } from "react";
import { Trash2, Plus, Minus, CreditCard, Truck, MapPin } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
  useCreateTransactionMutation,
} from "@/services/admin/transaction.service";

import useCart from "@/hooks/use-cart"; // Import the cart hook

export default function CheckoutPage() {
  const router = useRouter();

  // Use the cart hook instead of dummy data
  const { cartItems, removeItem, increaseItemQuantity, decreaseItemQuantity, clearCart } =
    useCart();

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

  const { data: provinces = [], isLoading: loadingProvince } =
    useGetProvincesQuery();
  const { data: cities = [], isLoading: loadingCity } = useGetCitiesQuery(
    shippingInfo.rajaongkir_province_id,
    {
      skip: !shippingInfo.rajaongkir_province_id,
    }
  );
  const { data: districts = [], isLoading: loadingDistrict } =
    useGetDistrictsQuery(shippingInfo.rajaongkir_city_id, {
      skip: !shippingInfo.rajaongkir_city_id,
    });

  const [paymentMethod, setPaymentMethod] = useState("");
  const [shippingMethod, setShippingMethod] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const shippingCost =
    shippingMethod === "express"
      ? 15000
      : shippingMethod === "regular"
      ? 10000
      : 0;

  // Calculate subtotal from cart items
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal + shippingCost;

  const handleInputChange = (field: string, value: string) => {
    setShippingInfo((prev) => ({ ...prev, [field]: value }));
  };

  // Map shipping methods to courier codes
  const getCourierInfo = () => {
    switch (shippingMethod) {
      case "express":
        return {
          courier: "jne",
          parameter: JSON.stringify({
            destination: "486",
            weight: 1000,
            height: 0,
            length: 0,
            width: 0,
            diameter: 0,
            courier: "jne"
          }),
          shipment_detail: JSON.stringify({
            name: "Jalur Nugraha Ekakurir (JNE)",
            code: "jne",
            service: "YES",
            description: "JNE Yakin Esok Sampai",
            cost: 15000,
            etd: "1 day"
          })
        };
      case "regular":
        return {
          courier: "jne",
          parameter: JSON.stringify({
            destination: "486",
            weight: 1000,
            height: 0,
            length: 0,
            width: 0,
            diameter: 0,
            courier: "jne"
          }),
          shipment_detail: JSON.stringify({
            name: "Jalur Nugraha Ekakurir (JNE)",
            code: "jne",
            service: "CTC",
            description: "JNE City Courier",
            cost: 10000,
            etd: "2-3 days"
          })
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
            courier: "pickup"
          }),
          shipment_detail: JSON.stringify({
            name: "Ambil di Tempat",
            code: "pickup",
            service: "PICKUP",
            description: "Ambil langsung di toko",
            cost: 0,
            etd: "0 day"
          })
        };
      default:
        return null;
    }
  };

  const [createTransaction] = useCreateTransactionMutation();
  const handleCheckout = async () => {
    if (
      !paymentMethod ||
      !shippingMethod ||
      !shippingInfo.fullName ||
      !shippingInfo.address
    ) {
      alert("Harap lengkapi semua informasi yang diperlukan");
      return;
    }

    setIsLoading(true);

    try {
      const courierInfo = getCourierInfo();
      
      if (!courierInfo) {
        alert("Metode pengiriman tidak valid");
        setIsLoading(false);
        return;
      }

      // Prepare API payload
      const payload = {
        data: [
          {
            shop_id: 1, // You may want to make this dynamic
            details: cartItems.map(item => ({
              product_id: item.id,
              quantity: item.quantity
            })),
            shipment: {
              parameter: courierInfo.parameter,
              shipment_detail: courierInfo.shipment_detail,
              courier: courierInfo.courier,
              cost: shippingCost
            }
          }
        ]
        // voucher: [] // Add if needed
      };

      console.log("Sending payload:", payload);

      // Use the RTK Query mutation instead of direct fetch
      const result = await createTransaction(payload).unwrap();
      
      console.log("Transaction created successfully:", result);

      // Check if the response has the expected structure
      if (
        result &&
        result.data &&
        typeof result.data === "object" &&
        "payment_link" in result.data
      ) {
        // Show success message
        alert(
          `Pesanan berhasil dibuat! Reference: ${
            (result.data as { reference?: string }).reference || "N/A"
          }`
        );

        // Open payment link in new tab
        window.open(
          (result.data as { payment_link: string }).payment_link,
          "_blank"
        );

        // Optional: Clear cart after successful order
        // You might want to add a clearCart function to your cart hook
        clearCart();

        // Optional: Redirect to order history or home page after a delay
        setTimeout(() => {
          router.push("/settings");
        }, 2000);
      } else {
        // Handle unexpected response format
        console.warn("Unexpected response format:", result);
        alert(
          "Pesanan berhasil dibuat, tetapi tidak dapat membuka link pembayaran."
        );
      }

    } catch (error) {
      console.error('Error creating transaction:', error);
      
      // Handle RTK Query error format
      if (error && typeof error === 'object' && 'data' in error) {
        // RTK Query error with server response
        console.error('Server error:', error.data);
        const serverMessage =
          error.data && typeof error.data === "object" && "message" in error.data
            ? (error.data as { message?: string }).message
            : undefined;
        alert(`Terjadi kesalahan: ${serverMessage || 'Silakan coba lagi'}`);
      } else if (error && typeof error === 'object' && 'message' in error) {
        // RTK Query error with message
        alert(`Terjadi kesalahan: ${error.message}`);
      } else {
        // Generic error
        alert("Terjadi kesalahan saat membuat pesanan. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <section className="min-h-screen py-10 px-6 md:px-12 bg-neutral-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-green-600 mb-4">
            Keranjang Kosong
          </h2>
          <p className="text-neutral-600 mb-8">
            Belum ada produk di keranjang Anda
          </p>
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={() => router.push("/product")}
          >
            Lanjutkan Belanja
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen py-10 px-6 md:px-12 bg-neutral-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-green-600 mb-4">
          Checkout Pesanan
        </h2>
        <p className="text-center text-neutral-600 text-base md:text-lg mb-10">
          Tinjau pesanan Anda dan lengkapi informasi pengiriman
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Cart Items & Shipping Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Cart Items */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-green-600" />
                Produk Pesanan ({cartItems.length} item)
              </h3>

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                      <Image
                        src={
                          typeof item.image === "string"
                            ? item.image
                            : item.image instanceof File
                            ? URL.createObjectURL(item.image)
                            : "/placeholder.png"
                        }
                        alt={item.name}
                        width={80}
                        height={100}
                        className="object-contain w-full h-full"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.png";
                        }}
                      />
                    </div>

                    <div className="flex-1">
                      <h4 className="font-semibold text-[#1D1D1D]">
                        {item.name}
                      </h4>
                      <p className="text-sm text-neutral-500">
                        {item.merk_name}
                      </p>
                      <p className="text-green-600 font-bold">
                        Rp {item.price.toLocaleString("id-ID")}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => decreaseItemQuantity(item.id)}
                        className="w-8 h-8 p-0"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => increaseItemQuantity(item.id)}
                        className="w-8 h-8 p-0"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-neutral-500">Subtotal</p>
                      <p className="font-semibold">
                        Rp{" "}
                        {(item.price * item.quantity).toLocaleString("id-ID")}
                      </p>
                    </div>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-600" />
                Informasi Pengiriman
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    value={shippingInfo.fullName}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Masukkan nama lengkap"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Nomor Telepon *
                  </label>
                  <input
                    type="tel"
                    value={shippingInfo.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="08xxxxxxxxxx"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Alamat Lengkap *
                  </label>
                  <textarea
                    value={shippingInfo.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={3}
                    placeholder="Masukkan alamat lengkap (Nama jalan, RT/RW, Kelurahan)"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Provinsi
                  </label>
                  <Combobox
                    value={shippingInfo.rajaongkir_province_id}
                    onChange={(id) => {
                      setShippingInfo({
                        ...shippingInfo,
                        rajaongkir_province_id: id,
                        rajaongkir_city_id: 0,
                        rajaongkir_district_id: 0,
                      });
                    }}
                    data={provinces}
                    isLoading={loadingProvince}
                    getOptionLabel={(item) => item.name}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Kota
                  </label>
                  <Combobox
                    value={shippingInfo.rajaongkir_city_id}
                    onChange={(id) =>
                      setShippingInfo({
                        ...shippingInfo,
                        rajaongkir_city_id: id,
                        rajaongkir_district_id: 0,
                      })
                    }
                    data={cities}
                    isLoading={loadingCity}
                    getOptionLabel={(item) => item.name}
                    disabled={!shippingInfo.rajaongkir_province_id}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Kecamatan
                  </label>
                  <Combobox
                    value={shippingInfo.rajaongkir_district_id}
                    onChange={(id) => setShippingInfo({ ...shippingInfo, rajaongkir_district_id: id })}
                    data={districts}
                    isLoading={loadingDistrict}
                    getOptionLabel={(item) => item.name}
                    disabled={!shippingInfo.rajaongkir_city_id}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Kode Pos
                  </label>
                  <input
                    type="text"
                    value={shippingInfo.postalCode}
                    onChange={(e) =>
                      handleInputChange("postalCode", e.target.value)
                    }
                    className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="16911"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            {/* Shipping Method */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-4">Metode Pengiriman</h3>

              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors">
                  <input
                    type="radio"
                    name="shipping"
                    value="regular"
                    checked={shippingMethod === "regular"}
                    onChange={(e) => setShippingMethod(e.target.value)}
                    className="text-green-600"
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
                    className="text-green-600"
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
                    className="text-green-600"
                  />
                  <div className="flex-1">
                    <p className="font-medium">Ambil di Tempat</p>
                    <p className="text-sm text-neutral-500">Gratis</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-green-600" />
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

            {/* Order Summary */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-4">Ringkasan Pesanan</h3>

              <div className="space-y-3">
                {/* Item details */}
                <div className="space-y-2 pb-3 border-b">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-neutral-600">
                        {item.name} ({item.quantity}x)
                      </span>
                      <span>
                        Rp{" "}
                        {(item.price * item.quantity).toLocaleString("id-ID")}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rp {subtotal.toLocaleString("id-ID")}</span>
                </div>

                <div className="flex justify-between">
                  <span>Ongkos Kirim</span>
                  <span>
                    {shippingCost > 0
                      ? `Rp ${shippingCost.toLocaleString("id-ID")}`
                      : "Gratis"}
                  </span>
                </div>

                <hr className="my-3" />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-green-600">
                    Rp {total.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3"
                size="lg"
                disabled={
                  isLoading ||
                  !paymentMethod ||
                  !shippingMethod ||
                  !shippingInfo.fullName ||
                  !shippingInfo.address
                }
              >
                {isLoading ? "Memproses..." : "Buat Pesanan"}
              </Button>

              {(!paymentMethod ||
                !shippingMethod ||
                !shippingInfo.fullName ||
                !shippingInfo.address ||
                !shippingInfo.kecamatan) && (
                <p className="text-xs text-red-500 mt-2 text-center">
                  * Harap lengkapi semua informasi yang diperlukan
                </p>
              )}
            </div>

            {/* Additional Info */}
            <div className="bg-blue-50 rounded-lg p-4 text-sm">
              <h4 className="font-semibold text-blue-900 mb-2">
                Informasi Penting:
              </h4>
              <ul className="space-y-1 text-blue-700">
                <li>• Pesanan akan diproses setelah pembayaran dikonfirmasi</li>
                <li>
                  • Estimasi waktu pengiriman dihitung dari tanggal pemrosesan
                </li>
                <li>• Hubungi kami jika ada pertanyaan: 0812-3456-7890</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}