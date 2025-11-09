import { auth } from "@/config/auth";
import { redirect } from "next/navigation";
import { getShopById } from "../queries";
import UnauthorizedPage from "@/app/_components/unauthorized-page";
import EditShopForm from "./edit-shop-form";
import { Card, CardContent } from "@/components/ui/card";
import TopbarWithBackButton from "@/components/layouts/topbar-with-backbutton";

export default async function EditShopPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  const shop = await getShopById(session.user.id);

  if (!shop) {
    return <UnauthorizedPage />;
  }

  return (
    <div>
      <TopbarWithBackButton title="Edit Data Kedai" />

      <Card>
        <CardContent>
          <EditShopForm initialData={shop} />
        </CardContent>
      </Card>
    </div>
  );
}
