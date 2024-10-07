"use client"
import Header from "@/components/header"
import ReportDetEmbed from "@/components/reportdetembed"
import ReportEmbed from "@/components/reportembed"
import ReportPhotosEmbed from "@/components/reportphotosembed"
import { getToken } from "@/msal/msal"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
interface ReportRow {
    reportid: number
    reportname: string
    bookandpage: string
    reportstatus: string
    return_elsereport: boolean
    deleted: boolean
    comment: string
    completedDate: Date
    date: Date
    DaysInLab: number
  }
export default function ReportAll() {
    const searchParams = useSearchParams()
    //const seriesname = searchParams!.get('seriesname')
    const reportid = parseInt(searchParams!.get('id')!)
    const seriesid = parseInt(searchParams!.get('seriesid')!)
    const [data, setData] = useState<ReportRow>();

    useEffect(() => {   
        fetchInfo();
    }, [])

    const fetchInfo = async () => {
        
        const token = await getToken()
        const headers = new Headers()
        const bearer = `Bearer ${token}`
        headers.append('Authorization', bearer)
        const options = {
          method: 'GET',
          headers: headers,
        }
        const urlrep=`https://allungawebapi.azurewebsites.net/api/Reports/int/` + reportid;
        const response = fetch(urlrep, options);
        var ee = await response;
        if (!ee.ok) {
          throw Error((ee).statusText);
        }
        const json = await ee.json();
        
       // var xx = moment(json.date).toDate();
        //setReportDate(xx);
        //if (json.completeddate != null) {
        //  var yy = moment(json.completeddate).toDate();
        //  setCompletedDate(yy);
       // }
        //else {
        //  setCompletedDate(null);
        //}
        setData(json);   
        console.table(json);
      }
      const closeModal = () => {
      }
    return (
        <>
        <Header/>
        <Link href={"/seriestab?id="+seriesid.toString() } className="bg-black text-white px-4 py-2 rounded-md flex items-center hover:bg-gray-800">
            <ArrowLeft className="mr-2 " size={20} />
            Back
          </Link>
      
        {data && <ReportDetEmbed report={data!} />}
        {data && <ReportEmbed reportname={data.reportname} reportid={data.reportid} />}
      
        {data && <ReportPhotosEmbed reportid={data.reportid}  />}

        </>)
}

/*
 
        
        */