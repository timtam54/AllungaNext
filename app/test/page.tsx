"use client"
import { useEffect, useState } from "react";
import { getToken } from "@/msal/msal";
import { ExportAsExcel, ExportAsPdf, CopyToClipboard, CopyTextToClipboard, PrintDocument, ExcelToJsonConverter, FileUpload } from "react-export-table";

interface rackrptrow{
    SeriesID:number;
    RackNo:string;
    Samples:string;
    ClientReference:string;
    AllungaReference:string;
    ClientName:string;
    ClientID:number;
  }

export default function Test() {
    useEffect(() => {
        fetchRack();
       }, []);
       const [data, setDataSample] =useState<rackrptrow[]>([]);
       
       const fetchRack = async ()=>{   
        const endPoint =`https://allungawebapi.azurewebsites.net/api/Rprts/Rack/`
        const token = await getToken()
        const headers = new Headers()
        const bearer = `Bearer ${token}`
        headers.append('Authorization', bearer)
        const options = {
          method: 'GET',
          headers: headers,
        }  
        const response = fetch(endPoint,options);
        var ee=await response;
        if (!ee.ok)
        {
          throw Error((ee).statusText);
        }
        const json=await ee.json();
        console.log(json);
        setDataSample(json);
        setLoading(false);
        }
        const [loading,setLoading] = useState(true);
    return (
      <>
        <ExportAsExcel
    data={data}
    headers={["SeriesID", "RackNo", "Samples","ClientReference", "AllungaReference", "ClientName", "ClientID"]}
    
>
{(props)=> (
      <button {...props}>
        Export as Excel
      </button>
    )}
</ExportAsExcel>
<ExportAsPdf
    data={data}
    headers={["SeriesID", "RackNo", "Samples","ClientReference", "AllungaReference", "ClientName", "ClientID"]}
        headerStyles={{ fillColor: "red" }}
    title="Sections List"
>
{(props)=> (
      <button {...props}>
        Export as Pdf
      </button>
    )}
</ExportAsPdf>
</>
    )
}