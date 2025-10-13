"use server";

import { errorResponse, successResponse } from "@/helper/action-helpers";
import { prisma } from "@/lib/prisma";
import { LocalStorageService } from "@/services/storage-services";
import { ServerActionReturn } from "@/types/server-action";
import { InputProductSchemaType } from "@/validations/schemas/product";

export async function uploadProductImage(file: File, name: string) {
  const storageService = new LocalStorageService();

  const shopImageUrl = await storageService.uploadImage(file, "product");

  return shopImageUrl;
}

export async function InputProduct(
  payload: InputProductSchemaType
): Promise<ServerActionReturn<void>> {
  const { price, ...data } = payload;

  try {
    const created = await prisma.product.create({
      data: {
        ...data,
        price: parseFloat(price),
      },
    });

    console.log(created);

    return successResponse(undefined, "Berhasil input produk");
  } catch (error) {
    console.log(error);

    return errorResponse("Terjadi kesalahan");
  }
}
