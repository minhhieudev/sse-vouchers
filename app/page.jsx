"use client";

import { useState, useMemo } from "react";
import {
  Ticket,
  CircleCheck,
  Scale,
  Banknote,
  Activity,
  ShoppingCart,
  QrCode,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { Button } from "@heroui/button";
import {
  voucherTopCustomers,
  voucherDailyStats,
  voucherList,
  voucherUsageLogs,
} from "@/lib/mockVoucherData";

import SSEStatBox from "@/components/dashboard/SSEStatBox";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { VoucherStatusChart } from "@/components/dashboard/VoucherStatusChart";
import { TopCustomersTable } from "@/components/dashboard/TopCustomersTable";
import { TopCustomersChart } from "@/components/dashboard/TopCustomersChart";

// Custom Month Picker Component
const CustomMonthPicker = ({ selectedDate, onDateChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewYear, setViewYear] = useState(selectedDate.getFullYear());

  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("vi-VN", { month: "long" })
  );

  const selectMonth = (monthIndex) => {
    const newDate = new Date(viewYear, monthIndex, 1);
    onDateChange(newDate);
    setIsOpen(false);
  };

  const TriggerButton = ({ ...props }) => (
    <Button
      {...props}
      id="month-picker"
      variant="ghost"
      className="justify-start text-left font-normal bg-transparent hover:bg-transparent border-none focus:outline-none !p-0"
    >
      <CalendarIcon className="mr-2 h-4 w-4 text-slate-500" />
      <span className="font-medium text-slate-800">
        {selectedDate.toLocaleString("vi-VN", {
          month: "long",
          year: "numeric",
        })}
      </span>
    </Button>
  );

  return (
    <Popover isOpen={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <TriggerButton />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white rounded-xl shadow-lg border border-slate-200">
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewYear(viewYear - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="font-bold text-slate-900">{viewYear}</div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewYear(viewYear + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {months.map((month, index) => (
              <Button
                key={month}
                variant={
                  selectedDate.getFullYear() === viewYear &&
                    selectedDate.getMonth() === index
                    ? "solid"
                    : "ghost"
                }
                color="primary"
                size="sm"
                className="w-full"
                onClick={() => selectMonth(index)}
              >
                {month}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};


export default function VoucherDashboardPage() {
  const [selectedDate, setSelectedDate] = useState(new Date("2025-11-01"));

  // --- Data Processing ---
  const {
    totalVouchersIssued,
    totalVouchersUsed,
    statusSummary,
    usageOverview,
    totalRevenue,
    usageRate,
  } = useMemo(() => {
    const statusSummary = voucherList.reduce(
      (acc, voucher) => {
        acc[voucher.status] = (acc[voucher.status] ?? 0) + 1;
        return acc;
      },
      { active: 0, used: 0, expired: 0, scheduled: 0 }
    );

    const usageOverview = voucherUsageLogs.reduce(
      (acc, log) => {
        if (log.weightKg) acc.totalWeight += log.weightKg;
        if (log.channel === "Zalo OA" || log.channel === "Mini App") acc.qrScans += 1;
        return acc;
      },
      { totalWeight: 0, qrScans: 0 }
    );

    const totalRevenue = voucherDailyStats.reduce((sum, day) => sum + day.revenue, 0);
    const totalVouchersUsed = statusSummary.used;
    const totalVouchersIssued = voucherList.length;
    const usageRate = totalVouchersIssued > 0 ? (totalVouchersUsed / totalVouchersIssued) * 100 : 0;

    return { totalVouchersIssued, totalVouchersUsed, statusSummary, usageOverview, totalRevenue, usageRate };
  }, [selectedDate]); // Recalculate if date changes, for future real data

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {/* --- Header --- */}
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Báo cáo Marketing & Finance
              </h1>
              <p className="mt-2 text-lg text-slate-600">
                Dashboard tổng hợp hiệu suất voucher.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-full border border-slate-200/80 bg-white py-2 px-4 shadow-sm">
              <span className="tracking-wide text-sm font-bold text-slate-700">Thời gian:</span>
              <CustomMonthPicker selectedDate={selectedDate} onDateChange={setSelectedDate} />
            </div>
          </div>
        </header>

        {/* --- Section 1: Overview KPIs --- */}
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-8">
          <SSEStatBox
            title="Voucher đã phát"
            value={totalVouchersIssued.toString()}
            icon={Ticket}
            color="blue"
            description="Tổng số voucher đã tạo"
          />
          <SSEStatBox
            title="Voucher đã sử dụng"
            value={totalVouchersUsed.toString()}
            icon={ShoppingCart}
            color="green"
            description="Số voucher được dùng thành công"
          />
          <SSEStatBox
            title="Voucher còn hiệu lực"
            value={statusSummary.active.toString()}
            icon={CircleCheck}
            color="teal"
            description="Số voucher có thể sử dụng"
          />
          <SSEStatBox
            title="Tổng khối lượng miễn phí"
            value={`${usageOverview.totalWeight.toFixed(1)} kg`}
            icon={Scale}
            color="amber"
            description="Tổng khối lượng đã sử dụng"
          />
          <SSEStatBox
            title="Doanh thu từ Voucher"
            value={`₫${(totalRevenue / 1000000).toFixed(1)}M`}
            icon={Banknote}
            color="indigo"
            description="Tổng doanh thu được tạo"
          />
        </section>

        {/* --- Section 2: Customer Chart & Revenue Analysis --- */}
        <section className="grid grid-cols-1 lg:grid-cols-7 gap-8 mb-8">
          {/* Left Column: Top Customers Chart */}
          <div className="lg:col-span-3">
            <TopCustomersChart data={voucherTopCustomers} />
          </div>

          {/* Right Column: Revenue Chart */}
          <div className="lg:col-span-4">
            <RevenueChart data={voucherDailyStats} />
          </div>
        </section>

        {/* --- Section 3: Top Customers Details & Status Distribution --- */}
        <section className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <TopCustomersTable data={voucherTopCustomers} />
            </div>
            <div className="lg:col-span-2">
              <div className="p-4">
                <VoucherStatusChart data={voucherList} />
              </div>
            </div>
          </div>
        </section>
        {/* --- Section 5: Conversion & Channel Performance --- */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg flex flex-col justify-center items-center text-center">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Tỷ lệ sử dụng</h3>
            <div className="relative w-32 h-32">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="3"
                  strokeDasharray={`${usageRate.toFixed(0)}, 100`}
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="text-3xl font-bold text-indigo-600">{usageRate.toFixed(1)}%</span>
              </div>
            </div>
            <p className="mt-4 text-slate-600">
              {totalVouchersUsed} trên {totalVouchersIssued} voucher đã được sử dụng.
            </p>
          </div>

          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Hiệu suất kênh Zalo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                <div className="p-3 bg-blue-100 rounded-full">
                  <QrCode className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Lượt quét QR qua Zalo</p>
                  <p className="text-2xl font-bold text-slate-900">{usageOverview.qrScans} Lượt</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                <div className="p-3 bg-green-100 rounded-full">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Tỷ lệ chuyển đổi Zalo</p>
                  <p className="text-2xl font-bold text-slate-900">76%</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-4">
              * Dữ liệu mô phỏng cho mục đích hiển thị. Bao gồm Zalo OA và Mini App.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
