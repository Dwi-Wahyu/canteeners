"use client";

import { useDataTable } from "@/hooks/use-data-table";
import { GetUsersTableDataResponseType, UsersTableDataType } from "./type";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table/data-table";
import React from "react";
import { DataTableAdvancedToolbar } from "@/components/data-table/data-table-advanced-toolbar";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";

export default function UsersTable({
  promises,
  columns,
}: {
  promises: GetUsersTableDataResponseType;
  columns: ColumnDef<UsersTableDataType>[];
}) {
  const { data, filtered, pageCount } = promises;

  const { table } = useDataTable({
    data,
    columns,
    pageCount: pageCount,
    shallow: false,
    clearOnDefault: true,
    initialState: {
      pagination: {
        pageSize: 10,
        pageIndex: 0,
      },
    },
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table}>
        <DataTableSortList table={table} />
      </DataTableToolbar>
    </DataTable>
  );
}
