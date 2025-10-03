"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Transaction } from "@/types/admin/transaction";
import { useGetTransactionByIdQuery } from "@/services/admin/transaction.service";

type Props = {
  open: boolean;
  onClose: () => void;
  transactionId: number | null; // ⬅️ terima ID
};

// Bentuk item detail di response detail (stores[].details[])
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
  shipment_cost?: number | null;
  shipment_detail?: string | null;
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
  // Fetch detail by ID (skip kalau null)
  const { data, isLoading, isError } = useGetTransactionByIdQuery(
    transactionId ?? 0,
    { skip: transactionId == null }
  );

  if (!open) return null;

  // Saat loading / error
  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={(v) => (!v ? onClose() : null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Memuat detail transaksi...</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground">Mohon tunggu.</div>
        </DialogContent>
      </Dialog>
    );
  }

  if (isError || !data) {
    return (
      <Dialog open={open} onOpenChange={(v) => (!v ? onClose() : null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Gagal memuat detail</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground">
            Terjadi kesalahan saat mengambil data transaksi.
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // `data` adalah Transaction dari transformResponse
  const tx: Transaction & { stores?: StoreItem[] } = data as Transaction & {
    stores?: StoreItem[];
  };

  // Kumpulkan semua detail produk dari tiap store
  const details: StoreDetailItem[] =
    tx.stores?.flatMap((s) => s.details ?? []) ?? [];

  const subtotal = details.reduce((acc, it) => {
    const qty = it.quantity ?? 0;
    const price = it.price ?? 0;
    return acc + qty * price;
  }, 0);

  const statusInfo: Record<number, { text: string; className: string }> = {
    0: { text: "PENDING", className: "bg-neutral-100 text-neutral-700" },
    1: { text: "CAPTURED", className: "bg-blue-100 text-blue-700" },
    2: { text: "SETTLEMENT", className: "bg-green-100 text-green-700" },
    [-1]: { text: "DENY", className: "bg-red-100 text-red-700" },
    [-2]: { text: "EXPIRED", className: "bg-red-100 text-red-700" },
    [-3]: { text: "CANCEL", className: "bg-red-100 text-red-700" },
  };

  const st = statusInfo[tx.status] ?? {
    text: "UNKNOWN",
    className: "bg-neutral-100 text-neutral-700",
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (!v ? onClose() : null)}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detail Pesanan #{tx.reference}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Nomor Pesanan</div>
            <div className="font-medium">#{tx.reference}</div>

            <div className="text-sm text-muted-foreground mt-3">Tanggal</div>
            <div className="font-medium">{formatDate(tx.created_at)}</div>

            <div className="text-sm text-muted-foreground mt-3">Status</div>
            <Badge className={st.className}>{st.text}</Badge>

            <div className="text-sm text-muted-foreground mt-3">
              Metode Pembayaran
            </div>
            <div className="font-medium">
              {tx.payment_link ? "MIDTRANS" : "-"}
            </div>

            {tx.address_line_1 && (
              <>
                <div className="text-sm text-muted-foreground mt-3">
                  Alamat Pengiriman
                </div>
                <div className="font-medium">{tx.address_line_1}</div>
                {tx.postal_code && (
                  <div className="text-sm text-muted-foreground">
                    Kode Pos: {tx.postal_code}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Subtotal</div>
            <div className="font-medium">{formatIDR(subtotal)}</div>

            <div className="text-sm text-muted-foreground mt-3">Diskon</div>
            <div className="font-medium">{formatIDR(tx.discount_total)}</div>

            <div className="text-sm text-muted-foreground mt-3">
              Ongkos Kirim
            </div>
            <div className="font-medium">{formatIDR(tx.shipment_cost)}</div>

            <div className="border-t pt-3 mt-3" />
            <div className="text-sm text-muted-foreground">Total</div>
            <div className="text-lg font-bold text-green-700">
              {formatIDR(tx.grand_total)}
            </div>
          </div>
        </div>

        {/* Tampilkan per-store info (opsional, berguna kalau multi toko) */}
        {tx.stores && tx.stores.length > 0 && (
          <div className="mt-6 space-y-4">
            {tx.stores.map((s) => {
              const storeSubtotal =
                (s.details ?? []).reduce((acc, it) => {
                  const qty = it.quantity ?? 0;
                  const price = it.price ?? 0;
                  return acc + qty * price;
                }, 0) ?? 0;

              return (
                <div key={s.id} className="p-3 rounded-xl border">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">
                      Toko: {s.shop?.name ?? "-"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Kurir: {s.courier ?? "-"}
                    </div>
                  </div>
                  <div className="text-sm">
                    Ongkir Toko: {formatIDR(s.shipment_cost ?? 0)}
                  </div>
                  <div className="text-sm">
                    Subtotal Toko: {formatIDR(storeSubtotal)}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6">
          <div className="font-semibold mb-3">Produk Pesanan</div>
          <div className="space-y-3">
            {details.length === 0 && (
              <div className="text-sm text-muted-foreground">
                Tidak ada produk.
              </div>
            )}

            {details.map((d, i) => {
              const img = pickImage(d);
              const name = pickName(d);
              const qty = d.quantity ?? 0;
              const price = d.price ?? 0;
              return (
                <div
                  key={`${tx.id}-${i}`}
                  className="flex items-center gap-3 p-3 border rounded-xl"
                >
                  <div className="w-14 h-14 relative rounded-lg overflow-hidden">
                    <Image src={img} alt={name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{name}</div>
                    <div className="text-sm text-muted-foreground">
                      Qty: {qty}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatIDR(qty * price)}</div>
                    <div className="text-xs text-muted-foreground">
                      @ {formatIDR(price)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}