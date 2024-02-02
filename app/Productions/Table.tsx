"use client";

import { DataTable } from "@/components/DataTable";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { columns } from "./columns";
import https from 'https'

import { createPortal } from "react-dom";
import { ProductionModal } from "@/components/modals/ProductionModal";
import { ManyProductionModal } from "@/components/modals/ManyProductionModal";
const agent = new https.Agent({  
    rejectUnauthorized: false
  });  
export default function Table() {

    const [data, setData] = useState<ProductionDetail[]>([]);
    const [isModalSubmitted, setIsModalSubmitted] = useState(false);
    const [ismodalOpen, setIsmodalOpen] = useState(false);
    const [modalRowId, setModalRowId] = useState<string | undefined>();
    const [isManyModalOpen, setIsManyModalOpen] = useState(false);
    
    //#region Data functions

    const fetchData = async () => {
      try {
        const response: AxiosResponse<ProductionDetail[]> = await axios.get('http://46.8.194.136/stocktest/Production/GetAllDetail',{httpsAgent: agent});
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    const deleteRow =async (rowID:string) => {
      try {
        await axios.post('http://46.8.194.136/stocktest/Production/DeleteById',rowID,{headers: {
          'Content-Type': 'application/json' // Bu satırı ekleyin veya güncelleyin
        }});
        fetchData();
      } catch (error) {
        console.error(error);
      }
    }
    const deleteRows =async (rowIDs:string[]) => {
      try {
        await axios.post('http://46.8.194.136/stocktest/Production/DeleteMany',rowIDs,{headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'http://localhost:3000' // Bu satırı ekleyin veya güncelleyin
        }});
        fetchData();
      } catch (error) {
        console.error(error);
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
          <DataTable columns={columnData} data={data} handleOpenModal={handleUpdateModalOpen} handleDeleteRows={deleteRows} handleAddMany={()=>setIsManyModalOpen(true)}/>
          { ismodalOpen && createPortal(<ProductionModal isOpen={ismodalOpen} onClose={()=>setIsmodalOpen(false)} onSubmit={()=>setIsModalSubmitted(true)} rowID={modalRowId} />,document.body)}
          { isManyModalOpen && createPortal(<ManyProductionModal isOpen={isManyModalOpen} onClose={()=>setIsManyModalOpen(false)} onSubmit={()=>setIsModalSubmitted(true)} rowID={modalRowId} />,document.body)}
      </div>
    )
}