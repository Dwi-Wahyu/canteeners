import { Card, CardContent, CardTitle } from "@/components/ui/card";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { IconEye, IconReceiptRefund } from "@tabler/icons-react";
import { refundReasonMapping } from "@/constant/refund-mapping";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getHomeOwnerShopRefunds } from "./pengajuan-refund/queries";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

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
              <IconReceiptRefund />
            </EmptyMedia>
            <EmptyTitle>Belum Ada Pengajuan</EmptyTitle>
            <EmptyDescription></EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            {refunds.map((refund, idx) => (
              <Item variant={"outline"} key={idx}>
                <ItemContent>
                  <ItemTitle>{refund.order.customer.name}</ItemTitle>
                  <ItemDescription>
                    {refundReasonMapping[refund.reason]}
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button variant={"outline"} size={"icon"}>
                    <Link
                      href={"/dashboard-kedai/pengajuan-refund/" + refund.id}
                    >
                      <IconEye />
                    </Link>
                  </Button>
                </ItemActions>
              </Item>
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
