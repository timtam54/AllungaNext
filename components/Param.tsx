"use client"

import React, { useState, useEffect, ChangeEvent } from "react"
import { Circles } from 'react-loader-spinner'
import { getToken } from "@/msal/msal"

interface ParamRow {
  ParamID: number
  ParamName: string
  ValueRange: string
  EquivalentValues: string
  Ordering: number
  Unit: string
  VisualNoReadings: string
  ReportParamCostGroupID: number
  ReportRateDiscounted: number
  ReportRateStandard: number
}

type Props = {
  ParamID: number
  closeModal: () => void
}

export default function Component({ ParamID, closeModal }: Props) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<ParamRow>()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setData({ ...data!, [e.target.name]: e.target.value })
  }

  const fetchInfo = async () => {
    setLoading(true)
    const token = await getToken()
    const headers = new Headers()
    const bearer = `Bearer ${token}`
    headers.append('Authorization', bearer)

    const options = {
      method: 'GET',
      headers: headers,
    }

    try {
      const response = await fetch(`https://allungawebapi.azurewebsites.net/api/Params/${ParamID}`, options)
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      const json = await response.json()
      setData(json)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInfo()
  }, [ParamID])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`https://allungawebapi.azurewebsites.net/api/Params/${ParamID}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
      if (!response.ok) {
        throw new Error("Failed to update parameter")
      }
      alert("Parameter updated successfully!")
    } catch (error) {
      console.error("Error updating parameter:", error)
      alert("Failed to update parameter. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Circles height="80" width="80" color="#4F46E5" ariaLabel="circles-loading" visible={true} />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Parameter Details</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(data || {}).map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <label htmlFor={key} className="text-sm font-medium text-gray-700 mb-1">
                  {key}:
                </label>
                <input
                  type="text"
                  id={key}
                  name={key}
                  value={value}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={closeModal}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-150 ease-in-out"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}