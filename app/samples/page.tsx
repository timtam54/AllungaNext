"use client"
import { Circles } from 'react-loader-spinner';
import Header from '@/components/header'
import Sample from '@/components/Sample'
import SampleExplode from '@/components/SampleExplode'
import SampleHistory from '@/components/SampleHistory'
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
import ChartParamSample from '@/components/chartparamsample'
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
            color: row.Reportable?'navy':'red',
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
        } ,
        {
            name:'AEL Ref',
            sortable: true,
            width: "100px",  
            wrap:true,  
            selector: (row:samplerow)=>row.Number,

            cell: (row:samplerow) =><button onClick={(e)=>{
              e.preventDefault();
               setSampID(row.SampleID); 
              setModalOpen(true);
              
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
                 setmodalOpenHist(true);
                
              }}><u>{row.description}</u></button> ,
              //
            } ,
            {
                name:'Description',
                sortable: true,
                width: "130px",  
                wrap:true,  
                selector: (row:samplerow)=>row.longdescription,
                cell: (row:samplerow) =><button onClick={(e)=>{
                  e.preventDefault();
                   setSampID(row.SampleID);
                   setChartTitle(row.description + ' vs date') 
                   setModelOpen(true);
                  
                }}><u>{row.description}</u></button> ,
                //;setParamID(result.ParamID);setChartTitle(result.ParamName + ' vs date');setModelOpen(true)}}
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
             /* ,
            {
                name:'Reportable',
                sortable: true,
                width: "80px",  
                wrap:true,  
                selector: (row:samplerow)=><input type='checkbox' checked={row.Reportable}></input>
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
                    name:'Explode',
                    sortable: true,
                    width: "130px",  
                    wrap:true,  
                    selector:  (row:samplerow)=>"Explode",
                    cell: (row:samplerow) =><button onClick={(e)=>{
                      e.preventDefault();
                       //setSampID(row.SampleID); 
                       setmodalOpenExplode(true);
                      
                    }}><u>{row.description}</u></button> ,
                  }*/
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
  //const [sampleID,setSampleID]=useState(0);
  const [chartTitle,setChartTitle]=useState('Hello Chart');
  const [modelOpen,setModelOpen]=useState(false);
  const [modalOpenExplode,setmodalOpenExplode]=useState(false);
  const [modalOpen,setModalOpen]=useState(false);
  const [modalOpenHist,setmodalOpenHist]=useState(false);
  const [sampID,setSampID]=useState(0);
    return (
        <body style={{backgroundColor:'white'}}>
             
             {loading ? 
           <div className="relative h-16">
  <div className="absolute p-4 text-center transform -translate-x-1/2 translate-y-1/2 border top-1/2 left-1/2">
      <Circles
      height="200"
      width="200"
      color="silver"
      ariaLabel="circles-loading"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
    />
    </div></div>
:
<>
        <Header/>
        {modelOpen && <ChartParamSample title={chartTitle} seriesid={SeriesID} sampleID={sampID} closeModal={()=>{setModelOpen(false)}}/>}
      
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
        <Link href={"/reportparam?id="+SeriesID.toString()+"&seriesname="+seriesname} ><Button style={{width:'200px'}} variant='outlined'><AppsIcon/>Params</Button></Link>
        </div> </div>

        <div className="grid grid-cols-1 gap-4 px-4 my-4">
        <div style={{color:'white',backgroundColor:'navy'}} className="bg-white rounded-lg">
        {!modelOpen && <DataTable columns={columns}
        fixedHeader
        pagination
        dense
        customStyles={customStyles}        
        data={results}
        conditionalRowStyles={conditionalRowStyles} >
        </DataTable>}
        </div>

            </div>
            {modalOpen && <Sample sampleid={sampID} closeModal={()=>{setModalOpen(false);fetchSample()}} SeriesID={SeriesID} />}
            {modalOpenHist && <SampleHistory sampleid={sampID} closeModal={()=>setmodalOpenHist(false)} SeriesID={SeriesID} />}
            {modalOpenExplode && <SampleExplode closeModal={()=>setmodalOpenExplode(false)} />}
            </>
               }
            </body>
    )
}