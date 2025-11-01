import BackButton from "@/app/_components/back-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import InputRefundForm from "./input-refund-form";

export default async function RefundPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <div className="px-5 py-3 shadow w-full justify-between flex items-center">
        <div className="flex items-center">
          <BackButton url={`/order/${id}`} />
          <h1 className="font-semibold text-lg">Pengajuan Refund</h1>
        </div>
      </div>

      <div className="p-5">
        <Card>
          <CardContent>
            <CardTitle>Form Pengajuan Refund</CardTitle>
            <CardDescription className="mb-4">
              Baca ketentuan pengajuan refund
            </CardDescription>

            <InputRefundForm order_id={id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
