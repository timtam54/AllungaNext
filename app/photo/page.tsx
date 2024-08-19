"use client"
import { BlobServiceClient, ContainerClient,StorageSharedKeyCredential } from '@azure/storage-blob';
import React, { useState } from 'react';
const sasToken = "sp=racwdli&st=2024-08-17T22:35:22Z&se=2024-09-07T06:35:22Z&spr=https&sv=2022-11-02&sr=c&sig=XFbr%2BRu5Wcy90cS86fDIRQsSE2Ma6NbMnUDNQrQnNpc%3D";
const containerName = "files";//rssimage";
const storageAccountName = "dentalinstalblob";


export default function Page() {  

    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
          setFile(event.target.files[0]);
        }
      };

      const uploadFileToBlob = async () => {
        const cc = new ContainerClient(`https://dentalinstalblob.blob.core.windows.net/files?${sasToken}`);

// Use the client to list blobs in the container
for await (const blob of cc.listBlobsFlat()) {
  console.log(blob.name);



        if (!file) return;
          setLoading(true);
          if (!file) {
            alert('No FILE');
          } else {
            const blobService = new BlobServiceClient(
//                `https://dentalinstalblob.blob.core.windows.net/files?sp=racwdli&st=2024-08-17T22:35:22Z&se=2024-08-18T06:35:22Z&spr=https&sv=2022-11-02&sr=c&sig=s%2BXxl4sr%2FXIUK%2Fn1cL2c1S4ksYVJqT7hKl0sppgoqQA%3D`
              `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
            );
           

            
}

    
            var lc=await blobService.listContainers();
            console.table(lc);
            alert(blobService.accountName);
    
            const containerClient: ContainerClient =
              blobService.getContainerClient(containerName);
            await containerClient.createIfNotExists({
              access: 'container',
            });
            alert(blobService.accountName);
            const blobClient = containerClient.getBlockBlobClient('timtest.'+file.name);
            const options = { blobHTTPHeaders: { blobContentType: file.type } };
    
            await blobClient.uploadData(file, options);
            alert('uploaded');
          }
          setLoading(false);
        }

    return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadFileToBlob} disabled={loading}>
        {loading ? 'Uploading...' : 'Upload'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}