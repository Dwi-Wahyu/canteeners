"use server";

import { Payment } from "@/app/generated/prisma";
import { errorResponse, successResponse } from "@/helper/action-helpers";
import { prisma } from "@/lib/prisma";
import { LocalStorageService } from "@/services/storage_services";
import { ServerActionReturn } from "@/types/server-action";
import { PaymentSchemaType } from "@/validations/schemas/payment";
import { UpdateShopSchemaType } from "@/validations/schemas/shop";

export async function uploadShopQRCode(file: File) {
  const storageService = new LocalStorageService();

  const shopImageUrl = await storageService.uploadImage(
    file,
    "",
    "shop-qrcode"
  );

  return shopImageUrl;
}

export async function UpdateShop(
  payload: UpdateShopSchemaType
): Promise<ServerActionReturn<void>> {
  try {
    const createdShop = await prisma.shop.update({
      where: {
        id: payload.id,
      },
      data: {
        ...payload,
      },
      select: {
        id: true,
        name: true,
      },
    });

    return successResponse(
      undefined,
      `Berhasil update warung ${createdShop.name}`
    );
  } catch (error) {
    console.error("Kesalahan saat update :", error);

    return errorResponse("Terjadi kesalahan yang tidak terduga.");
  }
}

export async function InputPaymentMethod({
  payload,
  shop_id,
}: {
  payload: PaymentSchemaType;
  shop_id: string;
}): Promise<ServerActionReturn<{ shop_id: string }>> {
  try {
    const created = await prisma.payment.create({
      data: {
        ...payload,
        shop_id,
      },
      select: {
        shop_id: true,
      },
    });

    return successResponse(
      { shop_id: created.shop_id },
      "Berhasil input metode pembayaran"
    );
  } catch (error) {
    console.log(error);

    return errorResponse("Terjadi kesalahan");
  }
}
