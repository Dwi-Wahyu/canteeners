"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/config/auth";
import { ServerActionReturn } from "@/types/server-action";
import { errorResponse, successResponse } from "@/helper/action-helpers";
import { Message } from "@/app/generated/prisma";

interface SendMessageInput {
  conversationId: number;
  senderId: string;
  content: string;
  type: "TEXT" | "SYSTEM" | "PAYMENT_PROOF";
}

export async function sendMessageAction(
  input: SendMessageInput
): Promise<ServerActionReturn<Message>> {
  const session = await auth();
  if (!session || !session.user?.id) {
    return errorResponse("Tidak diizinkan: Anda harus login", "UNAUTHORIZED");
  }

  const { conversationId, senderId, content, type } = input;

  // Validasi input
  if (!conversationId || !senderId || !content || !type) {
    return errorResponse("Input tidak valid", "INVALID_INPUT");
  }

  if (senderId !== session.user.id) {
    return errorResponse(
      "Anda tidak dapat mengirim pesan atas nama pengguna lain",
      "FORBIDDEN"
    );
  }

  try {
    // Verifikasi bahwa pengguna adalah peserta dalam percakapan
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        participants: {
          some: { user_id: session.user.id },
        },
      },
    });

    if (!conversation) {
      return errorResponse(
        "Percakapan tidak ditemukan atau Anda bukan peserta",
        "NOT_FOUND"
      );
    }

    // Buat pesan baru
    const message = await prisma.message.create({
      data: {
        conversation_id: conversationId,
        sender_id: senderId,
        content,
        type,
      },
      include: {
        sender: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });

    return successResponse(message, "Pesan berhasil dikirim");
  } catch (error) {
    console.error("Error in sendMessageAction:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Terjadi kesalahan pada server",
      "SERVER_ERROR",
      { errorDetails: error instanceof Error ? error.stack : undefined }
    );
  }
}
