
import {  msalInstance } from "@/msal/msal";
import SignOutButton from '@/components/SignOutButton'
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
const Header = () => {
    const user = msalInstance.getActiveAccount();
    return (
        <div style={{display: 'flex',justifyContent:'space-between',alignItems: 'center'}}>
        <img style={{height:"83px",width:"342px"}}
                      src="/logo.png"/>
       
       <img style={{height:"20px",width:"380"}}
                      src="/tagline.png"/>

       <div style={{alignItems: 'center', justifyContent: 'center'}}>
       <div style={{color:'black',alignItems: 'center'}}>User:{user?.username}</div>
   
       <div style={{color:'red',alignItems: 'center',display:'flex',justifyContent:'space-between'}} >       <h1 style={{color:'black'}}><b><SpaceDashboardIcon/>Dashboard</b></h1>  <SignOutButton />  </div>
</div>

       </div>
   
    );
  };
  export default Header;