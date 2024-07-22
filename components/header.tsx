
import {  msalInstance } from "@/msal/msal";

import ChartSimple from "@/components/chartsimple";
import { handleLogout } from "@/msal/msal";
import Link from "next/link";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import LogoutIcon from '@mui/icons-material/Logout';
import UserAvatar from "@/components/UserAvatar";
import { useState } from "react";
//import { useState } from "react";


const Header = () => {



  const [chartSimpleOpen,setChartSimpleOpen] = useState(false);

    const user = msalInstance.getActiveAccount();
   /* */
    return (
        <div style={{display: 'flex',justifyContent:'space-between',alignItems: 'center'}}>


{chartSimpleOpen && <ChartSimple closeModal={()=>{setChartSimpleOpen(false)}}/>}
        <img style={{height:"83px",width:"342px"}}
                      src="/logo.png"/>
      
      <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          Home
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
              href="/"
              className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
            >
              Search
            </Link>
          </MenuItem>
         
        
          <form action="#" method="POST">
            <MenuItem>
              <button
                type="submit"
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
              >
                Sign out
              </button>
            </MenuItem>
          </form>
        </div>
      </MenuItems>
    </Menu>

    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          Data
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
              href="/parameters"
              className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
            >
              Parameters
            </Link>
          </MenuItem>
          <MenuItem>
            <Link 
              href="/exposuretypes"
              className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
            >
              Exposure Types
            </Link>
          </MenuItem>
          <MenuItem>
            <Link 
              href="/clientsearch"
              className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
            >
              Client Search
            </Link>
          </MenuItem>
        </div>
      </MenuItems>
      
    </Menu>
   
    
       <img style={{height:"20px",width:"380"}}
                      src="/tagline.png"/>


       <div style={{color:'Navy',alignItems: 'center',display:'flex',justifyContent:'space-between'}} ><UserAvatar/><button onClick={(e)=>{e.preventDefault();handleLogout("redirect");}}><b>{user?.name}</b><LogoutIcon/></button>   
       </div>
       <div>

       </div>
</div>

   
    );
  };
  export default Header;

  /*
  <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          Reports
          <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-400" />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <div className="py-1">
          <MenuItem>
        
          <button        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
       onClick={(e)=>{e.preventDefault(); setrackrptOpen(true);}}>Rack Report</button>
          </MenuItem>
          <MenuItem>
        
        <button        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
       onClick={(e)=>{e.preventDefault(); setChartSimpleOpen(true);}}>Param Chart</button>
        </MenuItem>
        </div>
      </MenuItems>

    </Menu>
  */

    /* <MenuItem>
            <a
              href="/charts"
              className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
            >
              Daily Charts
            </a>
          </MenuItem>*/