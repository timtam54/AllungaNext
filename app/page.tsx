"use client"
import { getToken } from "@/msal/msal";//, msalInstance
import Header from '@/components/header'
import moment from 'moment';
import { Circles } from 'react-loader-spinner'
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RptRack from "@/components/RptRack"; 

import { ChangeEvent, useEffect, useState } from "react";
import Link from "next/link";
import DataTable from "react-data-table-component";
 interface series{
  ExposureType:string;
  RackNo:number;
  SiteName:string;
  Locked:boolean;
  ReturnsReq:boolean;
  DateIn:Date;
  Active:boolean;
  ShortDescription:string;
  DateNextReturn:Date;
  EquivalentSamples:number;
  CntSamplesOnSite:number;
  clientreference:string;
  AllungaReference:string;
  seriesid:number;
  Abbreviation:string;
  companyname:string;
  Complete:boolean;
  DateNextReport:Date;
}
export default function Home() {
  //const user = msalInstance.getActiveAccount();
  const [actives,setActives] = useState(true);
  const [inactives,setInactives] = useState(false);
  const [fields,setFields] = useState("All");
  const [loading,setLoading] = useState(false);
  const [results,setResults] = useState<series[]>([]);
  
 const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    ssearch(actives,inactives,fields);
  }, []);
  const [search,setSearch] = useState("");
  const ssearch = async (act:boolean,del:boolean,flds:string) =>{  
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
      endPoint = `https://allungawebapi.azurewebsites.net/api/Series/~,` + (act?`1`:`0`)+`,`+ (del?`1`:`0`)+`,`+flds;
    else
      endPoint = `https://allungawebapi.azurewebsites.net/api/Series/`+search + `,` + (act?`1`:`0`)+`,`+ (del?`1`:`0`)+`,`+flds;
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
  
    ssearch(e.target.checked,inactives,fields);
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
  
    ssearch(actives,e.target.checked,fields);
  }
  const handlefield= (e: ChangeEvent<HTMLSelectElement>) => {

    setFields(e.target.value);
  
    ssearch(actives,inactives,e.target.value);
  }
  const handleSearch = async (e:any)=>{

    e.preventDefault();
    
   ssearch(actives,inactives,fields);
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
    await ssearch(actives,inactives,fields);
    
    return false;
  }
  const conditionalRowStyles = [
    {
      when: (row:series) => true,
      style:  (row:series) => ({
        color: row.Complete?'red':'blue',
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
      selector: (row:series)=>row.Complete
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
        name:'Code',
        sortable: true,
        width: "70px",    
        selector: (row:series) => row.Abbreviation  ,
        cell:   (row:series) => row.Abbreviation  
    },
    {
        name:'Allunga Series',
        sortable: true,
        width: "130px",    
        selector:  (row:series)=>row.AllungaReference,
        cell:   (row:series) =><Link href={{pathname:"/seriestab",query:{id:row.seriesid,seriesname:row.AllungaReference}}}><u>{row.AllungaReference}</u></Link>
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
        name:'No of Samples On Site',
        sortable: true,
        width: "130px",    
        selector:  (row:series)=>row.CntSamplesOnSite,
        cell:   (row:series) => row.CntSamplesOnSite  
    }
    ,
    {
        name:'Equiv Samples',
        sortable: true,
        width: "130px",    
        selector:  (row:series)=>row.EquivalentSamples,
        cell:   (row:series) => row.EquivalentSamples
    }/*
    ,
    {
        name:'Next Report',
        sortable: true,
        width: "130px",    
        selector:  (row:series)=>row.DateNextReport,
        cell:   (row:series) => FormatDate(row.DateNextReport)
    }
    ,
    {
        name:'Next Return',
        sortable: true,
        width: "130px",    
        selector:  (row:series)=>row.DateNextReturn,
        cell:   (row:series) => FormatDate(row.DateNextReturn)
    }*/,
    {
        name:'Short Descriptions',
        sortable: true,
        width: "130px",    
        selector:  (row:series)=>row.ShortDescription,
        cell:   (row:series) => row.ShortDescription
    },
    {
        name:'Active',
        sortable: true,
        width: "130px",    
        selector:  (row:series)=>row.Active,
        cell:   (row:series) => row.Active
    } 
    /*,
    {
        name:'Date In',
        sortable: true,
        width: "130px",    
        selector:  (row:series)=>row.DateIn,
        cell:   (row:series) => FormatDate(row.DateIn)
    } */
    ,
    {
        name:'Returns Req',
        sortable: true,
        width: "130px",    
        selector:  (row:series)=>row.ReturnsReq,
        cell:   (row:series) => row.ReturnsReq
    } 
    ,
    {
        name:'Exposure',
        sortable: true,
        width: "130px",    
        selector:  (row:series)=>row.ExposureType,
        cell:   (row:series) => row.ExposureType
    } 
    ,
    {
        name:'Rack No',
        sortable: true,
        width: "130px",    
        selector:  (row:series)=>row.RackNo,
        cell:   (row:series) => row.RackNo
    } 
    ,
    {
        name:'Site Name',
        sortable: true,
        width: "130px",    
        selector:  (row:series)=>row.SiteName,
        cell:   (row:series) => row.SiteName
    } 
    ,
    {
        name:'Locked',
        sortable: true,
        width: "130px",    
        selector:  (row:series)=>row.Locked,
        cell:   (row:series) => row.Locked
    } 
  ]

  const FormatDate=(date:any)=>  {
    if (date==null) return "";
   const dte= new Date(date);
    return dte.getFullYear().toString()+'-'+(dte.getMonth()+1).toString().padStart(2,'0')+'-'+(dte.getDate()).toString().padStart(2,'0');
  }
  const [rackrptOpen,setrackrptOpen] = useState(false);
  return (
   <>
   <Header/>
   {rackrptOpen && <RptRack closeModal={()=>{setrackrptOpen(false)}}/>}

    <div className="search">
  <form onSubmit={handleSearch}>


        <table style={{border:"0px"}}>
       
         <tr>
            <td>
          <h3 style={{color:'#944780',fontSize:'24px'}}>Search Client Series</h3>
          </td>
          <td width={60}></td>
          <td><Link  title='Add New Series' href='/addseries'><AddIcon/></Link></td>
          <td>&nbsp;&nbsp;&nbsp;&nbsp;</td>

          <td>
          <select name="Fields" onChange={handlefield}>
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
        <input type='text' placeholder="-Search Client/Series-" value={search} onChange={e=>setSearch(e.target.value)} />
        </td>
        <td><SearchIcon onClick={handleSearch} />click to search</td>
        <td>&nbsp;&nbsp;&nbsp;&nbsp;</td>
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
              <td style={{backgroundColor:'rgb(247, 179, 147)'}}><b>Return / Report overdue</b>
         </td>
         <td style={{backgroundColor:'yellow'}}><b>Locked</b></td>
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
         <td>
         <button        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
       onClick={(e)=>{e.preventDefault(); setrackrptOpen(true);}}>Rack Report</button>
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
     color="silver"
     ariaLabel="circles-loading"
     wrapperStyle={{}}
     wrapperClass=""
     visible={true}
   />
   </div></div>
:
     
<DataTable columns={columns}
        
        pagination
        dense
        customStyles={customStyles}        
        data={results}
        conditionalRowStyles={conditionalRowStyles} >
        </DataTable>
      }
    </div>
</>

  );
}


/*
    <div style={{
           zIndex:-1,
           position:"fixed",
           width:"100vw",
           height:"100vh"
         }}>
                   <Image alt="Tech Interface - Equipment Service Repair" layout="fill" objectFit="cover" src="/background.jpg"/>
<h4>You are logged in</h4>

         </div>
*/


/* todo button on delete
<tr>
          <th><Button onClick={() => {alert("This button marks Series as deleted only if there are no samples or reports referencing the series");}}>?</Button></th>
      
        </tr>*/

        /*
          <table style={{width:"100%"}} id="table2">
        


        {
          results.map((result,i)=>{
            return (
              <tr key={i} className={colourstyle(result.Active,result.Complete,result.DateNextReport,result.DateNextReturn,result.CntSamplesOnSite,result.Locked)} >
                <td align='center'><div style={{border:'none'}} onClick={() => onDelete(result.seriesid)}><DeleteIcon/></div></td>
                <td align='center'><input type='checkbox' checked={result.Complete}/></td>
                <td>{result.companyname}</td>
                <td>{result.Abbreviation}</td>
                <td> <Link href={{pathname:"/seriestab",  query:{id: result.seriesid,name:result.AllungaReference }}}>{result.AllungaReference}</Link></td>
                <td>{result.clientreference}</td>
                <td>{result.CntSamplesOnSite}</td>
                <td>{result.EquivalentSamples}</td>
                {(result.DateNextReport==null)?<td></td>:
                (new Date(result.DateNextReport ).getFullYear()==2100)?<td></td>:
                <td>{new Date(result.DateNextReport ).toLocaleDateString()}</td>
            }

{(result.DateNextReturn==null)?<td></td>:(new Date(result.DateNextReport ).getFullYear()==2100)?<td></td>:
                <td>{new Date(result.DateNextReturn ).toLocaleDateString()}</td>
          }
                <td>{result.ShortDescription}</td>      
                  <td><input type='checkbox' checked={result.Active}/></td>    
                <td>{new Date(result.DateIn ).toLocaleDateString()}</td>
              
                <td><input type='checkbox' checked={result.ReturnsReq}/></td>
                <td>{result.ExposureType}</td>
                <td>{result.RackNo}</td>
                <td>{result.SiteName}</td>   
                <td>{result.Locked}</td>        
              </tr>  
            )
          })
        }
        
      </table>*/