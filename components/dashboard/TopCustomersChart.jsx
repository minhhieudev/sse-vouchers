"use client";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export function TopCustomersChart({ data }) {
  const labels = data.map(
    (customer, index) => customer.name || `Khách hàng ${index + 1}`,
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: "Tổng giá trị (VND)",
        data: data.map((customer) => customer.total_value ?? 0),
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
        borderRadius: 4,
        yAxisID: "y",
      },
      {
        label: "Số voucher đã dùng",
        data: data.map((customer) => customer.used ?? 0),
        backgroundColor: "rgba(16, 185, 129, 0.8)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 1,
        borderRadius: 4,
        yAxisID: "y1",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Top khách hàng sử dụng voucher",
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
            if (isValueAxis) {
              return `${context.dataset.label}: ${new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
                maximumFractionDigits: 0,
              }).format(value)}`;
            }
            return `${context.dataset.label}: ${value.toLocaleString("vi-VN")}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        position: "left",
        ticks: {
          callback(value) {
            return new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
              maximumFractionDigits: 0,
            }).format(value);
          },
        },
      },
      y1: {
        beginAtZero: true,
        position: "right",
        grid: { drawOnChartArea: false },
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
        <Bar options={options} data={chartData} />
      </div>
    </div>
  );
}
