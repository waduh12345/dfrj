"use client";

import { useMemo, useState } from "react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useModal from "@/hooks/use-modal";
import {
  useGetProductListQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "@/services/admin/product.service";
import { Product } from "@/types/admin/product";
import FormProduct from "@/components/form-modal/admin/product-form";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";

export default function ProductPage() {
  const { data: session } = useSession();

  const [form, setForm] = useState<Partial<Product>>({
    status: true,
  });
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [readonly, setReadonly] = useState(false);
  const { isOpen, openModal, closeModal } = useModal();
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, refetch } = useGetProductListQuery({
    page: currentPage,
    paginate: itemsPerPage,
  });

  const categoryList = useMemo(() => data?.data || [], [data]);
  const lastPage = useMemo(() => data?.last_page || 1, [data]);

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const handleSubmit = async () => {
    try {
      const payload = new FormData();

      // === REQUIRED FIELDS ===
      if (session?.user.shop?.id) {
        payload.append("shop_id", `${session.user.shop.id}`);
      } else {
        // Fallback jika session belum load, sesuaikan dengan logic aplikasi Anda
        // payload.append("shop_id", "1"); 
        throw new Error("Session shop ID not found");
      }

      // Numeric fields
      payload.append("price", form.price ? `${form.price}` : "0");
      payload.append("stock", form.stock ? `${form.stock}` : "0");
      payload.append("weight", form.weight ? `${form.weight}` : "0");
      payload.append("length", form.length ? `${form.length}` : "0");
      payload.append("width", form.width ? `${form.width}` : "0");
      payload.append("height", form.height ? `${form.height}` : "0");

      // === OPTIONAL FIELDS ===
      if (form.name) payload.append("name", form.name);
      if (form.description) payload.append("description", form.description);
      if (form.product_category_id)
        payload.append("product_category_id", `${form.product_category_id}`);
      if (form.product_merk_id)
        payload.append("product_merk_id", `${form.product_merk_id}`); // Pastikan ambil dari form
      
      // Status handling
      // Pastikan konversi boolean ke "1" atau "0" konsisten
      const statusValue = form.status === true || form.status === 1 ? "1" : "0";
      payload.append("status", statusValue);

      // === IMAGE HANDLING (PERBAIKAN UTAMA DISINI) ===
      const imageFields = [
        "image",
        "image_2",
        "image_3",
        "image_4",
        "image_5",
        "image_6",
        "image_7",
      ];

      imageFields.forEach((fieldName) => {
        const imageValue = form[fieldName as keyof Product];

        // HANYA append jika user mengupload file baru (File Object)
        if (imageValue instanceof File) {
          payload.append(fieldName, imageValue);
        }
        
      });

      if (editingSlug) {
        // === MODE EDIT ===
        payload.append("_method", "PUT"); // Method spoofing untuk Laravel/PHP
        await updateProduct({ slug: editingSlug, payload }).unwrap();
        Swal.fire("Sukses", "Produk diperbarui", "success");
      } else {
        // === MODE CREATE ===
        // Validasi: Gambar utama wajib ada saat create
        if (!(form.image instanceof File)) {
          // Opsional: Anda bisa throw error atau biarkan backend validasi
          // throw new Error("Gambar utama wajib diisi");
        }
        await createProduct(payload).unwrap();
        Swal.fire("Sukses", "Produk ditambahkan", "success");
      }

      // Reset & Close
      setForm({ status: true });
      setEditingSlug(null);
      await refetch();
      closeModal();
    } catch (error: unknown) {
      console.error("Submit error:", error);
      let msg = "Terjadi kesalahan";
      if (typeof error === "object" && error !== null) {
        type ErrorWithMessage = {
          data?: { message?: string };
          message?: string;
        };
        const err = error as ErrorWithMessage;
        if ("data" in err && typeof err.data?.message === "string") {
          msg = err.data.message;
        } else if ("message" in err && typeof err.message === "string") {
          msg = err.message;
        }
      }
      Swal.fire("Gagal", msg, "error");
    }
  };

  const handleEdit = (item: Product) => {
    // Pastikan status dinormalisasi menjadi boolean agar Switch/Select di form terbaca benar
    const normalizedStatus = item.status === true || item.status === 1;
    
    setForm({ 
      ...item, 
      status: normalizedStatus,
      // Jika backend mengirim 'price' sebagai string "100.000", pastikan di-parse
      // Tapi biasanya FormProduct menghandle raw value
    });
    
    setEditingSlug(item.slug);
    setReadonly(false);
    openModal();
  };

  const handleDetail = (item: Product) => {
    setForm(item);
    setReadonly(true);
    openModal();
  };

  const handleDelete = async (item: Product) => {
    const confirm = await Swal.fire({
      title: "Yakin hapus Produk?",
      text: item.name,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      confirmButtonColor: "#d33",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteProduct(item.slug.toString()).unwrap();
        await refetch();
        Swal.fire("Berhasil", "Produk dihapus", "success");
      } catch (error) {
        Swal.fire("Gagal", "Gagal menghapus Produk", "error");
        console.error(error);
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Data Produk</h1>
        <Button onClick={() => {
          setForm({ status: true }); // Reset form clean saat tambah baru
          setEditingSlug(null);
          setReadonly(false);
          openModal();
        }}>Tambah Produk</Button>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-2">Aksi</th>
                <th className="px-4 py-2">Kategori</th>
                <th className="px-4 py-2">Produk</th>
                <th className="px-4 py-2">Harga</th>
                <th className="px-4 py-2">Stok</th>
                <th className="px-4 py-2">Rating</th>
                <th className="px-4 py-2 whitespace-nowrap">T. Views</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center p-4">
                    Memuat data...
                  </td>
                </tr>
              ) : categoryList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center p-4">
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                categoryList.map((item) => (
                  <tr key={item.id} className="border-t hover:bg-muted/50">
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleDetail(item)}>
                          Detail
                        </Button>
                        <Button size="sm" onClick={() => handleEdit(item)}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(item)}
                        >
                          Hapus
                        </Button>
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {item.category_name}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap font-medium">{item.name}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {item.price}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {item.stock}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {item.rating}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {item.total_reviews}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <Badge variant={item.status ? "default" : "destructive"}>
                        {item.status ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>

        {/* Pagination Controls */}
        <div className="p-4 flex items-center justify-between bg-muted border-t">
          <div className="text-sm text-muted-foreground">
            Halaman <strong>{currentPage}</strong> dari{" "}
            <strong>{lastPage}</strong>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= lastPage}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Berikutnya
            </Button>
          </div>
        </div>
      </Card>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
           {/* Wrapper div untuk handling scroll jika modal terlalu tinggi */}
          <div className="w-full max-w-2xl max-h-[90vh] flex flex-col">
            <FormProduct
                form={form}
                setForm={setForm}
                onCancel={() => {
                setForm({ status: true });
                setEditingSlug(null);
                setReadonly(false);
                closeModal();
                }}
                onSubmit={handleSubmit}
                readonly={readonly}
                isLoading={isCreating || isUpdating}
            />
          </div>
        </div>
      )}
    </div>
  );
}