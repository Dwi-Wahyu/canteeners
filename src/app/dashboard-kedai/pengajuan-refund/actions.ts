"use server";

import { errorResponse, successResponse } from "@/helper/action-helpers";
import { prisma } from "@/lib/prisma";
import { LocalStorageService } from "@/services/storage-services";
import { ServerActionReturn } from "@/types/server-action";
import { revalidatePath } from "next/cache";

export async function uploadDisbursementProofImage(file: File) {
  const storageService = new LocalStorageService();

  const disbursementProofImageUrl = await storageService.uploadImage(
    file,
    "disbursement-proof"
  );

  return disbursementProofImageUrl;
}

export async function TolakRefund({
  id,
  rejected_reason,
}: {
  id: string;
  rejected_reason: string;
}): Promise<ServerActionReturn<void>> {
  try {
    await prisma.refund.update({
      where: {
        id,
      },
      data: {
        status: "REJECTED",
        rejected_reason,
      },
    });

    revalidatePath("/dashboard-kedai/pengajuan-refund/" + id);
    revalidatePath("/dashboard-pelanggan/pengajuan-refund/" + id);

    return successResponse(undefined, "Sukses tolak refund");
  } catch (error) {
    console.log(error);

    return errorResponse("Terjadi kesalahan");
  }
}

export async function SetujuiRefund({
  id,
}: {
  id: string;
}): Promise<ServerActionReturn<void>> {
  try {
    await prisma.refund.update({
      where: {
        id,
      },
      data: {
        status: "APPROVED",
      },
    });

    revalidatePath("/dashboard-kedai/pengajuan-refund/" + id);
    revalidatePath("/dashboard-pelanggan/pengajuan-refund/" + id);

    return successResponse(undefined, "Sukses setujui refund");
  } catch (error) {
    console.log(error);

    return errorResponse("Terjadi kesalahan");
  }
}

export async function SendDisbursementProof({
  disbursement_proof_url,
  id,
}: {
  id: string;
  disbursement_proof_url: string;
}): Promise<ServerActionReturn<void>> {
  try {
    await prisma.refund.update({
      where: {
        id,
      },
      data: {
        disbursement_proof_url,
      },
    });

    revalidatePath("/dashboard-kedai/pengajuan-refund/" + id);
    revalidatePath("/dashboard-pelanggan/pengajuan-refund/" + id);

    return successResponse(undefined, "Sukses setujui refund");
  } catch (error) {
    console.log(error);

    return errorResponse("Terjadi kesalahan");
  }
}
