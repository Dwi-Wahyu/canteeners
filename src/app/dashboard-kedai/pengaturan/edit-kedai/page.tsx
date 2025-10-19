import { auth } from "@/config/auth";
import { redirect } from "next/navigation";
import { getShopById } from "../queries";
import UnauthorizedPage from "@/app/_components/unauthorized-page";
import EditShopForm from "./edit-shop-form";
import BackButton from "@/app/_components/back-button";
import { Card, CardContent } from "@/components/ui/card";

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
      <BackButton />

      <Card className="mt-4">
        <CardContent>
          <h1 className="text-lg font-semibold mb-4">Edit Profil Kedai</h1>
          <EditShopForm initialData={shop} />
        </CardContent>
      </Card>
    </div>
  );
}
