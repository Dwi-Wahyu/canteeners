import { PageTitle } from "@/app/_components/page-title";
import { Card, CardContent } from "@/components/ui/card";
import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { SearchParams } from "nuqs";
import { UserSearchParams } from "@/validations/search-params/user-search-params";
import { auth } from "@/config/auth";
import UnauthorizedPage from "@/app/_components/unauthorized-page";
import { getWorkersData } from "./queries";
import { PageDescription } from "@/app/_components/page-description";
import { IconUsers } from "@tabler/icons-react";
import { TabelWorkers } from "./tabel-workers";

interface IndexPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function WorkersPage(props: IndexPageProps) {
  const searchParams = await props.searchParams;
  const search = UserSearchParams.parse(searchParams);

  const session = await auth();

  if (!session) {
    return <UnauthorizedPage />;
  }

  if (session.user.role !== "admin") {
    return <UnauthorizedPage />;
  }

  const promises = await getWorkersData(search);

  return (
    <Card>
      <CardContent>
        <div className="mb-5">
          <PageTitle title="Data Pekerja Lapangan" />
          <PageDescription text="Manajemen Data Pekerja Lapangan" />
        </div>
        <Suspense fallback={<DataTableSkeleton columnCount={3} />}>
          <TabelWorkers promises={promises} />
        </Suspense>
      </CardContent>
    </Card>
  );
}
