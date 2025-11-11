"use server";

import { OrderStatus, PaymentMethod } from "@/app/generated/prisma";
import { errorResponse, successResponse } from "@/helper/action-helpers";
import { prisma } from "@/lib/prisma";
import { LocalStorageService } from "@/services/storage-services";
import { ServerActionReturn } from "@/types/server-action";
import { unlinkSync } from "fs";
import { revalidatePath } from "next/cache";
import { join } from "path";

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
    const order = await prisma.order.findFirst({
      where: {
        id: order_id,
      },
    });

    if (!order) {
      return errorResponse("Order tidak ditemukan");
    }

    // hapus nanti file yang lama, pastikan pake trycatch biar ga error
    if (order.payment_proof_url) {
      await unlinkSync(
        join(
          process.cwd(),
          "public/uploads/payment-proof",
          order.payment_proof_url
        )
      );
    }

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

    return errorResponse("Silakan Hubungi CS, Atau coba lagi nanti");
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
}): Promise<ServerActionReturn<{ suspended: boolean }>> {
  try {
    let suspended = false;

    const updated = await prisma.order.update({
      where: {
        id: order_id,
      },
      data: { cancelled_by_id, status: "CANCELLED", cancelled_reason },
    });

    if (
      order_status === "WAITING_SHOP_CONFIRMATION" ||
      order_status === "WAITING_PAYMENT"
    ) {
      await prisma.customerViolation.create({
        data: {
          customer_id: updated.customer_id,
          type: "ORDER_CANCEL_WITHOUT_PAY",
          order_id: updated.id,
          timestamp: new Date(),
        },
      });

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayCancellingViolation = await prisma.customerViolation.count({
        where: {
          type: "ORDER_CANCEL_WITHOUT_PAY",
          customer_id: updated.customer_id,
          timestamp: {
            gte: today,
            lt: tomorrow,
          },
        },
      });

      if (todayCancellingViolation > 1) {
        await prisma.customerProfile.update({
          where: { user_id: updated.customer_id },
          data: {
            suspend_reason: "Pembatalan Order Beruntun",
            suspend_until: new Date(Date.now() + 24 * 60 * 60 * 1000),
          },
        });

        suspended = true;
      }
    }

    revalidatePath("/dashboard-kedai/order/" + order_id);
    revalidatePath("/dashboard-pelanggan/order/" + order_id);

    return successResponse({ suspended }, "Sukses membatalkan order");
  } catch (error) {
    console.log(error);

    return errorResponse("Terjadi kesalahan");
  }
}
