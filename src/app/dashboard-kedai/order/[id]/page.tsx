import NotFoundResource from "@/app/_components/not-found-resource";
import { getShopOrderDetail } from "../queries";
import TopbarWithBackButton from "@/components/layouts/topbar-with-backbutton";
import ShopOrderDetailClient from "./shop-order-detail-client";
import { auth } from "@/config/auth";
import UnauthorizedPage from "@/app/_components/unauthorized-page";
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

  const order = await getShopOrderDetail(id);

  if (!order) {
    return <NotFoundResource />;
  }

  if (session.user.id !== order.shop.owner_id) {
    return <UnauthorizedPage />;
  }

  return (
    <div>
      <TopbarWithBackButton title="Detail Order" />

      <ShopOrderDetailClient order={order} />

      <OrderReviewSection
        customer={{ avatar: order.customer.avatar, name: order.customer.name }}
        isUserCustomer={false}
        order_id={order.id}
        prevTestimony={order.testimony}
      />
    </div>
  );
}
