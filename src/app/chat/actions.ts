"use server";

import { ServerActionReturn } from "@/types/server-action";
import { MessageType, Prisma } from "../generated/prisma";
import { errorResponse, successResponse } from "@/helper/action-helpers";
import { prisma } from "@/lib/prisma";
import { LocalStorageService } from "@/services/storage-services";

type MessageWithMedia = Prisma.MessageGetPayload<{
  include: { media: true };
}>;

export async function uploadPaymentProof(file: File) {
  const storageService = new LocalStorageService();

  const proofImageUrl = await storageService.uploadImage(file, "payment-proof");

  return proofImageUrl;
}

type Media = {
  url: string;
  mime_type: "IMAGE" | "VIDEO";
  order_id?: string;
};

export async function saveMessage({
  conversation_id,
  sender_id,
  type,
  text,
  media,
  order_id,
}: {
  conversation_id: string;
  sender_id: string;
  text?: string;
  type: MessageType;
  media: File[];
  order_id?: string;
}): Promise<ServerActionReturn<MessageWithMedia>> {
  try {
    const messageMedia: Media[] = [];

    if (media.length > 0) {
      for (const each of media) {
        const proofUrl = await uploadPaymentProof(each);

        messageMedia.push({
          url: proofUrl,
          mime_type: "IMAGE",
          order_id,
        });
      }
    }

    if (type === "PAYMENT_PROOF" && order_id && media.length > 0) {
      await prisma.order.update({
        where: {
          id: order_id,
        },
        data: {
          payment_proof_url: messageMedia[0].url,
          status: "WAITING_SHOP_CONFIRMATION",
        },
      });
    }

    const created = await prisma.message.create({
      data: {
        conversation_id,
        sender_id,
        text,
        type,
        ...(messageMedia.length > 0
          ? {
              media: {
                createMany: {
                  data: messageMedia.map((media) => ({
                    url: media.url,
                    mime_type: media.mime_type,
                    order_id: media.order_id,
                  })),
                  skipDuplicates: true,
                },
              },
            }
          : {}),
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
