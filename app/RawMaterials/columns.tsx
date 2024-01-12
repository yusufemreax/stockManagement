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
import { useRawMaterialModal } from "@/hooks/use-rawMaterial-modal"
import { RawMaterialModal } from "@/components/modals/rawMaterial-modal"
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<RawMaterial>[] = [
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
            Hammadde kodu
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
  },
  {
    accessorKey: "name",
    header: "Hammadde Adı",
  },
  {
    accessorKey: "sizeType",
    header: "Ağırlık İle",
    cell:({row}) =>{
      const value:boolean = !row.getValue('sizeType');
      return(
        <Checkbox
          checked= {value}
        />
      )
    }
  },
  {
    accessorKey: "sizeType",
    header: "Adet ile",
    cell:({row}) =>{
      const value:boolean = row.getValue('sizeType');
      return(
        <Checkbox 
          checked= {value}
        />
      )
    }
  },
  {
    accessorKey:"type",
    header:"Tip"
  },
  {
    id: "actions",
    header:({column})=>{
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const useModal = useRawMaterialModal();
      const openRawMaterialModal = () => {
        useModal.onOpen();
      };

      return(
        <Button variant={"outline"} size="icon">
          <PlusIcon className="w-4 h-4" onClick={openRawMaterialModal}/>
        </Button>
      )
    },
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
              onClick={() => navigator.clipboard.writeText(storage.id)}
            >
              Hammadde Kodu Kopyala
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Düzenle</DropdownMenuItem>
            <DropdownMenuItem>Sil</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]