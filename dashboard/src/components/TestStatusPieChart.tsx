'use client';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface TestStatusPieChartProps {
  passed: number;
  failed: number;
  running: number;
  title: string;
  darkMode?: boolean;
}

export function TestStatusPieChart({ passed, failed, running, title, darkMode = false }: TestStatusPieChartProps) {
  const data = {
    labels: ['Passed', 'Failed', 'Running'],
    datasets: [
      {
        data: [passed, failed, running],
        backgroundColor: [
          'rgba(88, 80, 236, 0.2)',
          'rgba(219, 39, 119, 0.2)',
          'rgba(168, 85, 247, 0.2)'
        ],
        borderColor: [
          'rgb(88, 80, 236)',
          'rgb(219, 39, 119)',
          'rgb(168, 85, 247)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: darkMode ? '#fff' : '#000'
        }
      },
      title: {
        display: true,
        text: title,
        color: darkMode ? '#fff' : '#000'
      }
    }
  };

  return (
    <div className={`p-6 rounded-lg shadow ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <Pie data={data} options={options} />
    </div>
  );
} 