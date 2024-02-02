"use client";
import React, { useEffect, useState } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { FormControl, FormItem, FormLabel } from "./ui/form";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";
import useWindowSize from "./UseWindowSize";

interface ComboboxProps {
  field?: any;
  value?:string;
  components: any[];
  disabled?:boolean;
  onSelect: (itemId:string) => void;
}

export const Combobox: React.FC<ComboboxProps> = ({ field,value,disabled, components, onSelect }) => {
    const [scrollHeight, setScrollHeight] = useState("")
    const windowSize = useWindowSize();
    useEffect(()=>{
        setScrollHeight(windowSize.height < 610 ? '32' : '60');
    },[windowSize.height])

  // Ekran yüksekliği belirli bir değerin altında ise scroll alanı yüksekliğini azalt
  
  return (
      <Popover>
        <PopoverTrigger asChild disabled = {disabled}>
          <FormControl>
            <Button
              variant={"outline"}
              role="combobox"
              className={cn("w-full justify-between", (!field || !field.value) && !value && "text-muted-foreground")}

            >
              <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                {field ? components?.find(comp => comp.id === field.value)?.name : 
                (value ? components.find(comp => comp.id === value).name : "Seçim Yapınız")}
              </div>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0 top-full left-0" side="bottom">
          <Command>
            <CommandInput placeholder="Parça Ara..." />
            <CommandEmpty>Parça Bulunamadı</CommandEmpty>
            <ScrollArea className={`h-32 w-full rounded-md border`}>
            <CommandGroup {...field }>
                {components?.map((component) => (
                  <CommandItem
                    value={component.name}
                    key={component.id}
                    onSelect={()=>onSelect(component.id)}
                  >
                    <Check
                        className={cn(
                            "mr-2 h-4 w-4",
                            (field ? component.id === field.value : component.id === value)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                    />
                    {component.name}
                  </CommandItem>
                ))}
            </CommandGroup>
              </ScrollArea>
          </Command>
        </PopoverContent>
      </Popover>
  );
};

