"use client";
import { RawMaterialModal } from "@/components/modals/rawMaterial-modal";
import { useState,useEffect } from "react";

export const ModalProvider = ()=>{
    const [isMounted, setIsMounted] = useState(false)
    const [modalData, setModalData] = useState(null);
    useEffect(()=>{
        setIsMounted(true)
    },[])
    if(!isMounted){
        return null;
    }
    return(
        <>
            <RawMaterialModal modalData={modalData}/>
        </>
    )
}