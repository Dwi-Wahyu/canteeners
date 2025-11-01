import BackButton from "@/app/_components/back-button";
import { getRefund } from "../queries";
import RefundDetailClient from "./refund-detail-client";
import NotFoundResource from "@/app/_components/not-found-resource";

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
      <div className="px-5 py-3 shadow w-full justify-between flex items-center">
        <div className="flex items-center">
          <BackButton />
          <h1 className="font-semibold text-lg">Detail Pengajuan Refund</h1>
        </div>
      </div>

      <RefundDetailClient refund={refund} />
    </div>
  );
}
