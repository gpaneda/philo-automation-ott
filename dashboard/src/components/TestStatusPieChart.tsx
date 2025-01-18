'use client';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface TestStatusPieChartProps {
  passed: number;
  failed: number;
  running: number;
  title: string;
}

export function TestStatusPieChart({ passed, failed, running, title }: TestStatusPieChartProps) {
  const data = {
    labels: ['Passed', 'Failed', 'Running'],
    datasets: [
      {
        data: [passed, failed, running],
        backgroundColor: [
          'rgba(34, 197, 94, 0.2)',  // green
          'rgba(239, 68, 68, 0.2)',  // red
          'rgba(234, 179, 8, 0.2)',  // yellow
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
          'rgb(234, 179, 8)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <Pie data={data} options={options} />
    </div>
  );
} 