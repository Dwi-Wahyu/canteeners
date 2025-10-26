import OrderDetailsClient from "./order-details-client";
import { getOrderDetails } from "../queries";
import NotFoundResource from "@/app/_components/not-found-resource";
import BackButton from "@/app/_components/back-button";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/config/auth";
import { redirect } from "next/navigation";
import UnauthorizedPage from "@/app/_components/unauthorized-page";
import { Button } from "@/components/ui/button";
import { IconStar } from "@tabler/icons-react";
import { Textarea } from "@/components/ui/textarea";

export default async function DetailOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  const data = await getOrderDetails(id);

  if (!data) {
    return (
      <div className="p-5">
        <NotFoundResource />
      </div>
    );
  }

  if (
    session.user.role === "CUSTOMER" &&
    data.customer_id !== session.user.id
  ) {
    return (
      <div className="p-5">
        <UnauthorizedPage />
      </div>
    );
  }

  if (
    session.user.role === "SHOP_OWNER" &&
    data.shop.owner_id !== session.user.id
  ) {
    return (
      <div className="p-5">
        <UnauthorizedPage />
      </div>
    );
  }

  return (
    <div className="p-5">
      <BackButton />
      <Card className="mt-4">
        <CardContent>
          <OrderDetailsClient data={data} user_id={session.user.id} />
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardContent className="flex flex-col gap-4">
          <div>
            <h1 className="text-lg font-semibold">Ulasan / Rating</h1>
            <h1 className="mt-1 text-muted-foreground">
              Berikan rating untuk kedai atau aplikasi Canteeners
            </h1>
          </div>

          <div>
            <h1 className="font-semibold">Rating</h1>

            <div className="flex gap-2 mt-1 items-center">
              <IconStar />
              <IconStar />
              <IconStar />
              <IconStar />
              <IconStar />
            </div>
          </div>

          <div>
            <h1 className="font-semibold">Ulasan</h1>
            <Textarea className="mt-1" />
          </div>

          <Button>Tambahkan Ulasan</Button>
        </CardContent>
      </Card>
    </div>
  );
}
