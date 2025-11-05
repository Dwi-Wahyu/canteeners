import NotFoundResource from "@/app/_components/not-found-resource";
import { getCanteenWithMapsAndTables } from "@/app/admin/kantin/queries";
import ChooseTableClient from "./choose-table-client";
import { auth } from "@/config/auth";
import { redirect } from "next/navigation";
import TopbarWithBackButton from "@/components/layouts/topbar-with-backbutton";
import { getCustomerSelectedTable } from "../../queries";
import { IconMap } from "@tabler/icons-react";
import Link from "next/link";

export default async function ChooseTablePage({
  params,
}: {
  params: Promise<{ canteen_id: string }>;
}) {
  const { canteen_id } = await params;

  const parsedCanteenId = parseInt(canteen_id);

  const canteen = await getCanteenWithMapsAndTables(parsedCanteenId);
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  if (!canteen) {
    return <NotFoundResource />;
  }

  const customerSelectedTable = await getCustomerSelectedTable(session.user.id);

  return (
    <div>
      <TopbarWithBackButton
        title="Pilih Meja"
        actionButton={
          <Link href={`/dashboard-pelanggan/kantin/${canteen_id}/denah`}>
            <IconMap className="w-5 h-5 text-muted-foreground" />
          </Link>
        }
      />

      <h1 className="font-semibold">{canteen.name}</h1>
      <h1 className="text-muted-foreground">
        Pastikan meja tidak sedang digunakan orang lain
      </h1>

      <ChooseTableClient
        canteen={canteen}
        user_id={session.user.id}
        canteen_id={parseInt(canteen_id)}
        defaultSelectedTable={
          customerSelectedTable &&
          customerSelectedTable.canteen_id === parsedCanteenId
            ? {
                floor: customerSelectedTable.floor ?? 1,
                table_number: customerSelectedTable.table_number ?? 1,
              }
            : null
        }
      />
    </div>
  );
}
