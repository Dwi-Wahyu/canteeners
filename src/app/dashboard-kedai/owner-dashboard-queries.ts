"use server";

import { prisma } from "@/lib/prisma";

export async function getShopDataAndRecentOrder(owner_id: string) {
  const shop = await prisma.shop.findFirst({
    where: {
      owner_id,
    },
    include: {
      orders: {
        take: 5,
        orderBy: {
          created_at: "desc",
        },
        include: {
          customer: {
            select: {
              name: true,
              avatar: true,
            },
          },
          order_items: {
            take: 3,
            select: {
              id: true,
              quantity: true,
              product: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        where: {
          status: {
            not: "COMPLETED",
          },
        },
      },
    },
  });

  return shop;
}

export async function getConversationNotReadedSum(user_id: string) {
  return await prisma.conversationParticipant.count({
    where: {
      user_id,
      is_read: false,
    },
  });
}
