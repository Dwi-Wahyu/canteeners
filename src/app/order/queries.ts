"server only";

import { prisma } from "@/lib/prisma";

export async function getOrderDetails(id: string) {
  return await prisma.order.findFirst({
    where: {
      id,
    },
    include: {
      order_items: {
        select: {
          product: {
            select: {
              name: true,
              image_url: true,
            },
          },
          price: true,
          note: true,
          quantity: true,
        },
      },
      customer: {
        select: {
          name: true,
          avatar: true,
        },
      },
      shop: {
        select: {
          id: true,
          owner_id: true,
          name: true,
        },
      },
      testimony: true,
      complaint: true,
    },
  });
}
