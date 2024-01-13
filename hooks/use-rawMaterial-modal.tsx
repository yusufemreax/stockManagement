import {create} from "zustand";
export interface IuseModal{
    isOpen:boolean;
    onOpen: (handleCloseModal: ()=> void)=>void;
    onClose: () =>void;
    handleCloseModal:()=> void;
    modalComponent: () => JSX.Element | null;
}
export const useModalForm = create<IuseModal>((set) => ({
    isOpen: false,
    handleCloseModal: ()=> {},
    onOpen: (handleCloseModal) => set({isOpen: true, handleCloseModal}),
    onClose: () => {
        set({isOpen: false});
    },
    modalComponent: ()=> null,
}))