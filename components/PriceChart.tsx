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

    // Apply background gradient at all times
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(chart.chartArea.left, chart.chartArea.bottom);

    const meta = chart.getDatasetMeta(0);
    for (let i = 0; i < meta.data.length; i++) {
      const point = meta.data[i] as any;
      ctx.lineTo(point.x, point.y);
    }

    ctx.lineTo(chart.chartArea.right, chart.chartArea.bottom);
    ctx.closePath();

    const backgroundGradient = ctx.createLinearGradient(0, 0, 0, chart.height);
    backgroundGradient.addColorStop(0, 'rgba(52, 199, 89, 0.2)');
    backgroundGradient.addColorStop(1, 'rgba(52, 199, 89, 0)');

    ctx.fillStyle = backgroundGradient;
    ctx.fill();
    ctx.restore();

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
      backgroundGradient.addColorStop(0, 'rgba(52, 199, 89, 0.2)');
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
      "09:30", "09:35", "09:40", "09:45", "09:50", "09:55", "10:00", "10:05", "10:10", "10:15",
      "10:20", "10:25", "10:30", "10:35", "10:40", "10:45", "10:50", "10:55", "11:00", "11:05",
      "11:10", "11:15", "11:20", "11:25", "11:30", "11:35", "11:40", "11:45", "11:50", "11:55",
      "12:00", "12:05", "12:10", "12:15", "12:20", "12:25", "12:30", "12:35", "12:40", "12:45",
      "12:50", "12:55", "13:00", "13:05", "13:10", "13:15", "13:20", "13:25", "13:30", "13:35",
      "13:40", "13:45", "13:50", "13:55", "14:00", "14:05", "14:10", "14:15", "14:20", "14:25",
      "14:30", "14:35", "14:40", "14:45", "14:50", "14:55", "15:00", "15:05", "15:10", "15:15",
      "15:20", "15:25", "15:30", "15:35", "15:40", "15:45", "15:50", "15:55", "16:00"
    ],
    datasets: [
      {
        label: "Price",
        data: [
          1.42, 1.41, 1.40, 1.39, 1.38, 1.39, 1.39, 1.40, 1.41, 1.42,
          1.43, 1.44, 1.45, 1.46, 1.47, 1.48, 1.49, 1.50, 1.48, 1.49,
          1.50, 1.51, 1.52, 1.53, 1.52, 1.53, 1.54, 1.55, 1.56, 1.57,
          1.55, 1.56, 1.57, 1.58, 1.59, 1.60, 1.59, 1.58, 1.57, 1.56,
          1.55, 1.54, 1.57, 1.56, 1.55, 1.54, 1.53, 1.52, 1.54, 1.53,
          1.52, 1.51, 1.50, 1.49, 1.51, 1.52, 1.53, 1.54, 1.55, 1.56,
          1.53, 1.54, 1.55, 1.56, 1.57, 1.58, 1.55, 1.56, 1.57, 1.58,
          1.59, 1.60, 1.56, 1.57, 1.58, 1.59, 1.60, 1.61, 1.56
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
          gradient.addColorStop(1, 'rgba(52, 199, 89, 0.2)');
          return gradient;
        },
        borderColor: 'rgba(52, 199, 89, 1)',
        tension: 0.2,
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
        position: 'average',
        yAlign: 'bottom',
        xAlign: 'center',
        callbacks: {
          title: (tooltipItems) => {
            return tooltipItems[0].label;
          },
          label: () => '',
        },
        displayColors: false,
        backgroundColor: 'rgba(255, 255, 255, 0)',
        titleColor: '#000',
        titleFont: {
          weight: 'normal',
        },
        padding: 4,
        enabled: false,
        external: function(context) {
          const tooltipEl = document.getElementById('chartjs-tooltip');
          if (!tooltipEl) return;

          const chart = context.chart;
          const { ctx, chartArea } = chart;

          // Show the tooltip when there's active data
          if (context.tooltip.opacity > 0) {
            const tooltipModel = context.tooltip;
            
            // Position the tooltip
            const position = chart.canvas.getBoundingClientRect();
            tooltipEl.style.position = 'absolute';
            tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
            tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
            tooltipEl.style.pointerEvents = 'none';
            tooltipEl.style.opacity = '1';
            tooltipEl.style.display = 'block';
            
            // Update the content of the tooltip
            if (tooltipModel.body) {
              const titleLines = tooltipModel.title || [];
              let innerHtml = '<div>';
              titleLines.forEach(title => {
                innerHtml += '<span>' + title + '</span>';
              });
              innerHtml += '</div>';

              tooltipEl.innerHTML = innerHtml;
            }
          } else {
            tooltipEl.style.opacity = '0';
            tooltipEl.style.display = 'none';
          }
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

  const resetChartState = () => {
    console.log('Resetting chart state');
    setHovered(false);
    if (chartRef.current) {
      // Reset the border color
      chartRef.current.data.datasets[0].borderColor = 'rgba(52, 199, 89, 1)';
      // Hide the tooltip
      if (chartRef.current.tooltip) {
        chartRef.current.tooltip.setActiveElements([], { x: 0, y: 0 });
      }
      
      // Clear any hover styles
      chartRef.current.setActiveElements([]);
      // Update the chart
      chartRef.current.update();
    }
    onPriceHover(chartRef.current?.data.datasets[0].data[chartRef.current?.data.datasets[0].data.length - 1] as number ?? 0);

    // Hide the custom tooltip element
    const tooltipEl = document.getElementById('chartjs-tooltip');
    if (tooltipEl) {
      tooltipEl.style.opacity = '0';
      tooltipEl.style.display = 'none';
    }
  };

  useEffect(() => {
    const handleTouchStart = (event: TouchEvent) => {
      console.log('Touch started');
      event.preventDefault(); // Prevent scrolling
    };

    const handleTouchMove = (event: TouchEvent) => {
      event.preventDefault(); // Prevent scrolling
    };

    const handleTouchEnd = () => {
      console.log('Touch ended');
      resetChartState();
    };

    const chartContainer = chartRef.current?.canvas?.parentElement;
    if (chartContainer) {
      chartContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
      chartContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
      chartContainer.addEventListener('touchend', handleTouchEnd);
      chartContainer.addEventListener('touchcancel', handleTouchEnd);
    }

    return () => {
      if (chartContainer) {
        chartContainer.removeEventListener('touchstart', handleTouchStart);
        chartContainer.removeEventListener('touchmove', handleTouchMove);
        chartContainer.removeEventListener('touchend', handleTouchEnd);
        chartContainer.removeEventListener('touchcancel', handleTouchEnd);
      }
    };
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.update();
    }
  }, [hovered]);

  return (
    <div style={{ position: 'relative', height: '200px', touchAction: 'none' }} onMouseLeave={resetChartState}>
      <div id="chartjs-tooltip" style={{ position: 'absolute', pointerEvents: 'none', display: 'none' }}></div>
      <Line ref={chartRef} data={data} options={options} />
    </div>
  );
}