"use server";

import { errorResponse, successResponse } from "@/helper/action-helpers";
import { prisma } from "@/lib/prisma";
import { ServerActionReturn } from "@/types/server-action";

export async function sendMessage({
  conversation_id,
  content,
  sender_id,
}: {
  conversation_id: string;
  content?: string;
  sender_id: string;
}): Promise<ServerActionReturn<void>> {
  try {
    await prisma.message.create({
      data: {
        conversation_id,
        content,
        sender_id,
      },
    });

    return successResponse(undefined, "Berhasil mengirim pesan");
  } catch (error) {
    console.log(error);

    return errorResponse("Terjadi kesalahan");
  }
}
