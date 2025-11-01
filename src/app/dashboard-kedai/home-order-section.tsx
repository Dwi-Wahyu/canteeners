import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { formatDateToYYYYMMDD } from "@/helper/date-helper";
import { formatToHour } from "@/helper/hour-helper";
import {
  IconChevronRight,
  IconInvoice,
  IconMessage,
  IconReceipt,
  IconReceiptOff,
} from "@tabler/icons-react";
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
      <h1 className="text-lg font-semibold mb-3">Order Masuk</h1>

      {orders.length === 0 && (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconReceiptOff />
            </EmptyMedia>
            <EmptyTitle>Belum Ada Order Hari Ini</EmptyTitle>
            <EmptyDescription>
              Klik tombol dibawah untuk riwayat order kedai anda
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button size={"sm"}>Lihat Riwayat</Button>
          </EmptyContent>
        </Empty>
      )}

      {orders.map((order, idx) => {
        return (
          <Item
            key={idx}
            variant="outline"
            className="mt-2 relative shadow rounded-lg"
          >
            <Badge
              className="-top-3 -right-2 absolute"
              variant={
                ["REJECTED", "PAYMENT_REJECTED"].includes(order.status)
                  ? "destructive"
                  : "default"
              }
            >
              {orderStatusMapping[order.status]}
            </Badge>

            <ItemContent>
              <ItemTitle>{order.customer.name}</ItemTitle>
              <ItemDescription>
                {formatDateToYYYYMMDD(order.created_at)}{" "}
                {formatToHour(order.created_at)}
              </ItemDescription>
            </ItemContent>
            <ItemActions className="mt-2">
              <Button asChild variant={"outline"} size={"icon"}>
                <Link href={"/order/" + order.id}>
                  <IconReceipt />
                </Link>
              </Button>
            </ItemActions>
          </Item>
        );
      })}
    </div>
  );
}
