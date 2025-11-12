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

export function VoucherStatusChart({ data }) {
  const statusCounts = data.reduce((acc, voucher) => {
    const status = voucher.status || 'unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(statusCounts).map(s => s.charAt(0).toUpperCase() + s.slice(1)), // Capitalize status
    datasets: [
      {
        label: "Số lượng voucher",
        data: Object.values(statusCounts),
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)", // active (blue)
          "rgba(16, 185, 129, 0.8)", // used (green)
          "rgba(245, 158, 11, 0.8)", // expired (amber)
          "rgba(107, 114, 128, 0.8)", // scheduled (gray)
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
        text: "Phân bổ trạng thái Voucher",
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
