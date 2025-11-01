"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getOrderSummaryForChatBubble } from "../order/server-queries";

export default function OrderChatBubble({
  order_id,
  isSender,
}: {
  order_id: string;
  isSender: boolean;
}) {
  const { data, isPending } = useQuery({
    queryKey: ["chat-bubble-order-summary", order_id],
    queryFn: () => getOrderSummaryForChatBubble(order_id),
  });

  return (
    <>
      <h1 className="text-muted-foreground text-xs">{order_id}</h1>

      <div
        className={`px-4 py-3 shadow rounded-xl max-w-[80%] ${
          isSender
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground"
        }`}
      >
        {isPending && <div>loading . . .</div>}

        {!isPending && !data && (
          <div>
            <h1>Tidak ada data</h1>

            <Link
              href={`/order/${order_id}`}
              className="flex justify-end text-sm underline underline-offset-2 mt-2"
            >
              Lihat Detail
            </Link>
          </div>
        )}

        {!isPending && data && (
          <div>
            <div className="grid grid-cols-3 gap-2">
              {data.order_items.map((items, idx) => (
                <div key={`${order_id}-${idx}`}>
                  <img
                    src={"/uploads/product/" + items.product.image_url}
                    alt=""
                  />
                  <h1 className="text-xs">{items.product.name}</h1>
                </div>
              ))}
            </div>

            <h1 className="text-sm">Total Harga : {data.total_price}</h1>

            <Link
              href={`/order/${order_id}`}
              className="flex justify-end text-sm underline underline-offset-2 mt-2"
            >
              Lihat Detail
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
