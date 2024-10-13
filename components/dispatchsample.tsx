'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { XIcon } from 'lucide-react'
import { getToken, msalInstance } from "@/msal/msal";
interface DispatchSample {
  dispatchsampleid: number
  dispatchid?: number
  sampleid?: number
  equivalentsamples?: number
  description?: string
  number?: number
  longdescription?: string
  splitfromdispatchsampleid?: number
  sel?: boolean
}

interface Props {
  dispatchid: number
  closeModal: () => void
  seriesid:number
}

export default function DispatchSample({ dispatchid, closeModal,seriesid }: Props) {
  const [samples, setSamples] = useState<DispatchSample[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const handleCheckboxChange = (index: number) => {
    setSamples(prevItems => 
      prevItems.map((item, i) => 
        i === index ? { ...item, sel: !item.sel } : item
      )
    )
  }
 

  useEffect(() => {
    fetchSamples()
    
   
  }, [dispatchid])


  
  const fetchSamples = async () => {
    try {
      const ep = `https://allungawebapicore.azurewebsites.net/api/DispatchSample/${dispatchid}/${seriesid}`
      const response = await fetch(ep)
      //alert(ep);
      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }
      const data: DispatchSample[] = await response.json()
      setSamples(data)
    } catch (err) {
      setError('An error occurred while fetching the data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
     const token = await getToken()
      samples.forEach(async (element) => { 
        const headers = new Headers()
        headers.append('Authorization', `Bearer ${token}`)
        const options = { method: 'PUT', headers: headers }
        
        const epx=`https://allungawebapicore.azurewebsites.net/api/DispatchSample/`+element.sampleid?.toString()+`/`+dispatchid.toString() + `/` + element.sel;
        //alert(epx);
        const response = fetch(epx, options);
        
        var ee=await response;
    if (!ee.ok)
    {
      alert((ee).statusText);
      return;
    }
    /*else{
      alert('ok');
    }*/
   else{
   ;// const json=await ee.json();
    //console.log(json);
   }
      });
      /*
      if (!response.ok) {
        throw new Error('Failed to save data')
      }*/
      alert('Changes saved successfully!')
      closeModal();
    } catch (err) {
      console.error(err)
      alert('Failed to save changes')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Dispatch Samples</h1>
            <button
              onClick={closeModal}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Close modal"
            >
              <XIcon size={24} />
            </button>
            <button
        onClick={handleSave}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Save Changes
      </button>
          </div>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {['Active','Equivalent Samples', 'Description', 'Number', 'Long Description', 'Split From ID'].map((header) => (
                      <th
                        key={header}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {samples.map((item, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b text-center">
                <input
                  type="checkbox"
                  checked={item.sel}
                  onChange={() => handleCheckboxChange(index)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
              </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.equivalentsamples ?? 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.description ?? 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.number ?? 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.longdescription ?? 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.splitfromdispatchsampleid ?? 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}