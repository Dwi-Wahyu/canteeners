import TopbarWithBackButton from "@/components/layouts/topbar-with-backbutton";
import { auth } from "@/config/auth";
import { redirect } from "next/navigation";
import ShopPaymentMethodClient from "./shop-payment-method-client";
import { getShopPayments } from "./queries";

export default async function ShopPaymentMethodPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="">
      <TopbarWithBackButton
        title="Metode Pembayaran"
        backUrl="/dashboard-kedai/pengaturan"
      />
    </div>
  );
}
