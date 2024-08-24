import "@/components/part.css";
import { ChangeEvent, useEffect, useState } from "react";
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css'
import { getToken, msalInstance } from "@/msal/msal";
import Button from '@mui/material/Button';

type Props = {
    report: reportrow;
    closeModal:  () => void;
  };

  interface reportrow{
    reportid:number;
    reportname:string;
    bookandpage:string;
    reportstatus:string;
    return_elsereport:boolean;
    deleted:boolean;
    comment:string;
    completedDate:Date;
    date:Date;
    DaysInLab:number;
  }
const ReportDet =({report, closeModal}:Props) => {
  const [reportDate, setReportDate] = useState(new Date());
  const [data, setData] = useState<reportrow>(report);
  const [units] = useState(["N", "A", "C", "S"]);
  const [completedDate, setCompletedDate] = useState(new Date());
  const handleChangeReport = (e:ChangeEvent<HTMLInputElement>) => {
    if (dirty==false)
    {
    setDirty(true);
    }
    setData({ ...data!, [e.target.name]: e.target.value });
  };
  const handleChangeTextArea = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setData({ ...data!, [e.target.name]: e.target.value });
    setDirty(true);
  }
  const handleCheckReport = (e:ChangeEvent<HTMLInputElement>) => {
    if (dirty==false)
      {
      setDirty(true);
      }
    if (e.target.checked)
      {
      setData({ ...data!, [e.target.name]: true});
      }
    else{
      setData({ ...data!, [e.target.name]: false});
    }
  };

  const handleChangeReportSelect = (e:ChangeEvent<HTMLSelectElement>) => {
    if (dirty==false)
    {
    setDirty(true);
    }
    setData({ ...data!, [e.target.name]: e.target.value });
  };
  const [dirty,setDirty]=useState(false);

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    await saveReport();//reportidx);
  }

  const saveReport = async () => {
    setDirty(false);
    const dta={ ...data, 'date':new Date(reportDate), 'completedDate': new Date(completedDate)  }
    /*data.date = moment(reportDate).format("YYYY-MM-DD HH:mm:ss");*/
    setData(dta);

    //data.completeddate = moment(completedDate).format("YYYY-MM-DD HH:mm:ss");
    //setData({ ...data, 'completeddate': moment(completedDate).format("YYYY-MM-DD HH:mm:ss") });

    const token = await getToken()
    const headers = new Headers()
    const bearer = `Bearer ${token}`
    headers.append('Authorization', bearer)
    headers.append('Content-type', "application/json; charset=UTF-8")
    var method = (data.reportid!=0)?'PUT':'POST'; 
 
    const options = {
      method: method,
      body: JSON.stringify(data),
      headers: headers,
    }
    
    const saveurl = `https://allungawebapi.azurewebsites.net/api/Reports/` + ((data.reportid==0)?"":data.reportid.toString());
    const response = fetch(saveurl, options);
    var ee = await response;
    if (!ee.ok) {
      throw Error((ee).statusText);
    }
    alert('saved');
  }
  const user = msalInstance.getActiveAccount();
  async function sendEmail() {
     const formData = new FormData();
     const email = user?.username.toString()!;
    formData.append('recipient', email);
    formData.append('labels', data!.reportname+ ' report has been completed');
  
    const resp = await fetch('/api/contact', {
      method: "post",
      body: formData, //,email:'timhams@gmail.com'
    });
    if (!resp.ok) {
      console.log("falling over")
      console.log(resp.json)
      console.log("await resp.json()")
       }
  else
  {
  const responseData = await resp.json();
  console.log(resp.status);
  console.log(responseData['message']);   
  alert('Message successfully sent');
  }
    //setLoading(false);
  
  }

    return  <div className="modal-container">
      <div style={{width:'900px',backgroundColor:'white'}}>
    <div className="modal" style={{width:'900px',backgroundColor:'whitesmoke',display:'flex',justifyContent:'space-between'}} >
<h1 style={{fontSize:'24px',fontWeight:'bold'}}>Report Details</h1>
<Button type="submit" variant="outlined" onClick={(e)=>{e.preventDefault();closeModal()}}>Close</Button>
</div>

    <form>
      <table style={{width:'100%'}}>
    <tr>
       <td><b>Report Date:</b></td>
        <td><DatePicker format="dd/MM/yyyy" onSelect={setReportDate}  value={reportDate} />
        <a href={'https://allungardlc.azurewebsites.net/Matrix.aspx?ReportID='+data!.reportid} target="new"><Button variant="outlined">Report/Print</Button></a></td>
        <td><b>Name:</b></td>
        <td><input  type="text" name="reportname" onChange={handleChangeReport} value={data!.reportname} /></td>
      </tr>
      <tr style={{backgroundColor:'whitesmoke'}}>      
                <td><b>Book & Page:</b></td>
                <td><input className='bg-gray-50' type="text" name="bookandpage" onChange={handleChangeReport} value={data!.bookandpage} /></td>
                <td><b>Report Status:</b></td>
                <td><input type="text" name="reportstatus" onChange={handleChangeReport} value={data!.reportstatus} /></td>
          </tr>
       <tr>
        <td><b>Report Status:</b></td>
         <td><select name="reportstatus" onChange={handleChangeReportSelect}>
          {
          units.map((ep,i)=>{
            return (
              <option value={ep} selected={(ep==data!.reportstatus)?true:false}>{ep}</option>
            )})
          }
          </select>
          </td>
       <td><b>Return (else Report)</b></td>
       <td><input type="checkbox" name="return_elsereport" onChange={handleCheckReport} checked={data!.return_elsereport} /></td>
        </tr>
        <tr style={{backgroundColor:'whitesmoke'}}>
       <td> <b>Comment:</b></td>
       <td colSpan={3}><textarea cols={120}  style={{width:'100%'}}  name="comment" onChange={handleChangeTextArea} value={data!.comment} />
       </td>
        </tr>
       
       <tr>       
                <td><b>Deleted:</b></td>
                <td><input type="checkbox" name="deleted" onChange={handleCheckReport} checked={data!.deleted} />
                </td>
<td> 
  <b>Completed Date</b>
                  <DatePicker format="dd/MM/yyyy" onSelect={setCompletedDate} value={completedDate} />
                  </td>
                  </tr>
                  
       <tr style={{backgroundColor:'whitesmoke'}}>
                 <td colSpan={2}>

            {dirty?
                <button style={{backgroundColor:'red',color:'white'}} onClick={handleSubmit}>
                  Submit
                </button>
                :
                <p style={{color:'red'}}>no changes have been made</p>
              }
                 </td>
                 
                 <td><b>Email report to client</b></td>
<td><Button variant="outlined" onClick={(e)=>{e.preventDefault(); sendEmail();}}>Email</Button></td>
        </tr>
        </table>
  </form>
   </div></div>
}

export default ReportDet