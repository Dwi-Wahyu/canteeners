"use server";

import { errorResponse, successResponse } from "@/helper/action-helpers";
import { prisma } from "@/lib/prisma";
import { LocalStorageService } from "@/services/storage_services";
import { ServerActionReturn } from "@/types/server-action";
import { InputShopSchemaType } from "@/validations/schemas/shop";

export async function uploadShopImage(file: File, name: string) {
  const storageService = new LocalStorageService();

  const shopImageUrl = await storageService.uploadImage(file, name, "shops");

  return shopImageUrl;
}

export async function InputShop(
  payload: InputShopSchemaType
): Promise<ServerActionReturn<void>> {
  try {
    const created = await prisma.shop.create({
      data: payload,
    });

    console.log(created);

    return successResponse(undefined, "Berhasil input warung");
  } catch (error) {
    return errorResponse("Terjadi kesalahan");
  }
}
