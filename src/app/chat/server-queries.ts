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
              conversation: {
                participants: {
                  every: {
                    user_id: {
                      not: user_id,
                    },
                  },
                },
              },
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

export async function getUserQuickChats(user_id: string) {
  return await prisma.quickChat.findMany({
    where: {
      user_id,
    },
    select: {
      message: true,
    },
  });
}
