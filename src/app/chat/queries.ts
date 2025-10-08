"use server";

import { prisma } from "@/lib/prisma";

export async function getConversationMessages(
  user_id: string,
  conversation_id: string
) {
  return await prisma.conversation.findFirst({
    where: {
      id: conversation_id,
      participants: {
        some: {
          user_id,
        },
      },
    },
    include: {
      messages: {
        orderBy: {
          created_at: "asc",
        },
      },
      participants: {
        select: {
          user: {
            select: {
              name: true,
              avatar: true,

              username: true,
              last_login: true,
            },
          },
        },
        where: {
          user_id: {
            not: user_id,
          },
        },
      },
    },
  });
}
