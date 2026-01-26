import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

import React from 'react'

const DataTable =<T,> ({columns,data,rowKey,tableClassName,headerRowClassName,headerCellClassName,bodyRowClassName,bodyCellClassName,headerClassName}:DataTableProps<T>) => {
  return (
<Table className={cn("custom-scrollbar",tableClassName)}>
  <TableHeader className={headerClassName}>
    <TableRow className={cn("hover:bg-transparent!",headerRowClassName)}>
        {columns.map((column,i)=>(
            <TableHead key={i} className={cn("bg-dark-400 text-purple-100 py-4 first:pl-5 last:pr-5",headerCellClassName)}>
                {column.header}
            </TableHead>
        ))}
    </TableRow>
  </TableHeader>
  <TableBody>
        {data.map((row,indexRow)=>
        <TableRow key={rowKey(row,indexRow)} className={cn("overflow-hidden rounded-lg border-b border-purple-100/5 hover:bg-dark-400/30 relative",bodyRowClassName)}>
           {columns.map((column,indexColumn)=>(
            <TableCell key={indexColumn} className={cn("py-4 first:pl-5 last:pr-5")}>
                {column.cell(row,indexRow)}
            </TableCell>
           ))}    
        </TableRow>
        )}
  </TableBody>
</Table>
  )
}

export default DataTable
