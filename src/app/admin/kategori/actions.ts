"use server";

import { errorResponse, successResponse } from "@/helper/action-helpers";
import { generateCategorySlug } from "@/helper/generate-category-slug";
import { prisma } from "@/lib/prisma";
import { LocalStorageService } from "@/services/storage-services";
import { ServerActionReturn } from "@/types/server-action";
import {
  EditCategorySchemaType,
  InputCategorySchemaType,
} from "@/validations/schemas/category";

export async function uploadCategoryImage(file: File, name: string) {
  const storageService = new LocalStorageService();

  const categoryImageUrl = await storageService.uploadImage(file, "category");

  return categoryImageUrl;
}

export async function InputCategory(
  payload: InputCategorySchemaType
): Promise<ServerActionReturn<void>> {
  try {
    const created = await prisma.category.create({
      data: {
        slug: generateCategorySlug(payload.name),
        ...payload,
      },
    });

    console.log(created);

    return successResponse(undefined, "Berhasil input kategori");
  } catch (error) {
    console.log(error);

    return errorResponse("Terjadi kesalahan");
  }
}

export async function EditCategory(
  payload: EditCategorySchemaType
): Promise<ServerActionReturn<void>> {
  const { id, ...data } = payload;

  try {
    const created = await prisma.category.update({
      where: {
        id,
      },
      data: {
        slug: generateCategorySlug(payload.name),
        ...data,
      },
    });

    console.log(created);

    return successResponse(undefined, "Berhasil edit kategori");
  } catch (error) {
    console.log(error);

    return errorResponse("Terjadi kesalahan");
  }
}
