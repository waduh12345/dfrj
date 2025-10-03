"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ShoppingCart, 
  Clock, 
  Truck, 
  CheckCircle, 
  MousePointer, 
  DollarSign 
} from "lucide-react";

// Mock data - replace with actual API calls
const mockDashboardData = {
  totalOrders: 1247,
  pendingOrders: 23,
  shippedOrders: 156,
  completedOrders: 1068,
  totalProductClicks: 45623,
  totalSales: 125430000
};

// Dashboard card configuration
const dashboardCards = [
  {
    title: "Total Pesanan",
    value: mockDashboardData.totalOrders,
    icon: ShoppingCart,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    formatType: "number"
  },
  {
    title: "Total Pesanan Menunggu",
    value: mockDashboardData.pendingOrders,
    icon: Clock,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    formatType: "number"
  },
  {
    title: "Total Pesanan Dikirim",
    value: mockDashboardData.shippedOrders,
    icon: Truck,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    formatType: "number"
  },
  {
    title: "Total Pesanan Selesai",
    value: mockDashboardData.completedOrders,
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-100",
    formatType: "number"
  },
  {
    title: "Total Produk Diklik",
    value: mockDashboardData.totalProductClicks,
    icon: MousePointer,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
    formatType: "number"
  },
  {
    title: "Total Penjualan",
    value: mockDashboardData.totalSales,
    icon: DollarSign,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
    formatType: "currency"
  }
];

export default function DashboardPage() {
  // Helper function to format currency in Rupiah
  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('IDR', 'Rp');
  };

  // Helper function to format numbers
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  // Format value based on type
  const formatValue = (value: number, type: string) => {
    switch (type) {
      case 'currency':
        return formatRupiah(value);
      case 'number':
      default:
        return formatNumber(value);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Ringkasan data toko Anda
        </p>
      </div>

      {/* Dashboard Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatValue(card.value, card.formatType)}
                    </div>
                  </div>
                  <div className={`p-3 rounded-full ${card.bgColor}`}>
                    <IconComponent className={`h-6 w-6 ${card.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}