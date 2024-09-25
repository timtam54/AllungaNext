"use client"
import { getToken } from "@/msal/msal";
import { Download } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ExportAsExcel } from "react-export-table";

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
    Readingid:number, Paramid:number,sampleid:number,value:number}
    
  interface Params{

    ParamID:number,
    ParamName:string;
    Ordering?:number;
  }
export default function ReportTab() {
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const reportidx=(parseInt(searchParams.get("id")!));//.id
    useEffect(() => {
        getData(reportidx);
    })

    const getData = async (rptid:number) => {
        setLoading(true);//loading=true;//
      if (dataParam.length>0)
      {
        return;
      }

      await fetchData(rptid);
       setLoading(false);//loading=false;//
    }
    const [dataSample, setDataSample] = useState<Sample[]>([]);
    const [dataComments, setDataComments] = useState<Comments[]>([]);
      const [dataReading, setDataReading] = useState<Reading[]>([]);
      const [dataParam, setDataParam] = useState<Params[]>([]);

      const fetchData = async (rptid:number) => {
        const urlParam = `https://allungawebapi.azurewebsites.net/api/Params/int/` + rptid.toString();
        const token = await getToken()
        const headers = new Headers()
        const bearer = `Bearer ${token}`
        headers.append('Authorization', bearer)
        const options = {
          method: 'GET',
          headers: headers,
        }
        const response = fetch(urlParam, options);
        var ee = await response;
        if (!ee.ok) {
          throw Error((ee).statusText);
        }
        const params:Params[] = await ee.json();
        setDataParam(params);

        const urlSample = `https://allungawebapi.azurewebsites.net/api/Samples/report/` + rptid;

      const resp = fetch(urlSample, options);
      var ee = await resp;
      if (!ee.ok) {
        throw Error((ee).statusText);
      }
      const sample:Sample[] = await ee.json();
      setDataSample(sample);
      const urlCom= `https://allungawebapi.azurewebsites.net/api/Comments/` + rptid.toString(); 
      const responsec = fetch(urlCom, options);
      var ee = await responsec;
      if (!ee.ok) {
        throw Error((ee).statusText);
      }
      const comments = await ee.json();
      setDataComments(comments);

    const urlReading = `https://allungawebapi.azurewebsites.net/api/Readings/` + rptid.toString();
   
    const responseR = fetch(urlReading, options);
    var ee = await responseR;
   
    const readings = await ee.json();
    setDataReading(readings);

         createData(params,sample,comments,readings);
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

      const [rows,setRows]= useState<any[]>([]);
      const [headers,setHeaders]  = useState<string[]>([]);

      const createData= (params:Params[],samples:Sample[],comments:Comments[],readings:Reading[])=>
      {

        if (headers.length>0)
          return;

        headers.push("Sample No");
        headers.push("Sample Name");
        headers.push("Comments"); 
        params//.sort((a:Params, b:Params) => a.Ordering > b.Ordering)
        .forEach((element:Params) => {
          headers.push( element.ParamName );
        });

    samples.forEach((elementSample:Sample) => {
      const row = [];

      row.push(elementSample.Number);
      row.push(elementSample.description);
      row.push(XGetComments(elementSample.SampleID,comments)); 
      params//.sort((a:Params, b:Params) => a.Ordering > b.Ordering)
        .forEach((element:Params) => {
          row.push( XGetReading(element.ParamID, elementSample.SampleID,readings) );
        });
        rows.push(row);
    });      
    
        setLoading(false);
        setHeaders(headers);
        console.table(headers);
        setRows(rows);
      }
      const GetComments=(SampleID:number)=>{
        var xx = dataComments.filter((i) => i.SampleID === SampleID);
        if (xx.length > 0) {
          return xx[0].Comment;// '2';
        }
        return '';
      }
      const GetReading = (ParamID:number, SampleID:number) => {
        var xx = dataReading.filter((i) => i.Paramid === ParamID && i.sampleid === SampleID);

        if (xx.length > 0) {
          return xx[0].value;// '2';
        }
        return '';
      }

      const handleChangeComments=(e:any)=>{
        const xx = e.target.name.split('~');
       
        const sid = Number(xx[1]);
        const temp = [...dataComments];
        var dd = temp.find(i => i.SampleID == sid);
        if (dd==null)
        {
          let aa= {SampleID:sid,Comment:e.target.value,ReportID:reportidx};
          setDataComments([...temp,aa]);
        }
        else
        {
        dd.Comment = e.target.value;
    
        setDataComments([...temp]);
        }
        
      }
      return (
        <>
        <table id="table1" >
              <tr>
                <th><b>Sample No</b></th>
                <th><b>Sample Name</b></th>
                <th><b>Comments</b></th>
                {
                  dataParam//.sort((a, b) => a.Ordering > b.Ordering)
                  .map((result, i) => {
                    return (
                      <th key={i} style={{ width: `30px` }}><b>{result.ParamName}</b></th>
                    )
                  })
                }
              </tr>
              {
                dataSample//.sort((a, b) => a.SampleOrder > b.SampleOrder)
                .map((result, i) => {
                  return (
                    <tr key={i} >
                      <td>{result.Number}</td>
                      <td>{result.description}</td>
                      <td key={i} >
                              <input type="text" name={'Comments~' + result.SampleID} onChange={handleChangeComments} value={GetComments(result.SampleID)} />


                            </td>
                      {
                        dataParam//.sort((a, b) => a.Ordering > b.Ordering)
                        .map((paramresult, i) => {
                          return (
                            <td key={i} >
                              <input type="text" name={paramresult.ParamID  + '~' + result.SampleID} value={GetReading(paramresult.ParamID, result.SampleID)} />


                            </td>
                          )
                        })
                      }
                    </tr>
                  )
                })
              }
             
            </table>


 

                <ExportAsExcel 
                  data={rows}
                  headers={headers}
                >
                  {(props) => (
                    <button
                      {...props}
                      className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Export as Excel
                    </button>
                  )}
                </ExportAsExcel>

</>
      )
}