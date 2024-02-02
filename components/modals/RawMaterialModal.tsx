import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Modal } from "../ui/modal";
import { boolean, z } from "zod";
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

const agent = new https.Agent({  
    rejectUnauthorized: false
});
interface RawMaterialModalProps {
    isOpen:boolean;
    rowID:string | undefined;
    onClose:()=> void;
    onSubmit:(rawId:string,isProd:boolean)=>void;
}
const formSchema = z.object({
        id: z.string().min(1),
        name: z.string().min(1),
        typeValue: z.enum(["0","1"]),
        sizeType: z.enum(["0","1"]),
});
export const RawMaterialModal: React.FC<RawMaterialModalProps> = (props) =>{
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<RawMaterial>();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
      setIsOpen(props.isOpen)
    }, [isOpen,props.isOpen]);
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            id:"",
            name:"",
            typeValue:"0",
            sizeType:"0"
        },
    });
    
    async function handleOpen() {
        if(props.rowID)
        {
            try {
                setLoading(true);
                const response: AxiosResponse<RawMaterial> = await axios.post('http://46.8.194.136/stocktest/RawMaterial/GetById',props.rowID,{headers: {
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
    }
    const onSubmit =async (values:z.infer<typeof formSchema>) => {
        try {
            setLoading(true);
            if(props.rowID){
                const response = await axios.post('http://46.8.194.136/stocktest/RawMaterial/UpdateById',values,{httpsAgent: agent,headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:3000' // Bu satırı ekleyin veya güncelleyin
                }});
                console.log(response.data);
            }
            else{
                const response = await axios.post('http://46.8.194.136/stocktest/RawMaterial/Add',values,{httpsAgent: agent,headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:3000' // Bu satırı ekleyin veya güncelleyin
                }});
                console.log(response.data);
            }
        } catch (error) {
            console.error('axioserror12' + error);
        }finally{
            setLoading(false);
            console.log(values.typeValue.toString(),!!Number(values.typeValue.toString()));
            props.onSubmit(values.id,!!Number(values.typeValue.toString()));
            props.onClose();
        }
    };
    useEffect(()=>{
        if(formData){
            form.setValue("id",formData?.id || "");
            form.setValue("name", formData?.name || "");
            form.setValue("sizeType", (formData?.sizeType || "0").toString() as ("0" | "1"));
            form.setValue("typeValue", (formData?.typeValue || "Direct").toString() as ("0" | "1"));
        }
    },[formData,form]);

    return(
        <Modal 
            title="Hammadde Detayları"
            description="Hammmadde detaylarını giriniz"
            isOpen = {isOpen}
            onClose={()=> {
                setIsOpen(false);
                props.onClose();
                form.setValue("id","");
                form.setValue("name", "");
                form.setValue("sizeType", "0");
                form.setValue("typeValue", "0");
            }}
            onOpen={handleOpen}
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
                                        <Input {...field} disabled={loading} placeholder="Hammadde Kodu"/>
                                    </FormControl>
                                </FormItem>
                            )}
                            />
                            <Separator className="my-4"/>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Adı</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder="Hammadde adı" {...field}/>
                                        </FormControl>
                                    </FormItem>
                                )}
                            /> 
                            <Separator className="my-4"/>
                            <div className="flex space-x-4 justify-between">
                                <FormField
                                    control={form.control}
                                    name="sizeType"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Üretim Tipi</FormLabel>
                                            <FormControl>
                                                <RadioGroup 
                                                    defaultValue={field.value} 
                                                    onValueChange={field.onChange}
                                                    {...field}
                                                    >
                                                    <div className="flex flex-row w-full">
                                                        <div className="flex items-center space-x-2 mr-2">
                                                            <RadioGroupItem value= "0" id="isKg"/>
                                                            <Label htmlFor="isKg">Ağırlık İle</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="1" id="isCount" />
                                                            <Label htmlFor="isCount">Adet İle</Label>
                                                        </div>
                                                    </div>
                                                </RadioGroup>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="typeValue"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Tür</FormLabel>
                                            <FormControl>
                                                <RadioGroup 
                                                    defaultValue={field.value} 
                                                    onValueChange={field.onChange}
                                                    {...field}
                                                    className="flex flex-row space-y-1"
                                                >
                                                    <div className="flex items-center space-x-2 mr-2">
                                                            <RadioGroupItem value="0" id="Direct"/>
                                                            <Label htmlFor="Direct">Direkt</Label>
                                                        </div> 
                                                     <FormControl>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="1" id="Production" />
                                                            <Label htmlFor="Production">Üretim İle</Label>
                                                        </div>
                                                    </FormControl>
                                                </RadioGroup>
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
