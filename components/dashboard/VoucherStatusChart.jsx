"use client";

import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

export function VoucherStatusChart({ summary, data = [] }) {
  const statusLabelMap = {
    active: "Đang hoạt động",
    used: "Đã dùng",
    expired: "Hết hạn",
    inactive: "Vô hiệu hóa",
    unknown: "Khác",
  };

  const getLabel = (status) =>
    statusLabelMap[status] || status.toUpperCase();

  const statusCounts = summary
    ? {
        active: summary.active_voucher ?? 0,
        used: summary.used_voucher ?? 0,
        expired: summary.expired_voucher ?? 0,
        inactive: summary.inactive_voucher ?? 0,
      }
    : data.reduce((acc, voucher) => {
        const status = voucher.status || "unknown";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

  const labels = Object.keys(statusCounts);
  const chartData = {
    labels: labels.map((label) => getLabel(label)),
    datasets: [
      {
        label: "Số lượng voucher",
        data: labels.map((label) => statusCounts[label]),
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)", // active
          "rgba(16, 185, 129, 0.8)", // used
          "rgba(245, 158, 11, 0.8)", // expired
          "rgba(107, 114, 128, 0.8)", // inactive/others
        ],
        borderColor: [
          "rgba(59, 130, 246, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(245, 158, 11, 1)",
          "rgba(107, 114, 128, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Phân bổ trạng thái voucher",
        font: {
          size: 18,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div style={{ height: "400px" }}>
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
}
