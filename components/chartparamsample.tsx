"use client"

import React, { useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { CategoryScale, Chart as ChartJS, LinearScale, PointElement, LineElement, Legend, Tooltip } from "chart.js";
import { getToken, msalInstance } from "@/msal/msal";
import { Button, Paper, Typography, Box, Container, CircularProgress, ThemeProvider, createTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import EmailIcon from '@mui/icons-material/Email';
import CloseIcon from '@mui/icons-material/Close';

ChartJS.register(LinearScale, CategoryScale, PointElement, LineElement, Legend, Tooltip);

interface ChartItem {
  date: Date;
  cnt: number;
  title: string;
}

type Props = {
  title: string;
  closeModal: () => void;
  sampleID: number;
  seriesid: number;
};

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

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: '12px',
  boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .1)',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
}));

const ChartParamSample = ({ title, closeModal, sampleID, seriesid }: Props) => {
  const user = msalInstance.getActiveAccount();
  const [loading, setLoading] = useState(true);
  const [repair, setRepair] = useState<any>(null);
  const [customerEmail, setCustomerEmail] = useState('');
  const chartRef = useRef<ChartJS>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const endpoint = `https://allungawebapicore.azurewebsites.net/api/ParamSampleReports/id/SampleID?id=${seriesid}&SampleID=${sampleID}`;
    const result = await AddHeaderBearerToEndpoint(endpoint);
    
    //const dates = [...new Set(result.map((item: ChartItem) => DateFormat(item.date)))];
    //const titles = [...new Set(result.map((item: ChartItem) => item.title))];
    let titles: string[] = [];
    let dates: string[] = [];
    
    for(let i=0;i<result.length ;i++)
    {
      if (!titles.includes(result[i].title))
      {
        titles.push(result[i].title);
      }
      var dte=DateFormat(result[i].date);
      if (!dates.includes(dte))
        {
          dates.push(dte);
        }
    }
    const datasets = titles.map((title, index) => ({
      label: title,
      data: dates.map(date => {
        const item = result.find((r: ChartItem) => DateFormat(r.date) === date && r.title === title);
        return item ? item.cnt : 0;
      }),
      borderColor: getColor(index),
      backgroundColor: getColor(index),
      fill: false,
    }));

    const chartData = {
      labels: dates,
      datasets: datasets,
    };

    setRepair(chartData);
    setCustomerEmail(JSON.stringify(chartData));
    setLoading(false);
  };

  const emailCustomer = async () => {
    await sendChartEmail(customerEmail, 'No of Reports/Samples per day - over last 12 months');
  };

  async function AddHeaderBearerToEndpoint(endpoint: string) {
    const token = await getToken();
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);
    const response = await fetch(endpoint, { method: 'GET', headers });
    return await response.json();
  }

  async function sendChartEmail(chartdata: string, title: string) {
    setLoading(true);
    const formData = new FormData();
    formData.append('data', chartdata);
    formData.append('recipient', user?.username || '');
    formData.append('labels', title);
    formData.append('subject', title);
    const resp = await fetch('/api/contact', { method: "post", body: formData });
    if (resp.ok) {
      alert('Message successfully sent');
    } else {
      alert('Failed to send message');
    }
    setLoading(false);
  }

  const DateFormat = (date: any) => {
    if (!date) return "";
    const dte = new Date(date);
    return `${dte.getFullYear()}-${String(dte.getMonth() + 1).padStart(2, '0')}-${String(dte.getDate()).padStart(2, '0')}`;
  };

  const getColor = (index: number) => {
    const colors = ['#1976d2', '#dc004e', '#388e3c', '#f57c00', '#8e24aa', '#d81b60', '#0288d1', '#ffa000', '#5d4037', '#7cb342'];
    return colors[index % colors.length];
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Sample Parameters Over Time',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="modal-container">
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg">
        <StyledPaper elevation={3}>
          <Typography variant="h4" gutterBottom>
            {title}
          </Typography>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Box mb={3} height="400px">
                <Line options={options} data={repair} />
              </Box>
              <Box display="flex" justifyContent="space-between">
                <StyledButton
                  variant="contained"
                  color="primary"
                  startIcon={<EmailIcon />}
                  onClick={emailCustomer}
                >
                  Email Chart
                </StyledButton>
                <StyledButton
                  variant="outlined"
                  color="secondary"
                  startIcon={<CloseIcon />}
                  onClick={closeModal}
                >
                  Close
                </StyledButton>
              </Box>
            </>
          )}
        </StyledPaper>
      </Container>
    </ThemeProvider></div>
  );
};

export default ChartParamSample;