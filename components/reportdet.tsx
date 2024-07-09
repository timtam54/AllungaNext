import "@/components/part.css";
import { ChangeEvent, useEffect, useState } from "react";
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css'
import { getToken } from "@/msal/msal";
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

    return  <div className="modal-container">
    <div className="modal" style={{backgroundColor:'lightgray'}} >
<h1 style={{fontSize:'24px',fontWeight:'bold'}}>Report Details</h1>

    <button onClick={(e)=>{e.preventDefault();closeModal()}}>Close</button>
    <form>
    <div style={{display: 'flex',justifyContent:'space-between',alignItems: 'center'}}>
        
                <b>Report Date:</b>
                  <DatePicker format="dd/MM/yyyy" onSelect={setReportDate}  value={reportDate} />
              <a href={'https://allungardlc.azurewebsites.net/Matrix.aspx?ReportID='+data!.reportid} target="new"><button variant="outlined">Report/Print</button></a>
       </div>
       <div style={{display: 'flex',justifyContent:'space-between',alignItems: 'center'}}>                   
                <b>Name:</b>
                <input  type="text" name="reportname" onChange={handleChangeReport} value={data!.reportname} />
                
                </div>
       <div style={{display: 'flex',justifyContent:'space-between',alignItems: 'center'}}>      
                <b>Book & Page:</b>
                <input className='bg-gray-50' type="text" name="bookandpage" onChange={handleChangeReport} value={data!.bookandpage} />
                </div>
       <div style={{display: 'flex',justifyContent:'space-between',alignItems: 'center'}}>    
                <b>Report Status:</b>
                <input type="text" name="reportstatus" onChange={handleChangeReport} value={data!.reportstatus} />
                
                </div>
       <div style={{display: 'flex',justifyContent:'space-between',alignItems: 'center'}}>  

          <b>Report Status:</b>
          <select name="reportstatus" onChange={handleChangeReportSelect}>
          {
          units.map((ep,i)=>{
            return (
              <option value={ep} selected={(ep==data!.reportstatus)?true:false}>{ep}</option>
            )})
          }
          </select>
          </div>
       <div style={{display: 'flex',justifyContent:'space-between',alignItems: 'center'}}>         
                <b>Return (else Report)</b>
                <input type="checkbox" name="return_elsereport" onChange={handleCheckReport} checked={data!.return_elsereport} />
                </div>
       <div style={{display: 'flex',justifyContent:'space-between',alignItems: 'center'}}>       
                <b>Deleted:</b>
                <input type="checkbox" name="deleted" onChange={handleCheckReport} checked={data!.deleted} />
                </div>
       <div style={{display: 'flex',justifyContent:'space-between',alignItems: 'center'}}>  

                <b>Comment:</b>
                <textarea cols={120}  style={{width:'100%'}}  name="comment" onChange={handleChangeTextArea} value={data!.comment} />
                </div>
       <div style={{display: 'flex',justifyContent:'space-between',alignItems: 'center'}}>      

                <b>Completed Date</b>
                  <DatePicker format="dd/MM/yyyy" onSelect={setCompletedDate} value={completedDate} />
                  </div>
       <div style={{display: 'flex',justifyContent:'space-between',alignItems: 'center'}}>
                 

            {dirty?
                <button style={{backgroundColor:'red',color:'white'}} onClick={handleSubmit}>
                  Submit
                </button>
                :
                <div>no changes have been made</div>
              }
                 </div>
                 </form>
   </div></div>
}

export default ReportDet