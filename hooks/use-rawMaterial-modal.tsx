import {create} from "zustand";
export interface IuseModal{
    isOpen:boolean;
    onOpen: (handleCloseModal: ()=> void,id:string | undefined)=>void;
    onClose: () =>void;
    handleCloseModal:()=> void;
    id:string | undefined;
}
export const useModalForm = create<IuseModal>((set) => ({
    isOpen: false,
    handleCloseModal: ()=> {},
    id:"",
    onOpen: (handleCloseModal,id) => set({isOpen: true, handleCloseModal,id}),
    onClose: () => {
        set({isOpen: false});
    },
}))