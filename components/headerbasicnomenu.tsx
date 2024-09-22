'use client'
import AddLocationIcon from '@mui/icons-material/AddLocation';
import UserAvatar from "./UserAvatar"
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { msalInstance, handleLogout } from '@/msal/msal'

import {  ChevronDown, LogOut, Home, Database, FileText, CloudSun } from 'lucide-react'
import ScheduleActual from '@/components/ScheduleActual'
import Radiation from '@/components/radiation'
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import Weather from './weather' 



export default function Component() {
  

  const user = msalInstance.getActiveAccount()

  return (
    <header>
      <div style={{display:'flex', justifyContent:'space-between',alignContent:'center'}}>
      <div style={{display:'flex',alignContent:'center'}}>
            <img src="/logo.png" alt="Logo"  />
            <img src="/tagline.png" alt="Tagline" className="h-4 w-auto " />
          </div>

          

          <div title={user?.name} style={{display:'flex',alignContent:'center'}}>
          <UserAvatar  />
          <button
            onClick={() => handleLogout('redirect')}>
            <LogOut className="w-5 h-5" />
          </button>
        </div>
          </div>
    </header>
  )
}