'use client'

import { useEffect, useState, ChangeEvent } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import DataTable from "react-data-table-component";
import { getToken } from "@/msal/msal";
import Header from '@/components/header';
import ClientSelect from '@/components/clientselect';
import { Search, Plus, X, ArrowUpDown } from 'lucide-react';
import { getDate } from "react-datepicker/dist/date_utils";

interface Series {
  exposureType: string
  rackNo: number
  siteName: string
  locked: boolean
  returnsReq: boolean
  dateIn: Date
  active: boolean
  shortDescription: string
  dateNextReturn: Date
  equivalentSamples: number
  cntSamplesOnSite: number
  clientreference: string
  allungaReference: string
  seriesid: number
  abbreviation: string
  companyname: string
  complete: boolean
  dateNextReport: Date
}

export default function Home() {
  const [actives, setActives] = useState(true)
  const [inactives, setInactives] = useState(false)
  const [fields, setFields] = useState("All")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Series[]>([])
  const [search, setSearch] = useState("")
  const [clientModel, setClientModel] = useState(false)
  const searchParams = useSearchParams()
  const [clientid, setClientID] = useState(parseInt(searchParams!.get("clientid") ?? '-1'))
  const [clientname, setClientName] = useState(searchParams!.get("clientname") ?? '')

  const fieldlist = ["All", "AllungaRef", "BookPage", "Client", "ClientRef", "Exposure"]

  useEffect(() => {
    ssearch(actives, inactives, fields, clientid,'A')
  }, [])

  const ssearch = async (act: boolean, del: boolean, flds: string, clid: number,sts:string) => {
    setLoading(true)
    try {
      const token = await getToken()
      const headers = new Headers()
      headers.append('Authorization', `Bearer ${token}`)
      const options = { method: 'GET', headers: headers }
      const endPoint = `https://allungawebapicore.azurewebsites.net/api/Series/${search || '~'}/${act ? 1 : 0}/${del ? 1 : 0}/${flds}/${clid}/${sts}`;
      const response = await fetch(endPoint, options)
      if (!response.ok) throw new Error(response.statusText)
      const json = await response.json()
      setResults(json)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }
  const [status, setStatus] = useState('A');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    ssearch(actives, inactives, fields, clientid,status);
  }

  const selectClient = (id: number, name: string) => {
    setClientName(name)
    setClientID(id)
    ssearch(actives, inactives, fields, id,status)
  }

  const formatDate = (date: Date | string | null) => {
    if (!date) return ""
    const d = new Date(date)
    return d.toISOString().split('T')[0]
  }

  const columns = [
    {
      name: 'Complete',
      selector: (row: Series) => row.complete,
      sortable: true,
      width: "60px",
      cell: (row: Series) => <input type="checkbox" checked={row.complete} readOnly className="accent-purple-600" />,
    },
    {
      name: 'Company Name',
      selector: (row: Series) => row.companyname,
      sortable: true,
      width: "130px",
    },
    {
      name: 'Allunga Series',
      selector: (row: Series) => row.allungaReference,
      sortable: true,
      width: "130px",
      cell: (row: Series) => (
        <Link href={{ pathname: "/seriestab", query: { id: row.seriesid, seriesname: row.allungaReference } }} className="text-blue-600 hover:underline">
          {row.allungaReference}
        </Link>
      ),
    },
    {
      name: 'Client Series',
      selector: (row: Series) => row.clientreference,
      sortable: true,
      width: "130px",
    },
    {
      name: 'Abbrev',
      selector: (row: Series) => row.abbreviation,
      sortable: true,
      width: "70px",
    },
    {
      name: '# Samples On Site',
      selector: (row: Series) => row.cntSamplesOnSite,
      sortable: true,
      width: "60px",
    },
    {
      name: 'Equiv Samples',
      selector: (row: Series) => row.equivalentSamples,
      sortable: true,
      width: "60px",
    },
    {
      name: 'Next Report',
      selector: (row: Series) => formatDate(row.dateNextReport),
      sortable: true,
      width: "100px",
    },
    {
      name: 'Next Return',
      selector: (row: Series) => formatDate(row.dateNextReturn),
      sortable: true,
      width: "100px",
    },
    {
      name: 'Short Descriptions',
      selector: (row: Series) => row.shortDescription,
      sortable: true,
      width: "250px",
    },
    {
      name: 'Date In',
      selector: (row: Series) => formatDate(row.dateIn),
      sortable: true,
      width: "100px",
    },
    {
      name: 'Active',
      selector: (row: Series) => row.active,
      sortable: true,
      width: "60px",
      cell: (row: Series) => <input type="checkbox" checked={row.active} readOnly className="accent-purple-600" />,
    },
    {
      name: 'Returns Req',
      selector: (row: Series) => row.returnsReq,
      sortable: true,
      width: "60px",
      cell: (row: Series) => <input type="checkbox" checked={row.returnsReq} readOnly className="accent-purple-600" />,
    },
    {
      name: 'Exposure',
      selector: (row: Series) => row.exposureType,
      sortable: true,
      width: "110px",
    },
    {
      name: 'Rack No',
      selector: (row: Series) => row.rackNo,
      sortable: true,
      width: "80px",
    },
    {
      name: 'Site Name',
      selector: (row: Series) => row.siteName,
      sortable: true,
      width: "120px",
    },
    {
      name: 'Locked',
      selector: (row: Series) => row.locked,
      sortable: true,
      width: "80px",
      cell: (row: Series) => <input type="checkbox" checked={row.locked} readOnly className="accent-purple-600" />,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-100">

      {clientModel && <ClientSelect selectClient={selectClient} closeModal={() => setClientModel(false)} />}

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <form onSubmit={handleSearch} className="p-4 space-y-4">
          <div style={{backgroundColor:'#944780'}} className="text-white p-4 flex flex-wrap items-center gap-4">
            <h1 className="text-2xl font-bold">Search Series</h1>
         
              <select
                className="p-2 border rounded text-black"
                name="Fields"
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setFields(e.target.value)}
                value={fields}
              >
                {fieldlist.map((ep) => (
                  <option key={ep} value={ep}>{ep}</option>
                ))}
              </select>

              <div className="flex-1 relative">
                <input
                  type="text" 
                  placeholder="Search Client/Series"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full p-2 pr-10 border rounded"
                />
                <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <Search className="text-gray-400" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setClientModel(true)}
                className="p-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition duration-200"
              >
                {clientname || "Client Filter"}
              </button>

              {clientname && (
                <button
                  type="button"
                  onClick={() => selectClient(-1, '')}
                  className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200"
                >
                  <X size={20} />
                </button>
              )}

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={actives}
                    onChange={(e) => {
                      setActives(e.target.checked)
                      ssearch(e.target.checked, inactives, fields, clientid,status)
                    }}
                    className="form-checkbox text-purple-600"
                  />
                  <span>Active</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={inactives}
                    onChange={(e) => {
                      setInactives(e.target.checked)
                      ssearch(actives, e.target.checked, fields, clientid,status)
                    }}
                    className="form-checkbox text-purple-600"
                  />
                  <span>Inactive</span>
                </label>
              </div>

              <Link
                href="/addseries"
                className="p-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200 flex items-center"
              >
                <Plus size={20} className="mr-2" /> Add New Series
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-sm">

              <button onClick={(e) => {e.preventDefault();ssearch(actives, inactives, fields, clientid,'O');setStatus('O');}} type="button" className="bg-red-200 text-red-800 p-2 rounded hover:bg-red-300 active:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-500">Rtn / Rpt overdue</button>
              <button onClick={(e) => {e.preventDefault();ssearch(actives, inactives, fields, clientid,'L');setStatus('L');}} type="button" className="bg-yellow-200 text-yellow-800 p-2 rounded hover:bg-yellow-300 active:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500">Locked</button>
              <button onClick={(e) => {e.preventDefault();ssearch(actives, inactives, fields, clientid,'C');setStatus('C');}} type="button" className="bg-green-200 text-green-800 p-2 rounded  hover:bg-green-300 active:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-500">Rtn / Rpt Complete</button>
              <button onClick={(e) => {e.preventDefault();ssearch(actives, inactives, fields, clientid,'0');setStatus('0');}} type="button"  className="bg-gray-200 text-gray-800 p-2 rounded hover:bg-gray-300 active:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500">All Samples off site</button>       
              <button onClick={(e) => {e.preventDefault();ssearch(false, true, fields, clientid,'A');setInactives(true);setActives(false);setStatus('A');}} type="button" className="bg-black text-white p-2 rounded hover:bg-gray-700 active:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500">Inactive</button>
              <button onClick={(e) => {e.preventDefault();ssearch(actives, inactives, fields, clientid,'A');setStatus('A');}} type="button" className="bg-white-200 text-silver-800 p-2 rounded hover:bg-gray-300 active:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500">All</button>
            </div>
          </form>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={results}
              pagination
              dense
              customStyles={{
                headRow: {
                  style: {
                    backgroundColor: '#944780',
                    color: 'white',
                  },
                },
                headCells: {
                  style: {
                    fontSize: '14px',
                    fontWeight: 'bold',
                    padding: '8px',
                  },
                },
                cells: {
                  style: {
                    padding: '8px',
                  },
                },
              }}
              conditionalRowStyles={[
                {
                  when: (row) => row.locked!=null,
                  style: {
                    backgroundColor: '#F9A825',
                    color: '#FFF59D',
                  },
                  
                }, {
                  when: (row) => row.complete,
                  style: {
                    backgroundColor: 'rgba(0, 255, 0, 0.1)',
                    color: 'green',
                  },
                  
                },
                {
                  when: (row) => !row.active,
                  style: {
                    backgroundColor: 'black',
                    color: 'silver',
                  },
                  
                }
                ,
                {
                  when: (row) => row.cntSamplesOnSite==0,
                  style: {
                    backgroundColor: '#EEEEEE',
                    color: '#424242',
                  },
                  
                },
                {
                  when: (row) => (row.dateNextReport<new Date()),//(row.dateNextReport!=null &&  || ((row.dateNextReturn!=null && row.dateNextReturn)<new Date())),
                  style: {
                    backgroundColor: '#EF9A9A',
                    color: '#C62828',
                  },
                  
                },
                {
                  when: (row) => (row.dateNextReturn<new Date()),//(row.dateNextReport!=null &&  || ((row.dateNextReturn!=null && row.dateNextReturn)<new Date())),
                  style: {
                    backgroundColor: '#EF9A9A',
                    color: '#C62828',
                  },
                  
                },
              ]}
            />
          )}
        </div>
      </main>
    </div>
  )
}