"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect } from "react";
import { Switch } from "./switch";
import { Label } from "./label";

interface ModalProps{
    title: string;
    description: string;
    isOpen: boolean;
    onClose: () => void;
    onOpen: () => void;
    children?: React.ReactNode;
};
export const Modal: React.FC<ModalProps> =({
    title,
    description,
    isOpen,
    onClose,
    onOpen,
    children
})=>{
    useEffect(()=>{
        if(isOpen){
            onOpen();
        }
    },[isOpen])
    const onChange=(open: boolean)=>{
        if(!open){
            onClose();
        }
    };
    
    return(
        <Dialog open={isOpen} onOpenChange={onChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <div>
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    )
}