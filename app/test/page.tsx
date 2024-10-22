'use client'

import { getToken } from '@/msal/msal'
import { useState, useEffect } from 'react'

interface WeatherData {
  date: Date
  temperatureC:number
  temperatureF:number 
  summary: string 
}

export default function WeatherForecast() {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const endPoint='https://localhost:7011/weatherforecast';

        const token = await getToken()
  const headers = new Headers()
  const bearer = `Bearer ${token}`
  headers.append('Authorization', bearer)
  const options = {
    method: 'GET',
    headers: headers,
  }  
  const response = await fetch(endPoint,options);

        if (!response.ok) {
          throw new Error('Failed to fetch weather data')
        }
        const data = await response.json()
        console.table(data);
        // Transform the data into the required interface
     //   const transformedData: WeatherData[] = data.map((item: any) => ({
     //     weather: `${item.temperatureC}°C (${item.temperatureF}°F), ${item.summary}`
     //   }))
        
        setWeatherData(data)
        setIsLoading(false)
      } catch (err) {
        setError('Error fetching weather data. Please try again later.')
        setIsLoading(false)
      }
    }

    fetchWeather()
  }, [])

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Weather Forecast</h1>
      <ul className="space-y-4">
        {weatherData.map((day, index) => (
          <li 
            key={index} 
            className="bg-white shadow rounded-lg p-4"
          >
            <p className="text-lg">{day.temperatureC}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}