'use client'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import Link from "next/link"
import { useState } from 'react'
import { msalInstance, handleLogout } from '@/msal/msal'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { ChevronDown, Search, LogOut, Users, Home, Database, FileText } from 'lucide-react'
import AddLocationIcon from '@mui/icons-material/AddLocation'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import GroupIcon from '@mui/icons-material/Group'
import ExposureIcon from '@mui/icons-material/Exposure'
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline'
import WbSunnyIcon from '@mui/icons-material/WbSunny'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import Radiation from '@/components/radiation'
import ChartSimple from "./chartsimple"

export default function Component() {
  const [radrptOpen, setRadrptOpen] = useState(false)
  const [chartSimpleOpen, setChartSimpleOpen] = useState(false)
  const user = msalInstance.getActiveAccount()

  return (
    <header className="bg-gradient-to-r text-black shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
            <img src="/tagline.png" alt="Tagline" className="h-4 w-auto" />
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

          <div className="flex items-center space-x-4">
            <div title={user?.name} className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                {user?.name ? user.name[0].toUpperCase() : '?'}
              </div>
              <button
                onClick={() => handleLogout('redirect')}
                className="ml-2 text-white hover:text-gray-200 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {radrptOpen && <Radiation closeModal={() => setRadrptOpen(false)} />}
      {chartSimpleOpen && <ChartSimple closeModal={() => setChartSimpleOpen(false)} />}
    </header>
  )
}