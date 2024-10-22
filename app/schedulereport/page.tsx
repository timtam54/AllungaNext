'use client'

import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Circles } from 'react-loader-spinner'
import { getToken } from "@/msal/msal";
import { ExportAsExcel } from "react-export-table";
import moment from 'moment'
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enAU from 'date-fns/locale/en-AU';
import { useSearchParams } from "next/navigation";
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import Header from "@/components/header";
import { Button } from "@mui/material";

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

interface EventObject {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resourceId: number;
  colorEvento: string;
  color: string;
}

interface ReportRow {
  colour: string;
  id: string;
  cntsamplesonsite: number;
  rackno: string;
  date: Date;
  end: Date;
  reportname: string;
  bookandpage: string;
  allungareference: string;
  clientreference: string;
  seriesid: number;
  shortdescription: string;
  exposuretype: string;
  reportid: number;
  companyname: string;
  clientcontactname: string;
  clientcontactemail: string;
  actual_elseprojected: boolean;
  return_elsereport: boolean;
  cnt: number;
  physicalsamples: number;
  equivalentsamplesonsite: number;
  physicalsampleonsite: number;
}

export default function ScheduleActual() {
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const rprt = searchParams!.get("Rpt") ?? 'Actual';
  const [Rpt, setRpt] = useState(rprt);
  const [diary, setDiary] = useState(true);
  const [events, setEvents] = useState<EventObject[]>([]);
  const [data, setDataSample] = useState<ReportRow[]>([]);
  const [date, setDate] = useState(new Date('2023-09-1'));

  const customStyles = {
    headCells: {
      style: {
        paddingLeft: '8px',
        paddingRight: '8px',
        fontSize: '14px',
        fontWeight: 'bold',
        backgroundColor: '#f0f0f0',
      },
    },
    cells: {
      style: {
        paddingLeft: '8px',
        paddingRight: '8px',
        fontSize: '14px',
      },
    },
  }

  const conditionalRowStyles = [
    {
      when: (row: ReportRow) => true,
      style: (row: ReportRow) => ({
        color: row.colour,
      })
    }
  ];

  const DateFormat = (date: any) => {
    if (date == null) return "";
    const dte = new Date(date);
    return dte.getFullYear().toString() + '-' + (dte.getMonth() + 1).toString().padStart(2, '0') + '-' + (dte.getDate()).toString().padStart(2, '0');
  }
  const DateFormatYM = (date: any) => {
    if (date == null) return "";
    const dte = new Date(date);
    return dte.getFullYear().toString() + '-' + (dte.getMonth() + 1).toString().padStart(2, '0');
  }
  const columns = [
    {
      name: '# samples on site',
      sortable: true,
      width: "100px",
      wrap: true,
      selector: (row: ReportRow) => row.cntsamplesonsite
    },
    {
      name: 'Rack No',
      sortable: true,
      width: "100px",
      wrap: true,
      selector: (row: ReportRow) => row.rackno,
      cell: (row: ReportRow) => <button className="text-blue-600 hover:underline" onClick={(e) => {
        e.preventDefault();
      }}>{row.rackno}</button>,
    },
    {
      name: 'Date',
      sortable: true,
      width: "120px",
      wrap: true,
      selector: (row: ReportRow) => DateFormat(row.date)
    },
    {
      name: 'Report Name',
      sortable: true,
      width: "150px",
      wrap: true,
      selector: (row: ReportRow) => row.reportname
    },
    // ... (other columns)
  ]

  useEffect(() => {
    let dte: Date;
    if (Rpt === 'Actual' || Rpt === 'SampleOnOffSiteActual') {
      dte = new Date('2023-09-01')
    } else {
      dte = new Date('2024-09-01')
    }
    setDate(dte);
    fetchRack(dte);
  }, [Rpt]);

  const updateDate = (dte: Date) => {
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
      endPoint = process.env.NEXT_PUBLIC_API+`ScheduleActual/id/From/To?id=0&From=` + DateFormat(dte) +`&To=`+ DateFormat(todte);
    }
    else if (Rpt=='Projected')
    {
      endPoint = process.env.NEXT_PUBLIC_API+`ScheduleProjected/id/From/To?id=0&From=` + DateFormat(dte) +`&To=`+ DateFormat(todte);
    
    }
    else if (Rpt== `SampleOnOffSiteActual`)
    {
      endPoint = process.env.NEXT_PUBLIC_API+`SampleOnOffSiteActual/id/From/To?id=0&From=` + DateFormat(dte) +`&To=`+ DateFormat(todte);
    
    }
    else if (Rpt== `SampleOnOffSiteProjected`)
      {
        endPoint = process.env.NEXT_PUBLIC_API+`SampleOnOffSiteProjected/id/From/To?id=0&From=` + DateFormat(dte) +`&To=`+ DateFormat(todte);
      
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
    const json:ReportRow[]=await ee.json();
  
   if (json==null)
      {
        setEvents([]);
        return;
      }
    let myevent: EventObject[] = [];
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
    function addDays(date: Date, days: number): Date {
      let result = new Date(date);
      result.setDate(date.getDate() + days);
      return result;
  }

  const CustomToolbar = () => {
    return <div></div>; // Empty div to remove the toolbar
  };
  return (
    <div className="min-h-screen bg-gray-100">
       <Header/>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Schedule {Rpt} Report</h1>
        <Button variant="contained" onClick={(e)=>{e.preventDefault();updateDate(addDays(date,-30));}}><SkipPreviousIcon/></Button>
        {DateFormatYM(date)}
        <Button variant="contained" onClick={(e)=>{e.preventDefault();updateDate(addDays(date,30));}}><SkipNextIcon/></Button>
     

                <ExportAsExcel
                  data={data}
                  headers={["# Samples On Site", "Date"]}
                >
                  {(props) => (
                    <button {...props} className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                      <FileDownloadIcon className="mr-2" />
                      Export as Excel
                    </button>
                  )}
                </ExportAsExcel>
   
        <div className="space-x-2">
          <button
            className={`px-4 py-2 rounded ${diary ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setDiary(true)}
          >
            Diary
          </button>
          <button
            className={`px-4 py-2 rounded ${!diary ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setDiary(false)}
          >
            Table
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Circles
            height="80"
            width="80"
            color="#3B82F6"
            ariaLabel="circles-loading"
            visible={true}
          />
        </div>
      ) : (
        <>
          {diary ? (
            <Calendar
              selectable={true}
              onSelectSlot={(slot) => {
                console.log("slot select: ", slot);
              }}
              onSelectEvent={(eventObject) => {
                console.log('hyperlink');
                console.log(eventObject.id);
                const ideng = eventObject.id.toString().split("~");
                const link = "/ServiceJob?id=" + ideng[0].toString() + "&engid=" + ideng[1].toString();
                console.log(link);
                window.top?.location.replace(link);
              }}
              style={{ height: '600px', fontSize: '12px' }}
              defaultView='month'
              views={['month']}
              localizer={localizer}
              events={events}
              date={date}
              onNavigate={dte => {
                updateDate(dte);
              }}
              eventPropGetter={(events) => {
                const backgroundColor = events.colorEvento ? events.colorEvento : 'blue';
                const color = events.color ? events.color : 'white';
                return { style: { backgroundColor, color } }
              }}
                   components={{
        toolbar: CustomToolbar
      }}
            />
          ) : (
            <div>
              
              <DataTable
                columns={columns}
                data={data}
                fixedHeader
                pagination
                dense
                highlightOnHover
                customStyles={customStyles}
                conditionalRowStyles={conditionalRowStyles}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}