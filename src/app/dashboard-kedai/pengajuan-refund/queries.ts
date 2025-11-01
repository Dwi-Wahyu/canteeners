"use server";

import { prisma } from "@/lib/prisma";

export async function getHomeOwnerShopRefunds(shop_id: string, take?: number) {
  const totals = await prisma.refund.count({
    where: {
      order: {
        shop_id,
      },
    },
  });

  const refunds = await prisma.refund.findMany({
    where: {
      order: {
        shop_id,
      },
    },
    take,
    select: {
      id: true,
      reason: true,
      order: {
        select: {
          customer: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  return { totals, refunds };
}

export async function getOwnerShopRefunds(shop_id: string) {
  return await prisma.refund.findMany({
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
            },
          },
        },
      },
    },
  });
}

export async function getRefund(id: string) {
  return await prisma.refund.findFirst({
    where: {
      id,
    },
  });
}
