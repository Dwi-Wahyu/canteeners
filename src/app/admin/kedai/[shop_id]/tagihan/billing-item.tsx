"use client";

import Link from "next/link";
import { getShopBillings } from "./server-queries";

import { formatDateWithoutYear } from "@/helper/date-helper";
import CustomBadge from "@/components/custom-badge";
import { ShopBillingStatus } from "@/app/generated/prisma";
import { shopBillingStatusMapping } from "@/constant/shop-billing-mapping";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from "@/components/ui/item";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconEye, IconTrash } from "@tabler/icons-react";

type ShopBillingsReturn = NonNullable<
  Awaited<ReturnType<typeof getShopBillings>>
>;
type BillingData = NonNullable<
  ShopBillingsReturn["shopDataIncludeBillings"]
>["billings"][number];

export default function BillingItem({
  billing,
  shop_id,
}: {
  billing: BillingData;
  shop_id: string;
}) {
  return (
    <Link href={`/admin/kedai/${shop_id}/tagihan/${billing.id}`}>
      <Item variant={"outline"}>
        <ItemContent>
          <ItemTitle>
            {formatDateWithoutYear(billing.start_date)} -{" "}
            {formatDateWithoutYear(billing.end_date)}
          </ItemTitle>

          <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
            <Badge variant={"outline"}>Subtotal | Rp {billing.total}</Badge>
            <Badge variant={"outline"}>Refund | Rp {billing.total}</Badge>
            <Badge>Total | Rp {billing.total}</Badge>
            <CustomBadge
              value={billing.status}
              successValues={[ShopBillingStatus.PAID]}
              destructiveValues={[ShopBillingStatus.UNPAID]}
            >
              {shopBillingStatusMapping[billing.status]}
            </CustomBadge>
          </div>
        </ItemContent>
      </Item>
    </Link>
  );
}
