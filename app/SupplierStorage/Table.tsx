"use client";

import { DataTable } from "@/components/DataTable";
import axios, { AxiosResponse } from "axios";
import { SetStateAction, useEffect, useState } from "react";
import { columns } from "./columns";
import https from 'https'

import { createPortal } from "react-dom";
import { ProductionModal } from "@/components/modals/ProductionModal";
import { ManyProductionModal } from "@/components/modals/ManyProductionModal";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { SupplierStorageModal } from "@/components/modals/SupplierStorageModal";
const agent = new https.Agent({  
    rejectUnauthorized: false
  });  
export default function Table() {

    const [data, setData] = useState<SupplierStorageDetail[]>([]);
    const [isModalSubmitted, setIsModalSubmitted] = useState(false);
    const [ismodalOpen, setIsmodalOpen] = useState(false);
    const [modalRowId, setModalRowId] = useState<string | undefined>();
    const [comboOpen, setComboOpen] = useState(false);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [selectedSupplier, setSelectedSupplier] = useState<string>();
    const [loading,setLoading] = useState(false);
    //#region Data functions

    const fetchData = async () => {
      try {
        setLoading(true);
        const response: AxiosResponse<SupplierStorageDetail[]> = await axios.post('http://46.8.194.136/stocktest/SupplierStorage/GetAllDetailBySupplier',selectedSupplier,{headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'http://localhost:3000' // Bu satırı ekleyin veya güncelleyin
        }});
        console.log(response.data);
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
      finally{
        setLoading(false);
      }
    };
    const deleteRow =async (rowID:string) => {
      try {
        await axios.post('http://46.8.194.136/stocktest/SupplierStorage/DeleteById',rowID,{headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'http://localhost:3000' // Bu satırı ekleyin veya güncelleyin
        }});
        fetchData();
      } catch (error) {
        console.error(error);
      }
    }
    const deleteRows =async (rowIDs:string[]) => {
      try {
        console.log(rowIDs);
        await axios.post('http://46.8.194.136/stocktest/SupplierStorage/DeleteMany',rowIDs,{headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'http://localhost:3000' // Bu satırı ekleyin veya güncelleyin
        }});
        fetchData();
      } catch (error) {
        console.error(error);
      }
    }
    const getSuppliers =async () => {
        try {
          setLoading(true);
          const response:AxiosResponse<Supplier[]> = await axios.get('http://46.8.194.136/stocktest/Supplier/GetAll',{httpsAgent: agent});
            setSuppliers(response.data);
        } catch (error) {
          console.log(error);
        }
        finally{
          setLoading(false);
        }
    }
    //#endregion    

    //#region Effect functions
    useEffect(() => {
      getSuppliers();
    }, [])
    
    useEffect(() => {
      if(selectedSupplier){
        fetchData();
      }
    }, [selectedSupplier]);
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
      <div className='flex space-y-2 flex-col'>
        <Popover open={comboOpen} onOpenChange={setComboOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={comboOpen}
              disabled = {loading}
              className="w-[200px] justify-between"
            >
              {selectedSupplier
                ? suppliers?.find((supplier) => supplier.id === selectedSupplier)?.name
                : "Tedarikçi Seçiniz..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Tedarikçi Ara..." />
              <CommandEmpty>Tedarikçi Bulunamadı</CommandEmpty>
              <CommandGroup>
                {suppliers?.map((supplier) => (
                  <CommandItem
                    key={supplier.id}
                    value={supplier.id}
                    onSelect={() => {
                      setSelectedSupplier(supplier.id)
                      setComboOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedSupplier === supplier.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {supplier.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        <DataTable columns={columnData} data={data} handleOpenModal={handleUpdateModalOpen} handleDeleteRows={deleteRows}/>
        { (ismodalOpen && selectedSupplier) &&  createPortal(<SupplierStorageModal isOpen={ismodalOpen} onClose={()=>setIsmodalOpen(false)} onSubmit={()=>setIsModalSubmitted(true)} rowID={modalRowId} supplierId={selectedSupplier}/>,document.body)}
      </div>
    )
}