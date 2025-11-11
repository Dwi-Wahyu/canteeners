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
import {
  IconAlertCircle,
  IconChevronRight,
  IconEye,
  IconReceiptOff,
} from "@tabler/icons-react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";
import { orderStatusMapping } from "@/constant/order-status-mapping";
import { formatDateWithoutYear } from "@/helper/date-helper";
import { formatToHour } from "@/helper/hour-helper";
import { Skeleton } from "@/components/ui/skeleton";
import OrderEstimationCountDown from "@/app/order/order-estimation-countdown";
import Link from "next/link";
import { OrderStatus } from "@/app/generated/prisma";
import {
  calculateOrderEstimationRemainining,
  calculateTimeRemaining,
} from "@/helper/calculate-time-remaining";
import TopbarWithBackButton from "@/components/layouts/topbar-with-backbutton";

export default function ShopOrderClient({ owner_id }: { owner_id: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["shop-order-fetch", owner_id],
    queryFn: async () => {
      return await getShopOrders(owner_id);
    },
  });

  function getStatusColor(status: OrderStatus, time_remaining?: string) {
    switch (status) {
      case "PROCESSING":
        if (time_remaining === "Selesai") {
          return "destructive";
        }
        return "green";
      default:
        return "card";
    }
  }

  return (
    <div>
      <TopbarWithBackButton
        title="Daftar Order"
        backUrl="/dashboard-kedai"
        actionButton={
          <Link href={"/dashboard-kedai/order/riwayat"}>
            <img src="/icons/clock-reverse.svg" className="w-5 h-5" alt="" />
          </Link>
        }
      />

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
            <EmptyTitle>Belum Ada Order Terkini</EmptyTitle>
            <EmptyDescription>
              Order yang belum selesai akan muncul disini
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      {!isLoading && data && data.length > 0 && (
        <div className="flex flex-col gap-4">
          {data.map((order, idx) => {
            if (!order.estimation) {
              return (
                <Link key={idx} href={`/dashboard-kedai/order/${order.id}`}>
                  <Item
                    variant={"outline"}
                    className={`border-${getStatusColor(order.status)}`}
                  >
                    <ItemHeader>
                      <div>
                        <h1>{order.order_items.length} Produk</h1>
                      </div>

                      <h1>Rp {order.total_price}</h1>
                    </ItemHeader>

                    <ItemContent>
                      <ItemTitle>{order.customer.name}</ItemTitle>
                      <ItemDescription>
                        {orderStatusMapping[order.status]}
                      </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <IconChevronRight />
                    </ItemActions>
                  </Item>
                </Link>
              );
            }

            const { processed_at, estimation } = order;
            const targetTimeMs = processed_at
              ? new Date(processed_at).getTime() + estimation * 60 * 1000
              : 0;

            return (
              <Link key={idx} href={`/dashboard-kedai/order/${order.id}`}>
                <Item
                  variant={"outline"}
                  className={`border-${getStatusColor(
                    order.status,
                    calculateTimeRemaining(targetTimeMs)
                  )}`}
                >
                  <ItemHeader className="items-start">
                    <div>
                      <h1 className="mb-1">
                        {order.order_items.length} Produk
                      </h1>

                      {order.order_items.map((items) => (
                        <div key={items.id}>
                          <img
                            src={"/uploads/product/" + items.product.image_url}
                            className="w-10 h-10"
                            alt=""
                          />
                        </div>
                      ))}
                    </div>

                    <h1 className="font-semibold">Rp {order.total_price}</h1>
                  </ItemHeader>

                  <ItemContent>
                    <ItemTitle>{order.customer.name}</ItemTitle>
                    <ItemDescription>
                      {orderStatusMapping[order.status]}
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    {order.estimation &&
                    order.processed_at &&
                    order.status === "PROCESSING" &&
                    calculateOrderEstimationRemainining({
                      estimation: order.estimation,
                      processed_at: order.processed_at,
                    }) === "Selesai" ? (
                      <div className="flex gap-1 items-center text-red-600">
                        <IconAlertCircle className="w-4 h-4" />
                        <h1 className="font-semibold text-sm ">
                          Order Lewat Estimasi
                        </h1>
                      </div>
                    ) : (
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
            );
          })}
        </div>
      )}
    </div>
  );
}
