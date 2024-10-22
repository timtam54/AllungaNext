'use client'

import { useEffect, useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import Header from '@/components/header';
import Param from '@/components/Param';

interface Param {
  paramid: number;
  paramname: string;
  unit: string;
  valuerange: string;
  equivalentvalues: string;
  ordering: number;
  visualnoreadings: string;
  reportparamcostgroupid: number | null;
  reportratediscounted: number | null;
  reportratestandard: number | null;
}

type SortKey = keyof Param;
type SortOrder = 'asc' | 'desc';

const columns: { key: SortKey; label: string }[] = [
  //{ key: 'paramid', label: 'Param ID' },
  //{ key: 'paramname', label: 'Param Name' },
  { key: 'unit', label: 'Unit' },
  { key: 'valuerange', label: 'Value Range' },
  { key: 'equivalentvalues', label: 'Equivalent Values' },
  { key: 'ordering', label: 'Ordering' },
  { key: 'visualnoreadings', label: 'Visual No Readings' },
  /*{ key: 'reportparamcostgroupid', label: 'Report Param Cost Group ID' },
  { key: 'reportratediscounted', label: 'Report Rate Discounted' },
  { key: 'reportratestandard', label: 'Report Rate Standard' },*/
];

export default function ParamList() {
  const [params, setParams] = useState<Param[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortKey, setSortKey] = useState<SortKey>('paramid')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  useEffect(() => {
    const fetchParams = async () => {
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_API+'Param')
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        const data: Param[] = await response.json()
        setParams(data)
        setIsLoading(false)
      } catch (err) {
        setError('An error occurred while fetching the data')
        setIsLoading(false)
      }
    }

    fetchParams()
  }, [])

  const sortedParams = [...params].sort((a, b) => {
    if (a[sortKey] === null) return sortOrder === 'asc' ? 1 : -1;
    if (b[sortKey] === null) return sortOrder === 'asc' ? -1 : 1;
    if (a![sortKey] < b![sortKey]) return sortOrder === 'asc' ? -1 : 1;
    if (a![sortKey] > b![sortKey]) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortOrder('asc')
    }
  }
  const [paramID, setParamID] = useState(0)
  const [modelOpen, setModelOpen] = useState(false)
  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (columnKey !== sortKey) return null;
    return sortOrder === 'asc' ? <ChevronUp className="inline w-4 h-4" /> : <ChevronDown className="inline w-4 h-4" />;
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
  }

  return (
    <> <Header />
     {modelOpen && (
        <Param ParamID={paramID} closeModal={() => setModelOpen(false)} />
      )}
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Parameter List</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th key="paramname"
                  className="py-2 px-4 border-b cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort("paramname")}
                >
                  Parameter Name
                  <SortIcon columnKey="paramname" />
                 
                  </th>
              {columns.map(({ key, label }) => (
                <th
                  key={key}
                  className="py-2 px-4 border-b cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort(key)}
                >
                  {label}
                  <SortIcon columnKey={key} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedParams.map((param) => (
              <tr key={param.paramid} className="hover:bg-gray-50">
                 <td key="paramname" className="py-2 px-4 border-b">
                 <button onClick={() => {
            setParamID(param.paramid)
            setModelOpen(true)  }}   className="text-blue-600 hover:text-blue-800 underline focus:outline-none">
                    {param.paramname}
                    </button>
                  </td>
                {columns.map(({ key }) => (
                  <td key={key} className="py-2 px-4 border-b">
                    {param[key] !== null ? param[key]?.toString() : 'N/A'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  )
}