'use client'
import Link from "next/link";
import AddLocationIcon from '@mui/icons-material/AddLocation';
import UserAvatar from "./UserAvatar"
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupIcon from '@mui/icons-material/Group';
import ExposureIcon from '@mui/icons-material/Exposure';
import { msalInstance, handleLogout } from '@/msal/msal'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDown, Search, LogOut, Users, Home, Database, FileText } from 'lucide-react'
//import { ChevronDown, LogOut, Home, Database, CloudSun } from 'lucide-react'
import ScheduleActual from '@/components/ScheduleActual'
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline';
import Radiation from '@/components/radiation'
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Weather from './weather' 
import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import ChartSimple from "./chartsimple";
export default function Component() {
  
  const [radrptOpen, setRadrptOpen] = useState(false)
  const user = msalInstance.getActiveAccount()
  const [isOpen, setIsOpen] = useState(false)
  const [chartSimpleOpen, setChartSimpleOpen] = useState(false)
  const toggleDropdown = () => setIsOpen(!isOpen)
  
      {chartSimpleOpen && <ChartSimple closeModal={() => setChartSimpleOpen(false)} />}
 /*     {weatherOpen && <Weather closeModal={() => setWeatherOpen(false)} />}
  {schedrptOpen && <ScheduleActual Rpt={rpt} closeModal={() => setSchedrptOpen(false)} />}*/
 
 return (
    <header>


      {radrptOpen && <Radiation closeModal={() => setRadrptOpen(false)} />}

      <div style={{display:'flex', justifyContent:'space-between',alignContent:'center'}}>
      <div style={{display:'flex',alignContent:'center'}}>
            <img src="/logo.png" alt="Logo"  />
            <img src="/tagline.png" alt="Tagline" className="h-4 w-auto " />
          </div>



       
          <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
        <Home className="w-4 h-4 mr-2" />Home
          <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-400" />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <div className="py-1">
          <MenuItem>
            <Link 
             href={"/"}  className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"><Search className="w-4 h-4 mr-2" />
              Search
            </Link>
          </MenuItem>
          
          <MenuItem>
            <Link   href="" onClick={() => handleLogout('redirect')}
              className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"  >
            <ExitToAppIcon className="w-4 h-4 mr-2" />Sign Out
            </Link>
          </MenuItem>
           <MenuItem>
            <Link 
              href={"/clientaccess"}
              className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
            > <Users className="w-4 h-4 mr-2" />
                  Client Access
            </Link>
          </MenuItem>
        </div>

        

      </MenuItems>
    </Menu>


    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
        <Database className="w-4 h-4 mr-2" />Data
          <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-400" />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <div className="py-1">
          <MenuItem>
            <Link 
             href={{
              pathname:"/parameters"}}  className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
            ><ViewHeadlineIcon className="w-4 h-4 mr-2" />
              Parameters
            </Link>
          </MenuItem>
         
          <MenuItem>
            <Link 
               href={{
                pathname:"/exposuretypes"}}  
              className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
            > <ExposureIcon className="w-4 h-4 mr-2" />
                 Exposure Types
            </Link>
          </MenuItem>
          
       
          <MenuItem>
            <Link 
              href={{
                pathname:"/clientsearch"}}
              className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
            > <GroupIcon className="w-4 h-4 mr-2" />
                  Client Search
            </Link>
          </MenuItem>
        </div>

        

      </MenuItems>
    </Menu>

    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
        <FileText className="w-4 h-4 mr-2" />Reports
          <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-400" />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <div className="py-1">
          <MenuItem>
          <Link   href={"/rackrpt"}  className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
            ><AddLocationIcon className="w-4 h-4 mr-2" />
              Rack Report
            </Link>
          </MenuItem>
          <MenuItem>
          <Link href="" onClick={() => setRadrptOpen(true)} className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
            ><WbSunnyIcon className="w-4 h-4 mr-2" />
              Radiation
            </Link>
          </MenuItem>
          <MenuItem>
          <Link   href={"/schedulereport?Rpt=Actual"}  className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
            ><CalendarMonthIcon className="w-4 h-4 mr-2" />
              Report Actual Schedule
            </Link>
          </MenuItem>
          <MenuItem>
          <Link   href={"/schedulereport?Rpt=Projected"}  className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
            ><CalendarMonthIcon className="w-4 h-4 mr-2" />
              Report Projected Schedule
            </Link>
          </MenuItem>
          <MenuItem>
          <Link   href={"/schedulereport?Rpt=SampleOnOffSiteActual"}  className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
            ><CalendarMonthIcon className="w-4 h-4 mr-2" />
              Sample On/Off Site - Actual
            </Link>
          </MenuItem>
          <MenuItem>
          <Link   href={"/schedulereport?Rpt=SampleOnOffSiteProjected"}  className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
            ><CalendarMonthIcon className="w-4 h-4 mr-2" />
               Sample On/Off Site - Projected
            </Link>
          </MenuItem>
          <MenuItem>
          <Link href="" onClick={() => setChartSimpleOpen(true)} className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
            ><CalendarMonthIcon className="w-4 h-4 mr-2" />
               Param Chart
            </Link>
          </MenuItem>
         
              
         </div>

        

      </MenuItems>
    </Menu>
    

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