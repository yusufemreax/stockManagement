"use client";

import { DataTable } from "@/components/DataTable";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { columns } from "./columns";
import https from 'https'
const agent = new https.Agent({  
    rejectUnauthorized: false
  });
  
export default function DoTable() {

    const [data, setData] = useState<RawMaterial[]>([]);
    const [isModalSubmitted, setIsModalSubmitted] = useState(false);
    useEffect(() => {
      if (isModalSubmitted) {
        fetchData(); // Güncel verileri çek
        setIsModalSubmitted(false); // State'i sıfırla
      }
    }, [isModalSubmitted]);
    const handleCloseModal = () => {
      setIsModalSubmitted(true); // Modal submit olduğunda state'i güncelle
    };
    const fetchData = async () => {
      try {
        const response: AxiosResponse<RawMaterial[]> = await axios.get('https://localhost:7290/RawMaterial/GetAll',{httpsAgent: agent});
        setData(response.data);
      } catch (error) {
        console.error(error);
        throw error;
      }
    };
    
    useEffect(() => {
      fetchData();
    }, [])
    
    return (
      <div className='flex'>
          <DataTable columns={columns} data={data} handleCloseModal = {handleCloseModal}/>
      </div>
    )
}