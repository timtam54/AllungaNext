'use client'
import React, { useState, useEffect } from "react"
import { getToken } from "@/msal/msal"

type Props = {
  sampleId: number
  seriesId: number
  closeModal: () => void
}

interface SampleRow {
  seriesid: number
  Reportable: boolean
  Deleted: boolean
  SampleOrder: number
  ExposureTypeID: number
  SampleID: number
  Number: number
  description: string
  longdescription: string
  EquivalentSamples: number
}

interface ExposureTypeRow {
  ExposureTypeID: number
  Name: string
}

export default function Sample({ closeModal, sampleId, seriesId }: Props) {
  const [loading, setLoading] = useState(true)
  const [sampleID, setSampleID] = useState(sampleId)
  const [exposureTypes, setExposureTypes] = useState<ExposureTypeRow[]>([])
  const [data, setData] = useState<SampleRow>()

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    await fetchExposureTypes()
    await fetchSample()
    setLoading(false)
  }

  const fetchExposureTypes = async () => {
    setLoading(true)
    const url = `https://allungawebapi.azurewebsites.net/api/ExposureTypes/`
    const token = await getToken()
    const headers = new Headers()
    headers.append('Authorization', `Bearer ${token}`)
    const options = { method: 'GET', headers }
    
    try {
      const response = await fetch(url, options)
      if (!response.ok) throw new Error(response.statusText)
      const json = await response.json()
      setExposureTypes(json)
    } catch (error) {
      console.error("Failed to fetch exposure types:", error)
    }
  }

  const fetchSample = async () => {
    const url = `https://allungawebapi.azurewebsites.net/api/Samples/int/${sampleID}`
    const token = await getToken()
    const headers = new Headers()
    headers.append('Authorization', `Bearer ${token}`)
    const options = { method: 'GET', headers }
    
    try {
      const response = await fetch(url, options)
      if (!response.ok) throw new Error(response.statusText)
      const json = await response.json()
      setData(json)
    } catch (error) {
      console.error("Failed to fetch sample:", error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setData({ ...data!, [e.target.name]: e.target.value })
  }

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data!, [e.target.name]: e.target.checked })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const url = sampleID === 0
      ? `https://allungawebapi.azurewebsites.net/api/Samples/`
      : `https://allungawebapi.azurewebsites.net/api/Samples/${sampleID}`

    const token = await getToken()
    const headers = new Headers()
    headers.append('Authorization', `Bearer ${token}`)
    headers.append('Content-type', "application/json; charset=UTF-8")

    const body = JSON.stringify(sampleID === 0 ? { ...data, seriesid: seriesId } : data)
    const options = { method: 'PUT', body, headers }

    try {
      const response = await fetch(url, options)
      if (!response.ok) throw new Error(response.statusText)
      const json = await response.json()
      setSampleID(json.SampleID)
      setData(json)
    } catch (error) {
      console.error("Failed to submit sample:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  return (
    <>
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Sample Details</h2>

          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Client ID</label>
              <input
                type="text"
                id="description"
                name="description"
                value={data?.description || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-black shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="Number" className="block text-sm font-medium text-gray-700">AEL Ref</label>
              <input
                type="text"
                id="Number"
                name="Number"
                value={data?.Number || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-black shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="longdescription" className="block text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                id="longdescription"
                name="longdescription"
                value={data?.longdescription || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-black shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="EquivalentSamples" className="block text-sm font-medium text-gray-700">Equivalent Samples</label>
              <input
                type="number"
                id="EquivalentSamples"
                name="EquivalentSamples"
                value={data?.EquivalentSamples || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-black shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="ExposureTypeID" className="block text-sm font-medium text-gray-700">Exposure Type</label>
              <select
                id="ExposureTypeID"
                name="ExposureTypeID"
                value={data?.ExposureTypeID}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-black shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              >
                {exposureTypes.map((ep) => (
                  <option key={ep.ExposureTypeID} value={ep.ExposureTypeID}>{ep.Name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="Reportable"
                name="Reportable"
                checked={data?.Reportable || false}
                onChange={handleCheck}
                className="rounded border-black text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <label htmlFor="Reportable" className="text-sm text-gray-700">Reportable</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="Deleted"
                name="Deleted"
                checked={data?.Deleted || false}
                onChange={handleCheck}
                className="rounded border-black text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <label htmlFor="Deleted" className="text-sm text-gray-700">Deleted</label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 border border-black"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </form>
        </>
  )
}