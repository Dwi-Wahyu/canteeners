"use client";

import { useQuery } from "@tanstack/react-query";
import { getCustomerOrders } from "./queries";

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

export default function CustomerOrderClient({
  customer_id,
}: {
  customer_id: string;
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["customer-order-fetch", customer_id],
    queryFn: async () => {
      return await getCustomerOrders(customer_id);
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
            <EmptyDescription>Yuk Belanja Sekarang</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      {!isLoading && data && data.length > 0 && (
        <div className="flex flex-col gap-4">
          {data.map((order, idx) => (
            <Item key={idx} variant={"outline"}>
              <ItemHeader>
                <h1>
                  {formatDateWithoutYear(order.created_at)}{" "}
                  {formatToHour(order.created_at)}
                </h1>

                <h1>Rp {order.total_price}</h1>
              </ItemHeader>

              <ItemContent>
                <ItemTitle>{order.shop.name}</ItemTitle>
                <ItemDescription>
                  {orderStatusMapping[order.status]}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <NavigationButton
                  url={"/dashboard-pelanggan/order/" + order.id}
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
