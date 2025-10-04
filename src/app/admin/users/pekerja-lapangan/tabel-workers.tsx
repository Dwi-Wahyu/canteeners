"use client";

import { useQueryState } from "nuqs";
import { getWorkersData } from "./queries";
import { Input } from "@/components/ui/input";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableAdvancedToolbar } from "@/components/data-table/data-table-advanced-toolbar";
import { TabelWorkersColumns } from "./tabel-workers-columns";
import { Button } from "@/components/ui/button";
import { FunnelX, UserPlus } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import UnauthorizedPage from "@/app/_components/unauthorized-page";

type TableType = Awaited<ReturnType<typeof getWorkersData>>;

export type WorkersColumnType = TableType["data"][number];

export function TabelWorkers({ promises }: { promises: TableType }) {
  const { data, filtered, pageCount } = promises;

  const [nama, setNama] = useQueryState("nama", {
    shallow: false,
    clearOnDefault: true,
    defaultValue: "",
  });

  const { table } = useDataTable({
    data,
    columns: TabelWorkersColumns,
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

  function handleClear() {
    setNama("");
  }

  const session = useSession();

  if (session.status === "unauthenticated") {
    return <UnauthorizedPage />;
  }

  return (
    <div>
      <DataTable table={table}>
        <DataTableAdvancedToolbar table={table}>
          <div className="flex items-center justify-between w-full flex-col sm:flex-row">
            <div className="flex gap-2 items-center ">
              <Input
                placeholder="Cari Nama . . ."
                value={nama}
                onChange={(e) => setNama(e.target.value)}
              />

              <Button variant={"outline"} onClick={handleClear}>
                <FunnelX />
              </Button>
            </div>

            <Button asChild>
              <Link href="/admin/users/pekerja-lapangan/create">
                <UserPlus /> Input Pekerja Lapangan
              </Link>
            </Button>
          </div>
        </DataTableAdvancedToolbar>
      </DataTable>
    </div>
  );
}
