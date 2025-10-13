"use server";

import { prisma } from "@/lib/prisma";

export async function getUserAllConversations(user_id: string) {
  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: {
          user_id,
        },
      },
    },
    include: {
      _count: {
        select: {
          messages: {
            where: {
              is_read: false,
            },
          },
        },
      },
      participants: {
        where: {
          user_id: {
            not: user_id,
          },
        },
        include: {
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
        take: 1,
      },
    },
  });

  return conversations;
}
