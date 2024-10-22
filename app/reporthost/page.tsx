"use client"
import { getToken } from "@/msal/msal"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import Report from '@/components/report'
interface ReportRow {
  reportid: number
    reportname: string
    seriesid: number
  }
export default function ReportHost() {
    const [reports, setDataReport] = useState<ReportRow>()
    const searchParams = useSearchParams()
    const [loading, setLoading] = useState(true)
    const ReportID = 4;//parseInt(searchParams!.get('reportid')!)
    
    useEffect(() => {
        fetchReport()
      }, [])
    
      const fetchReport = async () => {
        setLoading(true)
        try {
          const token = await getToken()
          const response = await fetch(process.env.NEXT_PUBLIC_API+`Report/${ReportID}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          if (!response.ok) throw new Error(response.statusText)
          const json = await response.json()
          setDataReport(json);
          console.table(json);
        } catch (error) {
          console.error('Failed to fetch reports:', error)
        } finally {
          setLoading(false)
        }
      }
      const [modelOpen, setModelOpen] = useState(true)
      
    return <>
    {reports?.reportid!}
     {modelOpen && <Report reportname={reports?.reportname!} reportid={reports?.reportid!} closeModal={() => setModelOpen(false)} />}
     
    </>
}