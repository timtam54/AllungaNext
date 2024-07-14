"use client"
import { Circles } from 'react-loader-spinner';
import Header from '@/components/header'
import Sample from '@/components/Sample'
import SampleHistory from '@/components/SampleHistory'
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from 'react';
import Link from "next/link";
import ArrowBack from '@mui/icons-material/ArrowBack';
import { getToken } from "@/msal/msal";
import DataTable from "react-data-table-component";
import Button from '@mui/material/Button';
import SendTimeExtensionIcon from '@mui/icons-material/SendTimeExtension';
import SummarizeIcon from '@mui/icons-material/Summarize';
import GrainIcon from '@mui/icons-material/Grain';
import DetailsIcon from '@mui/icons-material/Details';
interface samplerow{
    SampleID:number;
    Number:number;
    description:string;
    longdescription:string;
    EquivalentSamples:number;
    Reportable:boolean;
    SampleOrder:number;
    ExposureType:string;
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
          name:'+',
          sortable: true,
          width: "60px",  
          wrap:true,  
          selector: (row:samplerow)=>row.SampleID
        },
        {
            name:'AEL Ref',
            sortable: true,
            width: "100px",  
            wrap:true,  
            selector: (row:samplerow)=>row.Number,

            cell: (row:samplerow) =><button onClick={(e)=>{
              e.preventDefault();
               setSampID(row.SampleID); 
              setModelOpen(true);
              
            }}><u>{row.Number}</u></button> ,
            
          }
          ,
          {
              name:'Client id',
              sortable: true,
              width: "90px",  
              wrap:true,  
              selector: (row:samplerow)=>row.description,

              cell: (row:samplerow) =><button onClick={(e)=>{
                e.preventDefault();
                 setSampID(row.SampleID); 
                 setmodelOpenHist(true);
                
              }}><u>{row.description}</u></button> ,
              //
            },
            {
                name:'Description',
                sortable: true,
                width: "130px",  
                wrap:true,  
                selector: (row:samplerow)=>row.longdescription
              }
              ,
            {
                name:'Equiv Samples / Alltrack cms',
                sortable: true,
                width: "130px",  
                wrap:true,  
                selector: (row:samplerow)=>row.EquivalentSamples
              }
              ,
            {
                name:'Exposure Type',
                sortable: true,
                width: "130px",  
                wrap:true,  
                selector: (row:samplerow)=>row.ExposureType
              }
              ,
            {
                name:'Reportable',
                sortable: true,
                width: "130px",  
                wrap:true,  
                selector: (row:samplerow)=>row.Reportable
              }
              ,
            {
                name:'Sample Order',
                sortable: true,
                width: "130px",  
                wrap:true,  
                selector: (row:samplerow)=>row.SampleOrder
              },
              {
                  name:'History',
                  sortable: true,
                  width: "130px",  
                  wrap:true,  
                  selector:  (row:samplerow)=>"button"
                },
                {
                    name:'Explode',
                    sortable: true,
                    width: "130px",  
                    wrap:true,  
                    selector:  (row:samplerow)=>"button"
                  }
    ]
    const [results, setDataSample] = useState<samplerow[]>([]);
const fetchSample = async ()=>{
  
  setLoading(true);
  const urlSample = `https://allungawebapi.azurewebsites.net/api/Samples/`+SeriesID+`~`+((deleted)?1:0);
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
  const [modelOpen,setModelOpen]=useState(false);
  const [modelOpenHist,setmodelOpenHist]=useState(false);
  const [sampID,setSampID]=useState(0);
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
        <div>
        <Link href={"/seriestab?id="+SeriesID.toString()+"&seriesname="+seriesname} ><Button  style={{width:'200px'}}  variant='outlined'><DetailsIcon/>Details</Button></Link>
        <Link href={"/samples?id="+SeriesID.toString()+"&seriesname="+seriesname} ><Button style={{width:'200px'}} variant='contained'><GrainIcon/>Samples</Button></Link>
        <Link href={"/reports?id="+SeriesID.toString()+"&seriesname="+seriesname} ><Button style={{width:'200px'}} variant='outlined'><SummarizeIcon/>Reports</Button></Link>
        <Link href={"/dispatch?id="+SeriesID.toString()+"&seriesname="+seriesname} ><Button style={{width:'200px'}} variant='outlined'><SendTimeExtensionIcon/>Dispatch</Button></Link>
        </div> </div>

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
            {modelOpen && <Sample sampleid={sampID} closeModal={()=>{setModelOpen(false);fetchSample()}} SeriesID={SeriesID} />}
            {modelOpenHist && <SampleHistory sampleid={sampID} closeModal={()=>setmodelOpenHist(false)} SeriesID={SeriesID} />}
            </>
               }
            </body>
    )
}