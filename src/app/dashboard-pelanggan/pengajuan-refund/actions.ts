"use server";

import { errorResponse, successResponse } from "@/helper/action-helpers";
import { prisma } from "@/lib/prisma";
import { ServerActionReturn } from "@/types/server-action";
import { revalidatePath } from "next/cache";

export async function ConfirmRefundDisbursement(
  id: string
): Promise<ServerActionReturn<void>> {
  try {
    await prisma.refund.update({
      where: {
        id,
      },
      data: {
        status: "PROCESSED",
      },
    });

    revalidatePath("/dashboard-kedai/pengajuan-refund/" + id);
    revalidatePath("/dashboard-pelanggan/pengajuan-refund/" + id);

    return successResponse(undefined, "Sukses konfirmasi pengembalian dana");
  } catch (error) {
    console.log(error);

    return errorResponse("Terjadi kesalahan konfirmasi pengembalian dana");
  }
}
