import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { IconChecks, IconEye } from "@tabler/icons-react";
import { refundReasonMapping } from "@/constant/refund-mapping";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getHomeOwnerShopRefunds } from "./pengajuan-refund/queries";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

export default async function HomeRefundSection({
  shop_id,
}: {
  shop_id: string;
}) {
  const { refunds, totals } = await getHomeOwnerShopRefunds(shop_id);

  return (
    <div className="mt-7">
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-lg font-semibold ">Pengajuan Refund</h1>

        {totals > 1 && <Badge>{totals}</Badge>}
      </div>

      {totals === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconChecks />
            </EmptyMedia>
            <EmptyTitle>Belum Ada Pengajuan</EmptyTitle>
            <EmptyDescription></EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            {refunds.map((refund, idx) => (
              <Link
                key={idx}
                href={"/dashboard-kedai/pengajuan-refund/" + refund.id}
              >
                <Card>
                  <CardContent>
                    <CardTitle>{refund.order.customer.name}</CardTitle>
                    <CardDescription className="mt-1">
                      Rp {refund.amount}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {totals > 3 && (
            <div className="flex w-full justify-center mt-3">
              <Link
                href={"/dashboard-kedai/pengajuan-refund"}
                className="underline underline-offset-2 text-blue-500"
              >
                Lihat Selengkapnya
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
