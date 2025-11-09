import TopbarWithBackButton from "@/components/layouts/topbar-with-backbutton";
import ShopOrderHistoryClient from "./shop-order-history-page";
import { auth } from "@/config/auth";
import { redirect } from "next/navigation";

export default async function OrderHistoryPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div>
      <TopbarWithBackButton
        title="Riwayat Order"
        backUrl="/dashboard-kedai/order"
      />

      <ShopOrderHistoryClient owner_id={session.user.id} />
    </div>
  );
}
