"use client";

import { useQuery } from "@tanstack/react-query";
import getUsersDataByRole from "../queries";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import UsersTable from "../users-table";
import { ShopOwnerColumns } from "./shop-owner-columns";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function PemilikWarungPage() {
  const [queryStates, setQueryStates] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      perPage: parseAsInteger.withDefault(10),
      name: parseAsString.withDefault(""),
    },
    {
      history: "replace",
      shallow: false,
      clearOnDefault: true,
    }
  );

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users", queryStates],
    queryFn: async function () {
      return await getUsersDataByRole(queryStates, "SHOP_OWNER");
    },
  });

  return (
    <Card>
      <CardContent>
        <div className="flex mb-4 justify-between items-center">
          <Input
            placeholder="Cari nama . . ."
            onChange={(e) => setQueryStates({ name: e.target.value })}
          />
        </div>

        {isLoading && (
          <div>
            <DataTableSkeleton columnCount={4} />
          </div>
        )}

        {!isLoading && isError && (
          <div>
            <h1>Terjadi kesalahan...</h1>
          </div>
        )}

        {!isLoading && !isError && data && (
          <UsersTable columns={ShopOwnerColumns} promises={data} />
        )}
      </CardContent>
    </Card>
  );
}
