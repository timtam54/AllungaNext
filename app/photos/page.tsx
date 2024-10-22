"use client"
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import Header from '@/components/header';

interface PhotoRow {
    id: number;
    reportid: number;
    sampleid: number;
    description?: string;
    photo?: string;
}

const Page = () => {
    const [data, setData] = useState<PhotoRow[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(process.env.NEXT_PUBLIC_API+'ReportPhoto/{id}?reportid=4');
                const jsonData = await response.json();
                setData(jsonData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);
    const columns =[
        {
          name:'id',
          sortable: true,
          width: "60px",  
          wrap:true,  
        
          cell: (row:PhotoRow)=>row.id,
        },
        {
            name:'Description',
            sortable: true,
            width: "260px",  
            wrap:true,  
            selector: (row:PhotoRow)=>row.description??'',
            cell: (row:PhotoRow)=>row.description??'',
          },
          {
              name:'Photo',
              sortable: true,
              width: "160px",  
              wrap:true,  
              selector: (row:PhotoRow)=>row.photo??'',
              cell: (row:PhotoRow)=>row.photo??'',
            }
    ]

    const customStyles = {
        headCells: {
          style: {
            paddingLeft: '2px', // override the cell padding for head cells
            paddingRight: '2px',
            size:'12px',
            fontWeight:'bold',
            backcolor:'#944780',
            color:'white',

          },
          
        },
        cells: {
          style: {
            paddingLeft: '2px', // override the cell padding for data cells
            paddingRight: '2px',
            
          },
        },
      }
    const conditionalRowStyles = [
        {
          when: (row:PhotoRow) => true,
          style:  (row:PhotoRow) => ({
            color: row.id==0?'red':'blue',
          })
        }
      ];
  

      const [isModalOpen, setIsModalOpen] = useState(false);

      const handleOpenModal = () => {
        setIsModalOpen(true);
      };

      const handleCloseModal = () => {
        setIsModalOpen(false);
      };

      return (
        <div>
          <Header />
          <DataTable
            columns={columns}
            pagination
            dense
            customStyles={customStyles}
            data={data}
            conditionalRowStyles={conditionalRowStyles}
          ></DataTable>

          <button onClick={handleOpenModal}>Open Modal</button>

          
        </div>
      );
    return (
        <div>
          <Header/>
       <DataTable columns={columns}
        pagination
        dense
        customStyles={customStyles}        
        data={data}
        conditionalRowStyles={conditionalRowStyles} >
        </DataTable>
          
          
        </div>
    );
};

export default Page;