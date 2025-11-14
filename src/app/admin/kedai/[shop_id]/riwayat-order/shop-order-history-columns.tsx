"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataType } from "./shop-order-history-table";
import { formatDateToYYYYMMDD } from "@/helper/date-helper";
import { NavigationButton } from "@/app/_components/navigation-button";

export const ShopOrderHistoryColumns: ColumnDef<DataType>[] = [
  {
    accessorKey: "created_at",
    header: "Tanggal",
    cell({ row }) {
      return <h1>{formatDateToYYYYMMDD(row.original.created_at)}</h1>;
    },
  },
  {
    header: "Pelanggan",
    cell({ row }) {
      return <h1>{row.original.customer.name}</h1>;
    },
  },
  {
    header: "Jumlah Produk",
    cell({ row }) {
      return <h1>{row.original._count.order_items} Produk</h1>;
    },
  },
  {
    accessorKey: "total_price",
    header: "Total Harga",
    cell({ row }) {
      return <h1 className="font-semibold">Rp {row.original.total_price}</h1>;
    },
  },
  {
    id: "actions",
    cell: function Cell({ row }) {
      return (
        <div>
          <NavigationButton
            url={`/admin/kedai/${row.original.shop_id}/riwayat-order/${row.original.id}`}
          >
            Detail
          </NavigationButton>
        </div>
      );
    },
    size: 5,
  },
];
