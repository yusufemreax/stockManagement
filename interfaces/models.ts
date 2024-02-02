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
    typeValue:number;
}
interface Stock {
    id: string
    stock_Kg: number
    stock_Count: number
    rawMaterialId: string
    rawMaterialName: string
}
interface Transport{
    id:number;
    date:Date;
    rawMaterialID:string;
    weight:number;
    count: number;
    plan_ID: string;
    targetID: string;
}
interface TransportDetail{
    id:number;
    date:Date;
    rawMaterialID:string;
    rawMaterialName:string;
    weight:number;
    count: number;
    plan_ID: string;
    planComponentName:string;
    targetID: string;
    targetName:string;
}
interface Component {
    id:string;
    name:string;
    rawMaterial_ID:string;
    supplierIDs:string;
    productionDays:number;
}
interface SelectedRawMaterial{
    rawMaterialId:string;
    quantity:number;
}
interface SelectedSupplier{
    id:string;
    name:string;
}
interface FormattedComponent{
    id:string;
    name:string;
    rawMaterial_ID:SelectedRawMaterial[];
    supplierIDs:SelectedSupplier[];
    productionDays:number;
}
interface Production{
    id:string;
    date:Date;
    componentId:string;
    supplierId:string;
    componentCount:number;
    transportDate:Date;
}
interface ManyProduction{
    days:string[];
    date:Dates;
    components:ManyComponent[];
    oneDate:Date ;
    isPeriodic:boolean;
}
interface ManyFormattedComponent{
    id:string;
    name:string;
    supplierIDs:SelectedSupplier[];
    productionDays:number;
    count:number;
}
interface Dates{
    from:Date |undefined;
    to:Date |undefined;
}
interface ManyComponent{
    id:string;
    name:string;
    count:number;
    supplierId:string;
}

interface ProductionDetail{
    id:string;
    date:Date;
    componentId:string;
    componentName:string;
    supplierId:string;
    supplierName:string;
    componentCount:number;
    transportDate:Date;
}
interface SupplierStorage{
    id: number;
    stockId:string;
    rawMaterialId:string;
    supplierId:string;
    stockWeight:number;
    stockCount:number;
}
interface SupplierStorageDetail{
    id: number;
    stockId:string;
    rawMaterialId:string;
    rawMaterialName:string;
    supplierId:string;
    supplierName:string;
    stockWeight:number;
    stockCount:number;
}