"use server";

import { errorResponse, successResponse } from "@/helper/action-helpers";
import { prisma } from "@/lib/prisma";
import { LocalStorageService } from "@/services/storage-services";
import { ServerActionReturn } from "@/types/server-action";
import { InputProductSchemaType } from "@/validations/schemas/product";
import { revalidatePath } from "next/cache";

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

export async function ToggleProductAvailable(
  id: number,
  is_available: boolean
): Promise<ServerActionReturn<boolean>> {
  try {
    const updated = await prisma.product.update({
      where: {
        id,
      },
      data: {
        is_available: !is_available,
      },
      select: {
        is_available: true,
      },
    });

    revalidatePath("/dashboard-kedai/produk");

    return successResponse(
      updated.is_available,
      "Berhasil mengubah status produk"
    );
  } catch (error) {
    console.log(error);

    return errorResponse("Terjadi kesalahan");
  }
}
