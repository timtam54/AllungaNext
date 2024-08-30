'use client'

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { Menu } from '@headlessui/react'
import { msalInstance, handleLogout } from '@/msal/msal'
import RptRack from '@/components/RptRack'
import ChartSimple from '@/components/chartsimple'
import UserAvatar from '@/components/UserAvatar'
import ScheduleActual from '@/components/ScheduleActual'
import Weather from './weather'
import { ChevronDown, LogOut, Home, Database, FileText, CloudSun } from 'lucide-react'

const Header = () => {
  const [chartSimpleOpen, setChartSimpleOpen] = useState(false)
  const [rpt, setRpt] = useState('Actual')
  const user = msalInstance.getActiveAccount()
  const [rackrptOpen, setRackrptOpen] = useState(false)
  const [schedrptOpen, setSchedrptOpen] = useState(false)
  const [weatherOpen, setWeatherOpen] = useState(false)

  interface MenuDropdownProps {
    title?: string;
    children?: ReactNode;
  }
  
  const MenuDropdown: React.FC<MenuDropdownProps> = ({ title, children }) => (
  
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        {title}
        <ChevronDown className="w-5 h-5 ml-2 -mr-1 text-gray-400" aria-hidden="true" />
      </Menu.Button>
      <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="py-1">{children}</div>
      </Menu.Items>
    </Menu>
  )

  interface MenuItemProps {
    href: string;
    onClick?: () => void;
    children?: ReactNode;
  }
  
  const MenuItem: React.FC<MenuItemProps> = ({ href, onClick, children }) => (
  
    <Menu.Item>
      {({ active }) => (
        href ? (
          <Link
            href={href}
            className={`${
              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
            } block px-4 py-2 text-sm`}
          >
            {children}
          </Link>
        ) : (
          <button
            onClick={onClick}
            className={`${
              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
            } block w-full text-left px-4 py-2 text-sm`}
          >
            {children}
          </button>
        )
      )}
    </Menu.Item>
  )

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <img src="/logo.png" alt="Logo" className="h-16 w-auto" />

        <nav className="flex items-center space-x-4">
          <MenuDropdown title={<><Home className="w-5 h-5 mr-2" />Home</>}>
            <MenuItem href="/">Search</MenuItem>
            <MenuItem onClick={() => handleLogout('redirect')}>Sign out</MenuItem>
          </MenuDropdown>

          <MenuDropdown title={<><Database className="w-5 h-5 mr-2" />Data</>}>
            <MenuItem href="/parameters">Parameters</MenuItem>
            <MenuItem href="/exposuretypes">Exposure Types</MenuItem>
            <MenuItem href="/clientsearch">Client Search</MenuItem>
          </MenuDropdown>

          <MenuDropdown title={<><FileText className="w-5 h-5 mr-2" />Reports</>}>
            <MenuItem onClick={() => setRackrptOpen(true)}>Rack Report</MenuItem>
            <MenuItem onClick={() => setWeatherOpen(true)}>
              <CloudSun className="w-5 h-5 mr-2 inline" />
              Weather - last week
            </MenuItem>
            <MenuItem onClick={() => { setRpt('Actual'); setSchedrptOpen(true); }}>
              Report Actual Schedule
            </MenuItem>
            <MenuItem onClick={() => { setRpt('Projected'); setSchedrptOpen(true); }}>
              Projected Actual Schedule
            </MenuItem>
            <MenuItem onClick={() => { setRpt('SampleOnOffSiteActual'); setSchedrptOpen(true); }}>
              Sample On/Off Site - Actual
            </MenuItem>
            <MenuItem onClick={() => { setRpt('SampleOnOffSiteProjected'); setSchedrptOpen(true); }}>
              Sample On/Off Site - Projected
            </MenuItem>
            <MenuItem onClick={() => setChartSimpleOpen(true)}>Param Chart</MenuItem>
          </MenuDropdown>
        </nav>

        <img src="/tagline.png" alt="Tagline" className="h-5 w-auto" />

        <div className="flex items-center space-x-4">
          <UserAvatar />
          <button
            onClick={() => handleLogout('redirect')}
            className="flex items-center text-navy hover:text-indigo-700 transition-colors duration-200"
          >
            <span className="font-semibold mr-2">{user?.name}</span>
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {weatherOpen && <Weather closeModal={() => setWeatherOpen(false)} />}
      {chartSimpleOpen && <ChartSimple closeModal={() => setChartSimpleOpen(false)} />}
      {rackrptOpen && <RptRack closeModal={() => setRackrptOpen(false)} />}
      {schedrptOpen && <ScheduleActual Rpt={rpt} closeModal={() => setSchedrptOpen(false)} />}
    </header>
  )
}

export default Header