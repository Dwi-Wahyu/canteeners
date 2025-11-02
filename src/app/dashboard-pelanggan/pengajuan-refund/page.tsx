import TopbarWithBackButton from "@/components/layouts/topbar-with-backbutton";
import { auth } from "@/config/auth";
import { redirect } from "next/navigation";

import {
  refundReasonMapping,
  refundStatusMapping,
} from "@/constant/refund-mapping";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";
import { NavigationButton } from "@/app/_components/navigation-button";
import { IconEye, IconTrash } from "@tabler/icons-react";
import { formatDateWithoutYear } from "@/helper/date-helper";
import { formatToHour } from "@/helper/hour-helper";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { prisma } from "@/lib/prisma";

export default async function CustomerRefundPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  const refunds = await await prisma.refund.findMany({
    where: {
      order: {
        customer_id: session.user.id,
      },
    },
    select: {
      id: true,
      status: true,
      reason: true,
      requested_at: true,
      order: {
        select: {
          shop: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  return (
    <div>
      <TopbarWithBackButton
        title="Pengajuan Refund"
        backUrl="/dashboard-pelanggan/pengaturan"
      />

      {refunds.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconTrash />
            </EmptyMedia>
            <EmptyTitle>Tidak Ada Refund</EmptyTitle>
            <EmptyDescription>
              Customer Belum Membuat Pengajuan
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="flex flex-col gap-4">
          {refunds.map((refund, idx) => (
            <Item variant={"outline"} key={idx}>
              <ItemHeader>
                <h1 className="font-semibold text-base">
                  {refund.order.shop.name}
                </h1>

                <h1>
                  {formatDateWithoutYear(refund.requested_at)}{" "}
                  {formatToHour(refund.requested_at)}
                </h1>
              </ItemHeader>
              <ItemContent key={idx}>
                <ItemTitle>{refundReasonMapping[refund.reason]}</ItemTitle>
                <ItemDescription>
                  {refundStatusMapping[refund.status]}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <NavigationButton
                  url={"/dashboard-pelanggan/pengajuan-refund/" + refund.id}
                >
                  <IconEye />
                </NavigationButton>
              </ItemActions>
            </Item>
          ))}
        </div>
      )}
    </div>
  );
}
