"use client"

import { useEffect, useState, ChangeEvent } from "react"
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api'
import DataTable from "react-data-table-component"
import { ExportAsExcel } from "react-export-table"
import Header from "@/components/header"
import Client from '@/components/Client'
import { getToken } from "@/msal/msal"
import { Download, Grid, Map } from "lucide-react"

interface ClientRow {
  clientid: number
  companyname: string
  groupname: string
  contactname: string
  address: string
  description: string
  abbreviation: string
  technicalphone: string
  technicalemail: string
  accountingcontact: string
  accountingemail: string
  lat: number
  lon: number
  seriescnt: number
}

interface LatLon {
  lat: number
  lng: number
  title: string
  seriescnt: number
  address: string
  id: number
}

export default function ClientSearch() {
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState<ClientRow[]>([])
  const [modelOpen, setModelOpen] = useState(false)
  const [cliid, setCliID] = useState(0)
  const [grid, setGrid] = useState(true)
  const [center, setCenter] = useState<LatLon>()
  const [locations, setLocations] = useState<LatLon[]>([])
  const [activeMarker, setActiveMarker] = useState('')

  useEffect(() => {
    searchClient(search)
  }, [])

  const handleSearch = async (event: ChangeEvent<HTMLInputElement>) => {
    const newSearch = event.target.value.toLowerCase()
    setSearch(newSearch)
    await searchClient(newSearch)
  }

  const searchClient = async (sch: string) => {
    setLoading(true)
    try {
      const token = await getToken()
      const response = await fetch(`https://allungawebapicore.azurewebsites.net/api/Clients/${sch === '' ? '~' : sch}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      const json: ClientRow[] = await response.json()
      setResults(json)
      await SetLocsLatLon(json)
    } catch (error) {
      console.error('Error fetching clients:', error)
    } finally {
      setLoading(false)
    }
  }

  const SetLocsLatLon = async (clients: ClientRow[]) => {
    const uniqueLocations: LatLon[] = []
    let sumLat = 0
    let sumLon = 0
    let count = 0

    clients.forEach((client) => {
      const location: LatLon = {
        id: client.clientid,
        address: client.address,
        seriescnt: client.seriescnt,
        lat: client.lat,
        lng: client.lon,
        title: client.companyname
      }

      if (!uniqueLocations.some(l => l.title === client.companyname)) {
        uniqueLocations.push(location)
        if (location.lat != null && location.lng != null) {
          sumLat += location.lat
          sumLon += location.lng
          count++
        }
      }
    })

    setLocations(uniqueLocations)
    if (count > 0) {
      setCenter({
        id: -1,
        address: '',
        seriescnt: 0,
        lat: sumLat / count,
        lng: sumLon / count,
        title: 'center'
      })
    }
  }

  const columns = [
    {
      name: 'Name',
      selector: (row: ClientRow) => row.companyname,
      sortable: true,
      cell: (row: ClientRow) => (
        <a href={`/client?id=${row.clientid}`} target="new" className="text-blue-600 hover:text-blue-800 underline">
          {row.companyname}
        </a>
      ),
    },
    {
      name: 'Code',
      selector: (row: ClientRow) => row.abbreviation,
      sortable: true,
    },
    {
      name: 'Address',
      selector: (row: ClientRow) => row.address,
      sortable: true,
    },
    {
      name: 'Contact Name',
      selector: (row: ClientRow) => row.contactname,
      sortable: true,
    },
    {
      name: 'Phone (Tech)',
      selector: (row: ClientRow) => row.technicalphone,
      sortable: true,
    },
    {
      name: 'Description',
      selector: (row: ClientRow) => row.description,
      sortable: true,
    },
    {
      name: 'Email (Tech)',
      selector: (row: ClientRow) => row.technicalemail,
      sortable: true,
    },
    {
      name: 'Email (Accounting)',
      selector: (row: ClientRow) => row.accountingemail,
      sortable: true,
    },
    {
      name: 'Accounting Contact',
      selector: (row: ClientRow) => row.accountingcontact,
      sortable: true,
    },
    {
      name: 'Series Count',
      selector: (row: ClientRow) => row.seriescnt,
      sortable: true,
    },
    {
      name: 'Group Name',
      selector: (row: ClientRow) => row.groupname,
      sortable: true,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      {modelOpen && <Client clientid={cliid} closeModal={() => setModelOpen(false)} />}
      
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          
          <div className="flex flex-wrap items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Clients</h1>
            <input
              type="text"
              onChange={handleSearch}
              value={search}
              placeholder="Search clients..."
              className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => setGrid(true)}
              className={`px-4 py-2 rounded-md ${grid ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              <Grid className="w-5 h-5 inline-block mr-2" />
              Grid
            </button>
            <button
              onClick={() => setGrid(false)}
              className={`px-4 py-2 rounded-md ${!grid ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}><Map className="w-5 h-5 inline-block mr-2" />
              Map
            </button>
            <ExportAsExcel
              data={results}
              headers={["companyname", "abbreviation", "address", "contactname", "technicalphone", "description", "technicalemail", "accountingemail", "accountingcontact", "seriescnt", "groupname"]}
            >
              {(props) => (
                <button
                  {...props}
                  className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Export as Excel
                </button>
              )}
            </ExportAsExcel>
          </div>

          {grid ? (
            <DataTable
              columns={columns}
              data={results}
              pagination
              paginationPerPage={10}
              paginationRowsPerPageOptions={[10, 20, 30, 40, 50]}
              fixedHeader
              fixedHeaderScrollHeight="calc(100vh - 400px)"
              highlightOnHover
              responsive
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
            />
          ) : (
            <div className="h-[600px] w-full">
              <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API!}>
                <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '100%' }}
                  center={center}
                  zoom={5}
                >
                  {locations.map((location, index) => (
                    <Marker
                      key={index}
                      position={location}
                      title={location.title}
                      onClick={() => window.open(`/client?id=${location.id}`)}
                      onMouseOver={() => setActiveMarker(location.title)}
                      onMouseOut={() => setActiveMarker('')}
                    >
                      {activeMarker === location.title && (
                        <InfoWindow onCloseClick={() => setActiveMarker('')}>
                          <div>
                            <p className="text-green-600">{location.address}</p>
                            <p className="text-red-600">
                              <a href={`/?clientid=${location.id}`}>Series Count: {location.seriescnt}</a>
                            </p>
                            <p className="text-blue-800">{location.title}</p>
                          </div>
                        </InfoWindow>
                      )}
                    </Marker>
                  ))}
                </GoogleMap>
              </LoadScript>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}