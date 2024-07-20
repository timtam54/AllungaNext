"use client"
import React, { useState, useEffect, Component, ChangeEvent } from "react";
import "@/components/part.css";
import { Circles } from 'react-loader-spinner'
import { getToken } from "@/msal/msal";
import Button from '@mui/material/Button';
interface paramrow
{
  ParamID:number;
  ParamName:string;
  ValueRange:string;
  EquivalentValues:string;
  Ordering:number;
  Unit:string;
  VisualNoReadings:string;
  ReportParamCostGroupID:number;
  ReportRateDiscounted:number;
  ReportRateStandard:number;
}
type Props = {
  ParamID:number;
  closeModal:  () => void;
  
};
function Param({ParamID,closeModal}:Props) {
  const [loading,setLoading] = useState(true);
  const [value, setValue] = useState();

//const location = useLocation()
  //const ParamID = location.state.id;//.id

  const urlExp = `https://allungawebapi.azurewebsites.net/api/Params/`;
  const [exp, setExp] = useState([]);

  const url = `https://allungawebapi.azurewebsites.net/api/Params/`+ParamID;
  const [data, setData] = useState<paramrow>();

  const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
    setData({ ...data!, [e.target.name]: e.target.value });
 }

  const fetchInfo = async ()=>{

    setLoading(true);
    const token = await getToken()

    const headers = new Headers()
    const bearer = `Bearer ${token}`
  
    headers.append('Authorization', bearer)
  
    const options = {
      method: 'GET',
      headers: headers,
    }  
    const response = fetch(url,options);
    var ee=await response;
    if (!ee.ok)
    {
      throw Error((ee).statusText);
    }
    const json=await ee.json();
    console.log(json);
    setData(json);

    setLoading(false);
  }
  useEffect(() => {

fetchInfo()   ; 

  }, []);




 const handleSubmit = (e:any) => {
    e.preventDefault()
    fetch(`https://allungawebapi.azurewebsites.net/api/Params/`+ParamID, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
    //.then(response => response.json())
   // .then(data => this.setState({ postId: data.ParamID }))
    ;
  }


    return (
      <body>
        {loading ? 
     <Circles
     height="300"
     width="300"
     color="purple"
     ariaLabel="circles-loading"
     wrapperStyle={{}}
     wrapperClass=""
     visible={true}
   />
:
<div className="modal-container">
    <div className="modal" style={{backgroundColor:'whitesmoke'}} >
<h1 style={{fontSize:'24px',fontWeight:'bold'}}>Parameter Details</h1>
 <Button  variant='contained' type="submit" onClick={(e:any)=>{e.preventDefault();closeModal()}}>Close</Button>
      <table border={1}>
        <tr>
          <th>Parameter ID:</th>
          <td>
          <input type="text" name="ParamID" onChange={handleChange} value={data!.ParamID} />
          </td>
        </tr>
        <tr>
          <th>Parameter Name:</th>
          <td>
          <input type="text" name="ParamName" onChange={handleChange} value={data!.ParamName} />
          </td>
        </tr>
        <tr>
          <th>Unit:</th>
          <td>
          <input type="text" name="Unit" onChange={handleChange} value={data!.Unit} />
          </td>
        </tr>
        <tr>
          <th>Value Range:</th>
          <td>
          <input type="text" name="ValueRange" onChange={handleChange} value={data!.ValueRange} />
          </td>
        </tr>
        <tr>
          <th>Equivalent Values:</th>
          <td>
          <input type="text" name="EquivalentValues" onChange={handleChange} value={data!.EquivalentValues} />
          </td>
        </tr>
        <tr>
          <th>Ordering:</th>
          <td>
          <input type="text" name="Ordering" onChange={handleChange} value={data!.Ordering} />
          </td>
        </tr>
        <tr>
          <th>Visual No Readings:</th>
          <td>
          <input type="text" name="VisualNoReadings" onChange={handleChange} value={data!.VisualNoReadings} />
          </td>
        </tr>
        <tr>
          <th>ReportParamCostGroupID:</th>
          <td>
          <input type="text" name="ReportParamCostGroupID" onChange={handleChange} value={data!.ReportParamCostGroupID} />
          </td>
        </tr>
        <tr>
          <th>Report Rate Discounted:</th>
          <td>
          <input type="text" name="ReportRateDiscounted" onChange={handleChange} value={data!.ReportRateDiscounted} />
          </td>
        </tr>
        <tr>
          <th>Report Rate Standard:</th>
          <td>
          <input type="text" name="ReportRateStandard" onChange={handleChange} value={data!.ReportRateStandard} />
          </td>
        </tr>
<tr><td>
 <button type="submit" onClick={handleSubmit}>
          Submit
        </button>
        </td>
        </tr>
  </table>
</div>
</div>
}
<table>
        <tr>
</tr>
      </table>
 </body>
    );
  }

export default Param