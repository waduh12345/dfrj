"use client";

import { useMemo, useState } from "react";
import Swal from "sweetalert2";
// 1. Import library XLSX
import * as XLSX from "xlsx"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  useGetCustomerListQuery,
  useDeleteCustomerMutation,
} from "@/services/admin/customer.service";
import { Customer } from "@/types/admin/customer";
import { Download } from "lucide-react"; // Optional: Icon untuk tombol export

export default function CustomerPage() {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Helper function to format datetime
  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      return new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(date);
    } catch (error) {
      return String(error);
    }
  };

  const { data, isLoading, refetch } = useGetCustomerListQuery({
    page: currentPage,
    paginate: itemsPerPage,
  });

  const customerList = useMemo(() => data?.data || [], [data]);
  const lastPage = useMemo(() => data?.last_page || 1, [data]);

  const [deleteCustomer] = useDeleteCustomerMutation();

  // --- 2. Fungsi Export Excel ---
  const handleExportExcel = () => {
    // Cek apakah ada data
    if (customerList.length === 0) {
      Swal.fire("Info", "Tidak ada data untuk diexport", "info");
      return;
    }

    // Mapping data agar header tabel Excel rapi (sesuai keinginan)
    const dataToExport = customerList.map((item) => ({
      "ID": item.id,
      "Nama Lengkap": item.name,
      "No. Handphone": item.phone || "-",
      "Email": item.email,
      "Tanggal Daftar": formatDateTime(item.created_at), // Gunakan helper yang sama
    }));

    // Membuat Worksheet dari data JSON
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);

    // Mengatur lebar kolom (Optional, agar lebih rapi)
    const columnWidths = [
      { wch: 5 },  // ID
      { wch: 25 }, // Nama
      { wch: 15 }, // HP
      { wch: 25 }, // Email
      { wch: 20 }, // Tanggal
    ];
    worksheet["!cols"] = columnWidths;

    // Membuat Workbook baru
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Customer");

    // Generate file nama dengan timestamp
    const fileName = `Data_Customer_${new Date().toISOString().slice(0, 10)}.xlsx`;

    // Download file
    XLSX.writeFile(workbook, fileName);
  };

  const handleDelete = async (item: Customer) => {
    const confirm = await Swal.fire({
      title: "Yakin hapus Customer?",
      text: item.name,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteCustomer(item.id.toString()).unwrap();
        await refetch();
        Swal.fire("Berhasil", "Customer dihapus", "success");
      } catch (error) {
        Swal.fire("Gagal", "Gagal menghapus Customer", "error");
        console.error(error);
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Data Customer</h1>
        
        {/* 3. Tombol Export */}
        <Button 
          variant="outline" 
          onClick={handleExportExcel}
          disabled={isLoading || customerList.length === 0}
          className="flex gap-2"
        >
          {/* Jika punya lucide-react, bisa pakai icon */}
          <Download className="w-4 h-4" /> 
          Export Excel
        </Button>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-2 whitespace-nowrap">Aksi</th>
                <th className="px-2 py-2 whitespace-nowrap">Nama</th>
                <th className="px-2 py-2 whitespace-nowrap">No. Hanphone</th>
                <th className="px-2 py-2 whitespace-nowrap">Email</th>
                <th className="px-2 py-2 whitespace-nowrap">Tanggal Daftar</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center p-4">
                    Memuat data...
                  </td>
                </tr>
              ) : customerList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-4">
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                customerList.map((item) => {
                  return (
                    <tr key={item.id} className="border-t">
                      <td className="px-4 py-2">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(item)}
                          >
                            Hapus
                          </Button>
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">{item.name}</td>
                      <td className="px-4 py-2">{item.phone || "-"}</td>
                      <td className="px-4 py-2">{item.email}</td>
                      <td className="px-4 py-2">{formatDateTime(item.created_at)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </CardContent>

        <div className="p-4 flex items-center justify-between bg-muted">
          <div className="text-sm">
            Halaman <strong>{currentPage}</strong> dari{" "}
            <strong>{lastPage}</strong>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              disabled={currentPage >= lastPage}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Berikutnya
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}