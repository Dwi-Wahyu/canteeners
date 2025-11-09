import TopbarWithBackButton from "@/components/layouts/topbar-with-backbutton";
import { auth } from "@/config/auth";
import { redirect } from "next/navigation";
import { getOwnerShopRefunds } from "./queries";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  refundReasonMapping,
  refundStatusMapping,
} from "@/constant/refund-mapping";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { IconChecks, IconTrash } from "@tabler/icons-react";
import { NavigationButton } from "@/app/_components/navigation-button";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function OwnerRefundPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  const refunds = await getOwnerShopRefunds(session.user.id);

  return (
    <div>
      <TopbarWithBackButton
        title="Daftar Pengajuan Refund"
        backUrl="/dashboard-kedai"
      />

      {refunds.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconChecks />
            </EmptyMedia>
            <EmptyTitle>Tidak Ada Refund</EmptyTitle>
            <EmptyDescription>
              Tidak ada pengajuan refund pada kedai Anda.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <>
          {refunds.map((refund, idx) => (
            <Card key={idx}>
              <CardContent className="flex flex-col gap-1">
                <div className="flex gap-2 items-center mb-2">
                  <Avatar className="size-10">
                    <AvatarImage
                      src={"/uploads/avatar/" + refund.order.customer.avatar}
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>

                  <div>
                    <CardTitle>{refund.order.customer.name}</CardTitle>
                    <CardDescription>
                      {refundStatusMapping[refund.status]}
                    </CardDescription>
                  </div>
                </div>

                <div>
                  <h1 className="font-semibold">Alasan</h1>
                  <h1 className="text-muted-foreground">
                    {refundReasonMapping[refund.reason]}
                  </h1>
                </div>

                <div>
                  <h1 className="font-semibold">Jumlah</h1>
                  <h1 className="text-muted-foreground">Rp {refund.amount}</h1>
                </div>

                <div className="flex justify-end mt-4">
                  <NavigationButton
                    url={"/dashboard-kedai/pengajuan-refund/" + refund.id}
                    label="Lihat Detail"
                    variant="default"
                    size="sm"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </div>
  );
}
