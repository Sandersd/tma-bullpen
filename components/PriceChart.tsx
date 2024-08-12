import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Plugin,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useRef } from 'react';
import WebApp from '@twa-dev/sdk'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


const crosshairLinePlugin: Plugin<'line'> = {
  id: 'crosshairLine',
  beforeDraw: (chart) => {
    const ctx = chart.ctx;
    const tooltip = chart.tooltip;

    if (tooltip && tooltip.getActiveElements().length > 0) {
      const x = tooltip.getActiveElements()[0].element.x;

      
      if (navigator.vibrate) {
        navigator.vibrate(50); 
      }

      WebApp.HapticFeedback.impactOccurred('light');

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, chart.chartArea.top);
      ctx.lineTo(x, chart.chartArea.bottom);
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#FFFFFF';
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.restore();

      const gradient = ctx.createLinearGradient(0, 0, chart.width, 0);
      gradient.addColorStop(0, '#FF4081');
      gradient.addColorStop(x / chart.width, '#FF4081');
      gradient.addColorStop(x / chart.width, '#FF408130');
      gradient.addColorStop(1, '#FF408130');

      chart.data.datasets[0].borderColor = gradient;
    }
  }
};

ChartJS.register(crosshairLinePlugin);

export default function PriceChart() {
  const chartRef = useRef(null);

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
        borderColor: "#FF4081",
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    scales: {
      x: {
        type: "category",
      },
      y: {
        type: "linear",
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function (tooltipItem) {
            const value = tooltipItem.raw as number; 
            return `$${value.toFixed(2)}`;
          },
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
    onHover: function (event, chartElement) {
      const target = event.native?.target as HTMLElement | null;
      if (target) {
        target.style.cursor = chartElement[0] ? 'pointer' : 'default';
      }
    },
  };

  return (
    <div style={{ position: 'relative' }}>
      <Line ref={chartRef} data={data} options={options} />
    </div>
  );
}

