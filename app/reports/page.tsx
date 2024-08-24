"use client"
import { Circles } from 'react-loader-spinner';
import Header from '@/components/header'
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from 'react';
import Link from "next/link";
import ArrowBack from '@mui/icons-material/ArrowBack';
import ReportDet from "@/components/reportdet";
import Report from "@/components/report";
import AppsIcon from '@mui/icons-material/Apps';
import { getToken } from "@/msal/msal";
import DataTable from "react-data-table-component";
import Button from '@mui/material/Button';
import SendTimeExtensionIcon from '@mui/icons-material/SendTimeExtension';
import SummarizeIcon from '@mui/icons-material/Summarize';
import GrainIcon from '@mui/icons-material/Grain';
import DetailsIcon from '@mui/icons-material/Details';
import BorderAllIcon from '@mui/icons-material/BorderAll';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ReportPhotos from '@/components/reportphotos';
import PhotoSizeSelectActualIcon from '@mui/icons-material/PhotoSizeSelectActual';
interface reportrow{
    reportid:number;
    reportname:string;
    bookandpage:string;
    reportstatus:string;
    return_elsereport:boolean;
    deleted:boolean;
    comment:string;
    completedDate:Date;
    date:Date;
    
    
    DaysInLab:number;
    
    
   
}
export default function Samples()
{    const searchParams = useSearchParams();
    const seriesname=searchParams!.get("seriesname");
    const SeriesID =parseInt( searchParams!.get("id")!);
    const [loading,setLoading] = useState(true);
   // const [deleted,setDeleted] = useState(false);
    useEffect(() => {
        getalldata()
   
    } , []);
    const customStyles = {
        headCells: {
          style: {
            paddingLeft: '2px', // override the cell padding for head cells
            paddingRight: '2px',
            size:'12px',
            fontWeight:'bold',
            backgroundColor:'#944780',
            color:'white',
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
          when: (row:reportrow) => true,
          style:  (row:reportrow) => ({
            color: row.reportstatus=='N'?'orange':(row.reportstatus=='A'?'Green':'Navy'),
          })
        }
      ];
    const getalldata=async()=>{
        await fetchReport();
       
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
          width: "180px",  
          wrap:true,  
          cell: (row:reportrow) =><button onClick={(e)=>{
            e.preventDefault();
            const res=results.filter((i:reportrow)=>i.reportid===row.reportid);
            setCurrentReport(res[0]); 
            openChat();
          }}><u>{row.reportname}</u></button> ,
          selector: (row:reportrow)=>row.reportname
        },
        {
          name:'Date',
          sortable: true,
          width: "90px",  
          wrap:true,  
          cell: (row:reportrow) =><button onClick={(e)=>{
            e.preventDefault();
            setReportID(row.reportid);
            setModelOpen(true);
    
          }}><u>{FormatDate( row.date)}</u></button>           
        }
        ,
        {
          name:'Status',
          sortable: true,
          width: "80px",  
          wrap:true,  
          selector: (row:reportrow)=> row.reportstatus//.status
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
          width: "420px",  
          wrap:true,  
          selector: (row:reportrow)=> row.comment
        },
        {
          name:'Param Readings',
          sortable: true,
          width: "115px",  
          wrap:true,  
          cell: (row:reportrow) =><Button variant='outlined' onClick={(e)=>{
            e.preventDefault();
            setReportID(row.reportid);
            setModelOpen(true);

          }}><BorderAllIcon/> <u>Excel</u></Button> 
        },
        {
          name:'Photos',
          sortable: true,
          width: "130px",  
          wrap:true,  
          cell: (row:reportrow) =><Button variant='outlined' onClick={(e)=>{
            e.preventDefault();
            setReportID(row.reportid);
            
            setPhotoModelOpen(true);

          }}><PhotoSizeSelectActualIcon/> <u>Photos</u></Button> 
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
  setLoading(false);
  }
  const openChat=()=>{
    setModalOpen(true);
}
  const [modalOpen,setModalOpen] = useState(false);
  const closeChat=()=>{
    setModalOpen(false);
    fetchReport();
}

const [reportID,setReportID]=useState(0);
const [currentReport,setCurrentReport]=useState<reportrow>();
const [modelOpen,setModelOpen]=useState(false);
const [photoModelOpen,setPhotoModelOpen]=useState(false);
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
       {photoModelOpen && <ReportPhotos reportid={reportID} closeModal={()=>{setPhotoModelOpen(false)}}/>}
        {modelOpen && <Report reportid={reportID} closeModal={()=>{setModelOpen(false)}}/>}
        {modalOpen && <ReportDet report={currentReport!} closeModal={closeChat}/>}


        <div style={{display: 'flex',justifyContent:'space-between',alignItems: 'center',backgroundColor:'white'}}>
        <Button variant="contained" style={{backgroundColor:'black',color:'white'}} href="/"><ArrowBack/>back</Button>
        <Button variant="contained" style={{backgroundColor:'black',color:'white'}} href="/"><AddCircleIcon/>Add</Button>
       
        <div></div>
        <h3 style={{color:'#944780'}}>Series:{seriesname}</h3>
        <div></div>
        <div>
        <Link href={"/seriestab?id="+SeriesID.toString()+"&seriesname="+seriesname} ><Button  style={{width:'180px'}}  variant='outlined'><DetailsIcon/>Details</Button></Link>
        <Link href={"/samples?id="+SeriesID.toString()+"&seriesname="+seriesname} ><Button style={{width:'180px'}} variant='outlined'><GrainIcon/>Samples</Button></Link>
        <Link href={"/reports?id="+SeriesID.toString()+"&seriesname="+seriesname} ><Button style={{width:'180px'}} variant='contained'><SummarizeIcon/>Reports</Button></Link>
        <Link href={"/dispatch?id="+SeriesID.toString()+"&seriesname="+seriesname} ><Button style={{width:'180px'}} variant='outlined'><SendTimeExtensionIcon/>Dispatch</Button></Link>
        <Link href={"/reportparam?id="+SeriesID.toString()+"&seriesname="+seriesname} ><Button style={{width:'180px'}} variant='outlined'><AppsIcon/>Params</Button></Link>
        </div>
         </div>

        <div className="grid grid-cols-1 gap-4 px-4 my-4">
        <div style={{color:'white',backgroundColor:'navy'}} className="bg-white rounded-lg">
        {!modelOpen && !modalOpen && <DataTable columns={columns}
       
        pagination
        dense
        customStyles={customStyles}        
        data={results}
        conditionalRowStyles={conditionalRowStyles} >
        </DataTable>}
        </div>

            </div>
            </>
               }
            </body>
    )
}