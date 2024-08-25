
import React, { useState, useEffect, Component } from "react";
import { Circles } from 'react-loader-spinner'
import Button from '@mui/material/Button';
import { getToken } from "@/msal/msal";
import "@/components/part.css";
type Props = {
  sampleid: number;
  SeriesID:number;
  closeModal:  () => void;
};

interface samplerow{
  seriesid:number;
  Reportable:boolean;
  Deleted:boolean;
  SampleOrder:number;
  ExposureTypeID:number;
  SampleID:number;
   Number:number;
    description:string;
    
    longdescription:string;
    EquivalentSamples:number;
    /* 
    ExposureType:string;*/
}

interface ExposureTypeRow
{
  ExposureTypeID:number;
  Name:string;
}
export const Sample  = ({  closeModal, sampleid,SeriesID }:Props) => {
  const [loading,setLoading] = useState(true);
  const [value, setValue] = useState(`1`);

  //const location = useLocation()
  const [SampleID,setSampleID] = useState(sampleid);

  //const SeriesID = location.state.seriesid;//.id

  const [exp, setExp] = useState<ExposureTypeRow[]>([]);

  const fetchExp = async()=>{
    setLoading(true);
    const urlExp = `https://allungawebapi.azurewebsites.net/api/ExposureTypes/`;
    const token = await getToken()
    const headers = new Headers()
    const bearer = `Bearer ${token}`
    headers.append('Authorization', bearer)
    const options = {
      method: 'GET',
      headers: headers,
    }  
    const response = fetch(urlExp,options);
    var ee=await response;
    if (!ee.ok)
    {
      throw Error((ee).statusText);
    }
    const json=await ee.json();
    console.log(json);  
    setExp(json);
    
  }


  const [data, setData] = useState<samplerow>();

  const handleChange = (e:any) => {
    setData({ ...data!, [e.target.name]: e.target.value });
 }

  /*const fetchInfo = () => {

    return fetch(url)
      .then((res) => res.json())
      .then((d) => setData(d))
      //.then(data.seriesid=SeriesID)
       .then (fetchHistory());
  }
*/
  const fetchSample = async ()=>{
    const urlSample = `https://allungawebapi.azurewebsites.net/api/Samples/int/`+SampleID;
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
    setData(json);
    }
  
  useEffect(() => {
  fetchAll(); 
//fetchInfo()   ; 

  }, []);

  const fetchAll=async()=>
  {
   await  fetchExp();
    await fetchSample();
    setLoading(false);
  }
  /*const [dataHistory, setDataHistory] = useState([]);

  const fetchHistory = async e=>{
    const urlSample = `https://allungawebapi.azurewebsites.net/api/SampleHistories/`+SampleID;
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
    
  setDataHistory(json);
  setLoading(false);
  }
 */ 
  const handleCheck = (e:any) => {
    if (e.target.checked)
    {
    setData({ ...data!, [e.target.name]: true});
    }
  else{
    setData({ ...data!, [e.target.name]: false});
  }
  };


 const handleSubmit = async (e:any) => {
  setLoading(true);
    e.preventDefault()
    if (SampleID==0)
    {
      data!.seriesid=SeriesID;
      const token = await getToken()
      const headers = new Headers()
      const bearer = `Bearer ${token}`
      headers.append('Authorization', bearer)
      headers.append('Content-type', "application/json; charset=UTF-8")
      const options = {
        method: 'PUT',
        body: JSON.stringify(data),
       headers: headers,
      }  
      const response = fetch(`https://allungawebapi.azurewebsites.net/api/Samples/`,options);
      var ee=await response;
      if (!ee.ok)
      {
        throw Error((ee).statusText);
      }
      
      const json=await ee.json();
      setSampleID( json.SampleID);
      setData(json);
      //fetchHistory();
    }
    else
    {
      const token = await getToken()
      const headers = new Headers()
      const bearer = `Bearer ${token}`
      headers.append('Authorization', bearer)
      headers.append('Content-type', "application/json; charset=UTF-8")
  
      const options = {
        method: 'PUT',
        body: JSON.stringify(data),
       headers: headers,
      }  

      const response = fetch(`https://allungawebapi.azurewebsites.net/api/Samples/`+SampleID,options);
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
    <div className="modal" style={{backgroundColor:'WhiteSmoke'}} >
<h1 style={{fontSize:'24px',fontWeight:'bold'}}>Sample Details</h1>

<Button type="submit" variant="outlined" onClick={(e)=>{e.preventDefault();closeModal()}}>Close</Button>
    <form>

    
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
<>

      <table>
        <tr>
          <th>ID:</th>
          <td>
          {data!.SampleID}
          </td>
        </tr>
        <tr>
          <th>Client ID:</th>
          <td>
          <input type="text" name="description" onChange={handleChange} value={data!.description} />
          </td>
        </tr>
        <tr>
          <th>AEL Ref:</th>
          <td>
          <input type="text" name="Number" onChange={handleChange} value={data!.Number} />
          </td>
        </tr>
        <tr>
          <th>Description:</th>
          <td>
          <input type="text" name="longdescription" onChange={handleChange} value={data!.longdescription} />
          </td>
        </tr>
        <tr>
          <th>Equivalent Samples:</th>
          <td>
          <input type="text" name="EquivalentSamples" onChange={handleChange} value={data!.EquivalentSamples} />
          </td>
        </tr>
        <tr>
          <th>Exposure Type:</th><td> 
          <select name="ExposureTypeID"  onChange={handleChange}>
          {
          exp.map((ep,i)=>{
            return (
              <option value={ep.ExposureTypeID} selected={(ep.ExposureTypeID==data!.ExposureTypeID)?true:false}>{ep.Name}</option>
            )})
          }
          </select>
      </td>
        </tr>
        <tr>
          <th>Reportable:</th>
          <td>
          <input type="checkbox" onChange={handleCheck}  name="Reportable" checked={data!.Reportable} />
          </td>
        </tr>
        <tr>
          <th>Deleted:</th>
          <td>
          <input type="checkbox" onChange={handleCheck}  name="Deleted" checked={data!.Deleted} />
          </td>
        </tr>
        
        
        
        <tr>
          <th>SampleOrder:</th>
          <td>
          <input type="text" name="SampleOrder" onChange={handleChange} value={data!.SampleOrder} />
          </td>
        </tr>

  </table>

  <Button type="submit" variant="outlined" onClick={handleSubmit}>
          Submit
        </Button>
 </>
    
     

}



 </form>
</div>
</div>
    );
  }

export default Sample