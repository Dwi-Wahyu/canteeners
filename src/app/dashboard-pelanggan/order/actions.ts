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

export async function ConfirmEstimation({
  order_id,
  shop_id,
  conversation_id,
  owner_id,
  payment_method,
}: {
  order_id: string;
  shop_id: string;
  conversation_id: string;
  owner_id: string;
  payment_method: PaymentMethod;
}): Promise<ServerActionReturn<void>> {
  try {
    if (payment_method === "CASH") {
      await prisma.order.update({
        where: {
          id: order_id,
        },
        data: {
          status: "WAITING_SHOP_CONFIRMATION",
        },
      });

      revalidatePath("/dashboard-kedai/order/" + order_id);
      revalidatePath("/dashboard-pelanggan/order/" + order_id);

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

    if (payment_method === "QRIS") {
      const shopQRISPayments = await prisma.payment.findFirst({
        where: {
          shop_id,
          method: {
            not: "QRIS",
          },
        },
      });

      if (!shopQRISPayments) {
        console.error("kedai belum menerima pembayaran qris");
        return errorResponse("kedai belum menerima pembayaran qris");
      }

      await prisma.message.create({
        data: {
          conversation_id,
          sender_id: owner_id,
          order_id: order_id,
          type: "SYSTEM",
          text: `Silakan kirim bukti pembayaran`,
          media: {
            create: {
              url: shopQRISPayments.qr_url!,
              mime_type: "IMAGE",
            },
          },
        },
      });

      revalidatePath("/dashboard-kedai/order/" + order_id);
      revalidatePath("/dashboard-pelanggan/order/" + order_id);

      return successResponse(undefined, "Berhasil mengonfirmasi pesanan");
    }

    if (payment_method === "BANK_TRANSFER") {
      const shopBankTransferPayments = await prisma.payment.findFirst({
        where: {
          shop_id,
          method: {
            not: "BANK_TRANSFER",
          },
        },
      });

      if (!shopBankTransferPayments) {
        console.error("kedai belum menerima pembayaran transfer bank");
        return errorResponse("kedai belum menerima pembayaran transfer bank");
      }

      await prisma.message.create({
        data: {
          conversation_id,
          sender_id: owner_id,
          order_id: order_id,
          type: "SYSTEM",
          text: `Silakan transfer pada nomor rekening ${shopBankTransferPayments.account_number} ${shopBankTransferPayments.note}`,
        },
      });

      revalidatePath("/dashboard-kedai/order/" + order_id);
      revalidatePath("/dashboard-pelanggan/order/" + order_id);

      return successResponse(undefined, "Berhasil mengonfirmasi pesanan");
    }

    return errorResponse("Metode pembayaran tidak valid");
  } catch (error) {
    console.log(error);

    return errorResponse("Silakan hubungi CS");
  }
}
