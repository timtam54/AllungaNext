'use client'

import { useEffect, useState, ChangeEvent } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { getToken } from '@/msal/msal'
import Header from '@/components/header'
import Report from '@/components/report'
import ChartSampleParam from '@/components/chartsampleparam'
import { ArrowLeft, FileText, Brain, Send, Grid, BarChart2 } from 'lucide-react'
import {  Plus, FileSpreadsheet, Camera } from 'lucide-react'//Grain, 
import { Button } from '@mui/material'
interface ReportRow {
  reportname: string
  date: Date
  reportid: number
}

interface Param {
  ParamID: number
  ParamName: string
  Ordering: number
}

interface ParRepSeriesRow {
  paramid: number
  reportid: number
  deleted: boolean
}

export default function ReportParams() {
  const searchParams = useSearchParams()
  const id = parseInt(searchParams!.get('id')!)
  const seriesname = searchParams!.get('seriesname')
  const [loading, setLoading] = useState(true)
  const [dataParams, setDataParams] = useState<Param[]>([])
  const [dataParRepSeries, setDataParRepSeries] = useState<ParRepSeriesRow[]>([])
  const [dataReport, setDataReport] = useState<ReportRow[]>([])
  const [chartTitle, setChartTitle] = useState('Hello Chart')
  const [paramID, setParamID] = useState(0)
  const [modelOpen, setModelOpen] = useState(false)
  const [modelReportOpen, setModelReportOpen] = useState(false)
  const [reportID, setReportID] = useState(0)

  useEffect(() => {
    getAllData()
  }, [])

  const getAllData = async () => {
    setLoading(true)
    try {
      await Promise.all([fetchParRepSeries(), fetchParams(), fetchReport()])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchParams = async () => {
    const token = await getToken()
    const response = await fetch('https://allungawebapi.azurewebsites.net/api/Params/', {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok) throw new Error(response.statusText)
    const json = await response.json()
    setDataParams(json)
  }

  const fetchParRepSeries = async () => {
    const token = await getToken()
    const response = await fetch(`https://allungawebapicore.azurewebsites.net/api/ReportParams/id?SeriesID=${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok) throw new Error(response.statusText)
    const json = await response.json()
    setDataParRepSeries(json)
  }

  const fetchReport = async () => {
    const token = await getToken()
    const response = await fetch(`https://allungawebapi.azurewebsites.net/api/Reports/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok) throw new Error(response.statusText)
    const json = await response.json()
    setDataReport(json)
  }

  const handleSubmitParam = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = await getToken()
      const response = await fetch(`https://allungawebapicore.azurewebsites.net/api/ReportParams/{id}?SeriesID=${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataParRepSeries),
      })
      if (!response.ok) throw new Error(response.statusText)
      alert('Saved successfully')
    } catch (error) {
      console.error('Error saving data:', error)
      alert('Error saving data')
    }
  }

  const handleChangeRepPar = (e: ChangeEvent<HTMLInputElement>) => {
    const [reportId, paramId] = e.target.name.split('~').map(Number)
    setDataParRepSeries(prev => {
      const filtered = prev.filter(i => !(i.paramid === paramId && i.reportid === reportId))
      return [...filtered, { paramid: paramId, reportid: reportId, deleted: !e.target.checked }]
    })
  }

  const getRepPar = (reportid: number, ParamID: number) => {
    return !dataParRepSeries.find(i => i.paramid === ParamID && i.reportid === reportid)?.deleted
  }
const [reportname, setReportName] = useState('')
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      {modelReportOpen && <Report reportname={reportname} reportid={reportID} closeModal={() => setModelReportOpen(false)} />}
      {modelOpen && (
        <ChartSampleParam
          title={chartTitle}
          seriesid={id}
          paramID={paramID}
          closeModal={() => setModelOpen(false)}
        />
      )}

<div className="mb-6 pt-4 flex justify-between items-center">
          <Link href="/" className="bg-black text-white px-4 py-2 rounded-md flex items-center hover:bg-gray-800">
            <ArrowLeft className="mr-2" size={20} />
            Back
          </Link>
          <h1 className="text-2xl font-bold"  style={{color:'#944780'}}>Series: {seriesname}</h1>
          <div className="flex justify-center space-x-4 ">
          {[
            { href: `/seriestab?id=${id}&seriesname=${seriesname}`, icon: FileText, text: 'Details' },
            { href: `/samples?id=${id}&seriesname=${seriesname}`, icon: Send, text: 'Samples' },//Grain, 
            { href: `/reports?id=${id}&seriesname=${seriesname}`, icon: FileSpreadsheet, text: 'Reports' },
            { href: `/dispatch?id=${id}&seriesname=${seriesname}`, icon: Send, text: 'Dispatch' },
            { href: `/reportparam?id=${id}&seriesname=${seriesname}`, icon: Grid, text: 'Params', active: true },
          ].map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`flex items-center px-4 py-2 rounded-md ${
                item.active
                  ? 'bg-[#944780] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="mr-2" size={20} />
              {item.text}
            </Link>
          ))}
          </div>
         
        

    
        </div>


        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Parameters</h2>
                <button
                  onClick={handleSubmitParam}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Submit
                </button>
              </div>

              <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Parameters
                      </th>
                      {dataReport.map((result) => (
                        <th key={result.reportid} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <Button variant="outlined" color="primary"
                            onClick={() => {
                              setReportID(result.reportid);
                              setReportName(result.reportname);
                              setModelReportOpen(true)
                            }}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            {result.reportname} ({new Date(result.date).toLocaleDateString()})
                          </Button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dataParams.map((param) => (
                      <tr key={param.ParamID}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => {
                              setParamID(param.ParamID)
                              setChartTitle(`${param.ParamName} vs date`)
                              setModelOpen(true)
                            }}
                            className="text-indigo-600 hover:text-indigo-900 flex items-center"
                          >
                            <BarChart2 className="mr-2 h-4 w-4" />
                            {param.ParamName}
                          </button>
                        </td>
                        {dataReport.map((report) => (
                          <td key={report.reportid} className="px-6 py-4 whitespace-nowrap text-center">
                            <input
                              type="checkbox"
                              name={`${report.reportid}~${param.ParamID}`}
                              onChange={handleChangeRepPar}
                              checked={getRepPar(report.reportid, param.ParamID)}
                              className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      
    </div>
  )
}