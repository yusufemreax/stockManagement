"use client"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getPaginationRowModel,
  getCoreRowModel,
  getFilteredRowModel,
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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  handleOpenModal: (rowId:string | undefined)=>void;
  handleDeleteRows: (rowIds: string[]) => void;
  handleAddMany?: () => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  handleOpenModal,
  handleDeleteRows,
  handleAddMany
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
      []
    )
    const [rowSelection, setRowSelection] = React.useState({})
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onRowSelectionChange: setRowSelection,
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            rowSelection,
            columnFilters,
        },
    getPaginationRowModel: getPaginationRowModel(),
  })
  
  
  return (
    <div>
      <div className="flex items-center justify-start space-x-2 py-4">
        <Button 
          variant="outline"
          size = "sm"
          onClick={() => {
            handleOpenModal(undefined);
          }}
        >Yeni Ekle</Button>
        <Button 
          variant="outline"
          size = "sm"
          onClick={handleAddMany}
          
        >Toplu Ekle</Button>
        <Button 
          variant="outline"
          size = "sm"
          disabled = {!(table.getFilteredSelectedRowModel().rows.length > 0)}
          onClick={() => {
            handleDeleteRows(table.getFilteredSelectedRowModel().rows.map(row => (row.original as any).id.toString()));
          }}
        >Seçili Olanları Sil</Button>
        
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <>
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
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
                <TableRow> {/* Yeni eklenen satır */}
                  {headerGroup.headers.map((header) => (
                    <TableHead key={`${header.id}-I`}>
                      {header.isPlaceholder ? null : (
                        <>
                          { header.column.getCanFilter() &&
                            <Input
                              value={(header.column.getFilterValue() as string) ?? ""}
                              placeholder="Filtre değeri"
                              onChange={(event) =>
                                header.column.setFilterValue(event.target.value)
                              }
                          />}
                        </>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              </>
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
                    <TableCell className="max-w-48 overflow-hidden text-ellipsis whitespace-nowrap text-center" key={cell.id}>
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
