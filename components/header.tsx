'use client'
import Link from "next/link";
import AddLocationIcon from '@mui/icons-material/AddLocation';
import UserAvatar from "./UserAvatar"
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { msalInstance, handleLogout } from '@/msal/msal'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDown, Search, LogOut, Users, Home } from 'lucide-react'
import ScheduleActual from '@/components/ScheduleActual'
import Radiation from '@/components/radiation'
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import Weather from './weather' 
import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid'
export default function Component() {
  

  const user = msalInstance.getActiveAccount()
  const [isOpen, setIsOpen] = useState(false)

  const toggleDropdown = () => setIsOpen(!isOpen)
  return (
    <header>
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
             href={{
              pathname:"/"}}  className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Link>
          </MenuItem>
         
          <MenuItem>
            <Link 
              href={{
                pathname:"/clientaccess"}}
              className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
            > <Users className="w-4 h-4 mr-2" />
                  Client Access
            </Link>
          </MenuItem>
          
        </div>

        

      </MenuItems>
    </Menu>
    <nav>
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 focus:outline-none focus:text-gray-900"
              aria-expanded={isOpen}
              aria-haspopup="true"
            >
              <div style={{display:'flex',alignContent:'center'}}><Home className="w-4 h-4 mr-2" />Home</div>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
            </button>
            
            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <a
                  href="/"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  onClick={() => setIsOpen(false)}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </a>
                <a
                  href="#sign-out"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  onClick={() => {setIsOpen(false);handleLogout('redirect');}}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </a>
                <a
                  href="/clientaccess"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  onClick={() => setIsOpen(false)}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Client Access
                </a>
              </div>
            )}
          </div>
        </nav>

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