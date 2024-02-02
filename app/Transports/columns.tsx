"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Plus, PlusIcon } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import * as React from "react"
interface ColumnProps{
  handleUpdateModal: (rowId:string | undefined) => void;
  handleDeleteRow: (rowId:string) => void;
}

export const columns = ({handleUpdateModal,handleDeleteRow}: ColumnProps): ColumnDef<TransportDetail>[] => 
{
  
return [
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
        onCheckedChange={(value) => row.toggleSelected(!!value)}
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
            Nakliye Kodu
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
  },
  {
    accessorKey: "date",
    header: "Tarih",
  },
  {
    accessorKey: "rawMaterialID",
    header: "Hammadde kodu",
  },
  {
    accessorKey: "rawMaterialName",
    header: "Hammadde Adı",
  },
  {
    accessorKey: "weight",
    header: "Ağırlık",
  },
  {
    accessorKey: "count",
    header: "Adet",
  },
  {
    accessorKey: "plan_ID",
    header: "Üretim Kodu",
  },
  {
    accessorKey: "planComponentName",
    header: "Üretilecek Parça",
  },
  {
    accessorKey: "targetID",
    header: "Gideceği Yer Kodu",
  },
  {
    accessorKey: "targetName",
    header: "Gideceği Yer Adı",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const storage = row.original
     
      return (
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(storage.id.toString())}
            >
              Nakliye Kodu Kopyala
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={()=>handleUpdateModal(storage.id.toString())}>Düzenle</DropdownMenuItem>
            <DropdownMenuItem
              onClick={()=> handleDeleteRow(storage.id.toString())}
            >Sil</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
}