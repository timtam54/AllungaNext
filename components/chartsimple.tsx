"use client"

import Button from '@mui/material/Button';
import { Circles } from 'react-loader-spinner'
import React, { ChangeEvent, useEffect, useRef, useState ,MouseEvent} from 'react';

import { getToken, msalInstance } from "@/msal/msal";
import DataTable from "react-data-table-component";
import { CategoryScale, Chart as ChartJS, LinearScale, BarElement,PointElement,  LineElement,  Legend,  Tooltip ,InteractionItem} from "chart.js";
import {Bar, Line,getElementAtEvent,Chart } from 'react-chartjs-2';
//import UserAvatar from '@/components/UserAvatar';

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

interface dssx{
    label: string;
    backgroundColor: string;
    borderColor: string;
    borderWidth: number,
    hoverBackgroundColor: string;
    hoverBorderColor: string;
    data: Array<number>;
}
type Props = {
  closeModal:  () => void;
}
export default function ChartSimple({closeModal}:Props)
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
const [custcode,setCustcode] = useState('all');

const serviceCols =[
  {
    name:'id',
    sortable: true,
    width: "120px",  
    wrap:true,  
    selector: (row:ChartItem)=>row.title
  }
 ,
  {
    name:'Count',
    sortable: true,
    width: "130px",    
    selector: (row:ChartItem)=> row.cnt.toString()
    
  }
  
];



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
        
        //await fetchCustomer();
        await fetchData('all');
        setLoading(false);
  };

  const [repair,setRepair] = useState(dta);
 // const [customerEmail,setCustomerEmail] = useState('');

  const [data,setData]=useState<ChartItem[]>([]);
  const fetchData = async(cc:string)=>{
    setLoading(true);
    const endpoint ='https://allungawebapicore.azurewebsites.net/api/ParamReports';// process.env.NEXT_PUBLIC_MDSAPI+'TechCustomerEquipRepairs/'+branchid.toString()+'/'+cc;
    console.log(endpoint);
    const result = await AddHeaderBearerToEndpoint(endpoint);
    setData( result);
    let titles: string[] = [];
    for(let i=0;i<result.length ;i++)
    {
      if (!titles.includes(result[i].title))
      {
        titles.push(result[i].title);
      }
    }
    setTitles(titles);
    let ci: ChartItem[] = [];
      
    for(let i=0;i<result.length;i++)
      {
        ci.push({cnt:result[i].cnt,title:result[i].title});
      }
      console.table( ci);
      const dss:dssx[]=[];
      for (const title of titles)
      {
        dss.push(
          {
            label: title.toString(),
            backgroundColor: 'rgba(255,99,132,0.2)',
    borderColor: 'rgba(255,99,132,1)',
    borderWidth: 1,
    hoverBackgroundColor: 'rgba(255,99,132,0.4)',
    hoverBorderColor: 'rgba(255,99,132,1)',
          data: ci.filter(ii=>ii.title==title).map(it=>it.cnt)
          }
        )
      }
    const data= {
      labels: ci.map(it=> it.title),

      datasets:dss
      
/*      datasets: [
        {
          type: 'line' as const,
        label: 'Total reports per day, over last 12 months',
        backgroundColor: 'Navy',
        borderColor: 'Red',
        borderWidth: 2,
        hoverBackgroundColor: 'Navy',
        hoverBorderColor: 'Navy',
        data: ci.map(it=>it.cnt)
        },
        {
        type: 'line' as const,
        label: 'x Total reports per day, over last 12 months',
        backgroundColor: 'Red',
        borderColor: 'Navy',
        borderWidth: 2,
        hoverBackgroundColor: 'White',
        hoverBorderColor: 'Navy',
        data: ci.map(it=>it.cnt+1)
        }
      ]*/
    };
    const c={type:'bar',
      data:data
    };
    
  
    setRepair(data);
    setCustomerEmail(JSON.stringify(data));

  }


const emailcustomer=async(event: React.MouseEvent<HTMLButtonElement>)=>{
  event.preventDefault();
  
  await sendChartEmail(customerEmail, 'No of Params reported over last 12 months');
}
const [customerEmail,setCustomerEmail]=useState('');
async function sendChartEmail(chartdata: string, title: string) {
  setLoading(true);
  const formData = new FormData();
  console.log('customerEmail');
  console.log(customerEmail);
  formData.append('data', chartdata);
  const email = user?.username.toString()!;
  formData.append('recipient', email);
  formData.append('labels', title);

  const resp = await fetch('/api/contact', {
    method: "post",
    body: formData, 
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
   // console.log(data[index].id);
    const row=data[index];
   //todotim router.push('/RepairSearch?equipid='+row.id.toString()+'&customercode='+row.custcode+'&branchid='+branchid.toString()+'&engid=0');
  };

const options = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};
const [Titles,setTitles]=useState<string[]>([]);
  return    <div className="modal-container">
  <div className="modal" style={{backgroundColor:'whitesmoke'}} >
<h1 style={{fontSize:'24px',fontWeight:'bold'}}>Chart Simple</h1>
<Button type="submit" variant="outlined" onClick={(e)=>{e.preventDefault();closeModal()}}>Close</Button>
 <button onClick={emailcustomer}><a href=""><u>Email to me</u></a></button>
     <Bar
options={options}
data={repair}/>
    </div>
   
    <div className="bg-white rounded-lg">
    <DataTable columns={serviceCols}
        fixedHeader
        pagination
        dense
        data={data}
>
        </DataTable>
       
        </div>
    </div>


}
;
