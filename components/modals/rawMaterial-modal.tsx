"use client"

import { useRawMaterialModal } from "@/hooks/use-rawMaterial-modal"
import { useForm } from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod"
import { useEffect, useState } from "react";
import { z } from "zod";
import { Modal } from "../ui/modal";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import axios from "axios";
import https from 'https';
const agent = new https.Agent({  
    rejectUnauthorized: false
  });
const formSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    type: z.enum(["Direct","Production"]),
    sizeType: z.enum(["0","1"]),
})

export const RawMaterialModal = (handleCloseModal: () => void) =>{
    const rawMaterialModal = useRawMaterialModal();
    const [loading, setLoading] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            id:"",
            name:"",
            type:"Production",
            sizeType: "0"
        },
    });
    const onSubmit =async (values:z.infer<typeof formSchema>) => {
        try {
            setLoading(true);
            const response = await axios.post('https://localhost:7290/RawMaterial/AddRawMaterial',values,{httpsAgent: agent,headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://localhost:3000' // Bu satırı ekleyin veya güncelleyin
            }});
            console.log(response.data);
            rawMaterialModal.onClose(() => {
                // Execute the callback when the modal is closed
                rawMaterialModal.onCloseComplete();
                // Call the handleCloseModal function from the DataTable component
                handleCloseModal();
              });
        } catch (error) {
            console.error('axioserror12' + error);
        }finally{
            setLoading(false);
            rawMaterialModal.isOpen = false;
        }
    };

    

    return(
        <Modal
            title="Hammadde Detayı"
            description="Hammadde detaylarını giriniz"
            isOpen = {rawMaterialModal.isOpen}
            onClose={rawMaterialModal.onClose}
            >
                <div className="space-y-4 py-2 pb-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}> 
                            <FormField
                                control={form.control}
                                name="id"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Kodu</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder="Hammadde kodu" {...field}/>
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
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value.toString()} >
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
                                    name="type"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Tür</FormLabel>
                                            <FormControl>
                                                <RadioGroup 
                                                    defaultValue={field.value} 
                                                    onValueChange={field.onChange}
                                                >
                                                    <div className="flex flex-row w-full">
                                                        <div className="flex items-center space-x-2 mr-2">
                                                            <RadioGroupItem value="Direct" id="Direct" />
                                                            <Label htmlFor="Direct">Direkt</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="Production" id="Production" />
                                                            <Label htmlFor="Production">Üretim İle</Label>
                                                        </div>
                                                    </div>
                                                </RadioGroup>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            
                            <Separator className="my-4"/>
                            
                            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                                <Button disabled={loading} variant={"outline"} onClick={()=>rawMaterialModal.onClose()}>Vazgeç</Button>
                                <Button disabled={loading} type="submit">Ekle</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </Modal>
    );
};