'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/header'
import ReportDet from '@/components/reportdet'
import Report from '@/components/report'
import ReportPhotos from '@/components/reportphotos'
import { getToken } from '@/msal/msal'
import DataTable from 'react-data-table-component'
import { ArrowLeft, Plus, FileText, FileSpreadsheet, Send, Grid, Camera, Download } from 'lucide-react'//Grain, 
import { Button } from '@mui/material'
import { ExportAsExcel } from 'react-export-table'

interface ReportRow {
  reportid: number
  reportname: string
  date: Date
  bookandpage: string
  reportstatus: string
  return_elsereport: boolean
  deleted: boolean
  comment: string
  completeddate: Date
  daysinlab: number
}

export default function Reports() {
  const searchParams = useSearchParams()
  const seriesname = searchParams!.get('seriesname')
  const SeriesID = parseInt(searchParams!.get('id')!)
  const [loading, setLoading] = useState(true)
  const [results, setDataReport] = useState<ReportRow[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [reportID, setReportID] = useState(0)
  const [currentReport, setCurrentReport] = useState<ReportRow>()
  const [modelOpen, setModelOpen] = useState(false)
  const [photoModelOpen, setPhotoModelOpen] = useState(false)

  useEffect(() => {
    fetchReport()
  }, [])

  const fetchReport = async () => {
    setLoading(true)
    try {
      const token = await getToken()
      const response = await fetch(`https://allungaapi.azurewebsites.net/api/Report/all/${SeriesID}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) throw new Error(response.statusText)
      const json = await response.json()
      setDataReport(json);
      console.table(json);
    } catch (error) {
      console.error('Failed to fetch reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: string | Date) => {
    if (!date) return ''
    const d = new Date(date)
    return d.toISOString().split('T')[0]
  }

  const columns = [
    /*{
      name: 'ID',
      selector: (row: ReportRow) => row.reportid,
      sortable: true,
      width: '60px',
    },*/
    {
      name:  <>Description<Button variant='contained' style={{backgroundColor:'black',color:'white'}} onClick={()=>{alert('as')}}><Plus className="mr-2" size={20} />Add</Button></>,
      cell: (row: ReportRow) => (
        <a href={"/reportall?seriesid="+SeriesID.toString()+"&id="+row.reportid.toString()}
          target="other">
          <u>{row.reportname}</u>
        </a>
      ),
      selector: (row: ReportRow) => row.reportname,
      sortable: true,
      width: '270px',
    },
    {
      name: 'Date',
      cell: (row: ReportRow) => <Button variant='outlined'
      onClick={(e) => {
        e.preventDefault();
        setCurrentReport(row);
        console.table(row);
        setModalOpen(true);
      }}
      className="hover:underline"
      style={{ color: '#944780',borderColor: '#944780' }}
    >
       {formatDate(row.date)}
    </Button>,
      sortable: true,
      width: '130px',
    },
    {
      name: 'Status',
      selector: (row: ReportRow) => row.reportstatus,
      sortable: true,
      width: '80px',
    },
    {
      name: 'Book & Page',
      selector: (row: ReportRow) => row.bookandpage,
      sortable: true,
      width: '100px',
    },
    {
      name: 'Days In Lab',
      selector: (row: ReportRow) => row.DaysInLab,
      sortable: true,
      width: '80px',
    },
    {
      name: 'Comments',
      selector: (row: ReportRow) => row.comment,
      sortable: true,
      width: '360px',
      wrap: true,
    },
    {
      name: 'Param Readings',
      cell: (row: ReportRow) => (
        <button
          onClick={() => {
            setReportID(row.reportid);
            setReportName(row.reportname);
            setModelOpen(true)
          }}
          className="flex items-center text-blue-600 hover:underline"
        >
          <FileSpreadsheet className="mr-1" size={16} />
          Excel
        </button>
      ),
      width: '115px',
    },
    {
      name: 'Photos',
      cell: (row: ReportRow) => (
        <button
          onClick={() => {
            setReportID(row.reportid)
            setPhotoModelOpen(true)
          }}
          className="flex items-center text-blue-600 hover:underline"
        >
          <Camera className="mr-1" size={16} />
          Photos
        </button>
      ),
      width: '130px',
    },
  ]

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: '#944780',
        color: 'white',
        fontWeight: 'bold',
      },
    },
    headCells: {
      style: {
        padding: '8px',
        fontSize: '14px',
      },
    },
    cells: {
      style: {
        padding: '8px',
      },
    },
  }

  const conditionalRowStyles = [
    {
      when: (row: ReportRow) => row.reportstatus === 'N',
      style: { color: 'orange' },
    },
    {
      when: (row: ReportRow) => row.reportstatus === 'A',
      style: { color: 'green' },
    },
    {
      when: (row: ReportRow) => row.reportstatus !== 'N' && row.reportstatus !== 'A',
      style: { color: 'navy' },
    },
  ]
  const [reportname, setReportName] = useState('')
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      {photoModelOpen && <ReportPhotos reportid={reportID} closeModal={() => setPhotoModelOpen(false)} />}
      {modelOpen && <Report reportname={reportname} reportid={reportID} closeModal={() => {setModelOpen(false);fetchReport();}} />}
      {modalOpen && currentReport && <ReportDet report={currentReport} closeModal={() => {setModalOpen(false);fetchReport();}} />}

      <div className="mb-6 pt-4 flex justify-between items-center">
  
          <Link href="/" className="bg-black text-white px-4 py-2 rounded-md flex items-center hover:bg-gray-800">
            <ArrowLeft className="mr-2 " size={20} />
            Back
          </Link>
          <div className="px-4 py-2 rounded-md ">
                <ExportAsExcel
                  data={results}
                  headers={['id','reportname', 'date', 'reportstatus', 'bookandpage', 'DaysInLab', 'comment']}
                >
                  {(props) => (
                    <button
                      {...props}
                      className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Export as Excel
                    </button>
                  )}
                </ExportAsExcel>
             
        </div>     
          <h1 className="text-2xl font-bold"  style={{color:'#944780'}}>{seriesname}</h1>
          <div className="flex justify-center space-x-4 ">
          {[
            { href: `/seriestab?id=${SeriesID}&seriesname=${seriesname}`, icon: FileText, text: 'Details' },
            { href: `/samples?id=${SeriesID}&seriesname=${seriesname}`, icon: Send, text: 'Samples' },//Grain, 
            { href: `/reports?id=${SeriesID}&seriesname=${seriesname}`, icon: FileSpreadsheet, text: 'Reports', active: true },
            { href: `/dispatch?id=${SeriesID}&seriesname=${seriesname}`, icon: Send, text: 'Dispatch' },
            { href: `/reportparam?id=${SeriesID}&seriesname=${seriesname}`, icon: Grid, text: 'Params' },
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
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#944780]"></div>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <DataTable
              columns={columns}
              data={results}
              pagination
              customStyles={customStyles}
              conditionalRowStyles={conditionalRowStyles}
            />
          </div>
        )}
    
    </div>
  )
}