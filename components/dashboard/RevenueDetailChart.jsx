"use client";
import { Chart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
);

const toCurrency = (value = 0) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

const toNumber = (value = 0) => Number(value || 0).toLocaleString("vi-VN");

export function RevenueDetailChart({ data, totalRevenue = 0, period = "monthly" }) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-500">
        <p>Chưa có dữ liệu chi tiết</p>
      </div>
    );
  }

  // Format labels based on period type
  const getLabel = (item, index) => {
    if (period === "daily" && item.date) {
      const [, , day] = item.date.split("-");
      return `${day}`;
    }
    if (period === "weekly" && item.week_start) {
      const start = new Date(item.week_start);
      return `Tuần ${start.getDate()}`;
    }
    if (period === "monthly" && item.month) {
      const [year, month] = item.month.split("-");
      return `${month}/${year.slice(-2)}`;
    }
    return `${index + 1}`;
  };

  const labels = data.map((item, index) => getLabel(item, index));

  const chartData = {
    labels,
    datasets: [
      {
        type: "bar",
        label: "Số Lượng Voucher",
        data: data.map((item) => item.count || 0),
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
        borderRadius: 6,
        yAxisID: "y",
        order: 2,
      },
      {
        type: "line",
        label: "Doanh Thu (VND)",
        data: data.map((item) => item.revenue || 0),
        borderColor: "rgb(168, 85, 247)",
        backgroundColor: "rgba(168, 85, 247, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: "rgb(168, 85, 247)",
        pointBorderColor: "white",
        pointBorderWidth: 2,
        pointHoverRadius: 7,
        yAxisID: "y1",
        order: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 12, weight: "bold" },
          color: "rgba(0, 0, 0, 0.7)",
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: { size: 14, weight: "bold" },
        bodyFont: { size: 13 },
        callbacks: {
          title: (context) => {
            const item = data[context[0]?.dataIndex];
            if (period === "daily") return item?.date || "";
            if (period === "weekly") return `${item?.week_start?.split("T")[0]} → ${item?.week_end?.split("T")[0]}`;
            return item?.month || "";
          },
          label: (context) => {
            if (context.dataset.type === "bar") {
              return `Số lượng: ${toNumber(context.parsed.y)} voucher`;
            }
            return `Doanh thu: ${toCurrency(context.parsed.y)}`;
          },
          afterLabel: (context) => {
            if (context.dataset.type === "line") {
              const value = context.parsed.y;
              const percentage = totalRevenue > 0 
                ? ((value / totalRevenue) * 100).toFixed(1)
                : 0;
              return `Tỉ lệ: ${percentage}%`;
            }
          },
        },
      },
    },
    scales: {
      y: {
        type: "linear",
        position: "left",
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
          drawBorder: false,
        },
        ticks: {
          callback: (value) => toNumber(value),
          font: { size: 11 },
          color: "rgba(0, 0, 0, 0.6)",
        },
        title: {
          display: true,
          text: "Số Lượng Voucher",
          font: { size: 12, weight: "bold" },
          color: "rgba(59, 130, 246, 1)",
        },
      },
      y1: {
        type: "linear",
        position: "right",
        beginAtZero: true,
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          callback: (value) => toCurrency(value),
          font: { size: 11 },
          color: "rgba(0, 0, 0, 0.6)",
        },
        title: {
          display: true,
          text: "Doanh Thu (VND)",
          font: { size: 12, weight: "bold" },
          color: "rgb(168, 85, 247)",
        },
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          font: { size: 11 },
          color: "rgba(0, 0, 0, 0.6)",
        },
      },
    },
  };

  return <Chart type="bar" data={chartData} options={options} height={300} />;
}
