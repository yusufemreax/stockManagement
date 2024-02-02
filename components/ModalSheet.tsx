import { ModalDataTable } from "./ModalDataTable";
import { ScrollArea } from "./ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
interface SidePopProps{
    title: string;
    triggerText:string;
    description:string;
    modalColumns:any;
    data:any[];
}
export function SidePop({
    title,
    triggerText,
    description,
    modalColumns,
    data
}:SidePopProps){
    return(
        <Sheet>
            <SheetTrigger >{triggerText}</SheetTrigger>
            <SheetContent className="w-[700px] overflow-hidden">
                <SheetHeader>
                    <SheetTitle>{title}</SheetTitle>
                    <SheetDescription>
                        {description}
                    </SheetDescription>
                </SheetHeader>
                <ScrollArea className="w-full h-[90%] p">
                    <ModalDataTable columns={modalColumns} data={data}/> 
                </ScrollArea>
            </SheetContent>
        </Sheet>
    )
}