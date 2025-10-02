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

type Props = {
  open: boolean;
  onClose: () => void;
  transaction: Transaction | null;
};

type DetailItem = {
  id?: number | string;
  product_id?: number;
  quantity?: number;
  price?: number;
  product_name?: string;
  image?: string | null;
  product?: {
    name?: string;
    image?: string;
    media?: Array<{ original_url: string }>;
  } | null;
};

const pickImage = (d?: DetailItem): string => {
  if (!d) return "/api/placeholder/64/64";
  if (typeof d.image === "string" && d.image) return d.image;
  if (d.product?.image) return d.product.image;
  const media0 = d.product?.media?.[0]?.original_url;
  if (media0) return media0;
  return "/api/placeholder/64/64";
};

const pickName = (d?: DetailItem): string => {
  if (!d) return "Produk";
  return d.product?.name ?? d.product_name ?? "Produk";
};

const formatIDR = (n: number | string) => {
  const v = typeof n === "string" ? Number(n) : n;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(isNaN(v) ? 0 : v)
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

export default function TransactionDetailModal({
  open,
  onClose,
  transaction,
}: Props) {
  if (!transaction) return null;

  const details =
    (transaction as unknown as { details?: DetailItem[] }).details ?? [];
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

  const st = statusInfo[transaction.status] ?? {
    text: "UNKNOWN",
    className: "bg-neutral-100 text-neutral-700",
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (!v ? onClose() : null)}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detail Pesanan #{transaction.reference}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Nomor Pesanan</div>
            <div className="font-medium">#{transaction.reference}</div>

            <div className="text-sm text-muted-foreground mt-3">Tanggal</div>
            <div className="font-medium">
              {formatDate(transaction.created_at)}
            </div>

            <div className="text-sm text-muted-foreground mt-3">Status</div>
            <Badge className={st.className}>{st.text}</Badge>

            <div className="text-sm text-muted-foreground mt-3">
              Metode Pembayaran
            </div>
            <div className="font-medium">
              {transaction.payment_link ? "MIDTRANS" : "-"}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Subtotal</div>
            <div className="font-medium">{formatIDR(subtotal)}</div>

            <div className="text-sm text-muted-foreground mt-3">Diskon</div>
            <div className="font-medium">
              {formatIDR(transaction.discount_total)}
            </div>

            <div className="text-sm text-muted-foreground mt-3">
              Ongkos Kirim
            </div>
            <div className="font-medium">
              {formatIDR(transaction.shipment_cost)}
            </div>

            <div className="border-t pt-3 mt-3" />
            <div className="text-sm text-muted-foreground">Total</div>
            <div className="text-lg font-bold text-green-700">
              {formatIDR(transaction.grand_total)}
            </div>
          </div>
        </div>

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
                  key={`${transaction.id}-${i}`}
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