"use client";

import { Tag } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useMemo } from "react";
import { useGetVoucherListQuery } from "@/services/voucher.service";
import type { Voucher } from "@/types/voucher";

type Props = {
  selected: Voucher | null;
  onChange: (v: Voucher | null) => void;
};

export default function VoucherPicker({ selected, onChange }: Props) {
  const { data, isLoading, isError } = useGetVoucherListQuery({
    page: 1,
    paginate: 50,
  });

  const vouchers: Voucher[] = useMemo(() => {
    const list: Voucher[] = (data?.data ?? []) as Voucher[];
    const now = new Date();
    return list.filter((v) => {
      if (!v.status) return false;
      const s = new Date(v.start_date);
      const e = new Date(v.end_date);
      return now >= s && now <= e;
    });
  }, [data]);

  const placeholder = isLoading
    ? "Memuat voucher…"
    : isError
    ? "Gagal memuat voucher"
    : vouchers.length === 0
    ? "Tidak ada voucher aktif"
    : "Pilih voucher";

  const formatVoucherLabel = (v: Voucher) =>
    v.type === "fixed"
      ? `${v.code} — ${v.name} • Rp ${v.fixed_amount.toLocaleString("id-ID")}`
      : `${v.code} — ${v.name} • ${v.percentage_amount}%`;

  return (
    <div className="w-full">
      {/* Header ringkas & menarik */}
      <div className="mb-2 flex items-center gap-2">
        <div className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-neutral-100">
          <Tag className="h-4 w-4 text-neutral-700" />
        </div>
        <h3 className="text-sm font-semibold text-neutral-900">Voucher</h3>
      </div>

      {/* Select full width */}
      <Select
        value={selected ? String(selected.id) : "none"}
        onValueChange={(val) => {
          if (val === "none") return onChange(null);
          const found = vouchers.find((v) => String(v.id) === val) ?? null;
          onChange(found);
        }}
        disabled={isLoading || isError || vouchers.length === 0}
      >
        <SelectTrigger
          className="w-full h-12 rounded-2xl border-neutral-200 bg-white px-4 text-left shadow-sm hover:bg-neutral-50 focus:ring-2 focus:ring-neutral-300"
          aria-label="Pilih voucher"
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        {/* Dropdown selalu ke bawah, lebar mengikuti trigger, tinggi menyesuaikan */}
        <SelectContent
          position="popper"
          side="bottom"
          align="start"
          avoidCollisions={false}
          className="w-[var(--radix-select-trigger-width)] max-h-64 overflow-auto rounded-xl shadow-xl"
        >
          <SelectItem value="none">Tanpa Voucher</SelectItem>
          {vouchers.map((v) => (
            <SelectItem key={v.id} value={String(v.id)}>
              {formatVoucherLabel(v)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Detail voucher — hanya muncul saat ada pilihan, jadi tidak ada space kosong */}
      {selected && (
        <div className="mt-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-neutral-900 px-2 py-1 text-xs font-medium text-white">
              {selected.code}
            </span>
            <span className="text-sm font-semibold text-neutral-900">
              {selected.name}
            </span>
          </div>

          {selected.description && (
            <p className="mt-2 text-sm text-neutral-700">
              {selected.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-md bg-white px-2 py-1 text-neutral-700">
              {selected.type === "fixed"
                ? `Potongan Rp ${selected.fixed_amount.toLocaleString("id-ID")}`
                : `Diskon ${selected.percentage_amount}%`}
            </span>
            <span className="text-neutral-400">•</span>
            <span className="text-neutral-600">
              Berlaku s/d{" "}
              {new Date(selected.end_date).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}