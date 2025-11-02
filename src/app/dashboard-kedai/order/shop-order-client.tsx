"use client";

import { useQuery } from "@tanstack/react-query";
import { getShopOrders } from "./server-queries";

import {
  Empty,
  EmptyContent,
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
  ItemFooter,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { NavigationButton } from "@/app/_components/navigation-button";
import { orderStatusMapping } from "@/constant/order-status-mapping";
import Image from "next/image";

export default function ShopOrderClient({ owner_id }: { owner_id: string }) {
  const { data, isPending } = useQuery({
    queryKey: ["shop-order-fetch", owner_id],
    queryFn: async () => {
      return await getShopOrders(owner_id);
    },
  });

  return (
    <div>
      {!isPending && data && data.length === 0 && (
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

      {!isPending && data && data.length > 0 && (
        <div className="flex flex-col gap-4">
          {data.map((order, idx) => (
            <Item key={idx} variant={"outline"}>
              <ItemHeader>
                {order.order_items.map((item) => (
                  <div key={item.id}>
                    <Image
                      src={"/uploads/product/" + item.product.image_url}
                      width={50}
                      height={50}
                      alt="order items image"
                      className="rounded-lg"
                    />
                  </div>
                ))}
              </ItemHeader>
              <ItemContent>
                <ItemTitle>{order.customer.name}</ItemTitle>
                <ItemDescription>
                  {orderStatusMapping[order.status]}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <NavigationButton
                  url={"/dashboard-kedai/order/" + order.id}
                  size="icon"
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
