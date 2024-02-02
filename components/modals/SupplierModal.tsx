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

const agent = new https.Agent({  
    rejectUnauthorized: false
});
interface SupplierModalProps {
    isOpen:boolean;
    rowID:string | undefined;
    onClose:()=> void;
    onSubmit:()=>void;
}
const formSchema = z.object({
        id: z.string().min(1),
        name: z.string().min(1),
        phone: z.string().min(1),
});
export const SupplierModal: React.FC<SupplierModalProps> = (props) =>{
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Supplier>();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
      setIsOpen(props.isOpen)
    }, [isOpen,props.isOpen]);
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            id:"",
            name:"",
            phone:""
        },
    });
    
    async function handleOpen() {
        if(props.rowID)
        {
            try {
                setLoading(true);
                const response: AxiosResponse<Supplier> = await axios.post('http://46.8.194.136/stocktest/Supplier/GetById',props.rowID,{headers: {
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
                const response = await axios.post('http://46.8.194.136/stocktest/Supplier/UpdateById',values,{httpsAgent: agent,headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:3000' // Bu satırı ekleyin veya güncelleyin
                }});
                console.log(response.data);
            }
            else{
                const response = await axios.post('http://46.8.194.136/stocktest/Supplier/Add',values,{httpsAgent: agent,headers: {
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
            form.setValue("id",formData?.id || "");
            form.setValue("name", formData?.name || "");
            form.setValue("phone", (formData?.phone || "0").toString() as ("0" | "1"));
        }
    },[formData,form]);

    return(
        <Modal 
            title="Tedarikçi Detayları"
            description="Tedarikçi detaylarını giriniz"
            isOpen = {isOpen}
            onClose={()=> {
                setIsOpen(false);
                props.onClose();
                form.setValue("id","");
                form.setValue("name", "");
                form.setValue("phone", "");
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
                                        <Input {...field} disabled={loading} placeholder="Tedarikçi Kodu"/>
                                    </FormControl>
                                </FormItem>
                            )}
                            />
                            <Separator className="my-4"/>
                            <FormField
                            control={form.control}
                            name="name"
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel>Adı</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={loading} placeholder="Tedarikçi Adı"/>
                                    </FormControl>
                                </FormItem>
                            )}
                            />
                            <Separator className="my-4"/>
                            <FormField
                            control={form.control}
                            name="phone"
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel>Telefon</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={loading} placeholder="Telefon No" type="tel"/>
                                    </FormControl>
                                </FormItem>
                            )}
                            />
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
