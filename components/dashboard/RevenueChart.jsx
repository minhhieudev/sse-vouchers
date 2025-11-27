"use client";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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

export function RevenueChart({ data }) {
  const labels = data.map(
    (stat, index) =>
      stat.label ||
      stat.date ||
      stat.period ||
      stat.period_label ||
      stat.start_date ||
      `P${index + 1}`,
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: "Tổng doanh thu (VND)",
        data: data.map(
          (stat) =>
            stat.total_revenue ??
            stat.revenue ??
            stat.totalValue ??
            stat.value ??
            0,
        ),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        yAxisID: "y",
      },
      {
        label: "Số voucher bán/đã dùng",
        data: data.map(
          (stat) =>
            stat.voucher_sold ??
            stat.voucher_used ??
            stat.vouchersUsed ??
            stat.used ??
            stat.count ??
            0,
        ),
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.5)",
        yAxisID: "y1",
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
        position: "top",
      },
      title: {
        display: true,
        text: "Xu hướng doanh thu voucher",
        font: {
          size: 18,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 12,
        },
        callbacks: {
          label(context) {
            const isValueAxis = context.dataset.yAxisID === "y";
            const value = context.parsed.y ?? 0;
            if (isValueAxis) return `${context.dataset.label}: ${toCurrency(value)}`;
            return `${context.dataset.label}: ${value.toLocaleString("vi-VN")}`;
          },
        },
      },
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "Doanh thu (VND)",
        },
        ticks: {
          callback(value) {
            return toCurrency(value);
          },
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "Số voucher",
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback(value) {
            return value.toLocaleString("vi-VN");
          },
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div style={{ height: "400px" }}>
        <Line options={options} data={chartData} />
      </div>
    </div>
  );
}
