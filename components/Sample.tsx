import React, { useState, useEffect } from "react";
import { Circles } from 'react-loader-spinner'
import { getToken } from "@/msal/msal";

type Props = {
  sampleid: number;
  SeriesID: number;
  closeModal: () => void;
};

interface SampleRow {
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
}

interface ExposureTypeRow {
  ExposureTypeID: number;
  Name: string;
}

export default function ImprovedSample({ closeModal, sampleid, SeriesID }: Props) {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setData({ ...data!, [e.target.name]: e.target.value });
  }

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data!, [e.target.name]: e.target.checked });
  }

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
          <h1 className="text-2xl font-bold text-gray-700">Sample Details</h1>
          <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="SampleID">ID:</label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="SampleID" type="text" value={data?.SampleID} readOnly />
            </div>
            <div className="form-group">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Client ID:</label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="description" name="description" type="text" value={data?.description} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Number">AEL Ref:</label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="Number" name="Number" type="text" value={data?.Number} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="longdescription">Description:</label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="longdescription" name="longdescription" type="text" value={data?.longdescription} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="EquivalentSamples">Equivalent Samples:</label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="EquivalentSamples" name="EquivalentSamples" type="text" value={data?.EquivalentSamples} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ExposureTypeID">Exposure Type:</label>
              <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="ExposureTypeID" name="ExposureTypeID" onChange={handleChange} value={data?.ExposureTypeID}>
                {exp.map((ep) => (
                  <option key={ep.ExposureTypeID} value={ep.ExposureTypeID}>{ep.Name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="SampleOrder">Sample Order:</label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="SampleOrder" name="SampleOrder" type="text" value={data?.SampleOrder} onChange={handleChange} />
            </div>
          </div>

          <div className="mt-4 flex items-center">
            <input className="mr-2 leading-tight" type="checkbox" id="Reportable" name="Reportable" checked={data?.Reportable} onChange={handleCheck} />
            <label className="text-sm" htmlFor="Reportable">Reportable</label>
          </div>

          <div className="mt-2 flex items-center">
            <input className="mr-2 leading-tight" type="checkbox" id="Deleted" name="Deleted" checked={data?.Deleted} onChange={handleCheck} />
            <label className="text-sm" htmlFor="Deleted">Deleted</label>
          </div>

          <div className="mt-6 flex justify-end">
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}