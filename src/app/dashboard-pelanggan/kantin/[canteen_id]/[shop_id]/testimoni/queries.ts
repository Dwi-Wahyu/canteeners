"use server";

import { prisma } from "@/lib/prisma";

export async function getShopTestimonies(shop_id: string) {
  return await prisma.shopTestimony.findMany({
    where: {
      order: {
        shop_id,
      },
    },
    include: {
      order: {
        select: {
          customer: {
            select: {
              name: true,
              avatar: true,
            },
          },
        },
      },
    },
  });
}
