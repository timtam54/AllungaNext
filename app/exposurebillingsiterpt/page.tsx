'use client'

import Header from '@/components/headerltest';
import { useState, useEffect } from 'react'

interface ExpBillSiteRpt {
  clientID: number;
  clientName: string;
  seriesID: number;
  seriesName: string;
  monthNo: number;
  year: number;
  exposureTypeNameorGroupName: string;
  exposureSampleRateGroupsID?: number;
  exposureTypeID: number;
  equivSampleCount: number;
}

export default function ExposureBillingSiteRpt() {
  const [data, setData] = useState<ExpBillSiteRpt[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://allungawebapicore.azurewebsites.net/api/ExposureSiteMonthBill')
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const result = await response.json()
        setData(result)
      } catch (error) {
        setError('Failed to fetch data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) return <div className="text-center p-4">Loading...</div>
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>

  return (
    <>
    <Header/>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border-b">Client Name</th>
            <th className="px-4 py-2 border-b">Series Name</th>
            <th className="px-4 py-2 border-b">Month</th>
            <th className="px-4 py-2 border-b">Year</th>
            <th className="px-4 py-2 border-b">Exposure Type/Group</th>
            <th className="px-4 py-2 border-b">Equiv Sample Count</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className="px-4 py-2 border-b">{item.clientName}</td>
              <td className="px-4 py-2 border-b">{item.seriesName}</td>
              <td className="px-4 py-2 border-b">{item.monthNo}</td>
              <td className="px-4 py-2 border-b">{item.year}</td>
              <td className="px-4 py-2 border-b">{item.exposureTypeNameorGroupName}</td>
              <td className="px-4 py-2 border-b">{item.equivSampleCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>

  )
}