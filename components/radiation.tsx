import { useState, useEffect } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Button } from '@mui/material'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

// Mock data for the last 7 days (radiation in µSv/h)
const mockData = [
  { day: "Mon", radiation: 0.08 },
  { day: "Tue", radiation: 0.09 },
  { day: "Wed", radiation: 0.11 },
  { day: "Thu", radiation: 0.10 },
  { day: "Fri", radiation: 0.12 },
  { day: "Sat", radiation: 0.09 },
  { day: "Sun", radiation: 0.08 },
]

type Props = {
  closeModal: () => void;
}

export default function Radiation({ closeModal }: Props) {
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
    }[];
  }>({
    labels: [],
    datasets: [
      {
        label: 'Radiation (µSv/h)',
        data: [],
        backgroundColor: 'rgba(79, 70, 229, 0.6)',
        borderColor: 'rgba(79, 70, 229, 1)',
        borderWidth: 1,
      },
    ],
  })

  const [chartOptions, setChartOptions] = useState({})

  useEffect(() => {
    setChartData({
      labels: mockData.map(data => data.day),
      datasets: [
        {
          label: 'Radiation (µSv/h)',
          data: mockData.map(data => data.radiation),
          backgroundColor: 'rgba(79, 70, 229, 0.6)',
          borderColor: 'rgba(79, 70, 229, 1)',
          borderWidth: 1,
        },
      ],
    })

    setChartOptions({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: 'Radiation Levels Over Last 7 Days',
          font: {
            size: 16,
            weight: 'bold',
          },
        },
      },
    })
  }, [])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Radiation Levels</h2>
              <p className="text-sm text-gray-600">Last 7 Days</p>
            </div>
            <Button
              variant="outlined"
              onClick={closeModal}
              className="text-gray-600 hover:text-gray-800"
            >
              Close
            </Button>
          </div>
          
          <div className="h-80 mb-6">
            <Bar options={chartOptions} data={chartData} />
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-xs text-gray-500 leading-relaxed">
              µSv/h: microsieverts per hour. Normal background radiation levels typically range from 0.08 to 0.20 µSv/h.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}