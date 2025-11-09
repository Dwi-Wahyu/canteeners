"use server";

import { prisma } from "@/lib/prisma";

export async function getShops() {
  return await prisma.shop.findMany();
}

export async function getShopOwner(shop_id: string) {
  return await prisma.shop.findFirst({
    where: {
      id: shop_id,
    },
    select: {
      owner_id: true,
      owner: {
        select: {
          name: true,
          avatar: true,
        },
      },
    },
  });
}

export async function getShopConversations(owner_id: string) {
  return await prisma.conversation.findMany({
    where: {
      participants: {
        some: {
          user_id: owner_id,
        },
      },
    },
    include: {
      participants: {
        where: {
          user_id: {
            not: owner_id,
          },
        },
        select: {
          user: {
            select: {
              name: true,
              avatar: true,
            },
          },
        },
      },
      messages: {
        orderBy: {
          created_at: "desc",
        },
        select: {
          created_at: true,
          text: true,
        },
        take: 1,
      },
    },
  });
}

export async function getShopConversationDetails(conversation_id: string) {
  return await prisma.conversation.findFirst({
    where: {
      id: conversation_id,
    },
    include: {
      messages: {
        include: {
          media: true,
          sender: {
            select: {
              avatar: true,
              name: true,
            },
          },
        },
      },
    },
  });
}
