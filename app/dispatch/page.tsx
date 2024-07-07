"use client"
import { Circles } from 'react-loader-spinner';
import Header from '@/components/header'
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from 'react';
import Link from "next/link";
import ArrowBack from '@mui/icons-material/ArrowBack';
import { getToken } from "@/msal/msal";
import DataTable from "react-data-table-component";
interface samplerow{
    Staff:string;
    Dte:Date;
    Description:string;
    FullReturn_ElsePart:boolean;
    ByRequest:boolean;
    ReexposureDate:Date;
    Comments:string;
    Status:string;
}
export default function Dispatch()
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
          when: (row:samplerow) => true,
          style:  (row:samplerow) => ({
            color: row.Reportable?'red':'blue',
          })
        }
      ];
    const getalldata=async()=>{
        await fetchSample();
        setLoading(false);
    }
    const columns =[
        {
          name:'Staff',
          sortable: true,
          width: "60px",  
          wrap:true,  
          selector: (row:samplerow)=>row.Staff
        },
        {
            name:'Date',
            sortable: true,
            width: "100px",  
            wrap:true,  
            selector: (row:samplerow)=>row.Dte
          }
          ,
          {
              name:'Description',
              sortable: true,
              width: "150px",  
              wrap:true,  
              selector: (row:samplerow)=>row.Description
            },
            {
                name:'Full Return',
                sortable: true,
                width: "130px",  
                wrap:true,  
                selector: (row:samplerow)=>row.FullReturn_ElsePart
              }
              ,
            {
                name:'Status',
                sortable: true,
                width: "130px",  
                wrap:true,  
                selector: (row:samplerow)=>row.Status
              }
              ,
            {
                name:'By Request',
                sortable: true,
                width: "130px",  
                wrap:true,  
                selector: (row:samplerow)=>row.ByRequest
              }
             ,
            {
                name:'ReexposureDate',
                sortable: true,
                width: "130px",  
                wrap:true,  
                selector: (row:samplerow)=>row.ReexposureDate
              },
              {
                  name:'Comments',
                  sortable: true,
                  width: "130px",  
                  wrap:true,  
                  
                    selector:  (row:samplerow)=>row.Comments
                  }
    ]
    const [results, setDataSample] = useState<samplerow[]>([]);
const fetchSample = async ()=>{
  
  setLoading(true);
  const urlSample = `https://allungawebapi.azurewebsites.net/api/dispatches/`+SeriesID;
  const token = await getToken()
  const headers = new Headers()
  const bearer = `Bearer ${token}`

  headers.append('Authorization', bearer)

  const options = {
    method: 'GET',
    headers: headers,
  }  
  const response = fetch(urlSample,options);
  var ee=await response;
  if (!ee.ok)
  {
    throw Error((ee).statusText);
  }
  const json=await ee.json();
  console.log(json);
  setDataSample(json);
  //setLoading(false);


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
        <Link href={"/seriestab?id="+SeriesID.toString()+"&seriesname="+seriesname} >Series Details</Link>
        <Link href={"/samples?id="+SeriesID.toString()+"&seriesname="+seriesname}>Samples</Link>
        <Link href={"/reports?id="+SeriesID.toString()+"&seriesname="+seriesname} >Reports</Link>
        <Link href={"/dispatch?id="+SeriesID.toString()+"&seriesname="+seriesname} >Dispatch</Link>
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