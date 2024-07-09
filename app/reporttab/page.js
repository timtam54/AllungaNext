"use client"
import React, { useState, useEffect, Component } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Link from "next/link";
import { Circles } from 'react-loader-spinner'

import { useSearchParams } from "next/navigation";

import ArrowBack from '@mui/icons-material/ArrowBack';
import moment from 'moment';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import Button from '@mui/material/Button';

export default function ReportTab() {
  const [loading, setLoading] = useState(true);
  const [units] = useState(["N", "A", "C", "S"]);
 
  const [value, setValue] = React.useState('1');
  const searchParams = useSearchParams();
  const [reportidx, setReportidx] = useState(searchParams.get("id"));//.id
  const [reportDate, setReportDate] = useState(new Date());
  const [completedDate, setCompletedDate] = useState(new Date());
  const seriesid = searchParams.get("seriesid");//.id
  const [dataReport, setdataReport]  = React.useState([]);//location.state.dataReport

  const handleChange = (event, newValue) => {
    ChangeTab(newValue,reportidx);
  }

  const ChangeTab = (newValue,rptid) => {
    if (dirty)
    {
      const confirm = {
        title: 'Data Modified',
        message: 'Data has been modified - do you wish to save first',
        buttons: [
          {
            label: 'Yes',
            onClick: () => {
              if (value==1)
              {
                 saveReport(rptid);
              }
              else if (value==2)
              {
                saveParam(rptid);
              }
              else{
                saveReadings();
                saveComments();
                
              }
              setDirty(false);
            }
          },
          {
            label: 'No',
            onClick: () => { getData(newValue,rptid);setValue(newValue);}
           
          }
        ],
        closeOnEscape: true,
        closeOnClickOutside: true,
        keyCodeForClose: [8, 32],
        willUnmount: () => {},
        afterClose: () => {},
        onClickOutside: () => {},
        onKeypress: () => {},
        onKeypressEscape: () => {},
        overlayClassName: "overlay-custom-class-name"
    };
    confirmAlert(confirm);
  }
    else
{

    setValue(newValue);
    getData(newValue,rptid);

}
  }
  
  const [dirty,setDirty]=useState(false);

  const [data, setData] = useState([]);

  const fetchInfo = async (rptid) => {
    if (rptid==0)
    {
      setData({reporid:0,reportname:'new report',date:new Date(),deleted:false})
      return;
    }
    setDirty(false);

    const token = await bearerToken()
    const headers = new Headers()
    const bearer = `Bearer ${token}`
    headers.append('Authorization', bearer)
    const options = {
      method: 'GET',
      headers: headers,
    }
    const urlrep=`https://allungawebapi.azurewebsites.net/api/Reports/int/` + rptid;
    const response = fetch(urlrep, options);
    var ee = await response;
    if (!ee.ok) {
      throw Error((ee).statusText);
    }
    const json = await ee.json();
    console.log(json);
    var xx = moment(json.date).toDate();
    setReportDate(xx);
    if (json.completeddate != null) {
      var yy = moment(json.completeddate).toDate();
      setCompletedDate(yy);
    }
    else {
      setCompletedDate(null);
    }
    setData(json);
    
  }

  const handleChangeReport = (e) => {
    if (dirty==false)
    {
    setDirty(true);
    }
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleCheckReport = (e) => {
    if (e.target.checked) {
      setData({ ...data, [e.target.name]: true });
    }
    else {
      setData({ ...data, [e.target.name]: false });
    }
  };
  
  const handleSubmit = async e => {
    e.preventDefault();
    await saveReport(reportidx);
  }

  const saveReport = async (rptid) => {
    setDirty(false);
    data.date = moment(reportDate).format("YYYY-MM-DD HH:mm:ss");
    setData({ ...data, 'date': moment(reportDate).format("YYYY-MM-DD HH:mm:ss") });

    data.completeddate = moment(completedDate).format("YYYY-MM-DD HH:mm:ss");
    setData({ ...data, 'completeddate': moment(completedDate).format("YYYY-MM-DD HH:mm:ss") });

    const token = await bearerToken()
    const headers = new Headers()
    const bearer = `Bearer ${token}`
    headers.append('Authorization', bearer)
    headers.append('Content-type', "application/json; charset=UTF-8")
    var method = (rptid!=0)?'PUT':'POST'; 
 
    const options = {
      method: method,
      body: JSON.stringify(data),
      headers: headers,
    }
    
    const saveurl = `https://allungawebapi.azurewebsites.net/api/Reports/` + ((rptid==0)?"":rptid.toString());
    const response = fetch(saveurl, options);
    var ee = await response;
    if (!ee.ok) {
      throw Error((ee).statusText);
    }
    alert('saved');
  }


  const getData = async (val,rptid) => {
    if (val==1)
    {
      setLoading(true);//loading=true;//
      await fetchInfo(rptid);
      setLoading(false);//loading=false;//
    }
    else if (val==2)
    {
      setLoading(true);
      await fetchParamsAll(rptid);
      await fetchParam(rptid);
      setLoading(false);
    }
    else
    {
      setLoading(true);//loading=true;//
      if (dataParamsAll.length==0)
      {

        await fetchParamsAll(rptid);
        await fetchParam(rptid);
      }
      await fetchSample(rptid);
      await fetchReading(rptid);
      await fetchComments(rptid);
      setLoading(false);//loading=false;//
    }
    
  }


  useEffect(() => {
    getData('1',reportidx);
   // if (!dirty) return;
    function onBeforeUnload(e) {
        e.preventDefault();
        return (e.returnValue = "");
    };
    window.addEventListener('beforeunload',onBeforeUnload,{capture:true});
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  },[]);//dirty

  const selectreport = async (_reportid) => {
    if (_reportid==0)
    {
      setdataReport([...dataReport,{reportstatus:'N',reporid:0,reportname:'new report',date:new Date(),deleted:false}]);
    }
    setReportidx(_reportid);
    ChangeTab('1',_reportid);

    return false;
  }


  const [dataParamsAll, setDataParamsAll] = useState([]);

  const fetchParamsAll = async (rptid) => {
    const url = `https://allungawebapi.azurewebsites.net/api/ReportParams/` + rptid;
    const token = await bearerToken()
    const headers = new Headers()
    const bearer = `Bearer ${token}`
    headers.append('Authorization', bearer)
    const options = {
      method: 'GET',
      headers: headers,
    }
    const response = fetch(url, options);
    var ee = await response;
    if (!ee.ok) {
      throw Error((ee).statusText);
    }
    const json = await ee.json();
    console.log(json);
    setDataParamsAll(json);
   

  }
  const handleSubmitParam = async (e) => {
    e.preventDefault();
    await saveParam(reportidx);
  }
  const saveParam = async (rptid) => {
    var ret = dataParamsAll.filter(x => x.selected == true);
    var rt = ret.map(t => t.paramid);

    ////////////////
    const token = await bearerToken()
    const headers = new Headers()
    const bearer = `Bearer ${token}`
    headers.append('Authorization', bearer)
    headers.append('Content-type', "application/json; charset=UTF-8")

    const options = {
      method: 'PUT',
      body: JSON.stringify(rt),
      headers: headers,
    }

    const response = fetch(`https://allungawebapi.azurewebsites.net/api/ReportParams/` + rptid, options);
    var ee = await response;
    if (!ee.ok) {
      throw Error((ee).statusText);
    }
    setDirty(false);
    alert('saved');


  }


 const saveComments= async () => {
  const token = await bearerToken()
  const headers = new Headers()
  const bearer = `Bearer ${token}`
  headers.append('Authorization', bearer)
  headers.append('Content-type', "application/json; charset=UTF-8")
  const options = {
    method: 'PUT',
    body: JSON.stringify(dataComments),
    headers: headers,
  }
  const response = fetch(`https://allungawebapi.azurewebsites.net/api/Comments/` + reportidx, options);
  var ee = await response;
  if (!ee.ok) {
    throw Error((ee).statusText);
  }
  setDirty(false);
  alert('saved');
}
  const handleSubmitReading = async (e) => {
    e.preventDefault();
    saveReadings();
    saveComments();
  }

  const saveReadings= async () => {
    const token = await bearerToken()
    const headers = new Headers()
    const bearer = `Bearer ${token}`
    headers.append('Authorization', bearer)
    headers.append('Content-type', "application/json; charset=UTF-8")
    const options = {
      method: 'PUT',
      body: JSON.stringify(dataReading),
      headers: headers,
    }
    const response = fetch(`https://allungawebapi.azurewebsites.net/api/Readings/` + reportidx, options);
    var ee = await response;
    if (!ee.ok) {
      throw Error((ee).statusText);
    }
    setDirty(false);
    alert('saved');
  }
  const handleChangeComments=(e)=>{
    const xx = e.target.name.split('~');
   
    const sid = Number(xx[1]);
    const temp = [...dataComments];
    var dd = temp.find(i => i.SampleID == sid);
    if (dd==null)
    {
      let aa= {SampleID:sid,Comment:e.target.value,ReportID:reportidx};
      setDataComments([...temp,aa]);
    }
    else
    {
    dd.Comment = e.target.value;

    setDataComments([...temp]);
    }
    setDirty(true);
  }
  const handleChangeReading = (e) => {
    const xx = e.target.name.split('~');
    const pid = Number(xx[0]);
    const sid = Number(xx[1]);
    const temp = [...dataReading];
    var dd = temp.find(i => i.Paramid === pid && i.sampleid === sid);
    if (dd==null)
    {
      let aa= {Paramid:pid,sampleid:sid,value:e.target.value,reportid:reportidx};
      setDataReading([...temp,aa]);
    }
    else
    {
    dd.value = e.target.value;

    setDataReading([...temp]);
    }
    setDirty(true);
  };

  const handleCheckParams = (e) => {
    const temp = [...dataParamsAll];
    var dd = temp.find(i => i.paramid.toString() == e.target.name);

    if (e.target.checked) {
      dd.selected = true;

    }
    else {
      dd.selected = false;

    }
    setDirty(true);
    setDataParamsAll([...temp]);
  };

  const [dataSample, setDataSample] = useState([]);
  const fetchSample = async (rptid) => {
    const urlSample = `https://allungawebapi.azurewebsites.net/api/Samples/report/` + rptid;
    const token = await bearerToken()
    const headers = new Headers()
    const bearer = `Bearer ${token}`
    headers.append('Authorization', bearer)
    const options = {
      method: 'GET',
      headers: headers,
    }
    const response = fetch(urlSample, options);
    var ee = await response;
    if (!ee.ok) {
      throw Error((ee).statusText);
    }
    const json = await ee.json();
    console.log(json);
    setDataSample(json);
    
  }


  const [dataParam, setDataParam] = useState([]);
  const fetchParam = async (rptid) => {
    setDirty(false);
    const urlParam = `https://allungawebapi.azurewebsites.net/api/Params/int/` + rptid;
    const token = await bearerToken()
    const headers = new Headers()
    const bearer = `Bearer ${token}`
    headers.append('Authorization', bearer)
    const options = {
      method: 'GET',
      headers: headers,
    }
    const response = fetch(urlParam, options);
    var ee = await response;
    if (!ee.ok) {
      throw Error((ee).statusText);
    }
    const json = await ee.json();
    console.log(json);
    setDataParam(json);

  }
  const GetComments=(SampleID)=>{
    var xx = dataComments.filter((i) => i.SampleID === SampleID);
    if (xx.length > 0) {
      return xx[0].Comment;// '2';
    }
    return '';
  }

  const GetReading = (ParamID, SampleID) => {
    var xx = dataReading.filter((i) => i.Paramid === ParamID && i.sampleid === SampleID);
    if (xx.length > 0) {
      return xx[0].value;// '2';
    }
    return '';
  }

  const [dataReading, setDataReading] = useState([]);
  const fetchReading = async (rptid) => {
    setDirty(false);
    const urlReading = `https://allungawebapi.azurewebsites.net/api/Readings/` + rptid;
    const token = await bearerToken()
    const headers = new Headers()
    const bearer = `Bearer ${token}`
    headers.append('Authorization', bearer)
    const options = {
      method: 'GET',
      headers: headers,
    }
    const response = fetch(urlReading, options);
    var ee = await response;
    if (!ee.ok) {
      throw Error((ee).statusText);
    }
    const json = await ee.json();
    console.log(json);
    setDataReading(json);
    
  }
  const [dataComments, setDataComments] = useState([]);
  const fetchComments = async (rptid) => {
    const urlCom= `https://allungawebapi.azurewebsites.net/api/Comments/` + rptid;
    const token = await bearerToken()
    const headers = new Headers()
    const bearer = `Bearer ${token}`
    headers.append('Authorization', bearer)
    const options = {
      method: 'GET',
      headers: headers,
    }
    const response = fetch(urlCom, options);
    var ee = await response;
    if (!ee.ok) {
      throw Error((ee).statusText);
    }
    const json = await ee.json();
    console.log(json);
    setDataComments(json);
    
  }
  ///////////
  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <Link
        href={"/seriestab"}
        state={{ id: seriesid, name: '' }}><ArrowBack />back</Link>
      {
        dataReport.map((result, i) => {
          return (

            <td key={i} align='center' >
              {(result.reportid == reportidx) ?
                <Button variant="contained">{new Date(result.date).toLocaleDateString()} | {result.bookandpage}<br />{result.reportname}</Button>
                :
                <Button variant="outlined" onClick={() => selectreport(result.reportid)}>{new Date(result.date).toLocaleDateString()} | {result.bookandpage}<br />{result.reportname}</Button>
              }
            </td>
          )
        })
       
      }
       <td key={0} align='center'>
        <Button variant="outlined" onClick={() => selectreport(0)}>New</Button>
        </td>
  
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
    
            <Tab label="Report Detail" value="1" />
            <Tab label="Parameters" value="2" />
            <Tab label="Readings" value="3" />
         
        </Box>
       
          {loading ?
   <div class="container">
            <Circles
              height="200"
              width="200"
              color="silver"
              ariaLabel="circles-loading"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            /></div>
            :
            <table>
              <tr>
                <th>Report Date:</th>
                <td>
                  <DatePicker format="dd/MM/yyyy" onSelect={setReportDate} value={reportDate} />

                </td>
                <td>
                  <a href={'https://allungardlc.azurewebsites.net/Matrix.aspx?ReportID='+data.reportid} target="new"><Button variant="outlined">Report/Print</Button></a>
                </td>
              </tr>
              <tr>
                <th>Name:</th><td><input  type="text" name="reportname" onChange={handleChangeReport} value={data.reportname} /></td>
              </tr>
              <tr>
                <th>Book & Page:</th><td><input className='bg-gray-50' type="text" name="bookandpage" onChange={handleChangeReport} value={data.bookandpage} /></td>
              </tr>
              <tr>
                <th>Report Status:</th><td><input type="text" name="reportstatus" onChange={handleChangeReport} value={data.reportstatus} /></td>
              </tr>

              <tr>
          <th>Report Status:</th>
          <td> 
          <select name="reportstatus" onChange={handleChangeReport}>
          {
          units.map((ep,i)=>{
            return (
              <option value={ep} selected={(ep==data.reportstatus)?true:false}>{ep}</option>
            )})
          }
          </select>
      </td>
        </tr>

              <tr>
                <th>Return (else Report)</th><td><input type="checkbox" name="return_elsereport" onChange={handleCheckReport} checked={data.return_elsereport} /></td>
              </tr>
              <tr>
                <th>Deleted:</th><td><input type="checkbox" name="deleted" onChange={handleCheckReport} checked={data.deleted} /></td>
              </tr>
              <tr>
                <th>Comment:</th><td><textarea cols={120}  style={{width:'100%'}}  name="comment" onChange={handleChangeReport} value={data.comment} /></td>
              </tr>
              <tr>
                <th>Completed Date</th><td>
                  <DatePicker format="dd/MM/yyyy" onSelect={setCompletedDate} value={completedDate} />
                </td>
              </tr>
              <tr><td colSpan={2}>
            {dirty?
                <Button variant="outlined" style={{backgroundColor:'red',color:'white'}} onClick={handleSubmit}>
                  Submit
                </Button>
                :
                <div>no changes have been made</div>
              }
              </td>
              </tr>
            </table>
          }
      


   
          {loading ?
 <div class="container">
 <Circles
   height="200"
   width="200"
   color="silver"
   ariaLabel="circles-loading"
   wrapperStyle={{}}
   wrapperClass=""
   visible={true}
 /></div>
            :
            <div>
              {dirty?
              <Button variant="outlined" style={{backgroundColor:'red',color:'white'}}  onClick={handleSubmitParam}>
                Submit
              </Button>
              :
              <div>no changes have been made</div>
            }
            <br />

              <table id="table1" >

                {
                  dataParamsAll.map((result, i) => {
                    return (
                      <tr key={i} >
                        <td>{result.paramname}</td>
                        <td><input type="checkbox" name={result.paramid} onChange={handleCheckParams} checked={result.selected} /></td>
                      </tr>
                    )
                  })
                }

              </table>
            </div>
          }
 
   
          {loading ?
           <div class="container">
           <Circles
             height="200"
             width="200"
             color="silver"
             ariaLabel="circles-loading"
             wrapperStyle={{}}
             wrapperClass=""
             visible={true}
           /></div>
            :
            <div>
              <table>
                <tr>
                  <td>

               <Link to={"/rprt"} state={{id: reportidx }}><Button variant="outlined">Excel View</Button></Link>
                </td>
                <td>
                  {dirty?
                  <Button variant="outlined"  style={{backgroundColor:'red',color:'white'}} onClick={handleSubmitReading}>
                    Submit
                  </Button>
                  :
                  <div>no changes have been made</div>
                }
                </td>
                </tr>
              </table>

            <table id="table1" >
              <tr>
                <th><b>Sample No</b></th>
                <th><b>Sample Name</b></th>
                <th><b>Comments</b></th>
                {
                  dataParam.sort((a, b) => a.Ordering > b.Ordering).map((result, i) => {
                    return (
                      <th key={i} style={{ width: `30px` }} >{result.ParamName}</th>
                    )
                  })
                }
              </tr>
              {
                dataSample.sort((a, b) => a.SampleOrder > b.SampleOrder).map((result, i) => {
                  return (
                    <tr key={i} >
                      <td>{result.Number}</td>
                      <td>{result.description}</td>
                      <td key={i} >
                              <input type="text" name={'Comments~' + result.SampleID} onChange={handleChangeComments} value={GetComments(result.SampleID)} />


                            </td>
                      {
                        dataParam.sort((a, b) => a.Ordering > b.Ordering).map((paramresult, i) => {
                          return (
                            <td key={i} >
                              <input type="text" name={paramresult.ParamID + '~' + result.SampleID} onChange={handleChangeReading} value={GetReading(paramresult.ParamID, result.SampleID)} />


                            </td>
                          )
                        })
                      }
                    </tr>
                  )
                })
              }
             
            </table>
            </div>
          }
  




    </Box>
  );
}