'use client'

import UserAvatar from "./UserAvatar"

import { msalInstance, handleLogout } from '@/msal/msal'
import {  LogOut } from 'lucide-react'
export default function Component() {
  

  const user = msalInstance.getActiveAccount()

  return (
    <header>
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
      <div className="flex items-center space-x-8">
            <img src="/logo.png" alt="Logo" className="h-12 w-auto" />
            <img src="/tagline.png" alt="Tagline" className="h-4 w-auto hidden md:block" />
          </div>

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
    </header>
  )
}