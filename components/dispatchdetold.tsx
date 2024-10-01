'use client'

import { useState, useEffect, ChangeEvent } from 'react'
import "@/components/part.css";

interface DispatchDet {
  dispatchid: number
  seriesid: number
  dte: string // ISO date string
  description: string
  staffid: number
  byrequest: boolean
  fullreturn_elsepart: boolean
  reexposuredate: string // ISO date string
  comments: string | null
  status: string | null
  splitfromdispatchid: number | null
}
interface Staff {
  staffid: number;
  staffname: string;
}
interface DispatchStatus {
  statuscode: string;
  statusdesc: string;
}
export default function DispatchEditor() {
  const [dispatch, setDispatch] = useState<DispatchDet | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [staff, setStaff] = useState<Staff[]>([]);
  const [statuses, setStatuses] = useState<DispatchStatus[]>([]);
  useEffect(() => {
    fetchStaff();
    fetchStatuses();
    fetchDispatch()
  }, [])

  const fetchStaff = async () => {
    try {
      const response = await fetch('https://allungawebapicore.azurewebsites.net/api/Staff');
      const data = await response.json();
      setStaff(data);
    } catch (error) {
      console.error('Error fetching staff data:', error);
    }
  };

  const fetchDispatch = async () => {
    try {
      const response = await fetch('https://allungawebapicore.azurewebsites.net/api/Dispatch/int/1')
      if (!response.ok) {
        throw new Error('Failed to fetch dispatch data')
      }
      const data: DispatchDet = await response.json()
      setDispatch(data)
      setIsLoading(false)
    } catch (err) {
      setError('Error fetching dispatch data')
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setDispatch(prev => {
      if (!prev) return null
      return {
        ...prev,
        [name]: type === 'number' ? Number(value) : type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }
    })
  }

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    //setDispatch({ ...dispatch!, [e.target.name]:parseInt( e.target.value) });
    //setDispatch({ ...dispatch!, staffid:parseInt( e.target.value!) });
    setDispatch({ ...dispatch!, [e.target.name]: e.target.value });
  }

  const fetchStatuses = async () => {
    try {
      const response = await fetch('https://allungawebapicore.azurewebsites.net/api/DispatchStatus');
      const data = await response.json();
      setStatuses(data);
    } catch (error) {
      console.error('Error fetching dispatch status data:', error);
    }
  };

  const handleSave = async (e:any) => {
    e.preventDefault();
    //alert('Dispatch data updated successfully!');
    if (dispatch==null) return

    try {
      const response = await fetch(`https://allungawebapicore.azurewebsites.net/api/Dispatch/${dispatch.dispatchid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dispatch),
      })

      if (!response.ok) {
        throw new Error('Failed to update dispatch data')
      }

      alert('Dispatch data updated successfully!')
    } catch (err) {
      setError('Error updating dispatch data')
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!dispatch) return <div>No dispatch data found</div>

  return (
    <div className="modal-container">
    <div className="modal" style={{backgroundColor:'whitesmoke'}} >
    <h1 className="text-2xl font-bold mb-4">Edit Dispatch</h1>
      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          <div>
            <label htmlFor="dte" className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="datetime-local"
              id="dte"
              name="dte"
              value={dispatch.dte.slice(0, 16)}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              id="description"
              name="description"
              value={dispatch.description}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="staffid" className="block text-sm font-medium text-gray-700">Staff ID</label>
            <select name="staffid"  value={dispatch.staffid} onChange={handleChange}>
      {staff.map((staffMember) => (
        <option key={staffMember.staffid} value={staffMember.staffid}>
          {staffMember.staffname}
        </option>
      ))}
    </select>
           
          </div>
          <div>
            <label htmlFor="reexposuredate" className="block text-sm font-medium text-gray-700">Re-exposure Date</label>
            <input
              type="datetime-local"
              id="reexposuredate"
              name="reexposuredate"
              value={dispatch.reexposuredate.slice(0, 16)}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <select name="status" value={dispatch.status || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                {statuses.map((status) => (
                  <option key={status.statuscode} value={status.statuscode}>
                    {status.statusdesc}
                  </option>
                ))}
              </select>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="byrequest"
              name="byrequest"
              checked={dispatch.byrequest}
              onChange={handleInputChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="byrequest" className="ml-2 block text-sm text-gray-900">
              By Request
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="fullreturn_elsepart"
              name="fullreturn_elsepart"
              checked={dispatch.fullreturn_elsepart}
              onChange={handleInputChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="fullreturn_elsepart" className="ml-2 block text-sm text-gray-900">
              Full Return
            </label>
          </div>
        </div>
        <div>
          <label htmlFor="comments" className="block text-sm font-medium text-gray-700">Comments</label>
          <textarea
            id="comments"
            name="comments"
            value={dispatch.comments || ''}
            onChange={handleInputChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          > Save Changes
          </button>
        </div>
     
    </div>
    </div>
  )
}