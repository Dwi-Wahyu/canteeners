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

    const shopPaymentExcludeCash = await prisma.payment.findFirst({
      where: {
        shop_id,
        method: {
          not: "CASH",
        },
      },
    });

    if (!shopPaymentExcludeCash) {
      console.error("kedai belum menerima pembayaran non tunai");
      return errorResponse("kedai belum menerima pembayaran non tunai");
    }

    if (payment_method === "QRIS") {
      if (!shopPaymentExcludeCash.qr_url) {
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
              url: shopPaymentExcludeCash.qr_url,
              mime_type: "IMAGE",
            },
          },
        },
      });

      revalidatePath(`/order/${order_id}`);

      return successResponse(undefined, "Berhasil mengonfirmasi pesanan");
    }

    if (payment_method === "BANK_TRANSFER") {
      if (!shopPaymentExcludeCash.account_number) {
        console.error("kedai belum menerima pembayaran transfer bank");
        return errorResponse("kedai belum menerima pembayaran transfer bank");
      }

      await prisma.message.create({
        data: {
          conversation_id,
          sender_id: owner_id,
          order_id: order_id,
          type: "SYSTEM",
          text: `Silakan transfer pada nomor rekening ${shopPaymentExcludeCash.account_number} ${shopPaymentExcludeCash.note}`,
        },
      });

      revalidatePath(`/order/${order_id}`);

      return successResponse(undefined, "Berhasil mengonfirmasi pesanan");
    }

    return errorResponse("Metode pembayaran tidak valid");

    revalidatePath("/dashboard-kedai/order/" + order_id);
    revalidatePath("/dashboard-pelanggan/order/" + order_id);

    return successResponse(undefined, "Silakan kirim bukti pembayaran");
  } catch (error) {
    console.log(error);

    return errorResponse("Silakan hubungi CS");
  }
}
