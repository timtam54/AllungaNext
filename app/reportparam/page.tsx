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
import Link from "next/link";
import DetailsIcon from '@mui/icons-material/Details';
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
//  const endpoint = `https://allungacorewebapi.azurewebsites.net/api/ReportParams/`+id;
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
        fetchParRepSeries();
        fetchParams();
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
      //  alert(temp.length);

//        var dd=temp.find((i:ParRepSeriesRow)=>i.paramid===pid && i.reportid===rid);
  //      if (dd!=null)
    //      delete dd[0];
      //  alert(e.target.checked);
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
       /* else
        {
          alert('found' + e.target.checked);
          if (e.target.checked)
          {
            dd={dd,'deleted':false};//.deleted=true;//null
          }
          else
          {
            dd.deleted=false;
          }
        setDataParRepSeries([...temp,dd]);
        }*/
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
       
        const endPoint = `https://allungacorewebapi.azurewebsites.net/api/ReportParams/id?SeriesID=`+id;
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

    const GetRepPar = (reportid:number,ParamID:number)=>
      {
        var xx=dataParRepSeries.filter((i)=>i.paramid===ParamID && i.reportid===reportid );
        if (xx.length>0)
        {
      return !xx[0].deleted;
      }
      return false;
      }

      const seriesname=searchParams!.get("seriesname");
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
              <th key={i}>{result.reportname} ({ (new Date(result.date)).getDate()}-{ (new Date(result.date)).getMonth()}-{ (new Date(result.date)).getFullYear()})</th>
          )
          })
        }
        </tr>
           {
        dataParams.map((result,i)=>{
          return (
            <tr className='result' key={i} >
              <td>{result.ParamName}</td>
    
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
</body>
    )
}