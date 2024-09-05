"use client"

import React, { useState, useEffect } from "react"
import DataTable from "react-data-table-component"
import { Circles } from 'react-loader-spinner'
import { getToken } from "@/msal/msal"
import { ExportAsExcel } from "react-export-table"
import { Download } from 'lucide-react'
import Header from "@/components/header"

interface RackRptRow {
  SeriesID: number
  RackNo: string
  Samples: string
  ClientReference: string
  AllungaReference: string
  ClientName: string
  ClientID: number
}

type Props = {
  closeModal: () => void
}

export default function RptRack() {
  const [loading, setLoading] = useState(true)
  const [data, setDataSample] = useState<RackRptRow[]>([])

  useEffect(() => {
    fetchRack()
  }, [])

  const fetchRack = async () => {
    try {
      const endPoint = `https://allungawebapi.azurewebsites.net/api/Rprts/Rack/`
      const token = await getToken()
      const response = await fetch(endPoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(response.statusText)
      }

      const json = await response.json()
      setDataSample(json)
    } catch (error) {
      console.error('Error fetching rack data:', error)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      name: 'Series ID',
      selector: (row: RackRptRow) => row.SeriesID,
      sortable: true,
      width: "100px",
    },
    {
      name: 'Rack No',
      selector: (row: RackRptRow) => row.RackNo,
      sortable: true,
      width: "120px",
      cell: (row: RackRptRow) => (
        <button className="text-blue-600 hover:text-blue-800 underline">
          {row.RackNo}
        </button>
      ),
    },
    {
      name: 'Samples',
      selector: (row: RackRptRow) => row.Samples,
      sortable: true,
      width: "160px",
    },
    {
      name: 'Client Reference',
      selector: (row: RackRptRow) => row.ClientReference,
      sortable: true,
      width: "180px",
    },
    {
      name: 'Allunga Reference',
      selector: (row: RackRptRow) => row.AllungaReference,
      sortable: true,
      width: "180px",
    },
    {
      name: 'Client Name',
      selector: (row: RackRptRow) => row.ClientName,
      sortable: true,
      width: "200px",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Rack Report</h1>
        <div className="mb-4">
                <ExportAsExcel
                  data={data}
                  headers={["SeriesID", "RackNo", "Samples", "ClientReference", "AllungaReference", "ClientName", "ClientID"]}
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
        </div>      
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
            <>
             

              <DataTable
                columns={columns}
                data={data}
                pagination
                paginationPerPage={10}
                paginationRowsPerPageOptions={[10, 20, 30, 40, 50]}
                fixedHeader
                fixedHeaderScrollHeight="calc(100vh - 300px)"
                highlightOnHover
                customStyles={{
                  headRow: {
                    style: {
                      backgroundColor: '#f3f4f6',
                      fontWeight: 'bold',
                    },
                  },
                  rows: {
                    style: {
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                    },
                  },
                }}
                conditionalRowStyles={[
                  {
                    when: row => row.SeriesID === 0,
                    style: { color: 'navy' },
                  },
                  {
                    when: row => row.SeriesID !== 0,
                    style: { color: 'red' },
                  },
                ]}
              />
            </>
            </div>
        )}
      </main>
     
    </div>
  )
}