"use client"
import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  ColumnDef,
  SortingState,
  flexRender,
  getPaginationRowModel,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface ModalDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  handleDeleteRows?: (rowIds: string[]) => void;
  handleAddMany?: () => void;
}

export function ModalDataTable<TData, TValue>({
  columns,
  data,
  handleDeleteRows,
  handleAddMany
}: ModalDataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [rowSelection, setRowSelection] = React.useState({})
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            rowSelection,
        },
    getPaginationRowModel: getPaginationRowModel(),
  })
  
  
  return (
    <div>
      <div className="flex items-center justify-start space-x-2 py-4">
        {/* <Button 
          variant="outline"
          size = "sm"
          onClick={handleAddMany}
          
        >Toplu Ekle</Button>
        <Button 
          variant="outline"
          size = "sm"
          disabled = {!(table.getFilteredSelectedRowModel().rows.length > 0)}
          onClick={() => {
            if(handleDeleteRows){
              handleDeleteRows(table.getFilteredSelectedRowModel().rows.map(row => (row.original as any).id.toString()));
            }
          }}
        >Seçili Olanları Sil</Button> */}
        
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}

                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Önceki Sayfa
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Sonraki Sayfa
        </Button>
      </div>
    </div>
  )
}
