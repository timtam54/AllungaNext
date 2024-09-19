'use client'

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { msalInstance, handleLogout } from '@/msal/msal'
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton } from '@mui/material'
import { Menu as MenuIcon } from '@mui/icons-material'
import { Home, Database, FileText, CloudSun, LogOut,ChevronDown } from 'lucide-react'

import ChartSimple from '@/components/chartsimple'
import UserAvatar from '@/components/UserAvatar'
import ScheduleActual from '@/components/ScheduleActual'
import Weather from './weather'

export default function Component() {
  const [drawerOpen, setDrawerOpen] = useState<string | null>(null)
  const [chartSimpleOpen, setChartSimpleOpen] = useState(false)
  const [rpt, setRpt] = useState('Actual')
  const [schedrptOpen, setSchedrptOpen] = useState(false)
  const [weatherOpen, setWeatherOpen] = useState(false)

  const user = msalInstance.getActiveAccount()

  const toggleDrawer = (menuName: string | null) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return
    }
    setDrawerOpen(menuName)
  }

  const MenuItem = ({ icon, text, onClick }: { icon: ReactNode; text: string; onClick?: () => void }) => (
    <ListItem button onClick={onClick}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={text} />
    </ListItem>
  )

  const MenuDropdown = ({ title, menuName, icon }: { title: string; menuName: string; icon: ReactNode }) => (
    <button
      onClick={toggleDrawer(menuName)}
      className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      {icon}
      <span className="ml-2">{title}</span>
      <ChevronDown className="w-5 h-5 ml-2 -mr-1 text-gray-400" aria-hidden="true" />
    </button>
  )

  const homeMenu = (
    <List>
      <MenuItem icon={<Home />} text="Search" onClick={() => { setDrawerOpen(null) }} />
      <MenuItem icon={<LogOut />} text="Sign out" onClick={() => { handleLogout('redirect'); setDrawerOpen(null) }} />
    </List>
  )

  const dataMenu = (
    <List>
      <MenuItem icon={<Database />} text="Parameters" onClick={() => { setDrawerOpen(null) }} />
      <MenuItem icon={<Database />} text="Exposure Types" onClick={() => { setDrawerOpen(null) }} />
      <MenuItem icon={<Database />} text="Client Search" onClick={() => { setDrawerOpen(null) }} />
    </List>
  )

  const reportsMenu = (
    <List>
      <MenuItem icon={<FileText />} text="Rack Report" onClick={() => { setDrawerOpen(null) }} />
      <MenuItem 
        icon={<CloudSun />} 
        text="Weather - last week" 
        onClick={() => { setWeatherOpen(true); setDrawerOpen(null) }} 
      />
      <MenuItem 
        icon={<FileText />} 
        text="Report Actual Schedule" 
        onClick={() => { setRpt('Actual'); setSchedrptOpen(true); setDrawerOpen(null) }} 
      />
      <MenuItem 
        icon={<FileText />} 
        text="Projected Actual Schedule" 
        onClick={() => { setRpt('Projected'); setSchedrptOpen(true); setDrawerOpen(null) }} 
      />
      <MenuItem 
        icon={<FileText />} 
        text="Sample On/Off Site - Actual" 
        onClick={() => { setRpt('SampleOnOffSiteActual'); setSchedrptOpen(true); setDrawerOpen(null) }} 
      />
      <MenuItem 
        icon={<FileText />} 
        text="Sample On/Off Site - Projected" 
        onClick={() => { setRpt('SampleOnOffSiteProjected'); setSchedrptOpen(true); setDrawerOpen(null) }} 
      />
      <MenuItem 
        icon={<FileText />} 
        text="Param Chart" 
        onClick={() => { setChartSimpleOpen(true); setDrawerOpen(null) }} 
      />
    </List>
  )

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <img src="/logo.png" alt="Logo" className="h-16 w-auto" />

        <nav className="flex items-center space-x-4">
          <MenuDropdown title="Home" menuName="home" icon={<Home className="w-5 h-5" />} />
          <MenuDropdown title="Data" menuName="data" icon={<Database className="w-5 h-5" />} />
          <MenuDropdown title="Reports" menuName="reports" icon={<FileText className="w-5 h-5" />} />
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

      <Drawer anchor="left" open={drawerOpen === 'home'} onClose={toggleDrawer(null)}>
        {homeMenu}
      </Drawer>

      <Drawer anchor="left" open={drawerOpen === 'data'} onClose={toggleDrawer(null)}>
        {dataMenu}
      </Drawer>

      <Drawer anchor="left" open={drawerOpen === 'reports'} onClose={toggleDrawer(null)}>
        {reportsMenu}
      </Drawer>

      {weatherOpen && <Weather closeModal={() => setWeatherOpen(false)} />}
      {chartSimpleOpen && <ChartSimple closeModal={() => setChartSimpleOpen(false)} />}
      {schedrptOpen && <ScheduleActual Rpt={rpt} closeModal={() => setSchedrptOpen(false)} />}
    </header>
  )
}