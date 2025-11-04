"use server";

import { errorResponse, successResponse } from "@/helper/action-helpers";
import { prisma } from "@/lib/prisma";
import { LocalStorageService } from "@/services/storage-services";
import { ServerActionReturn } from "@/types/server-action";
import {
  EditProductSchemaType,
  InputProductSchemaType,
} from "@/validations/schemas/product";
import { revalidatePath } from "next/cache";

export async function uploadProductImage(file: File) {
  const storageService = new LocalStorageService();

  const productImageUrl = await storageService.uploadImage(file, "product");

  return productImageUrl;
}

async function updateMaximumShopPrice(shop_id: string, maximum_price: number) {
  await prisma.shop.update({
    where: {
      id: shop_id,
    },
    data: {
      maximum_price,
    },
  });
}

async function updateMinimumShopPrice(shop_id: string, minimum_price: number) {
  await prisma.shop.update({
    where: {
      id: shop_id,
    },
    data: {
      minimum_price,
    },
  });
}

export async function InputProduct(
  payload: InputProductSchemaType
): Promise<ServerActionReturn<void>> {
  const { price, categories, ...data } = payload;

  try {
    const created = await prisma.product.create({
      data: {
        ...data,
        price: parseFloat(price),
        ...(categories.length > 0
          ? {
              categories: {
                createMany: {
                  data: categories.map((category) => ({
                    category_id: parseInt(category.value),
                  })),
                  skipDuplicates: true,
                },
              },
            }
          : {}),
      },
    });

    const priceAggregate = await prisma.product.aggregate({
      where: {
        shop_id: payload.shop_id,
        is_available: true,
      },
      _min: { price: true },
      _max: { price: true },
    });

    const newMinimumPrice = priceAggregate._min.price;
    const newMaximumPrice = priceAggregate._max.price;

    if (newMinimumPrice !== null) {
      await updateMinimumShopPrice(payload.shop_id, newMinimumPrice);
    }

    if (newMaximumPrice !== null) {
      await updateMaximumShopPrice(payload.shop_id, newMaximumPrice);
    }

    console.log(created);

    return successResponse(undefined, "Berhasil input produk");
  } catch (error) {
    console.log(error);

    return errorResponse("Terjadi kesalahan");
  }
}

export async function UpdateProduct(
  payload: EditProductSchemaType
): Promise<ServerActionReturn<void>> {
  const { price, categories, id, ...data } = payload;
  const productPrice = parseFloat(price);

  try {
    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        price: productPrice,
        ...(categories.length > 0
          ? {
              categories: {
                deleteMany: {},
                createMany: {
                  data: categories.map((category) => ({
                    category_id: parseInt(category.value),
                  })),
                  skipDuplicates: true,
                },
              },
            }
          : {}),
      },
    });

    const priceAggregate = await prisma.product.aggregate({
      where: {
        shop_id: payload.shop_id,
        is_available: true,
      },
      _min: { price: true },
      _max: { price: true },
    });

    const newMinimumPrice = priceAggregate._min.price;
    const newMaximumPrice = priceAggregate._max.price;

    if (newMinimumPrice !== null) {
      await updateMinimumShopPrice(payload.shop_id, newMinimumPrice);
    }

    if (newMaximumPrice !== null) {
      await updateMaximumShopPrice(payload.shop_id, newMaximumPrice);
    }

    return successResponse(undefined, "Berhasil update produk");
  } catch (error) {
    console.error("Error updating product:", error);
    return errorResponse("Terjadi kesalahan saat mengupdate produk");
  }
}

export async function ToggleProductAvailable(
  id: string,
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
