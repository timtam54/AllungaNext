'use client'

import ClientApproveAccess from '@/components/clientapproveaccess';
import Header from '@/components/header';
import { useEffect, useState } from 'react'

interface ClientAccess {
  id:number;
  email: string;
  clientname?: string;
  dtetme?: Date;
}

export default function ClientAccess() {
  const [clientAccess, setClientAccess] = useState<ClientAccess[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [approved, setApproved] = useState(true)
  const fetchData = async (apprvd:boolean) => {
    try {
      const ep=process.env.NEXT_PUBLIC_API+'ClientAccess/~/'+(apprvd?'false':'true');
      console.log(ep);
      const response = await fetch(ep);
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
    fetchData(false);
  }, [])


  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'ascending' });

  const sortedClientAccess = [...clientAccess].sort((a:any, b:any) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key:string) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };


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
            fetchData(!approved)
          }}/>}
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-bold mb-4">Client Access Data</h1>
      <b>Approved</b>
      <input type='checkbox' checked={approved} onChange={(e:any) => {const chk=e.target.checked;setApproved(chk);fetchData(!chk);}} />
      </div>
      <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          <th
            className="py-2 px-4 border-b text-center cursor-pointer"
            onClick={() => requestSort('email')}
          >
            Email
          </th>
          <th
            className="py-2 px-4 border-b text-center cursor-pointer"
            onClick={() => requestSort('clientname')}
          >
            Client
          </th>
          <th
            className="py-2 px-4 border-b text-center cursor-pointer"
            onClick={() => requestSort('dtetme')}
          >
            Date/Time
          </th>
        </tr>
      </thead>
  <tbody>
    {sortedClientAccess.map((item, index) => (
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
        <td className="py-2 px-4 border-b text-center">{item.clientname || 'N/A'}</td>
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