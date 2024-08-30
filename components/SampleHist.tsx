"use client"

import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { CategoryScale, Chart as ChartJS, LinearScale, BarElement, PointElement, LineElement, Legend, Tooltip } from "chart.js";
import { Circles } from 'react-loader-spinner';
import { getToken, msalInstance } from "@/msal/msal";
import { Button, Paper, Typography, Box, Container, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

ChartJS.register(LinearScale, CategoryScale, BarElement, PointElement, LineElement, Legend, Tooltip);

interface ChartItem {
  cnt: number;
  title: string;
}

type Props = {
  sampleid: number;
  SeriesID: number;
  closeModal: () => void;
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
}));

export const SampleHist = ({ closeModal, sampleid, SeriesID }: Props) => {
  const user = msalInstance.getActiveAccount();
  const [loading, setLoading] = useState(true);
  const [repair, setRepair] = useState<any>(null);
  const [customerEmail, setCustomerEmail] = useState('');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
   
    await fetchData();
    setLoading(false);
  };

  const fetchData = async () => {
    setLoading(true);
    const endpoint = `https://allungawebapicore.azurewebsites.net/api/SampleHistoryCht/{id}?SampleID=${sampleid}`;
    const result = await AddHeaderBearerToEndpoint(endpoint);
    
    const chartItems: ChartItem[] = result.map((item: any) => ({
      cnt: item.cnt,
      title: item.title
    }));

    const data = {
      labels: chartItems.map(it => it.title),
      datasets: [{
        type: 'bar' as const,
        label: 'Samples on site/ off site over time',
        backgroundColor: 'Navy',
        borderColor: 'Navy',
        borderWidth: 2,
        hoverBackgroundColor: 'Navy',
        hoverBorderColor: 'Navy',
        data: chartItems.map(it => it.cnt)
      }]
    };

    setRepair(data);
    setCustomerEmail(JSON.stringify(data));
  };

  const emailCustomer = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    await sendChartEmail(customerEmail, 'On/Off site');
  };

  const options = {
    scales: {
      y: {
        max: 1,
        min: -1,
        ticks: {
          callback: function(value: any) {
            if (value === 1) return 'On Site';
            if (value === -1) return 'Off Site';
            return '';
          }
        },
        beginAtZero: true,
      },
    },
  };

  async function AddHeaderBearerToEndpoint(endpoint: string) {
    const token = await getToken();
    const headers = new Headers();
    const bearer = `Bearer ${token}`;
    headers.append('Authorization', bearer);

    const options = {
      method: 'GET',
      headers: headers,
    };
    const response = await fetch(endpoint, options);
    return await response.json();
  }

  async function sendChartEmail(chartdata: string, title: string) {
    setLoading(true);
    const formData = new FormData();
    formData.append('data', chartdata);
    const email = user?.username.toString()!;
    formData.append('recipient', email);
    formData.append('labels', title);

    const resp = await fetch('/api/contact', {
      method: "post",
      body: formData,
    });

    if (resp.ok) {
      const responseData = await resp.json();
      alert('Message successfully sent');
    } else {
      console.error("Error sending email");
    }
    setLoading(false);
  }

  return (
    <div className="modal-container">
    <Container maxWidth="md">
      <StyledPaper elevation={3}>
        <Typography variant="h4" gutterBottom>
          Sample History
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
          <>
            {repair && (
              <Box mb={3}>
                <Bar options={options} data={repair} />
              </Box>
            )}
            <Box display="flex" justifyContent="space-between">
              <Button variant="contained" color="primary" onClick={emailCustomer}>
                Email Chart
              </Button>
              <Button variant="outlined" color="secondary" onClick={closeModal}>
                Close
              </Button>
            </Box>
          </>
        )}
      </StyledPaper>
    </Container>
    </div>
  );
};

export default SampleHist;