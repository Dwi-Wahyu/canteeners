import OrderDetailsClient from "./order-details-client";
import { getOrderDetails } from "../queries";
import NotFoundResource from "@/app/_components/not-found-resource";
import BackButton from "@/app/_components/back-button";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/config/auth";
import { redirect } from "next/navigation";
import UnauthorizedPage from "@/app/_components/unauthorized-page";
import OrderReviewSection from "./order-review-section";
import OrderComplaintClient from "./order-complaint-client";

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

  const backUrl =
    session.user.role === "SHOP_OWNER"
      ? "/dashboard-kedai/chat/" + data.conversation_id
      : "/dashboard-pelanggan/chat/" + data.conversation_id;

  const userIsShopOwner = data.shop.owner_id === session.user.id;
  const userIsCustomer = data.customer_id === session.user.id;

  return (
    <div className="">
      <div className="px-5 py-3 shadow w-full justify-between flex items-center">
        <div className="flex items-center">
          <BackButton url={backUrl} />
          <h1 className="font-semibold text-lg">Detail Order</h1>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-4">
        <Card>
          <CardContent className="">
            <OrderDetailsClient
              data={data}
              user_id={session.user.id}
              userIsCustomer={userIsCustomer}
              userIsShopOwner={userIsShopOwner}
            />
          </CardContent>
        </Card>

        {data.status === "COMPLETED" && (
          <OrderReviewSection
            order_id={data.id}
            isUserCustomer={data.customer_id === session.user.id}
            customer={{
              avatar: data.customer.avatar,
              name: data.customer.name,
            }}
            prevTestimony={data.testimony}
          />
        )}

        {data.status === "COMPLETED" && (
          <OrderComplaintClient
            order_id={data.id}
            isUserCustomer={data.customer_id === session.user.id}
            customer={{
              avatar: data.customer.avatar,
              name: data.customer.name,
            }}
            prevComplaint={data.complaint}
          />
        )}
      </div>
    </div>
  );
}
