"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/admin/product";
import { Combobox } from "@/components/ui/combo-box";
import { useGetProductCategoryListQuery } from "@/services/master/product-category.service";
import { useGetProductMerkListQuery } from "@/services/master/product-merk.service";
import Image from "next/image";
import { formatNumber } from "@/lib/format";

interface FormProductProps {
  form: Partial<Product>;
  setForm: (data: Partial<Product>) => void;
  onCancel: () => void;
  onSubmit: () => void;
  readonly?: boolean;
  isLoading?: boolean;
}

export default function FormProduct({
  form,
  setForm,
  onCancel,
  onSubmit,
  readonly = false,
  isLoading = false,
}: FormProductProps) {
  const [mounted, setMounted] = useState(false);

  // Effect to handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Effect to initialize default form values once on the client
  useEffect(() => {
    // We only want this to run once after mounting, for new products
    if (mounted && !form.id && form.status === undefined) {
      setForm({
        ...form,
        status: true, // Default status to active for new products
      });
    }
    // This effect should only run when `mounted` changes.
    // The other dependencies can cause re-initialization loops.
  }, [mounted]);

  // ✨ IMPROVEMENT: This useEffect was creating a memory leak by generating
  // URLs inside the cleanup function. Since no preview URLs are being created
  // in the first place, this entire effect can be safely removed.
  // useEffect(() => { ... });

  const { data: categoryResponse, isLoading: categoryLoading } =
    useGetProductCategoryListQuery({
      page: 1,
      paginate: 100,
    });

  const { data: merkResponse, isLoading: merkLoading } =
    useGetProductMerkListQuery({
      page: 1,
      paginate: 100,
    });

  const categoryData = categoryResponse?.data ?? [];
  const merkData = merkResponse?.data ?? [];

  // Show a loading skeleton before the component is mounted on the client
  if (!mounted) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-zinc-700 flex-shrink-0">
          <h2 className="text-lg font-semibold">Loading...</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-zinc-700 flex-shrink-0">
        <h2 className="text-lg font-semibold">
          {readonly
            ? "Detail Produk"
            : form.id
            ? "Edit Produk"
            : "Tambah Produk"}
        </h2>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          ✕
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-y-1">
            <Label>Kategori Produk</Label>
            {readonly ? (
              <Input
                readOnly
                value={
                  categoryData.find((c) => c.id === form.product_category_id)
                    ?.name ?? "-"
                }
              />
            ) : (
              <Combobox
                value={form.product_category_id ?? null}
                onChange={(val) =>
                  setForm({ ...form, product_category_id: val })
                }
                data={categoryData}
                isLoading={categoryLoading}
                getOptionLabel={(item) => item.name}
                placeholder="Pilih Kategori Produk"
                // ✨ IMPROVEMENT: The key prop is no longer needed.
              />
            )}
          </div>

          <div className="flex flex-col gap-y-1">
            <Label>Merk Produk</Label>
            {readonly ? (
              <Input
                readOnly
                value={
                  merkData.find((m) => m.id === form.product_merk_id)?.name ??
                  "-"
                }
              />
            ) : (
              <Combobox
                value={form.product_merk_id ?? null}
                onChange={(val) => setForm({ ...form, product_merk_id: val })}
                data={merkData}
                isLoading={merkLoading}
                getOptionLabel={(item) => item.name}
                placeholder="Pilih Merk Produk"
                // ✨ IMPROVEMENT: The key prop is no longer needed.
              />
            )}
          </div>

          <div className="flex flex-col gap-y-1 col-span-2">
            <Label>Nama</Label>
            <Input
              value={form.name || ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              readOnly={readonly}
            />
          </div>

          <div className="flex flex-col gap-y-1 col-span-2">
            <Label>Deskripsi</Label>
            <Textarea
              value={form.description || ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              readOnly={readonly}
            />
          </div>

          <div className="flex flex-col gap-y-1">
            <Label>Harga</Label>
            <Input
              type="text"
              inputMode="numeric"
              value={
                form.price !== undefined && form.price !== null
                  ? formatNumber(form.price)
                  : ""
              }
              onChange={(e) => {
                const raw = e.target.value.replace(/\./g, "");
                const numberValue = Number(raw);
                if (!isNaN(numberValue)) {
                  setForm({
                    ...form,
                    price: raw === "" ? undefined : numberValue,
                  });
                }
              }}
              readOnly={readonly}
            />
          </div>

          <div className="flex flex-col gap-y-1">
            <Label>Stok</Label>
            <Input
              type="number"
              value={form.stock ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  stock: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              readOnly={readonly}
            />
          </div>
          
          {/* ... other input fields remain the same ... */}
          <div className="flex flex-col gap-y-1">
            <Label>Berat (gram)</Label>
            <Input
              type="number"
              value={form.weight ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  weight: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              readOnly={readonly}
            />
          </div>

          <div className="flex flex-col gap-y-1">
            <Label>Panjang (cm)</Label>
            <Input
              type="number"
              value={form.length ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  length: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              readOnly={readonly}
            />
          </div>

          <div className="flex flex-col gap-y-1">
            <Label>Lebar (cm)</Label>
            <Input
              type="number"
              value={form.width ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  width: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              readOnly={readonly}
            />
          </div>

          <div className="flex flex-col gap-y-1">
            <Label>Tinggi (cm)</Label>
            <Input
              type="number"
              value={form.height ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  height: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              readOnly={readonly}
            />
          </div>

          <div className="flex flex-col gap-y-1">
            <Label>Diameter (cm)</Label>
            <Input
              type="number"
              value={form.diameter ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  diameter: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              readOnly={readonly}
            />
          </div>

          <div className="flex flex-col gap-y-1">
            <Label>Status</Label>
            <select
              className="border rounded-md px-3 py-2 text-sm bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 focus:ring-2 focus:ring-blue-500"
              value={form.status ? "1" : "0"}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value === "1" })
              }
              disabled={readonly}
            >
              <option value="1">Aktif</option>
              <option value="0">Nonaktif</option>
            </select>
          </div>

          {/* Image Upload Fields */}
          {[1, 2, 3, 4, 5, 6, 7].map((imageNum) => {
            const imageKey =
              imageNum === 1 ? "image" : (`image_${imageNum}` as keyof Product);
            const imageValue = form[imageKey];

            return (
              <div key={imageKey} className="flex flex-col gap-y-1 col-span-1">
                <Label>Gambar {imageNum}</Label>
                {readonly ? (
                  imageValue && typeof imageValue === "string" ? (
                    <Image
                      src={imageValue}
                      alt={`Gambar produk ${imageNum}`}
                      className="h-24 w-24 object-contain border rounded-md"
                      width={96}
                      height={96}
                    />
                  ) : (
                    <span className="text-sm text-gray-500">
                      Tidak ada gambar
                    </span>
                  )
                ) : (
                  <Input
                    type="file"
                    accept="image/*"
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      setForm({ ...form, [imageKey]: file || null });
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      {!readonly && (
        <div className="p-6 border-t border-gray-200 dark:border-zinc-700 flex justify-end gap-2 flex-shrink-0">
          <Button variant="outline" onClick={onCancel}>
            Batal
          </Button>
          <Button onClick={onSubmit} disabled={isLoading}>
            {isLoading ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      )}
    </div>
  );
}