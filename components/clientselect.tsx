
import { getToken } from '@/msal/msal';
import Button from '@mui/material/Button';
import { ChangeEvent, useEffect, useState } from 'react';
import DataTable from "react-data-table-component";
import "@/components/part.css";
interface clientrow{
  clientid:number;   
  companyname:string;
  groupname:string;
  contactname:string;
  address:string;
  description:string;
  abbreviation:string;
  technicalphone:string;
  technicalemail:string;
  accountingcontact:string;
  accountingemail:string;
  lat:number;
  lon:number;
}

type Props = {
    closeModal:  () => void;
    selectClient: (id:number,name:string)=>void;
  }
  export default function ClientSelect({closeModal,selectClient}:Props)
{

  useEffect(() => {
    searchClient(search)

} , []);

const [search,setSearch] = useState("");
const [loading,setLoading] = useState(true);
const [results,setResults] = useState<clientrow[]>([]);
const handleSearch=async (event: ChangeEvent<HTMLInputElement>)=>
  {
    setSearch(event.target.value.toLowerCase());
  await  searchClient(event.target.value.toLowerCase());

  }
  
  const searchClient=async (sch:string)=>{
      setLoading(true);
      const token = await getToken()
      const headers = new Headers()
      const bearer = `Bearer ${token}`
    
      headers.append('Authorization', bearer)
    
      const options = {
        method: 'GET',
        headers: headers,
      }  
      const response = fetch(process.env.NEXT_PUBLIC_API+`Clients/`+((sch=='')?'~':sch),options);
      var ee=await response;
      console.log(ee)
      if (!ee.ok)
      {
        throw Error((ee).statusText);
      }
      const json:clientrow[]=await ee.json();
      console.log(json);
      setResults(json);
      
      setLoading(false);
    }

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
          width: "180px",  
          wrap:true,  
          selector: (row:clientrow)=>row.companyname,          
          cell: (row:clientrow) =><button onClick={(e)=>{e.preventDefault();selectClient(row.clientid, row.companyname);closeModal();}}><u>{row.companyname}</u></button>
      }
        ,
      {
          name:'GroupName',
          sortable: true,
          width: "120px",  
          wrap:true,  
          selector: (row:clientrow)=>row.groupname
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
            selector: (row:clientrow)=>row.address
          } ,
          {
              name:'Description',
              sortable: true,
              width: "320px",  
              wrap:true,  
              selector: (row:clientrow)=>row.description
            },
            {
                name:'Abbreviation',
                sortable: true,
                width: "90px",  
                wrap:true,  
                selector: (row:clientrow)=>row.abbreviation
              },
              {
                  name:'TechnicalPhone',
                  sortable: true,
                  width: "160px",  
                  wrap:true,  
                  selector: (row:clientrow)=>row.technicalphone
                }
                ,
              {
                  name:'TechnicalEmail',
                  sortable: true,
                  width: "160px",  
                  wrap:true,  
                  selector: (row:clientrow)=>row.technicalemail
                },
                {
                    name:'AccountingContact',
                    sortable: true,
                    width: "160px",  
                    wrap:true,  
                    selector: (row:clientrow)=>row.accountingcontact
                  },
                  {
                      name:'AccountingEmail',
                      sortable: true,
                      width: "160px",  
                      wrap:true,  
                      selector: (row:clientrow)=>row.accountingemail
                    }
     
  ]
    return <div className="modal-container">
    <div className="modal" style={{backgroundColor:'whitesmoke'}} >
  <h1 style={{fontSize:'24px',fontWeight:'bold'}}>Select Client</h1>
  <Button type="submit" variant="outlined" onClick={(e)=>{e.preventDefault();closeModal()}}>Close</Button>
  <DataTable style={{height:'400px'}} columns={columns}
        fixedHeader
        pagination
        dense
        customStyles={customStyles}        
        data={results}
        conditionalRowStyles={conditionalRowStyles} >
        </DataTable>
    </div>
    </div>
}
