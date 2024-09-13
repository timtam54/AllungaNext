'use client'

import { useState, FormEvent } from 'react'
import Button from '@mui/material/Button'


type Props = {
  closeModal: () => void
}

export default function ClientRequestAccess({ closeModal }: Props) {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setMessage('Please enter a valid email address.')
      setIsLoading(false)
      return
    }

    // Simulated successful submission
    setMessage('Thank you for subscribing!')
    setEmail('')
    setIsLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div style={{backgroundColor:'#944780'}} className="bg-gradient-to-r  p-6 text-white">
          <h2 className="text-2xl font-bold">Request Access</h2>
          <p className="mt-2 text-sm opacity-80">Request Access to Your Data</p>
          
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                required
              />
            </div>
            <button style={{backgroundColor:'#944780'}} 
              type="submit"
              disabled={isLoading}
              className="w-full  text-white py-2 px-4 rounded-md hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out disabled:opacity-50"
            >
              {isLoading ? 'Submitting...' : 'Subscribe'}
            </button>
          </form>
          {message && (
            <p className={`mt-4 text-center ${message.includes('Thank you') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}
        </div>
        <div className="bg-gray-50 px-6 py-3 flex justify-end">
          <Button onClick={closeModal} variant="outlined" color="primary">
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}