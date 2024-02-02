import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Modal } from "../ui/modal";
import { object, undefined, z } from "zod";
import https from 'https';
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import axios, { AxiosResponse } from "axios";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Check, ChevronsUpDown, MinusCircle } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "../ui/command";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";
import { Combobox } from "../Combobox";

const agent = new https.Agent({  
    rejectUnauthorized: false
});
interface ComponentModalProps {
    isOpen:boolean;
    rowID:string | undefined;
    onClose:()=> void;
    onSubmit:()=>void;
}
const formSchema = z.object({
        id: z.string().min(1),
        name: z.string().min(1),
        rawMaterial_ID: z.array(z.object({
            rawMaterialId: z.string(),
            quantity: z.coerce.number(), 
        })),
        supplierIDs: z.array(z.object({
            id: z.string(),
            name: z.string(), 
        })),
        productionDays: z.coerce.number(),
});

const getFormattedData = (component:Component):FormattedComponent => {
     
        const parsedRawMaterialIDs: Record<string, number> = JSON.parse(component.rawMaterial_ID);
        const parsedSupplierIDs: Record<string, string> = JSON.parse(component.supplierIDs);
        return {
            id: component.id,
            name: component.name,
            rawMaterial_ID: Object.entries(parsedRawMaterialIDs).map(([rawMaterialId, quantity]) => ({
                rawMaterialId,
                quantity,
            })),
            supplierIDs: Object.entries(parsedSupplierIDs).map(([id, name]) => ({
                id,
                name,
            })),
            productionDays: component.productionDays,
        };        
    
}
const getFromFormatted = (formattedComponent:FormattedComponent): Component =>{
    const rawMaterial_ID: Record<string, number> = formattedComponent.rawMaterial_ID.reduce(
        (acc, { rawMaterialId, quantity }) => ({ ...acc, [rawMaterialId]: quantity }),
        {}
      );
    const supplierIDs: Record<string, string> = formattedComponent.supplierIDs.reduce(
    (acc, { id, name }) => ({ ...acc, [id]: name }),
    {}
    );
    return {
        id: formattedComponent.id,
        name: formattedComponent.name,
        rawMaterial_ID: JSON.stringify(rawMaterial_ID),
        supplierIDs: JSON.stringify(supplierIDs),
        productionDays: formattedComponent.productionDays,
    };
}

export const ComponentModal: React.FC<ComponentModalProps> = (props) =>{
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Component>();
    const [formattedFormData, setFormattedFormData] = useState<FormattedComponent>();
    const [isOpen, setIsOpen] = useState(false);
    const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>();
    const [selectedMats, setSelectedMats] = useState<{index:number,material:SelectedRawMaterial}[]>([]);
    const [selectedMatIndexes, setSelectedMatIndexes] = useState<{index:number;id:string}[]>()
    const [suppliers, setSuppliers] = useState<Supplier[]>();
    const [selectedSuppliers, setSelectedSuppliers] = useState<SelectedSupplier[]>([]);

    useEffect(() => {
      setIsOpen(props.isOpen)
    }, [props.isOpen]);
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            id:"",
            name:"",
            rawMaterial_ID: [],
            supplierIDs:[] ,
            productionDays: 0,
        },
    });
    const rawMaterialFieldArray = useFieldArray({
        name: "rawMaterial_ID",
        control: form.control,
    });
    const supplierFieldArray = useFieldArray({
        name: "supplierIDs",
        control: form.control,
    });
    

    const getRawMaterials = async () =>{
        try {
            setLoading(true);
            var response:AxiosResponse<RawMaterial[]> = await axios.get('http://46.8.194.136/stocktest/RawMaterial/GetAll',{httpAgent:agent})
            setRawMaterials(response.data);
        } catch (error) {
            console.error(error);
        }
        finally{
            setLoading(false);
        }
    }
    const getSuppliers = async () =>{
        try {
            setLoading(true);
            var response:AxiosResponse<Supplier[]> = await axios.get('http://46.8.194.136/stocktest/Supplier/GetAll',{httpAgent:agent})
            setSuppliers(response.data);
        } catch (error) {
            console.error(error);
        }
        finally{
            setLoading(false);
        }
    }
    
    async function handleOpen() {
        if(props.rowID)
        {
            try {
                setLoading(true);
                const response: AxiosResponse<Component> = await axios.post('http://46.8.194.136/stocktest/Component/GetById',props.rowID,{headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:3000' // Bu satırı ekleyin veya güncelleyin
                }});
                if(response.data)
                {
                    const formatted = getFormattedData(response.data);
                    setFormattedFormData(formatted);
                    const selectedI = formatted?.rawMaterial_ID.map((item,index)=>{
                        return {index:index,id:item.rawMaterialId};
                    });
                    //console.log(selectedI);
                    setSelectedMatIndexes(selectedI);
                }
                else {
                    form.setValue("id",props.rowID);
                }
            } catch (error) {
                console.error(error);
            }
            finally{
                setLoading(false);
            }
        }
    }
    const onSubmit =async (values:z.infer<typeof formSchema>) => {
        try {
            setLoading(true);
            debugger
            if(props.rowID){
                const response = await axios.post('http://46.8.194.136/stocktest/Component/UpdateById',getFromFormatted(values),{httpsAgent: agent,headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:3000' // Bu satırı ekleyin veya güncelleyin
                }});
                console.log("update")
                console.log(response.data);
            }
            else{
                console.log(getFromFormatted(values));
                const response = await axios.post('http://46.8.194.136/stocktest/Component/Add',getFromFormatted(values),{httpsAgent: agent,headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:3000' // Bu satırı ekleyin veya güncelleyin
                }});
                console.log(response.data);
            }
        } catch (error) {
            console.error('axioserror12' + error);
        }finally{
            setLoading(false);
            resetForm();
            props.onSubmit();
            props.onClose();
        }
    };
    useEffect(()=>{
        if(formattedFormData){
            const selected = formattedFormData?.rawMaterial_ID.map((item,index)=> {return {index:index,material:item}})
            setSelectedMats(selected);
            setSelectedSuppliers(formattedFormData?.supplierIDs);
            form.setValue("id",formattedFormData?.id || "");
            form.setValue("name", formattedFormData?.name || "");
            form.setValue("rawMaterial_ID", formattedFormData?.rawMaterial_ID || undefined);
            form.setValue("supplierIDs", formattedFormData?.supplierIDs || undefined);
            form.setValue("productionDays", formattedFormData?.productionDays || 0);
        }
    },[formattedFormData,form]);

    const resetForm =()=>{
        setSelectedMats([]);
        form.setValue("id","");
        form.setValue("name", "");
        form.setValue("rawMaterial_ID", []);
        form.setValue("supplierIDs", []);
        form.setValue("productionDays",0);
        
    }
    
    return(
        <Modal 
            title="Parça Detayları"
            description="Parça detaylarını giriniz"
            isOpen = {isOpen}
            onClose={()=> {
                setIsOpen(false);
                props.onClose();
                resetForm();
            }}
            onOpen={()=>{
                setSelectedMatIndexes([]);
                handleOpen();
                getRawMaterials();
                getSuppliers();
            }}
        >   
            <div className="space-y-4 py-2 pb-4">
               
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex justify-between">
                            <FormField
                                control={form.control}
                                name="id"
                                disabled={loading}
                                render={({field})=>(
                                    <FormItem>
                                        <FormLabel>Kodu</FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled={loading} placeholder="Parça Kodu"/>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="name"
                                disabled={loading}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Adı</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder="Parça adı" {...field}/>
                                        </FormControl>
                                    </FormItem>
                                )}
                            /> 
                        </div>
                        <Separator className="my-4"/>
                        <div className="flex flex-col space-y-2">
                            <FormLabel>Hammaddeler</FormLabel>
                           
                            {rawMaterialFieldArray.fields.map((_field:any,index:number) =>(
                                <div key={_field.id} className="flex space-x-2 justify-between">
                                    <div className="inline-grid w-full grid-cols-2 space-x-2">
                                        <div className="inline-grid w-full">
                                             <FormField
                                                control={form.control}
                                                disabled={loading}
                                                name={`rawMaterial_ID.${index}.rawMaterialId`}
                                                render={({field})=>(
                                                    <FormItem>
                                                        {/* <Popover>
                                                            <PopoverTrigger asChild>
                                                                <FormControl>
                                                                    <Button
                                                                        variant={"outline"}
                                                                        role="combobox"
                                                                        className={cn("w-full text-sm p-1",!field.value && "text-muted-foreground")}
                                                                    >
                                                                        {field.value ? rawMaterials?.find(raw => raw.id === field.value)?.name : "Seçim Yapınız"}
                                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                                                    </Button>
                                                                </FormControl>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-full p-0">
                                                                <Command>
                                                                    <CommandInput placeholder="Hammadde Ara..."/>
                                                                    <CommandEmpty>Hammadde Bulunamadı</CommandEmpty>
                                                                    <ScrollArea className="h-72 w-full rounded-md border">
                                                                    <CommandGroup>
                                                                        {rawMaterials?.map((material)=>{
                                                                                return(
                                                                                    <CommandItem
                                                                                        value={material.id}
                                                                                        key={material.id}
                                                                                        onSelect={()=>{
                                                                                            form.setValue(`rawMaterial_ID.${index}.rawMaterialId`,material.id)
                                                                                            const updatedIndexMats = selectedMatIndexes?.map((item)=>{
                                                                                                if(item.index === index){
                                                                                                    return{index:item.index,id:material.id}
                                                                                                }
                                                                                                return item;
                                                                                            });
                                                                                            if(!selectedMatIndexes?.some((item)=> item.index === index)){
                                                                                                updatedIndexMats?.push({index:index,id:material.id});
                                                                                                console.log(updatedIndexMats);
                                                                                            }
                                                                                            setSelectedMatIndexes(updatedIndexMats);
                                                                                            _field.rawMaterialId = material.id;
                                                                                        }}
                                                                                    >
                                                                                        <Check
                                                                                            className={cn(
                                                                                                "mr-2 h-4 w-4",
                                                                                                form.getValues(`rawMaterial_ID.${index}.rawMaterialId`) === material.id
                                                                                                    ? "opacity-100"
                                                                                                    : "opacity-0"
                                                                                                )}
                                                                                        />
                                                                                        {material.name}
                                                                                    </CommandItem>
                                                                                )
                                                                        })}
                                                                    </CommandGroup>
                                                                    </ScrollArea>
                                                                </Command>
                                                            </PopoverContent>
                                                        </Popover> */}
                                                        {rawMaterials && 
                                                            <Combobox components={rawMaterials} field={field} onSelect={(itemId:string)=>{
                                                            form.setValue(`rawMaterial_ID.${index}.rawMaterialId`,itemId)
                                                            const updatedIndexMats = selectedMatIndexes?.map((item)=>{
                                                                if(item.index === index){
                                                                    return{index:item.index,id:itemId}
                                                                }
                                                                return item;
                                                            });
                                                            if(!selectedMatIndexes?.some((item)=> item.index === index)){
                                                                updatedIndexMats?.push({index:index,id:itemId});
                                                                console.log(updatedIndexMats);
                                                            }
                                                            setSelectedMatIndexes(updatedIndexMats);
                                                            _field.rawMaterialId = itemId;
                                                        }} />}
                                                    </FormItem>
                                                )}
                                            /> 
                                            
                                        </div>

                                        <div className="inline-grid p-0 ">
                                            
                                            <FormField
                                                control={form.control}
                                                disabled={loading}
                                                key={`rawMaterial_ID.${index}.quantity`}
                                                name={`rawMaterial_ID.${index}.quantity`}
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input {...field} disabled= {loading} placeholder="Adet Sayısı" type="number"/>
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            
                                            
                                        </div>
                                    </div>
                                    <Button 
                                        type="button"
                                        variant="ghost"
                                        className="p-1"
                                        onClick={()=>{
                                            console.log({rawMaterialFieldArray,index,form});
                                            rawMaterialFieldArray.remove(index);
                                            console.log({rawMaterialFieldArray,index,form});
                                        }}
                                    >
                                        <MinusCircle className="m-0"/>
                                    </Button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                disabled={loading}
                                variant="outline"
                                size="sm"
                                className="w-[30]"
                                onClick={() => rawMaterialFieldArray.append({ rawMaterialId: "" ,quantity:0})}
                            > Yeni Ekle</Button>
                            
                        </div>
                        <Separator className="my-4"/>
                        
                        <div className="grid grid-cols-2 space-x-2">
                            <div className="inline-grid grid-cols-1 space-y-2">
                                
                                <FormField
                                control={form.control}
                                name="productionDays"
                                disabled={loading}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Üretim Günü Sayısı</FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled={loading} placeholder="Üretim gün" type="number"/>
                                        </FormControl>
                                    </FormItem>
                                )}
                            /> 
                            </div>
                            <div className="inline-grid space-y-2">
                                <FormLabel>Tedarikçiler</FormLabel>
                                {supplierFieldArray.fields.map((_field,index) =>(
                                    <div key={_field.id} className="inline-grid grid-flow-col space-x-4 ">
                                        <FormField
                                            control={form.control}
                                            disabled={loading}
                                            key={`supplierIDs.${index}.id`}
                                            name={`supplierIDs.${index}.id`}
                                            render={({field})=>(
                                                <FormItem className="">
                                                        {/* <Popover>
                                                            <PopoverTrigger asChild>
                                                                <FormControl>
                                                                    <Button
                                                                        variant={"outline"}
                                                                        role="combobox"
                                                                        className={cn(
                                                                            "w-[200px] justify-between",
                                                                            !field.value && "text-muted-foreground"
                                                                        )}
                                                                    >
                                                                        {field.value ? suppliers?.find(sup => sup.id === field.value)?.name : "Seçim Yapınız"}
                                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                    </Button>
                                                                </FormControl>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-[200px] p-0">
                                                                <Command>
                                                                    <CommandInput placeholder="Hammadde Ara..."/>
                                                                    <CommandEmpty>Hammadde Bulunamadı</CommandEmpty>
                                                                    <ScrollArea className="h-72 w-full rounded-md border">
                                                                    <CommandGroup defaultValue={field.value} {...field}>
                                                                        {suppliers?.map((supplier) =>{
                                                                            if(!selectedSuppliers?.some(x => x.supplierId === supplier.id)){
                                                                                return(
                                                                                    <CommandItem
                                                                                        value={supplier.id}
                                                                                        key={supplier.id}
                                                                                        
                                                                                        onSelect={()=>{
                                                                                            form.setValue(`supplierIDs.${index}.supplierId`,supplier.id)
                                                                                            form.setValue(`supplierIDs.${index}.supplierName`,supplier.name);
                                                                                            const updatedSups = selectedSuppliers?.filter((sup)=> sup.supplierId !== field.value);
                                                                                            updatedSups?.push({supplierId:supplier.id,supplierName:supplier.name});
                                                                                            setSelectedSuppliers(updatedSups);
                                                                                        }}
                                                                                        
                                                                                    >
                                                                                        <Check
                                                                                            className={cn(
                                                                                                "mr-2 h-4 w-4",
                                                                                                supplier.id === field.value
                                                                                                    ? "opacity-100"
                                                                                                    : "opacity-0"
                                                                                                )}
                                                                                        />
                                                                                        {supplier.name}
                                                                                    </CommandItem>
                                                                                )
                                                                            }
                                                                            return null;
                                                                        })}
                                                                    </CommandGroup>
                                                                    </ScrollArea>
                                                                </Command>
                                                            </PopoverContent>
                                                        </Popover> */}
                                                        {suppliers && 
                                                            <Combobox components={suppliers} field={field} onSelect={(itemId:string)=>{
                                                                form.setValue(`supplierIDs.${index}.id`,itemId)
                                                                const name = suppliers.find(s=>s.id===itemId)?.name || "";
                                                                form.setValue(`supplierIDs.${index}.name`,name);
                                                                const updatedSups = selectedSuppliers?.filter((sup)=> sup.id !== field.value);
                                                                updatedSups?.push({id:itemId,name:name});
                                                                setSelectedSuppliers(updatedSups);
                                                        }} />}
                                                </FormItem>
                                            )}
                                        />
                                        <Button 
                                        type="button"
                                        variant="ghost"
                                        className="p-1"
                                        onClick={()=> supplierFieldArray.remove(index)}
                                    >
                                        <MinusCircle className="m-0"/>
                                    </Button>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    disabled={loading}
                                    variant="outline"
                                    size="sm"
                                    className="w-[30]"
                                    onClick={() => supplierFieldArray.append({ id: "" ,name:""})}
                                > Yeni Ekle</Button>    
                            </div>
                            
                        </div>
                        <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                            <Button disabled={loading} variant={"outline"} onClick={()=>props.onClose()}>Vazgeç</Button>
                            <Button disabled={loading} type="submit">Ekle</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </Modal>
    )
}
