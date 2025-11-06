"use server";

import { OrderStatus, PaymentMethod } from "@/app/generated/prisma";
import { errorResponse, successResponse } from "@/helper/action-helpers";
import { prisma } from "@/lib/prisma";
import { LocalStorageService } from "@/services/storage-services";
import { ServerActionReturn } from "@/types/server-action";
import { revalidatePath } from "next/cache";

export async function UploadPaymentProofImage(file: File) {
  const storageService = new LocalStorageService();

  const paymentProofUrl = await storageService.uploadImage(
    file,
    "payment-proof"
  );

  return paymentProofUrl;
}

export async function SendPaymentProof({
  proof_url,
  order_id,
  conversation_id,
  customer_id,
}: {
  proof_url: string;
  order_id: string;
  conversation_id: string;
  customer_id: string;
}): Promise<ServerActionReturn<void>> {
  try {
    const updated = await prisma.order.update({
      where: {
        id: order_id,
      },
      data: {
        payment_proof_url: proof_url,
        status: "WAITING_SHOP_CONFIRMATION",
      },
    });

    if (!updated) {
      return errorResponse("Order tidak ditemukan");
    }

    await prisma.message.create({
      data: {
        conversation_id,
        sender_id: customer_id,
        text: "",
        type: "PAYMENT_PROOF",
        media: { create: { mime_type: "IMAGE", url: proof_url, order_id } },
      },
    });

    revalidatePath("/dashboard-kedai/order/" + order_id);
    revalidatePath("/dashboard-pelanggan/order/" + order_id);

    return successResponse(undefined, "Sukses mengirim bukti pembayaran");
  } catch (error) {
    console.log(error);

    return errorResponse("Terjadi kesalahan");
  }
}

export async function CancelOrder({
  order_id,
  cancelled_by_id,
  cancelled_reason,
  order_status,
}: {
  order_id: string;
  cancelled_by_id: string;
  cancelled_reason: string;
  order_status: OrderStatus;
}): Promise<ServerActionReturn<void>> {
  try {
    const updated = await prisma.order.update({
      where: {
        id: order_id,
      },
      data: { cancelled_by_id, status: "CANCELLED", cancelled_reason },
    });

    // catat sebagai pelanggaran
    if (order_status === "WAITING_PAYMENT") {
    }

    revalidatePath("/dashboard-kedai/order/" + order_id);
    revalidatePath("/dashboard-pelanggan/order/" + order_id);

    return successResponse(undefined, "Sukses membatalkan order");
  } catch (error) {
    console.log(error);

    return errorResponse("Terjadi kesalahan");
  }
}

export async function ConfirmEstimation({
  order_id,
  paymentMethod,
}: {
  order_id: string;
  paymentMethod: PaymentMethod;
}): Promise<ServerActionReturn<void>> {
  try {
    if (paymentMethod === "CASH") {
      await prisma.order.update({
        where: {
          id: order_id,
        },
        data: {
          status: "WAITING_SHOP_CONFIRMATION",
        },
      });

      return successResponse(undefined, "Silakan lakukan pembayaran di kedai");
    }

    await prisma.order.update({
      where: {
        id: order_id,
      },
      data: {
        status: "WAITING_PAYMENT",
      },
    });

    revalidatePath("/dashboard-kedai/order/" + order_id);
    revalidatePath("/dashboard-pelanggan/order/" + order_id);

    return successResponse(undefined, "Silakan kirim bukti pembayaran");
  } catch (error) {
    console.log(error);

    return errorResponse("Silakan hubungi CS");
  }
}
