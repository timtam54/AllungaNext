'use client'

import { useState, useEffect, ChangeEvent } from 'react'
import { Save, Calendar, User, FileText, RefreshCcw, CheckSquare, Square, XIcon } from 'lucide-react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

interface DispatchDet {
  dispatchid: number
  seriesid: number
  dte: Date
  description: string
  staffid: number
  byrequest: boolean
  fullreturn_elsepart: boolean
  reexposuredate: Date
  comments: string | null
  status: string | null
  splitfromdispatchid: number | null
}

interface Staff {
  staffid: number
  staffname: string
}

interface DispatchStatus {
  statuscode: string
  statusdesc: string
}
interface Props {
  dispid: number
  closeModal: () => void
}
export default function DispatchDet({ dispid, closeModal }: Props) {
  const [dispatch, setDispatch] = useState<DispatchDet | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [staff, setStaff] = useState<Staff[]>([])
  const [statuses, setStatuses] = useState<DispatchStatus[]>([])

  useEffect(() => {
    fetchStaff()
    fetchStatuses()
    fetchDispatch()
  }, [])

  const fetchStaff = async () => {
    try {
      const response = await fetch('https://allungawebapicore.azurewebsites.net/api/Staff')
      const data = await response.json()
      setStaff(data)
    } 
    catch (error) 
    {
      console.error('Error fetching staff data:', error)
    }
  }

  const fetchDispatch = async () => {
    try {
      if (dispid==0)
      {
        setDispatch({dispatchid:0, seriesid:0, dte:new Date(), description:'', staffid:0, byrequest:false, fullreturn_elsepart:false, reexposuredate:new Date(), comments:'', status:'', splitfromdispatchid:0})
        setIsLoading(false)
        return;
      }
      const response = await fetch('https://allungawebapicore.azurewebsites.net/api/Dispatch/int/'+dispid.toString())
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

  const fetchStatuses = async () => {
    try {
      const response = await fetch('https://allungawebapicore.azurewebsites.net/api/DispatchStatus')
      const data = await response.json()
      setStatuses(data)
    } catch (error) {
      console.error('Error fetching dispatch status data:', error)
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
  const setdte = async (value: Date | null) => {
      if (value === null) return;
      setDispatch({ ...dispatch!, dte: value });
  }

  const setreexposuredate = async (value: Date | null) => {
    if (value === null) return;
    setDispatch({ ...dispatch!, reexposuredate: value });
}

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setDispatch({ ...dispatch!, [e.target.name]: e.target.value });
  }

  const handleSave = async (e:any) => {
    e.preventDefault();
    //alert('Dispatch data updated successfully!');
    if (dispatch==null) return

    try {
      const response = await fetch((dispid==0)?`https://allungawebapicore.azurewebsites.net/api/Dispatch/`:`https://allungawebapicore.azurewebsites.net/api/Dispatch/${dispatch.dispatchid}`, {
        method: (dispid==0)?'POST':'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dispatch),
      })
      if (dispid==0 )
      {
        closeModal();
        return;
      }
      if (!response.ok) {
        throw new Error('Failed to update dispatch data')
      }

      alert('Dispatch data updated successfully!')
    } catch (err) {
      setError('Error updating dispatch data')
    }
  }

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>
  if (!dispatch) return <div className="flex justify-center items-center h-screen">No dispatch data found</div>

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div style={{display:'flex',justifyContent:'space-between',alignContent:'center'}}>
              <h1 className="text-2xl font-semibold text-center mb-6">Edit Dispatch</h1>

              <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-md shadow-sm hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Save Changes
                </button>

                <button
              onClick={closeModal}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Close modal"
            >
              <XIcon size={24} />
            </button>
            </div>
        
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="dte" className="block text-sm font-medium text-gray-700 mb-1">
                    <Calendar className="inline-block w-4 h-4 mr-1" /> Date
                  </label>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  
                   <DatePicker
                    selected={dispatch.dte}
                    onChange={setdte}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    <FileText className="inline-block w-4 h-4 mr-1" /> Description
                  </label>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <input
                    type="text"
                    id="description"
                    name="description"
                    value={dispatch.description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-300 focus:ring focus:ring-cyan-200 focus:ring-opacity-50"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="staffid" className="block text-sm font-medium text-gray-700 mb-1">
                    <User className="inline-block w-4 h-4 mr-1" /> Staff
                  </label>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <select
                    name="staffid"
                    value={dispatch.staffid}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-300 focus:ring focus:ring-cyan-200 focus:ring-opacity-50"
                  >
                    {staff.map((staffMember) => (
                      <option key={staffMember.staffid} value={staffMember.staffid}>
                        {staffMember.staffname}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="reexposuredate" className="block text-sm font-medium text-gray-700 mb-1">
                    <RefreshCcw className="inline-block w-4 h-4 mr-1" /> Re-exposure Date
                  </label>
                </div>
                <div className="col-span-2 sm:col-span-1">
                <DatePicker
                    selected={dispatch.reexposuredate}
                    onChange={setreexposuredate}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    dateFormat="dd/MM/yyyy"
                  />

                 
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <select
                    name="status"
                    value={dispatch.status || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-300 focus:ring focus:ring-cyan-200 focus:ring-opacity-50"
                  >
                    {statuses.map((status) => (
                      <option key={status.statuscode} value={status.statuscode}>
                        {status.statusdesc}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2 flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="byrequest"
                      name="byrequest"
                      checked={dispatch.byrequest}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
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
                      className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                    />
                    <label htmlFor="fullreturn_elsepart" className="ml-2 block text-sm text-gray-900">
                      Full Return
                    </label>
                  </div>
                </div>
                <div className="col-span-2">
                  <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
                  <textarea
                    id="comments"
                    name="comments"
                    value={dispatch.comments || ''}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-300 focus:ring focus:ring-cyan-200 focus:ring-opacity-50"
                  />
                </div>
              </div>
             
           
          </div>
        </div>
      </div>
    </div>
  )
}

/*
<input
                    type="datetime-local"
                    id="dte"
                    name="dte"
                    value={dispatch.dte.slice(0, 16)}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-300 focus:ring focus:ring-cyan-200 focus:ring-opacity-50"
                  />*/