'use client'

import { Button } from '@mui/material';
import { useEffect, useState } from 'react'

interface ClientEmail {
  email: string;
  role: string;
}
interface ClientEmailsProps {
  id: number;
  closeModal: () => void;
}

export default function ClientEmails({id, closeModal}:ClientEmailsProps) {
  const [data, setData] = useState<ClientEmail[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ep=process.env.NEXT_PUBLIC_API+'ClientsEmail/{reportid}?reporid='+id.toString();
       // alert(ep);
        const response = await fetch(ep);
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError('An error occurred while fetching data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
  }

  return (

    <div className="container mx-auto px-4 py-8">
       <div style={{display:'flex',justifyContent:'space-between'}}>
       <h1 className="text-2xl font-bold mb-4">Client Email Addresses</h1>
       <Button variant="contained" onClick={closeModal} style={{ float: 'right' }}>Close</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Email</th>
              <th className="border p-2 text-left">Role</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border p-2">{item.email}</td>
                <td className="border p-2">{item.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
   
  )
}