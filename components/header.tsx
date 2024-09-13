'use client'

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { Menu, Transition } from '@headlessui/react'
import { msalInstance, handleLogout } from '@/msal/msal'
import AddLocationIcon from '@mui/icons-material/AddLocation';
import ChartSimple from '@/components/chartsimple'
import UserAvatar from '@/components/UserAvatar'
import ScheduleActual from '@/components/ScheduleActual'
import Radiation from '@/components/radiation'
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import Weather from './weather'
import { ChevronDown, LogOut, Home, Database, FileText, CloudSun } from 'lucide-react'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
const Header = () => {
  const [chartSimpleOpen, setChartSimpleOpen] = useState(false)
  const [rpt, setRpt] = useState('Actual')
  const user = msalInstance.getActiveAccount()
  const [radrptOpen, setRadrptOpen] = useState(false)
  const [schedrptOpen, setSchedrptOpen] = useState(false)
  const [weatherOpen, setWeatherOpen] = useState(false)

  interface MenuDropdownProps {
    title?: ReactNode;
    children?: ReactNode;
  }
  
  const MenuDropdown: React.FC<MenuDropdownProps> = ({ title, children }) => (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
        {title}
        <ChevronDown className="w-4 h-4 ml-2 -mr-1 text-gray-400" aria-hidden="true" />
      </Menu.Button>
      <Transition
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">{children}</div>
        </Menu.Items>
      </Transition>
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
            } flex items-center px-4 py-2 text-sm hover:bg-gray-50 transition duration-150 ease-in-out`}
          >
            {children}
          </Link>
        ) : (
          <button
            onClick={onClick}
            className={`${
              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
            } flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition duration-150 ease-in-out`}
          >
            {children}
          </button>
        )
      )}
    </Menu.Item>
  )

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <img src="/logo.png" alt="Logo" className="h-12 w-auto" />
          <img src="/tagline.png" alt="Tagline" className="h-4 w-auto hidden md:block" />
        </div>

        <nav className="flex items-center space-x-2 md:space-x-4">
          <MenuDropdown title={<><Home className="w-4 h-4 mr-2" />Home</>}>
            <MenuItem href="/">Search</MenuItem>
            <MenuItem href="" onClick={() => handleLogout('redirect')}>Sign out</MenuItem>
          </MenuDropdown>

          <MenuDropdown title={<><Database className="w-4 h-4 mr-2" />Data</>}>
            <MenuItem href="/parameters">Parameters</MenuItem>
            <MenuItem href="/exposuretypes">Exposure Types</MenuItem>
            <MenuItem href="/clientsearch">Client Search</MenuItem>
          </MenuDropdown>

          <MenuDropdown title={<><FileText className="w-4 h-4 mr-2" />Reports</>}>
            <MenuItem href="/rackrpt"><AddLocationIcon className="w-4 h-4 mr-2 inline" />Rack Report</MenuItem>
            <MenuItem href="" onClick={() => setWeatherOpen(true)}>
              <CloudSun className="w-4 h-4 mr-2 inline" />
              Weather - last week
            </MenuItem>
            <MenuItem href="" onClick={() => setRadrptOpen(true)}><WbSunnyIcon  className="w-4 h-4 mr-2 inline"/>Radiation</MenuItem>
            <MenuItem href="schedulereport?Rpt=Actual">
            <CalendarMonthIcon className="w-4 h-4 mr-2 inline" />
              Report Actual Schedule
            
            </MenuItem>
            <MenuItem href="schedulereport?Rpt=Projected">
            <CalendarMonthIcon className="w-4 h-4 mr-2 inline" />
              Report Projected Schedule
            
            </MenuItem>
            <MenuItem href="schedulereport?Rpt=SampleOnOffSiteActual">
            <CalendarMonthIcon className="w-4 h-4 mr-2 inline" />
            Sample On/Off Site - Actual
            
            </MenuItem>
            <MenuItem href="schedulereport?Rpt=SampleOnOffSiteProjected">
            <CalendarMonthIcon className="w-4 h-4 mr-2 inline" />
            Sample On/Off Site - Projected
            </MenuItem>
            
            <MenuItem href="" onClick={() => setChartSimpleOpen(true)}>Param Chart</MenuItem>
          </MenuDropdown>
        </nav>

        <div title={user?.name} className="flex items-center space-x-4">
          <UserAvatar  />
          <button
            onClick={() => handleLogout('redirect')}
            className="flex items-center text-gray-700 hover:text-indigo-600 transition-colors duration-200"
          >
           {/* <span className="font-medium mr-2 hidden md:inline">{user?.name}</span>*/}
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {weatherOpen && <Weather closeModal={() => setWeatherOpen(false)} />}
      {chartSimpleOpen && <ChartSimple closeModal={() => setChartSimpleOpen(false)} />}
      {schedrptOpen && <ScheduleActual Rpt={rpt} closeModal={() => setSchedrptOpen(false)} />}
      {radrptOpen && <Radiation closeModal={() => setRadrptOpen(false)} />}
    </header>
  )
}

export default Header