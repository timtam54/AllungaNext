'use client'

import ClientApproveAccess from '@/components/clientapproveaccess';
import Header from '@/components/header';
import { useEffect, useState } from 'react'

interface ClientAccess {
id:number;
  email: string;
  clientId?: number;
  dtetme?: Date;
}

export default function ClientAccess() {
  const [clientAccess, setClientAccess] = useState<ClientAccess[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const fetchData = async () => {
    try {
      const response = await fetch('https://allungawebapicore.azurewebsites.net/api/ClientAccess/~/false')
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data: ClientAccess[] = await response.json()
      setClientAccess(data)
    } catch (error) {
      setError('Failed to fetch data')
      console.error('There was a problem with the fetch operation:', error)
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    

    fetchData()
  }, [])
  const [id, setId] = useState(0)
  const [modelOpen, setModelOpen] = useState(false)
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
  }
 
  return (
    <>
    <Header/>
    {modelOpen && <ClientApproveAccess id={id}  closeModal={() => {
            setModelOpen(false);
            fetchData()
          }}/>}
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Client Access Data</h1>
      <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
  <thead>
    <tr className="bg-gray-100">
      <th className="py-2 px-4 border-b text-center">Email</th>
      <th className="py-2 px-4 border-b text-center">Client ID</th>
      <th className="py-2 px-4 border-b text-center">Date/Time</th>
    </tr>
  </thead>
  <tbody>
    {clientAccess.map((item, index) => (
      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
        <td className="py-2 px-4 border-b text-center">
        <button
          onClick={() => {
            setId(item.id)
            setModelOpen(true)
          }}
          className="text-blue-600 hover:text-blue-800 underline focus:outline-none"
        >{item.email}</button>
        </td>
        <td className="py-2 px-4 border-b text-center">{item.clientId || 'N/A'}</td>
        <td className="py-2 px-4 border-b text-center">
          {item.dtetme ? new Date(item.dtetme).toLocaleString() : 'N/A'}
        </td>
      </tr>
    ))}
  </tbody>
</table>
      </div>
    </div>
    </>
  )
}