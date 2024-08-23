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
import RangeSelector from './RangeSelector';

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
  const [selectedRange, setSelectedRange] = useState<'1D' | '1W' | '1M'>('1D');

  const generateData = (range: '1D' | '1W' | '1M') => {
    const labels: string[] = [];
    const prices: number[] = [];

    switch (range) {
      case '1D':
        for (let hour = 9; hour <= 16; hour++) {
          for (let minute = 0; minute < 60; minute += 15) {
            labels.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
            prices.push(Number((Math.random() * (1.7 - 1.4) + 1.4).toFixed(2)));
          }
        }
        break;
      case '1W':
        for (let day = 0; day < 7; day++) {
          for (let hour = 9; hour <= 16; hour++) {
            labels.push(`Day ${day + 1} ${hour}:00`);
            prices.push(Number((Math.random() * (1.7 - 1.4) + 1.4).toFixed(2)));
          }
        }
        break;
      case '1M':
        for (let day = 1; day <= 30; day++) {
          labels.push(`Day ${day}`);
          prices.push(Number((Math.random() * (1.7 - 1.4) + 1.4).toFixed(2)));
        }
        break;
    }

    return { labels, prices };
  };

  const [data, setData] = useState(() => {
    const { labels, prices } = generateData('1D');
    return {
      labels,
      datasets: [
        {
          label: "Price",
          data: prices,
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
  });

  const handleRangeChange = (range: '1D' | '1W' | '1M') => {
    setSelectedRange(range);
    const { labels, prices } = generateData(range);
    setData(prevData => ({
      ...prevData,
      labels,
      datasets: [
        {
          ...prevData.datasets[0],
          data: prices,
        },
      ],
    }));
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

          if (context.tooltip.opacity > 0) {
            const tooltipModel = context.tooltip;
            
            // Position the tooltip
            const position = context.chart.canvas.getBoundingClientRect();
            tooltipEl.style.position = 'absolute';
            tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
            tooltipEl.style.top = position.top + window.pageYOffset + 'px';
            tooltipEl.style.pointerEvents = 'none';
            tooltipEl.style.opacity = '1';
            tooltipEl.style.display = 'block';
            
            if (tooltipModel.body) {
              const dataPoint = tooltipModel.dataPoints[0];
              const time = dataPoint.label;
              
              let innerHtml = `
                <div style="font-size: 12px; color: #666; text-align: center;">
                  ${time}
                </div>
              `;

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
      chartRef.current.tooltip?.setActiveElements([], { x: 0, y: 0 });
      
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
    let isDragging = false;
    let isPointerDown = false;

    const handlePointerDown = (event: PointerEvent) => {
      console.log('Pointer down');
      event.preventDefault();
      isPointerDown = true;
      isDragging = false;
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (isPointerDown) {
        console.log('Pointer move');
        event.preventDefault();
        isDragging = true;
      }
    };

    const handlePointerUp = (event: PointerEvent) => {
      console.log('Pointer up');
      event.preventDefault();
      if (isDragging) {
        resetChartState();
      }
      isPointerDown = false;
      isDragging = false;
    };

    const handlePointerCancel = (event: PointerEvent) => {
      console.log('Pointer cancel');
      event.preventDefault();
      resetChartState();
      isPointerDown = false;
      isDragging = false;
    };

    const handlePointerLeave = (event: PointerEvent) => {
      console.log('Pointer leave');
      event.preventDefault();
      if (isPointerDown) {
        resetChartState();
      }
      isPointerDown = false;
      isDragging = false;
    };

    const handleTouchStart = (event: TouchEvent) => {
      console.log('Touch start');
      event.preventDefault();
    };

    const handleTouchEnd = (event: TouchEvent) => {
      console.log('Touch end');
      event.preventDefault();
      resetChartState();
    };

    const chartContainer = chartRef.current?.canvas?.parentElement;
    if (chartContainer) {
      chartContainer.addEventListener('pointerdown', handlePointerDown);
      chartContainer.addEventListener('pointermove', handlePointerMove);
      chartContainer.addEventListener('pointerup', handlePointerUp);
      chartContainer.addEventListener('pointercancel', handlePointerCancel);
      chartContainer.addEventListener('pointerleave', handlePointerLeave);
      chartContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
      chartContainer.addEventListener('touchend', handleTouchEnd, { passive: false });
    }

    return () => {
      if (chartContainer) {
        chartContainer.removeEventListener('pointerdown', handlePointerDown);
        chartContainer.removeEventListener('pointermove', handlePointerMove);
        chartContainer.removeEventListener('pointerup', handlePointerUp);
        chartContainer.removeEventListener('pointercancel', handlePointerCancel);
        chartContainer.removeEventListener('pointerleave', handlePointerLeave);
        chartContainer.removeEventListener('touchstart', handleTouchStart);
        chartContainer.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.update();
    }
  }, [hovered]);

  return (
    <>
      <div style={{ position: 'relative', height: '200px', touchAction: 'none' }} onMouseLeave={resetChartState}>
        <div id="chartjs-tooltip" style={{ position: 'absolute', pointerEvents: 'none', display: 'none' }}></div>
        <Line ref={chartRef} data={data} options={options} />
      </div>
      <RangeSelector selectedRange={selectedRange} onRangeChange={handleRangeChange} />
    </>
  );
}