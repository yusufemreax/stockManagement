import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "../ui/form";
import { Modal } from "../ui/modal";
import { object, z } from "zod";
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
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "../ui/command";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { ScrollArea } from "../ui/scroll-area";

const agent = new https.Agent({  
    rejectUnauthorized: false
});
interface TransportModalProps {
    isOpen:boolean;
    rowID:string | undefined;
    onClose:()=> void;
    onSubmit:()=>void;
}
const formSchema = z.object({
        id: z.coerce.number(),
        date: z.date(),
        rawMaterialId: z.string(),
        weight: z.coerce.number(),
        count: z.coerce.number(),
        targetID: z.string()
});



export const TransportModal: React.FC<TransportModalProps> = (props) =>{
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Transport>();
    const [isOpen, setIsOpen] = useState(false);
    const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>();
    const [selectedMat, setSelectedMat] = useState<string>();
    const [suppliers, setSuppliers] = useState<Supplier[]>();
    const [selectedSupplier, setSelectedSupplier] = useState<string>();

    useEffect(() => {
      setIsOpen(props.isOpen)
    }, [isOpen,props.isOpen]);
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            date: new Date(),
            id:0,
            rawMaterialId:"",
            weight:0,
            count:0,
            targetID:""
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
    const getSuppliers = async () =>{
        try {
            setLoading(true);
            var response:AxiosResponse<Supplier[]> = await axios.get('http://46.8.194.136/stocktest/Supplier/GetAll',{httpAgent:agent})
            response.data.push({id:"factory",name:"Fabrika",phone:""});
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
                const response: AxiosResponse<Transport> = await axios.post('http://46.8.194.136/stocktest/Transport/GetById',props.rowID,{headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:3000' // Bu satırı ekleyin veya güncelleyin
                }});
                setFormData(response.data)
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
                console.log(values);
                const response = await axios.post('http://46.8.194.136/stocktest/Transport/UpdateById',values,{httpsAgent: agent,headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:3000' // Bu satırı ekleyin veya güncelleyin
                }});
                console.log("update")
                console.log(response.data);
            }
            else{
                const response = await axios.post('http://46.8.194.136/stocktest/Transport/Add',values,{httpsAgent: agent,headers: {
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
        if(formData){
            setSelectedMat(formData?.rawMaterialID);
            setSelectedSupplier(formData?.targetID);
            form.setValue("date", formData?.date || new Date());
            form.setValue("id", formData?.id || 0);
            form.setValue("rawMaterialId", formData?.rawMaterialID || "");
            form.setValue("targetID", formData?.targetID || "");
            form.setValue("count", formData?.count || 0);
            form.setValue("weight", formData?.weight || 0);
        }
    },[formData,form]);

    const resetForm =()=>{
        setSelectedMat(undefined);
        setSelectedSupplier(undefined);
        form.setValue("date",  new Date());
        form.setValue("rawMaterialId",  "");
        form.setValue("targetID",  "");
        form.setValue("count", 0);
        form.setValue("weight",  0);
    }
    
    return(
        <Modal 
            title="Nakliye Detayları"
            description="Nakliye detaylarını giriniz"
            isOpen = {isOpen}
            onClose={()=> {
                setIsOpen(false);
                props.onClose();
                resetForm();
            }}
            onOpen={()=>{
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
                                            <Input {...field} disabled={true} placeholder="Nakliye Kodu"/>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            
                        </div> 
                        <Separator className="my-4"/>
                        <div className="flex space-x-4 justify-between">
                            <FormField
                                control={form.control}
                                name="targetID"
                                render={({field}) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Gidecek Yer</FormLabel>
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
                                                            {suppliers?.map((material) =>(
                                                                <CommandItem
                                                                    value={material.id}
                                                                    key={material.id}
                                                                    
                                                                    onSelect={()=>{
                                                                        form.setValue("targetID",material.id)
                                                                        setSelectedSupplier(material.id);
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
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Nakliye Tarihi</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[240px] pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                    date > new Date() || date < new Date("1900-01-01")
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </FormItem>
                                )}
                            />
                                
                        </div>
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
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                    </FormItem>
                                )}
                            /> 
                            {rawMaterials?.find( raw => raw.id === selectedMat)?.sizeType === 1 &&
                                <FormField
                                    control={form.control}
                                    name="count"
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
                                    name="weight"
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
