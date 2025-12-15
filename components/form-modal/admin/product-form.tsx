"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/admin/product";
import { Combobox } from "@/components/ui/combo-box";
import { useGetProductCategoryListQuery } from "@/services/master/product-category.service";
import Image from "next/image";
import { formatNumber } from "@/lib/format";

import "suneditor/dist/css/suneditor.min.css";

const SunEditor = dynamic(() => import("suneditor-react"), { 
  ssr: false,
  loading: () => <div className="h-32 w-full bg-muted animate-pulse rounded-md" />
});

interface FormProductProps {
  form: Partial<Product>;
  // Update tipe setForm agar mendukung functional update
  setForm: React.Dispatch<React.SetStateAction<Partial<Product>>>;
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

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !form.id && form.status === undefined) {
      // Gunakan functional update di sini juga untuk konsistensi
      setForm((prev) => ({
        ...prev,
        status: true,
      }));
    }
  }, [mounted]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSunUpload = useCallback(
    (
      files: File[],
      _info: object,
      uploadHandler: (data: {
        result?: { url: string; name?: string; size?: number }[];
        errorMessage?: string;
      }) => void
    ): boolean => {
      return true; 
    },
    []
  );

  const { data: categoryResponse, isLoading: categoryLoading } =
    useGetProductCategoryListQuery({
      page: 1,
      paginate: 100,
    });

  const categoryData = categoryResponse?.data ?? [];

  if (!mounted) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-zinc-700 flex-shrink-0">
          <h2 className="text-lg font-semibold">Loading...</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-3/4"></div>
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
          <div className="flex flex-col gap-y-1 col-span-2">
            <Label>Kategori Produk </Label>
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
                  // PENTING: Gunakan functional update
                  setForm((prev) => ({ ...prev, product_category_id: val }))
                }
                data={categoryData}
                isLoading={categoryLoading}
                getOptionLabel={(item) => item.name}
                placeholder="Pilih Kategori Produk"
              />
            )}
          </div>
          
          <div className="flex flex-col gap-y-1 col-span-2">
            <Label>Nama</Label>
            <Input
              value={form.name || ""}
              onChange={(e) => {
                 const val = e.target.value;
                 setForm((prev) => ({ ...prev, name: val }));
              }}
              readOnly={readonly}
            />
          </div>

          {/* --- BAGIAN DESKRIPSI (SunEditor) --- */}
          <div className="flex flex-col gap-y-1 col-span-2">
            <Label>Deskripsi</Label>
            <div className="sun-editor-wrapper text-black">
              <SunEditor
                // Gunakan defaultValue agar editor tidak re-render saat state berubah
                // setContents={form.description || ""} <--- Ganti ini jika cursor lompat
                setContents={form.description || ""} 
                onChange={(content) => {
                  // PERBAIKAN UTAMA DI SINI:
                  // Jangan gunakan setForm({ ...form, description: content })
                  // Gunakan (prev) => ... agar mengambil state TERBARU, bukan state saat render awal
                  setForm((prev) => ({ ...prev, description: content }));
                }}
                setOptions={{
                  minHeight: "200px",
                  maxHeight: "500px",
                  buttonList: [
                    ["undo", "redo"],
                    ["bold", "italic", "underline", "strike"],
                    ["fontColor", "hiliteColor"],
                    ["align", "list"],
                    ["link", "image", "video"],
                    ["codeView"],
                    ["fullScreen", "showBlocks"]
                  ],
                }}
                onImageUploadBefore={handleSunUpload}
              />
            </div>
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
                  setForm((prev) => ({
                    ...prev,
                    price: raw === "" ? undefined : numberValue,
                  }));
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
                setForm((prev) => ({
                  ...prev,
                  stock: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
              readOnly={readonly}
            />
          </div>

          <div className="flex flex-col gap-y-1">
            <Label>Berat (gram)</Label>
            <Input
              type="number"
              value={form.weight ?? ""}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  weight: e.target.value ? Number(e.target.value) : undefined,
                }))
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
                setForm((prev) => ({
                  ...prev,
                  length: e.target.value ? Number(e.target.value) : undefined,
                }))
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
                setForm((prev) => ({
                  ...prev,
                  width: e.target.value ? Number(e.target.value) : undefined,
                }))
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
                setForm((prev) => ({
                  ...prev,
                  height: e.target.value ? Number(e.target.value) : undefined,
                }))
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
                setForm((prev) => ({
                  ...prev,
                  diameter: e.target.value ? Number(e.target.value) : undefined,
                }))
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
                setForm((prev) => ({ ...prev, status: e.target.value === "1" }))
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
                      setForm((prev) => ({ ...prev, [imageKey]: file || null }));
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