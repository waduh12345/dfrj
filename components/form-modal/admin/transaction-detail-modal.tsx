"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Transaction } from "@/types/admin/transaction";
import { useGetTransactionByIdQuery } from "@/services/admin/transaction.service";
import { 
  MapPin, 
  Calendar, 
  CreditCard, 
  Package, 
  Store,
  Receipt
} from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  transactionId: number | null;
};

// Update Type untuk mengakomodasi receipt_code & shipment_status
type StoreDetailItem = {
  id?: number | string;
  product_id?: number;
  quantity?: number;
  price?: number;
  product_name?: string;
  image?: string | null;
  product?: {
    name?: string;
    image?: string | null;
    media?: Array<{ original_url: string }>;
  } | null;
};

type StoreItem = {
  id: number;
  details?: StoreDetailItem[];
  shop?: {
    name?: string;
  } | null;
  courier?: string | null;
  service?: string | null; // Contoh jika ada service jne (REG/YES)
  shipment_cost?: number | null;
  receipt_code?: string | null; // ⬅️ Tambahan
  shipment_status?: string | null; // ⬅️ Tambahan
};

const formatIDR = (n: number | string) => {
  const v = typeof n === "string" ? Number(n) : n;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(Number.isFinite(v) ? v : 0)
    .replace("IDR", "Rp");
};

const formatDate = (iso?: string) => {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
};

const pickImage = (d?: StoreDetailItem): string => {
  if (!d) return "/api/placeholder/64/64";
  if (d.image) return d.image;
  if (d.product?.image) return d.product.image || "/api/placeholder/64/64";
  const media0 = d.product?.media?.[0]?.original_url;
  return media0 ?? "/api/placeholder/64/64";
};

const pickName = (d?: StoreDetailItem): string => {
  if (!d) return "Produk";
  return d.product?.name ?? d.product_name ?? "Produk";
};

export default function TransactionDetailModal({
  open,
  onClose,
  transactionId,
}: Props) {
  const { data, isLoading, isError } = useGetTransactionByIdQuery(
    transactionId ?? 0,
    { skip: transactionId == null }
  );

  if (!open) return null;

  // Loading State
  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={(v) => (!v ? onClose() : null)}>
        <DialogContent className="max-w-md">
          <div className="flex flex-col items-center justify-center p-6 space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-sm text-muted-foreground">Memuat detail transaksi...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Error State
  if (isError || !data) {
    return (
      <Dialog open={open} onOpenChange={(v) => (!v ? onClose() : null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive">Gagal Memuat</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground">
            Terjadi kesalahan saat mengambil data transaksi. Silakan coba lagi.
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Casting data
  const tx: Transaction & { stores?: StoreItem[] } = data as Transaction & { stores?: StoreItem[] };

  // Status Badge Logic
  const statusInfo: Record<number, { text: string; className: string }> = {
    0: { text: "PENDING", className: "bg-gray-100 text-gray-700 hover:bg-gray-100" },
    1: { text: "CAPTURED (PAID)", className: "bg-blue-100 text-blue-700 hover:bg-blue-100" },
    2: { text: "SETTLEMENT", className: "bg-green-100 text-green-700 hover:bg-green-100" },
    [-1]: { text: "DENY", className: "bg-red-100 text-red-700 hover:bg-red-100" },
    [-2]: { text: "EXPIRED", className: "bg-orange-100 text-orange-700 hover:bg-orange-100" },
    [-3]: { text: "CANCEL", className: "bg-red-100 text-red-700 hover:bg-red-100" },
  };

  const st = statusInfo[tx.status] ?? {
    text: "UNKNOWN",
    className: "bg-gray-100 text-gray-700",
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (!v ? onClose() : null)}>
      {/* max-h-[90vh] dan overflow-y-auto membuat modal bisa di-scroll */}
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col gap-0 p-0">
        
        {/* HEADER: Fixed sticky header opsional, atau biarkan scroll */}
        <div className="p-6 pb-4 border-b">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl">Detail Transaksi</DialogTitle>
              <Badge className={`${st.className} px-3 py-1 text-xs font-semibold border-0`}>
                {st.text}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
              <span className="font-mono bg-muted px-1 rounded">#{tx.reference}</span>
              <span>•</span>
              <Calendar className="w-3 h-3" />
              <span>{formatDate(tx.created_at)}</span>
            </div>
          </DialogHeader>
        </div>

        {/* BODY CONTENT */}
        <div className="p-6 space-y-6">
          
          {/* 1. Informasi Pengiriman & Pembayaran (Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Alamat */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" /> Alamat Pengiriman
              </h3>
              <div className="text-sm text-muted-foreground border rounded-lg p-3 bg-muted/20">
                <p className="font-medium text-foreground">{tx.user_name || tx.guest_name}</p>
                <p>{tx.address_line_1}</p>
                {tx.postal_code && <p>Kode Pos: {tx.postal_code}</p>}
                <p className="mt-1 text-xs text-muted-foreground">{tx.guest_phone}</p>
              </div>
            </div>

            {/* Rincian Pembayaran */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-primary" /> Rincian Pembayaran
              </h3>
              <div className="border rounded-lg p-3 bg-muted/20 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Harga Produk</span>
                  <span>{formatIDR(tx.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Ongkos Kirim</span>
                  <span>{formatIDR(tx.shipment_cost)}</span>
                </div>
                {Number(tx.discount_total) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Total Diskon</span>
                    <span>-{formatIDR(tx.discount_total)}</span>
                  </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Bayar</span>
                  <span className="text-primary">{formatIDR(tx.grand_total)}</span>
                </div>
                {tx.payment_link && (
                    <div className="text-xs text-right text-muted-foreground mt-1">
                        Via Payment Gateway
                    </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* 2. Daftar Produk per Toko (Pengiriman biasanya per toko) */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" /> Rincian Pesanan
            </h3>

            {(!tx.stores || tx.stores.length === 0) && (
               <div className="text-center py-4 text-muted-foreground text-sm">
                 Tidak ada detail toko.
               </div>
            )}

            {tx.stores?.map((store, idx) => (
              <div key={store.id || idx} className="border rounded-xl overflow-hidden shadow-sm">
                
                {/* Header Toko & Pengiriman */}
                <div className="bg-muted/30 p-3 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <Store className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold text-sm">{store.shop?.name || "Toko"}</span>
                    </div>

                    {/* Info Pengiriman (Kurir, Resi, Status) */}
                    <div className="flex flex-wrap gap-2 text-xs items-center justify-end">
                        
                        {store.receipt_code && (
                            <div className="flex items-center gap-1 bg-white border px-2 py-1 rounded" title="Nomor Resi">
                                <Receipt className="w-3 h-3 text-orange-600" />
                                <span className="font-mono font-medium">{store.receipt_code}</span>
                            </div>
                        )}

                        <Badge
                          variant={
                            store.shipment_status === 1
                              ? "secondary"
                              : store.shipment_status === 2
                              ? "success"
                              : store.shipment_status === 3
                              ? "outline"
                              : store.shipment_status === 4
                              ? "destructive"
                              : "default"
                          }
                          className="text-[10px] h-6"
                        >
                          {(() => {
                            switch (store.shipment_status) {
                              case 0:
                                return "Menunggu";
                              case 1:
                                return "Dikirim";
                              case 2:
                                return "Diterima";
                              case 3:
                                return "Dikembalikan";
                              case 4:
                                return "Dibatalkan";
                              default:
                                return "PENDING";
                            }
                          })()}
                        </Badge>
                    </div>
                </div>

                {/* List Produk dalam Toko ini */}
                <div className="p-3 space-y-3 bg-white">
                  {(store.details ?? []).map((detail, dIdx) => {
                    const img = pickImage(detail);
                    const name = pickName(detail);
                    const qty = detail.quantity ?? 0;
                    const price = detail.price ?? 0;

                    return (
                      <div key={dIdx} className="flex gap-3 items-start">
                        <div className="relative w-16 h-16 rounded-md overflow-hidden border flex-shrink-0 bg-gray-50">
                          <Image 
                            src={img} 
                            alt={name} 
                            fill 
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-2 text-foreground">
                            {name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {qty} x {formatIDR(price)}
                          </p>
                        </div>
                        <div className="text-right font-medium text-sm">
                          {formatIDR(qty * price)}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Footer Toko (Subtotal Toko) */}
                <div className="bg-gray-50 p-2 text-right text-xs text-muted-foreground border-t">
                    Ongkir Toko: {formatIDR(tx.shipment_cost ?? 0)}
                </div>
              </div>
            ))}
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}