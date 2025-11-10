import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import InputRefundForm from "./input-refund-form";
import Link from "next/link";
import TopbarWithBackButton from "@/components/layouts/topbar-with-backbutton";

export default async function RefundPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <TopbarWithBackButton
        title="Pengajuan Refund"
        backUrl={"/dashboard-pelanggan/order/" + id}
      />

      <div>
        <Card>
          <CardContent>
            <CardTitle>Form Pengajuan Refund</CardTitle>
            <CardDescription className="mb-4 mt-1">
              Sebelum membuat pengajuan, silakan baca{" "}
              <Link
                className="underline text-blue-500"
                href={"/syarat-dan-ketentuan"}
              >
                ketentuan pengajuan refund
              </Link>
            </CardDescription>

            <InputRefundForm order_id={id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
