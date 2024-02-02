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
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "../ui/command";
import { ScrollArea } from "../ui/scroll-area";
import { log } from "console";
import { Combobox } from "../Combobox";

const agent = new https.Agent({  
    rejectUnauthorized: false
});
interface ProductionModalProps {
    isOpen:boolean;
    rowID:string | undefined;
    onClose:()=> void;
    onSubmit:()=>void;
}
const formSchema = z.object({
        id: z.string().min(1),
        date: z.date(),
        componentId: z.string(),
        supplierId: z.string(),
        componentCount: z.coerce.number(),
});
const getFormattedData = (component:Component | undefined):string[] | undefined => {
    if(component){
        const parsedSupplierIDs: Record<string, string> = JSON.parse(component.supplierIDs);
        return Object.keys(parsedSupplierIDs);
    }
    return undefined;

}
export const ProductionModal: React.FC<ProductionModalProps> = (props) =>{
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Production>();
    const [isOpen, setIsOpen] = useState(false);
    const [components, setComponents] = useState<Component[]>();
    const [selectedComp, setSelectedComp] = useState<string>();
    const [selectedCompSuppliers, setSelectedCompSuppliers] = useState<string[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>();
    const [selectedSupplier, setSelectedSupplier] = useState<string>();
    const [nextId, setNextId] = useState<string>();    
    useEffect(() => {
      setIsOpen(props.isOpen)
    }, [isOpen,props.isOpen]);

    useEffect(() => {
        if(selectedComp){
            const ids = getFormattedData(components?.find(x=> x.id === selectedComp))
            
            if(ids){
                getSuppliers(ids)
            }
        }
    },[selectedComp])
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            id:"",
            date: new Date(),
            componentId: "",
            supplierId: "",
            componentCount: 0,
        },
    });
    const getComponents = async () =>{
        try {
            setLoading(true);
            var response:AxiosResponse<Component[]> = await axios.get('http://46.8.194.136/stocktest/Component/GetAll',{httpAgent:agent})
            if(response.data.length > 0){
                console.log(response.data);
                
                setComponents(response.data);
                
                
            }
            else { 
                setComponents(undefined)
            }
        } catch (error) {
            console.error(error);
        }
        finally{
            setLoading(false);
        }
    }
    const getSuppliers = async (ids:string[]) =>{
        try {
            setLoading(true);
            var response:AxiosResponse<Supplier[]> = await axios.post('http://46.8.194.136/stocktest/Supplier/GetByIdList',ids,{headers: {
                'Content-Type': 'application/json',
            }})
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
                const response: AxiosResponse<Production> = await axios.post('http://46.8.194.136/stocktest/Production/GetById',props.rowID,{headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:3000' // Bu satırı ekleyin veya güncelleyin
                }});
                setFormData(response.data);
            } catch (error) {
                console.error(error);
            }
            finally{
                setLoading(false);
            }
        }
        else{
            try {
                setLoading(true);
                const response:AxiosResponse<string> = await axios.get('http://46.8.194.136/stocktest/Production/GetNextId',{httpAgent:agent});
                setNextId(response.data);

            } catch (error) {
                console.error(error);
            } finally{
                setLoading(false);
            }
        }
    }
    const onSubmit =async (values:z.infer<typeof formSchema>) => {
        try {
            setLoading(true);
            if(props.rowID){
                
                const response = await axios.post('http://46.8.194.136/stocktest/Production/UpdateById',values,{httpsAgent: agent,headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:3000' // Bu satırı ekleyin veya güncelleyin
                }});
                console.log(response.data);
            }
            else{
                console.log(values);
                const response = await axios.post('http://46.8.194.136/stocktest/Production/Add',values,{httpsAgent: agent,headers: {
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
            resetForm();
        }
    };
    useEffect(()=>{
        if(formData){
            form.setValue("id",formData?.id || "");
            form.setValue("componentId", formData?.componentId || "");
            form.setValue("componentCount", formData?.componentCount || 0);
            form.setValue("supplierId", formData?.supplierId || "");
            form.setValue("date", formData?.date || new Date());
        }
    },[formData,form]);
    useEffect(() => {
      if(nextId){
        console.log(nextId);
        form.setValue("id",nextId)
      }
    }, [nextId]);
    
    const resetForm =()=>{
        setSelectedComp(undefined);
        setSelectedSupplier(undefined);
        form.setValue("id", "");
        form.setValue("componentId", "");
        form.setValue("componentCount", 0);
        form.setValue("supplierId", "");
        form.setValue("date", new Date());
    }
    return(
        <Modal 
            title="Üretim Detayları"
            description="Üretim detaylarını giriniz"
            isOpen = {isOpen}
            onClose={()=> {
                setIsOpen(false);
                props.onClose();
                resetForm();
            }}
            onOpen={()=>{
                handleOpen();
                getComponents();
            }}
        >   
            <div className="space-y-4 py-2 pb-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex space-x-4 justify-between">
                            <FormField
                                control={form.control}
                                name="id"
                                render={({field})=>(
                                    <FormItem className="flex flex-1 flex-col ">
                                        <FormLabel>Kodu</FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled={loading} placeholder="Hammadde Kodu"/>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-1 flex-col">
                                        <FormLabel>İstenen Tarih</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
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
                                                        date < new Date("1900-01-01")
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
                        <div className="grid grid-cols-2 gap-2">
                            <FormField
                                control={form.control}
                                name="componentId"
                                render={({field}) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Üretilecek Parça</FormLabel>
                                            {/* <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            role="combobox"
                                                            className={cn(
                                                                "w-full justify-between",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                                                                {field.value ? components?.find(comp => comp.id === field.value)?.name : "Seçim Yapınız"}

                                                            </div>
                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[300px] p-0 top-full left-0" side="bottom">
                                                    <Command>
                                                        <CommandInput  placeholder="Parça Ara..."/>
                                                        <CommandEmpty>Parça Bulunamadı</CommandEmpty>
                                                        <CommandGroup {...field}>
                                                            
                                                        <ScrollArea className="h-72 w-full rounded-md border">
                                                            {components?.map((component) =>(
                                                                
                                                                <CommandItem
                                                                    value={component.name}
                                                                    key={component.id}
                                                                    
                                                                    onSelect={()=>{
                                                                        form.setValue("componentId",component.id)
                                                                        form.setValue("supplierId","")
                                                                        console.log(components);
                                                                        setSelectedComp(component.id);
                                                                        
                                                                    }}
                                                                    
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            component.id === field.value
                                                                                ? "opacity-100"
                                                                                : "opacity-0"
                                                                            )}
                                                                    />
                                                                    {component.name}
                                                                </CommandItem>
                                                            ))}
                                                        </ScrollArea>
                                                            </CommandGroup>
                                                    </Command>

                                                </PopoverContent>
                                            </Popover> */}
                                            {components && 
                                                <Combobox components={components} field={field} onSelect={(compId:string)=>{
                                                form.setValue("componentId",compId)
                                                form.setValue("supplierId","")
                                                setSelectedComp(compId);
                                            }} />}
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="supplierId"
                                render={({field}) => (
                                    <FormItem className="flex flex-1 flex-col basis-[50%] flex-grow-0">
                                        <FormLabel>Tedarikçi</FormLabel>
                                            {/* <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            role="combobox"
                                                            className={cn(
                                                                "justify-between",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? suppliers?.find(sup => sup.id === field.value)?.name : "Seçim Yapınız"}
                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-full p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Parça Ara..."/>
                                                        <CommandEmpty>Tedarikçi Bulunamadı</CommandEmpty>
                                                        <ScrollArea className="h-72 w-full rounded-md border">
                                                        <CommandGroup defaultValue={field.value} {...field}>
                                                            {suppliers?.map((supplier) =>(
                                                                <CommandItem
                                                                    value={supplier.id}
                                                                    key={supplier.id}
                                                                    
                                                                    onSelect={()=>{
                                                                        form.setValue("supplierId",supplier.id)
                                                                        setSelectedComp(supplier.id);
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
                                                            ))}
                                                        </CommandGroup>
                                                        </ScrollArea>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover> */}
                                            {suppliers && 
                                                <Combobox components={suppliers} field={field} onSelect={(itemId:string)=>{
                                                form.setValue("supplierId",itemId)
                                                setSelectedSupplier(itemId);
                                            }} />}
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Separator className="my-4"/>
                        <div className="flex space-x-4 justify-between w-[50%]">
                            <FormField
                                control={form.control}
                                name="componentCount"
                                render={({field})=>(
                                    <FormItem className="flex flex-1 flex-col">
                                        <FormLabel>Parça Sayısı</FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled={loading} placeholder="Parça Sayısı" type="number"/>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
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
