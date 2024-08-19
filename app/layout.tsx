import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import MyMsalProvider from '@/msal/MyMsalProvider'



const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Allunga Series Reporting',
  description: 'Allunga Series Reporting',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
    
        <MyMsalProvider>
        <head>
    <title>Allunga Reporting Tool</title>
       <img rel="icon" src="/logo.png"/>
        </head>
        <body style={{backgroundColor:'white'}}>
            {children}
          </body>
        </MyMsalProvider>
  
    </html>
  )
}