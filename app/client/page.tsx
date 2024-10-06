'use client'

import React, { useState, useEffect, ChangeEvent } from "react"
import { Circles } from 'react-loader-spinner'
import { getToken } from "@/msal/msal"
import { useSearchParams } from "next/navigation"
import Header from "@/components/header"

interface ClientRow {
  clientid: number
  companyname: string
  groupname: string
  contactname: string
  address: string
  description: string
  abbreviation: string
  technicalphone: string
  technicalemail: string
  accountingcontact: string
  accountingemail: string
  lat: number
  lon: number
  groupName: string
  Website: string
  TechnicalPhone: string
  TechnicalMobile: string
  TechnicalEmail: string
  TechnicalFax: string
  TechnicalTitle: string
  TechnicalRole: string
  AccountingContact: string
  AccoutingPhone: string
  AccountingMobile: string
  AccountingEmail: string
  AccountingFax: string
  AccountingTitle: string
  AccountAddress: string
  AccountRole: string
  AccountingDesc: string
  FreightContact: string
  FreightPhone: string
  FreightMobile: string
  FreightEmail: string
  FreightFax: string
  FreightAddress: string
  FreightDesc: string
}

export default function Client() {
  const searchParams = useSearchParams()
  const id = parseInt(searchParams!.get("id")!)

  const [loading, setLoading] = useState(true)
  const [ClientID, setClientID] = useState(id)
  const [data, setData] = useState<ClientRow>({} as ClientRow)
  const [validationErrors, setValidationErrors] = useState({
    companyname: '',
    contactname: '',
    abbreviation: ''
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  const fetchInfo = async () => {
    if (ClientID !== 0) {
      try {
        const token = await getToken()
        const headers = new Headers()
        headers.append('Authorization', `Bearer ${token}`)
        const options = { method: 'GET', headers: headers }
        const endPoint = `https://allungawebapi.azurewebsites.net/api/Clients/int/${ClientID}`
        const response = await fetch(endPoint, options)
        if (!response.ok) throw new Error(response.statusText)
        const json = await response.json()
        setData(json)
      } catch (error) {
        console.error("Failed to fetch client info:", error)
        alert("Failed to load client information. Please try again.")
      } finally {
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInfo()
  }, [])

  const validatePage = () => {
    const errors = {
      companyname: '',
      contactname: '',
      abbreviation: ''
    }
    let isValid = true

    if (!data.companyname) {
      errors.companyname = 'Please enter a Company Name'
      isValid = false
    }
    if (!data.contactname) {
      errors.contactname = 'Please enter a Contact Name'
      isValid = false
    }
    if (data.abbreviation && data.abbreviation.length > 5) {
      errors.abbreviation = 'Abbreviation is 5 characters max'
      isValid = false
    }

    setValidationErrors(errors)
    return isValid
  }

  const handleSubmit = async () => {
    if (!validatePage()) return

    setLoading(true)
    try {
      const token = await getToken()
      const headers = new Headers()
      headers.append('Authorization', `Bearer ${token}`)
      headers.append('Content-type', "application/json; charset=UTF-8")

      const options = {
        method: ClientID === 0 ? 'POST' : 'PUT',
        body: JSON.stringify(data),
        headers: headers,
      }

      const endpoint = ClientID === 0
        ? `https://allungawebapi.azurewebsites.net/api/Clients`
        : `https://allungawebapi.azurewebsites.net/api/Clients/${ClientID}`

      const response = await fetch(endpoint, options)
      if (!response.ok) 
        throw new Error(response.statusText)
      else
      {
        alert("Client information saved successfully.");
      }
      
      if (ClientID === 0) {
        const json = await response.json()
        setClientID(json.ClientID)
        setData(json);
      }
      
    } catch (error) {
      console.error("Failed to submit form:", error)
      alert("Failed to save client information. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Circles height="80" width="80" color="#4F46E5" ariaLabel="circles-loading" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Client</h1>
          <a
            href={`/?clientname=${data.companyname}&clientid=${ClientID}`}
            className="text-indigo-600 hover:text-indigo-800 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            View all Series
          </a>
        </div>

        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="companyname">
                Company Name
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  validationErrors.companyname ? 'border-red-500' : ''
                }`}
                id="companyname"
                type="text"
                name="companyname"
                value={data.companyname || ''}
                onChange={handleChange}
              />
              {validationErrors.companyname && (
                <p className="text-red-500 text-xs italic">{validationErrors.companyname}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="abbreviation">
                Code
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  validationErrors.abbreviation ? 'border-red-500' : ''
                }`}
                id="abbreviation"
                type="text"
                name="abbreviation"
                value={data.abbreviation || ''}
                onChange={handleChange}
              />
              {validationErrors.abbreviation && (
                <p className="text-red-500 text-xs italic">{validationErrors.abbreviation}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="groupName">
                Group
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="groupName"
                type="text"
                name="groupName"
                value={data.groupName || ''}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Website">
              Website
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="Website"
              type="text"
              name="Website"
              value={data.Website || ''}
              onChange={handleChange}
            />
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-4">Tech Contact</h2>
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contactname">
                Name
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  validationErrors.contactname ? 'border-red-500' : ''
                }`}
                id="contactname"
                type="text"
                name="contactname"
                value={data.contactname || ''}
                onChange={handleChange}
              />
              {validationErrors.contactname && (
                <p className="text-red-500 text-xs italic">{validationErrors.contactname}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="TechnicalPhone">
                Phone
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="TechnicalPhone"
                type="text"
                name="TechnicalPhone"
                value={data.TechnicalPhone || ''}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="TechnicalMobile">
                Mobile
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="TechnicalMobile"
                type="text"
                name="TechnicalMobile"
                value={data.TechnicalMobile || ''}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="TechnicalEmail">
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="TechnicalEmail"
                type="email"
                name="TechnicalEmail"
                value={data.TechnicalEmail || ''}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="TechnicalFax">
                Fax
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="TechnicalFax"
                type="text"
                name="TechnicalFax"
                value={data.TechnicalFax || ''}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="TechnicalTitle">
                Title
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="TechnicalTitle"
                type="text"
                name="TechnicalTitle"
                value={data.TechnicalTitle || ''}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
              Address
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="address"
              type="text"
              name="address"
              value={data.address || ''}
              onChange={handleChange}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="TechnicalRole">
              Role
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="TechnicalRole"
              type="text"
              name="TechnicalRole"
              value={data.TechnicalRole || ''}
              onChange={handleChange}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Notes
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              name="description"
              rows={3}
              value={data.description || ''}
              onChange={handleChange}
            />
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-4">Accounting Contact</h2>
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="AccountingContact">
                Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="AccountingContact"
                type="text"
                name="AccountingContact"
                value={data.AccountingContact || ''}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="AccoutingPhone">
                Phone
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="AccoutingPhone"
                type="text"
                name="AccoutingPhone"
                value={data.AccoutingPhone || ''}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="AccountingMobile">
                Mobile
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="AccountingMobile"
                type="text"
                name="AccountingMobile"
                value={data.AccountingMobile || ''}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="AccountingEmail">
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="AccountingEmail"
                type="email"
                name="AccountingEmail"
                value={data.AccountingEmail || ''}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="AccountingFax">
                Fax
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="AccountingFax"
                type="text"
                name="AccountingFax"
                value={data.AccountingFax || ''}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="AccountingTitle">
                Title
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="AccountingTitle"
                type="text"
                name="AccountingTitle"
                value={data.AccountingTitle || ''}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="AccountAddress">
              Address
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="AccountAddress"
              type="text"
              name="AccountAddress"
              value={data.AccountAddress || ''}
              onChange={handleChange}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="AccountRole">
              Role
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="AccountRole"
              type="text"
              name="AccountRole"
              value={data.AccountRole || ''}
              onChange={handleChange}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="AccountingDesc">
              Notes
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="AccountingDesc"
              name="AccountingDesc"
              rows={3}
              value={data.AccountingDesc || ''}
              onChange={handleChange}
            />
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-4">Freight</h2>
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="FreightContact">
                Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="FreightContact"
                type="text"
                name="FreightContact"
                value={data.FreightContact || ''}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="FreightPhone">
                Phone
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="FreightPhone"
                type="text"
                name="FreightPhone"
                value={data.FreightPhone || ''}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="FreightMobile">
                Mobile
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="FreightMobile"
                type="text"
                name="FreightMobile"
                value={data.FreightMobile || ''}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="FreightEmail">
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="FreightEmail"
                type="email"
                name="FreightEmail"
                value={data.FreightEmail || ''}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="FreightFax">
                Fax
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="FreightFax"
                type="text"
                name="FreightFax"
                value={data.FreightFax || ''}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="FreightAddress">
              Address
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="FreightAddress"
              type="text"
              name="FreightAddress"
              value={data.FreightAddress || ''}
              onChange={handleChange}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="FreightDesc">
              Notes
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="FreightDesc"
              name="FreightDesc"
              rows={3}
              value={data.FreightDesc || ''}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center justify-between mt-6">
            <button
              className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}