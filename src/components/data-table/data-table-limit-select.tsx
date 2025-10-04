import type { Table } from "@tanstack/react-table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTableLimitSelectProps<TData> {
  table: Table<TData>;
  pageSizeOptions?: number[];
}

export function DataTableLimitSelect<TData>({
  table,
  pageSizeOptions = [10, 20, 30, 40, 50],
}: DataTableLimitSelectProps<TData>) {
  return (
    <div className="flex items-center space-x-2">
      <p className="whitespace-nowrap font-medium text-sm">Tampilkan</p>
      <Select
        value={`${table.getState().pagination.pageSize}`}
        onValueChange={(value) => {
          table.setPageSize(Number(value));
        }}
      >
        <SelectTrigger className="h-8 w-[4.5rem] [&[data-size]]:h-8">
          <SelectValue placeholder={table.getState().pagination.pageSize} />
        </SelectTrigger>
        <SelectContent side="top">
          {pageSizeOptions.map((pageSize) => (
            <SelectItem key={pageSize} value={`${pageSize}`}>
              {pageSize}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="whitespace-nowrap font-medium text-sm">Baris per halaman</p>
    </div>
  );
}
