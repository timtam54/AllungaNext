"use client"

import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { ExportAsExcel } from "react-export-table";
import BorderAllIcon from '@mui/icons-material/BorderAll';
interface Sample {
    SampleOrder: number;
    Number:number;
    description:string;
    SampleID:number;
  }
  interface Comments{
    SampleID:number,
    Comment:string,
    ReportID:number
  }
  interface Reading{
    Readingid:number, 
    Paramid:number,
    sampleid:number,
    value:string,
    reportid:number,
    deleted:boolean
}
    
  interface Params{
    ParamID:number,
    ParamName:string;
    Ordering?:number;
  }
  interface Props{
    params:Params[];
    samples:Sample[];
    comments:Comments[];
    readings:Reading[];
}
export default function ExcelReadings({params,samples,comments,readings}:Props)
{
   

      const [rows,setRows]= useState<any[]>([]);
      const [headers,setHeaders]  = useState<string[]>([]);
      useEffect(() => { createData() } ,[]);
      
      const createData= ()=>
      {
        if (headers.length>0)
          return; 
      
        setHeaders([]);
        const hdrs:string[]=[];  
        hdrs.push("Sample No");
        hdrs.push("Sample Name");
        hdrs.push("Comments"); 
        params//.sort((a:Params, b:Params) => a.Ordering > b.Ordering)
        .forEach((element:Params) => {
            hdrs.push( element.ParamName );
        });
      setHeaders(hdrs);
      setRows([]);
      const xrows: any[] = createExcelRows(samples, XGetComments, comments, params, XGetReading, readings);      
        
        setRows(xrows);
        console.table(headers);
}

    return <ExportAsExcel 
                  data={rows}
                  headers={headers}
                >
                  {(props) => (
                    <button
                      {...props}
                      className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                    > <BorderAllIcon className="mr-2" />
                      <Download className="w-5 h-5 mr-2" />
                      Export as Excel
                    </button>
                  )}
                </ExportAsExcel>
}

function createExcelRows(samples: Sample[], XGetComments: (SampleID: number, comments: Comments[]) => string, comments: Comments[], params: Params[], XGetReading: (ParamID: number, SampleID: number, reading: Reading[]) => string, readings: Reading[]) {
  const xrows: any[] = [];
  samples.forEach((elementSample: Sample) => {
    const row = [];
    row.push(elementSample.Number);
    row.push(elementSample.description);
    row.push(XGetComments(elementSample.SampleID, comments));
    params //.sort((a:Params, b:Params) => a.Ordering > b.Ordering)
      .forEach((element: Params) => {
        row.push(XGetReading(element.ParamID, elementSample.SampleID, readings));
      });
    xrows.push(row);
  });
  return xrows;
}

const XGetComments=(SampleID:number,comments:Comments[])=>{
  var xx = comments.filter((i) => i.SampleID === SampleID);
  if (xx.length > 0) {
    return xx[0].Comment;// '2';
  }
  return '';
}
const XGetReading = (ParamID:number, SampleID:number,reading:Reading[]) => {
  var xx = reading.filter((i) => i.Paramid === ParamID && i.sampleid === SampleID);

  if (xx.length > 0) {
    return xx[0].value;// '2';
  }
  return '';
}