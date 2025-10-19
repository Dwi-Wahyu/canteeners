"use server";

import { ServerActionReturn } from "@/types/server-action";
import { Message, MessageType } from "../generated/prisma";
import { errorResponse, successResponse } from "@/helper/action-helpers";
import { prisma } from "@/lib/prisma";

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
}): Promise<ServerActionReturn<Message>> {
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
    });

    return successResponse(created, "Berhasil mengirim pesan");
  } catch (error) {
    console.log(error);

    return errorResponse("Terjadi kesalahan");
  }
}
