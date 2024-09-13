"use client"

import React, { useState, useEffect } from "react"
import { Circles } from 'react-loader-spinner'
import { getToken } from "@/msal/msal"
import Button from '@mui/material/Button';
interface ExposureTypeProps {
  closeModal: () => void
  exposuretypeid: number
}

interface ExposureRow {
  ExposureTypeID: number
  Name: string
  SortOrder: number
  Description: string
}

const ExposureType: React.FC<ExposureTypeProps> = ({ closeModal, exposuretypeid }) => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<ExposureRow | null>(null)

  const endPoint = `https://allungawebapi.azurewebsites.net/api/ExposureTypes/${exposuretypeid}`

  const fetchInfo = async () => {
    try {
      const token = await getToken()
      const response = await fetch(endPoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(response.statusText)
      }

      const json = await response.json()
      setData(json)
    } catch (error) {
      console.error('Error fetching exposure type:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInfo()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (data) {
      setData({ ...data, [e.target.name]: e.target.value })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = await getToken()
      const headers = new Headers({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      })

      const method = exposuretypeid === 0 ? 'POST' : 'PUT'
      const response = await fetch(endPoint, {
        method,
        body: JSON.stringify(data),
        headers,
      })

      if (!response.ok) {
        throw new Error(response.statusText)
      }

      const json = await response.json()
      setData(json)
    } catch (error) {
      console.error('Error submitting exposure type:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Exposure Type Details</h2>
          {loading ? (
            <div className="flex justify-center">
              <Circles height="80" width="80" color="#4b5563" ariaLabel="loading" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="ExposureTypeID" className="block text-sm font-medium text-gray-700">ID</label>
                  <input
                    type="text"
                    id="ExposureTypeID"
                    name="ExposureTypeID"
                    value={data?.ExposureTypeID || ''}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label htmlFor="Name" className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    id="Name"
                    name="Name"
                    value={data?.Name || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="Description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  id="Description"
                  name="Description"
                  rows={4}
                  value={data?.Description || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="SortOrder" className="block text-sm font-medium text-gray-700">Sort Order</label>
                <input
                  type="number"
                  id="SortOrder"
                  name="SortOrder"
                  value={data?.SortOrder || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default ExposureType