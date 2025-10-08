"use server";

import { prisma } from "@/lib/prisma";

export async function getAllShopProducts(shop_id: string, productName: string) {
  return await prisma.product.findMany({
    where: {
      shop_id,
      name: {
        contains: productName,
      },
    },
  });
}
