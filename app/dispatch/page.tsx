"use client"

import Header from '@/components/header'
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from 'react';
import Link from "next/link";
import { ArrowLeft, FileText, Brain, Send, Grid, BarChart2,FileSpreadsheet } from 'lucide-react'
import { getToken } from "@/msal/msal";
import DataTable from "react-data-table-component";

interface samplerow{
    Staff:string;
    Dte:Date;
    Description:string;
    FullReturn_ElsePart:boolean;
    ByRequest:boolean;
    ReexposureDate:Date;
    Comments:string;
    Status:string;
}
export default function Dispatch()
{    const searchParams = useSearchParams();
    const seriesname=searchParams!.get("seriesname");
    const id =parseInt( searchParams!.get("id")!);
    const [loading,setLoading] = useState(true);
    const [deleted,setDeleted] = useState(false);
    useEffect(() => {
        getalldata()
   
    } , []);
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
          when: (row:samplerow) => true,
          style:  (row:samplerow) => ({
            color: row.FullReturn_ElsePart?'red':'blue',
          })
        }
      ];
    const getalldata=async()=>{
        await fetchSample();
        setLoading(false);
    }
    const columns =[
        {
          name:'Staff',
          sortable: true,
          width: "60px",  
          wrap:true,  
          selector: (row:samplerow)=>row.Staff
        }/*,
        {
            name:'Date',
            sortable: true,
            width: "100px",  
            wrap:true,  
            selector: (row:samplerow)=>row.Dte
          }
          ,
          {
              name:'Description',
              sortable: true,
              width: "150px",  
              wrap:true,  
              selector: (row:samplerow)=>row.Description
            },
            {
                name:'Full Return',
                sortable: true,
                width: "130px",  
                wrap:true,  
                selector: (row:samplerow)=>row.FullReturn_ElsePart
              }
              ,
            {
                name:'Status',
                sortable: true,
                width: "130px",  
                wrap:true,  
                selector: (row:samplerow)=>row.Status
              }
              ,
            {
                name:'By Request',
                sortable: true,
                width: "130px",  
                wrap:true,  
                selector: (row:samplerow)=>row.ByRequest
              }
             ,
            {
                name:'ReexposureDate',
                sortable: true,
                width: "130px",  
                wrap:true,  
                selector: (row:samplerow)=>row.ReexposureDate
              },
              {
                  name:'Comments',
                  sortable: true,
                  width: "130px",  
                  wrap:true,  
                  
                    selector:  (row:samplerow)=>row.Comments
                  }*/
    ]
    const [results, setDataSample] = useState<samplerow[]>([]);
const fetchSample = async ()=>{
  
  setLoading(true);
  const urlSample = `https://allungawebapi.azurewebsites.net/api/dispatches/`+id;
  const token = await getToken()
  const headers = new Headers()
  const bearer = `Bearer ${token}`

  headers.append('Authorization', bearer)

  const options = {
    method: 'GET',
    headers: headers,
  }  
  const response = fetch(urlSample,options);
  var ee=await response;
  if (!ee.ok)
  {
    throw Error((ee).statusText);
  }
  const json=await ee.json();
  console.log(json);
  setDataSample(json);
  //setLoading(false);


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
            { href: `/seriestab?id=${id}&seriesname=${seriesname}`, icon: FileText, text: 'Details' },
            { href: `/samples?id=${id}&seriesname=${seriesname}`, icon: Send, text: 'Samples' },//Grain, 
            { href: `/reports?id=${id}&seriesname=${seriesname}`, icon: FileSpreadsheet, text: 'Reports' },
            { href: `/dispatch?id=${id}&seriesname=${seriesname}`, icon: Send, text: 'Dispatch', active: true },
            { href: `/reportparam?id=${id}&seriesname=${seriesname}`, icon: Grid, text: 'Params' },
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
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              
              <DataTable columns={columns}
        fixedHeader
        pagination
        dense
        customStyles={customStyles}        
        data={results}
        conditionalRowStyles={conditionalRowStyles} >
        </DataTable>
            </div>
          </div>
        )}
    
    </div>
    )
}