import { msalInstance } from "@/msal/msal";
import { SignInButton } from "./SignInButton";
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { signIn } from 'next-auth/react'
import Image from "next/image";
import ClientRequestAccess from "./ClientRequestAccess";

import { useState } from "react";
export default function UnauthorizedMessage() {
  const [modal, setModal] = useState(false);
  const user = msalInstance.getActiveAccount();
    return (
        <>
       {modal && <ClientRequestAccess closeModal={()=>{setModal(false);}}/>}

        <head>
        <title>Allunga Series Reporting</title>
        <img rel="icon" src="/logo.png"/>
        </head>
        
        <body style={{width:"100%",verticalAlign:'top'}}> 
      
        <div style={{
           zIndex:-1,
           position:"fixed",
           width:"100vw",
           height:"100vh"
         }}>
         <Image alt="Tech Interface - Equipment Service Repair" layout="fill" objectFit="cover" src="/background.jpg"/>

         </div>

         <div style={{alignItems: 'center',display:'flex',justifyContent:'space-between'}}>

         <img src="logo.png" width={300} height={80} />
         <img style={{height:"20px",width:"380"}}
                      src="/tagline.png"/>
                      <div>
 <SignInButton text="Login"/>

<VpnKeyIcon/>
</div>

         </div>
        <table style={{width:'100%'}}>

<tr>
  <td></td>
</tr>
<tr>
  <td></td>
</tr>
<tr>
  <td></td>
</tr>
<tr>
  <td></td>
</tr>
<tr>
  <td></td>
</tr>
<tr>
  <td></td>
</tr>
<tr>
  <td></td>
</tr>
<tr>
  <td></td>
</tr>
<tr>
  <td></td>
</tr>
<tr>
  <td></td>
</tr>
<tr>
  <td></td>
</tr>
<tr>
  <td></td>
</tr>
<tr>
  <td></td>
</tr>
<tr>
  <td></td>
</tr>
<tr>
  <td></td>
</tr>
<tr>
  <td></td>
</tr>

<tr>
  <td></td>
</tr>
<tr>
  <td></td>
</tr>
<tr>
  <td align='center' >
    <div style={{backgroundColor:"#944780",width:"1020px",alignItems: "center",border: "1px solid #000000"}} >
     <br/>
     <div style={{color:"white",width:"640px",alignItems: "left"}}>
      <h2>Allunga Exposure Reporting system</h2>
    <br/>
    This web app manages all Client's Samples, Series, site Exposure, Reporting, and transfers.
      <br/>
      This cloud based application is written in the following technologies
      <br/>
      <ul>
        <li>The User interface is written in <a href="https://en.wikipedia.org/wiki/React_(JavaScript_library)" target="Other"><u>ReactJS</u></a>, and recently upgrade to <a href="https://en.wikipedia.org/wiki/Next.js" target="other"><u>NextJS</u></a></li>
        <br/>
        <li>The Data tier is an asp.net core Web API</li>
        <br/>
        <li>The Database is SQL Azure</li>
        <br/>
        <li>Secured by Azure active directory and MSAL/JWT - MFA</li>
      </ul>
      <br/>
      Click<SignInButton text="Login"/>
      <button className='bg-blue-200 text-blue-700 hover:bg-blue-500 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded shadow-md' onClick={()=> signIn() }>Request Access to via Third Party</button>

<VpnKeyIcon/>
to sign in 
    </div>
    <br/>
    </div>
  </td>
  </tr>
</table>

</body>


       
       </>
    )
}