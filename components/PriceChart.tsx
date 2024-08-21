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
import { useRef, useState, useEffect } from 'react';
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

const lastIndexMap = new Map();

const crosshairLinePlugin: Plugin<'line'> = {
  id: 'crosshairLine',
  beforeDraw: (chart) => {
    const ctx = chart.ctx;
    const tooltip = chart.tooltip;
    const chartId = chart.id;

    if (tooltip && tooltip.getActiveElements().length > 0) {
      const x = tooltip.getActiveElements()[0].element.x;
      const index = tooltip.getActiveElements()[0].index;
      const lastIndex = lastIndexMap.get(chartId);

      if (typeof window !== 'undefined' && index !== lastIndex) {
        WebApp.HapticFeedback.impactOccurred('soft');
        lastIndexMap.set(chartId, index);
      }

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, chart.chartArea.top);
      ctx.lineTo(x, chart.chartArea.bottom);
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.stroke();
      ctx.restore();

      const gradient = ctx.createLinearGradient(0, 0, chart.width, 0);
      gradient.addColorStop(0, 'rgba(52, 199, 89, 1)');
      gradient.addColorStop(x / chart.width, 'rgba(52, 199, 89, 1)');
      gradient.addColorStop(x / chart.width, 'rgba(52, 199, 89, 0.5)');
      gradient.addColorStop(1, 'rgba(52, 199, 89, 0.5)');

      chart.data.datasets[0].borderColor = gradient;
      chart.update('none');

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(chart.chartArea.left, chart.chartArea.bottom);

      const meta = chart.getDatasetMeta(0);
      for (let i = 0; i <= index; i++) {
        const point = meta.data[i] as any;
        ctx.lineTo(point.x, point.y);
      }

      ctx.lineTo(x, chart.chartArea.bottom);
      ctx.closePath();

      const backgroundGradient = ctx.createLinearGradient(0, 0, 0, chart.height);
      backgroundGradient.addColorStop(0, 'rgba(52, 199, 89, 0.1)');
      backgroundGradient.addColorStop(1, 'rgba(52, 199, 89, 0)');

      ctx.fillStyle = backgroundGradient;
      ctx.fill();
      ctx.restore();
    } else {
      // Reset the line color when not hovering
      chart.data.datasets[0].borderColor = 'rgba(52, 199, 89, 1)';
      chart.update('none');
    }
  }
};

ChartJS.register(crosshairLinePlugin);

interface PriceChartProps {
  onPriceHover: (price: number) => void;
}

export default function PriceChart({ onPriceHover }: PriceChartProps) {
  const chartRef = useRef<ChartJS<"line">>(null);
  const [hovered, setHovered] = useState(false);

  const data = {
    labels: [
      "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
      "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00"
    ],
    datasets: [
      {
        label: "Price",
        data: [
          1.42, 1.39, 1.45, 1.48, 1.52, 1.55, 1.59, 1.57, 1.54, 1.51,
          1.53, 1.55, 1.56, 1.56
        ],
        fill: true,
        backgroundColor: (context: { chart: any; }) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) {
            return null;
          }
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, 'rgba(52, 199, 89, 0)');
          gradient.addColorStop(1, 'rgba(52, 199, 89, 0.1)');
          return gradient;
        },
        borderColor: 'rgba(52, 199, 89, 1)',
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
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

      if (chartElement.length > 0 && chartRef.current) {
        const dataIndex = chartElement[0].index;
        const price = chartRef.current.data.datasets[0].data[dataIndex] as number;
        onPriceHover(price);
      }
    },
  };

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.update();
    }
  }, [hovered]);

  return (
    <div style={{ position: 'relative', height: '200px' }}>
      <Line ref={chartRef} data={data} options={options} />
    </div>
  );
}