import TopbarWithBackButton from "@/components/layouts/topbar-with-backbutton";
import { auth } from "@/config/auth";
import { redirect } from "next/navigation";

import PaymentMethodExplanationDialog from "./payment-method-explanation-dialog";
import QrisShopPayment from "./qris-shop-payment";
import { getShopPayments } from "./queries";
import UnderConstructionPage from "@/app/_components/under-construction";

export default async function ShopPaymentMethodPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  const payments = await getShopPayments(session.user.id);

  return (
    <div>
      <TopbarWithBackButton
        title="Metode Pembayaran"
        backUrl="/dashboard-kedai/pengaturan"
        actionButton={<PaymentMethodExplanationDialog />}
      />

      <h1>Lagi Dikerjain sabar ya . . .</h1>
    </div>

    // <div className="">
    //   <TopbarWithBackButton
    //     title="Metode Pembayaran"
    //     backUrl="/dashboard-kedai/pengaturan"
    //     actionButton={<PaymentMethodExplanationDialog />}
    //   />

    //   <div className="flex gap-4 flex-col">
    //     <QrisShopPayment active />
    //   </div>
    // </div>
  );
}
