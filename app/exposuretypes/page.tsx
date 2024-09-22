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
        borderRadius: '0.75rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
    headRow: {
      style: {
        backgroundColor: '#f9fafb',
        borderTopLeftRadius: '0.75rem',
        borderTopRightRadius: '0.75rem',
        borderBottom: '2px solid #e5e7eb',
      },
    },
    headCells: {
      style: {
        fontSize: '0.875rem',
        fontWeight: '600',
        color: '#374151',
        padding: '1.25rem 1rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      },
    },
    cells: {
      style: {
        fontSize: '0.875rem',
        color: '#4b5563',
        padding: '1.25rem 1rem',
        borderBottom: '1px solid #e5e7eb',
      },
    },
  }

  const conditionalRowStyles = [
    {
      when: (row: ExposureTypeRow) => row.ExposureTypeID === 0,
      style: {
        color: '#ef4444',
        fontWeight: '600',
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
          className="text-blue-600 hover:text-blue-800 hover:underline focus:outline-none transition duration-150 ease-in-out"
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Exposure Types</h1>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Circles
              height="80"
              width="80"
              color="#3b82f6"
              ariaLabel="loading-indicator"
            />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl">
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
                <div className="p-8 text-center text-gray-500">No exposure types found</div>
              }
            />
          </div>
        )}
      </div>
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