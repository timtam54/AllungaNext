"use client"
import { getToken } from "@/msal/msal";//, msalInstance
import Header from '@/components/header'
import moment from 'moment';
import { Circles } from 'react-loader-spinner'
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { useSearchParams } from "next/navigation";
import ClientSelect from '@/components/clientselect'
import { ChangeEvent, useEffect, useState } from "react";
import Link from "next/link";
import DataTable from "react-data-table-component";
 interface series{
  exposureType:string;
  rackNo:number;
  siteName:string;
  locked:boolean;//should be string todotim
  returnsReq:boolean;
  dateIn:Date;
  active:boolean;
  shortDescription:string;
  dateNextReturn:Date;
  equivalentSamples:number;
  cntSamplesOnSite:number;
  clientreference:string;
  allungaReference:string;
  seriesid:number;
  abbreviation:string;
  companyname:string;
  complete:boolean;
  dateNextReport:Date;
}
export default function Home() {
  //const user = msalInstance.getActiveAccount();
  const [actives,setActives] = useState(true);
  const [inactives,setInactives] = useState(false);
  const [fields,setFields] = useState("All");
  const [loading,setLoading] = useState(false);
  const [results,setResults] = useState<series[]>([]);
  const searchParams = useSearchParams();
  const cliid=searchParams!.get("clientid")??'-1';
  const [clientid,setClientID]=useState(parseInt(cliid));
  const cliname=searchParams!.get("clientname")??'';
  const [clientname,setClientName]=useState(cliname)
  
 const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    ssearch(actives,inactives,fields,parseInt(cliid));
  }, []);
  const [search,setSearch] = useState("");
  const ssearch = async (act:boolean,del:boolean,flds:string,clid:number) =>{  
    setLoading(true);
  
    const token = await getToken()
    console.log(token);
    const headers = new Headers()
    const bearer = `Bearer ${token}`
    headers.append('Authorization', bearer)
    const options = {
      method: 'GET',
      headers: headers,
    }
    var endPoint='';
  
    if (search=='')
      endPoint = `https://allungawebapicore.azurewebsites.net/api/Series/~/` + (act?`1`:`0`)+`/`+ (del?`1`:`0`)+`/`+flds+'/'+clid.toString();
    else
      endPoint = `https://allungawebapicore.azurewebsites.net/api/Series/`+search + `/` + (act?`1`:`0`)+`/`+ (del?`1`:`0`)+`/`+flds+'/'+clid.toString();
    console.log('endPoint:  '+endPoint);
    const response = fetch(endPoint,options);
    var ee=await response;
    //alert('ok:'+ee.ok);
    if (!ee.ok)
    {
      console.log('status:'+ee.statusText);
      return;
      ;//throw Error((ee).statusText);
    }
    const json=await ee.json();
    console.log(json);
    setResults(json);
    setIsOpen(true);
    setLoading(false);
  }
  const [fieldlist] = useState(["All","AllungaRef","BookPage","Client","ClientRef","Exposure"]);
  const handledel = (e:any) => {

    setActives(e.target.checked);
  
    ssearch(e.target.checked,inactives,fields,clientid);
  }

  const colourstyle = (active:boolean, complete:boolean,dteNextRpt:Date,dteNextRtrn:Date,CntSamplesOnSite:number,locked:Boolean) => 
    {
      const dte=new Date();
      if (active)
      {
        if (locked!=null)
        {
          return 'LockedSearch'
        }
        if (complete)
        {
          return 'CmpltSearch'
        }
        if (dteNextRpt!=null)
        {
        if (moment(dteNextRpt)<moment(dte))//,dteNextRtrn
        {
          return 'SearchOvrdu'
        }
      }
        if (dteNextRtrn!=null)
        {
        if (moment(dteNextRtrn)<moment(dte))//,dteNextRtrn
        {
          return 'SearchOvrdu'
        }
      }
        if (CntSamplesOnSite==0)//,dteNextRtrn
        {
          return 'SearchOffSite'
        }
        return 'SearchActive'
      }
      return 'SearchInactive'
    }
  const [sortedx,setsortedx]=useState("SeriesID");
  const handleinact= (e:any) => {

    setInactives(e.target.checked);
  
    ssearch(actives,e.target.checked,fields,clientid);
  }
  const handlefield= (e: ChangeEvent<HTMLSelectElement>) => {

    setFields(e.target.value);
  
    ssearch(actives,inactives,e.target.value,clientid);
  }
  const handleSearch = async (e:any)=>{

    e.preventDefault();
    
   ssearch(actives,inactives,fields,clientid);
  }
  const selectClient = (id:number,name:string)=>{
    setClientName(name);
    setClientID(id);
    ssearch(actives,inactives,fields,id);
  }
  
 

  const onDelete = async (id:number)=>{
    const confirm = {
      title: 'Delete',
      message: 'Are you sure you wish to delete this series',
      buttons: [
        {
          label: 'Yes',
          onClick: () => DeleteSeries(id)
        },
        {
          label: 'No',
          onClick: () => alert('Delete Cancelled')
        }
      ],
      closeOnEscape: true,
      closeOnClickOutside: true,
      keyCodeForClose: [8, 32],
      willUnmount: () => {},
      afterClose: () => {},
      onClickOutside: () => {},
      onKeypress: () => {},
      onKeypressEscape: () => {},
      overlayClassName: "overlay-custom-class-name"
    }; 
    alert(confirm);
  }

  const DeleteSeries = async (id:number)=>{
    setLoading(true);
    //const id='6048';
    const token = await getToken()
    const headers = new Headers()
    const bearer = `Bearer ${token}`
    headers.append('Authorization', bearer)
    const options = {
      method: 'DELETE',
      headers: headers,
    }
    const endPoint= `https://allungawebapi.azurewebsites.net/api/Series/`+id;
    
    const response = fetch(endPoint,options);
    var ee=await response;
    if (!ee.ok)
    {
      throw Error((ee).statusText);
    }
    const json=await ee.json();
    await ssearch(actives,inactives,fields,clientid);
    
    return false;
  }
  const conditionalRowStyles = [
    {
      when: (row:series) => true,
      style:  (row:series) => ({
        color: row.complete?'red':'blue',
      })
    }
  ];

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
  const columns =[
    {
      name:'Complete',
      sortable: true,
      width: "60px",  
      wrap:true,  
      selector: (row:series)=>row.complete
    }
    ,
    {
        name:'Company Name',
        sortable: true,
        width: "130px",    
        selector: (row:series)=>row.companyname,
        cell:   (row:series) => row.companyname    
    }
    ,
    {
        name:'Allunga Series',
        sortable: true,
        width: "130px",    
        selector:  (row:series)=>row.allungaReference,
        cell:   (row:series) =><Link href={{pathname:"/seriestab",query:{id:row.seriesid,seriesname:row.allungaReference}}}><u>{row.allungaReference}</u></Link>
        //href={{pathname:"/seriestab",  query:{id: result.seriesid,name:result.AllungaReference }}}
    } ,
    {
        name:'Client Series',
        sortable: true,
        width: "130px",    
        selector:  (row:series)=>row.clientreference,
        cell:   (row:series) => row.clientreference
    },
    {
        name:'Abbrev',
        sortable: true,
        width: "70px",    
        selector: (row:series) => row.abbreviation  ,
        cell:   (row:series) => row.abbreviation  
    },
    {
        name:'# Samples On Site',
        sortable: true,
        width: "60px",    
        selector:  (row:series)=>row.cntSamplesOnSite,
        cell:   (row:series) => row.cntSamplesOnSite  
    }
    ,
    {
        name:'Equiv Samples',
        sortable: true,
        width: "60px",    
        selector:  (row:series)=>row.equivalentSamples,
        cell:   (row:series) => row.equivalentSamples
    }
    ,
    {
        name:'Next Report',
        sortable: true,
        width: "100px",    
        selector:  (row:series)=>FormatDate(row.dateNextReport),
        cell:   (row:series) => FormatDate(row.dateNextReport)
    }
  ,
    {
        name:'Next Return',
        sortable: true,
        width: "100px",    
        selector:  (row:series)=>FormatDate(row.dateNextReturn),
        cell:   (row:series) => FormatDate(row.dateNextReturn)
    },
    {
        name:'Short Descriptions',
        sortable: true,
        width: "250px",    
        selector:  (row:series)=>row.shortDescription,
        cell:   (row:series) => row.shortDescription
    } ,
    {
        name:'Date In',
        sortable: true,
        width: "100px",    
        selector:  (row:series)=>FormatDate(row.dateIn),
        cell:   (row:series) => FormatDate(row.dateIn)
    },
    {
        name:'Active',
        sortable: true,
        width: "60px",    
        selector:  (row:series)=>row.active,
        cell:   (row:series) =><input type="checkbox" checked={row.active}/>
    } 
   ,
    {
        name:'Returns Req',
        sortable: true,
        width: "60px",    
        selector:  (row:series)=>row.returnsReq,
        cell:   (row:series) => <input type="checkbox" checked={row.returnsReq}/>
    } 
    ,
    {
        name:'Exposure',
        sortable: true,
        width: "110px",    
        selector:  (row:series)=>row.exposureType,
        cell:   (row:series) => row.exposureType
    } 
    ,
    {
        name:'Rack No',
        sortable: true,
        width: "80px",    
        selector:  (row:series)=>row.rackNo,
        cell:   (row:series) => row.rackNo
    } 
    ,
    {
        name:'Site Name',
        sortable: true,
        width: "120px",    
        selector:  (row:series)=>row.siteName,
        cell:   (row:series) => row.siteName
    } 
    ,
    {
        name:'Locked',
        sortable: true,
        width: "80px",    
        selector:  (row:series)=>row.locked,
        cell:   (row:series) =><input type="checkbox" checked={row.locked}/>
    } 
  ]

  const FormatDate=(date:any)=>  {
    if (date==null) return "";
   const dte= new Date(date);
    return dte.getFullYear().toString()+'-'+(dte.getMonth()+1).toString().padStart(2,'0')+'-'+(dte.getDate()).toString().padStart(2,'0');
  }
 const [clientModel,setClientModel]=useState(false);
  return (
   <>
   <Header/>
   {clientModel && <ClientSelect selectClient={selectClient} closeModal={()=>{setClientModel(false);}}  />}

    <div className="search">
  <form onSubmit={handleSearch}>
         <table style={{border:"0px",backgroundColor:'#944780',color:'white',width:'100%'}} >
       
         <tr>
            <td>
          <h3 style={{backgroundColor:'#944780',color:'white',fontSize:'24px'}}>Search Series</h3>
          </td>
          <td width={60}></td>
          <td><Link  title='Add New Series' href='/addseries'><AddIcon/></Link></td>
          <td>&nbsp;&nbsp;&nbsp;&nbsp;</td>

          <td>
          <select style={{color:'black'}}  name="Fields" onChange={handlefield}>
          {
          fieldlist.map((ep,i)=>{
            return (
              <option value={ep} selected={(ep==fields)?true:false} >{ep}</option>
            )})
          }
          </select>
      </td>
      <td>&nbsp;&nbsp;&nbsp;&nbsp;</td>
<td>
        <input style={{color:'black'}} type='text' placeholder="-Search Client/Series-" value={search} onChange={e=>setSearch(e.target.value)} />
        </td>
        <td><SearchIcon onClick={handleSearch} /></td>
        <td>
        <Button variant="contained" onClick={(e)=>{e.preventDefault(); setClientModel(true);}}>
        {(clientname=="")?"Client Filter":clientname}
          </Button>
          {(clientname=="")?<></>:<Button variant="outlined" onClick={(e)=>{e.preventDefault(); selectClient(-1,'');}}>
        X
          </Button>}
        </td>
        <td>
        <table border={1}>
            <tr>

        <th>
          Active
        </th>
        <td>
          <input type="CheckBox" onClick={handledel} checked={actives}></input>
          </td>
          </tr>
          <tr>

<th style={{backgroundColor:'black',color:'white'}} >
  Inactive
</th>
<td style={{backgroundColor:'black',color:'white'}} >
  <input type="CheckBox" onClick={handleinact} checked={inactives}></input>
  </td>
  </tr>
          </table>
        </td>
        <td>&nbsp;&nbsp;&nbsp;&nbsp;</td>
          <td style={{fontSize:'8'}}>
            <table border={1}>
              <tr>
              <td style={{backgroundColor:'rgb(247, 179, 147)',color:'black'}}><b>Return / Report overdue</b>
         </td>
         <td style={{backgroundColor:'yellow',color:'black'}}><b>Locked</b></td>
         <td rowSpan={2} style={{backgroundColor:'#aef3a8',color:'black'}} ><b>
          Return / Report<br/>Complete</b>
         </td>
       
              </tr>
              <tr>
              <td style={{backgroundColor:'rgb(243, 233, 233)',color:'black'}}><b>
          All Samples off site</b>
         </td><td style={{backgroundColor:'black',color:'white'}}><b>
         Inactive</b>
         </td>
              </tr>
            </table>
          </td>
        
              </tr>
        </table>
        <br/>
        </form>
        {loading ? 
          <div className="relative h-16">
  <div className="absolute p-4 text-center transform -translate-x-1/2 translate-y-1/2 border top-1/2 left-1/2">

     <Circles
     height="200"
     width="200"
     color="#944780"
     ariaLabel="circles-loading"
     wrapperStyle={{}}
     wrapperClass=""
     visible={true}
   />
   </div></div>
:
     
<DataTable  data={results}
columns={columns}
        
        pagination
        dense
        customStyles={customStyles}        
       
        conditionalRowStyles={conditionalRowStyles} >
        </DataTable>
      }
    </div>
</>

  );
}


