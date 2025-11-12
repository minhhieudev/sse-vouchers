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
  Legend
);

export function RevenueChart({ data }) {
  const chartData = {
    labels: data.map((stat) => stat.date),
    datasets: [
      {
        label: "Doanh thu (triệu VND)",
        data: data.map((stat) => stat.revenue),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        yAxisID: 'y',
      },
      {
        label: "Lượt sử dụng Voucher",
        data: data.map((stat) => stat.vouchersUsed),
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.5)",
        yAxisID: 'y1',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
        mode: 'index',
        intersect: false,
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Xu hướng Doanh thu & Lượt sử dụng Voucher (7 ngày gần nhất)",
        font: {
            size: 18,
        }
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 12,
        },
      },
    },
    scales: {
        y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
                display: true,
                text: 'Doanh thu (triệu VND)'
            }
        },
        y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
                display: true,
                text: 'Lượt sử dụng'
            },
            grid: {
                drawOnChartArea: false, // only draw grid lines for the first Y axis
            },
        },
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div style={{ height: "400px" }}>
            <Line options={options} data={chartData} />
        </div>
    </div>
  );
}
