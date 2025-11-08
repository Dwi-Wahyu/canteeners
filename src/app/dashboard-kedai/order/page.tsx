import TopbarWithBackButton from "@/components/layouts/topbar-with-backbutton";
import { auth } from "@/config/auth";
import { redirect } from "next/navigation";
import ShopOrderClient from "./shop-order-client";
import Link from "next/link";

export default async function ShopOrderPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div>
      <TopbarWithBackButton
        title="Daftar Order"
        actionButton={
          <Link href={"/dashboard-kedai/order/history"}>
            <img src="/icons/clock-reverse.svg" alt="" />
          </Link>
        }
      />

      <ShopOrderClient owner_id={session.user.id} />
    </div>
  );
}
