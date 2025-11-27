"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Ban,
  Banknote,
  Calendar as CalendarIcon,
  CircleCheck,
  Loader2,
  QrCode,
  ShoppingCart,
  Ticket,
  Users,
  Wallet,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";
import { Button } from "@heroui/button";

import SSEStatBox from "@/components/dashboard/SSEStatBox";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { VoucherStatusChart } from "@/components/dashboard/VoucherStatusChart";
import { TopCustomersTable } from "@/components/dashboard/TopCustomersTable";
import { TopCustomersChart } from "@/components/dashboard/TopCustomersChart";
import { useVoucherReports } from "@/hooks/useVoucherReports";
import { useToast } from "@/hooks";

const formatCurrency = (value = 0) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

const formatNumber = (value = 0) => Number(value || 0).toLocaleString("vi-VN");

const formatDate = (value) => {
  if (!value) return "--";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? "--"
    : parsed.toLocaleDateString("vi-VN");
};

const formatPeriod = (period) => {
  const key = (period || "").toLowerCase();
  switch (key) {
    case "daily":
      return "Hằng ngày";
    case "weekly":
      return "Hàng tuần";
    case "monthly":
      return "Hàng tháng";
    default:
      return period || "Hàng tháng";
  }
};

const CustomMonthPicker = ({ selectedDate, onDateChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewYear, setViewYear] = useState(selectedDate.getFullYear());

  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("vi-VN", { month: "long" }),
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
              {"<"}
            </Button>
            <div className="font-bold text-slate-900">{viewYear}</div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewYear(viewYear + 1)}
            >
              {">"}
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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { error: showError } = useToast();

  const startOfMonth = useMemo(
    () => new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
    [selectedDate],
  );
  const endOfMonth = useMemo(
    () => new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0),
    [selectedDate],
  );

  const revenueParams = useMemo(
    () => ({
      period: "monthly",
      start_date: startOfMonth.toISOString(),
      end_date: endOfMonth.toISOString(),
    }),
    [startOfMonth, endOfMonth],
  );

  const topCustomerParams = useMemo(() => ({ limit: 10 }), []);

  const reports = useVoucherReports({
    revenueParams,
    topCustomerParams,
  });

  useEffect(() => {
    const queries = [
      reports.summary,
      reports.topCustomers,
      reports.revenue,
      reports.zaloStats,
    ];
    queries
      .filter((query) => query?.error)
      .forEach((query) =>
        showError(query.error?.message || "Cannot load voucher reports"),
      );
  }, [
    reports.summary?.error,
    reports.topCustomers?.error,
    reports.revenue?.error,
    reports.zaloStats?.error,
    showError,
  ]);

  const summaryData = reports.summary.data || {
    total_voucher: 0,
    used_voucher: 0,
    active_voucher: 0,
    expired_voucher: 0,
    inactive_voucher: 0,
    total_value: 0,
    used_value: 0,
    active_value: 0,
  };

  const revenueData = {
    period: "",
    start_date: revenueParams.start_date,
    end_date: revenueParams.end_date,
    total_revenue: 0,
    voucher_sold: 0,
    voucher_used: 0,
    details: [],
    ...(reports.revenue.data || {}),
  };

  const revenueSeries = Array.isArray(revenueData.details)
    ? revenueData.details.map((item, index) => ({
        label:
          item.label ||
          item.date ||
          item.period ||
          item.period_label ||
          `P${index + 1}`,
        total_revenue:
          item.total_revenue ?? item.revenue ?? item.totalValue ?? item.value ?? 0,
        voucher_sold:
          item.voucher_sold ?? item.voucher_used ?? item.vouchers ?? item.used ?? 0,
      }))
    : [];

  const topCustomers = Array.isArray(reports.topCustomers.data)
    ? reports.topCustomers.data
    : [];

  const zaloStats = reports.zaloStats.data || {
    total_scans: 0,
    unique_users: 0,
    scans_today: 0,
    scans_this_week: 0,
    scans_this_month: 0,
    top_vouchers: [],
  };

  const isLoading =
    reports.summary.isLoading ||
    reports.topCustomers.isLoading ||
    reports.revenue.isLoading ||
    reports.zaloStats.isLoading;

  const periodLabel = formatPeriod(revenueData.period || revenueParams.period);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Báo cáo voucher
              </h1>
              <p className="mt-2 text-lg text-slate-600">
                Bảng điều khiển tổng hợp từ API /voucher/reports/*
              </p>
              <p className="text-sm text-slate-500">
                Kỳ: {periodLabel} | {formatDate(revenueData.start_date)} -{" "}
                {formatDate(revenueData.end_date)}
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-full border border-slate-200/80 bg-white py-2 px-4 shadow-sm">
              <span className="tracking-wide text-sm font-bold text-slate-700">
                Chọn thời gian:
              </span>
              <CustomMonthPicker selectedDate={selectedDate} onDateChange={setSelectedDate} />
            </div>
          </div>
          {isLoading && (
            <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
              <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
              Đang tải dữ liệu từ API...
            </div>
          )}
        </header>

        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-slate-900">Số lượng voucher</h2>
            <p className="text-sm text-slate-500">Trường BE: total_voucher, used_voucher, active_voucher, expired_voucher, inactive_voucher</p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            <SSEStatBox
              title="Tổng voucher"
              value={formatNumber(summaryData.total_voucher)}
              icon={Ticket}
              color="blue"
              description="total_voucher"
            />
            <SSEStatBox
              title="Voucher đã dùng"
              value={formatNumber(summaryData.used_voucher)}
              icon={ShoppingCart}
              color="green"
              description="used_voucher"
            />
            <SSEStatBox
              title="Voucher đang hoạt động"
              value={formatNumber(summaryData.active_voucher)}
              icon={CircleCheck}
              color="teal"
              description="active_voucher"
            />
            <SSEStatBox
              title="Voucher hết hạn"
              value={formatNumber(summaryData.expired_voucher)}
              icon={CalendarIcon}
              color="amber"
              description="expired_voucher"
            />
            <SSEStatBox
              title="Voucher vô hiệu hóa"
              value={formatNumber(summaryData.inactive_voucher)}
              icon={Ban}
              color="red"
              description="inactive_voucher"
            />
          </div>
        </section>

        <section className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-slate-900">Giá trị & doanh thu</h2>
            <p className="text-sm text-slate-500">Trường BE: total_value, used_value, active_value, total_revenue, voucher_sold</p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            <SSEStatBox
              title="Tổng giá trị"
              value={formatCurrency(summaryData.total_value)}
              icon={Wallet}
              color="indigo"
              description="total_value"
            />
            <SSEStatBox
              title="Giá trị đã dùng"
              value={formatCurrency(summaryData.used_value)}
              icon={Banknote}
              color="green"
              description="used_value"
            />
            <SSEStatBox
              title="Giá trị còn hiệu lực"
              value={formatCurrency(summaryData.active_value)}
              icon={Wallet}
              color="teal"
              description="active_value"
            />
            <SSEStatBox
              title="Tổng doanh thu"
              value={formatCurrency(revenueData.total_revenue)}
              icon={Banknote}
              color="purple"
              description="total_revenue"
            />
            <SSEStatBox
              title="Voucher đã bán"
              value={formatNumber(revenueData.voucher_sold)}
              icon={ShoppingCart}
              color="amber"
              description="voucher_sold"
            />
            <SSEStatBox
              title="Voucher đã dùng (doanh thu)"
              value={formatNumber(revenueData.voucher_used)}
              icon={ShoppingCart}
              color="green"
              description="voucher_used"
            />
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-7 gap-8 mb-8">
          <div className="lg:col-span-3">
            <TopCustomersChart data={topCustomers} />
          </div>
          <div className="lg:col-span-4">
            <RevenueChart data={revenueSeries} />
          </div>
        </section>

        <section className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <TopCustomersTable data={topCustomers} />
            </div>
            <div className="lg:col-span-2">
              <div className="p-4">
                <VoucherStatusChart summary={summaryData} />
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            <SSEStatBox
              title="Tổng lượt quét QR"
              value={formatNumber(zaloStats.total_scans)}
              icon={QrCode}
              color="blue"
              description="total_scans"
            />
            <SSEStatBox
              title="Người dùng duy nhất"
              value={formatNumber(zaloStats.unique_users)}
              icon={Users}
              color="green"
              description="unique_users"
            />
            <SSEStatBox
              title="Lượt quét hôm nay"
              value={formatNumber(zaloStats.scans_today)}
              icon={Activity}
              color="teal"
              description="scans_today"
            />
            <SSEStatBox
              title="Lượt quét tuần này"
              value={formatNumber(zaloStats.scans_this_week)}
              icon={Activity}
              color="amber"
              description="scans_this_week"
            />
            <SSEStatBox
              title="Lượt quét tháng này"
              value={formatNumber(zaloStats.scans_this_month)}
              icon={Activity}
              color="purple"
              description="scans_this_month"
            />
          </div>

          <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Top voucher được quét nhiều (Zalo OA)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {(zaloStats.top_vouchers || []).map((item, index) => {
                const code =
                  item.voucher_code ||
                  item.code ||
                  item.id ||
                  item.voucher_id ||
                  `Voucher ${index + 1}`;
                const scans =
                  item.scans ||
                  item.total_scans ||
                  item.count ||
                  item.usage ||
                  0;
                return (
                  <div
                    key={`${code}-${index}`}
                    className="border border-slate-200 rounded-lg p-4 shadow-sm bg-slate-50"
                  >
                    <p className="text-sm text-slate-500">Mã voucher</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {code}
                    </p>
                    <p className="text-sm text-slate-600 mt-2">
                      Lượt quét: {formatNumber(scans)}
                    </p>
                  </div>
                );
              })}
              {(!zaloStats.top_vouchers ||
                !zaloStats.top_vouchers.length) && (
                <p className="text-sm text-slate-500">
                  Chưa có dữ liệu top_vouchers
                </p>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
