import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { getRefund } from "../queries";

export default function RefundDetailClient({
  refund,
}: {
  refund: NonNullable<Awaited<ReturnType<typeof getRefund>>>;
}) {
  return (
    <Card>
      <CardContent>
        <CardTitle>Detail Pengajuan Refund</CardTitle>
      </CardContent>
    </Card>
  );
}
