"use server";

import { PaymentMethod } from "@/app/generated/prisma";
import { errorResponse, successResponse } from "@/helper/action-helpers";
import { prisma } from "@/lib/prisma";
import { ServerActionReturn } from "@/types/server-action";
import { revalidatePath } from "next/cache";

export async function ConfirmOrder({
  conversation_id,
  order_id,
  owner_id,
  payment_method,
  shop_id,
  estimation,
}: {
  order_id: string;
  payment_method: PaymentMethod;
  owner_id: string;
  conversation_id: string;
  shop_id: string;
  estimation: number;
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

      revalidatePath(`/order/${order_id}`);

      await prisma.message.create({
        data: {
          conversation_id,
          sender_id: owner_id,
          order_id: order_id,
          type: "SYSTEM",
          text: `Pesanan diterima, estimasi ${estimation} menit, silakan lakukan pembayaran di kedai`,
        },
      });

      return successResponse(undefined, "Berhasil mengonfirmasi pesanan");
    }

    await prisma.order.update({
      where: {
        id: order_id,
      },
      data: {
        status: "WAITING_PAYMENT",
        estimation,
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
          text: `Pesanan diterima, estimasi ${estimation} menit, silakan kirim bukti pembayaran`,
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
          text: `Pesanan diterima, silakan transfer pada nomor rekening ${shopPaymentExcludeCash.account_number} ${shopPaymentExcludeCash.note}`,
        },
      });

      revalidatePath(`/order/${order_id}`);

      return successResponse(undefined, "Berhasil mengonfirmasi pesanan");
    }

    return errorResponse("Metode pembayaran tidak valid");
  } catch (error) {
    console.error("confirmOrder Error:", error);
    return errorResponse("Terjadi kesalahan saat mengonfirmasi pesanan");
  }
}

export async function ConfirmPayment({
  conversation_id,
  order_id,
  owner_id,
}: {
  order_id: string;
  conversation_id: string;
  owner_id: string;
}): Promise<ServerActionReturn<void>> {
  try {
    await prisma.order.update({
      where: {
        id: order_id,
      },
      data: {
        status: "PROCESSING",
        processed_at: new Date(),
      },
    });

    await prisma.message.create({
      data: {
        conversation_id,
        sender_id: owner_id,
        order_id: order_id,
        type: "SYSTEM",
        text: `Pembayaran telah dikonfirmasi, pesanan anda sedang diproses`,
      },
    });

    revalidatePath(`/dashboard-kedai/order/${order_id}`);
    revalidatePath(`/dashboard-pelanggan/order/${order_id}`);

    return successResponse(undefined, "Berhasil konfirmasi pembayaran");
  } catch (error) {
    console.error("confirmPayment Error:", error);
    return errorResponse("Terjadi kesalahan saat konfirmasi pembayaran");
  }
}

export async function ChangeOrderEstimation({
  estimation,
  order_id,
}: {
  order_id: string;
  estimation: number;
}): Promise<ServerActionReturn<void>> {
  try {
    await prisma.order.update({
      where: {
        id: order_id,
      },
      data: {
        estimation,
      },
    });

    revalidatePath(`/dashboard-kedai/order/${order_id}`);
    revalidatePath(`/dashboard-pelanggan/order/${order_id}`);

    return successResponse(undefined, "Berhasil mengubah estimasi");
  } catch (error) {
    return errorResponse("Terjadi kesalahan saat mengubah estimasi");
  }
}

export async function CompleteOrder({
  conversation_id,
  order_id,
  owner_id,
}: {
  order_id: string;
  conversation_id: string;
  owner_id: string;
}): Promise<ServerActionReturn<void>> {
  try {
    await prisma.order.update({
      where: {
        id: order_id,
      },
      data: {
        status: "COMPLETED",
      },
    });

    await prisma.message.create({
      data: {
        conversation_id,
        sender_id: owner_id,
        order_id: order_id,
        type: "SYSTEM",
        text: `Pesanan telah selesai silakan berikan ulasan atau rating untuk kami kak 🙏`,
      },
    });

    revalidatePath(`/dashboard-kedai/order/${order_id}`);
    revalidatePath(`/dashboard-pelanggan/order/${order_id}`);

    return successResponse(undefined, "Berhasil mengubah status");
  } catch (error) {
    console.error("rejectOrder Error:", error);
    return errorResponse("Terjadi kesalahan saat mengubah status");
  }
}
