"use client";

import { useEffect } from "react";
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
  useEffect(() => {
    if (!form.id) {
      setForm({
        ...form,
        status: true,
      });
    }
  }, [form, setForm]);

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

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
      {/* Header - Fixed */}
      <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-zinc-700 flex-shrink-0">
        <h2 className="text-lg font-semibold">
          {readonly
            ? "Detail Produk"
            : form.id
            ? "Edit Produk"
            : "Tambah Produk"}
        </h2>
        <Button variant="ghost" onClick={onCancel}>
          ✕
        </Button>
      </div>

      {/* Content - Scrollable */}
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
              value={form.price !== undefined ? formatNumber(form.price) : ""}
              onChange={(e) => {
                const raw = e.target.value.replace(/\./g, ""); // hapus titik
                const numberValue = Number(raw);

                setForm({
                  ...form,
                  price: raw === "" ? undefined : numberValue,
                });
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

          <div className="flex flex-col gap-y-1">
            <Label>Berat</Label>
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
            <Label>Panjang</Label>
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
            <Label>Width</Label>
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
            <Label>Height</Label>
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
            <Label>Diameter</Label>
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
              className="border rounded-md px-3 py-2 text-sm bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600"
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

          <div className="flex flex-col gap-y-1 col-span-1">
            <Label>Gambar 1</Label>
            {readonly ? (
              form.image && typeof form.image === "string" ? (
                <Image
                  src={form.image}
                  alt="Preview"
                  className="h-20 object-contain border rounded"
                  width={200}
                  height={200}
                />
              ) : (
                <span className="text-sm text-gray-500">Tidak ada gambar</span>
              )
            ) : (
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setForm({ ...form, image: file });
                }}
              />
            )}
          </div>

          <div className="flex flex-col gap-y-1 col-span-1">
            <Label>Gambar 2</Label>
            {readonly ? (
              form.image_2 && typeof form.image_2 === "string" ? (
                <Image
                  src={form.image_2}
                  alt="Preview"
                  className="h-20 object-contain border rounded"
                  width={200}
                  height={200}
                />
              ) : (
                <span className="text-sm text-gray-500">Tidak ada gambar</span>
              )
            ) : (
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setForm({ ...form, image_2: file });
                }}
              />
            )}
          </div>

          <div className="flex flex-col gap-y-1 col-span-1">
            <Label>Gambar 3</Label>
            {readonly ? (
              form.image_3 && typeof form.image_3 === "string" ? (
                <Image
                  src={form.image_3}
                  alt="Preview"
                  className="h-20 object-contain border rounded"
                  width={200}
                  height={200}
                />
              ) : (
                <span className="text-sm text-gray-500">Tidak ada gambar</span>
              )
            ) : (
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setForm({ ...form, image_3: file });
                }}
              />
            )}
          </div>

          <div className="flex flex-col gap-y-1 col-span-1">
            <Label>Gambar 4</Label>
            {readonly ? (
              form.image_4 && typeof form.image_4 === "string" ? (
                <Image
                  src={form.image_4}
                  alt="Preview"
                  className="h-20 object-contain border rounded"
                  width={200}
                  height={200}
                />
              ) : (
                <span className="text-sm text-gray-500">Tidak ada gambar</span>
              )
            ) : (
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setForm({ ...form, image_4: file });
                }}
              />
            )}
          </div>

          <div className="flex flex-col gap-y-1 col-span-1">
            <Label>Gambar 5</Label>
            {readonly ? (
              form.image_5 && typeof form.image_5 === "string" ? (
                <Image
                  src={form.image_5}
                  alt="Preview"
                  className="h-20 object-contain border rounded"
                  width={200}
                  height={200}
                />
              ) : (
                <span className="text-sm text-gray-500">Tidak ada gambar</span>
              )
            ) : (
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setForm({ ...form, image_5: file });
                }}
              />
            )}
          </div>

          <div className="flex flex-col gap-y-1 col-span-1">
            <Label>Gambar 6</Label>
            {readonly ? (
              form.image_6 && typeof form.image_6 === "string" ? (
                <Image
                  src={form.image_6}
                  alt="Preview"
                  className="h-20 object-contain border rounded"
                  width={200}
                  height={200}
                />
              ) : (
                <span className="text-sm text-gray-500">Tidak ada gambar</span>
              )
            ) : (
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setForm({ ...form, image_6: file });
                }}
              />
            )}
          </div>

          <div className="flex flex-col gap-y-1 col-span-1">
            <Label>Gambar 7</Label>
            {readonly ? (
              form.image_7 && typeof form.image_7 === "string" ? (
                <Image
                  src={form.image_7}
                  alt="Preview"
                  className="h-20 object-contain border rounded"
                  width={200}
                  height={200}
                />
              ) : (
                <span className="text-sm text-gray-500">Tidak ada gambar</span>
              )
            ) : (
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setForm({ ...form, image_7: file });
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Footer/Actions - Fixed */}
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
