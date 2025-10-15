import OrderDetailsClient from "./order-details-client";
import { getOrderDetails } from "../queries";
import NotFoundResource from "@/app/_components/not-found-resource";
import BackButton from "@/app/_components/back-button";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/config/auth";
import { redirect } from "next/navigation";
import UnauthorizedPage from "@/app/_components/unauthorized-page";

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
    </div>
  );
}
