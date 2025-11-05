import TopbarWithBackButton from "@/components/layouts/topbar-with-backbutton";
import { auth } from "@/config/auth";
import { redirect } from "next/navigation";
import CustomerOrderClient from "./customer-order-client";

export default async function CustomerOrderHistoryPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div>
      <TopbarWithBackButton
        title="Riwayat Order"
        backUrl="/dashboard-pelanggan/pengaturan"
      />

      <CustomerOrderClient customer_id={session.user.id} />
    </div>
  );
}
