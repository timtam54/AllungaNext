'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import DataTable from 'react-data-table-component'
import { getToken } from '@/msal/msal'
import Header from '@/components/header'
import Sample from '@/components/Sample'
import SampleExplode from '@/components/SampleExplode'
import SampleHist from '@/components/SampleHist'
import ChartParamSample from '@/components/chartparamsample'
import { ArrowLeft, FileText, Brain, Send, Grid, ChevronUp, ChevronDown, BarChart2, Snowflake, History } from 'lucide-react'

interface SampleRow {
  SampleID: number
  Number: number
  description: string
  longdescription: string
  EquivalentSamples: number
  Reportable: boolean
  SampleOrder: number
  ExposureType: string
}

export default function Samples() {
  const searchParams = useSearchParams()
  const seriesname = searchParams!.get('seriesname')
  const SeriesID = parseInt(searchParams!.get('id')!)
  const [loading, setLoading] = useState(true)
  const [deleted, setDeleted] = useState(false)
  const [results, setDataSample] = useState<SampleRow[]>([])
  const [chartTitle, setChartTitle] = useState('Hello Chart')
  const [modelOpen, setModelOpen] = useState(false)
  const [modalOpenExplode, setModalOpenExplode] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalOpenHist, setModalOpenHist] = useState(false)
  const [sampID, setSampID] = useState(0)

  useEffect(() => {
    fetchSample()
  }, [])

  const fetchSample = async () => {
    setLoading(true)
    try {
      const token = await getToken()
      const response = await fetch(
        `https://allungawebapi.azurewebsites.net/api/Samples/${SeriesID}~${deleted ? 1 : 0}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      if (!response.ok) throw new Error(response.statusText)
      const json: SampleRow[] = await response.json()
      setDataSample(json.sort((a, b) => a.SampleOrder - b.SampleOrder))
    } catch (error) {
      console.error('Error fetching samples:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetch1Sample = async (SampleID: number, inc: number) => {
    try {
      const token = await getToken()
      const response = await fetch(`https://allungawebapi.azurewebsites.net/api/Samples/int/${SampleID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!response.ok) throw new Error(response.statusText)
      const json: SampleRow = await response.json()
      const newJson = { ...json, SampleOrder: json.SampleOrder + inc }

      const updateResponse = await fetch(`https://allungawebapi.azurewebsites.net/api/Samples/${SampleID}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newJson),
      })
      if (!updateResponse.ok) throw new Error(updateResponse.statusText)
      fetchSample()
    } catch (error) {
      console.error('Error updating sample order:', error)
    }
  }

  const columns = [
    {
      name: '+',
      selector: (row: SampleRow) => row.SampleID,
      sortable: true,
      width: '60px',
    },
    {
      name: 'AEL Ref',
      selector: (row: SampleRow) => row.Number,
      sortable: true,
      width: '100px',
      cell: (row: SampleRow) => (
        <button
          onClick={() => {
            setSampID(row.SampleID)
            setModalOpen(true)
          }}
          className="text-blue-600 hover:underline"
        >
          {row.Number}
        </button>
      ),
    },
    {
      name: 'Client id',
      selector: (row: SampleRow) => row.description,
      sortable: true,
      width: '90px',
      cell: (row: SampleRow) => (
        <button
          onClick={() => {
            setSampID(row.SampleID)
            setModalOpenHist(true)
          }}
          className="text-blue-600 hover:underline"
        >
          {row.description}
        </button>
      ),
    },
    {
      name: 'Description',
      selector: (row: SampleRow) => row.longdescription,
      sortable: true,
      width: '130px',
      cell: (row: SampleRow) => (
        <button
          onClick={() => {
            setSampID(row.SampleID)
            setChartTitle(`${row.description} vs date.`)
            setModelOpen(true)
          }}
          className="text-blue-600 hover:underline"
        >
          {row.longdescription}
        </button>
      ),
    },
    {
      name: 'Equiv Samples / Alltrack cms',
      selector: (row: SampleRow) => row.EquivalentSamples,
      sortable: true,
      width: '130px',
    },
    {
      name: 'Exposure Type',
      selector: (row: SampleRow) => row.ExposureType,
      sortable: true,
      width: '130px',
    },
    {
      name: 'Reportable',
      selector: (row: SampleRow) => row.Reportable,
      sortable: true,
      width: '80px',
      cell: (row: SampleRow) => (
        <input type="checkbox" checked={row.Reportable} readOnly className="form-checkbox h-5 w-5 text-blue-600" />
      ),
    },
    {
      name: '',
      cell: (row: SampleRow) => (
        <button onClick={() => fetch1Sample(row.SampleID, -1)} className="text-gray-600 hover:text-gray-900">
          <ChevronUp className="h-5 w-5" />
        </button>
      ),
      width: '30px',
    },
    {
      name: 'Order',
      selector: (row: SampleRow) => row.SampleOrder,
      sortable: true,
      width: '55px',
    },
    {
      name: '',
      cell: (row: SampleRow) => (
        <button onClick={() => fetch1Sample(row.SampleID, 1)} className="text-gray-600 hover:text-gray-900">
          <ChevronDown className="h-5 w-5" />
        </button>
      ),
      width: '30px',
    },
    {
      name: 'Explode',
      cell: () => (
        <button onClick={() => setModalOpenExplode(true)} className="text-blue-600 hover:text-blue-800">
          <Snowflake className="h-5 w-5" />
        </button>
      ),
      width: '130px',
    },
    {
      name: 'Charts',
      cell: (row: SampleRow) => (
        <button
          onClick={() => {
            setSampID(row.SampleID)
            setChartTitle(`${row.description} vs date`)
            setModelOpen(true)
          }}
          className="text-blue-600 hover:text-blue-800"
        >
          <BarChart2 className="h-5 w-5" />
        </button>
      ),
      width: '130px',
    },
    {
      name: 'History',
      cell: (row: SampleRow) => (
        <button
          onClick={() => {
            setSampID(row.SampleID)
            setModalOpenHist(true)
          }}
          className="text-blue-600 hover:text-blue-800"
        >
          <History className="h-5 w-5" />
        </button>
      ),
      width: '90px',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <Link href="/" className="flex items-center text-gray-600 hover:text-gray-800">
            <ArrowLeft className="mr-2" /> Back
          </Link>
          <h1 className="text-2xl font-bold"  style={{color:'#944780'}}>Series: {seriesname}</h1>
          <div className="flex space-x-2">
            {[
              { href: `/seriestab?id=${SeriesID}&seriesname=${seriesname}`, icon: FileText, text: 'Details' },
              { href: `/samples?id=${SeriesID}&seriesname=${seriesname}`, icon: Brain, text: 'Samples', active: true },
              { href: `/reports?id=${SeriesID}&seriesname=${seriesname}`, icon: FileText, text: 'Reports' },
              { href: `/dispatch?id=${SeriesID}&seriesname=${seriesname}`, icon: Send, text: 'Dispatch' },
              { href: `/reportparam?id=${SeriesID}&seriesname=${seriesname}`, icon: Grid, text: 'Params' },
            ].map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded ${
                  item.active
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="mr-2 h-4 w-4" />
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
            <DataTable
              columns={columns}
              data={results}
              pagination
              dense
              customStyles={{
                headRow: {
                  style: {
                    backgroundColor: '#F3F4F6',
                    fontSize: '0.875rem',
                    color: '#374151',
                    fontWeight: 'bold',
                  },
                },
                rows: {
                  style: {
                    '&:nth-of-type(odd)': {
                      backgroundColor: '#F9FAFB',
                    },
                  },
                },
              }}
              conditionalRowStyles={[
                {
                  when: (row) => !row.Reportable,
                  style: {
                    color: '#EF4444',
                  },
                },
              ]}
            />
          </div>
        )}
      </main>

      {modelOpen && (
        <ChartParamSample
          title={chartTitle}
          seriesid={SeriesID}
          sampleID={sampID}
          closeModal={() => setModelOpen(false)}
        />
      )}
      {modalOpen && (
        <Sample sampleid={sampID} closeModal={() => { setModalOpen(false); fetchSample() }} SeriesID={SeriesID} />
      )}
      {modalOpenHist && (
        <SampleHist sampleid={sampID} closeModal={() => setModalOpenHist(false)} SeriesID={SeriesID} />
      )}
      {modalOpenExplode && <SampleExplode closeModal={() => setModalOpenExplode(false)} />}
    </div>
  )
}