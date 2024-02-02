"use client";

import { DataTable } from "@/components/DataTable";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { columns } from "./columns";
import https from 'https'

import { createPortal } from "react-dom";
import { RawMaterialModal } from "@/components/modals/RawMaterialModal";
import { ComponentModal } from "@/components/modals/ComponentModal";
const agent = new https.Agent({  
    rejectUnauthorized: false
  });  
export default function Table() {

    const [data, setData] = useState<RawMaterial[]>([]);
    const [isModalSubmitted, setIsModalSubmitted] = useState(false);
    const [ismodalOpen, setIsmodalOpen] = useState(false);
    const [modalRowId, setModalRowId] = useState<string | undefined>();
    const [isProdModalOpen, setIsProdModalOpen] = useState(false);

    //#region Data functions

    const fetchData = async () => {
      try {
        const response: AxiosResponse<RawMaterial[]> = await axios.get('http://46.8.194.136/stocktest/RawMaterial/GetAll');
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    const deleteRow =async (rowID:string) => {
      try {
        await axios.post('http://46.8.194.136/stocktest/RawMaterial/DeleteById',rowID,{headers: {
          'Content-Type': 'application/json' // Bu satırı ekleyin veya güncelleyin
        }});
        await fetchData();
      } catch (error) {
        console.error(error);
      }
    }
    const deleteRows =async (rowIDs:string[]) => {
      try {
        await axios.post('http://46.8.194.136/stocktest/RawMaterial/DeleteMany',rowIDs,{headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'http://localhost:3000' // Bu satırı ekleyin veya güncelleyin
        }});
        await fetchData();
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
    
    const handleSubmit =async (rawId:string,isProd:boolean) => {
      setIsModalSubmitted(true);
      if(isProd){
        setModalRowId(rawId);
        setIsProdModalOpen(true);
      }
    }
    //#endregion
    
    const columnData = columns({handleUpdateModal: handleUpdateModalOpen, handleDeleteRow:deleteRow}) ;
    return (
      <div className='flex'>
          <DataTable columns={columnData} data={data} handleOpenModal={handleUpdateModalOpen} handleDeleteRows={deleteRows} />
          {ismodalOpen && createPortal(<RawMaterialModal isOpen={ismodalOpen} onClose={()=>setIsmodalOpen(false)} onSubmit={handleSubmit} rowID={modalRowId} />,document.body)}
          {isProdModalOpen && createPortal(<ComponentModal isOpen={isProdModalOpen} onClose={()=>setIsProdModalOpen(false)} onSubmit={()=>{}} rowID={modalRowId} />,document.body)}
      </div>
    )
}