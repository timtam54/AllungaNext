
import {  msalInstance } from "@/msal/msal";
import SignOutButton from '@/components/SignOutButton'
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import Dropdown from 'react-bootstrap/Dropdown';
import  '@/components/globals.css'

import SearchIcon from '@mui/icons-material/Search';
const Header = () => {
    const user = msalInstance.getActiveAccount();
    return (
        <div style={{display: 'flex',justifyContent:'space-between',alignItems: 'center'}}>
        <img style={{height:"83px",width:"342px"}}
                      src="/logo.png"/>
        <Dropdown>
      <Dropdown.Toggle style={{backgroundColor:'black',color:'white'}} >
      Home
      </Dropdown.Toggle>
      <Dropdown.Menu >
      <Dropdown.Item href="/"><SearchIcon />Series Search</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
       <img style={{height:"20px",width:"380"}}
                      src="/tagline.png"/>

       <div style={{alignItems: 'center', justifyContent: 'center'}}>
       <div style={{color:'black',alignItems: 'center'}}>User:{user?.username}</div>
   
       <div style={{color:'red',alignItems: 'center',display:'flex',justifyContent:'space-between'}} >       <h3 style={{color:'black'}}><b><SpaceDashboardIcon/>Dashboard</b></h3>  <SignOutButton />  </div>
</div>

       </div>
   
    );
  };
  export default Header;

  /*
  <link
      rel="stylesheet"
      href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
      integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
      crossorigin="anonymous"
    />*/