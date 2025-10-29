import NotFoundResource from "@/app/_components/not-found-resource";
import { getCanteenWithMapsAndTables } from "@/app/admin/kantin/queries";
import ChooseTableClient from "./choose-table-client";
import BackButton from "@/app/_components/back-button";
import { auth } from "@/config/auth";
import { redirect } from "next/navigation";

export default async function ChooseTablePage({
  params,
}: {
  params: Promise<{ canteen_id: string }>;
}) {
  const { canteen_id } = await params;

  const canteen = await getCanteenWithMapsAndTables(parseInt(canteen_id));
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  if (!canteen) {
    return <NotFoundResource />;
  }

  return (
    <div>
      <div className="px-5 py-3 shadow flex items-center gap-1 z-50 fixed top-0 left-0 w-full">
        <BackButton />
        <h1 className="font-semibold text-lg">Pilih Meja</h1>
      </div>

      <div className="mt-14">
        <h1 className="font-semibold">{canteen.name}</h1>
        <h1 className="text-muted-foreground">
          Pastikan meja tidak sedang digunakan orang lain
        </h1>

        <ChooseTableClient
          canteen={canteen}
          user_id={session.user.id}
          canteen_id={parseInt(canteen_id)}
        />
      </div>
    </div>
  );
}
