import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { formatDateToYYYYMMDD } from "@/helper/date-helper";
import { formatToHour } from "@/helper/hour-helper";
import { IconReceipt, IconReceiptOff } from "@tabler/icons-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { orderStatusMapping } from "@/constant/order-status-mapping";
import { Button } from "@/components/ui/button";
import { getShopDataAndRecentOrder } from "./owner-dashboard-queries";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

type RecentOrdersType = NonNullable<
  Awaited<ReturnType<typeof getShopDataAndRecentOrder>>
>["orders"];

export default function HomeOrderSection({
  orders,
}: {
  orders: RecentOrdersType;
}) {
  return (
    <div className="mt-7">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">Order Masuk</h1>

        <Link
          href={"/dashboard-kedai/order/"}
          className="underline text-blue-500 text-sm"
        >
          Lihat Selengkapnya
        </Link>
      </div>

      {orders.length === 0 && (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconReceiptOff />
            </EmptyMedia>
            <EmptyTitle>Belum Ada Order Hari Ini</EmptyTitle>
          </EmptyHeader>
        </Empty>
      )}

      {orders.map((order, idx) => {
        return (
          <Link key={idx} href={"/dashboard-kedai/order/" + order.id}>
            <Item variant="outline" className="mt-2 relative shadow rounded-lg">
              <ItemContent>
                <ItemTitle>{order.customer.name}</ItemTitle>
                <ItemDescription>
                  {formatDateToYYYYMMDD(order.created_at)}{" "}
                  {formatToHour(order.created_at)}
                </ItemDescription>
              </ItemContent>
            </Item>
          </Link>
        );
      })}
    </div>
  );
}
