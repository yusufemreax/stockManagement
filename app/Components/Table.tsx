"use client";

import { DataTable } from "@/components/DataTable";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { columns } from "./columns";
import https from 'https'

import { createPortal } from "react-dom";
import { ComponentModal } from "@/components/modals/ComponentModal";
const agent = new https.Agent({  
    rejectUnauthorized: false
  });  
export default function Table() {

    const [data, setData] = useState<Component[]>([]);
    const [isModalSubmitted, setIsModalSubmitted] = useState(false);
    const [ismodalOpen, setIsmodalOpen] = useState(false);
    const [modalRowId, setModalRowId] = useState<string | undefined>();
    
    
    //#region Data functions

    const fetchData = async () => {
      try {
        const response: AxiosResponse<Component[]> = await axios.get('http://46.8.194.136/stocktest/Component/GetAll',{httpsAgent: agent});
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    const deleteRow =async (rowID:string) => {
      try {
        await axios.post('http://46.8.194.136/stocktest/Component/DeleteById',rowID,{headers: {
          'Content-Type': 'application/json'
           // Bu satırı ekleyin veya güncelleyin
        }});

      } catch (error) {
        console.error(error);
      }
    }
    const deleteRows =async (rowIDs:string[]) => {
      try {
        await axios.post('http://46.8.194.136/stocktest/Component/DeleteMany',rowIDs,{headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'http://localhost:3000' // Bu satırı ekleyin veya güncelleyin
        }});

      } catch (error) {
        console.error(error);
      }
      finally{
        fetchData();
      }
    }
    //#endregion    

    //#region Effect functions

    useEffect(() => {
      fetchData();
    }, []);
    useEffect(() => {
      if (isModalSubmitted) {
        fetchData(); // Güncel verileri çek
        setIsModalSubmitted(false); // State'i sıfırla
      }
    }, [isModalSubmitted]);
    //#endregion
    
    //#region Modal functions

    const handleUpdateModalOpen = (rowId:string | undefined)=>{
      setModalRowId(rowId);
      setIsmodalOpen(true);
    }
    
    //#endregion
    
    const columnData = columns({handleUpdateModal: handleUpdateModalOpen, handleDeleteRow:deleteRow}) ;
    return (
      <div className='flex'>
          <DataTable columns={columnData} data={data} handleOpenModal={handleUpdateModalOpen} handleDeleteRows={deleteRows} />
          { ismodalOpen && createPortal(<ComponentModal isOpen={ismodalOpen} onClose={()=>setIsmodalOpen(false)} onSubmit={()=>setIsModalSubmitted(true)} rowID={modalRowId} />,document.body)}
      </div>
    )
}