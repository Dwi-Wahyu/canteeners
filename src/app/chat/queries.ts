"use server";

import { prisma } from "@/lib/prisma";

export async function getConversationMessages(
  user_id: string,
  conversation_id: string
) {
  await readAllMessageInConversation(conversation_id, user_id);

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
        include: {
          media: true,
        },
      },
      participants: {
        select: {
          user: {
            select: {
              id: true,
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

export async function readAllMessageInConversation(
  conversation_id: string,
  user_id: string
) {
  await prisma.conversationParticipant.update({
    where: {
      conversation_id_user_id: {
        conversation_id,
        user_id,
      },
    },
    data: {
      is_read: true,
    },
  });

  await prisma.message.updateMany({
    where: {
      conversation_id,
      conversation: {
        participants: {
          some: {
            user: {
              id: user_id,
            },
          },
        },
      },
    },
    data: {
      is_read: true,
    },
  });
}
