
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

interface histrow{
  Action:string;
  DTE:Date;
  
}


export const Sample  = ({  closeModal, sampleid,SeriesID }:Props) => {
  const [loading,setLoading] = useState(true);
  const [value, setValue] = useState(`1`);

  //const location = useLocation()
  const [SampleID,setSampleID] = useState(sampleid);

  //const SeriesID = location.state.seriesid;//.id

  //const [exp, setExp] = useState<ExposureTypeRow[]>([]);

  /*const fetchExp = async()=>{
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
*/
  /*const fetchInfo = () => {

    return fetch(url)
      .then((res) => res.json())
      .then((d) => setData(d))
      //.then(data.seriesid=SeriesID)
       .then (fetchHistory());
  }
*/
 
  
  useEffect(() => {
  fetchAll(); 
//fetchInfo()   ; 

  }, []);

  const fetchAll=async()=>
  {
   await  fetchHistory();
    setLoading(false);
  }
  const [dataHistory, setDataHistory] = useState<histrow[]>([]);

  const fetchHistory = async ()=>{
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
    console.log(urlSample);
    const json=await ee.json();
    console.table(json);
    
  setDataHistory(json);
  setLoading(false);
  }
 
 /* const handleCheck = (e:any) => {
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
  }*/


    return (

      <div className="modal-container">
    <div className="modal" style={{backgroundColor:'whitesmoke'}} >
<h1 style={{fontSize:'24px',fontWeight:'bold'}}>Sample History</h1>

<Button type="submit" variant="outlined" onClick={(e)=>{e.preventDefault();closeModal()}}>Close</Button>
    <form>

    
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
<>

<table border={1}>
  <tr>

</tr>

{
dataHistory.map((result,i)=>{
return (
<tr  style={{backgroundColor:result.Action?`green`:`red`}} className='result' key={i} >
  <td>{(new Date(result.DTE )).getDate()}-{(new Date(result.DTE )).getMonth() + 1}-{(new Date(result.DTE )).getFullYear()}</td>
   <td >{result.Action?`onsite`:`offsite`}</td>
  </tr>
)
})
}

</table>


 </>
    
     

}



 </form>
</div>
</div>
    );
  }

export default Sample