import BackButton from "@/app/_components/back-button";
import { getRefund } from "../queries";
import RefundDetailClient from "./refund-detail-client";
import NotFoundResource from "@/app/_components/not-found-resource";
import TopbarWithBackButton from "@/components/layouts/topbar-with-backbutton";

export default async function RefundDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const refund = await getRefund(id);

  if (!refund) {
    return <NotFoundResource />;
  }

  return (
    <div>
      <TopbarWithBackButton
        title="Detail Pengajuan Refund"
        backUrl={"/dashboard-kedai/pengajuan-refund"}
      />

      <RefundDetailClient refund={refund} />
    </div>
  );
}
