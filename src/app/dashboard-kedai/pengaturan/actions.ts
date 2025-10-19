"use server";

import { ShopStatus } from "@/app/generated/prisma";
import { errorResponse, successResponse } from "@/helper/action-helpers";
import { prisma } from "@/lib/prisma";
import { ServerActionReturn } from "@/types/server-action";
import { QuickChatSchemaType } from "@/validations/schemas/quick-chat";
import { InputPaymentSchemaType } from "@/validations/schemas/shop";
import { revalidatePath } from "next/cache";

export async function addPaymentMethodToShop(
  payload: InputPaymentSchemaType
): Promise<ServerActionReturn<void>> {
  try {
    return successResponse(undefined, "Sukses menambahkan metode pembayaran");
  } catch (error) {
    return errorResponse("Terjadi kesalahan");
  }
}

export async function toggleShopStatus(
  id: string,
  currentStatus: ShopStatus
): Promise<ServerActionReturn<ShopStatus>> {
  try {
    const updated = await prisma.shop.update({
      where: {
        id,
      },
      data: {
        status: currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE",
      },
    });

    revalidatePath("/dashboard-kedai");

    return successResponse(updated.status, "Sukses mengubah status kedai");
  } catch (error) {
    console.log(error);

    return errorResponse("Terjadi kesalahan");
  }
}

export async function createQuickChat(
  payload: QuickChatSchemaType
): Promise<ServerActionReturn<void>> {
  try {
    await prisma.quickChat.create({
      data: payload,
    });
    revalidatePath("/dashboard-kedai/pengaturan/pesan-singkat");
    return successResponse(undefined, "Berhasil menambahkan pesan singkat");
  } catch (error) {
    console.log(error);

    return errorResponse("Terjadi kesalahan");
  }
}

export async function deleteQuickChat(
  id: number
): Promise<ServerActionReturn<void>> {
  try {
    await prisma.quickChat.delete({
      where: {
        id,
      },
    });
    revalidatePath("/dashboard-kedai/pengaturan/pesan-singkat");
    return successResponse(undefined, "Berhasil menambahkan pesan singkat");
  } catch (error) {
    console.log(error);

    return errorResponse("Terjadi kesalahan");
  }
}
