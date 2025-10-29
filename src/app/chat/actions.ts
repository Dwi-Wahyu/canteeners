"use server";

import { ServerActionReturn } from "@/types/server-action";
import { Message, MessageType, Prisma } from "../generated/prisma";
import { errorResponse, successResponse } from "@/helper/action-helpers";
import { prisma } from "@/lib/prisma";

type MessageWithMedia = Prisma.MessageGetPayload<{
  include: { media: true };
}>;

export async function saveMessage({
  conversation_id,
  sender_id,
  type,
  content,
  media,
}: {
  conversation_id: string;
  sender_id: string;
  content?: string;
  type: MessageType;
  media: File[];
}): Promise<ServerActionReturn<MessageWithMedia>> {
  try {
    if (media.length > 0) {
    }

    const created = await prisma.message.create({
      data: {
        conversation_id,
        sender_id,
        content,
        type,
      },
      include: {
        media: true,
      },
    });

    return successResponse(created, "Berhasil mengirim pesan");
  } catch (error) {
    console.log(error);

    return errorResponse("Terjadi kesalahan");
  }
}
