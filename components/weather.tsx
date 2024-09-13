'use client'

import React from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { X } from 'lucide-react'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const dummyData = [
  { date: '2024-08-20', value: 23 },
  { date: '2024-08-21', value: 22 },
  { date: '2024-08-22', value: 28 },
  { date: '2024-08-23', value: 25 },
  { date: '2024-08-24', value: 29 },
  { date: '2024-08-25', value: 30 },
  { date: '2024-08-26', value: 27 },
]

type Props = {
  closeModal: () => void
}

export default function Weather({ closeModal }: Props) {
  const data = {
    labels: dummyData.map(item => new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Temperature',
        data: dummyData.map(item => item.value),
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        tension: 0.4,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 12,
        },
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            size: 12,
          },
          callback: function(value: number) {
            return value + '°C'
          },
        },
      },
    },
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Weather Forecast</h1>
            <button
              onClick={closeModal}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <Line data={data} options={options} />
          </div>
          <div className="mt-6 text-center text-sm text-gray-600">
            7-day temperature forecast (°C)
          </div>
        </div>
      </div>
    </div>
  )
}