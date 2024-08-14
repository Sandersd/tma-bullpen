"use client";

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
import { useRef, useState } from 'react';
import WebApp from '@twa-dev/sdk';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const lastIndexMap = new Map(); // Store lastIndex per chart instance

const crosshairLinePlugin: Plugin<'line'> = {
  id: 'crosshairLine',
  beforeDraw: (chart) => {
    const ctx = chart.ctx;
    const tooltip = chart.tooltip;
    const chartId = chart.id; // Use chart id as key for Map

    if (tooltip && tooltip.getActiveElements().length > 0) {
      const x = tooltip.getActiveElements()[0].element.x;
      const index = tooltip.getActiveElements()[0].index;
      const lastIndex = lastIndexMap.get(chartId);

      if (typeof window !== 'undefined' && index !== lastIndex) {
        WebApp.HapticFeedback.impactOccurred('soft');
        lastIndexMap.set(chartId, index); // Update the lastIndex in Map
      }

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

      // Gradient background
      const backgroundGradient = ctx.createLinearGradient(0, 0, 0, chart.height);
      backgroundGradient.addColorStop(0, 'rgba(255, 64, 129, 0.2)');
      backgroundGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = backgroundGradient;
      ctx.fillRect(chart.chartArea.left, chart.chartArea.top, chart.chartArea.right - chart.chartArea.left, chart.chartArea.bottom - chart.chartArea.top);
    }
  }
};

ChartJS.register(crosshairLinePlugin);

export default function PriceChart() {
  const chartRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  const data = {
    labels: [
      "12:00", "12:05", "12:10", "12:15", "12:20", "12:25", "12:30",
      "12:35", "12:40", "12:45", "12:50", "12:55", "13:00", "13:05",
      "13:10", "13:15", "13:20", "13:25", "13:30", "13:35", "13:40",
      "13:45", "13:50", "13:55", "14:00"
    ],
    datasets: [
      {
        label: "Price",
        data: [
          1.70, 1.72, 1.74, 1.73, 1.75, 1.78, 1.76, 1.77, 1.79, 1.78,
          1.80, 1.82, 1.81, 1.80, 1.82, 1.83, 1.84, 1.86, 1.85, 1.88,
          1.87, 1.89, 1.90, 1.88, 1.89, 1.91, 1.90, 1.92, 1.93, 1.91,
          1.92, 1.94, 1.93, 1.95, 1.94, 1.96, 1.95, 1.96, 1.97, 1.96,
          1.98, 1.99, 2.00, 1.99, 2.01, 2.02, 2.01, 2.03, 2.04, 2.02,
          2.03
        ],
        fill: true,
        backgroundColor: hovered ? 'rgba(76, 175, 80, 0.2)' : 'rgba(76, 175, 80, 0.6)',
        borderColor: "#4CAF50",
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
      setHovered(chartElement.length > 0);
    },
  };

  return (
    <div style={{ position: 'relative' }}>
      <Line ref={chartRef} data={data} options={options} />
    </div>
  );
}
