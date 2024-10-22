import { getToken } from '@/msal/msal';
import React, { useState, FormEvent, useEffect } from 'react';

interface BulkAddSamples  {
  count: number;
  prefix: string;
  startindex: number;
  exposuretypeid: number;
  reportable: boolean;
  equivalentsample: number;
  longdesc: string;
}
interface SampleRow {
  seriesid: number
  sampleid: number
  number: number
  description: string
  longdescription: string
  equivalentsamples: number
  reportable: boolean
  sampleorder: number
  exposuretypeid: number
}

interface ExposureTypeRow {
  ExposureTypeID:number;
  Name:string;
    Description: string
    SortOrder: number
  }

interface props {
    seriesid: number;
    BulkAddSamplefn:()=>void;
    closeModal: () => void;
  }
export default function BulkAddSamples({seriesid,BulkAddSamplefn,closeModal}:props) {
  const [formData, setFormData] = useState<BulkAddSamples>({
    count: 0,
    prefix: '',
    startindex: 0,
    exposuretypeid: 0,
    reportable: false,
    equivalentsample: 0,
    longdesc:''
  });

  useEffect(() => {
    getExpType();
  }, []);



  const getExpType = async () => {
    //setLoading(true)
    try {
      const token = await getToken()
      const response = await fetch('https://allungawebapi.azurewebsites.net/api/ExposureTypes/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      const json = await response.json()
      setExposureType(json)
    } catch (error) {
      console.error('Error fetching exposure types:', error)
    } finally {
      //setLoading(false)
    }
  }

  const [exposureType, setExposureType] = useState<ExposureTypeRow[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              (type === 'number' || name === 'exposuretype') ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await postsamples();
    await BulkAddSamplefn();
    closeModal();
  };


  const postsamples = async () => {
    try {
      //var live:SampleRow[]= [];
      const token = await getToken()
      for (let i = formData.startindex; i < formData.startindex + formData.count; i++) 
        {
        const newSample: SampleRow = {
          seriesid:seriesid,
          sampleid: 0,
          number: i,
          description: `${formData.prefix}${i}`,
          longdescription: formData.longdesc,
          equivalentsamples: formData.equivalentsample,
          reportable: formData.reportable,
          sampleorder: i,
          exposuretypeid: formData.exposuretypeid,
        }
         
        
        const headers = new Headers()
        const bearer = `Bearer ${token}`
        headers.append('Authorization', bearer)
        headers.append('Content-type', "application/json; charset=UTF-8")
        
          const options = {
            method: 'POST',
            body: JSON.stringify(newSample),
            headers: headers,
          }  
          const response = fetch(process.env.NEXT_PUBLIC_API+`Sample`,options);
          var ee=await response;
          if (!ee.ok)
          {
            throw Error((ee).statusText);
          }
         
    }
  } 
    catch (error) {
      console.error('Error adding sample:', error)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Bulk Add Samples</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
      <button
            onClick={closeModal}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">Close</button>
<button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
          >
            Submit
          </button>
        <div>
          <label htmlFor="count" className="block text-sm font-medium text-gray-700">
            Count
          </label>
          <input
            type="number"
            id="count"
            name="count"
            value={formData.count}
            onChange={handleChange}
            required
            min="0"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                       focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          />
        </div>
        <div>
          <label htmlFor="prefix" className="block text-sm font-medium text-gray-700">
            Prefix
          </label>
          <input
            type="text"
            id="prefix"
            name="prefix"
            value={formData.prefix}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                       focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          />
        </div>
        <div>
          <label htmlFor="startindex" className="block text-sm font-medium text-gray-700">
            Start Index
          </label>
          <input
            type="number"
            id="startindex"
            name="startindex"
            value={formData.startindex}
            onChange={handleChange}
            required
            min="0"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                       focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          />
        </div>
        <div>
          <label htmlFor="exposuretype" className="block text-sm font-medium text-gray-700">
            Exposure Type
          </label>
          <select
            id="exposuretypeid"
            name="exposuretypeid"
            value={formData.exposuretypeid}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                       focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          >
              {exposureType.map((type) => (
        <option key={type.ExposureTypeID} value={type.ExposureTypeID}>
          {type.Name}
        </option>
      ))}
          </select>
        </div>
        <div>
          <label htmlFor="reportable" className="flex items-center">
            <input
              type="checkbox"
              id="reportable"
              name="reportable"
              checked={formData.reportable}
              onChange={handleChange}
              className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
            />
            <span className="ml-2 block text-sm text-gray-900">Reportable</span>
          </label>
        </div>
        <div>
          <label htmlFor="equivalentsample" className="block text-sm font-medium text-gray-700">
            Equivalent Sample
          </label>
          <input
            type="number"
            id="equivalentsample"
            name="equivalentsample"
            value={formData.equivalentsample}
            onChange={handleChange}
            required
            min="0"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                       focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          />
        </div>


        </div>
        <div className="space-y-4">

        <div>
          <label htmlFor="longdesc" className="block text-sm font-medium text-gray-700">
            Long Description
          </label>
          <input
            type="text"
            id="longdesc"
            name="longdesc"
            value={formData.longdesc}
            onChange={handleChange}
            required
            min="0"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                       focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          />
        </div>
        </div>
      </form>
    </div>
  );
}

/*
 className="space-y-4">*/