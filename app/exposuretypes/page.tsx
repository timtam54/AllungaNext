"use client"

import { useEffect, useState } from "react"
import Header from "@/components/header"
import { getToken } from "@/msal/msal"
import ExposureType from '@/components/ExposureType'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/20/solid'

interface ExposureTypeRow {
  exposuretypeid: number
  name: string
  description: string
  sortorder: number
}

export default function ExposureTypes() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<ExposureTypeRow[]>([])
  const [etid, setEtid] = useState(0)
  const [modelOpen, setModelOpen] = useState(false)
  const [sortColumn, setSortColumn] = useState<keyof ExposureTypeRow>('sortorder')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  useEffect(() => {
    getExpType()
  }, [])

  const getExpType = async () => {
    setLoading(true)
    try {
      const token = await getToken()
      const response = await fetch(process.env.NEXT_PUBLIC_API+'exposuretype', {
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

  const handleSort = (column: keyof ExposureTypeRow) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const sortedResults = [...results].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1
    if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = sortedResults.slice(indexOfFirstItem, indexOfLastItem)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Exposure Types</h1>
          
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('exposuretypeid')}
                    >
                      ID
                      {sortColumn === 'exposuretypeid' && (
                        sortDirection === 'asc' ? <ChevronUpIcon className="inline w-4 h-4 ml-1" /> : <ChevronDownIcon className="inline w-4 h-4 ml-1" />
                      )}
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('name')}
                    >
                      Name
                      {sortColumn === 'name' && (
                        sortDirection === 'asc' ? <ChevronUpIcon className="inline w-4 h-4 ml-1" /> : <ChevronDownIcon className="inline w-4 h-4 ml-1" />
                      )}
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('description')}
                    >
                      Description
                      {sortColumn === 'description' && (
                        sortDirection === 'asc' ? <ChevronUpIcon className="inline w-4 h-4 ml-1" /> : <ChevronDownIcon className="inline w-4 h-4 ml-1" />
                      )}
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('sortorder')}
                    >
                      Order
                      {sortColumn === 'sortorder' && (
                        sortDirection === 'asc' ? <ChevronUpIcon className="inline w-4 h-4 ml-1" /> : <ChevronDownIcon className="inline w-4 h-4 ml-1" />
                      )}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((row) => (
                    <tr key={row.exposuretypeid} className={row.exposuretypeid === 0 ? "text-red-600" : ""}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.exposuretypeid}</td>
                   
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button
                          onClick={() => {
                            setEtid(row.exposuretypeid)
                            setModelOpen(true)
                          }}
                          className="text-blue-600 hover:text-blue-800 underline focus:outline-none transition duration-150 ease-in-out"
                        >
                          {row.name}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.sortorder}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {results.length === 0 && (
              <div className="p-8 text-center text-gray-500">No exposure types found</div>
            )}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={indexOfLastItem >= results.length}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to <span className="font-medium">{Math.min(indexOfLastItem, results.length)}</span> of{' '}
                    <span className="font-medium">{results.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronUpIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    {Array.from({ length: Math.ceil(results.length / itemsPerPage) }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === index + 1
                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={indexOfLastItem >= results.length}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
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