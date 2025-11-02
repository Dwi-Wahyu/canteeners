import NotFoundResource from "@/app/_components/not-found-resource";
import UnauthorizedPage from "@/app/_components/unauthorized-page";
import { auth } from "@/config/auth";
import { redirect } from "next/navigation";
import RefundDetailClient from "./refund-detail-client";
import TopbarWithBackButton from "@/components/layouts/topbar-with-backbutton";
import { getCustomerRefund } from "../queries";

export default async function CustomerRefundDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  const refund = await getCustomerRefund(id);

  if (!refund) {
    return <NotFoundResource />;
  }

  if (refund.order.customer_id !== session.user.id) {
    return <UnauthorizedPage />;
  }

  return (
    <div>
      <TopbarWithBackButton
        title="Detail Pengajuan Refund"
        backUrl="/dashboard-pelanggan/pengajuan-refund"
      />

      <RefundDetailClient refund={refund} />
    </div>
  );
}
