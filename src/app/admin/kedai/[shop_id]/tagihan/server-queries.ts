"use server";

import { prisma } from "@/lib/prisma";

export async function getShopBillings(shop_id: string) {
  const shopDataIncludeBillings = await prisma.shop.findFirst({
    where: {
      id: shop_id,
    },
    select: {
      name: true,
      image_url: true,
      billings: true,
    },
  });

  const totalOrders = await prisma.order.count({
    where: {
      shop_id,
    },
  });

  const completedOrders = await prisma.order.count({
    where: {
      shop_id,
      status: "COMPLETED",
    },
  });

  return {
    shopDataIncludeBillings,
    totalOrders,
    completedOrders,
  };
}
