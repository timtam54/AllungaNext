"use client"
import Header from "@/components/header";
import { getToken } from "@/msal/msal";
import { useEffect, useState } from "react";
import DataTable , { createTheme }from "react-data-table-component";
import ExposureType from '@/components/ExposureType'
interface exposuretyperow
{
    ExposureTypeID:number;
    Description:string;
    SortOrder:number;
}

export default function exposuretype()
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
        const response = fetch(`https://allungawebapi.azurewebsites.net/api/ExposureTypes/`,options);
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
            color: row.ExposureTypeID==0?'red':'blue',
          })
        }
      ];
      const [etid,setEtid]=useState(0);
    const columns =[
        {
          name:'id',
          sortable: true,
          width: "60px",  
          wrap:true,  
          selector: (row:exposuretyperow)=>row.ExposureTypeID
        },
        {
            name:'Description',
            sortable: true,
            width: "300px",  
            wrap:true,  
            selector: (row:exposuretyperow)=>row.Description,
            cell: (row:exposuretyperow) =><button onClick={(e)=>{
              e.preventDefault();
               setEtid(row.ExposureTypeID); 
              setModelOpen(true);
              
            }}><u>{row.Description}</u></button> ,
          }
          ,
        {
            name:'Order',
            sortable: true,
            width: "160px",  
            wrap:true,  
            selector: (row:exposuretyperow)=>row.SortOrder
          }
        ]

        const [modelOpen,setModelOpen]=useState(false);
        return (
            <>
           
            <Header/>
            <h1 style={{fontSize:"22px"}}>Exposure Types</h1>
              <DataTable columns={columns}
              fixedHeader
              pagination
              dense
              customStyles={customStyles}        
              data={results}
              conditionalRowStyles={conditionalRowStyles} >
              </DataTable>

              {modelOpen && <ExposureType exposuretypeid={etid} closeModal={()=>{setModelOpen(false);getexptype()}} />}
       

              </>
          )
}