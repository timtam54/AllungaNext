"use client"

import React, { ChangeEvent, useState } from "react"
import { getToken, msalInstance } from "@/msal/msal"
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css'
import { ArrowLeft, Mail, Save } from 'lucide-react'

type Props = {
  report: ReportRow
  closeModal?: () => void
}

interface ReportRow {
  reportid: number
  reportname: string
  bookandpage: string
  reportstatus: string
  return_elsereport: boolean
  deleted: boolean
  comment: string
  completedDate: Date
  date: Date
  DaysInLab: number
}

export default function ReportDet({ report, closeModal }: Props) {
  const [reportDate, setReportDate] = useState<Date | null>(new Date(report.date))
  const [data, setData] = useState<ReportRow>(report)
  const [units] = useState(["N", "A", "C", "S"])
  const [completedDate, setCompletedDate] = useState<Date | null>(report.completedDate ? new Date(report.completedDate) : null)
  const [dirty, setDirty] = useState(false)

  const handleChangeReport = (e: ChangeEvent<HTMLInputElement>) => {
    if (!dirty) setDirty(true)
    setData({ ...data, [e.target.name]: e.target.value })
  }

  const handleChangeTextArea = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setData({ ...data, [e.target.name]: e.target.value })
    setDirty(true)
  }

  const handleCheckReport = (e: ChangeEvent<HTMLInputElement>) => {
    if (!dirty) setDirty(true)
    setData({ ...data, [e.target.name]: e.target.checked })
  }

  const handleChangeReportSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    if (!dirty) setDirty(true)
    setData({ ...data, 'reportstatus': e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await saveReport()
  }

  const saveReport = async () => {
    setDirty(false)
    const updatedData = { 
      ...data, 
      date: reportDate || new Date(), 
      completedDate: completedDate || new Date() 
    }
    setData(updatedData)

    const token = await getToken()
    const headers = new Headers()
    const bearer = `Bearer ${token}`
    headers.append('Authorization', bearer)
    headers.append('Content-type', "application/json; charset=UTF-8")
    const method = (data.reportid !== 0) ? 'PUT' : 'POST'

    const options = {
      method: method,
      body: JSON.stringify(updatedData),
      headers: headers,
    }

    const saveurl = `https://allungawebapi.azurewebsites.net/api/Reports/${data.reportid || ''}`
    try {
      const response = await fetch(saveurl, options)
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      alert('Saved successfully')
    } catch (error) {
      alert('Error saving report')
      console.error('Error:', error)
    }
  }

  const user = msalInstance.getActiveAccount()

  const sendEmail = async () => {
    const formData = new FormData()
    const email = user?.username || ''
    formData.append('recipient', email)
    formData.append('subject', data.reportname);
    formData.append('labels', `${data.reportname} report has been completed`)

    try {
      const resp = await fetch('/api/contact', {
        method: "post", 
        body: formData,
      })
      if (!resp.ok) {
        throw new Error('Failed to send email')
      }
      const responseData = await resp.json()
      console.log(responseData['message'])
      alert('Message successfully sent')
    } catch (error) {
      console.error('Error sending email:', error)
      alert('Failed to send email')
    }
  }

  return (
    <div className="modal-container">
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Report Details</h2>
          <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>
        <form className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Report Date</label>
              <DatePicker
                format="dd/MM/yyyy"
                onSelect={setReportDate}
                
                value={reportDate}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="reportname" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                id="reportname"
                name="reportname"
                value={data.reportname}
                onChange={handleChangeReport}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="bookandpage" className="block text-sm font-medium text-gray-700 mb-1">Book & Page</label>
              <input
                type="text"
                id="bookandpage"
                name="bookandpage"
                value={data.bookandpage}
                onChange={handleChangeReport}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="reportstatus" className="block text-sm font-medium text-gray-700 mb-1">Report Status</label>
              <select
                id="reportstatus"
                name="reportstatus"
                value={data.reportstatus}
                onChange={handleChangeReportSelect}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {units.map((unit) => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="return_elsereport"
                name="return_elsereport"
                checked={data.return_elsereport}
                onChange={handleCheckReport}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="return_elsereport" className="ml-2 block text-sm text-gray-900">
                Return (else Report)
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="deleted"
                name="deleted"
                checked={data.deleted}
                onChange={handleCheckReport}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="deleted" className="ml-2 block text-sm text-gray-900">
                Deleted
              </label>
            </div>
          </div>
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
            <textarea
              id="comment"
              name="comment"
              rows={4}
              value={data.comment}
              onChange={handleChangeTextArea}
              className="w-full p-2 border border-gray-300 rounded-md"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Completed Date</label>
            <DatePicker
              format="dd/MM/yyyy"
              onSelect={setCompletedDate}
              value={completedDate}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex justify-between items-center pt-4">
            <button
              type="submit" onClick={handleSubmit}
              disabled={!dirty}
              className={`flex items-center px-4 py-2 rounded-md text-white ${dirty ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400'} transition-colors duration-200`}><Save className="w-5 h-5 mr-2" />
              Save Changes
            </button>
            <button
              type="button"
              onClick={sendEmail}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
            ><Mail className="w-5 h-5 mr-2" />
              Email Report to Client
            </button>
          </div>
        </form>
      </div>
    </div> </div>
  )
}