"use client"
import Header from "@/components/header";
import { getToken } from "@/msal/msal";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
interface clientrow{
    clientid:number;   
    companyname:string;
    GroupName:string;
    contactname:string;
    Address:string;
    Description:string;
    Abbreviation:string;
    TechnicalPhone:string;
    TechnicalEmail:string;
    AccountingContact:string;
    AccountingEmail:string;
}
export default function clientsearch()
{
    useEffect(() => {
        searchClient()
   
    } , []);
    const [loading,setLoading] = useState(false);
    const [search,setSearch] = useState("");
    const [results,setResults] = useState<clientrow[]>([]);
    const handleSearch = async (e:any)=>{

        e.preventDefault();
        if (search == '')
        { setSearch('~');
      }
    }

    const searchClient=async ()=>{
        setLoading(true);
        const token = await getToken()
        const headers = new Headers()
        const bearer = `Bearer ${token}`
      
        headers.append('Authorization', bearer)
      
        const options = {
          method: 'GET',
          headers: headers,
        }  
        const response = fetch(`https://allungawebapi.azurewebsites.net/api/Clients/`+search,options);
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

    const customStyles = {
        headCells: {
          style: {
            paddingLeft: '4px', // override the cell padding for head cells
            paddingRight: '4px',
            size:'12px',
          },
          
        },
        cells: {
          style: {
            paddingLeft: '4px', // override the cell padding for data cells
            paddingRight: '4px',
            
          },
        },
      }
    const conditionalRowStyles = [
        {
          when: (row:clientrow) => true,
          style:  (row:clientrow) => ({
            color: row.clientid==0?'red':'blue',
          })
        }
      ];
    const columns =[
        {
          name:'id',
          sortable: true,
          width: "60px",  
          wrap:true,  
          selector: (row:clientrow)=>row.clientid
        },
        {
            name:'Name',
            sortable: true,
            width: "60px",  
            wrap:true,  
            selector: (row:clientrow)=>row.companyname
          }
          ,
        {
            name:'GroupName',
            sortable: true,
            width: "160px",  
            wrap:true,  
            selector: (row:clientrow)=>row.GroupName
          }
          ,
        {
            name:'contactname',
            sortable: true,
            width: "160px",  
            wrap:true,  
            selector: (row:clientrow)=>row.contactname
          } ,
          {
              name:'Address',
              sortable: true,
              width: "160px",  
              wrap:true,  
              selector: (row:clientrow)=>row.Address
            } ,
            {
                name:'Description',
                sortable: true,
                width: "160px",  
                wrap:true,  
                selector: (row:clientrow)=>row.Description
              },
              {
                  name:'Abbreviation',
                  sortable: true,
                  width: "160px",  
                  wrap:true,  
                  selector: (row:clientrow)=>row.Abbreviation
                },
                {
                    name:'TechnicalPhone',
                    sortable: true,
                    width: "160px",  
                    wrap:true,  
                    selector: (row:clientrow)=>row.TechnicalPhone
                  }
                  ,
                {
                    name:'TechnicalEmail',
                    sortable: true,
                    width: "160px",  
                    wrap:true,  
                    selector: (row:clientrow)=>row.TechnicalEmail
                  },
                  {
                      name:'AccountingContact',
                      sortable: true,
                      width: "160px",  
                      wrap:true,  
                      selector: (row:clientrow)=>row.AccountingContact
                    },
                    {
                        name:'AccountingEmail',
                        sortable: true,
                        width: "160px",  
                        wrap:true,  
                        selector: (row:clientrow)=>row.AccountingEmail
                      }
          /*
          
   
    
    :string;
    :string;
    :string;*/
    ]

    return (
      <>
      <Header/>
        <DataTable columns={columns}
        fixedHeader
        pagination
        dense
        customStyles={customStyles}        
        data={results}
        conditionalRowStyles={conditionalRowStyles} >
        </DataTable>
        </>
    )
}