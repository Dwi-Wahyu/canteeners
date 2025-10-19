"use server";

import { errorResponse, successResponse } from "@/helper/action-helpers";
import { prisma } from "@/lib/prisma";
import { ServerActionReturn } from "@/types/server-action";
import { revalidatePath } from "next/cache";
import { PaymentMethod } from "../generated/prisma";

export async function confirmPayment(
  order_id: string,
  estimation: number
): Promise<ServerActionReturn<void>> {
  try {
    await prisma.order.update({
      where: {
        id: order_id,
      },
      data: {
        status: "PROCESSING",
        processed_at: new Date(),
        estimation,
      },
    });

    revalidatePath(`/orders/${order_id}`);

    return successResponse(undefined, "Berhasil konfirmasi pembayaran");
  } catch (error) {
    console.error("confirmPayment Error:", error);
    return errorResponse("Terjadi kesalahan saat konfirmasi pembayaran");
  }
}

export async function rejectPayment(
  order_id: string,
  reason?: string
): Promise<ServerActionReturn<void>> {
  try {
    await prisma.order.update({
      where: {
        id: order_id,
      },
      data: {
        status: "PAYMENT_REJECTED",
        rejected_reason:
          reason?.trim() ||
          "Pembayaran anda ditolak oleh pemilik kedai, silakan konfirmasi lebih lanjut.",
      },
    });

    revalidatePath(`/orders/${order_id}`);

    return successResponse(undefined, "Berhasil menolak pembayaran");
  } catch (error) {
    console.error("rejectPayment Error:", error);
    return errorResponse("Terjadi kesalahan saat menolak pembayaran");
  }
}

export async function confirmOrder(
  order_id: string,
  payment_method: PaymentMethod
): Promise<ServerActionReturn<void>> {
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

      revalidatePath(`/orders/${order_id}`);

      return successResponse(undefined, "Berhasil mengonfirmasi pesanan");
    }

    await prisma.order.update({
      where: {
        id: order_id,
      },
      data: {
        status: "WAITING_PAYMENT",
      },
    });

    revalidatePath(`/orders/${order_id}`);

    return successResponse(undefined, "Berhasil mengonfirmasi pesanan");
  } catch (error) {
    console.error("confirmOrder Error:", error);
    return errorResponse("Terjadi kesalahan saat mengonfirmasi pesanan");
  }
}

export async function rejectOrder(
  order_id: string,
  reason?: string
): Promise<ServerActionReturn<void>> {
  try {
    await prisma.order.update({
      where: {
        id: order_id,
      },
      data: {
        status: "REJECTED",
        rejected_reason: reason?.trim() || "Pesanan ditolak oleh kedai.",
      },
    });

    revalidatePath(`/orders/${order_id}`);

    return successResponse(undefined, "Berhasil menolak pesanan");
  } catch (error) {
    console.error("rejectOrder Error:", error);
    return errorResponse("Terjadi kesalahan saat menolak pesanan");
  }
}
