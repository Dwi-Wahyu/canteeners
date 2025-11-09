"use server";

import { errorResponse, successResponse } from "@/helper/action-helpers";
import { prisma } from "@/lib/prisma";
import { LocalStorageService } from "@/services/storage-services";
import { ServerActionReturn } from "@/types/server-action";
import { InputRefundSchemaType } from "@/validations/schemas/refund";

export async function uploadRefundComplaintProofImage(file: File) {
  const storageService = new LocalStorageService();

  const refundProofImageUrl = await storageService.uploadImage(
    file,
    "complaint-proof"
  );

  return refundProofImageUrl;
}

export async function InputRefund(
  payload: InputRefundSchemaType
): Promise<ServerActionReturn<void>> {
  const { amount, ...data } = payload;

  try {
    const findOrder = await prisma.order.findFirst({
      where: {
        id: data.order_id,
      },
      select: {
        shop: {
          select: {
            refund_disbursement_mode: true,
          },
        },
      },
    });

    if (!findOrder) {
      return errorResponse("Order tidak ditemukan");
    }

    const created = await prisma.refund.create({
      data: {
        ...data,
        disbursement_mode: findOrder.shop.refund_disbursement_mode,
        amount: parseFloat(amount),
      },
    });

    console.log(created);

    return successResponse(undefined, "Sukses input pengajuan refund");
  } catch (error) {
    console.log(error);

    return errorResponse("Terjadi kesalahan saat mengajukan refund");
  }
}
