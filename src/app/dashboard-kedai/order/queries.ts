"server only";

import { prisma } from "@/lib/prisma";

export async function getShopOrderDetail(id: string) {
  return await prisma.order.findFirst({
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
          name: true,
          owner_id: true,
        },
      },
      testimony: true,
      customer: {
        select: {
          customer_profile: {
            select: {
              table_number: true,
              floor: true,
            },
          },
          name: true,
          avatar: true,
        },
      },
    },
  });
}
