import { msalInstance } from "@/msal/msal";
import { SignInButton } from "./SignInButton";
import VpnKeyIcon from '@mui/icons-material/VpnKey';

import Image from "next/image";
export default function UnauthorizedMessage() {
  const user = msalInstance.getActiveAccount();
    return (
        <>
        <head>
        <title>Technician Interface</title>
        <img rel="icon" src="/logo.png"/>
        </head>
        <body style={{backgroundColor:'white'}}>
      <div style={{display: 'flex',justifyContent:'space-between',alignItems: 'center'}}>
     <img style={{height:"83px",width:"342px"}}
                   src="/logo.png"/>
       Not Signed In{user?.name}<br/>
       </div>
       <div style={{
           zIndex:-1,
           position:"fixed",
           width:"100vw",
           height:"100vh"
         }}>
         <Image alt="Tech Interface - Equipment Service Repair" layout="fill" objectFit="cover" src="/background.jpg"/>

         </div>
         <br/>
         <br/>
         <br/>
         <br/>
           <h3 style={{
             paddingTop:"10 vh",
             fontFamily:"monospace",
             fontSize:"2.5rem",
             fontWeight:"bold",
             color:"red",
             textAlign:"center"
           }}> <VpnKeyIcon/><SignInButton text="Login"/></h3>
     
      
      </body>
       </>
    )
}