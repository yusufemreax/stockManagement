interface Supplier{
    id: string;
    name: string;
    phone: string;
}
interface RawMaterial{
    id: string;
    name: string;
    sizeType:number;
    type: string;
}
interface Storage {
    stock_Kod: string
    stock_Kg: number
    stock_Count: number
    rawMaterialID: string
    rawMaterialName: string
}