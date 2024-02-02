import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Modal } from "../ui/modal";
import { undefined, z } from "zod";
import https from 'https';
import { useEffect, useState } from "react";
import { UseFormReturn, useFieldArray, useForm } from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import axios, { AxiosResponse } from "axios";
import { ColumnDef } from "@tanstack/react-table"
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { ArrowUpDown, CalendarIcon, Check, ChevronsUpDown, MinusCircle } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { ModalDataTable } from "../ModalDataTable";
import { Checkbox } from "../ui/checkbox";
import { Switch } from "../ui/switch";
import { DateRange } from "react-day-picker";
import { Combobox } from "../Combobox";
import { ScrollArea } from "../ui/scroll-area";
import { SidePop } from "../ModalSheet";

const agent = new https.Agent({  
    rejectUnauthorized: false
});
interface ManyProductionModalProps {
    isOpen:boolean;
    rowID:string | undefined;
    onClose:()=> void;
    onSubmit:()=>void;
}
interface TableComponent{
    id: string;
    name: string;
}
const componentSchema = z.object({
    id: z.string(),
    name:z.string(),
    count: z.coerce.number(),
    supplierId:z.string()    
});
const formSchema = z.object({
    days: z.array(z.string()),
    components: z.array(componentSchema),
    date: z.object({
        from:z.union([z.date(), z.undefined()]),
        to:z.union([z.date(), z.undefined()]),
    }),
    oneDate:z.date(),
    isPeriodic:z.boolean(),
});
const days = [
    { id: "Monday", description: "Pazartesi" },
    { id: "Tuesday", description: "Salı" },
    { id: "Wednesday", description: "Çarşamba" },
    { id: "Thursday", description: "Perşembe" },
    { id: "Friday", description: "Cuma" },
    { id: "Saturday", description: "Cumartesi" },
    { id: "Sunday", description: "Pazar" }
];
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
export const ManyProductionModal: React.FC<ManyProductionModalProps> = (props) =>{
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<ManyProduction>({
        days: [],
        components: [],
        date: {from:new Date(),to:new Date()},
        oneDate: new Date(),
        isPeriodic:false
    });
    const [isOpen, setIsOpen] = useState(false);
    const [components, setComponents] = useState<FormattedComponent[]>([]);
    const [tableComponents, setTableComponents] = useState<TableComponent[]>([]);
    const [selectedTableComponents,setSelectedTableComponents] = useState<ManyComponent[]>([]);
    const [isPeriodic, setIsPeriodic] = useState(false);
    const [date, setDate] = useState<DateRange>()
    const [prodDate, setProdDate] = useState<Date>()
    const [selectedDays,setSelectedDays] = useState<string[]>([])
    
    useEffect(() => {
      setIsOpen(props.isOpen)
    }, [isOpen,props.isOpen]);
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            days: [],
            components: [],
            oneDate: new Date(),
            isPeriodic: isPeriodic
        },
    });
    const getComponents = async () =>{
        try {
            setLoading(true);
            var response:AxiosResponse<Component[]> = await axios.get('http://46.8.194.136/stocktest/Component/GetAll',{httpAgent:agent})

            if(response.data.length > 0){
                const formatted = response.data.map((item) => {return getFormattedData(item)})
                setComponents(formatted);   
            }
            
        } catch (error) {
            console.error(error);
        }
        finally{
            setLoading(false);
        }
    }
    const handleComponentCountBlur = (_id: string) => (event: React.FocusEvent<HTMLInputElement>) => {
        const newCount = parseInt(event.target.value, 10); // Input değerini tam sayıya dönüştürün
        const frmData = formData;
        const comps = frmData.components;
        const updatedComponent = comps.find(item => item.id === _id);
        if (updatedComponent) {
            updatedComponent.count = newCount;
            const updatedFormData = {
                ...frmData,
                components: comps,
            };
            setFormData(updatedFormData);
        }
    };
    const columns :ColumnDef<TableComponent>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => {
                    row.toggleSelected(!!value)
                    const frmData = formData;
                    const comps = frmData.components;
                    var updated = comps;
                    if(!!value){
                        if(!comps.some(item=> item.id === row.getValue("id"))){
                            comps.push({id:row.getValue("id"),name:row.getValue("name"),count:0,supplierId:""})
                        }
                        updated = comps;
                    }
                    else{
                        updated = comps.filter(x=> x.id !== row.getValue("id"))
                    }
                    setFormData({...frmData, components: updated});
                }}
                aria-label="Select row"
                />
            ),
        },
        {
            accessorKey: "id",
            header: ({ column }) => {
                return (
                    <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                    Parça Kodu
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
                },
                
        },
        {
            accessorKey: "name",
            header:"Parça Adı"
        },
        {
            id:"supplierId",
            header:"Tedarikçi",
            cell:({row}) =>{
                const frmData = formData;
                const suppliers = components.find(c => c.id === row.getValue("id"))?.supplierIDs;
                const comps = frmData.components
                const comp = comps.find(item => item.id === row.getValue("id"))
                const selectedSup = comp?.supplierId;
                console.log(suppliers,comp);
                
                return( suppliers && 
                        <Combobox 
                            disabled = {!row.getIsSelected()} 
                            components={suppliers} value={selectedSup} 
                            onSelect={(_id)=>{
                                const updatedComponent = comps.find(item => item.id === row.getValue("id"));
                                if (updatedComponent) {
                                    updatedComponent.supplierId = _id;
                                    const updatedFormData = {
                                        ...frmData,
                                        components: comps,
                                    };
                                    setFormData(updatedFormData);
                                }
                            }} 
                        />
                    )
            }
        },
        {
            id:"count",
            header:"Adet",
            cell:({row})=>(
                <Input 
                    defaultValue={formData.components.find(c=>c.id === row.getValue("id"))?.count} 
                    disabled={!row.getIsSelected()} 
                    type="number" 
                    onBlur={handleComponentCountBlur(row.getValue("id"))}/>
            )
        }
    ]
    async function handleOpen() {
        if(props.rowID)
        {
            try {
                setLoading(true);
                const response: AxiosResponse<ManyProduction> = await axios.post('http://46.8.194.136/stocktest/Production/GetById',props.rowID,{headers: {
                    'Content-Type': 'application/json',
                }});
                setFormData(response.data);
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
            const response = await axios.post('http://46.8.194.136/stocktest/Production/AddMany',values,{httpsAgent: agent,headers: {
                'Content-Type': 'application/json',
            }});
            console.log(response.data)
        } catch (error) {
            console.error('axioserror12' + error);
        }finally{
            setLoading(false);
            props.onSubmit();
            props.onClose();
            resetForm();
        }
    };
    useEffect(() => {
        if (formData) {
            form.setValue("days", formData.days || []);
            form.setValue("components", formData.components || []);
            form.setValue("date", formData.date || undefined)
            form.setValue("oneDate",formData.oneDate || undefined)
            form.setValue("isPeriodic",formData.isPeriodic || false)
        }
    }, [formData]);
    useEffect(() => {
      if(date && date.from && date.to){
        const formDataOrDefault: ManyProduction = formData;
        const updatedDate = {...formDataOrDefault.date}
        updatedDate.from = date.from;
        updatedDate.to = date.to;
        formDataOrDefault.date = updatedDate
        setFormData(formDataOrDefault)
      }
    }, [date])
    useEffect(() => {
        const formattedTableComponents = components.map(({ id, name }) => ({ id, name }));
        setTableComponents(formattedTableComponents);
    }, [components]);
    const resetForm = () => {
        form.setValue("days", []);
        form.setValue("components", []);
        form.setValue("date",{});
        form.setValue("days",[])
        form.setValue("oneDate",new Date())
        form.setValue("isPeriodic",false)
    };
    return(
        <Modal 
            title="Toplu Üretim Detayları"
            description="Toplu Üretim detaylarını giriniz"
            isOpen = {isOpen}
            onClose={()=> {
                setIsOpen(false);
                props.onClose();
                resetForm();
            }}
            onOpen={()=>{
                getComponents();
                handleOpen();
            }}
        >   
            <div className="space-y-4 py-2 pb-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex space-y-2">
                            {/* <Sheet>
                                <SheetTrigger >Üretilecek Parçaları Düzenlemek için Tıklayınız</SheetTrigger>
                                <SheetContent className="w-[700px] overflow-hidden">
                                    <SheetHeader>
                                        <SheetTitle>Parçalar</SheetTitle>
                                        <SheetDescription>
                                            Üretilecek Parçaları giriniz.
                                        </SheetDescription>
                                    </SheetHeader>
                                    <ScrollArea className="w-full ">
                                        <ModalDataTable columns={columns} data={tableComponents}/> 
                                    </ScrollArea>
                                </SheetContent>
                            </Sheet> */}
                            <SidePop 
                                modalColumns={columns} 
                                data={tableComponents} 
                                title="Parçalar" 
                                description="Üretilecek Parçaları giriniz." 
                                triggerText="Üretilecek Parçaları Düzenlemek için Tıklayınız"
                            />
                        </div>
                        <Separator className="my-4"/>
                        <div className="flex space-x-4 w-full justify-between">
                            <div className="flex  items-center space-x-2">
                                <FormLabel >Periyodik Şekilde</FormLabel>
                                <Switch 
                                    id="is-periodic" 
                                    checked={formData.isPeriodic} 
                                    onCheckedChange={(event)=>{
                                        setFormData({
                                            ...formData,
                                            isPeriodic: event,
                                        });
                                    }}
                                />
                                
                            </div>
                            {!formData.isPeriodic &&
                                <div className="flex flex-1">
                                    <FormLabel>İstenen Tarih</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !formData.oneDate && "text-muted-foreground"
                                                )}
                                            >
                                                {formData.oneDate ? (
                                                    format(formData.oneDate, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={formData.oneDate}
                                                onSelect={(selectedDate) => {
                                                    if(selectedDate){
                                                        setFormData({
                                                            ...formData,
                                                            oneDate: selectedDate,
                                                        });
                                                    }
                                                }}
                                                disabled={(date) =>
                                                    date < new Date()
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            }
                        </div>
                        <Separator className="my-4"/>
                        { formData.isPeriodic &&
                            <div className="flex flex-col space-y-2">
                                <div className="flex w-full justify-between flex-row items-center">
                                    <FormLabel>Üretim Aralığı</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                        <Button
                                            id="date"
                                            variant={"outline"}
                                            className={cn(
                                            "w-[300px] justify-start text-left font-normal",
                                            !date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date?.from ? (
                                                date.to ? (
                                                    <span className="flex justify-between w-full">
                                                        <span className="rounded-l-md">
                                                            {format(date.from, "LLL dd, y")}
                                                        </span>{" "}
                                                        -{" "}
                                                        <span className="rounded-r-md">
                                                            {format(date.to, "LLL dd, y")}
                                                        </span>
                                                    </span>
                                                ) : (
                                                    <span className="rounded-r-md">
                                                        {format(date.from, "LLL dd, y")}
                                                    </span>
                                                )
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                        </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            initialFocus
                                            mode="range"
                                            defaultMonth={date?.from}
                                            selected={date}
                                            onSelect={setDate}
                                            numberOfMonths={2}
                                            disabled={(date) =>
                                                date < new Date() || date < new Date("1900-01-01")
                                              }
                                        />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="grid grid-cols-4 gap-3">
                                    {date?.to &&
                                        days.map((day) => (
                                            <div key={day.id} className="flex items-center space-x-3">
                                                <Checkbox id={day.id} defaultChecked={selectedDays.some(d=> d === day.id)} onCheckedChange={(check)=>{
                                                    var temp = selectedDays
                                                    if(check){
                                                        temp.push(day.id)
                                                    }
                                                    else{
                                                        temp = selectedDays.filter(d=> d !== day.id)
                                                    }
                                                    setSelectedDays(temp)
                                                    setFormData(oldValues=>({
                                                        ...oldValues!,
                                                        days:temp
                                                    }))

                                                }}/>
                                                <FormLabel htmlFor={day.id}>{day.description}</FormLabel>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        }
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
