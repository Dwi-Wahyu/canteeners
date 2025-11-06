"use client";

import { useQuery } from "@tanstack/react-query";
import { getShopOrders } from "./server-queries";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { IconEye, IconReceiptOff } from "@tabler/icons-react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";
import { NavigationButton } from "@/app/_components/navigation-button";
import { orderStatusMapping } from "@/constant/order-status-mapping";
import { formatDateWithoutYear } from "@/helper/date-helper";
import { formatToHour } from "@/helper/hour-helper";
import { Skeleton } from "@/components/ui/skeleton";
import OrderEstimationCountDown from "@/app/order/order-estimation-countdown";
import Link from "next/link";

export default function ShopOrderClient({ owner_id }: { owner_id: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["shop-order-fetch", owner_id],
    queryFn: async () => {
      return await getShopOrders(owner_id);
    },
  });

  return (
    <div>
      {isLoading && (
        <div className="flex flex-col gap-4">
          <Skeleton className="w-full h-10" />
          <Skeleton className="w-full h-10" />
          <Skeleton className="w-full h-10" />
          <Skeleton className="w-full h-10" />
        </div>
      )}

      {!isLoading && data && data.length === 0 && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconReceiptOff />
            </EmptyMedia>
            <EmptyTitle>Belum Ada Order</EmptyTitle>
            <EmptyDescription>Silakan Tambahkan Produk</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      {!isLoading && data && data.length > 0 && (
        <div className="flex flex-col gap-4">
          {data.map((order, idx) => (
            <Link key={idx} href={`/dashboard-kedai/order/${order.id}`}>
              <Item variant={"outline"}>
                <ItemHeader>
                  <h1>
                    {formatDateWithoutYear(order.created_at)}{" "}
                    {formatToHour(order.created_at)}
                  </h1>

                  <h1>Rp {order.total_price}</h1>
                </ItemHeader>

                <ItemContent>
                  <ItemTitle>{order.customer.name}</ItemTitle>
                  <ItemDescription>
                    {orderStatusMapping[order.status]}
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  {order.estimation && (
                    <h1>
                      <OrderEstimationCountDown
                        estimation={order.estimation}
                        processed_at={order.processed_at}
                      />
                    </h1>
                  )}
                </ItemActions>
              </Item>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
