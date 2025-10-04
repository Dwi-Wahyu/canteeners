import { PageTitle } from "@/app/_components/page-title";
import { TabelAdmin } from "@/app/admin/users/admin/tabel-admin";
import { Card, CardContent } from "@/components/ui/card";
import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { SearchParams } from "nuqs";
import { UserSearchParams } from "@/validations/search-params/user-search-params";
import { auth } from "@/config/auth";
import UnauthorizedPage from "@/app/_components/unauthorized-page";
import { PageDescription } from "@/app/_components/page-description";
import { IconUsers } from "@tabler/icons-react";
import { Separator } from "@/components/ui/separator";
import { getUserData } from "../queries";

interface IndexPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function AdminPage(props: IndexPageProps) {
  const searchParams = await props.searchParams;
  const search = UserSearchParams.parse(searchParams);

  const session = await auth();

  if (!session) {
    return <UnauthorizedPage />;
  }

  if (session.user.role !== "admin") {
    return <UnauthorizedPage />;
  }

  const updatedSearch = {
    ...search,
    role: "admin",
  };

  const promises = await getUserData(updatedSearch);

  return (
    <Card>
      <CardContent>
        <div className=" mb-5">
          <PageTitle title="Data Admin" />
          <PageDescription text="Manajemen Data Admin" />
        </div>

        <Suspense fallback={<DataTableSkeleton columnCount={4} />}>
          <TabelAdmin promises={promises} />
        </Suspense>
      </CardContent>
    </Card>
  );
}
