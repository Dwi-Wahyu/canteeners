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
    const created = await prisma.refund.create({
      data: {
        ...data,
        amount: parseFloat(amount),
      },
    });

    console.log(created);

    return successResponse(undefined, "Sukses input pengajuan");
  } catch (error) {
    return errorResponse("Terjadi kesalahan");
  }
}
