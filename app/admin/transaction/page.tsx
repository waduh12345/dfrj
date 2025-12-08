"use client";

import { useMemo, useState } from "react";
import Swal from "sweetalert2";
import * as XLSX from "xlsx"; // Import SheetJS
import { Download, Truck } from "lucide-react"; // Import Icons
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetTransactionListQuery,
  useDeleteTransactionMutation,
  useUpdateTransactionStatusMutation,
  useUpdateTransactionShipmentStatusMutation, // Asumsi hook ini ada di service
} from "@/services/admin/transaction.service";
import { Transaction } from "@/types/admin/transaction";
import { Badge } from "@/components/ui/badge";
import TransactionDetailModal from "@/components/form-modal/admin/transaction-detail-modal";

// --- Types & Constants ---
type TransactionStatusKey = 0 | 1 | 2 | -1 | -2 | -3;
type TransactionStatusInfo = {
  label: string;
  variant: "secondary" | "default" | "success" | "destructive";
};

const TRANSACTION_STATUS: Record<TransactionStatusKey, TransactionStatusInfo> =
  {
    0: { label: "PENDING", variant: "secondary" },
    1: { label: "CAPTURED", variant: "default" },
    2: { label: "SETTLEMENT", variant: "success" },
    [-1]: { label: "DENY", variant: "destructive" },
    [-2]: { label: "EXPIRED", variant: "destructive" },
    [-3]: { label: "CANCEL", variant: "destructive" },
  };

// Opsi status pengiriman (sesuaikan dengan backend Anda)
const SHIPMENT_STATUSES = [
  { value: "0", label: "Menunggu Diproses" },
  { value: "1", label: "Sedang Dikirim" },
  { value: "2", label: "Telah Diterima" },
  { value: "3", label: "Dikembalikan" },
  { value: "4", label: "Dibatalkan" },
];

export default function TransactionPage() {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // --- State Transaction Status ---
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // --- State Shipment Status ---
  const [isShipmentModalOpen, setIsShipmentModalOpen] = useState(false);
  const [selectedShipmentTransaction, setSelectedShipmentTransaction] =
    useState<Transaction | null>(null);
  const [shipmentForm, setShipmentForm] = useState({
    receipt_code: "",
    shipment_status: "",
  });

  // --- State Detail Modal ---
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailId, setDetailId] = useState<number | null>(null);

  // --- Queries & Mutations ---
  const { data, isLoading, refetch } = useGetTransactionListQuery({
    page: currentPage,
    paginate: itemsPerPage,
  });

  const categoryList = useMemo(() => data?.data || [], [data]);
  const lastPage = useMemo(() => data?.last_page || 1, [data]);

  const [deleteTransaction] = useDeleteTransactionMutation();
  const [updateTransactionStatus] = useUpdateTransactionStatusMutation();
  const [updateTransactionShipment, { isLoading: isUpdatingShipment }] =
    useUpdateTransactionShipmentStatusMutation();

  // --- Helpers ---
  const formatRupiah = (amount: number | string) => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    if (isNaN(numAmount)) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(numAmount)
      .replace("IDR", "Rp");
  };

  const formatDateTime = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return new Intl.DateTimeFormat("id-ID", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(date);
    } catch (error) {
      return String(error);
    }
  };

  const getStatusInfo = (status: number) => {
    return (
      TRANSACTION_STATUS[status as TransactionStatusKey] || {
        label: "UNKNOWN",
        variant: "secondary",
      }
    );
  };

  const handlePaymentLinkClick = (paymentLink: string) => {
    if (paymentLink && paymentLink.trim()) {
      window.open(paymentLink, "_blank", "noopener,noreferrer");
    }
  };

  // --- Handlers: EXPORT EXCEL ---
  const handleExportExcel = () => {
    if (categoryList.length === 0) {
      Swal.fire("Info", "Tidak ada data untuk diexport", "info");
      return;
    }

    const dataToExport = categoryList.map((item) => ({
      "Order ID": item.reference,
      "Customer": item.user_name,
      "Total Belanja": item.grand_total, // Biarkan number agar bisa dihitung di excel
      "Status Pembayaran": getStatusInfo(item.status).label,
      "Resi": item.receipt_code || "-", // Asumsi ada field receipt_code
      "Status Pengiriman": item.shipment_status || "-", // Asumsi ada field shipment_status
      "Tanggal": formatDateTime(item.created_at),
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    
    // Auto width column sederhana
    const wscols = [
        { wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 10 }, { wch: 20 }, { wch: 15 }, { wch: 20 }
    ];
    worksheet["!cols"] = wscols;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transaksi");

    XLSX.writeFile(workbook, `Transaksi_Export_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // --- Handlers: UPDATE PAYMENT STATUS ---
  const handleStatusClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setNewStatus(transaction.status.toString());
    setIsModalOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedTransaction) return;
    setIsUpdatingStatus(true);
    try {
      await updateTransactionStatus({
        id: selectedTransaction.id.toString(),
        status: parseInt(newStatus),
      }).unwrap();
      await refetch();
      setIsModalOpen(false);
      setSelectedTransaction(null);
      Swal.fire("Berhasil", "Status transaksi berhasil diubah", "success");
    } catch (error) {
      Swal.fire("Gagal", "Gagal mengubah status", "error");
      console.error(error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // --- Handlers: UPDATE SHIPMENT STATUS ---
  const handleShipmentClick = (transaction: Transaction) => {
    setSelectedShipmentTransaction(transaction);
    // Isi form dengan data yang sudah ada (jika ada)
    setShipmentForm({
      receipt_code: transaction.receipt_code || "", 
      shipment_status: String(transaction.shipment_status) || "",
    });
    setIsShipmentModalOpen(true);
  };

  const handleShipmentUpdate = async () => {
    if (!selectedShipmentTransaction) return;

    try {
      await updateTransactionShipment({
        id: selectedShipmentTransaction.id.toString(),
        receipt_code: shipmentForm.receipt_code,
        shipment_status: Number(shipmentForm.shipment_status),
      }).unwrap();

      await refetch();
      setIsShipmentModalOpen(false);
      setSelectedShipmentTransaction(null);
      Swal.fire("Berhasil", "Status pengiriman berhasil diperbarui", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Gagal", "Gagal memperbarui status pengiriman", "error");
    }
  };

  const handleDelete = async (item: Transaction) => {
    const confirm = await Swal.fire({
      title: "Yakin hapus Transaction?",
      text: item.reference,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteTransaction(item.id.toString()).unwrap();
        await refetch();
        Swal.fire("Berhasil", "Transaction dihapus", "success");
      } catch (error) {
        Swal.fire("Gagal", "Gagal menghapus Transaction", "error");
        console.error(error);
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Data Transaction</h1>
        {/* Tombol Export Excel */}
        <Button 
            variant="outline" 
            onClick={handleExportExcel}
            className="flex items-center gap-2"
        >
            <Download className="h-4 w-4" /> Export Excel
        </Button>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-2 whitespace-nowrap">Aksi</th>
                <th className="px-2 py-2 whitespace-nowrap">ID</th>
                <th className="px-4 py-2 whitespace-nowrap">Customer</th>
                <th className="px-4 py-2 whitespace-nowrap">Total Harga</th>
                <th className="px-4 py-2 whitespace-nowrap">Payment Link</th>
                <th className="px-4 py-2 whitespace-nowrap">Pengiriman</th>
                <th className="px-4 py-2 whitespace-nowrap">Tanggal</th>
                <th className="px-4 py-2 whitespace-nowrap">Status Payment</th>
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
                categoryList.map((item) => {
                  const statusInfo = getStatusInfo(item.status);
                  // Cek apakah status sudah dibayar (Captured=1 atau Settlement=2)
                  const isPaid = item.status === 1 || item.status === 2;

                  return (
                    <tr key={item.id} className="border-t">
                      <td className="px-4 py-2">
                        <div className="flex flex-col gap-2">
                          <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                setDetailId(item.id);
                                setDetailOpen(true);
                                }}
                            >
                                Detail
                            </Button>
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDelete(item)}
                            >
                                Hapus
                            </Button>
                          </div>
                          
                          {/* Button Ubah Pengiriman (Hanya jika Paid) */}
                          {isPaid && (
                              <Button 
                                size="sm" 
                                variant="secondary" 
                                className="w-full text-xs"
                                onClick={() => handleShipmentClick(item)}
                              >
                                <Truck className="w-3 h-3 mr-1" />
                                {item.receipt_code ? "Update Resi" : "Input Resi"}
                              </Button>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {item.reference}
                      </td>
                      <td className="px-4 py-2">{item.user_name}</td>
                      <td className="px-4 py-2 font-bold text-green-700">
                        {formatRupiah(item.total)}
                      </td>
                      <td className="px-4 py-2">
                        {item.payment_link ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs px-2 py-1 h-auto"
                            onClick={() =>
                              handlePaymentLinkClick(item.payment_link)
                            }
                          >
                            Buka Link
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-xs">
                            -
                          </span>
                        )}
                      </td>
                      
                      {/* Kolom Informasi Pengiriman */}
                      <td className="px-4 py-2 whitespace-nowrap">
                         <div className="flex flex-col text-xs">
                            <span>Resi: {item.stores[0].receipt_code || "-"}</span>
                            <span className="text-muted-foreground">
                              {
                                (() => {
                                  switch (String(item.stores[0].shipment_status)) {
                                    case "0":
                                      return "Menunggu Diproses";
                                    case "1":
                                      return "Sedang Dikirim";
                                    case "2":
                                      return "Telah Diterima";
                                    case "3":
                                      return "Dikembalikan";
                                    case "4":
                                      return "Dibatalkan";
                                    default:
                                      return "-";
                                  }
                                })()
                              }
                            </span>
                         </div>
                      </td>

                      <td className="px-4 py-2 text-sm whitespace-nowrap">
                        {formatDateTime(item.created_at)}
                      </td>
                      <td className="px-4 py-2">
                        <Badge
                          variant={statusInfo.variant}
                          className="cursor-pointer hover:opacity-80"
                          onClick={() => handleStatusClick(item)}
                        >
                          {statusInfo.label}
                        </Badge>
                      </td>
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

      {/* Modal 1: Ubah Status Transaksi (Payment) */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ubah Status Pembayaran</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Order ID: {selectedTransaction?.reference}
              </p>
            </div>

            <div>
              <Label className="mb-2 block">Pilih Status Baru:</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">PENDING</SelectItem>
                  <SelectItem value="1">CAPTURED</SelectItem>
                  <SelectItem value="2">SETTLEMENT</SelectItem>
                  <SelectItem value="-1">DENY</SelectItem>
                  <SelectItem value="-2">EXPIRED</SelectItem>
                  <SelectItem value="-3">CANCEL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                disabled={isUpdatingStatus}
              >
                Batal
              </Button>
              <Button onClick={handleStatusUpdate} disabled={isUpdatingStatus}>
                {isUpdatingStatus ? "Memperbarui..." : "Simpan"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal 2: Ubah Status Pengiriman & Resi */}
      <Dialog open={isShipmentModalOpen} onOpenChange={setIsShipmentModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Pengiriman</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
                <p className="text-sm text-muted-foreground">
                    Order ID: <b>{selectedShipmentTransaction?.reference}</b>
                </p>
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="receipt_code">Nomor Resi</Label>
                <Input 
                    id="receipt_code"
                    placeholder="Masukkan nomor resi..."
                    value={shipmentForm.receipt_code}
                    onChange={(e) => setShipmentForm({...shipmentForm, receipt_code: e.target.value})}
                />
            </div>

            <div className="space-y-2">
              <Label>Status Pengiriman</Label>
              <Select 
                value={shipmentForm.shipment_status} 
                onValueChange={(val) => setShipmentForm({...shipmentForm, shipment_status: val})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status pengiriman" />
                </SelectTrigger>
                <SelectContent>
                  {SHIPMENT_STATUSES.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                          {status.label}
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button
                variant="outline"
                onClick={() => setIsShipmentModalOpen(false)}
                disabled={isUpdatingShipment}
              >
                Batal
              </Button>
              <Button onClick={handleShipmentUpdate} disabled={isUpdatingShipment}>
                {isUpdatingShipment ? "Menyimpan..." : "Update Pengiriman"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <TransactionDetailModal
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setDetailId(null);
        }}
        transactionId={detailId}
      />
    </div>
  );
}