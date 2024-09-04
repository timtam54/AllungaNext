"use client"
import { Circles } from 'react-loader-spinner';
import Header from '@/components/header'
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from 'react';
import Link from "next/link";
import AppsIcon from '@mui/icons-material/Apps';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { getToken } from "@/msal/msal";
import DataTable from "react-data-table-component";
import Button from '@mui/material/Button';
import SendTimeExtensionIcon from '@mui/icons-material/SendTimeExtension';
import SummarizeIcon from '@mui/icons-material/Summarize';
import GrainIcon from '@mui/icons-material/Grain';
import DetailsIcon from '@mui/icons-material/Details';
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
            paddingLeft: '2px', // override the cell padding for head cells
            paddingRight: '2px',
            size:'12px',
            fontWeight:'bold'
          },
          
        },
        cells: {
          style: {
            paddingLeft: '2px', // override the cell padding for data cells
            paddingRight: '2px',
            
          },
        },
      }
      const conditionalRowStyles = [
        {
          when: (row:samplerow) => true,
          style:  (row:samplerow) => ({
            color: row.FullReturn_ElsePart?'red':'blue',
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
        }/*,
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
                  }*/
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
              <div className="relative h-16">
  <div className="absolute p-4 text-center transform -translate-x-1/2 translate-y-1/2 border top-1/2 left-1/2">
      <Circles
      height="200"
      width="200"
      color="#944780"
      ariaLabel="circles-loading"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
    />
    </div></div>
:
<>
        <Header/>
        <div style={{display: 'flex',justifyContent:'space-between',alignItems: 'center',backgroundColor:'white'}}>
        <Button variant="contained" style={{backgroundColor:'black',color:'white'}} href="/"><ArrowBack/>back</Button>
        <div></div>
        <h1 className="text-2xl font-bold"  style={{color:'#944780'}}>Series:{seriesname}</h1>
        <div></div>
        <div>
        <Link href={"/seriestab?id="+SeriesID.toString()+"&seriesname="+seriesname} ><Button  style={{width:'180px'}}  variant='outlined'><DetailsIcon/>Details</Button></Link>
        <Link href={"/samples?id="+SeriesID.toString()+"&seriesname="+seriesname} ><Button style={{width:'180px'}} variant='outlined'><GrainIcon/>Samples</Button></Link>
        <Link href={"/reports?id="+SeriesID.toString()+"&seriesname="+seriesname} ><Button style={{width:'180px'}} variant='outlined'><SummarizeIcon/>Reports</Button></Link>
        <Link href={"/dispatch?id="+SeriesID.toString()+"&seriesname="+seriesname} ><Button style={{width:'180px'}} variant='contained'><SendTimeExtensionIcon/>Dispatch</Button></Link>
        <Link href={"/reportparam?id="+SeriesID.toString()+"&seriesname="+seriesname} ><Button style={{width:'180px'}} variant='outlined'><AppsIcon/>Params</Button></Link>
        </div>
        </div>

        <div className="grid grid-cols-1 gap-4 px-4 my-4">
        <div style={{color:'white',backgroundColor:'navy'}} className="bg-white rounded-lg">
        <DataTable
        
         columns={columns}
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