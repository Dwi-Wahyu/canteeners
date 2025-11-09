import { auth } from "@/config/auth";
import { redirect } from "next/navigation";
import ShopOrderClient from "./shop-order-client";

export default async function ShopOrderPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  return <ShopOrderClient owner_id={session.user.id} />;
}
