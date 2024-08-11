"use client"
import React, { useState, useEffect, Component, ChangeEvent } from "react";

import { Circles } from 'react-loader-spinner'
import { getToken } from "@/msal/msal";
import "@/components/part.css";
import Button from '@mui/material/Button';
import { useSearchParams } from "next/navigation";

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
    groupName:string;
    Website:string;
    TechnicalPhone:string;
    TechnicalMobile:string;
    TechnicalEmail:string;
    TechnicalFax:string;

    TechnicalTitle:string;
TechnicalRole:string;
AccountingContact:string;
AccoutingPhone:string;
AccountingMobile:string;
AccountingEmail:string;
AccountingFax:string;
AccountingTitle:string;
AccountAddress:string;
AccountRole:string;
AccountingDesc:string;
FreightContact:string;
FreightPhone:string;
FreightMobile:string;
FreightEmail:string;
FreightFax:string;
FreightAddress:string;
FreightDesc:string;
}
export default function client()
{
    const searchParams = useSearchParams();
    const id = parseInt( searchParams!.get("id")!);

    const [loading,setLoading] = useState(true);
   // const [results,setResults] = useState([]);
    const [ClientID,setClientID] =useState( id);//.id
  
   
    const [data, setData] = useState<clientrow>();
    const handleChangeta= (e:ChangeEvent<HTMLTextAreaElement>) => {
        setData({ ...data!, [e.target.name]: e.target.value });
     }

    const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
      setData({ ...data!, [e.target.name]: e.target.value });
   }
  
   const handleCheck = (e:ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked)
    {
    setData({ ...data!, [e.target.name]: true});
    }
  else{
    setData({ ...data!, [e.target.name]: false});
  }
  };

   const fetchInfo = async()=>{
    if (ClientID!=0)
    {
    const token = await getToken()
    const headers = new Headers()
    const bearer = `Bearer ${token}`
    headers.append('Authorization', bearer)
    const options = {
      method: 'GET',
      headers: headers,
    }
    const endPoint = `https://allungawebapi.azurewebsites.net/api/Clients/int/`+ClientID;
    const response = fetch(endPoint,options);
    var ee=await response;
    if (!ee.ok)
    {
      alert((ee).statusText);
      return;
    }
    const json=await ee.json();
    console.log(json);
    setData(json);
    //setIsOpen(true);
    setLoading(false);
   //fetchSeries();
  }
  else
  {
    setLoading(false);
  }
   }
  
  
   
    useEffect(() => {
      setLoading(true);
     // fetchExp();
  fetchInfo()   ; 
  
    }, []);
  
  
   
    const [vldtcompanyname,setvldtcompanyname] = useState('');
    const [vldtcontactname,setvldtcontactname] = useState('');
    const [vldtabbreviation,setvldtabbreviation]= useState('');
    function validatePage() {
      var vld=true;
      if (data!.contactname==null) {
        setvldtcontactname('Please Enter an Contact Name');
        vld=false
      }
      else
      {
        setvldtcontactname('');
      }
      if (data!.companyname==null) {
        setvldtcompanyname('Please Enter an Company Name');
        vld=false
      }
      else
      {
        setvldtcompanyname('');
      }
      
      setvldtabbreviation('');
     
      if (data!.abbreviation!=null)
      {
      if (data!.abbreviation.length>5) {
        setvldtabbreviation('Abbreviation is 5 characters max');
        vld=false
      }
    }
      return vld;
    };
    
   const handleSubmit = async () => {
    if (!validatePage())
        return;
    setLoading(true);
    const token = await getToken()
   const headers = new Headers()
   const bearer = `Bearer ${token}`
   headers.append('Authorization', bearer)
   headers.append('Content-type', "application/json; charset=UTF-8")
   if (ClientID==0)
   {
     const options = {
       method: 'POST',
       body: JSON.stringify(data),
       headers: headers,
     }  
   const endpoint=`https://allungawebapi.azurewebsites.net/api/Clients`
     const response = fetch(endpoint,options);
    var ee=await response;
     if (!ee.ok)
     {
       throw Error((ee).statusText);
     }
     const json=await ee.json();
     console.log(json);
     setClientID(json.ClientID);
     await setData(json);
   }
   else
   {
   const options = {
     method: 'PUT',
     body: JSON.stringify(data),
     headers: headers,
   }  
  
   const response = fetch(`https://allungawebapi.azurewebsites.net/api/Clients/`+ClientID,options);
  var ee=await response;
   if (!ee.ok)
   {
     throw Error((ee).statusText);
   }
  }
  setLoading(false);
   

    }

   
      return (
        <div className="modal-container">
        <div className="modal" style={{backgroundColor:'lightgray'}} >
    <h1 style={{fontSize:'24px',fontWeight:'bold'}}>Sample Details</h1>
    
       
        <form>
  
  <table>
                <tr>
                  <td> <h3 style={{color:'#944780'}}>Clients</h3>
                    </td>
  </tr>
                </table>  
  
  
  
  
          {loading ? 
  <div className="relative h-16">
    <div className="absolute p-4 text-center transform -translate-x-1/2 translate-y-1/2 border top-1/2 left-1/2">
       <Circles
       height="300"
       width="300"
       color="#944780"
       ariaLabel="circles-loading"
       wrapperStyle={{}}
       wrapperClass=""
       visible={true}
     /></div></div>
  :
  <>
        <table width="100%">
          <tr>
            
            <th>Company Name:</th>
            <td style={{width:'600px'}} >
            <input type="text" style={{width:'600px'}} name="companyname" onChange={handleChange} value={data!.companyname} />
            <span style={{color:'red'}}>{vldtcompanyname}</span>
            </td>
            <th>Code:</th>
            <td>
            <input type="text" name="abbreviation" onChange={handleChange} value={data!.abbreviation} />
            <span style={{color:'red'}}>{vldtabbreviation}</span>
            </td>
  <td>
  <Button variant="outlined"  onClick={handleSubmit}>
            Submit
          </Button>
  </td>
          </tr>
          </table>
          <table  width="100%">
          <tr style={{width:"100%"}}>
            <th>Group:</th>
            <td width="100%">
            <input type="text" name="groupName" style={{width:'600px'}}  onChange={handleChange} value={data!.groupName} />
            </td>
            <th>Website:</th>
            <td width="100%">
            <input type="text" name="Website" style={{width:'400px'}}  onChange={handleChange} value={data!.Website} />
            </td>
          </tr>
          </table>
  
          <table>
  
                  <td> <h4 style={{color:'Black'}}>Tech Contact</h4>
                    </td>
          </table>
          <table  width="100%">
          <tr style={{width:"100%"}}>
            <th>Name:</th>
            <td>
            <input type="text" name="contactname" onChange={handleChange} value={data!.contactname} />
            <span style={{color:'red'}}>{vldtcontactname}</span>
  
             </td>
             <th>Phone:</th>
            <td>
            <input type="text" name="TechnicalPhone" onChange={handleChange} value={data!.TechnicalPhone} />
            </td>
            <th>Mobile:</th>
            <td>
            <input type="text" name="TechnicalMobile" onChange={handleChange} value={data!.TechnicalMobile} />
            </td>
          </tr>
          <tr>
          <th>Email:</th>
            <td>
            <input type="text" style={{width:'500px'}}   name="TechnicalEmail" onChange={handleChange} value={data!.TechnicalEmail} />
            </td>
            <th>Fax:</th>
            <td>
            <input type="text" name="TechnicalFax" onChange={handleChange} value={data!.TechnicalFax} />
            </td>
            <th>Title:</th>
            <td>
            <input type="text" name="TechnicalTitle" onChange={handleChange} value={data!.TechnicalTitle} />
            </td>
          </tr>
          <tr>
          <th>Address:</th>
            <td colSpan={3}>
            <input type="text" style={{width:'800px'}}   name="address" onChange={handleChange} value={data!.address} />
            </td>
          
            <th>Role:</th>
            <td>
            <input type="text" name="TechnicalRole" onChange={handleChange} value={data!.TechnicalRole} />
            </td>
          </tr>
          <tr>
          <th>Notes:</th>
          <td colSpan={5} width="100%">
          <textarea cols={120}  style={{width:'100%'}} name="description" onChange={handleChangeta} value={data!.description} />
          </td>
          </tr>
          </table>
  
  
          <table>
  
  <td> <h4 style={{color:'Black'}}>Accounting Contact</h4>
    </td>
  </table>
  <table  width="100%">
  <tr style={{width:"100%"}}>
  <th>Name:</th>
  <td>
  <input type="text" name="AccountingContact" onChange={handleChange} value={data!.AccountingContact} />
  </td>
  <th>Phone:</th>
  <td>
  <input type="text" name="AccoutingPhone" onChange={handleChange} value={data!.AccoutingPhone} />
  </td>
  <th>Mobile:</th>
  <td>
  <input type="text" name="AccountingMobile" onChange={handleChange} value={data!.AccountingMobile} />
  </td>
  </tr>
  <tr>
  <th>Email:</th>
  <td>
  <input type="text" style={{width:'500px'}}   name="AccountingEmail" onChange={handleChange} value={data!.AccountingEmail} />
  </td>
  <th>Fax:</th>
  <td>
  <input type="text" name="AccountingFax" onChange={handleChange} value={data!.AccountingFax} />
  </td>
  <th>Title:</th>
  <td>
  <input type="text" name="AccountingTitle" onChange={handleChange} value={data!.AccountingTitle} />
  </td>
  </tr>
  <tr>
          <th>Address:</th>
            <td colSpan={3}>
            <input type="text" style={{width:'800px'}}   name="AccountAddress" onChange={handleChange} value={data!.AccountAddress} />
            </td>
          
            <th>Role:</th>
            <td>
            <input type="text" name="AccountRole" onChange={handleChange} value={data!.AccountRole} />
            </td>
          </tr>
          
  <tr>
  <th>Notes:</th>
  <td colSpan={5} width="100%">
  <textarea cols={120}  style={{width:'100%'}} name="AccountingDesc" onChange={handleChangeta} value={data!.AccountingDesc} />
  </td>
  </tr>
  </table>
  
  <table>
  
  <td> <h4 style={{color:'Black'}}>Freight</h4>
    </td>
  </table>
  <table  width="100%">
  <tr style={{width:"100%"}} >
  <th>Name:</th>
  <td>
  <input type="text" name="FreightContact" onChange={handleChange} value={data!.FreightContact} />
  </td>
  <th>Phone:</th>
  <td>
  <input type="text" name="FreightPhone" onChange={handleChange} value={data!.FreightPhone} />
  </td>
  <th>Mobile:</th>
  <td>
  <input type="text" name="FreightMobile" onChange={handleChange} value={data!.FreightMobile} />
  </td>
  </tr>
  <tr>
  <th>Email:</th>
  <td>
  <input type="text" style={{width:'500px'}}   name="FreightEmail" onChange={handleChange} value={data!.FreightEmail} />
  </td>
  <th>Fax:</th>
  <td>
  <input type="text" name="FreightFax" onChange={handleChange} value={data!.FreightFax} />
  </td>
  
  </tr>
  <tr>
          <th>Address:</th>
            <td colSpan={3}>
            <input type="text" style={{width:'800px'}}   name="FreightAddress" onChange={handleChange} value={data!.FreightAddress} />
            </td>
          
           
          </tr>
          
  <tr>
  <th>Notes:</th>
  <td colSpan={5} width="100%">
  <textarea cols={120}  style={{width:'100%'}} name="FreightDesc" onChange={handleChangeta} value={data!.FreightDesc} />
  </td>
  </tr>
  </table>
         
         
  
   
    </>
       
  
  }
  
   </form>
   </div>
   </div>
      );
}
