"use client";

import { useMemo, useState } from "react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
} from "@/services/admin/transaction.service";
import { Transaction } from "@/types/admin/transaction";
import { Badge } from "@/components/ui/badge";
import TransactionDetailModal from "@/components/form-modal/admin/transaction-detail-modal";

// Status enum mapping
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

export default function TransactionPage() {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailId, setDetailId] = useState<number | null>(null);

  // Helper function to format currency in Rupiah
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

  // Helper function to format datetime to Indonesian format
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

  // Helper function to handle payment link click
  const handlePaymentLinkClick = (paymentLink: string) => {
    if (paymentLink && paymentLink.trim()) {
      window.open(paymentLink, "_blank", "noopener,noreferrer");
    }
  };

  const { data, isLoading, refetch } = useGetTransactionListQuery({
    page: currentPage,
    paginate: itemsPerPage,
  });

  const categoryList = useMemo(() => data?.data || [], [data]);
  const lastPage = useMemo(() => data?.last_page || 1, [data]);

  const [deleteTransaction] = useDeleteTransactionMutation();
  const [updateTransactionStatus] = useUpdateTransactionStatusMutation();

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
      Swal.fire("Berhasil", "Status transaction berhasil diubah", "success");
    } catch (error) {
      Swal.fire("Gagal", "Gagal mengubah status transaction", "error");
      console.error(error);
    } finally {
      setIsUpdatingStatus(false);
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Data Transaction</h1>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-2 whitespace-nowrap">Aksi</th>
                <th className="px-2 py-2 whitespace-nowrap">ID</th>
                <th className="px-4 py-2 whitespace-nowrap">Customer</th>
                <th className="px-4 py-2 whitespace-nowrap">Harga</th>
                <th className="px-4 py-2 whitespace-nowrap">Diskon</th>
                <th className="px-4 py-2 whitespace-nowrap">
                  Biaya Pengiriman
                </th>
                <th className="px-4 py-2 whitespace-nowrap">Total harga</th>
                <th className="px-4 py-2 whitespace-nowrap">Payment Link</th>
                <th className="px-4 py-2 whitespace-nowrap">Tanggal</th>
                <th className="px-4 py-2 whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={10} className="text-center p-4">
                    Memuat data...
                  </td>
                </tr>
              ) : categoryList.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center p-4">
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                categoryList.map((item) => {
                  const statusInfo = getStatusInfo(item.status);
                  return (
                    <tr key={item.id} className="border-t">
                      <td className="px-4 py-2">
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
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {item.reference}
                      </td>
                      <td className="px-4 py-2">{item.user_name}</td>
                      <td className="px-4 py-2 font-medium text-green-600">
                        {formatRupiah(item.total)}
                      </td>
                      <td className="px-4 py-2 font-medium text-orange-600">
                        {formatRupiah(item.discount_total)}
                      </td>
                      <td className="px-4 py-2 font-medium text-blue-600">
                        {formatRupiah(item.shipment_cost)}
                      </td>
                      <td className="px-4 py-2 font-bold text-green-700">
                        {formatRupiah(item.grand_total)}
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
                            Tidak ada link
                          </span>
                        )}
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

      {/* Status Update Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ubah Status Transaction</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Transaction: {selectedTransaction?.reference}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Customer: {selectedTransaction?.user_name}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Pilih Status Baru:
              </label>
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

            <div className="flex gap-2 justify-end">
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
