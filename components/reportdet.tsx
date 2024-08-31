"use client"

import React, { ChangeEvent, useState } from "react";
import { getToken, msalInstance } from "@/msal/msal";
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css'
import { 
  Button, 
  TextField, 
  Checkbox, 
  Select, 
  MenuItem, 
  FormControlLabel, 
  Typography, 
  Box, 
  Paper, 
  Grid,
  Container,
  ThemeProvider,
  createTheme,
} from '@mui/material';

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
  const [reportDate, setReportDate] = useState<Date | null>(new Date(report.date));
  const [data, setData] = useState<reportrow>(report);
  const [units] = useState(["N", "A", "C", "S"]);
  alert(report.completedDate);
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
//  const handleChangeReportSelect = (e:  SelectChangeEvent<string>, child: ReactNode) => {  
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

  const sendEmail = async () => {
    const formData = new FormData();
    const email = user?.username || '';
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

  return (
    <div className="modal-container">
    <ThemeProvider theme={theme}>
      <Container maxWidth="md">
        <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h4">Report Details</Typography>
            <Button variant="outlined" onClick={closeModal}>Close</Button>
          </Box>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                
              <p>Report Date:</p>
              <DatePicker format="dd/MM/yyyy" onSelect={setReportDate}  value={reportDate} />
       
                
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
              Report Status
                  
                <select
                  name="reportstatus"
                  value={data.reportstatus}
                  onChange={handleChangeReportSelect}
                >
                  {units.map((unit) => (
                    <MenuItem key={unit} value={unit}>{unit}</MenuItem>
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
              <Grid item xs={12} sm={6}>
                <p>Completed Date</p>
                <DatePicker format="dd/MM/yyyy" onSelect={setCompletedDate} value={completedDate} />
   
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={!dirty}
                  >
                    Submit
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={(e) => {
                      e.preventDefault();
                      sendEmail();
                    }}
                  >
                    Email Report to Client
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