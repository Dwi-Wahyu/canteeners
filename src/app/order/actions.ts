"use server";

import { errorResponse, successResponse } from "@/helper/action-helpers";
import { prisma } from "@/lib/prisma";
import { ServerActionReturn } from "@/types/server-action";

export async function konfirmasiPembayaran(
  order_id: string
): Promise<ServerActionReturn<void>> {
  try {
    const order = await prisma.order.update({
      where: {
        id: order_id,
      },
      data: {
        status: "PROCESSING",
      },
    });

    console.log(order);

    return successResponse(undefined, "Berhasil konfirmasi pembayaran");
  } catch (error) {
    console.log(error);

    return errorResponse("Terjadi kesalahan");
  }
}

export async function tolakPembayaran(
  order_id: string
): Promise<ServerActionReturn<void>> {
  try {
    const order = await prisma.order.update({
      where: {
        id: order_id,
      },
      data: {
        status: "PAYMENT_REJECTED",
      },
    });

    console.log(order);

    return successResponse(undefined, "Berhasil tolak pembayaran");
  } catch (error) {
    console.log(error);

    return errorResponse("Terjadi kesalahan");
  }
}
