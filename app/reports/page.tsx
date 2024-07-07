"use client"
import { Circles } from 'react-loader-spinner';
import Header from '@/components/header'
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from 'react';
import Link from "next/link";
import ArrowBack from '@mui/icons-material/ArrowBack';
import { getToken } from "@/msal/msal";
import DataTable from "react-data-table-component";
interface reportrow{
    reportid:number;
    reportname:string;
    date:Date;
    status:string;
    bookandpage:string;
    DaysInLab:number;
    comment:string;
   
}
export default function Samples()
{    const searchParams = useSearchParams();
    const seriesname=searchParams!.get("seriesname");
    const SeriesID =parseInt( searchParams!.get("id")!);
    const [loading,setLoading] = useState(true);
    const [deleted,setDeleted] = useState(false);
    useEffect(() => {
        getalldata()
   
    } , []);
    const customStyles = {
        headCells: {
          style: {
            paddingLeft: '4px', // override the cell padding for head cells
            paddingRight: '4px',
            size:'12px',
          },
          
        },
        cells: {
          style: {
            paddingLeft: '4px', // override the cell padding for data cells
            paddingRight: '4px',
            
          },
        },
      }
      const conditionalRowStyles = [
        {
          when: (row:reportrow) => true,
          style:  (row:reportrow) => ({
            color: row.reportid?'red':'blue',
          })
        }
      ];
    const getalldata=async()=>{
        await fetchReport();
        setLoading(false);
    }
    const FormatDate=(date:any)=>  {
      if (date==null) return "";
     const dte= new Date(date);
      return dte.getFullYear().toString()+'-'+(dte.getMonth()+1).toString().padStart(2,'0')+'-'+(dte.getDate()).toString().padStart(2,'0');
    }
    const columns =[
        {
          name:'ID',
          sortable: true,
          width: "60px",  
          wrap:true,  
          selector: (row:reportrow)=>row.reportid
        },
        {
          name:'Description',
          sortable: true,
          width: "230px",  
          wrap:true,  
          cell:   (row:reportrow) => <Link target="_blank" href={{
            pathname:'report',query:{id:row.reportid}}}><u>{row.reportname}</u></Link>,
        
          selector: (row:reportrow)=>row.reportname
        },
        {
          name:'Date',
          sortable: true,
          width: "90px",  
          wrap:true,  
          selector: (row:reportrow)=>FormatDate( row.date)
        }
        ,
        {
          name:'Status',
          sortable: true,
          width: "80px",  
          wrap:true,  
          selector: (row:reportrow)=> row.status
        }
        ,
        {
          name:'Book & Page',
          sortable: true,
          width: "100px",  
          wrap:true,  
          selector: (row:reportrow)=> row.bookandpage
        }
        ,
        {
          name:'Days In Lab',
          sortable: true,
          width: "80px",  
          wrap:true,  
          selector: (row:reportrow)=> row.DaysInLab
        }
        ,
        {
          name:'Comments',
          sortable: true,
          width: "320px",  
          wrap:true,  
          selector: (row:reportrow)=> row.comment
        }
    ]
    const [results, setDataReport] = useState<reportrow[]>([]);
const fetchReport = async ()=>{
  setLoading(true);
  const token = await getToken()
  const headers = new Headers()
  const bearer = `Bearer ${token}`
  headers.append('Authorization', bearer)

  const options = {
    method: 'GET',
    headers: headers,
  }  
  const response = fetch('https://allungawebapi.azurewebsites.net/api/Reports/'+SeriesID,options);
  var ee=await response;
  if (!ee.ok)
  {
    throw Error((ee).statusText);
  }
  const json=await ee.json();
  console.log(json);
  setDataReport(json);

  }
    return (
        <body style={{backgroundColor:'white'}}>
             
             {loading ? 
      <div className="container">
      <Circles
      height="200"
      width="200"
      color="silver"
      ariaLabel="circles-loading"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
    />
    </div>
:
<>
        <Header/>
        <div style={{display: 'flex',justifyContent:'space-between',alignItems: 'center',backgroundColor:'white'}}>
        <Link href="/"><ArrowBack/>back</Link>
        <div></div>
        <h3 style={{color:'#944780'}}>Series Name:{seriesname}</h3>
        <div></div>
        <b>Series Details</b>
        <Link href={"/samples?id="+SeriesID.toString()+"&seriesname="+seriesname}>Samples</Link>
        <Link href={"/reports?id="+SeriesID.toString()+"&seriesname="+seriesname} >Reports</Link>
        </div>

        <div className="grid grid-cols-1 gap-4 px-4 my-4">
        <div style={{color:'white',backgroundColor:'navy'}} className="bg-white rounded-lg">
        <DataTable columns={columns}
        fixedHeader
        pagination
        dense
        customStyles={customStyles}        
        data={results}
        conditionalRowStyles={conditionalRowStyles} >
        </DataTable>
        </div>

            </div>
            </>
               }
            </body>
    )
}