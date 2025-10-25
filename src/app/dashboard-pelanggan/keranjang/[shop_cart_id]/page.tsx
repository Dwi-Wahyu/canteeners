import BackButton from "@/app/_components/back-button";
import { Card, CardContent } from "@/components/ui/card";
import ShopCartDetailClient from "./shop-cart-detail-client";
import { auth } from "@/config/auth";
import { getCustomerShopCart } from "../server-queries";
import NotFoundResource from "@/app/_components/not-found-resource";

export default async function ShopCartDetailPage({
  params,
}: {
  params: Promise<{ shop_cart_id: string }>;
}) {
  const { shop_cart_id } = await params;

  const session = await auth();

  const shopCart = await getCustomerShopCart(shop_cart_id);

  if (!shopCart) {
    return <NotFoundResource />;
  }

  return <ShopCartDetailClient shopCart={shopCart} />;
}
