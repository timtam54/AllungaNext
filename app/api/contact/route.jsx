import { NextResponse, NextRequest } from 'next/server'
const nodemailer = require('nodemailer');

export async function POST(request) {
  try {
    console.log('server email');
    const username = 'MedicalDentalServiceRepair@gmail.com';// 'allungaexposure@outlook.com';//process.env.EMAIL_ADDRESS;
    const password = 'epfy wzpa qvxf wkdi';//process.env.EMAIL_PASSWORD;

    const formData = await request.formData()
    var subject = formData.get('subject');
    var message = formData.get('labels');
    const myEmail=formData.get('recipient');//'timhams@gmail.com';
    const name = formData.get('recipient');;//'tim';
    const email = formData.get('recipient');;//'timhams@gmail.com';
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      
      auth: {
          user: username,
          pass: password
      }
  });

   
  try {


    const QuickChart = require('quickchart-js');
    var labelsStr=formData.get('labels');
    
   var dataStr=formData.get('data');
   console.log('dataStr:'+dataStr);
   if (dataStr!=null)
    {
   console.log(dataStr);
   let data = (dataStr==null)?'':JSON.parse(dataStr); 
   console.table(data);

const myChart = new QuickChart();
myChart
  .setConfig({
    type: 'bar',
    data: data,
  })
  .setWidth(800)
  .setHeight(400)
  .setBackgroundColor('transparent');
//myChart=formData.get('myChart');
const chartImageUrl = myChart.getUrl();
console.log('chartImageUrl:'+chartImageUrl);
 message = labelsStr+`:
<br>
<img src="${chartImageUrl}" />
`;
    }
    console.log(message);
    console.log('sendemailstart');
    const mail = await transporter.sendMail({
        from: username,
        to: myEmail,
        replyTo: email,
        subject: subject,//`MDS Chart from ${email}`,
        html: message
        //`<img src="https://quickchart.io/chart?c={type:'bar',data:{labels:[2012,2013,2014,2015,2016],datasets:[{label:'Users',data:[120,60,50,180,120]}]}} />`,
        //        <img src=${message}</img>
    })
    console.log('sendemailend');

    return NextResponse.json({ message: "Success: email was sent" })

} catch (error) {
    console.log('500:'+error);
     NextResponse.json({message:'error'},{status:500} );

}

  } catch (error) {
    console.log('Error:'+error.message)
    //return Response.json({ error }, { status: 500 });
    NextResponse.json({message:'error.message'},{status:501}  )
  }
}