"use client"
import Header from "@/components/header";
import { getToken } from "@/msal/msal";
import { useEffect, useState } from "react";
import DataTable , { createTheme }from "react-data-table-component";
import Param from "@/components/Param";
import { Circles } from 'react-loader-spinner';
interface exposuretyperow
{
  ParamID:number;
  ParamName:string;
  ValueRange:string;
  EquivalentValues:string;
  Ordering:number;
  Unit:string;
  VisualNoReadings:string;
}

export default function parameters()
{
    useEffect(() => {
        getexptype()
   
    } , []);

    const [loading,setLoading] = useState(false);
    const [results,setResults] = useState<exposuretyperow[]>([]);


    const getexptype=async ()=>{
        setLoading(true);
        const token = await getToken()
        const headers = new Headers()
        const bearer = `Bearer ${token}`
      
        headers.append('Authorization', bearer)
      
        const options = {
          method: 'GET',
          headers: headers,
        }  
        const response = await fetch(`https://allungawebapi.azurewebsites.net/api/Params/`,options);
        var ee=await response;
        if (!ee.ok)
        {
          throw Error((ee).statusText);
        }
        const json=await ee.json();
        console.log(json);
        setResults(json);
        setLoading(false);
      }

     /* const customStyles = {
        noData: {
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          },
        },
        rows: {
          style: {
            zIndex: 2,
            minHeight: '30px !important', // override the row height
            fontSize: '14px',
            whiteSpace: 'pre',
          },
        },
        table: {
          style: {
            zIndex: 1,
          },
        },
        headRow: {
          style: {
            minHeight: '40px',
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderBottomWidth: '2px',
          },
        },
        headCells: {
          style: {
            fontSize: '16px',
            justifyContent: 'left',
            wordWrap: 'breakWord',
          },
        },
        subHeader: {
          style: {
            minHeight: '40px',
          },
        },
        pagination: {
          style: {
            minHeight: '40px',
          },
          pageButtonsStyle: {
            borderRadius: '50%',
            height: '40px',
            width: '40px',
            padding: '8px',
            margin: 'px',
            cursor: 'pointer',
          },
        },
      };*/
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
          when: (row:exposuretyperow) => true,
          style:  (row:exposuretyperow) => ({
            color: row.ParamID==0?'red':'blue',
          })
        }
      ];
      //const [etid,setEtid]=useState(0);
    const columns =[
        {
          name:'id',
          sortable: true,
          width: "60px",  
          wrap:true,  
          selector: (row:exposuretyperow)=>row.ParamID
        },
        {
            name:'Name',
            sortable: true,
            width: "300px",  
            wrap:true,  
            selector: (row:exposuretyperow)=>row.ParamName,
            cell: (row:exposuretyperow) =><button onClick={(e)=>{
              e.preventDefault();
              setParamID(row.ParamID); 
              setModelOpen(true);
              
            }}><u>{row.ParamName}</u></button> ,
          }
          ,
        {
            name:'Unit',
            sortable: true,
            width: "160px",  
            wrap:true,  
            selector: (row:exposuretyperow)=>row.Unit
          }
          ,
        {
            name:'ValueRange',
            sortable: true,
            width: "160px",  
            wrap:true,  
            selector: (row:exposuretyperow)=>row.ValueRange
          }
          ,
        {
            name:'Value Range',
            sortable: true,
            width: "160px",  
            wrap:true,  
            selector: (row:exposuretyperow)=>row.ValueRange
          }
          ,
        {
            name:'Equivalent Values',
            sortable: true,
            width: "160px",  
            wrap:true,  
            selector: (row:exposuretyperow)=>row.EquivalentValues
          }
          ,
        {
            name:'Ordering',
            sortable: true,
            width: "160px",  
            wrap:true,  
            selector: (row:exposuretyperow)=>row.Ordering
          }
          ,
        {
            name:'Visual No Readings',
            sortable: true,
            width: "160px",  
            wrap:true,  
            selector: (row:exposuretyperow)=>row.VisualNoReadings
          }
        ]
        const [ParamID,setParamID]=useState(0);
        const [modelOpen,setModelOpen]=useState(false);
        return (
          <body style={{backgroundColor:'whitesmoke'}}>
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
            <Header/>
            {modelOpen && <Param ParamID={ParamID} closeModal={()=>{setModelOpen(false)}}/>}
      
            <h1 style={{fontSize:"22px"}}>Exposure Types</h1>
              <DataTable columns={columns}
              fixedHeader
              pagination
              dense
              customStyles={customStyles}        
              data={results}
              conditionalRowStyles={conditionalRowStyles} >
              </DataTable>

             

              </>
}
</body>
          )
}