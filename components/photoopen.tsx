"use client"
import React from 'react';
import "@/components/part.css";
import { types } from 'util';
import { Button } from '@mui/material';

type Props = {
    closeModal:  () => void;
    photoUrl: string;
}

export default function PhotoOpen({ closeModal, photoUrl }:Props) 
{
    return (
         <div className="modal-container">
        <div className="modal" style={{backgroundColor:'white',width:'1000px',height:'550px'}} >
        <div style={{display:'flex',justifyContent:'space-between'}}>
      <h1 style={{fontSize:'24px',fontWeight:'bold'}}>Photos</h1>
      <Button variant="contained" onClick={closeModal} style={{ float: 'right' }}>Close</Button>
      </div>
            <img src={photoUrl} alt="Photo" style={{ width: '100%', height: 'auto' }} />
        </div>
        </div>
    );
};
