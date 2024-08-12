"use client"
import Header from "@/components/header";
import { getToken } from "@/msal/msal";
import { ChangeEvent, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Client from '@/components/Client'
import { GoogleMap, InfoBox, LoadScript, Marker } from '@react-google-maps/api';
import Button from '@mui/material/Button';
import MapIcon from '@mui/icons-material/Map';
import GridOnIcon from '@mui/icons-material/GridOn';
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
interface latlon{
  lat:number;
  lng:number;
  title:string;
}
export default function clientsearch()
{
    useEffect(() => {
        searchClient(search)
   
    } , []);
    
    const [search,setSearch] = useState("");
    const [loading,setLoading] = useState(true);
    const [results,setResults] = useState<clientrow[]>([]);
   
    
        const containerStyle = {
          width: '100%',
          height: '600px'
        };
        const [modelOpen,setModelOpen]=useState(false);
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
        const response = fetch(`https://allungawebapicore.azurewebsites.net/api/Clients/`+((sch=='')?'~':sch),options);
        var ee=await response;
        console.log(ee)
        if (!ee.ok)
        {
          throw Error((ee).statusText);
        }
        const json:clientrow[]=await ee.json();
        console.log(json);
        setResults(json);
        await SetLocsLatLon(json);
        setLoading(false);
      }

      const [center,setCenter] = useState<latlon>();
      const [locations,setLocations] = useState<latlon[]>([]); 
      const SetLocsLatLon=async (jbs:clientrow[])=>
        {
          let unique:latlon[] = [];
          let glocs:latlon[] = [];
          
          let sumlat=0;
          let sumlon=0;
          let cnt=0;
          jbs.forEach((element:clientrow) => {
          
            glocs.push({lat: element.lat, lng:  element.lon,title:element.companyname})

              const el:latlon={lat:element.lat,lng:element.lon,title:element.companyname };

                if (unique.filter(i=>i.title==element.companyname).length==0)
                {

                  unique.push(el);
                  if (el.lat!=null && el.lng!=null)
                    {
                  sumlat+=el.lat;
                  console.log(el.lat);
                  sumlon+=el.lng;
           
                  cnt+=1;
                    }
                }     
          });
          setLocations(glocs);
          const lati=sumlat/cnt;
          console.log('avg lat:'+lati.toString());
          const loni=sumlon/cnt;
          console.log('avg lon:'+loni.toString());
          setCenter({lat:lati,lng:loni,title:'center'});
        }

      const DateFormat=(date:any)=>  {
        if (date==null) return "";
       const dte= new Date(date);
        return dte.getFullYear().toString()+'-'+(dte.getMonth()+1).toString().padStart(2,'0')+'-'+(dte.getDate()).toString().padStart(2,'0');
      }
      const [cliid,setCliID]=useState(0);
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
            cell: (row:clientrow) =><a href={"/client?id="+row.clientid.toString()} target="new"><u>{row.companyname}</u></a>
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
    const [grid,setGrid]=useState(true);
    return (
      <>
      <Header/>
      {modelOpen && <Client clientid={cliid} closeModal={()=>{setModelOpen(false);}} />}
      
      <div style={{alignItems: 'center',display:'flex',backgroundColor:'#944780'}}>
        <h1 style={{fontSize:"22px"}}><b style={{color:'white'}}>Clients</b></h1>
        <input type="text" onChange={handleSearch} value={search}/>
        <Button style={{backgroundColor:grid?'yellow':'white',color:'#0690B1'}} variant="outlined" onClick={(e)=>{e.preventDefault();setGrid(true)}}><GridOnIcon/>Grid</Button>
    <Button style={{backgroundColor:grid?'white':'yellow',color:'#0690B1'}} variant="outlined" onClick={(e)=>{e.preventDefault();setGrid(false)}}><MapIcon/>Map</Button>
  </div>

  
  {grid && <DataTable columns={columns}
        fixedHeader
        pagination
        dense
        customStyles={customStyles}        
        data={results}
        conditionalRowStyles={conditionalRowStyles} >
        </DataTable>}
        {!grid && 
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API!}>
      <GoogleMap 
        mapContainerStyle={containerStyle}
        center={center}
        zoom={5}>
 {locations.map((location, index) => (
          <Marker key={index} title={location.title} position={location} clickable={true} draggable={true}  />
        ))}
      </GoogleMap>
    </LoadScript>}
        
        </>
    )
}

