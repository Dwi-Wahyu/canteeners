"use server";

import { errorResponse, successResponse } from "@/helper/action-helpers";
import { prisma } from "@/lib/prisma";
import { ServerActionReturn } from "@/types/server-action";
import { revalidatePath } from "next/cache";

export async function ConfirmOrder({
  order_id,
  estimation,
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
        status: "WAITING_CUSTOMER_ESTIMATION_CONFIRMATION",
        estimation,
      },
    });

    revalidatePath(`/dashboard-kedai/order/${order_id}`);

    return successResponse(undefined, "Berhasil mengonfirmasi order");
  } catch (error) {
    console.error("confirmOrder Error:", error);
    return errorResponse("Terjadi kesalahan saat mengonfirmasi order");
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
        text: `Pesanan anda sedang diproses`,
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

export async function RejectOrder({
  order_id,
  rejected_reason,
}: {
  order_id: string;
  rejected_reason: string;
}) {
  try {
    await prisma.order.update({
      where: {
        id: order_id,
      },
      data: {
        status: "REJECTED",
        rejected_reason,
      },
    });

    revalidatePath(`/dashboard-kedai/order/${order_id}`);
    revalidatePath(`/dashboard-pelanggan/order/${order_id}`);

    return successResponse(undefined, "Berhasil menolak order");
  } catch (error) {
    console.error("rejectOrder Error:", error);
    return errorResponse("Terjadi kesalahan saat menolak order");
  }
}

export async function RejectPayment({
  order_id,
  reason,
}: {
  order_id: string;
  reason: string;
}): Promise<ServerActionReturn<void>> {
  try {
    await prisma.order.update({
      where: {
        id: order_id,
      },
      data: {
        status: "PAYMENT_REJECTED",
        rejected_reason: reason.trim(),
      },
    });

    revalidatePath(`/dashboard-kedai/order/${order_id}`);
    revalidatePath(`/dashboard-pelanggan/order/${order_id}`);

    return successResponse(undefined, "Berhasil menolak pembayaran");
  } catch (error) {
    console.error("rejectPayment Error:", error);
    return errorResponse("Terjadi kesalahan saat menolak pembayaran");
  }
}
