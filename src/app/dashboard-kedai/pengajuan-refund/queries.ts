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

export async function getOwnerShopRefunds(owner_id: string) {
  return await prisma.refund.findMany({
    where: {
      order: {
        shop: {
          owner_id,
        },
      },
    },
    select: {
      id: true,
      reason: true,
      status: true,
      amount: true,
      requested_at: true,
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

export async function getRefund(id: string) {
  return await prisma.refund.findFirst({
    where: {
      id,
    },
    include: {
      order: {
        select: {
          id: true,
          conversation_id: true,
          payment_method: true,
          customer: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      },
    },
  });
}
