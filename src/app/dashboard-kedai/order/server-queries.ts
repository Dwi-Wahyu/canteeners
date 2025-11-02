"use server";

import { prisma } from "@/lib/prisma";

export async function getShopOrders(owner_id: string) {
  return await prisma.order.findMany({
    where: {
      shop: {
        owner_id,
      },
    },
    select: {
      id: true,
      status: true,
      order_items: {
        select: {
          id: true,
          product: {
            select: {
              image_url: true,
              name: true,
            },
          },
        },
      },
      customer: {
        select: {
          name: true,
          avatar: true,
        },
      },
    },
  });
}
