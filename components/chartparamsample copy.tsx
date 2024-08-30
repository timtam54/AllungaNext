"use client"

import "@/components/part.css";
import { Circles } from 'react-loader-spinner'

import React, { ChangeEvent, useEffect, useRef, useState ,MouseEvent} from 'react';
import Link from "next/link";
import { getToken, msalInstance } from "@/msal/msal";
import Button from '@mui/material/Button';

//import DataTable from "react-data-table-component";

import { CategoryScale, Chart as ChartJS, LinearScale, BarElement,PointElement,  LineElement,  Legend,  Tooltip ,InteractionItem} from "chart.js";
import {Bar, Line,getElementAtEvent,Chart } from 'react-chartjs-2';


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
  //id:number;
  date:Date;
  cnt:number;
  //ky:string;
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
  title:string;
  closeModal:  () => void;
  sampleID:number;
  seriesid:number;
};
const ChartParamSample=({title,closeModal,sampleID,seriesid}:Props)=>
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

//const searchParams = useSearchParams();


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
      name:'Date',
      sortable: true,
      width: "600px",    
     // selector: row=>row.JobNo
      cell:   (row:ChartItem) => <Link   href={{
        pathname:'/RepairSearch',query:{date:DateFormat(row.date), title:row.title}}} ><u>{DateFormat(row.date)}</u></Link>
    
  },
  {
    name:'Count',
    sortable: true,
    width: "130px",    
    selector: (row:ChartItem)=> row.cnt.toString()
    
  }
  
];

const DateFormat=(date:any)=>  {
  if (date==null) return "";
 const dte= new Date(date);
  return dte.getFullYear().toString()+'-'+(dte.getMonth()+1).toString().padStart(2,'0')+'-'+(dte.getDate()).toString().padStart(2,'0');
}

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


  /*const fetchTechAccessBranchEng = async ():Promise<number> =>{
    
    const endpoint =process.env.NEXT_PUBLIC_MDSAPI+'TechAccessBranchEng/?username='+user?.username!.toString();

    console.log(endpoint);
    const result:branchesEng[] = await AddHeaderBearerToEndpoint(endpoint);
    const egid=result.filter(ii=>ii.branchid==branchid)[0].engineerid;
    
    setBranches(result);
    return egid;
 }*/
 //   const [engid,setEngid]=useState(0);
    
  useEffect(()=>{
    fetchAllData();
},[]);


const fetchAllData=async ()=>
{
        
        //await fetchCustomer();
        await fetchData();
        setLoading(false);
  };

  const [repair,setRepair] = useState(dta);


  const [data,setData]=useState<ChartItem[]>([]);
  const fetchData = async()=>{
    setLoading(true);
    const endpoint ='https://allungawebapicore.azurewebsites.net/api/ParamSampleReports/id/SampleID?id='+seriesid.toString()+'&SampleID='+sampleID.toString();// process.env.NEXT_PUBLIC_MDSAPI+'TechCustomerEquipRepairs/'+branchid.toString()+'/'+cc;
    console.log(endpoint);
    //return;
    const result = await AddHeaderBearerToEndpoint(endpoint);
    setData( result);
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
    setTitles(titles);
    let ci: ChartItem[] = [];
      
    for(let i=0;i<result.length;i++)
      {
        ci.push({cnt:result[i].cnt,title:result[i].title, date:result[i].date});//, ky:result[i].ky});
      }
      console.table( ci);
      const dss:dssx[]=[];
      var iii=0;
      for (const title of titles)
      {
        dss.push(
          {
            label: title.toString(),
            backgroundColor:colors[iii],// 'rgba(255,99,132,0.2)',
    borderColor: colors[iii],//'rgba(255,99,132,1)',
    borderWidth: 1,
    hoverBackgroundColor:colors[iii],// 'rgba(255,99,132,0.4)',
    hoverBorderColor: colors[iii],//'rgba(255,99,132,1)',
          data: ci.filter(ii=>ii.title==title).map(it=>it.cnt)
          }
        )
        iii++;
      }
    const data= {
      labels: dates.map(dt=>dt),//ci.map(it=>DateFormat( it.date)),

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
    const c={type:'line',
      data:data
    };
    
  
    setRepair(data);
    setCustomerEmail(JSON.stringify(data));
  }


const emailcustomer=async(event: React.MouseEvent<HTMLButtonElement>)=>{
  event.preventDefault();
  
  await sendChartEmail(customerEmail, 'No of Reports/Samples per day - over last 12 months');
}
const colors=['red','blue','green','black','brown','orange','purple','black','gray','violet','red','blue','green','black','brown','orange','purple','black','gray','violet','red','blue','green','black','brown','orange','purple','black','gray','violet']
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
  return loading?
  <div className="relative h-16">
  <div className="absolute p-4 text-center transform -translate-x-1/2 translate-y-1/2 border top-1/2 left-1/2">
           <Circles
             height="200"
             width="200"
             color="#944780"
             ariaLabel="circles-loading"
             wrapperStyle={{}}
             wrapperClass=""
             visible={true}
           /></div></div>
        :
          <div className="modal-container">
    <div className="modal" style={{backgroundColor:'whitesmoke'}} >
<h1 style={{fontSize:'24px',fontWeight:'bold'}}>{title}</h1>
 <Button  variant='outlined' onClick={emailcustomer}><a href=""><u>Email to mey</u></a></Button>
 <Button  variant='contained' type="submit" onClick={(e)=>{e.preventDefault();closeModal()}}>Close</Button>
     <Line
     height={"120%"}
     
options={options}
data={repair}/>
    </div>
    </div>
}
;
export default ChartParamSample

/*
 <div className="bg-white rounded-lg">
    <DataTable columns={serviceCols}
        fixedHeader
        pagination
        dense
        data={data}
>
        </DataTable>
       
        </div>*/
