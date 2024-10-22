import React, { useState, useEffect } from "react";
import { Circles } from 'react-loader-spinner'
import { getToken } from "@/msal/msal";

type Props = {
  sampleid: number;
  SeriesID: number;
  closeModal: () => void;
};

/*interface SampleRow {
  seriesid: number;
  Reportable: boolean;
  Deleted: boolean;
  SampleOrder: number;
  ExposureTypeID: number;
  SampleID: number;
  Number: number;
  description: string;
  longdescription: string;
  EquivalentSamples: number;
}*/

interface SampleRow {
  seriesid: number
  sampleid: number
  number: number
  description: string
  longdescription: string
  equivalentsamples: number
  reportable: boolean
  deleted: boolean;
  sampleorder: number
  exposuretypeid: number
}

interface ExposureTypeRow {
  ExposureTypeID: number;
  Name: string;
}

export default function Sample({ closeModal, sampleid, SeriesID }: Props) {
  const [loading, setLoading] = useState(true);
  const [SampleID, setSampleID] = useState(sampleid);
  const [exp, setExp] = useState<ExposureTypeRow[]>([]);
  const [data, setData] = useState<SampleRow>();

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    await fetchExp();
    await fetchSample();
    setLoading(false);
  }

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

  const fetchSample = async ()=>{
    if (SampleID==0)
    {
      setData({
        seriesid: SeriesID,
        sampleid: 0,
        number: 0,
        description: "",
        longdescription: "",
        equivalentsamples: 1,
        reportable: false,
        deleted: false,
        sampleorder: 0,
        exposuretypeid: 0
      });
    }
    else
    {
    const urlSample = process.env.NEXT_PUBLIC_API+`Sample/int/`+SampleID;//https://allungawebapi.azurewebsites.net/api/Samples/int/
    //alert(urlSample);
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
  }
    const handleChangeNum = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setData({ ...data!, [e.target.name]:parseInt( e.target.value) });
    }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setData({ ...data!, [e.target.name]: e.target.value });
  }

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data!, [e.target.name]: e.target.checked });
  }

  const handleSubmit = async (e:any) => {
    setLoading(true);
      e.preventDefault()
      const token = await getToken()
      if (SampleID==0)
      {
        data!.seriesid=SeriesID;
        const headers = new Headers()
        const bearer = `Bearer ${token}`
        headers.append('Authorization', bearer)
        headers.append('Content-type', "application/json; charset=UTF-8")
        
          const options = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: headers,
          }  
          const response = fetch(process.env.NEXT_PUBLIC_API+`Sample`,options);
          var ee=await response;
          if (!ee.ok)
          {
            alert((ee).statusText);
          }
          else
          {
            alert('added successfully')
          }
         
        /*const token = await getToken()
        const headers = new Headers()
        const bearer = `Bearer ${token}`
        headers.append('Authorization', bearer)
        headers.append('Content-type', "application/json; charset=UTF-8")
        const options = {
          method: 'POST',
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
        */
      }
      else
      {
       
        const headers = new Headers()
        const bearer = `Bearer ${token}`
        headers.append('Authorization', bearer)
        headers.append('Content-type', "application/json; charset=UTF-8")
    
        const options = {
          method: 'PUT',
          body: JSON.stringify(data),
         headers: headers,
        }  
  
        const response = fetch(process.env.NEXT_PUBLIC_API+`Sample/`+SampleID,options);//https://allungawebapi.azurewebsites.net/api/Samples/
        var ee=await response;
        if (!ee.ok)
        {
          alert((ee).statusText);
        }
        else
        {
          alert('updated successfully')
        }
      }
    setLoading(false);
    }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl">
          <Circles height="80" width="80" color="#4F46E5" ariaLabel="circles-loading" visible={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center pb-3">
          <h1 className="text-2xl font-bold text-gray-700">Sample Details.</h1>
          <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           
            <div className="form-group">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Client ID:</label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="description" name="description" type="text" value={data?.description} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="number">AEL Ref:</label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="number" name="number" type="text" value={data?.number} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="longdescription">Description:</label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="longdescription" name="longdescription" type="text" value={data?.longdescription} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="equivalentsamples">Equivalent Samples:</label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="EquivalentSamples" name="EquivalentSamples" type="text" value={data?.equivalentsamples} onChange={handleChangeNum} />
            </div>
            <div className="form-group">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="exposuretypeid">Exposure Type:</label>
              <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="exposuretypeid" name="exposuretypeid" onChange={handleChange} value={data?.exposuretypeid}>
                {exp.map((ep) => (
                  <option key={ep.ExposureTypeID} value={ep.ExposureTypeID}>{ep.Name}</option>
                ))}
              </select>
            </div>
          
          </div>
        <div style={{display: "flex", justifyContent:'space-around'}}>
          <div className="mt-4 flex items-center">
            <input className="mr-2 leading-tight" type="checkbox" id="reportable" name="reportable" checked={data?.reportable} onChange={handleCheck} />
            <label className="text-sm" htmlFor="Reportable">Reportable</label>
          </div>

        <div className="mt-2 flex items-center">
            <input className="mr-2 leading-tight" type="checkbox" id="Deleted" name="Deleted" checked={data?.deleted} onChange={handleCheck} />
            <label className="text-sm" htmlFor="Deleted">Deleted</label>
          </div>

          <div className="mt-6 flex justify-end">
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Submit
            </button>
          </div>
          </div>
        </form>
      </div>
    </div>
  );
}