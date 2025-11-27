"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Ban,
  Banknote,
  Calendar as CalendarIcon,
  ChevronRight,
  CircleCheck,
  Loader2,
  QrCode,
  ShoppingCart,
  Ticket,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";

import SSEStatBox from "@/components/dashboard/SSEStatBox";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { RevenueDetailChart } from "@/components/dashboard/RevenueDetailChart";
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
  const [periodType, setPeriodType] = useState("monthly"); // daily, weekly, monthly
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [useCustomRange, setUseCustomRange] = useState(false);
  const { error: showError } = useToast();

  const formatDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Calculate date range for display purposes
  const { displayStartDate, displayEndDate } = useMemo(() => {
    if (useCustomRange && customStartDate && customEndDate) {
      return {
        displayStartDate: customStartDate,
        displayEndDate: customEndDate,
      };
    }

    const end = new Date();
    let start = new Date();

    switch (periodType) {
      case "daily":
        // Last 7 days
        start = new Date(end);
        start.setDate(end.getDate() - 6);
        break;
      case "weekly":
        // Last 12 weeks (3 months)
        start = new Date(end);
        start.setDate(end.getDate() - 83); // ~12 weeks
        break;
      case "monthly":
        // Last 12 months (1 year)
        start = new Date(end);
        start.setFullYear(start.getFullYear() - 1);
        break;
      default:
        start = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    }

    return {
      displayStartDate: formatDateString(start),
      displayEndDate: formatDateString(end),
    };
  }, [periodType, selectedDate, useCustomRange, customStartDate, customEndDate]);

  // Build API params - period always has value, dates can be null
  const revenueParams = useMemo(
    () => ({
      period: periodType,
      start_date: customStartDate ? customStartDate : null,
      end_date: customEndDate ? customEndDate : null,
    }),
    [periodType, customStartDate, customEndDate],
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 text-slate-800">
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-1">
            Bảng Điều Khiển Tổng Hợp
          </h1>
          <p className="text-slate-600">
            Theo dõi toàn bộ hoạt động voucher và doanh thu kinh doanh
          </p>
        </div>

        {/* Filter Section - Always Visible */}
        <div className="mb-10 bg-white rounded-xl shadow-md border border-slate-200/50 p-6">
          <div className="space-y-4">
            {/* Period Type Selection */}
            <div>
              <label className="text-sm font-semibold text-slate-900 mb-3 block">
                Loại Báo Cáo
              </label>
              <div className="flex items-center gap-3 flex-wrap">
                {["daily", "weekly", "monthly"].map((period) => (
                  <button
                    key={period}
                    onClick={() => {
                      setPeriodType(period);
                      setUseCustomRange(false);
                    }}
                    className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all border-2 ${
                      periodType === period && !useCustomRange
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-lg"
                        : "bg-white text-slate-700 border-slate-200 hover:border-indigo-300"
                    }`}
                  >
                    {period === "daily" ? "📅 Hằng Ngày" : period === "weekly" ? "📊 Hàng Tuần" : "📈 Hàng Tháng"}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Range Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-slate-900">
                  Khoảng Thời Gian
                </label>
                <div className="flex items-center gap-2">
                  {(customStartDate || customEndDate) && (
                    <button
                      onClick={() => {
                        setCustomStartDate("");
                        setCustomEndDate("");
                        setUseCustomRange(false);
                      }}
                      className="text-xs font-medium text-red-600 hover:text-red-700 flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50"
                    >
                      <X className="h-3 w-3" />
                      Reset
                    </button>
                  )}
                  {useCustomRange && (
                    <button
                      onClick={() => setUseCustomRange(false)}
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                    >
                      Đóng
                    </button>
                  )}
                </div>
              </div>

              {!useCustomRange ? (
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <p className="text-xs text-slate-600 mb-1">Từ ngày</p>
                    <p className="font-semibold text-slate-900">{customStartDate || "Không xác định"}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400" />
                  <div className="flex-1 bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <p className="text-xs text-slate-600 mb-1">Đến ngày</p>
                    <p className="font-semibold text-slate-900">{customEndDate || "Không xác định"}</p>
                  </div>
                  <Button
                    auto
                    light
                    onClick={() => setUseCustomRange(true)}
                    className="text-indigo-600 font-medium"
                  >
                    Thay Đổi
                  </Button>
                </div>
              ) : (
                <div className="flex items-end gap-3">
                  <Input
                    type="date"
                    label="Từ ngày"
                    labelPlacement="inside"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    type="date"
                    label="Đến ngày"
                    labelPlacement="inside"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    auto
                    color="primary"
                    onClick={() => setUseCustomRange(false)}
                  >
                    Xác Nhận
                  </Button>
                </div>
              )}
            </div>

            {/* Current Range Info */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3 border border-indigo-200/50">
              <p className="text-xs text-slate-600">
                <span className="font-semibold text-slate-900 capitalize">{periodType}</span>
                {" • "}
                {customStartDate && customEndDate ? (
                  <span>{customStartDate} - {customEndDate} <span className="ml-2 text-indigo-600 font-medium">(Tùy Chỉnh)</span></span>
                ) : (
                  <span className="text-slate-500 italic">Không có khoảng thời gian cụ thể</span>
                )}
              </p>
            </div>
          </div>

          {isLoading && (
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-600 bg-blue-50 border border-blue-200/50 rounded-lg p-3">
              <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
              <span>Đang tải dữ liệu...</span>
            </div>
          )}
        </div>

        {/* Key Metrics - Revenue Section */}
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Tổng Quan Doanh Thu</h2>
            <p className="text-sm text-slate-500 mt-2">Các chỉ số chính về giá trị và doanh thu</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SSEStatBox
              title="Tổng Doanh Thu"
              value={formatCurrency(revenueData.total_revenue)}
              icon={Banknote}
              color="purple"
              description="Doanh thu toàn kỳ"
            />
            <SSEStatBox
              title="Tổng Giá Trị Voucher"
              value={formatCurrency(summaryData.total_value)}
              icon={Wallet}
              color="indigo"
              description="Giá trị voucher phát hành"
            />
            <SSEStatBox
              title="Giá Trị Đã Sử Dụng"
              value={formatCurrency(summaryData.used_value)}
              icon={Banknote}
              color="green"
              description="Giá trị voucher đã dùng"
            />
            <SSEStatBox
              title="Giá Trị Còn Hiệu Lực"
              value={formatCurrency(summaryData.active_value)}
              icon={Wallet}
              color="teal"
              description="Giá trị còn khả dụng"
            />
          </div>
        </section>

        {/* Charts Section */}
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Biểu Đồ & Phân Tích</h2>
            <p className="text-sm text-slate-500 mt-2">Trend doanh thu và trạng thái voucher</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Revenue Chart - Larger */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200/50">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Biểu Đồ Doanh Thu</h3>
                <RevenueChart data={revenueSeries} />
              </div>
            </div>
            {/* Status Chart */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200/50 h-full">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Phân Bố Trạng Thái</h3>
                <VoucherStatusChart summary={summaryData} />
              </div>
            </div>
          </div>
        </section>

        {/* Revenue Details Chart */}
        {Array.isArray(revenueData.details) && revenueData.details.length > 0 && (
          <section className="mb-12">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Chi Tiết Doanh Thu 
                {periodType === "daily" && " Theo Ngày"}
                {periodType === "weekly" && " Theo Tuần"}
                {periodType === "monthly" && " Theo Tháng"}
              </h2>
              <p className="text-sm text-slate-500 mt-2">Breakdown chi tiết và so sánh</p>
            </div>
            <div className="bg-white rounded-xl shadow-md border border-slate-200/50 p-6">
              <div style={{ height: "400px" }}>
                <RevenueDetailChart 
                  data={revenueData.details} 
                  totalRevenue={revenueData.total_revenue}
                  period={periodType}
                />
              </div>
              {/* Summary Row */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200/50">
                <div>
                  <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-1">
                    {periodType === "daily" ? "Tổng Ngày" : periodType === "weekly" ? "Tổng Tuần" : "Tổng Tháng"}
                  </p>
                  <p className="text-2xl font-bold text-slate-900">{revenueData.details.length}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-1">Tổng Voucher Bán</p>
                  <p className="text-2xl font-bold text-blue-600">{formatNumber(revenueData.voucher_sold)}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-1">Tổng Doanh Thu</p>
                  <p className="text-2xl font-bold text-purple-600">{formatCurrency(revenueData.total_revenue)}</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Voucher Status Metrics */}
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Thống Kê Voucher</h2>
            <p className="text-sm text-slate-500 mt-2">Số lượng và trạng thái voucher theo danh mục</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <SSEStatBox
              title="Tổng Voucher"
              value={formatNumber(summaryData.total_voucher)}
              icon={Ticket}
              color="blue"
              description="Số lượng tất cả voucher"
            />
            <SSEStatBox
              title="Đang Hoạt Động"
              value={formatNumber(summaryData.active_voucher)}
              icon={CircleCheck}
              color="teal"
              description="Voucher hoạt động"
            />
            <SSEStatBox
              title="Đã Sử Dụng"
              value={formatNumber(summaryData.used_voucher)}
              icon={ShoppingCart}
              color="green"
              description="Voucher đã dùng"
            />
            <SSEStatBox
              title="Hết Hạn"
              value={formatNumber(summaryData.expired_voucher)}
              icon={CalendarIcon}
              color="amber"
              description="Voucher đã hết hạn"
            />
            <SSEStatBox
              title="Vô Hiệu Hóa"
              value={formatNumber(summaryData.inactive_voucher)}
              icon={Ban}
              color="red"
              description="Voucher tắt"
            />
          </div>
        </section>

        {/* Sales & Customers */}
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Khách Hàng & Bán Hàng</h2>
            <p className="text-sm text-slate-500 mt-2">Phân tích khách hàng hàng đầu</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Top Customers Table */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-xl shadow-md border border-slate-200/50 p-6 flex flex-col h-[34rem]">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Khách Hàng Hàng Đầu</h3>
                <div className="flex-1 min-h-0 overflow-hidden">
                  <TopCustomersTable data={topCustomers} />
                </div>
              </div>
            </div>
            {/* Top Customers Chart */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-xl shadow-md border border-slate-200/50 p-6 flex flex-col h-[34rem]">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Bán Hàng Theo Khách</h3>
                <div className="flex-1 min-h-0">
                  <TopCustomersChart data={topCustomers} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Zalo Stats Section */}
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Thống Kê QR & Zalo OA</h2>
            <p className="text-sm text-slate-500 mt-2">Lượt quét QR và tương tác từ Zalo Official Account</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <SSEStatBox
              title="Tổng Lượt Quét"
              value={formatNumber(zaloStats.total_scans)}
              icon={QrCode}
              color="blue"
              description="Tổng quét QR"
            />
            <SSEStatBox
              title="Người Dùng Duy Nhất"
              value={formatNumber(zaloStats.unique_users)}
              icon={Users}
              color="green"
              description="Người dùng khác nhau"
            />
            <SSEStatBox
              title="Quét Hôm Nay"
              value={formatNumber(zaloStats.scans_today)}
              icon={Activity}
              color="teal"
              description="Lượt quét hôm nay"
            />
            <SSEStatBox
              title="Quét Tuần Này"
              value={formatNumber(zaloStats.scans_this_week)}
              icon={Activity}
              color="amber"
              description="Lượt quét tuần này"
            />
            <SSEStatBox
              title="Quét Tháng Này"
              value={formatNumber(zaloStats.scans_this_month)}
              icon={Activity}
              color="purple"
              description="Lượt quét tháng này"
            />
          </div>
        </section>

        {/* Top Vouchers by Scans */}
        {(zaloStats.top_vouchers && zaloStats.top_vouchers.length > 0) && (
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Voucher Được Quét Nhiều Nhất</h2>
              <p className="text-sm text-slate-500 mt-2">Top vouchers được quét trên Zalo OA</p>
            </div>
            <div className="bg-white rounded-xl shadow-md border border-slate-200/50 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {zaloStats.top_vouchers.map((item, index) => {
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
                      className="relative overflow-hidden border border-slate-200 rounded-lg p-4 bg-gradient-to-br from-slate-50 to-slate-100 hover:shadow-md transition-shadow"
                    >
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Mã Voucher</p>
                        <p className="text-lg font-bold text-slate-900 mb-3 break-words">
                          {code}
                        </p>
                        <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                          <span className="text-xs text-slate-500">Lượt Quét</span>
                          <span className="text-lg font-bold text-indigo-600">
                            {formatNumber(scans)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
