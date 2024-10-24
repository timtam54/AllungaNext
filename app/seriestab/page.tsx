'use client'
import { FileSpreadsheet } from 'lucide-react'//Grain, 
import { useEffect, useState, ChangeEvent } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import {getToken, msalInstance} from '@/msal/msal'
import Header from '@/components/header'
import ExposureEndDate from '../ExposureEndDate.js'
import { ArrowLeft, FileText,  Send, Grid } from 'lucide-react'
import { Button } from '@mui/material'
interface SeriesEvent{
 // eventdesc:string;
  eventtype:string;
  frequencyval:number;
  frequencyunit:string;
}

interface eventtype{
  eventtype: number;
  eventdesc: string;
}
interface exposurerow{
  exposuretypeid:number;
  name:string;
  description:string;
}
interface seriesrow{
    exposuretypeid:number;
    allungareference:string;
    site:number;
    clientid:number;
    shortdescription:string;
    clientreference:string;
    rackno:string;
    active:boolean;
    exposuredurationval: number;
exposuredurationunit: string;
datein: Date;
exposureend: Date;
logbookletterdate: Date;
returnsfrequencyval: number;
returnsfrequencyunit: string;
//frequencyval: number;
deleted: boolean;
samplesreturned: boolean;
logbookcorresptype: string;
exposurespecification: string;
visualreporting: boolean;
photos: boolean;
    lock_computername:string;
    lock_datetime:Date;
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
    var dd=temp.find(i=>i.eventtype===et);
    if (e.target.checked)
      dd!.frequencyval=0;
    else
      dd!.frequencyval=-1;
    
      setdataSeriesEvent([...temp]);
  };
  
    useEffect(() => {
        getalldata()
   
    } , []);
    const [DateIn, setDateIn] = useState(new Date());
    const [vldtAllungaReference,setvldtAllungaReference] = useState('');
    const getalldata=async()=>{
        checkSecurity(msalInstance.getActiveAccount()!.username)
        setLoading(true);
        await fetchExp();
        await fetchEventTypes();
        await fetchSite();
        await fetchClient();
        await fetchSeries();
        setLoading(false);
    }

    const checkSecurity=async (email:string)=>
    {
      ;//check email is authorised
    }

    const handleChangeSeriesEventUnits= (e:ChangeEvent<HTMLSelectElement>) => {
   
      const EventType=e.target.name;
     
      const temp=[...dataSeriesEvent];
      var dd=temp.find(i=>i.eventtype===EventType);
      dd!.frequencyunit=e.target.value;
      setdataSeriesEvent([...temp]);
    };
    const [dataSeriesEvent,setdataSeriesEvent]= useState<SeriesEvent[]>([]);
    const [eventtypes,seteventtypes]=useState<eventtype[]>([]);
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
    if (data!.allungareference==null) {
      setvldtAllungaReference('Please Enter an AEL Ref');
      vld=false;
    }
    else
    {
    if (data!.allungareference=='') {
      setvldtAllungaReference('Please Enter an AEL Ref');
      vld=false;
    }
  }

  setvldtExposureDurationVal('');
    if (data!.exposuredurationval==null) {
      setvldtExposureDurationVal('Please Enter Exposure Duration');
      vld=false;
    }
    else
    {
    if (data!.exposuredurationval==null) {
      setvldtExposureDurationVal('Please Enter Exposure Duration');
      vld=false;
    }
  }

  setvldtShortDescription('');
  if (data!.shortdescription==null) {
    setvldtShortDescription('Please Enter Short Description');
    vld=false;
  }
  else
  {
  if (data!.shortdescription=='') {
    setvldtShortDescription('Please Enter Short Description');
    vld=false;
  }
}


setvldtReturnsFrequencyVal('');
if (data!.returnsfrequencyval==null) {
  setvldtReturnsFrequencyVal('Please Enter Returns Frequency');
  vld=false;
}
else
{
if (data!.returnsfrequencyval==null) {
  setvldtReturnsFrequencyVal('Please Enter Returns Frequency');
  vld=false;
}
}
    return vld;
  };
  
  const [vldtShortDescription,setvldtShortDescription] = useState('');

   const [isOpen, setIsOpen] = useState(false);
   const fetchEventTypes = async()=>{
    const token = await getToken();
    const headers = new Headers();
    const bearer = `Bearer ${token}`
    headers.append('Authorization', bearer)
    const options = {
      method: 'GET',
      headers: headers,
    }
    const endPoint = process.env.NEXT_PUBLIC_API+`EventType`;
    const response = fetch(endPoint,options);
    var ee=await response;
    if (!ee.ok)
    {
      throw Error((ee).statusText);
    }
    const json=await ee.json();

    seteventtypes(json)
   }
    const fetchClient = async()=>{
        const token = await getToken();
        const headers = new Headers();
        const bearer = `Bearer ${token}`
        headers.append('Authorization', bearer)
        const options = {
          method: 'GET',
          headers: headers,
        }
        const endPoint = process.env.NEXT_PUBLIC_API+`Clients/~`;
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
        data!.datein = new Date(DateIn);//DateIn
        data!.exposureend =  new Date(ExposureEnd);//moment(ExposureEnd).format(dtfrmt)
         data!.logbookletterdate =new Date(LogBookLetterDate);//  moment(LogBookLetterDate).format(dtfrmt);
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
          const response = fetch(process.env.NEXT_PUBLIC_API+`Series`,options);
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
      
        const response = fetch(process.env.NEXT_PUBLIC_API+`Series/`+SeriesID,options);
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
    const response = fetch(process.env.NEXT_PUBLIC_API+`SeriesEvent/`+SeriesID,options);
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
            const endPoint = process.env.NEXT_PUBLIC_API+`Series/int/`+SeriesID;
           //alert(endPoint);
            const response = fetch(endPoint,options);
            var ee=await response;
            if (!ee.ok)
            {
              alert((ee).statusText);
            }
            const json:seriesrow=await ee.json();
            console.log(json);
            await setData(json);
            if (json.lock_computername!='' && json.lock_computername!=null)
            {
             ;//todotim alert('locked by '+json.Lock_ComputerName);
            }
            var xx=moment(json.datein).toDate();
            setDateIn(xx);
            if (json.exposureend!=null)
            {
            setExposureEnd(moment(json.exposureend).toDate());
            }
            if (json.logbookletterdate!=null)
            {
              setLogBookLetterDate(moment(json.logbookletterdate).toDate());
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
        const endPoint = process.env.NEXT_PUBLIC_API+`SeriesEvent/`+SeriesID;
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
    const handleChangeString = (e: ChangeEvent<HTMLSelectElement>) => {
      setData({ ...data!, [e.target.name]: e.target.value});
    }
    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setData({ ...data!, [e.target.name]:parseInt( e.target.value) });
      if (SeriesID==0)
      {
        if (e.target.name=='clientid')
        {
          var allref=data!.allungareference;
          if (allref==null)
          {
            var cli=client.filter(ii => ii.clientid==parseInt( e.target.value));
           const abbr=cli[0].abbreviation;
            var AllungaReference=(new Date()).getDate() + GetMonth((new Date()).getMonth()+1) + (new Date()).getFullYear() + abbr;
            setData({ ...data!, allungareference: AllungaReference });
    
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
  var dd=temp.find(i=>i.eventtype===EventType);
  dd!.frequencyval=parseInt(e.target.value);
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
        const urlExp = `https://allungaapi.azurewebsites.net/api/ExposureType/`;
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
      const units=["Hours", "Days", "Weeks", "Months", "Years", "Langleys", "TNR Langleys", "MJ/m2", "GJ/m2", "EverSummer", "See Below", "Specified In Sample"];
 
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
        const endPoint = `https://allungaapi.azurewebsites.net/api/Site`;
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
   const geteventdesc=(eventtype:string)=>{
    //return eventtype;
   return eventtypes.find(i=>i.eventtype.toString()===eventtype)!.eventdesc;
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
    <div className="mb-6 pt-4 flex justify-between items-center">
          <Link href="/" className="bg-black text-white px-4 py-2 rounded-md flex items-center hover:bg-gray-800">
            <ArrowLeft className="mr-2" size={20} />
            Back
          </Link>
          <h1 className="text-2xl font-bold"  style={{color:'#944780'}}>Series: {seriesname}</h1>
          <div className="flex justify-center space-x-4 ">
          {[
            { href: `/seriestab?id=${SeriesID}&seriesname=${seriesname}`, icon: FileText, text: 'Details' , active: true},
            { href: `/samples?id=${SeriesID}&seriesname=${seriesname}`, icon: Send, text: 'Samples' },//Grain, 
            { href: `/reports?id=${SeriesID}&seriesname=${seriesname}`, icon: FileSpreadsheet, text: 'Reports' },
            { href: `/dispatch?id=${SeriesID}&seriesname=${seriesname}`, icon: Send, text: 'Dispatch' },
            { href: `/reportparam?id=${SeriesID}&seriesname=${seriesname}`, icon: Grid, text: 'Params' },
          ].map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`flex items-center px-4 py-2 rounded-md ${
                item.active
                  ? 'bg-[#944780] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="mr-2" size={20} />
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
          <form className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
                <h2 className="text-xl font-semibold text-purple-800 mb-4">Client Information</h2>
                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={(e) => { window.open('/client?id=' + data!.clientid.toString()) }}
                    className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition duration-300"
                  >
                    Client
                  </button>
                  <select
                    name="clientid"
                    onChange={handleChange}
                    className="form-select mt-1 block w-full rounded-md border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
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
                      value={data!.allungareference}
                      className="mt-1 block w-full rounded-md border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
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
                      className="mt-1 block w-full rounded-md border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="Active"
                      onChange={handleCheck}
                      checked={data!.active}
                      className="rounded border-gray-300 text-purple-600 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2">Active</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="Deleted"
                      onChange={handleCheck}
                      checked={data!.deleted}
                      className="rounded border-gray-300 text-purple-600 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2">Deleted</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Short Description</label>
                  <textarea
                    name="ShortDescription"
                    onChange={handleChangeTextArea}
                    value={data!.shortdescription}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                  />
                </div>
              </div>

              <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
                <h2 className="text-xl font-semibold text-purple-800 mb-4">Exposure Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Exposure Type</label>
                    <select
                      name="ExposureTypeID"
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                    >
                      {exp.map((ep) => (
                        <option key={ep.exposuretypeid} value={ep.exposuretypeid} selected={ep.exposuretypeid === data!.exposuretypeid}>
                          {ep.name}
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
                      value={data!.rackno}
                      className="mt-1 block w-full rounded-md border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Exposure Duration</label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      name="ExposureDurationVal"
                      onChange={handleChangeNum}
                      value={data!.exposuredurationval}
                      className="flex-1 rounded-l-md border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                    />
                    <select
                      name="ExposureDurationUnit"
                      onChange={handleChange}
                      value={data!.exposuredurationunit}
                      className="rounded-r-md border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                    >
                      {units.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </div>
                  {vldtExposureDurationVal && <p className="mt-2 text-sm text-red-600">{vldtExposureDurationVal}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Exposed</label>
                    <DatePicker
                      selected={DateIn}
                      onChange={setDateInX}
                      className="mt-1 block w-full rounded-md border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                      dateFormat="dd/MM/yyyy"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">End</label>
                    <DatePicker
                      selected={ExposureEnd}
                      onChange={setExposureEndX}
                      className="mt-1 block w-full rounded-md border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                      dateFormat="dd/MM/yyyy"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(true)}
                  className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-300"
                >
                  End Date
                </button>

                {isOpen && (
                  <ExposureEndDate
                    StartDate={data!.datein}
                    DurationVal={data!.exposuredurationval}
                    DurationUnit={data!.exposuredurationunit}
                    text="Exposure End Date"
                    closePopup={() => setIsOpen(false)}
                  />
                )}
              </div>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
              <h2 className="text-xl font-semibold text-purple-800 mb-4">Returns and Events</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-purple-50 rounded-md shadow-sm">
                  <div className="flex items-center space-x-4">
                    <label className="block text-sm font-medium text-gray-700">Returns Interval</label>
                    <input
                      type="text"
                      name="ReturnsFrequencyVal"
                      onChange={handleChangeNum}
                      value={data!.returnsfrequencyval}
                      className="flex-1 rounded-md border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                    />
                    <select
                      name="ReturnsFrequencyUnit"
                      onChange={handleChangeString}
                      value={data!.returnsfrequencyunit}
                      className="rounded-md border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                    >
                      {units.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="SamplesReturned"
                        onChange={handleCheck}
                        checked={data!.samplesreturned}
                        className="rounded border-gray-300 text-purple-600 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                      />
                      <span className="ml-2">Samples Returned</span>
                    </label>
                  </div>
                  {vldtReturnsFrequencyVal && <p className="mt-2 text-sm text-red-600">{vldtReturnsFrequencyVal}</p>}
                </div>
              </div>

              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-purple-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">Event</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">Enabled</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">Frequency</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dataSeriesEvent.map((result, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-purple-50' : 'bg-white'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{geteventdesc(result.eventtype)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          name={result.eventtype}
                          onChange={handleChangeSeriesEvent}
                          checked={result.frequencyval !== -1}
                          className="rounded border-gray-300 text-purple-600 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {result.frequencyval !== -1 ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              name={result.eventtype}
                              onChange={handleChangeSeriesEventVal}
                              value={result.frequencyval}
                              className="block w-20 rounded-md border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                            />
                            <select
                              name={result.eventtype}
                              onChange={handleChangeSeriesEventUnits}
                              className="block w-32 rounded-md border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                            >
                              {units.map((unit) => (
                                <option key={unit} value={unit} selected={unit === result.frequencyunit}>
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
            <div style={{display:'flex', justifyContent:'start'}}>
           
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="VisualReporting"
                    onChange={handleCheck}
                    checked={data!.visualreporting}
                    className="rounded border-gray-300 text-purple-600 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2">Visual Reporting</span>
                </label>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="Photos"
                    onChange={handleCheck}
                    checked={data!.photos}
                    className="rounded border-gray-300 text-purple-600 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2">Photos</span>
                </label>
              
            </div>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
              <h2 className="text-xl font-semibold text-purple-800 mb-4">Additional Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Letter Ref Date</label>
                  <DatePicker
                    selected={LogBookLetterDate}
                    onChange={setLogBookLetterDateX}
                    className="mt-1 block w-full rounded-md border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Communication Type</label>
                  <input
                    type="text"
                    name="LogBookCorrespType"
                    onChange={handleChangeText}
                    value={data!.logbookcorresptype}
                    className="mt-1 block w-full rounded-md border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Site</label>
                <select
                  name="Site"
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                >
                  {site.map((ep) => (
                    <option key={ep.SiteID} value={ep.SiteID} selected={ep.SiteID === data!.site}>
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
                  value={data!.exposurespecification}
                  rows={5}
                  className="mt-1 block w-full rounded-md border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-300"
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
  
  )
}