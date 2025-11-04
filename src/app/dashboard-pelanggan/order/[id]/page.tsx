import NotFoundResource from "@/app/_components/not-found-resource";
import TopbarWithBackButton from "@/components/layouts/topbar-with-backbutton";
import { auth } from "@/config/auth";
import UnauthorizedPage from "@/app/_components/unauthorized-page";
import { getCustomerOrderDetail } from "../queries";
import CustomerOrderDetailClient from "./customer-order-detail-client";
import OrderReviewSection from "@/app/order/[id]/order-review-section";

export default async function ShopOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await auth();

  if (!session) {
    return <UnauthorizedPage />;
  }

  const order = await getCustomerOrderDetail(id);

  if (!order) {
    return <NotFoundResource />;
  }

  if (session.user.id !== order.customer_id) {
    return <UnauthorizedPage />;
  }

  return (
    <div className="flex flex-col gap-4">
      <TopbarWithBackButton title="Detail Order" />

      <CustomerOrderDetailClient order={order} />

      {order.status === "COMPLETED" && (
        <OrderReviewSection
          customer={{
            avatar: order.customer.avatar,
            name: order.customer.name,
          }}
          isUserCustomer={true}
          order_id={order.id}
          prevTestimony={order.testimony}
        />
      )}
    </div>
  );
}
