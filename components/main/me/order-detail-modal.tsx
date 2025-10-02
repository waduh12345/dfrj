"use client";

import Image from "next/image";
import { JSX } from "react";
import { X, Truck } from "lucide-react";
import { OrderStatus } from "@/lib/status-order";

interface OrderItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

export interface OrderForDetail {
  id: string;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  trackingNumber?: string;

  // === field opsional untuk melengkapi UI ===
  payment_method?: string;
  grand_total?: number;
  discount_total?: number;
  shipment_cost?: number;
  cod?: number;
  address_line_1?: string;
  postal_code?: string;
}

interface OrderDetailModalProps {
  open: boolean;
  onClose: () => void;
  order: OrderForDetail;
}

const getStatusColor = (status: OrderStatus): string => {
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

const getStatusText = (status: OrderStatus): string => {
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

export default function OrderDetailModal({
  open,
  onClose,
  order,
}: OrderDetailModalProps): JSX.Element | null {
  if (!open) return null;

  const subtotal = order.items.reduce(
    (acc, it) => acc + it.price * it.quantity,
    0
  );

  // total final: gunakan grand_total jika tersedia, fallback ke total lama
  const finalTotal =
    typeof order.grand_total === "number" ? order.grand_total : order.total;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">
            Detail Pesanan #{order.orderNumber}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Informasi Pesanan */}
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Informasi Pesanan
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nomor Pesanan:</span>
                  <span className="font-medium">#{order.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tanggal:</span>
                  <span className="font-medium">
                    {new Date(order.date).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusText(order.status)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Metode Pembayaran:</span>
                  <span className="font-medium uppercase">
                    {order.payment_method || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Rincian Pembayaran */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Rincian Pembayaran
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">
                    Rp {subtotal.toLocaleString("id-ID")}
                  </span>
                </div>
                {typeof order.shipment_cost === "number" &&
                  order.shipment_cost > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ongkos Kirim:</span>
                      <span className="font-medium">
                        Rp {order.shipment_cost.toLocaleString("id-ID")}
                      </span>
                    </div>
                  )}
                {typeof order.cod === "number" && order.cod > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fee COD:</span>
                    <span className="font-medium">
                      Rp {order.cod.toLocaleString("id-ID")}
                    </span>
                  </div>
                )}
                {typeof order.discount_total === "number" &&
                  order.discount_total > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Diskon:</span>
                      <span className="font-medium text-green-600">
                        -Rp {order.discount_total.toLocaleString("id-ID")}
                      </span>
                    </div>
                  )}
                <div className="border-t pt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Total:</span>
                    <span className="font-bold text-[#A3B18A]">
                      Rp {finalTotal.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Alamat & Resi */}
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Alamat Pengiriman
              </h4>
              <div className="text-sm">
                <p className="text-gray-800">{order.address_line_1 || "-"}</p>
                {order.postal_code && (
                  <p className="text-gray-600">{order.postal_code}</p>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Nomor Resi</h4>
              <div className="text-sm">
                {order.trackingNumber ? (
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-600">
                      {order.trackingNumber}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Truck className="w-4 h-4" />
                    <span>Belum ada nomor resi</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Produk Pesanan */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Produk Pesanan</h4>
          <div className="space-y-4">
            {order.items.map((d) => (
              <div
                key={d.id}
                className="flex items-center gap-4 p-4 border rounded-lg"
              >
                <div className="w-16 h-16 relative rounded-lg overflow-hidden">
                  <Image
                    src={d.image}
                    alt={d.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h5 className="font-semibold text-gray-900">{d.name}</h5>
                  <p className="text-sm text-gray-600">Qty: {d.quantity}</p>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    Rp {(d.price * d.quantity).toLocaleString("id-ID")}
                  </div>
                  <div className="text-sm text-gray-500">
                    @Rp {d.price.toLocaleString("id-ID")}
                  </div>
                </div>
              </div>
            ))}
            {order.items.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                Tidak ada produk.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}