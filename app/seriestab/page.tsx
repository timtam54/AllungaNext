'use client'

import { useEffect, useState, ChangeEvent } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import { getToken } from '@/msal/msal'
import Header from '@/components/header'
import ExposureEndDate from '../ExposureEndDate.js'
import { ArrowLeft, FileText, Brain, Send, Grid, Check, X } from 'lucide-react'
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
  <div className="min-h-screen bg-gray-100">
    <Header />
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Link href="/" className="flex items-center text-gray-600 hover:text-gray-800">
          <ArrowLeft className="mr-2" /> Back
        </Link>
        <h1 className="text-2xl font-bold" style={{color:'#944780'}}>Series: {seriesname}</h1>
        <div className="flex space-x-2">
          {[
            { href: `/seriestab?id=${SeriesID}&seriesname=${seriesname}`, icon: FileText, text: 'Details', active: true },
            { href: `/samples?id=${SeriesID}&seriesname=${seriesname}`, icon: Brain, text: 'Samples' },
            { href: `/reports?id=${SeriesID}&seriesname=${seriesname}`, icon: FileText, text: 'Reports' },
            { href: `/dispatch?id=${SeriesID}&seriesname=${seriesname}`, icon: Send, text: 'Dispatch' },
            { href: `/reportparam?id=${SeriesID}&seriesname=${seriesname}`, icon: Grid, text: 'Params' },
          ].map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`flex items-center px-3 py-2 rounded ${
                item.active
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.text}
            </Link>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
              <div className="flex justify-between items-center">
                <Link href={`/client?id=${data!.clientid}`} className="text-blue-600 hover:underline">
                  Client
                </Link>
                <select
                  name="clientid"
                  onChange={handleChange}
                  className="form-select mt-1 block w-full"
                >
                  {client.map((ep) => (
                    <option key={ep.clientid} value={ep.clientid} selected={ep.clientid === data!.clientid}>
                      {ep.companyname}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Allunga Reference</label>
                  <input
                    type="text"
                    name="AllungaReference"
                    onChange={handleChangeText}
                    value={data!.AllungaReference}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  {vldtAllungaReference && <p className="mt-2 text-sm text-red-600">{vldtAllungaReference}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Client Ref</label>
                  <input
                    type="text"
                    name="clientreference"
                    onChange={handleChangeText}
                    value={data!.clientreference}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="Active"
                    onChange={handleCheck}
                    checked={data!.Active}
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2">Active</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="Deleted"
                    onChange={handleCheck}
                    checked={data!.Deleted}
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2">Deleted</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Short Description</label>
                <textarea
                  name="ShortDescription"
                  onChange={handleChangeTextArea}
                  value={data!.ShortDescription}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Exposure Type</label>
                  <select
                    name="ExposureTypeID"
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  >
                    {exp.map((ep) => (
                      <option key={ep.ExposureTypeID} value={ep.ExposureTypeID} selected={ep.ExposureTypeID === data!.ExposureTypeID}>
                        {ep.Name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rack No</label>
                  <input
                    type="text"
                    name="RackNo"
                    onChange={handleChangeText}
                    value={data!.RackNo}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Exposure Duration</label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      name="ExposureDurationVal"
                      onChange={handleChangeNum}
                      value={data!.ExposureDurationVal}
                      className="flex-1 rounded-none rounded-l-md border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    <select
                      name="ExposureDurationUnit"
                      onChange={handleChange}
                      className="rounded-none rounded-r-md border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                      {units.map((unit) => (
                        <option key={unit} value={unit} selected={unit === data!.ExposureDurationUnit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </div>
                  {vldtExposureDurationVal && <p className="mt-2 text-sm text-red-600">{vldtExposureDurationVal}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Exposed</label>
                  <DatePicker
                    selected={DateIn}
                    onChange={setDateInX}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End</label>
                  <DatePicker
                    selected={ExposureEnd}
                    onChange={setExposureEndX}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                End Date
              </button>

              {isOpen && (
                <ExposureEndDate
                  StartDate={data!.DateIn}
                  DurationVal={data!.ExposureDurationVal}
                  DurationUnit={data!.ExposureDurationUnit}
                  text="Exposure End Date"
                  closePopup={() => setIsOpen(false)}
                />
              )}
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Returns and Events</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Returns Interval</label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    name="ReturnsFrequencyVal"
                    onChange={handleChangeNum}
                    value={data!.ReturnsFrequencyVal}
                    className="flex-1 rounded-none rounded-l-md border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <select
                    name="ReturnsFrequencyUnit"
                    onChange={handleChange}
                    className="rounded-none rounded-r-md border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  >
                    {units.map((unit) => (
                      <option key={unit} value={unit} selected={unit === data!.ReturnsFrequencyUnit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>
                {vldtReturnsFrequencyVal && <p className="mt-2 text-sm text-red-600">{vldtReturnsFrequencyVal}</p>}
              </div>
              <div>
                <label className="flex items-center mt-5">
                  <input
                    type="checkbox"
                    name="SamplesReturned"
                    onChange={handleCheck}
                    checked={data!.SamplesReturned}
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2">Samples Returned</span>
                </label>
              </div>
            </div>

            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enabled</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dataSeriesEvent.map((result, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.EventDesc}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        name={result.EventType}
                        onChange={handleChangeSeriesEvent}
                        checked={result.FrequencyVal !== -1}
                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {result.FrequencyVal !== -1 ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            name={result.EventType}
                            onChange={handleChangeSeriesEventVal}
                            value={result.FrequencyVal}
                            className="block w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          />
                          <select
                            name={result.EventType}
                            onChange={handleChangeSeriesEventUnits}
                            className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          >
                            {units.map((unit) => (
                              <option key={unit} value={unit} selected={unit === result.FrequencyUnit}>
                                {unit}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <span className="text-gray-500">Disabled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="VisualReporting"
                  onChange={handleCheck}
                  checked={data!.VisualReporting}
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <span className="ml-2">Visual Reporting</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="Photos"
                  onChange={handleCheck}
                  checked={data!.Photos}
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <span className="ml-2">Photos</span>
              </label>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Additional Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Letter Ref Date</label>
                <DatePicker
                  selected={LogBookLetterDate}
                  onChange={setLogBookLetterDateX}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  dateFormat="dd/MM/yyyy"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Communication Type</label>
                <input
                  type="text"
                  name="LogBookCorrespType"
                  onChange={handleChangeText}
                  value={data!.LogBookCorrespType}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Site</label>
              <select
                name="Site"
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                {site.map((ep) => (
                  <option key={ep.SiteID} value={ep.SiteID} selected={ep.SiteID === data!.Site}>
                    {ep.SiteName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Exposure Specification</label>
              <textarea
                name="ExposureSpecification"
                onChange={handleChangeTextArea}
                value={data!.ExposureSpecification}
                rows={5}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit
            </button>
          </div>
        </form>
      )}
    </main>
  </div>
)
}