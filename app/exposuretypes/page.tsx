"use client"

import { useEffect, useState } from "react"
import Header from "@/components/header"
import { getToken } from "@/msal/msal"
import DataTable from "react-data-table-component"
import ExposureType from '@/components/ExposureType'
import { Circles } from 'react-loader-spinner'

interface ExposureTypeRow {
  ExposureTypeID: number
  Description: string
  SortOrder: number
}

export default function ExposureTypes() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<ExposureTypeRow[]>([])
  const [etid, setEtid] = useState(0)
  const [modelOpen, setModelOpen] = useState(false)

  useEffect(() => {
    getExpType()
  }, [])

  const getExpType = async () => {
    setLoading(true)
    try {
      const token = await getToken()
      const response = await fetch('https://allungawebapi.azurewebsites.net/api/ExposureTypes/', {
        method: 'GET',
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
      console.error('Error fetching exposure types:', error)
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

  const conditionalRowStyles = [
    {
      when: (row: ExposureTypeRow) => row.ExposureTypeID === 0,
      style: {
        color: 'red',
      },
    },
  ]

  const columns = [
    {
      name: 'ID',
      selector: (row: ExposureTypeRow) => row.ExposureTypeID,
      sortable: true,
      width: "80px",
    },
    {
      name: 'Description',
      selector: (row: ExposureTypeRow) => row.Description,
      sortable: true,
      cell: (row: ExposureTypeRow) => (
        <button
          onClick={() => {
            setEtid(row.ExposureTypeID)
            setModelOpen(true)
          }}
          className="text-blue-600 hover:text-blue-800 underline focus:outline-none"
        >
          {row.Description}
        </button>
      ),
    },
    {
      name: 'Order',
      selector: (row: ExposureTypeRow) => row.SortOrder,
      sortable: true,
      width: "100px",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Exposure Types</h1>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Circles
              height="80"
              width="80"
              color="#4b5563"
              ariaLabel="loading-indicator"
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
              fixedHeaderScrollHeight="calc(100vh - 300px)"
              customStyles={customStyles}
              conditionalRowStyles={conditionalRowStyles}
              noDataComponent={
                <div className="p-4 text-center text-gray-500">No exposure types found</div>
              }
            />
          </div>
        )}
      </main>
      {modelOpen && (
        <ExposureType
          exposuretypeid={etid}
          closeModal={() => {
            setModelOpen(false)
            getExpType()
          }}
        />
      )}
    </div>
  )
}