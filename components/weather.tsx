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
import { Button } from '@mui/material'

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
// 
type Props = {
  
    closeModal:  () => void;
  };



    export default function Weather({closeModal}:Props){
  const data = {
    labels: dummyData.map(item => item.date),
    datasets: [
      {
        label: 'Value',
        data: dummyData.map(item => item.value),
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Data Values Over Time',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Value',
        },
        beginAtZero: true,
      },
    },
  }

  return (
    <div className="modal-container">
    <div className="modal" style={{backgroundColor:'whitesmoke'}} >
<h1 style={{fontSize:'24px',fontWeight:'bold'}}>Sample Explode</h1>

<Button type="submit" variant="outlined" onClick={(e)=>{e.preventDefault();closeModal()}}>Close</Button>

      <Line data={data} options={options} />
    </div>
    </div>
  )
}