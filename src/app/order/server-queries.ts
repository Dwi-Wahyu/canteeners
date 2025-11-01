"use server";

import { prisma } from "@/lib/prisma";

export async function getOrderSummaryForChatBubble(id: string) {
  return await prisma.order.findFirst({
    where: {
      id,
    },
    select: {
      total_price: true,
      order_items: {
        select: {
          product: {
            select: {
              name: true,
              image_url: true,
            },
          },
        },
      },
    },
  });
}
