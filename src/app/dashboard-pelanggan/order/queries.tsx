"use server";

import { prisma } from "@/lib/prisma";

export async function getCustomerOrderDetail(id: string) {
  return prisma.order.findFirst({
    where: {
      id,
    },
    include: {
      order_items: {
        select: {
          quantity: true,
          price: true,
          note: true,
          product: {
            select: {
              name: true,
              image_url: true,
            },
          },
        },
      },
      shop: {
        select: {
          canteen: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      testimony: true,
      customer: {
        select: {
          name: true,
          avatar: true,
          customer_profile: {
            select: {
              table_number: true,
              floor: true,
            },
          },
        },
      },
    },
  });
}
