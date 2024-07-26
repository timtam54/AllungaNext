
"use client"

import "@/components/part.css";
import React, { useState, useEffect, Component } from "react";
import DataTable from "react-data-table-component";
import { Circles } from 'react-loader-spinner'
import { getToken } from "@/msal/msal";
import { ExportAsExcel, ExportAsPdf, CopyToClipboard, CopyTextToClipboard, PrintDocument, ExcelToJsonConverter, FileUpload } from "react-export-table";
import moment from 'moment'
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Calendar,Views, dateFnsLocalizer } from 'react-big-calendar'
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enAU from 'date-fns/locale/en-AU';
import Button from '@mui/material/Button';
import { formatDate } from "react-datepicker/dist/date_utils";
//import Rprt from "./report";
const locales = {
  'en-US': enAU,
}
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})
interface eventObject{
  id:string;//number;
  title:string;
  start:Date;
  end:Date;
  resourceId:number;
  colorEvento:string;
  color:string;
  //repair:boolean;
}
interface rptrow{
  colour:string;
  id:string;
  cntsamplesonsite:number;
  rackno:string;
  date:Date;
  end:Date;
  reportname:string;
  bookandpage:string;
  allungareference:string;
  clientreference:string;
  seriesid:number;
  shortdescription:string;
  exposuretype:string;
  reportid:number;
  companyname:string;
  clientcontactname:string;
  clientcontactemail:string;
  actual_elseprojected:boolean;
  return_elsereport:boolean;
  cnt:number;
  physicalsamples:number;
  equivalentsamplesonsite:number;
  physicalsampleonsite:number;
}
interface ResourceRow{
  resourceid:string;
  resourcetitle:string;
}
type Props = {
  closeModal:  () => void;
  Rpt:string;
}

function ScheduleActual({closeModal,Rpt}:Props) {

  const [loading,setLoading] = useState(true);
  
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
      //when: (row:rptrow) => true,
      when: (row:rptrow) => true,
      //style:  (row:rptrow) => ({
        style:  (row:rptrow) => ({
          color: row.colour,//==2?'navy':'red',
      })
    }
  ];
  const DateFormat=(date:any)=>  {
    if (date==null) return "";
   const dte= new Date(date);
    return dte.getFullYear().toString()+'-'+(dte.getMonth()+1).toString().padStart(2,'0')+'-'+(dte.getDate()).toString().padStart(2,'0');
  }
  const [diary,setDiary]=useState(true);
const columns =[
    {
      name:'# samples on site',
      sortable: true,
      width: "70px",  
      wrap:true,  
      selector: (row:rptrow)=>row.cntsamplesonsite
    } ,
    {
        name:'Rack No',
        sortable: true,
        width: "90px",  
        wrap:true,  
        selector: (row:rptrow)=>row.rackno,

        cell: (row:rptrow) =><button onClick={(e)=>{
          e.preventDefault();
         //  setSampID(row.SampleID); 
       //   setModalOpen(true);
          
        }}><u>{row.rackno}</u></button> ,
    
        } ,
        {
          name:'Date',
          sortable: true,
          width: "90px",  
          wrap:true,  
          selector: (row:rptrow)=>DateFormat(row.date)
        } ,
        {
          name:'Report Name',
          sortable: true,
          width: "120px",  
          wrap:true,  
          selector:(row:rptrow)=>row.reportname
        } ,
        {
          name:'Book & Page',
          sortable: true,
          width: "90px",  
          wrap:true,  
          selector:(row:rptrow)=>row.bookandpage
        } 
        ,
        {
          name:'allungareference',
          sortable: true,
          width: "130px",  
          wrap:true,  
          selector:(row:rptrow)=>row.allungareference
        } 
        ,
        {
          name:'clientreference',
          sortable: true,
          width: "130px",  
          wrap:true,  
          selector:(row:rptrow)=>row.clientreference
        } 
        ,
        {
          name:'shortdescription',
          sortable: true,
          width: "380px",  
          wrap:true,  
          selector:(row:rptrow)=>row.shortdescription
        } 
        ,
        {
          name:'exposuretype',
          sortable: true,
          width: "120px",  
          wrap:true,  
          selector:(row:rptrow)=>row.exposuretype
        } 
        ,
        {
          name:'companyname',
          sortable: true,
          width: "160px",  
          wrap:true,  
          selector:(row:rptrow)=>row.companyname
        } 
        ,
        {
          name:'clientcontactname',
          sortable: true,
          width: "160px",  
          wrap:true,  
          selector:(row:rptrow)=>row.clientcontactname
        } 
        ,
        {
          name:'clientcontactemail',
          sortable: true,
          width: "160px",  
          wrap:true,  
          selector:(row:rptrow)=>row.clientcontactemail
        } 
       /* ,
        {
          name:'actual_elseprojected',
          sortable: true,
          width: "110px",  
          wrap:true,  
          selector:(row:rptrow)=><input type="checked" checked={row.actual_elseprojected}></input>
        } 
        ,
        {
          name:'return_elsereport',
          sortable: true,
          width: "160px",  
          wrap:true,  
          selector:(row:rptrow)=><input type="checked" checked={row.return_elsereport}></input>
        }  */,
        {
          name:'cnt',
          sortable: true,
          width: "160px",  
          wrap:true,  
          selector:(row:rptrow)=>row.cnt
        } 
        ,
        {
          name:'physicalsamples',
          sortable: true,
          width: "160px",  
          wrap:true,  
          selector:(row:rptrow)=>row.physicalsamples
        } 
        ,
        {
          name:'equivalentsamplesonsite',
          sortable: true,
          width: "160px",  
          wrap:true,  
          selector:(row:rptrow)=>row.equivalentsamplesonsite
        } 
        ,
        {
          name:'physicalsampleonsite',
          sortable: true,
          width: "160px",  
          wrap:true,  
          selector:(row:rptrow)=>row.physicalsampleonsite
        } 
      /*  
  seriesid:number;
  reportid:number;
  */
      ]

      
      const startdte=new Date('2023-09-1');
      const [date,setDate]=useState(startdte);

  useEffect(() => {
    var dte:Date;
    if (Rpt=='Actual'){
      dte=new Date('2023-09-01')
    }
    else if (Rpt=='Projected')
    {
      dte=new Date('2024-09-01')
    }
    else// else if (Rpt== `SampleOnOffSiteActual`)
      dte=new Date('2023-09-01')
    
    
    setDate(dte);


   fetchRack(dte);
  }, []);

  const updateDate = (dte:Date)=>{
    //alert(dte);
    setLoading(true);
    setDate(dte);
    fetchRack(dte);
  }
 

  const fetchRack = async (dte:Date)=>{   
  var endPoint = ``;
  var todte:Date;
  if (date.getMonth() == 11) {
    todte=new Date(dte.getFullYear() + 1, 0, 1);
  }
  else{
    todte= new Date(dte.getFullYear(), dte.getMonth() + 1, 1);
  }

  if (Rpt=='Actual')
  {
    endPoint = `https://allungawebapicore.azurewebsites.net/api/ScheduleActual/id/From/To?id=0&From=` + DateFormat(dte) +`&To=`+ DateFormat(todte);
  }
  else if (Rpt=='Projected')
  {
    endPoint = `https://allungawebapicore.azurewebsites.net/api/ScheduleProjected/id/From/To?id=0&From=` + DateFormat(dte) +`&To=`+ DateFormat(todte);
  
  }
  else if (Rpt== `SampleOnOffSiteActual`)
  {
    endPoint = `https://allungawebapicore.azurewebsites.net/api/SampleOnOffSiteActual/id/From/To?id=0&From=` + DateFormat(dte) +`&To=`+ DateFormat(todte);
  
  }

  const token = await getToken()
  const headers = new Headers()
  const bearer = `Bearer ${token}`
  headers.append('Authorization', bearer)
  const options = {
    method: 'GET',
    headers: headers,
  }  
  //alert(endPoint);
  console.log(endPoint);
  const response = fetch(endPoint,options);
  var ee=await response;
  if (!ee.ok)
  {
    throw Error((ee).statusText);
  }
  const json:rptrow[]=await ee.json();

 if (json==null)
    {
      setEvents([]);
      return;
    }
  let myevent: eventObject[] = [];
  for(let i=0;i<json.length ;i++)
  {
    //todotim color:json[i].color
    //todotim colorEvento:json[i].colorevento
     myevent.push({color:'white',colorEvento:json[i].colour,id:json[i].id,title:json[i].allungareference + ' ' + json[i].reportname,start:new Date(json[i].date),end:new Date(json[i].end),resourceId:0});//resourceId:json[i].resourceid
  }
  //console.table(myevent);
  setEvents(myevent);  

  //////////
  //console.log(json);
  setDataSample(json);
  setLoading(false);
  }

  const [events,setEvents] = useState<eventObject[]>([]);
  const [data, setDataSample] =useState<rptrow[]>([]);
  const tableData = {
    columns,
    data,
  };
//  const [diary,setDiary]=useState(true);

  //const [resourceMap,setResourceMap] = useState<ResourceRow[]>([{resourceid:'0',resourcetitle:'Unassigned'}]);
  return (

<div className="modal-container">
    <div className="modal" style={{backgroundColor:'whitesmoke'}} >
    <div style={{display:'flex'}}>
    <h1 style={{fontSize:'24px',fontWeight:'bold'}}>Schedule {Rpt} Report</h1><Button variant={diary?"contained":"outlined"} onClick={(e)=>{e.preventDefault();setDiary(true);}}>Diary</Button><Button variant={!diary?"contained":"outlined"} onClick={(e)=>{e.preventDefault();setDiary(false);}}>Table</Button><Button type="submit" variant="outlined" onClick={(e)=>{e.preventDefault();closeModal()}}>Close</Button>
</div>




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
{diary?
<Calendar
      selectable={true}
      onSelectSlot={(slot) => {
        console.log("slot select: ", slot);
        //selectDayMobile(slot);
      }}
      onSelectEvent={(eventObject)=>{
          console.log('hyperlink');
          console.log(eventObject.id);
          const ideng= eventObject.id.toString().split("~");

            {
              const link = "/ServiceJob?id="+ideng[0].toString()+"&engid="+ideng[1].toString();
              console.log(link);
              window.top?.location.replace(link);
            }
      }}  
       style={{ height: '600px',fontSize:'9px'}}
        defaultView='month'
        resourceIdAccessor="resourceid"
        resourceTitleAccessor="resourcetitle"
        views={['month']}
       
        localizer={localizer}
        events={events}
        min={moment("2023-09-01T07:00:00").toDate()}
        max={moment("2024-10-01T18:00:00").toDate()}


        date={date}

   
        onNavigate={dte => {
          updateDate(dte);
          
        }}
          eventPropGetter={(events) => {
            const backgroundColor = events.colorEvento ? events.colorEvento : 'blue';
            const color = events.color ? events.color : 'blue';
            return { style: { backgroundColor ,color} }
          }}
      />
:
<>
 <ExportAsExcel
    data={data}
    headers={["# Samples On Site", "Date"]}
    
>
{(props)=> (
      <button {...props}>
        <FileDownloadIcon/>Export as Excel
      </button>
    )}
</ExportAsExcel>
  <DataTable 
  columns={columns}
    data={data}
        fixedHeader
        pagination
        dense
        highlightOnHover
        customStyles={customStyles}        
        
        conditionalRowStyles={conditionalRowStyles} >
        </DataTable>
        </>
}
</>
  }
</div>
</div>

);

}

export default ScheduleActual