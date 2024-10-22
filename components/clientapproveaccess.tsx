'use client'

import React, { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"

interface ClientAccess {
  id: number;
  email: string;
  clientID?: number;
  dtetme?: Date;
}
interface clientrow{
  clientid:number;   
  companyname:string;
}
interface ClientApproveAccessProps {
    id: number;
    closeModal: () => void;
  }
  
  export default function ClientApproveAccess({ id, closeModal }:ClientApproveAccessProps){
  
  const [clientAccess, setClientAccess] = useState<ClientAccess>({
    id: 1,
    email: '',
    clientID: undefined,
    dtetme: undefined
  })

  const [isLoading, setIsLoading] = useState(true)
  
  const [error, setError] = useState<string | null>(null)
  const [clients, setClients] = useState<clientrow[]>([]);
  useEffect(() => {
    fetchAllData();
  }, [])

  const fetchAllData=async()=>
  {
    await fetchClient();
    await fetchClientAccess();
  }
//  const [data, setData] = useState<clientrow>();
  const fetchClientAccess = async () => {
    try {
      const response = await fetch('https://allungawebapicore.azurewebsites.net/api/ClientAccess/'+id.toString());
      if (!response.ok) {
        throw new Error('Failed to fetch client access data')
      }
      const data: ClientAccess[] = await response.json()
      /*setClientAccess({
        ...data,
        dtetme: data.dtetme ? new Date(data.dtetme) : undefined
      })*/
        setClientAccess(data[0]);
        console.table(data[0]);
        setIsLoading(false)
    }   
    catch (err) {
      setError('Error fetching client access data')
      setIsLoading(false)
    }
  }
  const fetchClient = async()=>{

    //const token = await getToken()
    const headers = new Headers()
    //const bearer = `Bearer ${token}`
    //headers.append('Authorization', bearer)
    const options = {
      method: 'GET',
      headers: headers,
    }
    const endPoint = process.env.NEXT_PUBLIC_API+`Clients/~`;
    const response = fetch(endPoint,options);
    var ee=await response;
    if (!ee.ok)
    {
      alert((ee).statusText);
      return;
    }
    const json=await ee.json();
   
    setClients(json);
   }
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setClientAccess(prev => ({ ...prev, [name]: value }))
  }
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value  = e.target.value;
    setClientAccess(({ ...clientAccess, clientID: parseInt(value) }))
  }
  const handleDateChange = (date: Date | null) => {
    setClientAccess(prev => ({ ...prev, dtetme: date || undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('https://allungawebapicore.azurewebsites.net/api/ClientAccess/'+id.toString(), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientAccess),
      })
      if (!response.ok) {
        throw new Error('Failed to update client access data')
      }
      alert('Client access data updated successfully!');
      closeModal();
    } catch (err) {
      setError('Error updating client access data')
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="modal-container">
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">Client Access</h1>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={clientAccess.email}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">Client</label>
            <select className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          value={clientAccess.clientID} onChange={handleSelectChange}>
            <option key="">-Select Client-</option>
        {clients.map(client => (
          <option key={client.clientid} value={client.clientid}>
            {client.companyname}
          </option>
        ))}
      </select>
           
          </div>
          <div>
            <label htmlFor="dtetme" className="block text-sm font-medium text-gray-700">Date Time</label>
            <DatePicker
              selected={clientAccess.dtetme}
              onChange={handleDateChange}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="space-y-4">
          <div>
          <button
            onClick={handleSubmit}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Update
          </button>
          <button
            onClick={closeModal}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">Close</button>
        </div></div></div>
      </div>
    </div>
    </div>
  )
}