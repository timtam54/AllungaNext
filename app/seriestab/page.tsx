"use client"
import Header from '@/components/header'
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ArrowBack from '@mui/icons-material/ArrowBack';
import { ChangeEvent, useEffect, useState } from 'react';
import { Circles } from 'react-loader-spinner'
import { getToken } from "@/msal/msal";
import moment from 'moment';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from '@mui/material/Button';
import ExposureEndDate from '../ExposureEndDate.js';
import SendTimeExtensionIcon from '@mui/icons-material/SendTimeExtension';
import SummarizeIcon from '@mui/icons-material/Summarize';
import GrainIcon from '@mui/icons-material/Grain';
import DetailsIcon from '@mui/icons-material/Details';
import AppsIcon from '@mui/icons-material/Apps';
interface SeriesEvent{
  EventDesc:string;
  EventType:string;
  FrequencyVal:number;
  FrequencyUnit:string;
}
interface exposurerow{
    ExposureTypeID:number;
    Name:string;
}
interface seriesrow{
    ExposureTypeID:number;
    AllungaReference:string;
    Site:number;
    clientid:number;
    ShortDescription:string;
    clientreference:string;
    RackNo:string;
    Active:boolean;
    ExposureDurationVal:number;
    ExposureDurationUnit:string;
    DateIn:Date;
    ExposureEnd:Date;
    LogBookLetterDate:Date;
    ReturnsFrequencyVal:number;
    ReturnsFrequencyUnit:string;
    FrequencyVal:number;
    Deleted:boolean;
    SamplesReturned:boolean;
    LogBookCorrespType:string;
    ExposureSpecification:string;
    VisualReporting:boolean;
    Photos:boolean;
}
interface clientrow{
    clientid:number;
    abbreviation:string;
    companyname:string;
}
interface siterow{
    SiteID:number;
    SiteName:string;
}

export default function SeriesTab()
{
  
  const handleChangeSeriesEvent=(e:ChangeEvent<HTMLInputElement>) => {
    const et=e.target.name;
    const temp=[...dataSeriesEvent];
    var dd=temp.find(i=>i.EventType===et);
    if (e.target.checked)
      dd!.FrequencyVal=0;
    else
      dd!.FrequencyVal=-1;
    
      setdataSeriesEvent([...temp]);
  };
  
    useEffect(() => {
        getalldata()
   
    } , []);
    const [DateIn, setDateIn] = useState(new Date());
    const [vldtAllungaReference,setvldtAllungaReference] = useState('');
    const getalldata=async()=>{
        setLoading(true);
        await fetchExp();
        await fetchSite();
        await fetchClient();
        await fetchSeries();
        setLoading(false);
    }

    const handleChangeSeriesEventUnits= (e:ChangeEvent<HTMLSelectElement>) => {
   
      const EventType=e.target.name;
     
      const temp=[...dataSeriesEvent];
      var dd=temp.find(i=>i.EventType===EventType);
      dd!.FrequencyUnit=e.target.value;
      setdataSeriesEvent([...temp]);
    };
    const [dataSeriesEvent,setdataSeriesEvent]= useState<SeriesEvent[]>([]);

    const handleCheck = (e:ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked)
      {
      setData({ ...data!, [e.target.name]: true});
      }
    else{
      setData({ ...data!, [e.target.name]: false});
    }
    if (SeriesID!=0)
    {
      validatePage();
    }
   };

   /*function validatePage(): boolean {
   var vld=true;
     setvldtAllungaReference('');
    if (data!.AllungaReference==null) {
      setvldtAllungaReference('Please Enter an AEL Ref');
      vld=false;
      return false;
    }
    else
    {
    if (data!.AllungaReference=='') {
      setvldtAllungaReference('Please Enter an AEL Ref');
      vld=false;
      return false;
    }
  }
   }*/

  function validatePage():boolean {
    var vld=true;
    setvldtAllungaReference('');
    if (data!.AllungaReference==null) {
      setvldtAllungaReference('Please Enter an AEL Ref');
      vld=false;
    }
    else
    {
    if (data!.AllungaReference=='') {
      setvldtAllungaReference('Please Enter an AEL Ref');
      vld=false;
    }
  }

  setvldtExposureDurationVal('');
    if (data!.ExposureDurationVal==null) {
      setvldtExposureDurationVal('Please Enter Exposure Duration');
      vld=false;
    }
    else
    {
    if (data!.ExposureDurationVal==null) {
      setvldtExposureDurationVal('Please Enter Exposure Duration');
      vld=false;
    }
  }

  setvldtShortDescription('');
  if (data!.ShortDescription==null) {
    setvldtShortDescription('Please Enter Short Description');
    vld=false;
  }
  else
  {
  if (data!.ShortDescription=='') {
    setvldtShortDescription('Please Enter Short Description');
    vld=false;
  }
}


setvldtReturnsFrequencyVal('');
if (data!.ReturnsFrequencyVal==null) {
  setvldtReturnsFrequencyVal('Please Enter Returns Frequency');
  vld=false;
}
else
{
if (data!.ReturnsFrequencyVal==null) {
  setvldtReturnsFrequencyVal('Please Enter Returns Frequency');
  vld=false;
}
}
    return vld;
  };
  
  const [vldtShortDescription,setvldtShortDescription] = useState('');

   const [isOpen, setIsOpen] = useState(false);
    const fetchClient = async()=>{
        const token = await getToken();
        const headers = new Headers();
        const bearer = `Bearer ${token}`
        headers.append('Authorization', bearer)
        const options = {
          method: 'GET',
          headers: headers,
        }
        const endPoint = 'https://allungawebapi.azurewebsites.net/api/Clients';
        const response = fetch(endPoint,options);
        var ee=await response;
        if (!ee.ok)
        {
          throw Error((ee).statusText);
        }
        const json=await ee.json();
        setClient(json);
      }

      

      const handleSubmit = async (e:any) => {
        if (!validatePage())
            return;
          e.preventDefault();
          const dtfrmt="YYYY-MM-DDT00:00:00";
        data!.DateIn = new Date(DateIn);//DateIn
        data!.ExposureEnd =  new Date(ExposureEnd);//moment(ExposureEnd).format(dtfrmt)
         data!.LogBookLetterDate =new Date(LogBookLetterDate);//  moment(LogBookLetterDate).format(dtfrmt);
       setLoading(true);
         const token = await getToken()
        const headers = new Headers()
        const bearer = `Bearer ${token}`
        headers.append('Authorization', bearer)
        headers.append('Content-type', "application/json; charset=UTF-8")
        if (SeriesID==0)
        {
          const options = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: headers,
          }  
          const response = fetch(`https://allungawebapi.azurewebsites.net/api/Series`,options);
         var ee=await response;
          if (!ee.ok)
          {
            throw Error((ee).statusText);
          }
          const json=await ee.json();
          console.log(json);
          setSeriesID(json.SeriesID);
          await setData(json);
          fetchSeriesEvent();
        }
        else
        {
        const options = {
          method: 'PUT',
          body: JSON.stringify(data),
          headers: headers,
        }  
      
        const response = fetch(`https://allungawebapi.azurewebsites.net/api/Series/`+SeriesID,options);
       var ee=await response;
        if (!ee.ok)
        {
          throw Error((ee).statusText);
        }
      
      }
      
     await handleSubmitSeriesEvent();
      
    }
 
    const handleSubmitSeriesEvent  = async () => {

      const token = await getToken()
     const headers = new Headers()
     const bearer = `Bearer ${token}`
     headers.append('Authorization', bearer)
     headers.append('Content-type', "application/json; charset=UTF-8")
     const options = {
      method: 'PUT',
      body: JSON.stringify(dataSeriesEvent),
      headers: headers,
      
     }
    const response = fetch(`https://allungawebapi.azurewebsites.net/api/SeriesEvent/`+SeriesID,options);
   var ee=await response;
    if (!ee.ok)
    {
      throw Error((ee).statusText);
    }
    const json=await ee.json();
    console.log(json);
    setdataSeriesEvent(json);
    setLoading(false);
       alert('saved');
     }

    const [client, setClient] = useState<clientrow[]>([]);
    const [data, setData] = useState<seriesrow>();
    const [ExposureEnd, setExposureEnd] = useState(new Date());
    const [LogBookLetterDate,setLogBookLetterDate] = useState(new Date());
    const fetchSeries = async()=>{
        //todotim set serieslock
        //remove all series locks on close
          /*  Sub SetLock()
            Dim sql As String = "update Series set Lock_ComputerName='" & System.Net.Dns.GetHostName() & "', Lock_DateTime='" & DateTime.Now.ToString("yyyy/MM/dd H:mm") & "' where seriesid=" & SeriesID.ToString()
            AllungaData.globals.ExecuteScalar(sql)
        End Sub
        */
            if (SeriesID!=0)
            {
            const token = await getToken()
            const headers = new Headers()
            const bearer = `Bearer ${token}`
            headers.append('Authorization', bearer)
            const options = {
              method: 'GET',
              headers: headers,
            }
            const endPoint = `https://allungawebapi.azurewebsites.net/api/Series/int/`+SeriesID;
            const response = fetch(endPoint,options);
            var ee=await response;
            if (!ee.ok)
            {
              throw Error((ee).statusText);
            }
            const json=await ee.json();
            console.log(json);
            await setData(json);
            if (json.Lock_ComputerName!='' && json.Lock_ComputerName!=null)
            {
             ;//todotim alert('locked by '+json.Lock_ComputerName);
            }
            var xx=moment(json.DateIn).toDate();
            setDateIn(xx);
            if (json.ExposureEnd!=null)
            {
            setExposureEnd(moment(json.ExposureEnd).toDate());
            }
            if (json.LogBookLetterDate!=null)
            {
              setLogBookLetterDate(moment(json.LogBookLetterDate).toDate());
            }
          }
            fetchSeriesEvent();
            }
    const fetchSeriesEvent=async ()=>{
      if (SeriesID==0)
        {
          setLoading(false);
          return;
        }
        const token = await getToken()
        const headers = new Headers()
        const bearer = `Bearer ${token}`
        headers.append('Authorization', bearer)
        const options = {
          method: 'GET',
          headers: headers,
        }
        const endPoint = `https://allungawebapi.azurewebsites.net/api/SeriesEvent/`+SeriesID;
        const response = fetch(endPoint,options);
        var ee=await response;
        if (!ee.ok)
        {
          throw Error((ee).statusText);
        }
        const json=await ee.json();
        console.log(json);
        setdataSeriesEvent(json);
        setLoading(false);
    }
    const [vldtReturnsFrequencyVal,setvldtReturnsFrequencyVal] = useState('');
    const handleChangeTextArea = (e: ChangeEvent<HTMLTextAreaElement>) => {
      setData({ ...data!, [e.target.name]:( e.target.value) });
    }
    const handleChangeText = (e: ChangeEvent<HTMLInputElement>) => {
      setData({ ...data!, [e.target.name]: e.target.value });
    }
    const [vldtExposureDurationVal,setvldtExposureDurationVal] = useState('');
    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setData({ ...data!, [e.target.name]:parseInt( e.target.value) });
      if (SeriesID==0)
      {
        if (e.target.name=='clientid')
        {
          var allref=data!.AllungaReference;
          if (allref==null)
          {
            var cli=client.filter(ii => ii.clientid==parseInt( e.target.value));
           const abbr=cli[0].abbreviation;
            var AllungaReference=(new Date()).getDate() + GetMonth((new Date()).getMonth()+1) + (new Date()).getFullYear() + abbr;
            setData({ ...data!, ['AllungaReference']: AllungaReference });
    
          }
          else if (allref=='')
          alert('set new allunga ref');
        }
        
      }
      else
      {
       ;// validatePage();
      }
    };
      function GetMonth(mn:number)
 {
  if (mn==1)
  return 'A';
  if (mn==2)
  return 'B';
  if (mn==3)
  return 'C';
  if (mn==4)
  return 'D';
  if (mn==5)
  return 'E';
  if (mn==6)
  return 'F';
  if (mn==7)
  return 'G';
  if (mn==8)
  return 'H';
  if (mn==9)
  return 'I';
  if (mn==10)
  return 'J';
  if (mn==11)
  return 'K';
return 'L';
 }
 const handleChangeSeriesEventVal= (e:ChangeEvent<HTMLInputElement>) => {
   
  const EventType=e.target.name;
 
  const temp=[...dataSeriesEvent];
  var dd=temp.find(i=>i.EventType===EventType);
  dd!.FrequencyVal=parseInt(e.target.value);
  setdataSeriesEvent([...temp]);
};

    const fetchExp = async()=>{
        const token = await getToken()
        const headers = new Headers()
        const bearer = `Bearer ${token}`
        headers.append('Authorization', bearer)
        const options = {
          method: 'GET',
          headers: headers,
        }
        const urlExp = `https://allungawebapi.azurewebsites.net/api/ExposureTypes/`;
        const endPoint = urlExp;
        const response = fetch(endPoint,options);
        var ee=await response;
        if (!ee.ok)
        {
          throw Error((ee).statusText);
        }
        const json=await ee.json();
        console.log(json);
        setExp(json);
        
      }
      const [units,setUnits] = useState(["Hours", "Days", "Weeks", "Months", "Years", "Langleys", "TNR Langleys", "MJ/m2", "GJ/m2", "EverSummer", "See Below", "Specified In Sample"]);
 
      const [exp, setExp] = useState<exposurerow[]>([]);
      const handleChangeNum = (e:ChangeEvent<HTMLInputElement>) => {
        setData({ ...data!, [e.target.name]: parseInt(e.target.value.replace(/\D/g, '')) });
      }
      const fetchSite = async()=>{
        const token = await getToken()
        const headers = new Headers()
        const bearer = `Bearer ${token}`
        headers.append('Authorization', bearer)
        const options = {
          method: 'GET',
          headers: headers,
        }
        const endPoint = `https://allungawebapi.azurewebsites.net/api/Sites/`;
        const response = fetch(endPoint,options);
        var ee=await response;
        if (!ee.ok)
        {
          throw Error((ee).statusText);
        }
        const json=await ee.json();
        console.log(json);
        setSite(json);
        //fetchClient();
      }
      const [site,setSite] =useState<siterow[]>([]);
    const [loading,setLoading] = useState(true);
    const searchParams = useSearchParams();
    const [SeriesID,setSeriesID]=useState(parseInt( searchParams!.get("id")!));
    const seriesname=searchParams!.get("seriesname");

    const setExposureEndX=async(value:any)=>{
      if (value==null)return;
      setExposureEnd(value!);
      //await fetch....;
   }
    const setDateInX=async(value:any)=>{
      if (value==null)return;
      setDateIn(value!);
      //await fetch....;
   }

   const setLogBookLetterDateX=async(value:any)=>{
    if (value==null)return;
    setLogBookLetterDate(value!);
    //await fetch....;
 }
    return (
        <div style={{backgroundColor:'white'}}>
             {loading ? 
              <div className="relative h-16" >
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
        <div style={{display: 'flex',justifyContent:'space-between',alignItems: 'center',backgroundColor:'white'}}>
        <Link href="/"><ArrowBack/>back</Link>
        <div></div>
        <h3 style={{color:'#944780'}}>Series Name:{seriesname}</h3>
        <div></div>
        <div>
        <Link href={"/seriestab?id="+SeriesID.toString()+"&seriesname="+seriesname} ><Button  style={{width:'200px'}}  variant='contained'><DetailsIcon/>Details</Button></Link>
        <Link href={"/samples?id="+SeriesID.toString()+"&seriesname="+seriesname} ><Button style={{width:'200px'}} variant='outlined'><GrainIcon/>Samples</Button></Link>
        <Link href={"/reports?id="+SeriesID.toString()+"&seriesname="+seriesname} ><Button style={{width:'200px'}} variant='outlined'><SummarizeIcon/>Reports</Button></Link>
        <Link href={"/dispatch?id="+SeriesID.toString()+"&seriesname="+seriesname} ><Button style={{width:'200px'}} variant='outlined'><SendTimeExtensionIcon/>Dispatch</Button></Link>
        <Link href={"/reportparam?id="+SeriesID.toString()+"&seriesname="+seriesname} ><Button style={{width:'200px'}} variant='outlined'><AppsIcon/>Params</Button></Link>
        </div>
        </div>
      
          
        <div className="grid grid-cols-2 gap-4 px-4 my-4" style={{backgroundColor:'white'}} >
<div style={{color:'white',backgroundColor:'black'}} className="bg-white rounded-lg">
    <div><br/></div>
<div style={{display: 'flex',justifyContent:'space-between',alignItems: 'center'}}>
        <Link target='new' href={"/client?id="+ data!.clientid}><Button style={{color:'white',borderColor:'white'}} variant="outlined"><b>Client</b></Button></Link>
  <div> 
          <select style={{color:'black'}} name="clientid" onChange={handleChange}>
          {
          client.map((ep,i)=>{
            return (
              <option value={ep.clientid} selected={(ep.clientid==data!.clientid)?true:false}>{ep.companyname}</option>
            )})
          }
          </select>
      </div>        
      <div></div>


    </div>
    <div><br/></div>
    <div style={{display: 'flex',justifyContent:'space-between',alignItems: 'center'}}>
      <b>Allunga Reference</b>
      <input style={{color:'black'}} type="text" name="AllungaReference" onChange={handleChangeText} value={data!.AllungaReference} />
      <span style={{color:'red'}}>{vldtAllungaReference}</span>
      <b>Client Ref:</b>
      <input type="text" style={{color:'black'}}  name="clientreference" onChange={handleChangeText} value={data!.clientreference} />
      <div></div>

    </div>
    <div style={{display: 'flex',justifyContent:'space-between',alignItems: 'center'}}>
       
      <b>Active:</b><input type="checkbox" name="Active" onChange={handleCheck} style={{color:'black'}} checked={data!.Active} />
      
      <b>Deleted:</b><input name="Deleted" type="checkbox" onChange={handleCheck} checked={data!.Deleted} />
      <div></div>
        </div>
    <div><br/></div>
    <div style={{display: 'flex',justifyContent:'space-between',alignItems: 'center'}}>
    <b>Short Description:</b>
    <textarea  name="ShortDescription" style={{color:'black',width:'500px'}}  cols={120} onChange={handleChangeTextArea} value={data!.ShortDescription} />
    <div></div>
    </div>
    <div><br/></div>

</div>
<div style={{color:'black',backgroundColor:'lightgray'}} className="bg-white rounded-lg">
   <div><br/></div>
<div style={{display: 'flex',justifyContent:'space-between',alignItems: 'center'}}>
          <b>Exposure Type:</b>
          
          <select style={{color:'black'}} name="ExposureTypeID" onChange={handleChange}>
          {
          exp.map((ep,i)=>{
            return (
              <option value={ep.ExposureTypeID} selected={(ep.ExposureTypeID==data!.ExposureTypeID)?true:false}>{ep.Name}</option>
            )})
          }
          </select>
      
          <b>Rack No:</b><input style={{color:'black',width:'100px'}} type="text" name="RackNo" onChange={handleChangeText} value={data!.RackNo} />
          <div></div>  
      </div>

      <div><br/></div>  
      


        <div style={{display: 'flex',justifyContent:'space-between',alignItems: 'center'}}>
          <b>Exposure Duration:</b>
          <div><input type="text" style={{color:'black',width:'100px'}} name="ExposureDurationVal" onChange={handleChangeNum} value={data!.ExposureDurationVal} />
          <span style={{color:'red'}}>{vldtExposureDurationVal}</span>
      </div>
  
          
          <select name="ExposureDurationUnit"  style={{color:'black'}}  onChange={handleChange}>
          {
          units.map((ep,i)=>{
            return (
              <option value={ep} selected={(ep==data!.ExposureDurationUnit)?true:false}>{ep}</option>
            )})
          }
          </select>
      </div>

      <div style={{display: 'flex',justifyContent:'space-between',alignItems: 'center',color:'black'}}>
      <b>Exposed:</b>

<div style={{color:'black'}}>
<DatePicker  className="datePicker" dateFormat="dd/MM/yyyy" onChange={setDateInX} selected={DateIn} />
</div>   
<b>End:</b>
<div style={{color:'black'}}>
<DatePicker className="datePicker" dateFormat="dd/MM/yyyy" onChange={setExposureEndX} selected={ExposureEnd} />
</div>
  <Button style={{color:'black',borderColor:'black'}}  variant="outlined" onClick={() => setIsOpen(true)}>
  <b>End Date</b>
</Button>

{isOpen && <ExposureEndDate StartDate={data!.DateIn} DurationVal={data!.ExposureDurationVal} DurationUnit={data!.ExposureDurationUnit} text="Exposure End Date" closePopup={() => setIsOpen(false)} />}

</div>

</div>

<div style={{color:'black',backgroundColor:'lightgray'}} className="bg-white rounded-lg">
<div><br/></div>
      <div style={{display: 'flex',justifyContent:'space-between',alignItems: 'center'}}>

          <b>Returns Interval:</b>
          <input type="text" style={{color:'black',width:'80px'}}  name="ReturnsFrequencyVal" onChange={handleChangeNum} value={data!.ReturnsFrequencyVal} />
          <span style={{color:'red'}}>{vldtReturnsFrequencyVal}</span>
            
          <select name="ReturnsFrequencyUnit" style={{color:'black'}} onChange={handleChange}>
          {
          units.map((ep,i)=>{
            return (
              <option value={ep} selected={(ep==data!.ReturnsFrequencyUnit)?true:false}>{ep}</option>
            )})
          }
          </select>

          <b>SamplesReturned:</b>
          <input name="SamplesReturned" type="checkbox" onChange={handleCheck} checked={data!.SamplesReturned} />
      
      </div>
      <div style={{display: 'flex',justifyContent:'space-between',alignItems: 'center'}}>
      <table className="results" id="table1" width='100%'>
  <tr>
    <th colSpan={2}><b></b></th>
    <th colSpan={1}><b>Frequency</b></th>
  </tr>
  {
    dataSeriesEvent.map((result,i)=>{
      return (
        <tr className='super-app-theme' key={i} >
            
          <td>{result.EventDesc}</td>
          <td>
            <input type="checkbox" name={result.EventType} onChange={handleChangeSeriesEvent} checked={result.FrequencyVal!=-1}></input>
           
          </td>
          {(result.FrequencyVal!=-1)?
          <td> <input type="text" style={{color:'black'}} name={result.EventType} onChange={e=>handleChangeSeriesEventVal(e)} value={result.FrequencyVal} />
          
          <select name={result.EventType} style={{color:'black'}} onChange={e=>handleChangeSeriesEventUnits(e)} >
          {
          units.map((ep,i)=>{
            return (
              <option value={ep} selected={(ep==result.FrequencyUnit)?true:false}>{ep}</option>
            )})
          }
          </select>
          </td>
          :
          <td>
            Disabled
          </td>
    }
         </tr>  
      )
    })
  }
   </table>


   <table  id="table1" >
      <tr>
        <td>&nbsp;</td>
        </tr>
      <tr className='super-app-theme' >
        <td>VisualReporting</td>
        <td><input type="checkbox" name="VisualReporting" onChange={handleCheck} checked={data!.VisualReporting} /></td>
      </tr>
      <tr className='super-app-theme' >
        <td>&nbsp;</td>
      </tr>
      <tr className='super-app-theme' >
        <td>Photos</td>
        <td><input type="checkbox" name="Photos" onChange={handleCheck} checked={data!.Photos} /></td>
    
      </tr>
    </table>
      </div>
</div>
<div style={{color:'white',backgroundColor:'black'}} className="bg-white rounded-lg">
<div><br/></div>
<div style={{display: 'flex',justifyContent:'space-between',alignItems: 'center',color:'white'}}>

<b>Letter Ref Date</b>
<div style={{color:'black'}}>
          <DatePicker className="datePicker" dateFormat="dd/MM/yyyy" onChange={setLogBookLetterDateX} selected={LogBookLetterDate} />
          </div>
          <b>Communication Type</b>
            <input type="text" style={{color:'black'}} name="LogBookCorrespType" onChange={handleChangeText} value={data!.LogBookCorrespType } />
<div></div>
</div>
<div style={{display: 'flex',justifyContent:'space-between',alignItems: 'center',color:'white'}}>

<b>Site</b>
         
          <select style={{color:'black'}} name="Site" onChange={handleChange}>
          {
          site.map((ep,i)=>{
            return (
              <option value={ep.SiteID} selected={(ep.SiteID==data!.Site)?true:false}>{ep.SiteName}</option>
            )})
          }
          </select>
      
          <div></div>
      </div>
      <div><br/></div>
      <div style={{display: 'flex',justifyContent:'space-between',alignItems: 'center',color:'white'}}>
      <b>Exposure Spec:</b>
      <textarea style={{width:'500px',color:'black'}} rows={10} cols={120}  name="ExposureSpecification" onChange={handleChangeTextArea} value={data!.ExposureSpecification} />
      <div></div>
</div>
<div style={{display: 'flex',justifyContent:'space-between',alignItems: 'center',color:'white'}}>
<Button variant="outlined" style={{color:'white',borderColor:'white'}}  onClick={handleSubmit}>
          <b>Submit</b>
        </Button>
</div>
<div><br/></div>
</div>
</div>
</>
}
        </div>
    )
} 

//