import React, { useState } from 'react';
import { Button } from '@mui/material';
import { BlobServiceClient } from '@azure/storage-blob';//, ContainerClient,StorageSharedKeyCredential
import { getToken } from '@/msal/msal';
import "@/components/part.css";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import UploadFileIcon from '@mui/icons-material/UploadFile';
interface PhotoRow {
  id: number;
  reportid: number;
  sampleid: number;
  description?: string;
  photo?: string;
 
}
type Props = {
    closeModal:  () => void;
    reportid:number;
    sampleid:number;
    photoadded: (photo:PhotoRow)=>void;
    checkExists:  (filename:string,reportid:number,sampleid:number) => boolean;
  }
    export default function PhotoModal({closeModal,reportid,sampleid,photoadded,checkExists}:Props)
  {  const AZURE_BLOB_SAS_URL = process.env.NEXT_PUBLIC_AZUREBLOB_SASURL!;
    const blobName='allunga~pic~'+reportid.toString()+'~'+sampleid.toString();//+'.png';
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    
      if (event.target.files) {
        const filename=event.target.files[0].name;
        const mm=checkExists(filename,reportid,sampleid);
        if (mm)
        {
          const err='file already exists - this cannot be uploaded twice - select another file';
          setError(err);
          alert(err);
          return;
        }
        setError('');
        setFile(event.target.files[0]);
      }
    };
    const [error,setError] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

const saveFileToBlob = async () => {
  if (!file) {
    alert('No file selected');
    return;
  }
  setUploading(true);
  const reader = new FileReader();
  reader.onloadend = async () => {
    const dataURL = reader.result as string;
    await uploadFileToBlob(dataURL,file.name);
    //await getSigFromAzure();
    //alert('image upload to azure blob!');
  };
  reader.readAsDataURL(file);
  setUploading(false);
};
const uploadFileToBlob = async (dataURL:string,filename:string) => {
 
    
  const blobServiceClient = new BlobServiceClient(AZURE_BLOB_SAS_URL);
  const containerClient = blobServiceClient.getContainerClient('allunga_pics');
  
  const blockBlobClient = containerClient.getBlockBlobClient(blobName+'~'+filename);

  const byteCharacters = atob(dataURL.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
  const byteArray = new Uint8Array(byteNumbers);

  await blockBlobClient.uploadData(byteArray, {
    blobHTTPHeaders: { blobContentType: 'image/png' }
  });
  //await getSigFromAzure(filename);
  saveReportphotos(filename);
  
  //alert('signature saved!');
};
const [description,setDescription]=useState('');

const saveReportphotos=async(filename:string)=>{
  
    const token = await getToken()
    const headers = new Headers()
    const bearer = `Bearer ${token}`
    headers.append('Content-type', "application/json; charset=UTF-8")
    const url = 'https://dentalinstalblob.blob.core.windows.net/files/allunga_pics/allunga~pic~'+reportid.toString()+'~'+sampleid.toString()+'~'+filename;
    const add:PhotoRow={id:0,reportid:reportid,sampleid:sampleid,photo:url!,description:description??''};
    console.table(add);
    const options = {
      method: 'POST',
      body: JSON.stringify(add),
      headers: headers,
    }
    const response = fetch(process.env.NEXT_PUBLIC_API+`ReportPhoto`, options);
    var ee = await response;
    if (!ee.ok) {
      alert((ee).statusText);
    }
   else
   {
    ;//alert('saved - add new row to parent - close');
    const data = await ee.json();
    const added:PhotoRow=data;
    console.table(added);
    photoadded(added);
    closeModal();
   }
}
/*const getSigFromAzure = async (filename:string) => {
  const blobServiceClient = new BlobServiceClient(AZURE_BLOB_SAS_URL);
  const containerClient = blobServiceClient.getContainerClient('allunga_pics');

  const blockBlobClient = containerClient.getBlockBlobClient(blobName+'~'+filename);

  const signexists= await blockBlobClient.exists();
  if (!signexists) {
    return;
  }
  const downloadBlockBlobResponse = await blockBlobClient.download(0);
  const downloaded = await downloadBlockBlobResponse.blobBody;
  if (downloaded === null) {
    return;
  }
  const url = URL.createObjectURL(downloaded!);
  setImageUrl(url);
  alert(url);

};
const [imageUrl, setImageUrl] = useState<string | null>(null);*/
    return <div className="inner-modal-container">
    <div className="modal" style={{width:'650px',backgroundColor:'white'}}>
      <div style={{display:'flex',justifyContent:'space-between'}}>
      <input type="file" onChange={handleFileChange} />
    
    <input placeholder='-Title-' type="text" value={description} onChange={(e)=>setDescription(e.target.value)} />
   {file && <Button variant='contained' onClick={saveFileToBlob} disabled={uploading}><UploadFileIcon/>
      {uploading ? 'Uploading' : 'Upload'}
    </Button>}
    <button onClick={(e)=>{e.preventDefault();closeModal();}}><HighlightOffIcon/></button>
   
    </div>
    
    {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
    </div>
    
  }

