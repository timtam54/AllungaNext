"use client"
import "@/components/part.css";
import React, { useState, useEffect, Component } from "react";
import DataTable from "react-data-table-component";
import { Circles } from 'react-loader-spinner'
import { getToken } from "@/msal/msal";
import { ExportAsExcel, ExportAsPdf, CopyToClipboard, CopyTextToClipboard, PrintDocument, ExcelToJsonConverter, FileUpload } from "react-export-table";
import Button from '@mui/material/Button';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
interface rackrptrow{
  SeriesID:number;
  RackNo:string;
  Samples:string;
  ClientReference:string;
  AllungaReference:string;
  ClientName:string;
  ClientID:number;
}

type Props = {
  closeModal:  () => void;
}
function RptRack({closeModal}:Props) {
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
      //when: (row:rackrptrow) => true,
      when: (row:rackrptrow) => true,
      //style:  (row:rackrptrow) => ({
        style:  (row:rackrptrow) => ({
          color: row.SeriesID==0?'navy':'red',
      })
    }
  ];
  
const columns =[
    {
      name:'Series ID',
      sortable: true,
      width: "60px",  
      wrap:true,  
      selector: (row:rackrptrow)=>row.SeriesID
    } ,
    {
        name:'Rack No',
        sortable: true,
        width: "100px",  
        wrap:true,  
        selector: (row:rackrptrow)=>row.RackNo,

        cell: (row:rackrptrow) =><button onClick={(e)=>{
          e.preventDefault();
         //  setSampID(row.SampleID); 
       //   setModalOpen(true);
          
        }}><u>{row.RackNo}</u></button> ,
    
        } ,
        {
          name:'Samples',
          sortable: true,
          width: "160px",  
          wrap:true,  
          selector: (row:rackrptrow)=>row.Samples
        } ,
        {
          name:'ClientReference',
          sortable: true,
          width: "160px",  
          wrap:true,  
          selector:(row:rackrptrow)=>row.ClientReference
        } 
      ]
     
  useEffect(() => {
    

   fetchRack();
  }, []);
  //const urlSample = `https://allungawebapi.azurewebsites.net/api/SeriesNextEvent?from=2000-01-01&to=2010-01-01`+`/`;

 

  const [data, setDataSample] =useState<rackrptrow[]>([]);
  const tableData = {
    columns,
    data,
  };
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


  return (
   

<div className="modal-container">
    <div className="modal" style={{backgroundColor:'whitesmoke'}} >
<h1 style={{fontSize:'24px',fontWeight:'bold'}}>Rack Report</h1>


<Button type="submit" variant="outlined" onClick={(e)=>{e.preventDefault();closeModal()}}>Close</Button>
{loading ? 
     
     <div className="relative h-16" style={{backgroundColor:'whitesmoke'}}>
     <div style={{backgroundColor:'whitesmoke'}} className="absolute p-4 text-center transform -translate-x-1/2 translate-y-1/2 border top-1/2 left-1/2">
    
         <Circles 
         height="200"
         width="200"
         color="#944780"
         ariaLabel="circles-loading"
         wrapperStyle={{}}
         wrapperClass=""
         visible={true}
       />
       </div> </div>
:
 
<>  <ExportAsExcel
    data={data}
    headers={["SeriesID", "RackNo", "Samples","ClientReference", "AllungaReference", "ClientName", "ClientID"]}
    
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
</div>
</div>


);

}
export default RptRack
/*
        <DataTableExtensions
        {...tableData}
      >  </DataTableExtensions>*/

/*<Link
  to={"/client"}
  state={{id: result.ClientID}}>{result.ClientName}</Link>
  
<td> <Link
  to={"/seriestab"}
  state={{id: result.SeriesID}}>{result.AllungaReference}</Link>
  </td>*/

  /*
  <table style={{width:"100%"}} id="table1">
  
  <tr>
  <th>Client </th>
    <th>Allunga Reference</th>
    
    <th>Client Reference</th>
    <th>Samples</th>
    <th>Rack</th>

  </tr>
  
  {
    dataSample.map((result,i)=>{
      return (
        <tr className='result' key={i} >
          <td>{result.ClientName}</td>
  
          <td> {result.AllungaReference}</td>
          <td>{result.ClientReference}</td>
        
          <td> {result.Samples}</td>
  
   <td> {result.RackNo}</td>
         </tr>  
      )
    })
  }
</table>*/