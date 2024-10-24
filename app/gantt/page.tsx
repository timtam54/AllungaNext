"use client"

import { getToken, msalInstance } from "@/msal/msal";
import { Circles } from 'react-loader-spinner'
import React, { ChangeEvent, useEffect, useRef, useState ,MouseEvent} from 'react';
import { CategoryScale, Chart as ChartJS, LinearScale, BarElement,PointElement,  LineElement,  Legend,  Tooltip ,InteractionItem} from "chart.js";
import {Bar, Line,getElementAtEvent,Chart } from 'react-chartjs-2';
import UserAvatar from '@/components/UserAvatar';

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip
);


interface ChartItem{
  cnt:number;
  title:string;
 }


export default function Page()
{
  
  const user = msalInstance.getActiveAccount();

 const dta= {
  labels: ['x-axis'],
  datasets: [
    {
    label: 'My First dataset',
    backgroundColor: 'rgba(255,99,132,0.2)',
    borderColor: 'rgba(255,99,132,1)',
    borderWidth: 1,
    hoverBackgroundColor: 'rgba(255,99,132,0.4)',
    hoverBorderColor: 'rgba(255,99,132,1)',
    data: [0]
    }
  ]
};

const [loading,setLoading] = useState(true);

async function AddHeaderBearerToEndpoint(endpoint:string) {
  const token = await getToken();
  const headers = new Headers();
  const bearer = `Bearer ${token}`;
  console.log('bearer' + bearer);
  headers.append('Authorization', bearer);

  const options = {
    method: 'GET',
    headers: headers,
  };
   const response = await fetch(endpoint, options);
   const result = await response.json();

  return result;
}

  useEffect(()=>{
    fetchAllData();
},[]);

const fetchAllData=async ()=>
{
       await fetchData();
        setLoading(false);
  };

  const [repair,setRepair] = useState(dta);
  const [customerEmail,setCustomerEmail] = useState('');

  const [data,setData]=useState<ChartItem[]>([]);
  const fetchData = async()=>{
    setLoading(true);
    const endpoint = process.env.NEXT_PUBLIC_API+'SampleHistoryCht/{id}?SampleID=17142';
    console.log(endpoint);
    const result = await AddHeaderBearerToEndpoint(endpoint);
    setData( result);
    let ci: ChartItem[] = [];
    for(let i=0;i<result.length ;i++)
      {
        ci.push({cnt:result[i].cnt,title:result[i].title});
      }console.table( ci);
    const data= {
      labels: ci.map(it=>it.title),
      datasets: [
        {
          type: 'bar' as const,
        label: 'Total repair costs for equipment, over last 12 months - Top 30',
        backgroundColor: 'Navy',
        borderColor: 'Red',
        borderWidth: 2,
        hoverBackgroundColor: 'Navy',
        hoverBorderColor: 'Navy',
        data: ci.map(it=>it.cnt)
        }
      ]
    };
    const c={type:'bar',
      data:data
    };
    

    setRepair(data);
    setCustomerEmail(JSON.stringify(data));

  }

const emailcustomer=async(event: React.MouseEvent<HTMLButtonElement>)=>{
  event.preventDefault();
  await sendChartEmail(customerEmail, 'Onn off site');
}

async function sendChartEmail(chartdata: string, title: string) {
  setLoading(true);
  const formData = new FormData();
  console.log('chartdata');
  console.log(chartdata);
  formData.append('data', chartdata);
  const email = user?.username.toString()!;
  formData.append('recipient', email);
  formData.append('labels', title);
  formData.append('subject', title);
  const resp = await fetch('/api/contact', {
    method: "post",
    body: formData, //,email:'timhams@gmail.com'
  });
  if (!resp.ok) {
    console.log("falling over")
    console.log(resp.json)
    console.log("await resp.json()")
    //const responseData = await resp.json();
    //console.log(responseData['message']);
 
}
else
{
const responseData = await resp.json();
console.log(resp.status);
console.log(responseData['message']);   
alert('Message successfully sent');
}
  setLoading(false);

}
/*
  const chartRef = useRef<ChartJS>(null);
  const onClick = (event: MouseEvent<HTMLCanvasElement>) => {
  
    const { current: chart } = chartRef;
    if (!chart) {
      alert('out');
      return;
    }
    printElementAtEvent(getElementAtEvent(chart, event));
  }

  const printElementAtEvent = (element: InteractionItem[]) => {
    if (!element.length) return;

    const { datasetIndex, index } = element[0];
    console.log(index);
    console.log(data[index].id);
    const row=data[index];
    //router.push('/RepairSearch?equipid='+row.id.toString()+'&customercode='+row.custcode+'&branchid='+branchid.toString()+'&engid=0');
  };
*/
const options = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

  return    <Bar
options={options}
data={repair}/>
  
}
;
