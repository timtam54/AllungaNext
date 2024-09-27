"use client"

import React, { ChangeEvent, useEffect, useState } from "react";
import { getToken, msalInstance } from "@/msal/msal";


import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import { 
  Button, 
  TextField, 
  Checkbox, 
   FormControlLabel, 
  Typography, 
  Box, 
  Paper, 
  Grid,
  Container,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import ClientEmails from "./clientemails";
import ExcelReadings from "./ExcelReadings";

type Props = {
  report: reportrow;
  closeModal: () => void;
};

interface reportrow {
  reportid: number;
  reportname: string;
  bookandpage: string;
  reportstatus: string;
  return_elsereport: boolean;
  deleted: boolean;
  comment: string;
  completedDate: Date;
  date: Date;
  DaysInLab: number;
}

interface Sample {
  SampleOrder: number;
  Number:number;
  description:string;
  SampleID:number;
}
interface Comments{
  SampleID:number,
  Comment:string,
  ReportID:number
}
interface Reading{
  Readingid:number, 
  Paramid:number,
  sampleid:number,
  value:string,
  reportid:number,
  deleted:boolean
}
interface Params{

  ParamID:number,
  ParamName:string;
  Ordering?:number;
}

interface ClientEmail {
  email: string;
  role: string;
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const ReportDet = ({ report, closeModal }: Props) => {

  const [dataSample, setDataSample] = useState<Sample[]>([]);
    const [dataComments, setDataComments] = useState<Comments[]>([]);
      const [dataReading, setDataReading] = useState<Reading[]>([]);
      const [dataParam, setDataParam] = useState<Params[]>([]);

  useEffect(() => { getData(report.reportid) }  , [report]);

  const getData = async (rptid:number) => {
    const urlParam = `https://allungawebapi.azurewebsites.net/api/Params/int/` + rptid.toString();
        const token = await getToken()
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
        const params:Params[] = await ee.json();
        setDataParam(params);
        console.table(params);
        const urlSample = `https://allungawebapi.azurewebsites.net/api/Samples/report/` + rptid;

      const resp = fetch(urlSample, options);
      var ee = await resp;
      if (!ee.ok) {
        throw Error((ee).statusText);
      }
      const sample:Sample[] = await ee.json();
      setDataSample(sample);
      console.table(sample);
      const urlCom= `https://allungawebapi.azurewebsites.net/api/Comments/` + rptid.toString(); 
      const responsec = fetch(urlCom, options);
      var ee = await responsec;
      if (!ee.ok) {
        throw Error((ee).statusText);
      }
      const comments = await ee.json();
      setDataComments(comments);

    const urlReading = `https://allungawebapi.azurewebsites.net/api/Readings/` + rptid.toString();
   
    const responseR = fetch(urlReading, options);
    var ee = await responseR;
   
    const readings = await ee.json();
    setDataReading(readings);
  }

  const [reportDate, setReportDate] = useState<Date | null>(new Date(report.date));
  const [data, setData] = useState<reportrow>(report);
  const [units] = useState(["N", "A", "C", "S"]);
  const [completedDate, setCompletedDate] = useState<Date | null>((report.completedDate==null)?null:new Date(report.completedDate));
  const [dirty, setDirty] = useState(false);

  const handleChangeReport = (e: ChangeEvent<HTMLInputElement>) => {
    if (!dirty) {
      setDirty(true);
    }
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleChangeTextArea = (e: ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setDirty(true);
  };

  const handleCheckReport = (e: ChangeEvent<HTMLInputElement>) => {
    if (!dirty) {
      setDirty(true);
    }
    setData({ ...data, [e.target.name]: e.target.checked });
  };

  const handleChangeReportSelect = (e: ChangeEvent<HTMLSelectElement>) => { 
    if (!dirty) {
      setDirty(true);
    }
    setData({ ...data, 'reportstatus': e.target.value as string });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveReport();
  };

  const saveReport = async () => {
    setDirty(false);
    const updatedData = { 
      ...data, 
      date: reportDate || new Date(), 
      completedDate: completedDate || new Date() 
    };
    setData(updatedData);

    const token = await getToken();
    const headers = new Headers();
    const bearer = `Bearer ${token}`;
    headers.append('Authorization', bearer);
    headers.append('Content-type', "application/json; charset=UTF-8");
    const method = (data.reportid !== 0) ? 'PUT' : 'POST';

    const options = {
      method: method,
      body: JSON.stringify(updatedData),
      headers: headers,
    };

    const saveurl = `https://allungawebapi.azurewebsites.net/api/Reports/${data.reportid || ''}`;
    try {
      const response = await fetch(saveurl, options);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      alert('Saved successfully');
    } catch (error) {
      alert('Error saving report');
      console.error('Error:', error);
    }
  };

  const user = msalInstance.getActiveAccount();

 
  const [email, setEmail] = useState<ClientEmail[]>([])
  const sendEmail = async () => {
     const ep='https://allungawebapicore.azurewebsites.net/api/ClientsEmail/{reportid}?reporid='+report.reportid.toString();
      const response = await fetch(ep);
      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }
      const result = await response.json()
      setEmail(result);

      var email = user?.username|| '';
      alert(email);
     // result.forEach((element:ClientEmail) => {
     //   email+=";"+element.email;
     // });
      const formData = new FormData();
      formData.append('recipient', email);
    formData.append('labels', `${data.reportname} report has been completed`);
    try {
      const resp = await fetch('/api/contact', {
        method: "post", 
        body: formData,
      });
      if (!resp.ok) {
        throw new Error('Failed to send email');
      }
      const responseData = await resp.json();
      console.log(responseData['message']);
      alert('Message successfully sent');
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email');
    }
  };

  const setCompletedDateX=async(value:any)=>{
    setDirty(true);
    if (value==null)return;

    setCompletedDate(value!);
 }

  const setReportDateX=async(value:any)=>{
    setDirty(true);
    if (value==null)return;
    setReportDate(value!);
   
 }

 const [modalEmail,setModalEmail]=useState(false);
  return (
    <div className="modal-container">
      {modalEmail && <ClientEmails id={report.reportid} closeModal={()=>{setModalEmail(false)}} />}
    <ThemeProvider theme={theme}>
      <Container maxWidth="md">
        <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h4">Report Details</Typography>
            <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    disabled={!dirty}>
                    Submit
                  </Button>
            <Button variant="outlined" onClick={closeModal}>Close</Button>
          </Box>
          <form>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                
              <p>Report Date:</p>
              <DatePicker dateFormat="dd/MM/yyyy" onChange={setReportDateX}  selected={reportDate} />
       
                
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  name="reportname"
                  value={data.reportname}
                  onChange={handleChangeReport}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Book & Page"
                  name="bookandpage"
                  value={data.bookandpage}
                  onChange={handleChangeReport}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
              Report Status-           
                <select
                  name="reportstatus"
                  value={data.reportstatus}
                  onChange={handleChangeReportSelect}
                >
                  {units.map((unit) => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={data.return_elsereport}
                      onChange={handleCheckReport}
                      name="return_elsereport"
                    />
                  }
                  label="Return (else Report)"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <p>Completed Date</p>
                <DatePicker
                 dateFormat="dd/MM/yyyy" 
                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                 

                 onChange={setCompletedDateX} 
                 selected={completedDate} />
   
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Comment"
                  name="comment"
                  value={data.comment}
                  onChange={handleChangeTextArea}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={data.deleted}
                      onChange={handleCheckReport}
                      name="deleted"
                    />
                  }
                  label="Deleted"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between">
                  <ExcelReadings params={dataParam} samples={dataSample} comments={dataComments} readings={dataReading} />
                  <Button variant="outlined" color="secondary" onClick={(e:any)=>{e.preventDefault();setModalEmail(true);}}>Clients Email recipients</Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={(e) => {
                      e.preventDefault();
                      sendEmail();
                    }}
                  >
                    Email Report to Client.
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </ThemeProvider></div>
  );
};

export default ReportDet;