import {create} from "zustand";
interface IuseRawMaterialModal{
    isOpen:boolean;
    onOpen: ()=>void;
    onClose: (onCloseComplete?: ()=> void )=>void;
    onCloseComplete: ()=> void;
}
export const useRawMaterialModal = create<IuseRawMaterialModal>((set) => ({
    isOpen: false,
    onOpen: () => set({isOpen: true}),
    onClose: (onCloseComplete) => {
        set({isOpen: false});
        set({onCloseComplete: onCloseComplete || (()=> {})});
    },
    onCloseComplete: ()=> {},
}))