
// components/ImageUploader.tsx
"use client"
import React, {  useState } from 'react';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';

const sasToken = "sp=r&st=2024-08-17T12:30:55Z&se=2024-08-17T20:30:55Z&spr=https&sv=2022-11-02&sr=c&sig=gASRwcx2oyoVGxR4goH%2BhtmjOJEJr1fXSGYOVIs%2BI6c%3D";
const containerName = "contain";//rssimage";
const storageAccountName = "rssblob";

const ImageUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  
  const uploadFileToBlob = async () => {
    if (!file) return;
      setLoading(true);
      if (!file) {
        alert('No FILE');
      } else {
        const blobService = new BlobServiceClient(
          `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
        );
       

        var lc=blobService.listContainers();
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
    }//,
  //  []
 // );

  const uploadFile = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const blobServiceClient = new BlobServiceClient(
        `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
      );
      const containerClient = blobServiceClient.getContainerClient(containerName);
      const blobClient = containerClient.getBlockBlobClient('timtest.'+file.name);
      const options = { blobHTTPHeaders: { blobContentType: file.type } };
      await blobClient.uploadData(file,options);

      alert('File uploaded successfully!');
    } catch (err:any) {
      setError('Failed to upload file.'+err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadFileToBlob} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ImageUploader;