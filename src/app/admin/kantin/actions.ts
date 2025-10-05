"use server";

import { Prisma } from "@/app/generated/prisma";
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
  // Ambil data payments dan pisahkan dari data Shop
  const paymentsData = payload.payments.map((p) => {
    // Hapus shop_id karena akan otomatis diisi oleh Prisma saat create.
    // Juga hapus field string kosong yang tidak relevan agar sesuai dengan model Prisma (String?)
    const { shop_id, ...rest } = p;

    const paymentItem: Prisma.PaymentCreateWithoutShopInput = {
      method: rest.method,
      note: rest.note === "" ? null : rest.note,
      qr_url: rest.qr_url === "" ? null : rest.qr_url,
      account_number: rest.account_number === "" ? null : rest.account_number,
      // Jika Anda memiliki additional_price, pastikan ia diubah ke number/null di sini
    };

    return paymentItem;
  });

  // Data untuk Shop (tanpa payments)
  const shopDataWithoutPayments = {
    name: payload.name,
    description: payload.description === "" ? null : payload.description,
    image_url: payload.image_url,
    canteen_id: payload.canteen_id,
    owner_id: payload.owner_id,
  };

  try {
    const createdShop = await prisma.shop.create({
      data: {
        ...shopDataWithoutPayments,
        payments: {
          createMany: {
            data: paymentsData,
          },
        },
      },
      // Anda bisa memilih data apa yang ingin dikembalikan
      select: {
        id: true,
        name: true,
      },
    });

    return successResponse(
      undefined,
      `Berhasil input warung ${createdShop.name}`
    );
  } catch (error) {
    console.error("Kesalahan saat InputShop:", error);

    // Penanganan kesalahan unik (seperti 'owner_id' yang @unique)
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      // P2002: unique constraint failed
      return errorResponse("ID Pemilik sudah terdaftar di warung lain.");
    }

    return errorResponse("Terjadi kesalahan yang tidak terduga.");
  }
}
