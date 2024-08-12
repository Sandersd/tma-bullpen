import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function PriceChart() {
  const data = {
    labels: ["MAX", "3M", "1M", "1W", "1D", "4H", "LIVE"],
    datasets: [
      {
        label: "Price",
        data: [
          1.5, 
          1.7, 
          1.8, 
          1.6, 
          1.74, 
          1.8, 
          1.85, 
        ],
        fill: false,
        borderColor: "#4CAF50",
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        type: "category" as const,
      },
      y: {
        type: "linear" as const,
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return <Line data={data} options={options} />;
}
