import BackButton from "@/app/_components/back-button";
import { Card, CardContent } from "@/components/ui/card";
import ShopCartDetailClient from "./shop-cart-detail-client";
import { auth } from "@/config/auth";
import { getCustomerShopCart } from "../server-queries";
import NotFoundResource from "@/app/_components/not-found-resource";
import { redirect } from "next/navigation";
import UnauthorizedPage from "@/app/_components/unauthorized-page";
import { getCustomerProfile } from "@/app/admin/users/queries";
import TopbarWithBackButton from "@/components/layouts/topbar-with-backbutton";
import DeleteShopCartDialog from "./delete-shop-cart-dialog";

export default async function ShopCartDetailPage({
  params,
}: {
  params: Promise<{ shop_cart_id: string }>;
}) {
  const { shop_cart_id } = await params;

  const session = await auth();

  const shopCart = await getCustomerShopCart(shop_cart_id);

  if (!session) {
    redirect("/auth/signin");
  }

  if (!shopCart) {
    return <NotFoundResource />;
  }

  if (session.user.id !== shopCart.cart.user_id) {
    return <UnauthorizedPage />;
  }

  const customerProfile = await getCustomerProfile(session.user.id);

  if (!customerProfile) {
    return <UnauthorizedPage />;
  }

  const now = new Date();

  const open_time = shopCart.shop.open_time;
  const close_time = shopCart.shop.close_time;

  const ableToCheckout =
    shopCart.shop.status === "ACTIVE" ||
    (open_time !== null &&
      close_time !== null &&
      now >= open_time &&
      now <= close_time);

  return (
    <div>
      <TopbarWithBackButton
        title="Detail Keranjang"
        actionButton={<DeleteShopCartDialog shop_cart_id={shopCart.id} />}
      />

      <ShopCartDetailClient
        shopCart={shopCart}
        customerProfile={customerProfile}
        ableToCheckout={ableToCheckout}
        open_time={open_time}
        close_time={close_time}
      />
    </div>
  );
}
