'use client'

import { useState, useEffect, ChangeEvent } from 'react'
import { Save, Calendar, User, FileText, RefreshCcw, XIcon } from 'lucide-react'
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
  selectsamples:(id:number)=>void
  seriesID: number
  dispid: number
  closeModal: () => void
}

export default function DispatchDet({selectsamples, seriesID, dispid, closeModal }: Props) {
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
    } catch (error) {
      console.error('Error fetching staff data:', error)
    }
  }

  const fetchDispatch = async () => {
    try {
      if (dispid === 0) {
        setDispatch({
          dispatchid: 0,
          seriesid: seriesID,
          dte: new Date(),
          description: '',
          staffid: 0,
          byrequest: false,
          fullreturn_elsepart: false,
          reexposuredate: new Date(),
          comments: '',
          status: 'N',
          splitfromdispatchid: 0
        })
        setIsLoading(false)
        return
      }
      const response = await fetch(`https://allungawebapicore.azurewebsites.net/api/Dispatch/int/${dispid}`)
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

  const setdte = (value: Date | null) => {
    if (value === null) return
    setDispatch(prev => prev ? { ...prev, dte: value } : null)
  }

  const setreexposuredate = (value: Date | null) => {
    if (value === null) return
    setDispatch(prev => prev ? { ...prev, reexposuredate: value } : null)
  }

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setDispatch(prev => prev ? { ...prev, [e.target.name]: parseInt(e.target.value) } : null)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (dispatch == null) return

    try {
      const response = await fetch(
        dispid === 0
          ? 'https://allungawebapicore.azurewebsites.net/api/Dispatch/'
          : `https://allungawebapicore.azurewebsites.net/api/Dispatch/${dispatch.dispatchid}`,
        {
          method: dispid === 0 ? 'POST' : 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dispatch),
        }
      )
      if (!response.ok) {
        alert('Failed to update dispatch data');
        return;
       }
      if (dispid === 0) {
        
        const data: DispatchDet = await response.json()
        alert(data.dispatchid);
        selectsamples(data.dispatchid)
        alert('Dispatch data added successfully!')
        closeModal()
        return
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
    <div className="min-h-screen bg-gradient-to-br from-gray-200 to-gray-100 py-4 flex flex-col justify-center sm:py-6">
      <div className="relative sm:max-w-xl sm:mx-auto w-full">
        <div className="relative px-4 py-6 bg-white shadow-lg sm:rounded-lg sm:p-10">
          <form onSubmit={handleSave} className="max-w-md mx-auto space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Edit Dispatch</h1>
              <button
                type="button"
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500 transition-colors"
                aria-label="Close modal"
              >
                <XIcon size={24} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:space-x-4">
                <div className="flex-1 space-y-1">
                  <label htmlFor="dte" className="block text-sm font-medium text-gray-700">
                    <Calendar className="inline-block w-4 h-4 mr-1" /> Date
                  </label>
                  <DatePicker
                    selected={dispatch.dte}
                    onChange={setdte}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <label htmlFor="reexposuredate" className="block text-sm font-medium text-gray-700">
                    <RefreshCcw className="inline-block w-4 h-4 mr-1" /> Re-exposure Date
                  </label>
                  <DatePicker
                    selected={dispatch.reexposuredate}
                    onChange={setreexposuredate}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:space-x-4">
              <div className="space-y-1">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  <FileText className="inline-block w-4 h-4 mr-1" /> Description
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={dispatch.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="staffid" className="block text-sm font-medium text-gray-700">
                  <User className="inline-block w-4 h-4 mr-1" /> Staff
                </label>
                <select
                  name="staffid"
                  value={dispatch.staffid}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  {staff.map((staffMember) => (
                    <option key={staffMember.staffid} value={staffMember.staffid}>
                      {staffMember.staffname}
                    </option>
                  ))}
                </select>
              </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:space-x-4">
              <div className="space-y-1">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  name="status"
                  value={dispatch.status || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  {statuses.map((status) => (
                    <option key={status.statuscode} value={status.statuscode}>
                      {status.statusdesc}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-4">
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
              </div>
              <div className="space-y-1">
                <label htmlFor="comments" className="block text-sm font-medium text-gray-700">Comments</label>
                <textarea
                  id="comments"
                  name="comments"
                  value={dispatch.comments || ''}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
              >
                <Save className="w-5 h-5 mr-2" />
                {dispid!=0?"Save Changes":"Add New/Next"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}