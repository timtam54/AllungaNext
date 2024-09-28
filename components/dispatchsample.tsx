'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { XIcon } from 'lucide-react'

interface DispatchSample {
  dispatchsampleid: number
  dispatchid?: number
  sampleid?: number
  equivalentsamples?: number
  description?: string
  number?: number
  longdescription?: string
  splitfromdispatchsampleid?: number
}

interface Props {
  dispsamid: number
  closeModal: () => void
}

export default function DispatchSample({ dispsamid, closeModal }: Props) {
  const [samples, setSamples] = useState<DispatchSample[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSamples = async () => {
      try {
        const response = await fetch(`https://allungawebapicore.azurewebsites.net/api/DispatchSample/${dispsamid}`)
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

    fetchSamples()
  }, [dispsamid])

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
                    {['Equivalent Samples', 'Description', 'Number', 'Long Description', 'Split From ID'].map((header) => (
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
                  {samples.map((sample) => (
                    <tr key={sample.dispatchsampleid} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sample.equivalentsamples ?? 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sample.description ?? 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sample.number ?? 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sample.longdescription ?? 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sample.splitfromdispatchsampleid ?? 'N/A'}</td>
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