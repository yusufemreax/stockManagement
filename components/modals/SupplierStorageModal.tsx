import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Modal } from "../ui/modal";
import { z } from "zod";
import https from 'https';
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import axios, { AxiosResponse } from "axios";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "../ui/command";
import { ScrollArea } from "../ui/scroll-area";

const agent = new https.Agent({  
    rejectUnauthorized: false
});
interface SupplierStorageModalProps {
    isOpen:boolean;
    rowID:string | undefined;
    supplierId:string;
    onClose:()=> void;
    onSubmit:()=>void;
}
const formSchema = z.object({
        id: z.coerce.number(),
        stockId: z.string().min(1),
        rawMaterialId: z.string().min(1),
        supplierId: z.string().min(1),
        stockWeight: z.coerce.number(),
        stockCount: z.coerce.number(),
});
export const SupplierStorageModal: React.FC<SupplierStorageModalProps> = (props) =>{
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<SupplierStorage>();
    const [isOpen, setIsOpen] = useState(false);
    const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
    const [selectedMat, setSelectedMat] = useState<string>();
    useEffect(() => {
      setIsOpen(props.isOpen)
    }, [isOpen,props.isOpen]);
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            id: 0,
            stockId: "",
            rawMaterialId: "",
            supplierId: props.supplierId,
            stockWeight: 0,
            stockCount: 0,
        },
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
    
    async function handleOpen() {
        if(props.rowID)
        {
            try {
                setLoading(true);
                console.log(props.rowID)
                if(props.rowID){
                    const response: AxiosResponse<SupplierStorage> = await axios.post('http://46.8.194.136/stocktest/SupplierStorage/GetById',props.rowID,{headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': 'http://localhost:3000' // Bu satırı ekleyin veya güncelleyin
                    }});
                    console.log(response.data)
                    setFormData(response.data);
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
            if(props.rowID){
                const response = await axios.post('http://46.8.194.136/stocktest/SupplierStorage/UpdateById',values,{httpsAgent: agent,headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:3000' // Bu satırı ekleyin veya güncelleyin
                }});
                console.log(response.data);
            }
            else{
                const response = await axios.post('http://46.8.194.136/stocktest/SupplierStorage/Add',values,{httpsAgent: agent,headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:3000' // Bu satırı ekleyin veya güncelleyin
                }});
                console.log(response.data);
            }
        } catch (error) {
            console.error('axioserror12' + error);
        }finally{
            setLoading(false);
            props.onSubmit();
            props.onClose();
        }
    };
    useEffect(()=>{
        if(formData){
            setSelectedMat(formData?.rawMaterialId)
            form.setValue("id",formData?.id || 0);
            form.setValue("supplierId" ,formData?.supplierId || "");
            form.setValue("rawMaterialId", formData?.rawMaterialId || "");
            form.setValue("stockCount", (formData?.stockCount || 0));
            form.setValue("stockWeight", (formData?.stockWeight || 0));
        }
    },[formData,form]);

    const resetForm =()=>{
        setSelectedMat(undefined);
        form.setValue("id",formData?.id || 0);
        form.setValue("supplierId" , "");
        form.setValue("rawMaterialId", "");
        form.setValue("stockCount",  0);
        form.setValue("stockWeight",  0);
    }

    return(
        <Modal 
            title="Stok Detayları"
            description="Stok detaylarını giriniz"
            isOpen = {isOpen}
            onClose={()=> {
                setIsOpen(false);
                setSelectedMat(undefined);
                props.onClose();
                resetForm();
            }}
            onOpen={async ()=>{
                await getRawMaterials();
                handleOpen();
            }}
        >   
            <div className="space-y-4 py-2 pb-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="stockId"
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel>Kodu</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={loading} placeholder="Stok Kodu"/>
                                    </FormControl>
                                </FormItem>
                            )}
                            />
                            <Separator className="my-4"/>
                        <div className="flex space-x-4 justify-between">

                            <FormField
                                control={form.control}
                                name="rawMaterialId"
                                render={({field}) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Hammadde</FormLabel>
                                            <Popover>
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
                                                            {field.value ? rawMaterials?.find(raw => raw.id === field.value)?.name : "Seçim Yapınız"}
                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[200px] p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Hammadde Ara..."/>
                                                        <CommandEmpty>Hammadde Bulunamadı</CommandEmpty>
                                                        <ScrollArea className="h-72 w-full rounded-md border" >
                                                            <CommandGroup defaultValue={field.value} {...field}>
                                                                {rawMaterials?.map((material) =>(
                                                                    <>
                                                                    
                                                                    <CommandItem
                                                                        value={material.id}
                                                                        key={material.id}
                                                                        
                                                                        onSelect={()=>{
                                                                            form.setValue("rawMaterialId",material.id)
                                                                            setSelectedMat(material.id);
                                                                        }}
                                                                        
                                                                    >
                                                                        <Check
                                                                            className={cn(
                                                                                "mr-2 h-4 w-4",
                                                                                material.id === field.value
                                                                                    ? "opacity-100"
                                                                                    : "opacity-0"
                                                                                )}
                                                                        />
                                                                        {material.name}
                                                                    </CommandItem>
                                                                    </>
                                                                ))}
                                                            </CommandGroup>
                                                                </ScrollArea>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                    </FormItem>
                                )}
                            /> 
                            {rawMaterials?.find( raw => raw.id === selectedMat)?.sizeType === 1 &&
                                <FormField
                                    control={form.control}
                                    name="stockCount"
                                    render={({field}) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Adet</FormLabel>
                                            <FormControl>
                                                <Input {...field} disabled= {loading} placeholder="Adet Sayısı" type="number"/>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            }
                            {rawMaterials?.find( raw => raw.id === selectedMat)?.sizeType === 0 &&
                                    <FormField
                                    control={form.control}
                                    name="stockWeight"
                                    render={({field}) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Ağırlık</FormLabel>
                                            <FormControl>
                                                <Input {...field} disabled= {loading} placeholder="Ağırlık" type="number"/>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />  
                            }
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
