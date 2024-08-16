"use client"
import { getToken } from "@/msal/msal";
import { Circles } from 'react-loader-spinner'
import { ChangeEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/header";
import Button from '@mui/material/Button';
import AppsIcon from '@mui/icons-material/Apps';
import ArrowBack from '@mui/icons-material/ArrowBack';
import SendTimeExtensionIcon from '@mui/icons-material/SendTimeExtension';
import SummarizeIcon from '@mui/icons-material/Summarize';
import GrainIcon from '@mui/icons-material/Grain';
import "./style.css"
import Report from "@/components/report";
import Link from "next/link";
import DetailsIcon from '@mui/icons-material/Details';
import ChartSampleParam from '@/components/chartsampleparam'
interface reportrow{
    reportname:string;
    date:Date;
    reportid:number;
}

interface Param {
    ParamID:number;
    ParamName:string;
    Ordering:number;
}
interface ParRepSeriesRow{
  paramid:number;
  reportid:number;
  deleted:boolean;
}
export default function Page()
{
  
  const handleSubmitParam = async (e:any)=>{
  e.preventDefault()


  const token = await getToken()
  const headers = new Headers()
  const bearer = `Bearer ${token}`
  headers.append('Authorization', bearer);
  console.table(dataParRepSeries);
  const jsondata=JSON.stringify(dataParRepSeries);
  console.log(jsondata);
  const options = {
    method: 'PUT',
    body: jsondata,
    headers: {'Content-type': "application/json"},
  }
  const endpoint=`https://allungawebapicore.azurewebsites.net/api/ReportParams/{id}?SeriesID=`+id;
//`https://localhost:7115/api/ReportParams/{id}?SeriesID=`+id;//
  console.log(endpoint);
  const response = fetch(endpoint,options);
 var ee=await response;
  if (!ee.ok)
  {
    alert((ee).statusText);
  }
 /* var rt=ret.map(t=>t.paramid);
  fetch(`https://allungawebapi.azurewebsites.net/api/ReportParams/int/`+seriesid, {
    method: "PUT",
    body: JSON.stringify(rt),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })    ;*/
  alert('saved');
}

  const searchParams = useSearchParams();
  const id = parseInt( searchParams!.get("id")!);
    const [loading,setLoading] = useState(true);
    useEffect(() => {

        getAllData()
      }, []);
      const getAllData=async()=>
      {
        await fetchParRepSeries();
        await fetchParams();
        await fetchReport();
      }
      const fetchParams = async ()=>{
        const token = await getToken()
          const headers = new Headers()
          const bearer = `Bearer ${token}`
          headers.append('Authorization', bearer)
          const options = {
            method: 'GET',
            headers: headers,
          }
          
          const endPoint =`https://allungawebapi.azurewebsites.net/api/Params/`;
          const response = fetch(endPoint,options);
          var ee=await response;
          if (!ee.ok)
          {
            throw Error((ee).statusText);
          }
          const json=await ee.json();
          console.log(json);
    
         setDataParams(json);
      
      }
      const handleChangeRepPar= (e:ChangeEvent<HTMLInputElement>) => {
        const xx=e.target.name.split('~');
        const rid=Number(xx[0]);
        const pid=Number(xx[1]);
        var temp=[...dataParRepSeries];

      //  alert(temp.length);
        temp=temp.filter((i:ParRepSeriesRow)=>i.paramid!=pid || i.reportid!=rid);

        {
          if (e.target.checked)
          {
           // alert('checked');

            const obj = {'paramid':pid, 'reportid':rid,'deleted':false};//null
            setDataParRepSeries([...temp, obj]);
          }
          else{
           // alert('not checked');
            const obj = {'paramid':pid, 'reportid':rid,'deleted':true};//null
            setDataParRepSeries([...temp, obj]);
          }
        }

      };
      const [dataParams, setDataParams] = useState<Param[]>([]);
      const fetchParRepSeries = async ()=>{
        setLoading(true);
        const token = await getToken()
        const headers = new Headers()
        const bearer = `Bearer ${token}`
        headers.append('Authorization', bearer)
        const options = {
          method: 'GET',
          headers: headers,
        }
       
        const endPoint = `https://allungawebapicore.azurewebsites.net/api/ReportParams/id?SeriesID=`+id;
        //`https://allungawebapi.azurewebsites.net/api/ReportParams/int/`+id;
        console.log(endPoint);
        const response = fetch(endPoint,options);
        var ee=await response;
        if (!ee.ok)
        {
          throw Error((ee).statusText);
        }
        const json=await ee.json();
        console.log(json);
        setDataParRepSeries(json);
      }
      const [dataParRepSeries, setDataParRepSeries] = useState<ParRepSeriesRow[]>([]);
    const fetchReport = async ()=>{
        const token = await getToken()
        const headers = new Headers()
        const bearer = `Bearer ${token}`
        headers.append('Authorization', bearer)
        const options = {
          method: 'GET',
          headers: headers,
        }
        const endPoint ='https://allungawebapi.azurewebsites.net/api/Reports/'+id;
        const response = fetch(endPoint,options);
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
    const [dataReport,setDataReport]=useState<reportrow[]>([]);
    const [chartTitle,setChartTitle]=useState('Hello Chart');
    const GetRepPar = (reportid:number,ParamID:number)=>
      {
        var xx=dataParRepSeries.filter((i)=>i.paramid===ParamID && i.reportid===reportid );
        if (xx.length>0)
        {
      return !xx[0].deleted;
      }
      return false;
      }
      const [paramID,setParamID]=useState(0);
      const [modelOpen,setModelOpen]=useState(false);
      const [modelReportOpen,setModelReportOpen]=useState(false);
      const seriesname=searchParams!.get("seriesname");
      const [reportID,setReportID]=useState(0);
      return (
        <div style={{backgroundColor:'white'}}>
        {loading ? 
         <div className="relative h-16" style={{backgroundColor:'whitesmoke'}}>
<div style={{backgroundColor:'whitesmoke'}} className="absolute p-4 text-center transform -translate-x-1/2 translate-y-1/2 border top-1/2 left-1/2">

 <Circles 
 height="200"
 width="200"
 color="silver"
 ariaLabel="circles-loading"
 wrapperStyle={{}}
 wrapperClass=""
 visible={true}
/>
</div> </div>
:
<>
          <Header/>
          {modelReportOpen && <Report reportid={reportID} closeModal={()=>{setModelReportOpen(false)}}/>}

          {modelOpen && <ChartSampleParam title={chartTitle} seriesid={id} paramID={paramID} closeModal={()=>{setModelOpen(false)}}/>}
          <div style={{display: 'flex',justifyContent:'space-between',alignItems: 'center',backgroundColor:'white'}}>
        <Link href="/"><ArrowBack/>back</Link>
        <div></div>
        <h3 style={{color:'#944780'}}>Series Name:{seriesname}</h3>
        <div></div>
        <div>
        <Link href={"/seriestab?id="+id.toString()+"&seriesname="+seriesname} ><Button  style={{width:'200px'}}  variant='outlined'><DetailsIcon/>Details</Button></Link>
        <Link href={"/samples?id="+id.toString()+"&seriesname="+seriesname} ><Button style={{width:'200px'}} variant='outlined'><GrainIcon/>Samples</Button></Link>
        <Link href={"/reports?id="+id.toString()+"&seriesname="+seriesname} ><Button style={{width:'200px'}} variant='outlined'><SummarizeIcon/>Reports</Button></Link>
        <Link href={"/dispatch?id="+id.toString()+"&seriesname="+seriesname} ><Button style={{width:'200px'}} variant='outlined'><SendTimeExtensionIcon/>Dispatch</Button></Link>
        <Link href={"/reportparam?id="+id.toString()+"&seriesname="+seriesname} ><Button style={{width:'200px'}} variant='contained'><AppsIcon/>Params</Button></Link>
        </div>
        </div>
        <div style={{alignItems: 'center',display:'flex',justifyContent:'space-between'}}>
        <h1 style={{fontSize:"22px"}}>Parameters</h1>
          <Button type="submit" variant='outlined' onClick={handleSubmitParam}>
          Submit
        </Button>
        <div></div>
        </div>
        <table className="table1" > 
        <tr>
        <th>Parameters</th>
        {
        dataReport.map((result,i)=>{
          return (
              <th key={i}>
                
                <Button variant='outlined' onClick={(e)=>{
            e.preventDefault();
            setReportID(result.reportid);
            setModelReportOpen(true);

          }}><u>{result.reportname} ({ (new Date(result.date)).getDate()}-{ (new Date(result.date)).getMonth()}-{ (new Date(result.date)).getFullYear()})</u></Button> 
                
                
                </th>
          )
          })
        }
        </tr>
           {
        dataParams.map((result,i)=>{
          return (
            <tr className='result' key={i} >
              <td style={{alignContent:'center'}}><Button variant="outlined" style={{color:'navy'}} onClick={(e)=>{e.preventDefault();setParamID(result.ParamID);setChartTitle(result.ParamName + ' vs date');setModelOpen(true)}}>{result.ParamName}</Button></td>
    
              {
        dataReport.map((resrep,i)=>{
          return (
    <td>
              <input type="checkbox" name={resrep.reportid+'~'+result.ParamID} onChange={handleChangeRepPar} checked= {GetRepPar(resrep.reportid,result.ParamID)} />
              </td>
          )
          })
        }
               </tr>
          )
          })
        }
        
      </table>
      </>
}
</div>
    )
}