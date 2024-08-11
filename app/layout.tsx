import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import MyMsalProvider from '@/msal/MyMsalProvider'



const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Technician Service Repair Application',
  description: 'Technician Service Repair Application',
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
    <title>Technician Interface</title>
       <img rel="icon" src="/logo.png"/>
        </head>
        <body style={{backgroundColor:'whitesmoke'}}>
            {children}
          </body>
        </MyMsalProvider>
  
    </html>
  )
}