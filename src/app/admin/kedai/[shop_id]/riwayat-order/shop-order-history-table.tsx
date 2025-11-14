"use client";

import { useDataTable } from "@/hooks/use-data-table";
import { getShopOrders } from "./server-queries";
import { ShopOrderHistoryColumns } from "./shop-order-history-columns";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableAdvancedToolbar } from "@/components/data-table/data-table-advanced-toolbar";
import { Input } from "@/components/ui/input";
import { useQueryState } from "nuqs";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { OrderSearchParamsType } from "@/validations/search-params/order-search-params";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";

export type PromiseType = Awaited<ReturnType<typeof getShopOrders>>;
export type DataType = PromiseType["data"][number];

export default function ShopOrderHistoryTable({
  shop_id,
  input,
}: {
  shop_id: string;
  input: OrderSearchParamsType;
}) {
  const columns = useMemo(() => ShopOrderHistoryColumns, []);

  const { data: serverData, isFetching } = useQuery({
    queryKey: ["shop-order-history", shop_id, input],
    queryFn: async () => {
      return await getShopOrders({ input, shop_id });
    },
  });

  const data = serverData?.data ?? [];
  const pageCount = serverData?.pageCount ?? 1;

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
  });

  const [name, setName] = useQueryState("name", {
    shallow: false,
    clearOnDefault: true,
    defaultValue: "",
  });

  return (
    <div className="mt-4">
      <Input
        placeholder="Cari Nama Pelanggan"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {isFetching && (
        <DataTableSkeleton columnCount={5} withViewOptions={false} />
      )}

      {!isFetching && (
        <DataTable table={table}>
          <DataTableAdvancedToolbar table={table}></DataTableAdvancedToolbar>
        </DataTable>
      )}
    </div>
  );
}
