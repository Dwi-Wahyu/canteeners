"use server";

import { errorResponse, successResponse } from "@/helper/action-helpers";
import { ServerActionReturn } from "@/types/server-action";
import { InputPaymentSchemaType } from "@/validations/schemas/shop";

export async function addPaymentMethodToShop(
  payload: InputPaymentSchemaType
): Promise<ServerActionReturn<void>> {
  try {
    return successResponse(undefined, "Sukses menambahkan metode pembayaran");
  } catch (error) {
    return errorResponse("Terjadi kesalahan");
  }
}
