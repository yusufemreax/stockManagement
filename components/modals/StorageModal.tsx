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
interface StorageModalProps {
    isOpen:boolean;
    rowID:string | undefined;
    onClose:()=> void;
    onSubmit:()=>void;
}
const formSchema = z.object({
        id: z.string().min(1),
        stock_Kg: z.coerce.number().min(0),
        stock_Count: z.coerce.number().min(0),
        rawMaterialId: z.string().min(1),
});
export const StorageModal: React.FC<StorageModalProps> = (props) =>{
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Stock>();
    const [isOpen, setIsOpen] = useState(false);
    const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
    const [selectedMat, setSelectedMat] = useState<string>();
    useEffect(() => {
      setIsOpen(props.isOpen)
    }, [isOpen,props.isOpen]);
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            id:"",
            stock_Kg:0,
            stock_Count:0,
            rawMaterialId:""
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
                    const response: AxiosResponse<Stock> = await axios.post('http://46.8.194.136/stocktest/Storage/GetById',props.rowID,{headers: {
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
                const response = await axios.post('http://46.8.194.136/stocktest/Storage/UpdateById',values,{httpsAgent: agent,headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:3000' // Bu satırı ekleyin veya güncelleyin
                }});
                console.log(response.data);
            }
            else{
                const response = await axios.post('http://46.8.194.136/stocktest/Storage/Add',values,{httpsAgent: agent,headers: {
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
            console.log("useef"+formData?.rawMaterialId);
            setSelectedMat(formData?.rawMaterialId)
            form.setValue("id",formData?.id || "");
            form.setValue("rawMaterialId", formData?.rawMaterialId || "");
            form.setValue("stock_Count", (formData?.stock_Count || 0));
            form.setValue("stock_Kg", (formData?.stock_Kg || 0));
        }
    },[formData,form]);

    return(
        <Modal 
            title="Stok Detayları"
            description="Stok detaylarını giriniz"
            isOpen = {isOpen}
            onClose={()=> {
                setIsOpen(false);
                setSelectedMat(undefined);
                props.onClose();
                form.setValue("id","");
                form.setValue("rawMaterialId",  "");
                form.setValue("stock_Count",  0);
                form.setValue("stock_Kg",  0);
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
                            name="id"
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
                                                        <ScrollArea className="h-72 w-full rounded-md border">
                                                        <CommandGroup defaultValue={field.value} {...field}>
                                                            {rawMaterials?.map((material) =>(
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
                                    name="stock_Count"
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
                                    name="stock_Kg"
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
