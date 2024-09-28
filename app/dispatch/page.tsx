'use client'

import { useState, useEffect } from 'react'
import { ChevronUp, ChevronDown , ArrowLeft, FileText, Brain, Send, Grid, BarChart2,FileSpreadsheet } from 'lucide-react'
import Header from '@/components/header';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import DispatchSample from '@/components/dispatchsample';
import { Button } from '@mui/material';

interface Dispatch {
  dispatchid: number;
  seriesid: number;
  dte: Date;
  description?: string;
  staffid?: number;
  byrequest?: boolean;
  fullreturn_elsepart?: boolean;
  reexposuredate?: Date;
  comments?: string;
  status?: string;
  splitfromdispatchid?: number;
}

type SortKey = keyof Dispatch
type SortOrder = 'asc' | 'desc'

export default function DispatchTable() {
  const [dispatches, setDispatches] = useState<Dispatch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortKey, setSortKey] = useState<SortKey>('dispatchid')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  const searchParams = useSearchParams();
  const seriesname=searchParams!.get("seriesname");
  const id =parseInt( searchParams!.get("id")!);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://allungawebapicore.azurewebsites.net/api/Dispatch/3222')
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        setDispatches(data)
        setLoading(false)
      } catch (error) {
        setError('Failed to fetch data')
        setLoading(false)
      }
    }

    fetchData()
  }, [])
  const [sampleModal,setSampleModal]= useState(false);
  const sortData = (key: SortKey) => {
    const isAsc = sortKey === key && sortOrder === 'asc'
    setSortKey(key)
    setSortOrder(isAsc ? 'desc' : 'asc')

    const sortedData = [...dispatches].sort((a:any, b:any) => {
      if (a[key] < b[key]) return isAsc ? 1 : -1
      if (a[key] > b[key]) return isAsc ? -1 : 1
      return 0
    })

    setDispatches(sortedData)
  }

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortKey !== columnKey) return null
    return sortOrder === 'asc' ? <ChevronUp className="inline w-4 h-4" /> : <ChevronDown className="inline w-4 h-4" />
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  
  return (
    <>
    <Header/>
    {sampleModal && <DispatchSample dispsamid={18} closeModal={()=>setSampleModal(false)}/>}
    <div className="mb-6 pt-4 flex justify-between items-center">
  
  <Link href="/" className="bg-black text-white px-4 py-2 rounded-md flex items-center hover:bg-gray-800">
    <ArrowLeft className="mr-2" size={20} />
    Back
  </Link>
  <h1 className="text-2xl font-bold"  style={{color:'#944780'}}>Series: {seriesname}</h1>
  <div className="flex justify-center space-x-4 ">
  {[
    { href: `/seriestab?id=${id}&seriesname=${seriesname}`, icon: FileText, text: 'Details' },
    { href: `/samples?id=${id}&seriesname=${seriesname}`, icon: Send, text: 'Samples' },//Grain, 
    { href: `/reports?id=${id}&seriesname=${seriesname}`, icon: FileSpreadsheet, text: 'Reports' },
    { href: `/dispatch?id=${id}&seriesname=${seriesname}`, icon: Send, text: 'Dispatch', active: true },
    { href: `/reportparam?id=${id}&seriesname=${seriesname}`, icon: Grid, text: 'Params' },
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

    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
           
            <th className="px-4 py-2 border-b cursor-pointer" onClick={() => sortData('dte')}>
              Date <SortIcon columnKey="dte" />
            </th>
            <th className="px-4 py-2 border-b cursor-pointer" onClick={() => sortData('description')}>
              Description <SortIcon columnKey="description" />
            </th>
            <th className="px-4 py-2 border-b cursor-pointer" onClick={() => sortData('staffid')}>
              Staff ID <SortIcon columnKey="staffid" />
            </th>
            <th className="px-4 py-2 border-b cursor-pointer" onClick={() => sortData('byrequest')}>
              By Request <SortIcon columnKey="byrequest" />
            </th>
            <th className="px-4 py-2 border-b cursor-pointer" onClick={() => sortData('fullreturn_elsepart')}>
              Full Return <SortIcon columnKey="fullreturn_elsepart" />
            </th>
            <th className="px-4 py-2 border-b cursor-pointer" onClick={() => sortData('reexposuredate')}>
              Re-exposure Date <SortIcon columnKey="reexposuredate" />
            </th>
            <th className="px-4 py-2 border-b cursor-pointer" onClick={() => sortData('comments')}>
              Comments <SortIcon columnKey="comments" />
            </th>
            <th className="px-4 py-2 border-b cursor-pointer" onClick={() => sortData('status')}>
              Status <SortIcon columnKey="status" />
            </th>
            <th className="px-4 py-2 border-b cursor-pointer" onClick={() => sortData('splitfromdispatchid')}>
              Split From Dispatch ID <SortIcon columnKey="splitfromdispatchid" />
            </th>
          </tr>
        </thead>
        <tbody>
          {dispatches.map((dispatch) => (
            <tr key={dispatch.dispatchid} className="hover:bg-gray-50">

              <td className="px-4 py-2 border-b"><Button variant="outlined" onClick={(e:any)=>{e.preventDefault();setSampleModal(true);}}>{new Date(dispatch.dte).toLocaleDateString()}</Button></td>
              <td className="px-4 py-2 border-b">{dispatch.description || 'N/A'}</td>
              <td className="px-4 py-2 border-b">{dispatch.staffid || 'N/A'}</td>
              <td className="px-4 py-2 border-b">{dispatch.byrequest ? 'Yes' : 'No'}</td>
              <td className="px-4 py-2 border-b">{dispatch.fullreturn_elsepart ? 'Yes' : 'No'}</td>
              <td className="px-4 py-2 border-b">
                {dispatch.reexposuredate ? new Date(dispatch.reexposuredate).toLocaleDateString() : 'N/A'}
              </td>
              <td className="px-4 py-2 border-b">{dispatch.comments || 'N/A'}</td>
              <td className="px-4 py-2 border-b">{dispatch.status || 'N/A'}</td>
              <td className="px-4 py-2 border-b">{dispatch.splitfromdispatchid || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  )
}