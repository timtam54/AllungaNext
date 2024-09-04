"use client"

import { useEffect, useState } from "react"
import { Circles } from 'react-loader-spinner'
import DataTable from "react-data-table-component"
import Header from "@/components/header"
import Param from "@/components/Param"
import { getToken } from "@/msal/msal"

interface ExposureTypeRow {
  ParamID: number
  ParamName: string
  ValueRange: string
  EquivalentValues: string
  Ordering: number
  Unit: string
  VisualNoReadings: string
}

export default function Parameters() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<ExposureTypeRow[]>([])
  const [paramID, setParamID] = useState(0)
  const [modelOpen, setModelOpen] = useState(false)

  useEffect(() => {
    getExpType()
  }, [])

  const getExpType = async () => {
    setLoading(true)
    try {
      const token = await getToken()
      const response = await fetch('https://allungawebapi.azurewebsites.net/api/Params/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      const json = await response.json()
      setResults(json)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const customStyles = {
    table: {
      style: {
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
    headRow: {
      style: {
        backgroundColor: '#f3f4f6',
        borderTopLeftRadius: '0.5rem',
        borderTopRightRadius: '0.5rem',
      },
    },
    headCells: {
      style: {
        fontSize: '0.875rem',
        fontWeight: '600',
        color: '#374151',
        padding: '1rem',
      },
    },
    cells: {
      style: {
        fontSize: '0.875rem',
        color: '#4b5563',
        padding: '1rem',
      },
    },
  }

  const columns = [
    {
      name: 'ID',
      selector: (row: ExposureTypeRow) => row.ParamID,
      sortable: true,
      width: '60px',
    },
    {
      name: 'Name',
      selector: (row: ExposureTypeRow) => row.ParamName,
      sortable: true,
      cell: (row: ExposureTypeRow) => (
        <button
          onClick={() => {
            setParamID(row.ParamID)
            setModelOpen(true)
          }}
          className="text-blue-600 hover:text-blue-800 underline focus:outline-none"
        >
          {row.ParamName}
        </button>
      ),
    },
    {
      name: 'Unit',
      selector: (row: ExposureTypeRow) => row.Unit,
      sortable: true,
    },
    {
      name: 'Value Range',
      selector: (row: ExposureTypeRow) => row.ValueRange,
      sortable: true,
    },
    {
      name: 'Equivalent Values',
      selector: (row: ExposureTypeRow) => row.EquivalentValues,
      sortable: true,
    },
    {
      name: 'Ordering',
      selector: (row: ExposureTypeRow) => row.Ordering,
      sortable: true,
    },
    {
      name: 'Visual No Readings',
      selector: (row: ExposureTypeRow) => row.VisualNoReadings,
      sortable: true,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Parameters</h1>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Circles
              height="80"
              width="80"
              color="#944780"
              ariaLabel="circles-loading"
              visible={true}
            />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <DataTable
              columns={columns}
              data={results}
              pagination
              paginationPerPage={10}
              paginationRowsPerPageOptions={[10, 20, 30, 40, 50]}
              fixedHeader
              fixedHeaderScrollHeight="calc(100vh - 200px)"
              customStyles={customStyles}
              noDataComponent={
                <div className="p-4 text-center text-gray-500">No data available</div>
              }
            />
          </div>
        )}
      </main>
      {modelOpen && (
        <Param ParamID={paramID} closeModal={() => setModelOpen(false)} />
      )}
    </div>
  )
}